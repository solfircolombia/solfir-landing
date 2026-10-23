import { defineConfig, envField } from 'astro/config';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.PUBLIC_SITE_URL || 'https://solfir.com.co';
const siteHostname = (() => {
    try {
        return new URL(site).hostname;
    } catch {
        return 'solfir.com.co';
    }
})();

export default defineConfig({
    site,
    output: 'static',
    // imageCDN stays off so Contentful images are still optimized at build time
    // with Astro's sharp pipeline (AVIF and WebP in dist/).
    adapter: netlify({ imageCDN: false }),
    trailingSlash: 'always',
    // Astro trusts the request host only when it matches this list. Netlify
    // preview and branch deploys use *.netlify.app; production uses the public host.
    security: {
        checkOrigin: true,
        allowedDomains: [
            { hostname: siteHostname },
            { hostname: `www.${siteHostname}` },
            { hostname: '**.netlify.app' },
            { hostname: 'localhost' },
            { hostname: '127.0.0.1' },
        ],
    },
    integrations: [
        sitemap({
            filter: (page) => !page.includes('/404') && !page.includes('/design-system'),
        }),
    ],
    image: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.ctfassets.net',
            },
        ],
    },
    vite: {
        plugins: [tailwindcss()],
    },
    env: {
        schema: {
            // Contentful credentials are read from process.env in src/lib/contentful.ts
            // during the static build. They are intentionally not schema secrets:
            // a required secret would be validated again when /api/sendgrid runs.
            SENDGRID_API_KEY: envField.string({
                context: 'server',
                access: 'secret',
                optional: true,
            }),
            SENDGRID_AUTHORIZED_DOMAIN_EMAIL: envField.string({
                context: 'server',
                access: 'secret',
                optional: true,
            }),
            SENDGRID_AUTHORIZED_EMAIL: envField.string({
                context: 'server',
                access: 'secret',
                optional: true,
            }),
            SOLFIR_CONTACT_REQUEST_EMAIL: envField.string({
                context: 'server',
                access: 'secret',
                optional: true,
            }),
            SENDGRID_CONTACT_REQUEST_TEMPLATE_ID: envField.string({
                context: 'server',
                access: 'secret',
                optional: true,
            }),
            PUBLIC_GA_MEASUREMENT_ID: envField.string({
                context: 'client',
                access: 'public',
                optional: true,
            }),
            MAINTENANCE: envField.boolean({
                context: 'server',
                access: 'public',
                default: false,
            }),
        },
    },
});
