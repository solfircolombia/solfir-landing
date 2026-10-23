# SOLFIR Colombia

Landing site for [SOLFIR](https://solfir.com.co): insolvencia, reorganización y servicios financieros. The site is a static Astro build that reads Contentful at build time. The contact form is the only on-demand route.

## Stack

- Node.js 24 (current LTS). See `.nvmrc`.
- Astro 5, TypeScript strict (`astro check`)
- Tailwind CSS 4 (design tokens in `src/styles/global.css`)
- Contentful Delivery API
- SendGrid dynamic templates for the contact form

## Setup

```bash
nvm use
npm install
cp .env.example .env
```

Fill in `.env`. Never commit it. Placeholder names live in `.env.example` only.

| Variable                               | Required                             | When it is read | Purpose                                                    |
| -------------------------------------- | ------------------------------------ | --------------- | ---------------------------------------------------------- |
| `CONTENTFUL_SPACE_ID`                  | yes                                  | build           | Contentful space                                           |
| `CONTENTFUL_ACCESS_TOKEN`              | yes                                  | build           | Delivery API token                                         |
| `CONTENTFUL_ENVIRONMENT`               | no (default `master`)                | build           | Contentful environment                                     |
| `PUBLIC_SITE_URL`                      | no (default `https://solfir.com.co`) | build           | Canonical URL, sitemap, Open Graph                         |
| `MAINTENANCE`                          | no (default `false`)                 | build           | `true` replaces the site with the maintenance screen       |
| `PUBLIC_GA_MEASUREMENT_ID`             | no                                   | build           | GA4 measurement id. Analytics stay off when this is empty  |
| `SENDGRID_API_KEY`                     | for the form                         | request         | SendGrid API key                                           |
| `SENDGRID_AUTHORIZED_DOMAIN_EMAIL`     | for the form                         | request         | Verified sender. Falls back to `SENDGRID_AUTHORIZED_EMAIL` |
| `SENDGRID_AUTHORIZED_EMAIL`            | optional                             | request         | Alternate verified sender                                  |
| `SOLFIR_CONTACT_REQUEST_EMAIL`         | for the form                         | request         | Inbox that receives contact requests                       |
| `SENDGRID_CONTACT_REQUEST_TEMPLATE_ID` | for the form                         | request         | Dynamic template id                                        |

The Contentful token that used to be hardcoded in `gatsby-config.ts` is public in git history. Rotate it in Contentful and put the new token only in the host’s environment.

`PUBLIC_GA_MEASUREMENT_ID` and `MAINTENANCE` are baked in at build time because pages are prerendered. Change them and rebuild. SendGrid variables are read when the contact endpoint runs, so they can be set on the server without rebuilding the pages.

## Scripts

```bash
npm run dev        # http://localhost:4321
npm run check      # astro check (strict TypeScript)
npm run build      # production build
npm run preview    # serve the production build
npm run format:check
npm run format:write
```

Prettier runs on commit through husky and lint-staged.

## Content

Contentful content types used at build time:

- `blogPost` — `/blog/` and `/blog/<slug>/`
- `service` — home (first three) and `/servicios/`
- `teamMember` — `/equipo/` and `/equipo/<slug>/`, ordered by `position`
- `media` — loaded on the home page so the model stays part of the build. No current page renders these entries; the previous site did not either.

Blog and service lists follow Contentful’s last-updated order, which matches the previous site. Rich text is rendered from the Contentful document (paragraphs, headings, bold). There are no MDX files, so MDX is not installed.

## Routes

| Path                             | Notes                               |
| -------------------------------- | ----------------------------------- |
| `/`                              | Home                                |
| `/servicios/`                    | Service cards and detail modal      |
| `/quienes-somos/`                | About                               |
| `/equipo/` and `/equipo/<slug>/` | Team                                |
| `/blog/` and `/blog/<slug>/`     | Blog                                |
| `/contacto/`                     | Form posts to `/api/sendgrid/`      |
| `/gracias/`                      | Success                             |
| `/error/`                        | Send failure or missing form config |
| `/404`                           | Unknown URLs                        |

Trailing slashes match the current production URLs. `/api/sendgrid/` is not prerendered (`export const prerender = false`). The form posts to the trailing-slash path so the request is not redirected before the body is read. A successful post redirects to `/gracias/`; a failed send redirects to `/error/`. If the SendGrid template id is missing, the endpoint returns JSON `{ "message": "TEMPLATE_ID not defined" }`. `GET` returns `405`.

## Images, SEO, fonts

Remote Contentful images are optimized with Astro `<Picture>` (AVIF and WebP, widths up to the original Gatsby breakpoints). The favicon, web manifest, and social image live in `public/`. Each page sets Spanish `lang`, a title, description, canonical URL, Open Graph, and Twitter tags. `@astrojs/sitemap` writes the sitemap. Google Analytics loads only when `PUBLIC_GA_MEASUREMENT_ID` is set.

Custom fonts from `public/fonts` are Champagne & Limousines (the UI face) and Modern20. Design colors, type scale, shadows, and breakpoints are declared in the Tailwind 4 `@theme` block in `src/styles/global.css`. The component rules in `src/styles/site.css` are the previous stylesheet, still driven by the `--primary`, `--secondary`, `--tertiary`, `--dark`, and `--light` variables that the settings panel updates.

## Deploy

The default adapter is `@astrojs/node` in `standalone` mode. It serves the prerendered files and the contact endpoint in one process:

```bash
npm run build
HOST=0.0.0.0 PORT=4321 node --env-file=.env ./dist/server/entry.mjs
```

`node` does not load `.env` by itself. On a host, set the variables in the process environment (or pass `--env-file`). Contentful variables are used only while `astro build` prerenders pages. SendGrid variables are read when `/api/sendgrid/` handles a request. `PUBLIC_GA_MEASUREMENT_ID` and `MAINTENANCE` are inlined at build time.

The current production site is served by Netlify. This repo uses the Node adapter because the next host is not fixed. To move to Netlify or Vercel, change the adapter import in `astro.config.mjs` and install that adapter. Pages and the contact route stay the same. A static-only host will not run the contact endpoint.

```js
import netlify from '@astrojs/netlify';
// adapter: netlify(),
```

```js
import vercel from '@astrojs/vercel';
// adapter: vercel(),
```

A purely static host that only uploads HTML will not run `/api/sendgrid/`.

Astro checks the `Origin` header on that post. The Node server only trusts the incoming `Host` when it is listed in `security.allowedDomains` in `astro.config.mjs` (the public site host, `www`, `localhost`, and `127.0.0.1`). Behind a reverse proxy, forward `X-Forwarded-Proto` and `X-Forwarded-Host` (or `Host`) for the public URL. Otherwise the browser’s origin will not match and the form returns 403.
