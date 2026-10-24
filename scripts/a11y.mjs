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
    firstSlug('servicios'),
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

    const headerThemes = [
        { name: 'light', theme: 'light', contrast: 'default' },
        { name: 'dark', theme: 'dark', contrast: 'default' },
        { name: 'high-contrast', theme: 'light', contrast: 'high' },
    ];
    for (const textSize of ['lg', 'xl']) {
        for (const width of [1280, 1024]) {
            for (const pass of headerThemes) {
            const headerContext = await browser.newContext({
                viewport: { width, height: 900 },
                colorScheme: 'light',
            });
            await headerContext.addInitScript((prefs) => {
                localStorage.setItem('solfir-text-size', prefs.textSize);
                localStorage.setItem('solfir-theme', prefs.theme);
                localStorage.setItem('solfir-contrast', prefs.contrast);
            }, { ...pass, textSize });
            const headerPage = await headerContext.newPage();
            const label = `header ${textSize} ${width}px ${pass.name}`;
            await headerPage.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
            await headerPage.waitForTimeout(300);
            const fit = await headerPage.evaluate(() => {
                const root = document.documentElement;
                const header = document.querySelector('.header');
                const toggle = document.querySelector('#nav-toggle');
                if (!header || !toggle) {
                    return { missing: true };
                }
                const headerBox = header.getBoundingClientRect();
                const links = Array.from(document.querySelectorAll('.header-links-item')).filter(
                    (item) => getComputedStyle(item).display !== 'none' && item.getClientRects().length > 0
                );
                const rects = links.map((item) => item.getBoundingClientRect());
                const clipped = rects.filter(
                    (rect) =>
                        rect.left < headerBox.left - 0.5 ||
                        rect.right > headerBox.right + 0.5 ||
                        rect.top < headerBox.top - 0.5 ||
                        rect.bottom > headerBox.bottom + 0.5
                ).length;
                const ordered = [...rects].sort((a, b) => a.left - b.left);
                const overlap = ordered.some((rect, index) => {
                    const previous = ordered[index - 1];
                    return previous && rect.top < previous.bottom - 1 && rect.left < previous.right - 1;
                });
                const toggleStyle = getComputedStyle(toggle);
                const toggleBox = toggle.getBoundingClientRect();
                const toggleVisible = toggleStyle.display !== 'none' && toggleBox.width > 0;
                return {
                    missing: false,
                    textSize: root.dataset.textSize,
                    nav: root.dataset.nav || 'inline',
                    scroll: root.scrollWidth - root.clientWidth,
                    clipped,
                    overlap,
                    linkCount: links.length,
                    linkMin: rects.reduce((min, rect) => Math.min(min, rect.width, rect.height), 999),
                    toggleVisible,
                    toggleExpanded: toggle.getAttribute('aria-expanded'),
                    toggleControls: toggle.getAttribute('aria-controls'),
                    toggleW: toggleBox.width,
                    toggleH: toggleBox.height,
                };
            });
            if (fit.missing) {
                failures.push(`${label}: header or toggle missing`);
            } else if (fit.textSize !== textSize) {
                failures.push(`${label}: text size is ${fit.textSize}`);
            } else if (fit.scroll > 1) {
                failures.push(`${label}: horizontal scroll ${fit.scroll}px`);
            } else if (fit.clipped || fit.overlap) {
                failures.push(`${label}: nav clipped=${fit.clipped} overlap=${fit.overlap}`);
            } else if (fit.toggleExpanded !== 'false') {
                failures.push(`${label}: aria-expanded is ${fit.toggleExpanded}`);
            } else if (fit.toggleControls !== 'nav-modal') {
                failures.push(`${label}: aria-controls is ${fit.toggleControls}`);
            } else if (fit.linkCount === 0 && !fit.toggleVisible) {
                failures.push(`${label}: compact nav has no visible toggle`);
            } else if (fit.linkCount > 0 && fit.linkMin < 43.5) {
                failures.push(`${label}: nav target is ${fit.linkMin}px`);
            } else if (fit.toggleVisible && (fit.toggleW < 44 || fit.toggleH < 44)) {
                failures.push(`${label}: toggle is ${fit.toggleW}x${fit.toggleH}`);
            } else {
                console.log(
                    `${label}: nav=${fit.nav} links=${fit.linkCount} toggle=${fit.toggleVisible}`
                );
            }
            await headerContext.close();
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
