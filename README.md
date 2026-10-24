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
npm run test:a11y  # axe (WCAG 2.2 AA) against the built pages
npm run format:check
npm run format:write
```

Prettier runs on commit through husky and lint-staged.

`npm run test:a11y` needs a finished `dist/`. It serves that build and checks the main pages with `@axe-core/playwright` (WCAG 2.2 AA) and a heading outline check. The same job runs on pull requests from `.github/workflows/a11y.yml`. That workflow needs `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN` in the repository secrets so the build can read Contentful.

## Content

Contentful content types used at build time:

- `blogPost` — `/blog/` and `/blog/<slug>/`
- `service` — home (first three), `/servicios/`, and `/servicios/<slug>/`
- `teamMember` — `/equipo/` and `/equipo/<slug>/`, ordered by `position`
- `media` — loaded on the home page so the model stays part of the build. No current page renders these entries; the previous site did not either.
- `homePage` — the home hero. The build reads the first published entry (`limit=1`). Empty fields fall back to the hardcoded headline, the button “Quiero saber más”, and the local photo in `src/assets/hero/`.

`homePage` fields for editors:

| Field                                          | Required | Notes                                                                                                                                                                                                               |
| ---------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `internalName`                                 | yes      | Internal label. Not rendered.                                                                                                                                                                                       |
| `heroEyebrow`                                  | no       | Short line above the title.                                                                                                                                                                                         |
| `heroTitle`                                    | yes      | Headline. Text wrapped in `**double asterisks**` renders as the bold SOLFIR treatment. Anything else is escaped; HTML is not interpreted. If the title has no `**` markers, the word `SOLFIR` is bolded on its own. |
| `heroSubtitle`                                 | no       | Paragraph under the title.                                                                                                                                                                                          |
| `heroImage`                                    | no       | Decorative photo (`alt=""`). Optimized at build time. The credit is the asset title after `Foto:`. If that text is missing, the asset description is used. If both are empty, the credit is hidden.                 |
| `heroImagePosition`                            | no       | `left`, `center`, or `right`. Maps to `object-position`.                                                                                                                                                            |
| `heroPrimaryCtaLabel`, `heroPrimaryCtaUrl`     | no       | Primary button. Empty values use “Quiero saber más” and `#landing-services`.                                                                                                                                        |
| `heroSecondaryCtaLabel`, `heroSecondaryCtaUrl` | no       | Second button. Omitted when either value is empty.                                                                                                                                                                  |

Service photos use the Contentful asset description as the image alt text. The same image is shown on the home service cards and on `/servicios/`. The same notes are on `/design-system/`.

Blog and service lists follow Contentful’s last-updated order, which matches the previous site. Rich text is rendered from the Contentful document (paragraphs, headings, bold). There are no MDX files, so MDX is not installed.

## Routes

| Path                                   | Notes                                  |
| -------------------------------------- | -------------------------------------- |
| `/`                                    | Home                                   |
| `/servicios/` and `/servicios/<slug>/` | Service index and one page per service |
| `/quienes-somos/`                      | About                                  |
| `/equipo/` and `/equipo/<slug>/`       | Team                                   |
| `/blog/` and `/blog/<slug>/`           | Blog                                   |
| `/contacto/`                           | Form posts to `/api/sendgrid/`         |
| `/gracias/`                            | Success                                |
| `/error/`                              | Send failure or missing form config    |
| `/404`                                 | Unknown URLs                           |

Trailing slashes match the current production URLs. `/api/sendgrid/` is not prerendered (`export const prerender = false`). The form posts to the trailing-slash path so the request is not redirected before the body is read. A successful post redirects to `/gracias/`; a failed send redirects to `/error/`. If the SendGrid template id is missing, the endpoint returns JSON `{ "message": "TEMPLATE_ID not defined" }`. `GET` returns `405`.

## Images, SEO, fonts

Remote Contentful images are optimized with Astro `<Picture>` (AVIF and WebP, widths up to the original Gatsby breakpoints). The home hero uses the same pipeline: responsive widths, AVIF and WebP, eager loading, and high fetch priority. The favicon, web manifest, and social image live in `public/`. Each page sets Spanish `lang`, a title, description, canonical URL, Open Graph, and Twitter tags. `@astrojs/sitemap` writes the sitemap. Google Analytics loads only when `PUBLIC_GA_MEASUREMENT_ID` is set.

UI text uses self-hosted variable fonts: Plus Jakarta Sans for body and interface, Literata for display headings (`@fontsource-variable`, `font-display: swap`, Georgia as the display fallback). Only the latin weight files are preloaded. The wordmark is an SVG.

Design tokens live in `src/styles/tokens.css` (primitive, semantic, component) and are wired into Tailwind 4 with `@theme inline`. Light, dark, and high-contrast themes use `data-theme` and `data-contrast`. The settings panel stores the theme, text size, and high-contrast choice in `localStorage`. An inline script in the document head applies them before paint. Components in `src/styles/components.css` and Tailwind utilities on the Astro components consume those tokens. The legacy `site.css` stylesheet has been removed.

`/design-system/` documents the tokens and the component library. It is `noindex` and excluded from the sitemap.

## Deploy

The site is hosted on Netlify. `@astrojs/netlify` prerenders every page and publishes the contact route as a Netlify Function. `netlify.toml` sets the build:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "24"
```

Connect the repository in the Netlify UI and leave the build command and publish directory on those values. Node 24 matches `.nvmrc`.

In **Site configuration → Environment variables**, add the variables from the table above. Scope them like this:

| Variable                               | Netlify scope |
| -------------------------------------- | ------------- |
| `CONTENTFUL_SPACE_ID`                  | Builds        |
| `CONTENTFUL_ACCESS_TOKEN`              | Builds        |
| `CONTENTFUL_ENVIRONMENT`               | Builds        |
| `PUBLIC_SITE_URL`                      | Builds        |
| `MAINTENANCE`                          | Builds        |
| `PUBLIC_GA_MEASUREMENT_ID`             | Builds        |
| `SENDGRID_API_KEY`                     | Functions     |
| `SENDGRID_AUTHORIZED_DOMAIN_EMAIL`     | Functions     |
| `SENDGRID_AUTHORIZED_EMAIL`            | Functions     |
| `SOLFIR_CONTACT_REQUEST_EMAIL`         | Functions     |
| `SENDGRID_CONTACT_REQUEST_TEMPLATE_ID` | Functions     |

Build-scoped values are inlined or read while `astro build` prerenders the pages. Function-scoped values are read when `/api/sendgrid/` handles a request, so SendGrid can change without rebuilding the HTML. Mark the Contentful token and every SendGrid value as secret. Use a new Contentful delivery token; the one that used to live in `gatsby-config.ts` is in git history and must be rotated.

`npm run preview` serves the production build locally, including the contact function. Static pages are written to `dist/`. The on-demand contact route is bundled as a Netlify Function at `.netlify/v1/functions/ssr/` (`preferStatic`, so existing HTML is served as files and `/api/sendgrid/` is handled by the function). Contentful images stay on Astro’s build-time image pipeline (`imageCDN: false`), not Netlify Image CDN.

Astro checks the `Origin` header on the form post. `security.allowedDomains` in `astro.config.mjs` allows the public site host, `www`, `*.netlify.app` (production subdomain, deploy previews, and branch deploys), `localhost`, and `127.0.0.1`. A post from any other origin returns 403.
