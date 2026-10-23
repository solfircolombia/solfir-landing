import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Portable default: Node standalone serves the prerendered site and the
// on-demand contact endpoint. Swap the adapter without changing pages:
//   import netlify from '@astrojs/netlify';
//   adapter: netlify(),
//   import vercel from '@astrojs/vercel';
//   adapter: vercel(),
const adapter = node({ mode: 'standalone' });

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
    adapter,
    trailingSlash: 'always',
    // Astro 5 only trusts the Host header when it matches allowedDomains.
    // Without this, on-demand form posts are checked against http://localhost
    // and browsers get a 403. Include the public host and local dev hosts.
    security: {
        checkOrigin: true,
        allowedDomains: [
            { hostname: siteHostname },
            { hostname: `www.${siteHostname}` },
            { hostname: 'localhost' },
            { hostname: '127.0.0.1' },
        ],
    },
    integrations: [
        sitemap({
            filter: (page) => !page.includes('/404'),
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
