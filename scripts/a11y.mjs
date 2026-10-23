import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const root = join(process.cwd(), 'dist');
const port = Number(process.env.A11Y_PORT || 4173);

const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.ttf': 'font/ttf',
    '.woff2': 'font/woff2',
    '.xml': 'application/xml',
    '.json': 'application/json',
    '.txt': 'text/plain; charset=utf-8',
    '.webmanifest': 'application/manifest+json',
};

function fileFor(pathname) {
    const decoded = decodeURIComponent(pathname);
    const direct = normalize(join(root, decoded.replace(/^\//, '')));
    const inside = direct === root || direct.startsWith(root + sep);
    if (!inside) {
        return null;
    }
    if (existsSync(direct) && statSync(direct).isFile()) {
        return direct;
    }
    const trimmed = decoded.replace(/\/+$/, '') || '/';
    const candidates =
        trimmed === '/404'
            ? [join(root, '404.html')]
            : trimmed === '/'
              ? [join(root, 'index.html')]
              : [
                    join(root, trimmed.slice(1), 'index.html'),
                    join(root, `${trimmed.slice(1)}.html`),
                ];
    for (const candidate of candidates) {
        const resolved = normalize(candidate);
        if (!resolved.startsWith(root + sep) && resolved !== root) {
            continue;
        }
        if (existsSync(resolved) && statSync(resolved).isFile()) {
            return resolved;
        }
    }
    return null;
}

function firstSlug(section) {
    const dir = join(root, section);
    if (!existsSync(dir)) {
        return null;
    }
    const entry = readdirSync(dir, { withFileTypes: true }).find((item) => item.isDirectory());
    return entry ? `/${section}/${entry.name}/` : null;
}

function listen() {
    const server = createServer((request, response) => {
        const pathname = new URL(request.url || '/', 'http://127.0.0.1').pathname;
        const file = fileFor(pathname);
        if (!file) {
            response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
            response.end('Not found');
            return;
        }
        response.writeHead(200, {
            'content-type': types[extname(file)] || 'application/octet-stream',
        });
        createReadStream(file).pipe(response);
    });
    return new Promise((resolve) => {
        server.listen(port, '127.0.0.1', () => resolve(server));
    });
}

function headingProblems(levels) {
    const problems = [];
    const h1Count = levels.filter((level) => level === 1).length;
    if (h1Count !== 1) {
        problems.push(`expected exactly one h1, found ${h1Count}`);
    }
    let previous = 0;
    for (const level of levels) {
        if (previous !== 0 && level > previous + 1) {
            problems.push(`heading level jumps from h${previous} to h${level}`);
            break;
        }
        previous = level;
    }
    return problems;
}

if (!existsSync(join(root, 'index.html'))) {
    console.error('dist/index.html is missing. Run npm run build before npm run test:a11y.');
    process.exit(1);
}

const paths = [
    '/',
    '/servicios/',
    '/quienes-somos/',
    '/equipo/',
    firstSlug('equipo'),
    '/blog/',
    firstSlug('blog'),
    '/contacto/',
    '/gracias/',
    '/error/',
    '/404/',
    '/design-system/',
].filter(Boolean);

const themePasses = [
    { name: 'dark', theme: 'dark', contrast: '' },
    { name: 'high-contrast', theme: 'light', contrast: 'high' },
    { name: 'high-contrast-dark', theme: 'dark', contrast: 'high' },
];
const themePaths = new Set(['/', '/contacto/', '/design-system/']);

const server = await listen();
const browser = await chromium.launch();
const failures = [];

try {
    const context = await browser.newContext({ colorScheme: 'light' });
    const page = await context.newPage();
    for (const path of paths) {
        const url = `http://127.0.0.1:${port}${path}`;
        const response = await page.goto(url, { waitUntil: 'networkidle' });
        if (!response || response.status() >= 400) {
            failures.push(`${path}: HTTP ${response ? response.status() : 'no response'}`);
            continue;
        }

        const levels = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((nodes) =>
            nodes
                .filter((node) => {
                    if (node.closest('[hidden], [inert]')) {
                        return false;
                    }
                    const style = getComputedStyle(node);
                    return style.display !== 'none' && style.visibility !== 'hidden';
                })
                .map((node) => Number(node.tagName.slice(1)))
        );
        for (const problem of headingProblems(levels)) {
            failures.push(`${path}: ${problem} (${levels.map((level) => `h${level}`).join(' ')})`);
        }

        const landmarks = await page.evaluate(() => ({
            skip: Boolean(document.querySelector('a.skip-link[href="#contenido"]')),
            main: Boolean(document.querySelector('main#contenido')),
            nav: Boolean(document.querySelector('nav[aria-label]')),
            settingsInert:
                document.querySelector('#settings-content')?.hasAttribute('inert') ?? false,
        }));
        if (!landmarks.skip || !landmarks.main || !landmarks.nav || !landmarks.settingsInert) {
            failures.push(
                `${path}: missing landmark or closed settings panel is not inert (${JSON.stringify(landmarks)})`
            );
        }

        const report = async (label) => {
            const results = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
                .analyze();
            for (const violation of results.violations) {
                const nodes = violation.nodes
                    .slice(0, 3)
                    .map((node) => node.target.join(' '))
                    .join(' | ');
                failures.push(
                    `${label}: ${violation.id} (${violation.impact}) ${violation.help} — ${nodes}`
                );
            }
            console.log(`${label}: ${results.violations.length} axe violations`);
            return results.violations.length;
        };

        await report(path);
        console.log(`${path}: headings ${levels.join('.')}`);

        if (themePaths.has(path)) {
            for (const pass of themePasses) {
                await page.evaluate(({ theme, contrast }) => {
                    document.documentElement.dataset.theme = theme;
                    document.documentElement.dataset.themeMode = theme;
                    if (contrast) {
                        document.documentElement.dataset.contrast = contrast;
                    } else {
                        delete document.documentElement.dataset.contrast;
                    }
                }, pass);
                await report(`${path} [${pass.name}]`);
            }
        }
    }
} finally {
    await browser.close();
    await new Promise((resolve) => server.close(resolve));
}

if (failures.length > 0) {
    console.error(`\n${failures.length} accessibility failure(s):`);
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log(`\nAccessibility checks passed for ${paths.length} pages.`);
