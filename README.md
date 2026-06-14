# NOJA — Creative Agency Website

> Bilingual marketing site for **NOJA**, a Swiss creative & content-production
> agency. Built as a content-driven React SPA backed by a headless CMS.

🔗 **Live:** TODO: <live-url>

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)
![Contentful](https://img.shields.io/badge/CMS-Contentful-2478CC?logo=contentful&logoColor=white)

## Overview

NOJA is a Swiss creative agency. This is its real production marketing website:
a fully responsive, bilingual (English / German) single-page application whose
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
- **Bilingual (EN/DE)** — a custom React i18n context with `localStorage`
  persistence; no heavyweight i18n dependency.
- **SEO** — per-page titles/meta/canonicals via `@dr.pogodin/react-helmet`,
  JSON-LD structured data (Organization, Services, Project breadcrumbs/details),
  and a sitemap auto-generated from CMS entries after every build.
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
- **Graceful degradation** — if CMS credentials are missing, the app serves a
  maintenance page instead of crashing.
- **Quality gate** — CI runs lint (zero-warning policy) and build on every PR;
  Dependabot keeps dependencies current.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS · shadcn/ui (Radix primitives) ·
Framer Motion · TanStack Query · `@dr.pogodin/react-helmet` · Contentful.

## Architecture

A React Router v6 SPA. Providers are layered
`QueryClientProvider → HelmetProvider → LanguageProvider → TooltipProvider →
BrowserRouter`. CMS access is isolated in `src/lib/contentful.ts` (client +
cache) and `src/lib/cms.ts` (typed fetchers); UI never talks to Contentful
directly. The i18n context lives in `src/i18n/`, and SEO concerns are centralised
in dedicated components. Routes are defined in `src/routes.tsx`.

## Local development

**Prerequisites:** Node.js 18+ and npm.

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # type-check + production build + sitemap
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
and `src/components/CookieConsent.tsx`, with a `/cookies` declaration page.

### Search Console

Add the production domain in Search Console, verify via the HTML-tag method by
setting `VITE_GSC_VERIFICATION`, then submit `/sitemap.xml`.

### Deployment

Deployed on **Vercel** (framework preset: Vite, build `npm run build`, output
`dist/`). SPA rewrites are configured in `vercel.json`. Set env vars in the
project settings and redeploy to apply.

</details>

## License

This repository is published for portfolio viewing only and is **not** licensed
for reuse. See [LICENSE](./LICENSE).
