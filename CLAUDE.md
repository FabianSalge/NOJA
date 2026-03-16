# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NOJA is a creative marketing agency website — a React SPA built with Vite, TypeScript, and Tailwind CSS. Content is managed via Contentful (headless CMS). The site is bilingual (English/German).

## Commands

```bash
npm run dev       # Start dev server at localhost:8080
npm run build     # TypeScript check + Vite build + sitemap generation
npm run preview   # Preview production build locally
npm run lint      # ESLint (strict: zero warnings allowed)
npm run sitemap   # Regenerate sitemap.xml from Contentful projects
```

No test framework is configured.

## Architecture

**Stack**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui (Radix primitives)

**Routing**: React Router v6 with BrowserRouter. All pages are lazy-loaded (`React.lazy`) with idle-time prefetching. Routes are defined in `src/routes.tsx`. Add new routes above the catch-all `*` route.

**Provider hierarchy** (in `src/App.tsx`):
QueryClientProvider → HelmetProvider → LanguageProvider → TooltipProvider → BrowserRouter

**CMS (Contentful)**:
- Client setup in `src/lib/contentful.ts` with lazy initialization and a SWR-style in-memory cache
- Data fetching functions in `src/lib/cms.ts`, types in `src/lib/cms.types.ts`
- Content types: homePage, project, projectsPageSettings, aboutPageSettings, servicesPage
- Rich text rendered via `@contentful/rich-text-react-renderer`
- If Contentful env vars are missing, the app shows a maintenance page instead of crashing

**i18n**: Custom React Context in `src/i18n/`. Translations live in `src/i18n/en.ts` and `src/i18n/de.ts`. Access via `useTranslation()` hook which provides `language`, `t`, `setLanguage`, `toggleLanguage`. Language persists in localStorage (`noja-language`).

**Styling**: Tailwind with custom design tokens (HSL CSS variables in `src/index.css`). Font: Syne. UI primitives from shadcn/ui in `src/components/ui/`. Animations use both Tailwind Animate and Framer Motion.

**SEO**: Per-page meta tags via react-helmet-async. JSON-LD structured data in `src/components/SEOJsonLd.tsx`. Sitemap auto-generated post-build from Contentful project entries.

**Analytics**: GA4 loads conditionally when `VITE_GA_ID` is set and user has given cookie consent. Consent state managed by `src/hooks/use-consent.ts` and `src/components/CookieConsent.tsx`.

## Environment Variables

All prefixed with `VITE_` (accessed via `import.meta.env`):

- `VITE_CONTENTFUL_SPACE_ID` — required
- `VITE_CONTENTFUL_ACCESS_TOKEN` — required (delivery)
- `VITE_CONTENTFUL_PREVIEW_ACCESS_TOKEN` — optional (preview API)
- `VITE_CONTENTFUL_ENVIRONMENT` — defaults to "master"
- `VITE_CONTENTFUL_USE_PREVIEW` — "true" to use preview API
- `VITE_FORMSPREE_ID` — contact form submission endpoint
- `VITE_SITE_URL` — production URL for canonical links and sitemap
- `VITE_GA_ID` — Google Analytics 4 measurement ID
- `VITE_GSC_VERIFICATION` — Google Search Console verification token

## Path Alias

`@/*` maps to `./src/*` (configured in both vite.config.ts and tsconfig).

## Brand Guidelines

- Colors: warm beige `#E1D0C1`, off-white `#FBF8F6`, light gray `#F4F4F5`, dark `#202020`
- Font: Syne (Bold for titles in ALL CAPS, Regular for body text)
- Logos: `public/Logos/NJ_white.png` (primary), `public/Logos/Noja_Productions.png`

## Deployment

Deployed on Vercel. SPA rewrites configured in `vercel.json` (`/* → /index.html`). Build output goes to `dist/`.
