# CMS-Driven Bilingual Content + Team-Managed Images — Design

**Date:** 2026-06-13
**Status:** Approved (design) — pending implementation plan
**Branch:** `feat/cms-bilingual-content`

## Goal

Make most substantive site text editable from Contentful in **both English and German**, and let the NOJA team manage the team cards and the "In Action" image marquee from Contentful — without re-translating content that already exists.

### In scope (moves to CMS)
Headings, body copy, eyebrows, section subtitles, team bios, values, project/service text — in both locales. Team member cards (photo + hover video + text) and the "In Action" marquee images.

### Out of scope (stays in code / `src/i18n/`)
Nav labels, footer links, contact form field labels, cookie banner, button labels, loading/error strings, route paths, `aria-label`s. Also the two global CTA taglines ("Have a project in mind?" / "We like Bold BRIEFS") stay in i18n — they are short, global, and would otherwise require a new global-settings content type. Legal/boilerplate pages unchanged.

## Background / current state

- Contentful space has **one locale only: `en-US`**. German lives entirely in `src/i18n/de.ts`.
- The app renders bilingual content via a client-side gate repeated across pages:
  `language === 'de' ? staticI18n : (cmsContent ?? i18nFallback)`.
  Examples: `Index.tsx` (`language === 'en' && home?.whatWeDoBestText`), `Projects.tsx`, `Services.tsx`, `About.tsx` (`language === 'en' ? about?.ourStoryText : undefined`). German is even hardcoded inline in `Hero.tsx` (`'CONTENT MIT PULS'`).
- CMS read path: `src/lib/contentful.ts` (lazy client + SWR cache `cachedGetEntries`), `src/lib/cms.ts` (fetch/transform), `src/lib/cms.types.ts` (types).
- CMS write path: `scripts/cma/` via `getClient()` → `{ client, scope }`, run with `node --env-file=.env`.
- Content types today: `homePage`, `servicesPage`, `aboutPageSettings`, `projectsPageSettings`, `project`, `serviceItem`, `whatYouNeedCard`, `brand`.

## Architecture decisions

1. **Native `de-CH` locale** (not parallel `*De` fields). One locale added to the space, fallback chain `de-CH → en-US`. Untranslated fields automatically render English, so editors translate incrementally and nothing renders blank.
2. **Per-locale fetch** (not `locale: '*'`). Fetch functions request a single locale derived from the app language. The existing SWR cache keys on params, so each locale caches separately and repeat toggles are instant. Components refetch when `language` changes.
3. **Referenced arrays** for the new collections: `aboutPageSettings` references ordered arrays of `teamMember` and `aboutValue` entries, so editors manage membership and order in one place.
4. **Graceful fallback preserved.** When Contentful is unconfigured (env missing), components fall back to the current static i18n text and the current hardcoded local image paths — same maintenance-safe behaviour as today.

## Part 1 — German via `de-CH` locale

### CMS
- Add locale `de-CH` (name "German (Switzerland)"), `fallbackCode: "en-US"`, contentDelivery + optional.

### Frontend (`src/lib`)
- `contentful.ts`: thread an optional `locale` through `cachedGetEntries(params)` — callers add `locale` to the params object (the Delivery API already accepts a `locale` query param; the cache key is `JSON.stringify(params)`, so per-locale caching is automatic). No signature break for existing callers.
- `cms.ts`: every `fetch*` function takes a `locale: string` argument and passes it into the query. Add a helper `localeForLanguage(language: 'en' | 'de'): 'en-US' | 'de-CH'`.
- Callers (`Index`, `About`, `Projects`, `Services`, `ProjectDetail`): pass the current language's locale, and add `language` to the fetch `useEffect` dependency array so toggling refetches.
- **Remove the `language === 'en' ? cms : fallback` gates.** Both locales now come from CMS (with EN fallback inside Contentful). Static i18n becomes the unconfigured-only fallback.
- `Hero.tsx`: replace the inline German ternary for the hero title with the CMS `heroTitle` value (rendered with the pulsing styling applied to the trailing word).

## Part 2 — Move substantive static text into the CMS

Mark existing text fields **localized**, add the new fields below, then seed values (EN from existing entries / `en.ts`; DE seeded from existing `de.ts`).

| Content type | Field changes (all new text fields localized) |
|---|---|
| **homePage** | + `heroTitle` (Symbol), + `pulseEffectTitle` (Symbol), + `servicesSectionTitle` (Symbol), + `servicesSectionSubtitle` (Text); localize existing `whatWeDoBestText` (= pulse-effect body) |
| **aboutPageSettings** | + `aboutEyebrow` (Symbol, "About NOJA"), + `aboutHeading` (Symbol, "Why Us?"), + `valuesTitle` (Symbol), + `teamTitle` (Symbol, "We are Noja"), + `inActionImages` (Array&lt;Link Asset&gt;), + `aboutValues` (Array&lt;Link Entry→aboutValue&gt;), + `teamMembers` (Array&lt;Link Entry→teamMember&gt;); localize existing `ourStoryText` |
| **aboutValue** *(new type)* | `title` (Symbol, localized), `description` (Text, localized), `icon` (Symbol, validation in: `eye`, `lightbulb`, `users`), `order` (Integer) |
| **teamMember** *(new type)* | `name` (Symbol), `role` (Symbol, localized), `description` (Text, localized), `funFact` (Symbol, localized), `photo` (Link Asset), `hoverVideo` (Link Asset, optional), `order` (Integer) |
| **projectsPageSettings** | + `pageTitle` (Symbol), + `pageSubtitle` (Symbol), + `moreWorkTitle` (Symbol), + `allProjectsTitle` (Symbol); localize existing `ourWorkSubtext` |
| **servicesPage** | localize existing `heroTitle`, `heroSubtitle` |
| **serviceItem** | localize existing `title`, `description`, `features` (Array&lt;Symbol&gt;) |
| **project** | localize existing `title`, `subtitle`, `firstTextTitle`, `firstTextBody`, `quote`, `secondTextTitle`, `secondTextBody`. **Not** localized: `slug`, `date`, image/video assets |

