# Creating and updating NOJA projects

Each Contentful `project` entry becomes a page at `/projects/<slug>`. New pages do not need a new React component or route.

## Current fields

1. Create a Project entry or duplicate an existing one.
2. Choose a unique, stable slug such as `project-name`. Do not reuse an existing slug. Changing a published slug changes its URL.
3. Fill the title, subtitle, scope title/body, and supporting title/body in English (`en-US`) and German (`de-CH`). German currently falls back to English when a translation is absent.
4. Set the project date; it controls the displayed year and project ordering. OASG's date currently says 2025 while its copy says 2026: confirm the intended date before changing it.
5. Add the cover image and scope image. A portrait cover works best for the carousel and phone presentation.
6. Optionally attach an MP4 video. The carousel and phone use it as a muted preview; playback automatically pauses offscreen and respects reduced-motion preferences. Without a video, the cover remains visible.
7. The optional quote can be retained as a short eyebrow above the supporting text. Quote and quote image are now optional in Contentful. Add ordered images/videos in Project Gallery, or leave it empty to use the existing project images.
8. Publish the referenced assets and the entry after checking both languages and media. Confirm the project appears in the overview and opens at its direct URL.
9. Trigger the normal website rebuild/deployment to regenerate the sitemap for new project URLs. Content updates are fetched at runtime, but the sitemap is generated at build time.

## Schema changes applied on 13 September 2026

- `previewVideo`: optional short video for the carousel and phone; falls back to the existing `video` field.
- `galleryMedia`: ordered image/video assets for the project gallery. When absent, the new template uses the project's existing cover, scope and quote images, without duplicate URLs.
- Make quote and quote image optional; make title required; validate slug uniqueness.
- `serviceItem.subtitle`: localized one-line category introduction.

Preview the exact schema and draft-service payload locally with Node 24:

```sh
node scripts/cma/prepare-website-feedback.mjs
```

Applied to `master` with `--apply` on 13 September 2026 after backing up all 10 content models and 26 existing entries. The command publishes model changes and creates three draft service entries. It does not overwrite existing draft entries, switch page references, or publish service entries. Review model changes in the intended environment before running it. If a run fails partway through, already-applied model changes remain; the command is safe to rerun because it checks existing fields and entries.

## Services review and publication

The local development setting `VITE_FEEDBACK_SERVICES_PREVIEW=true` shows the proposed three categories at `/services`. It only takes effect in Vite development mode. Published CMS content remains authoritative in production.

English copy is based on slides 6–7; German copy is a proposed translation. Review the copy in `src/content/service-categories.ts`. The bilingual drafts now exist in Contentful, with provisional media matching the local preview:

1. Review or replace the provisional image/video assigned to each service category.
2. Review both locales, all deliverables, and the proposed category subtitles.
3. Publish the three approved service entries.
4. Replace `servicesPage.services` references with Brand & Design, Film & Photo, and Content & Campaigns in order. Set the approved hero subtitle in both locales and publish the page settings.
5. Confirm the production view and update home-page service teaser labels where needed.

Management access is working. The three entries remain unpublished, and the live page references have not changed:

- [Brand & Design](https://app.contentful.com/spaces/6dr1u4cu03yu/environments/master/entries/feedback-brand-design)
- [Film & Photo](https://app.contentful.com/spaces/6dr1u4cu03yu/environments/master/entries/feedback-film-photo)
- [Content & Campaigns](https://app.contentful.com/spaces/6dr1u4cu03yu/environments/master/entries/feedback-content-campaigns)

Existing project entries are unchanged; editors can now populate the optional preview video and gallery fields.

## About gallery source issue

The four images singled out in the feedback correspond to `slide-15.png` through `slide-18.png` (festival chairs, umbrellas, stage, gold raincoat). Both the downloaded CMS originals and the checked-in fallback files have the muted/dim appearance when opened directly. Obtain clean source exports for these four assets before replacing them; a blanket CSS brightness filter would also alter their intended colors. This remains a content correction, not a verified overlay bug.
