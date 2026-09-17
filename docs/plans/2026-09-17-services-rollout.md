# Services rollout — 17 September 2026

The user approved completion of the three-category Services rollout.

## Published Contentful changes

- Published `feedback-brand-design`, `feedback-film-photo` and
  `feedback-content-campaigns` with the reviewed English/German descriptions,
  subtitles, complete slide 6–7 deliverables and existing preview media.
- Updated `servicesPage` (`6WpbELbKyeq3LfPOpPgR1a`) to reference those three entries,
  in that order, with “Built to work alone. Better together.” / “Einzeln stark.
  Zusammen noch besser.” as the hero subtitle.
- Created and published three `whatYouNeedCard` entries: `services-card-brand-design`,
  `services-card-film-photo`, `services-card-content-campaigns`. These use the
  corresponding existing strategy, video/photography and campaign teaser images.
- Updated `homePage` (`6erVDgdPic0Rjd89orRGgQ`) to reference the three new cards and
  use the same localized services subtitle. Preserved all unrelated page fields.
- Kept every old service/card entry available for rollback and editorial history.

The executable, dry-run-first procedure is `scripts/cma/publish-services-rollout.mjs`.
It validates draft copy, checks for unrelated unpublished page edits, verifies
published media, backs up the affected entries, publishes children first, then
switches page references. Backup for this execution:
`/tmp/noja-contentful-review/services-rollout-1789640073946.json`.

## Frontend and validation

Removed the development-only services preview switch from Home and Services.
Both now use published CMS content in development and production; approved
three-category copy remains the offline fallback. Services metadata now describes
the final offering. The existing backgrounds, section layout and media are kept.

Added a production-output regression check for exactly the three approved
categories on both pages in English and German, matching subtitles, media and the
specific slide 6–7 deliverables. The check failed against the old four-category
build before publication. Run `npm run build`, `npm run test:seo` and `npm run lint`.

The earlier PR #30 was already merged, so this follow-up uses a fresh
`codex/services-rollout` branch from current main. Static HTML and the sitemap
update when the new build is deployed; Contentful publication alone does not
replace already-deployed HTML.

## Verification completed

- TypeScript checks, production build and strict ESLint pass.
- All ten SEO test groups pass against the local production server, including
  the new Services/Home contract and existing URL/404 checks.
- Browser verification: English Services shows the three categories and all
  deliverables; switching to German preserves the route and localizes copy;
  navigating to German Home shows exactly the three matching cards and subtitle.
- No browser hydration errors or management-token markers were found.