Notes:
- `name` on `teamMember` is single-locale (names are identical EN/DE).
- Marking a field `localized: true` preserves the existing `en-US` value; the `de-CH` value starts empty and falls back to EN until seeded/edited.
- Localizing `project` text means German project detail pages become possible; the sitemap (slug-based) is unaffected.

### Frontend
- `cms.types.ts`: add `CmsTeamMember`, `CmsAboutValue`; extend `CmsHome`, `CmsAboutPage`, `CmsProjectsPage` with the new string/array fields.
- `cms.ts`: transform new fields; map `aboutValue`/`teamMember` references (sorted by `order`).
- Components consume CMS strings instead of `t.*` for migrated fields, keeping `t.*` as the unconfigured fallback:
  - `Index.tsx`: `heroTitle` → Hero; `pulseEffectTitle`, `whatWeDoBestText`, `servicesSectionTitle`, `servicesSectionSubtitle`.
  - `About.tsx` / `Story.tsx` / `Values.tsx` / `Team.tsx`: eyebrow, heading, story, values title + items, team title.
  - `Projects.tsx`: page title, subtitle, more-work / all-projects titles.
  - `Services.tsx`: remove the `germanServices` static block + `language === 'de'` branch; render CMS for both locales.

## Part 3 — Team cards + "In Action" marquee from CMS

- `About.tsx`: build `team` from `aboutPageSettings.teamMembers` and `actionImages` from `aboutPageSettings.inActionImages`; each falls back to the current hardcoded array when the CMS list is empty/unconfigured.
- `Team.tsx`: `TeamMember` photo/`hoverVideo` URLs come from CMS asset URLs (signature already `{ name, role, image, video? }` — wire CMS URLs into it).
- `aboutValue.icon` string maps to the Lucide icon in `About.tsx`/`Values.tsx` (`eye → Eye`, `lightbulb → Lightbulb`, `users → Users`).

## Migration scripts (`scripts/cma/`, all idempotent, run with `node --env-file=.env`)

1. **`add-locale.mjs`** — create `de-CH` (fallback `en-US`) if absent. Surfaces a clear error if the space plan disallows a 2nd locale.
2. **`migrate-content-model.mjs`** — create/patch content types: set `localized: true` on the fields in the Part 2 table, add new fields, create `aboutValue` + `teamMember` types. Re-runnable (checks before adding).
3. **`seed-content.mjs`** — write `en-US` + `de-CH` values for the new/localized text fields (EN + DE pulled from `src/i18n/en.ts` / `de.ts`); create `aboutValue` and `teamMember` entries; upload current local team photos/videos (`public/images/team-pictures/*`) and the 18 `public/images/action-slider/*` images as assets, link them, and publish everything.

## Risks & mitigations

- **Locale plan limit:** Adding `de-CH` may require a plan that allows ≥2 locales. `add-locale.mjs` surfaces the API error explicitly; if it fails, this blocks Part 1 and must be resolved on the Contentful side. **Needs verification early in Phase A.**
- **Token safety:** CMA work uses `CONTENTFUL_MANAGEMENT_TOKEN` (no `VITE_` prefix). After any env-touching change, verify `npx vite build && grep -rl "CFPAT\|CONTENTFUL_MANAGEMENT_TOKEN" dist/` prints nothing.
- **Refetch-on-toggle regression:** Ensure language toggle refetches without flicker; rely on SWR cache to keep the prior locale visible during refresh.

## Verification (no test framework configured)

- `npm run lint` (zero warnings) and `npm run build` (tsc + vite + sitemap) pass.
- Manual: toggle EN↔DE on Home, About, Projects, Services, a Project detail — confirm CMS text and images render in both locales, and that an untranslated `de-CH` field falls back to EN rather than blanking.
- `grep -rl "CFPAT\|CONTENTFUL_MANAGEMENT_TOKEN" dist/` is empty after build.

## Phasing (each phase independently shippable)

- **Phase A — Locale infrastructure:** add `de-CH`; make `contentful.ts`/`cms.ts` locale-aware; localize existing CMS fields; seed `de-CH` from `de.ts`; remove `language===` gates for already-CMS content. Outcome: existing CMS content becomes bilingual.
- **Phase B — Static text → CMS:** add the new text fields; seed EN/DE; wire components; remove the static `germanServices` block and remaining i18n usages for migrated copy.
- **Phase C — Team + In Action:** new `teamMember` + `aboutValue` types + `inActionImages`; seed entries and upload assets; refactor `About.tsx`/`Team.tsx`/`Values.tsx`.
