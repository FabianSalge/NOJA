# NOJA — Creative Agency Website

> Bilingual marketing site for **NOJA**, a Swiss creative & content-production
> agency. Built with React, prerendered in two languages and backed by Contentful.

🔗 **Live:** [nojaagency.com](https://nojaagency.com)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Contentful](https://img.shields.io/badge/CMS-Contentful-2478CC?logo=contentful&logoColor=white)

## Overview

NOJA is a Swiss creative agency. This is its real production marketing website:
a fully responsive, bilingual (English / German) website whose
content — projects, services, page copy — is managed by editors through a
headless CMS rather than hardcoded. The site is SEO-optimised, analytics-ready,
and degrades gracefully when the CMS is unreachable.

## My role

Sole developer. I owned the project end to end: architecture, the entire
frontend, the Contentful integration and content model, the bilingual i18n
layer, SEO, the CI pipeline, and deployment.

## Highlights

- **Headless CMS** — content modelled in Contentful and fetched through a
  lazily-initialised client with an SWR-style in-memory cache. Rich text is
  rendered with Contentful's React renderer.
- **Bilingual (EN/DE)** — English keeps the existing URLs; German uses `/de`.
  Crawlable language links preserve the current page. The URL determines the language.
- **SEO** — per-page titles/meta/canonicals via `@dr.pogodin/react-helmet`,
  JSON-LD structured data, complete HTML generated from published CMS content,
  reciprocal `hreflang` links and a sitemap generated from the same page set.
- **Performance** — routes are lazy-loaded with idle-time prefetching, vendors
  are split into their own chunk, and images use responsive `srcset`/lazy
  loading. Performance/a11y/SEO budgets enforced in CI via Lighthouse CI.
- **Analytics & consent** — GA4 is gated behind explicit cookie consent: the
  tracking script loads only after the visitor accepts the banner *and* a
  measurement ID is configured, with IP anonymisation on by default. Consent
  state is versioned, persisted in `localStorage`, and synced across tabs;
  cookieless Vercel Analytics/Speed Insights run unconditionally.
- **Secure token model** — the client uses a read-only Contentful delivery
  token; the management (write) token is dev-only and never bundled.
- **Build validation** — production builds require published CMS content and
  fail if it cannot be loaded. Local development retains the maintenance fallback.
- **Quality gate** — CI runs lint (zero-warning policy) and build on every PR;
  Dependabot keeps dependencies current.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · shadcn/ui (Radix primitives) ·
Framer Motion · TanStack Query · `@dr.pogodin/react-helmet` · Contentful.

## Architecture

React Router handles navigation after hydration. `src/entry-server.tsx` loads
published Contentful content for both languages and renders the same React pages
at build time. `scripts/prerender.mjs` writes HTML, per-page data snapshots,
`sitemap.xml` and `robots.txt`. The browser hydrates the matching snapshot;
subsequent client-side navigation can fetch content normally.

The client and server entry points supply the router, language, Helmet and page
data providers. CMS access remains isolated in `src/lib/contentful.ts` and
`src/lib/cms.ts`. Metadata is centralized in `src/components/PageSEO.tsx`;
routes remain in `src/routes.tsx`.

## Local development

**Prerequisites:** Node.js 24 and npm.

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # type-check + production assets + bilingual prerender + sitemap
npm run test:seo # verify generated HTML, metadata, links, sitemap and 404 config
npm run lint     # ESLint (strict: zero warnings)
```

The app needs Contentful credentials to show content — see below.

<details>
<summary><strong>Full configuration (environment variables, analytics, deployment)</strong></summary>

### Environment variables

All client variables are prefixed `VITE_` (read via `import.meta.env`):

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_CONTENTFUL_SPACE_ID` | yes | Contentful space |
| `VITE_CONTENTFUL_ACCESS_TOKEN` | yes | Delivery (read-only) token |
| `VITE_CONTENTFUL_ENVIRONMENT` | no | Defaults to `master` |
| `VITE_CONTENTFUL_PREVIEW_ACCESS_TOKEN` | no | Preview API token |
| `VITE_CONTENTFUL_USE_PREVIEW` | no | `true` to use the preview API |
| `VITE_FORMSPREE_ID` | no | Contact-form endpoint |
| `VITE_SITE_URL` | no | Production URL for canonical links / sitemap |
| `VITE_GA_ID` | no | GA4 measurement ID (`G-XXXXXXXXXX`) |
| `VITE_GSC_VERIFICATION` | no | Google Search Console verification token |

A non-`VITE_` `CONTENTFUL_MANAGEMENT_TOKEN` (write token) is used only by the
dev scripts in `scripts/cma/` and is never bundled to the client.

### Analytics (GA4)

GA4 activates only when `VITE_GA_ID` is set **and** the visitor has accepted the
cookie-consent banner — until then the tracking script never loads. Create a GA4
web stream, copy the measurement ID into `VITE_GA_ID`, and redeploy. IP
anonymisation is on by default. Consent is handled by `src/hooks/use-consent.ts`
and `src/components/CookieConsent.tsx`, with `/cookie-declaration` and `/de/cookie-declaration` pages.

### Search Console

Add the production domain in Search Console, verify via the HTML-tag method by
setting `VITE_GSC_VERIFICATION`, then submit `/sitemap.xml`.

### Deployment

Deployed on **Vercel** (framework preset: Vite, build `npm run build`, output
`dist/`). `vercel.json` uses clean static URLs and a generated `404.html`, so
unknown URLs return HTTP 404 instead of the homepage. Set the read-only CMS
environment variables in Vercel and the GitHub Actions secrets before building.
Preview-API content is rejected by production builds.

Publishing, unpublishing, deleting or changing Contentful content requires a new
build to update static HTML and the sitemap. Rebuild manually, or connect a
Contentful publication webhook to a Vercel deploy hook for the deployed branch.
No deploy hook has been configured by this change. In particular, new project
URLs will return 404 until their build is deployed. Changing a published slug
also requires a redirect from the old URL.

See `docs/plans/2026-09-13-seo-implementation.md` for validation and release notes.

</details>

## License

This repository is published for portfolio viewing only and is **not** licensed
for reuse. See [LICENSE](./LICENSE).
