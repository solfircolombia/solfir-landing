import { createReadStream, existsSync, readdirSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import sharp from 'sharp';

const root = join(process.cwd(), 'dist');
const port = Number(process.env.A11Y_PORT || 4173);
const baseUrl = (process.env.A11Y_BASE_URL || '').replace(/\/$/, '');

function pageUrl(path) {
    if (!baseUrl) {
        return `http://127.0.0.1:${port}${path}`;
    }
    return new URL(path, `${baseUrl}/`).toString();
}

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

function channel(value) {
    const normalized = value / 255;
    return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(red, green, blue) {
    return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

function contrastRatio(foreground, background) {
    const first = luminance(foreground[0], foreground[1], foreground[2]);
    const second = luminance(background[0], background[1], background[2]);
    const lighter = Math.max(first, second);
    const darker = Math.min(first, second);
    return (lighter + 0.05) / (darker + 0.05);
}

function parseColor(value) {
    const match = value.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
    if (!match) {
        return null;
    }
    return [Number(match[1]), Number(match[2]), Number(match[3])];
}

async function backgroundRange(buffer) {
    const { data, info } = await sharp(buffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
    let darkest = null;
    let lightest = null;
    let darkLum = Infinity;
    let lightLum = -1;
    for (let index = 0; index < data.length; index += info.channels) {
        const pixel = [data[index], data[index + 1], data[index + 2]];
        const level = luminance(pixel[0], pixel[1], pixel[2]);
        if (level < darkLum) {
            darkLum = level;
            darkest = pixel;
        }
        if (level > lightLum) {
            lightLum = level;
            lightest = pixel;
        }
    }
    return { darkest, lightest };
}

async function heroContrast(page) {
    const targets = [
        { name: 'title', selector: '.hero-title', minimum: 'body' },
        { name: 'solfir', selector: '.landing-banner-title-solfir', minimum: 'large' },
        { name: 'button', selector: '.hero-actions .button', minimum: 'solid' },
    ];
    const results = [];
    for (const target of targets) {
        const measured = await page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (!element) {
                return null;
            }
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            const fontSize = Number.parseFloat(style.fontSize);
            const weight = Number.parseInt(style.fontWeight, 10);
            const large = fontSize >= 24 || (weight >= 700 && fontSize >= 18.67);
            return {
                color: style.color,
                background: style.backgroundColor,
                fontSize,
                weight,
                large,
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height,
            };
        }, target.selector);
        if (!measured || measured.width < 1 || measured.height < 1) {
            results.push({ name: target.name, worst: 0, light: 0, dark: 0, large: false });
            continue;
        }
        const foreground = parseColor(measured.color);
        if (target.minimum === 'solid') {
            const background = parseColor(measured.background);
            const ratio = foreground && background ? contrastRatio(foreground, background) : 0;
            results.push({
                name: target.name,
                worst: ratio,
                light: ratio,
                dark: ratio,
                large: false,
            });
            continue;
        }
        await page.evaluate(() => {
            const settings = document.querySelector('.settings');
            if (settings) {
                settings.dataset.contrastHidden = 'true';
                settings.style.setProperty('visibility', 'hidden', 'important');
            }
            const hero = document.querySelector('.hero');
            const nodes = hero.querySelectorAll(
                '.hero-title, .hero-title *, .hero-eyebrow, .hero-subtitle'
            );
            for (const node of nodes) {
                node.style.setProperty('color', 'transparent', 'important');
                node.style.setProperty('-webkit-text-fill-color', 'transparent', 'important');
            }
        });
        const viewport = page.viewportSize();
        const clip = {
            x: Math.max(0, Math.floor(measured.x)),
            y: Math.max(0, Math.floor(measured.y)),
            width: Math.max(1, Math.floor(Math.min(measured.width, viewport.width - measured.x))),
            height: Math.max(
                1,
                Math.floor(Math.min(measured.height, viewport.height - measured.y))
            ),
        };
        const buffer = await page.screenshot({ clip, type: 'png' });
        await page.evaluate(() => {
            const settings = document.querySelector('.settings');
            if (settings?.dataset.contrastHidden) {
                settings.style.removeProperty('visibility');
                delete settings.dataset.contrastHidden;
            }
            const hero = document.querySelector('.hero');
            const nodes = hero.querySelectorAll(
                '.hero-title, .hero-title *, .hero-eyebrow, .hero-subtitle'
            );
            for (const node of nodes) {
                node.style.removeProperty('color');
                node.style.removeProperty('-webkit-text-fill-color');
            }
        });
        const range = await backgroundRange(buffer);
        const light = contrastRatio(foreground, range.lightest);
        const dark = contrastRatio(foreground, range.darkest);
        results.push({
            name: target.name,
            worst: Math.min(light, dark),
            light,
            dark,
            large: target.minimum === 'large' && measured.large,
        });
    }
    return results;
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

async function remotePaths() {
    const sitemapUrl = `${baseUrl}/sitemap-0.xml`;
    const response = await fetch(sitemapUrl);
    if (!response.ok) {
        throw new Error(`Could not read ${sitemapUrl} (HTTP ${response.status}).`);
    }
    const xml = await response.text();
    const published = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
        const pathname = new URL(match[1].trim()).pathname;
        return pathname.endsWith('/') ? pathname : `${pathname}/`;
    });
    const first = (section) =>
        published
            .filter((item) => item.startsWith(`/${section}/`) && item !== `/${section}/`)
            .sort()[0];
    return [
        '/',
        '/servicios/',
        first('servicios'),
        '/quienes-somos/',
        '/equipo/',
        first('equipo'),
        '/blog/',
        first('blog'),
        '/contacto/',
        '/gracias/',
        '/error/',
        '/404/',
        '/design-system/',
    ].filter(Boolean);
}

let paths;
if (baseUrl) {
    try {
        paths = await remotePaths();
    } catch (error) {
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
    console.log(`Checking ${baseUrl}`);
} else if (!existsSync(join(root, 'index.html'))) {
    console.error('dist/index.html is missing. Run npm run build before npm run test:a11y.');
    process.exit(1);
} else {
    paths = [
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
}

const themePasses = [
    { name: 'dark', theme: 'dark', contrast: '' },
    { name: 'high-contrast', theme: 'light', contrast: 'high' },
    { name: 'high-contrast-dark', theme: 'dark', contrast: 'high' },
];
const themePaths = new Set(['/', '/contacto/', '/design-system/']);

const server = baseUrl ? null : await listen();
const browser = await chromium.launch();
const failures = [];

try {
    const context = await browser.newContext({ colorScheme: 'light' });
    const page = await context.newPage();
    for (const path of paths) {
        const url = pageUrl(path);
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
                await headerContext.addInitScript(
                    (prefs) => {
                        localStorage.setItem('solfir-text-size', prefs.textSize);
                        localStorage.setItem('solfir-theme', prefs.theme);
                        localStorage.setItem('solfir-contrast', prefs.contrast);
                    },
                    { ...pass, textSize }
                );
                const headerPage = await headerContext.newPage();
                const label = `header ${textSize} ${width}px ${pass.name}`;
                await headerPage.goto(pageUrl('/'), { waitUntil: 'networkidle' });
                await headerPage.waitForTimeout(300);
                const fit = await headerPage.evaluate(() => {
                    const root = document.documentElement;
                    const header = document.querySelector('.header');
                    const toggle = document.querySelector('#nav-toggle');
                    if (!header || !toggle) {
                        return { missing: true };
                    }
                    const headerBox = header.getBoundingClientRect();
                    const links = Array.from(
                        document.querySelectorAll('.header-links-item')
                    ).filter(
                        (item) =>
                            getComputedStyle(item).display !== 'none' &&
                            item.getClientRects().length > 0
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
                        return (
                            previous &&
                            rect.top < previous.bottom - 1 &&
                            rect.left < previous.right - 1
                        );
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
                        linkMin: rects.reduce(
                            (min, rect) => Math.min(min, rect.width, rect.height),
                            999
                        ),
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

    const overflowContext = await browser.newContext({
        viewport: { width: 360, height: 800 },
        colorScheme: 'light',
    });
    await overflowContext.addInitScript(() => {
        localStorage.setItem('solfir-text-size', 'xl');
        localStorage.setItem('solfir-theme', 'light');
        localStorage.setItem('solfir-contrast', 'default');
    });
    const overflowPage = await overflowContext.newPage();
    for (const path of paths) {
        const label = `overflow 360px xl ${path}`;
        await overflowPage.goto(pageUrl(path), { waitUntil: 'networkidle' });
        await overflowPage.evaluate(() => document.fonts?.ready);
        const fit = await overflowPage.evaluate(() => {
            const root = document.documentElement;
            const vw = root.clientWidth;
            const offenders = [];
            for (const el of document.body.querySelectorAll('*')) {
                if (el.closest('[hidden], [inert], .settings, .skip-link')) {
                    continue;
                }
                const style = getComputedStyle(el);
                if (style.display === 'none' || style.visibility === 'hidden') {
                    continue;
                }
                const rect = el.getBoundingClientRect();
                if (rect.width < 1 || rect.height < 1) {
                    continue;
                }
                const right = rect.right - vw;
                const left = -rect.left;
                if (right > 1 || left > 1) {
                    const text = (el.textContent || el.getAttribute('aria-label') || el.tagName)
                        .replace(/\s+/g, ' ')
                        .trim()
                        .slice(0, 70);
                    offenders.push({
                        cls: String(el.className || el.tagName).slice(0, 60),
                        text,
                        right: Math.round(right),
                        left: Math.round(left),
                    });
                    if (offenders.length >= 4) {
                        break;
                    }
                }
            }
            return {
                lang: root.lang,
                textSize: root.dataset.textSize,
                scroll: root.scrollWidth - vw,
                offenders,
            };
        });
        if (fit.lang !== 'es') {
            failures.push(`${label}: html lang is ${fit.lang || 'missing'}`);
        } else if (fit.textSize !== 'xl') {
            failures.push(`${label}: text size is ${fit.textSize}`);
        } else if (fit.scroll > 1 || fit.offenders.length > 0) {
            const detail = fit.offenders
                .map((item) => `${item.cls} right=${item.right} left=${item.left} "${item.text}"`)
                .join('; ');
            failures.push(`${label}: scroll=${Math.round(fit.scroll)}px ${detail}`);
        } else {
            console.log(`${label}: no horizontal overflow`);
        }
    }
    await overflowContext.close();

    const heroCases = [
        { width: 360, theme: 'light', contrast: 'default', scheme: 'light' },
        { width: 390, theme: 'light', contrast: 'default', scheme: 'light' },
        { width: 1024, theme: 'light', contrast: 'default', scheme: 'light' },
        { width: 1280, theme: 'light', contrast: 'default', scheme: 'light' },
        { width: 360, theme: 'light', contrast: 'high', scheme: 'light' },
        { width: 390, theme: 'light', contrast: 'high', scheme: 'light' },
        { width: 1024, theme: 'light', contrast: 'high', scheme: 'light' },
        { width: 1280, theme: 'light', contrast: 'high', scheme: 'light' },
        { width: 390, theme: 'dark', contrast: 'high', scheme: 'dark' },
        { width: 1280, theme: 'dark', contrast: 'high', scheme: 'dark' },
    ];
    for (const heroCase of heroCases) {
        const heroContext = await browser.newContext({
            viewport: { width: heroCase.width, height: 900 },
            deviceScaleFactor: 1,
            colorScheme: heroCase.scheme,
        });
        await heroContext.addInitScript(`
            localStorage.setItem('solfir-theme', ${JSON.stringify(heroCase.theme)});
            localStorage.setItem('solfir-text-size', 'md');
            localStorage.setItem('solfir-contrast', ${JSON.stringify(heroCase.contrast)});
        `);
        const heroPage = await heroContext.newPage();
        const label = `hero contrast ${heroCase.theme}${heroCase.contrast === 'high' ? ' high-contrast' : ''} ${heroCase.width}px`;
        await heroPage.goto(pageUrl('/'), { waitUntil: 'networkidle' });
        await heroPage.evaluate(() => document.fonts?.ready);
        const theme = await heroPage.evaluate(() => ({
            page: document.documentElement.dataset.theme,
            contrast: document.documentElement.dataset.contrast || 'default',
            hero: document.querySelector('.hero')?.getAttribute('data-theme') || '',
            header: getComputedStyle(document.querySelector('.header')).backgroundColor,
            solfir: getComputedStyle(document.querySelector('.landing-banner-title-solfir')).color,
        }));
        const expectedSolfir =
            heroCase.contrast === 'high' && heroCase.theme === 'light'
                ? 'rgb(0, 0, 0)'
                : 'rgb(250, 177, 20)';
        const expectedHeader =
            heroCase.contrast === 'high' && heroCase.theme === 'dark'
                ? 'rgb(0, 0, 0)'
                : 'rgb(255, 255, 255)';
        if (
            theme.page !== heroCase.theme ||
            theme.contrast !== heroCase.contrast ||
            theme.hero !== 'dark' ||
            theme.solfir !== expectedSolfir ||
            theme.header !== expectedHeader
        ) {
            failures.push(
                `${label}: page=${theme.page} contrast=${theme.contrast} hero=${theme.hero} solfir=${theme.solfir} header=${theme.header}`
            );
            await heroContext.close();
            continue;
        }
        const samples = await heroContrast(heroPage);
        const problems = [];
        for (const sample of samples) {
            const minimum = sample.large ? 3 : 4.5;
            if (sample.worst < minimum) {
                problems.push(
                    `${sample.name} ${sample.worst.toFixed(2)}:1 (need ${minimum}:1, light ${sample.light.toFixed(2)}, dark ${sample.dark.toFixed(2)})`
                );
            }
        }
        if (problems.length > 0) {
            failures.push(`${label}: ${problems.join('; ')}`);
        } else {
            console.log(
                `${label}: ${samples
                    .map(
                        (sample) =>
                            `${sample.name} light ${sample.light.toFixed(2)} dark ${sample.dark.toFixed(2)}`
                    )
                    .join(', ')}`
            );
        }
        await heroContext.close();
    }
} finally {
    await browser.close();
    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }
}

if (failures.length > 0) {
    console.error(`\n${failures.length} accessibility failure(s):`);
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exit(1);
}

console.log(`\nAccessibility checks passed for ${paths.length} pages.`);
