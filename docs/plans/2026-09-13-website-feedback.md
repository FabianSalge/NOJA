# NOJA website feedback implementation plan

> Services status update — 17 September 2026: the three categories and matching
> homepage teasers are now published and connected. The local-only preview has
> been removed. See [completed Services rollout](2026-09-17-services-rollout.md).
> References below to unpublished service drafts describe the earlier state.


Status: first implementation pass available locally on `codex/website-feedback`; content and CMS rollout items remain open.

Source: `202601_WebsitePitch-FabianSalge_NOJA.pdf`, feedback dated 11 September 2026, slides 2–7. The feedback and visual mockups define the proposed scope. Placeholder text and example images are not final content. Repository baseline: `aa9025b`. Contentful project entries, project model, locales, and asset metadata were inspected read-only on 13 September 2026. Local browser verification now covers the changed pages at 390, 768, 1440, and 1600px widths.

## Implementation progress

Latest design refinement: removed visible video playback buttons at the user’s request and adjusted shared gradients to retain more beige before fading to ivory. Automatic offscreen pausing and reduced-motion handling remain.

Subsequent approved [health fixes and shared theme](2026-09-13-health-and-theme-implementation.md) are implemented, including optimized media, native form validation, shared Home/About/Services backgrounds, and publication of the two repaired Luniky video links.

- **Implemented:** shared carousel with centered video, touch/mouse/keyboard navigation, pause control, poster fallback, and offscreen/reduced-motion handling. All current projects use the overview carousel; zero, one, two, and eight-entry cases were exercised with test data.
- **Implemented:** phone/video project hero, scope split, supporting text/gallery, exact `#d7c6b9` to `#fbf8f6` fade, and soft dark CTA transition. Existing project content and URLs are preserved. Until gallery fields are populated, existing project images supply the gallery.
- **Implemented:** viewport-relative home hero fade held through 65% of the section's exit, larger logos, and additional phone-to-logo spacing.
- **Prepared for local review:** three Services categories with English/German draft copy, subtitles, deliverables, and matching home-page teasers. Enabled locally with a development-only flag; production continues to use the published CMS entries.
- **Applied to Contentful master:** added project preview video/gallery fields and localized service subtitles; made title required and quote fields optional, preserving existing unique-slug validation. Created three bilingual service drafts with provisional media matching the local preview. All drafts remain unpublished and live page references are unchanged. Management access is working. Backed up 10 models and 26 existing entries before applying `scripts/cma/prepare-website-feedback.mjs --apply`.
- **Documented:** `docs/content/project-editor-guide.md` covers the editor workflow, local Services review, CMS preparation, and rollout.
- **Diagnosed:** the four dim About images are `slide-15.png` through `slide-18.png`. Both CMS originals and local fallback files contain the dim appearance. No blanket CSS filter was added; clean source exports are still needed.
- **Outstanding content:** the three new project identities/assets, OASG's video and date decision, approval of service copy/media, and clean exports for the four About photos.

The remaining sections retain the implementation requirements and baseline findings used for this pass.

## Decisions and missing inputs

1. **Services — confirmed:** use slide 7's three categories (Brand & Design, Film & Photo, Content & Campaigns), incorporating slide 6's Brand & Identity and Graphic Design requirements. The user confirmed this direction during planning.
2. **Three new projects:** decision deferred until reviewing the Contentful inventory below, as requested by the user. The CMS currently exposes only the three existing projects, with no additional project drafts in Preview. Names and content for three new additions remain unconfirmed; the screenshot's existing projects do not identify the additions.
3. **Detail-page gallery:** implemented using project-specific media as the stated working assumption. The optional CMS gallery field is now available; existing images remain the fallback until editors choose gallery media.
4. **Home video:** interpreted as keeping the hero video visible longer during the transition. The previous code faded it to zero at 700px; the implemented section-relative fade begins after 65% of the hero's exit.

## Feedback mapped to implementation

### Contentful inventory — verified 13 September 2026

Initial Delivery and Preview queries targeted the configured `master` environment. Management access was subsequently restored and the model changes/service drafts described above were applied. The following inventory records the initial project and asset findings; existing project content has not changed.

| Existing project | Published and Preview | Copy | Linked images | Linked video |
| --- | --- | --- | --- | --- |
| OpenAir St.Gallen (`oasg`) | Published; entry fields match Preview | English and German | Cover, scope, quote image | None |
| Luniky (`luniky`) | Published; entry fields match Preview | English and German | Cover, scope, quote image | `luniky_compressed.mp4`, approximately 5.7 MB |
| Le Clé Marie (`le-cle-marie`) | Published; entry fields match Preview | English and German | Cover, scope, quote image | `leclemarie_compressed.mp4`, approximately 5.8 MB |

- Delivery and Preview each returned exactly three project entries. There are no additional project drafts visible in Preview.
- The asset library exposes 79 assets in Preview and 71 in Delivery. The eight Preview-only assets consist of five JPEGs and three incomplete records without file data. All five JPEGs were visually inspected: they appear to be behind-the-scenes images from one indoor café/tabletop shoot. Their generic WhatsApp filenames do not identify a client, and they do not establish three new project candidates.
- The library also contains extra imagery associated by filename with Luniky and Le Clé Marie, plus an OASG group image. These may support galleries for existing projects; association and selection should be checked before use. Other generic video/asset names do not establish additional case studies.
- OpenAir St.Gallen's text now describes the 2026 festival, but its date field remains `2025-06-27`. Confirm the intended year before updating; it affects the visible year and sorting.
- The initial project model had fixed image fields and optional `video`. It now also has optional `previewVideo` and `galleryMedia`; quote and quote-image are optional, title is required, and existing slug uniqueness/pattern validation is preserved.
- **Planning recommendation:** use Luniky or Le Clé Marie to validate the new template and carousel because both have bilingual content and linked MP4s. Use a cover-image fallback for OASG until its intended video is supplied or identified. Keep the three new entries as a separate content-dependent item; do not invent their identities from asset filenames.

### 1. Project overview — slide 2

Requested: replace the static project cards with an interactive carousel; play the middle card's video; add three project pages that the team can create themselves.

Proposed implementation:

- Build a centered carousel with portrait cards, neighboring cards visible, a curved/perspective treatment matching the reference, and pagination indicators.
- Support touch swiping, mouse interaction, previous/next controls, and keyboard navigation. Selecting a card opens its existing project URL; dragging must not trigger navigation.
- Only the active centered card plays video, muted and inline. Pause inactive and offscreen media; retain the cover image when a video is absent, fails, or autoplay is blocked. Provide a pause option and a reduced-motion presentation.
- Expose preview media in `CmsProjectSummary`; inspect the existing CMS `video` field before deciding whether a separate short `previewVideo` asset is useful. Avoid fetching project detail separately for every card.
- Proposed default: include all published projects in one carousel, newest first. The current code splits into three featured projects plus a separate grid when the total exceeds six; adjust this so new projects remain discoverable and are not duplicated. Keep existing slugs.
- Handle zero, one, and two projects without broken centering or duplicate interactive cards.

Primary files: `src/pages/Projects.tsx`, `src/lib/cms.ts`, `src/lib/cms.types.ts`, and a new shared carousel component.

Acceptance: navigation works with touch and keyboard; at most one preview plays; every published project is reachable, including after adding the three projects; mobile layouts have no horizontal page overflow.

### 2. Project detail template and self-service publishing — slides 2–3

Requested visual structure, based on the mockup:

1. A light gradient hero with an angled phone/video visual on the left and project title plus short introduction on the right.
2. An image/text split section with the scope text on a dark background.
3. A light gradient section with a smaller Syne heading, supporting copy, and a carousel.
4. A soft transition into the existing dark contact CTA.

**Explicitly reaffirmed by the user:** use a visible, smooth color fade from `#d7c6b9` to `#fbf8f6`, running top to bottom in the Projects overview, project hero, and supporting text/gallery section, per the user's direction correction. Implement the exact endpoints through scoped design tokens, rather than substituting the existing beige or a flat background. Keep this color fade distinct from the gallery section's transition into the dark CTA. A site-wide palette change is not requested. Treat the nonsensical text in the mockup as placeholder copy.

Existing support:

- `/projects/:slug` already resolves a Contentful project, so adding a page does not need a new route or a hardcoded page component.
- Existing fields cover the title, subtitle, cover image, scope image/text, secondary text, quote/image, and video.
- The current frontend has no project gallery field. Its existing quote banner and standalone video placement differ from the proposal.

Proposed implementation:

- Reuse existing text and media fields where their meaning fits; add only missing hero/gallery fields after checking the live content model.
- Use a reusable phone presentation with image fallback. Supply appropriate media rather than cropping an unsuitable landscape asset into a phone.
- Replace the default quote-banner layout with the proposed supporting text/gallery composition. Preserve existing quote data and decide its placement for populated projects before rollout.
- Make optional sections collapse cleanly when empty; never show placeholder text or empty media blocks on published pages.
- Add CMS help text and validation for required fields, slug uniqueness, media types, and gallery ordering. Preserve English/German localization.
- Document how to create or duplicate a project, upload media, fill both languages, preview, publish, and check its listing. Verify editor permissions and preview configuration during implementation.
- Populate the three requested projects once their identities and materials are supplied.

Primary files: `src/pages/ProjectDetail.tsx`, `src/lib/cms.ts`, `src/lib/cms.types.ts`, the shared carousel, and targeted scripts under `scripts/cma/` if the model needs extending.

Acceptance: existing project URLs and content survive; the new template matches the reference on desktop and stacks naturally on mobile; both light sections visibly fade from exact `#d7c6b9` to exact `#fbf8f6`, with readable text throughout and no hard color seam; an editor can create a complete project through Contentful without a code change. Verify how newly published projects enter the generated sitemap and include any required rebuild in the editor workflow.

### 3. Home-page video and logos — slide 4

Requested: keep the video visible longer while scrolling, increase logo size, and increase the space between the logos and the phone.

Proposed implementation:

- Tune the hero fade against section-relative scroll progress and viewport height rather than the current fixed 700px cutoff. Delay the fade and preview the handoff to “The Pulse Effect” so a large empty dark region does not appear.
- Increase the logos' displayed size and their container height together, preserving each logo's aspect ratio.
- Increase separation below the phone, accounting for its CSS scaling and rotation: visual overflow currently extends beyond its layout box.
- Verify the phone/logo spacing at mobile, tablet, desktop, and at least 1536px width.

Primary files: `src/components/home/Hero.tsx`, `src/pages/Index.tsx`, `src/components/BrandCarousel.tsx`.

Acceptance: the video remains visible farther into the intended scroll transition, logos are noticeably larger, and phone movement never overlaps the logo strip.

### 4. About-page image appearance — slide 5

Requested: investigate the apparent fade/filter over certain images. The arrows identify the In Action gallery, not the team portraits.

Current finding: the gallery markup in `src/pages/About.tsx` has no opacity/filter overlay, and its marquee CSS animates position. Team cards have separate gradients for text readability, but those are not the images singled out by this feedback.

Proposed implementation:

- Reproduce the appearance using the current Contentful assets. Compare the flagged images directly with their rendered versions and inspect transparency, source exports, and any runtime styling.
- If the effect is baked into media or caused by transparency, replace the affected assets with clean originals. If caused by styling, fix the specific gallery rule.
- Avoid applying blanket brightness or contrast adjustments to compensate for an unverified cause.

Primary files/content: `src/pages/About.tsx`, `src/index.css`, `aboutPageSettings.inActionImages`, and matching fallback assets only if affected.

Acceptance: the flagged gallery images match their approved originals without a uniform veil; unaffected images retain their appearance.

### 5. Services structure and copy — slides 6–7

Confirmed category structure; detailed copy remains to be finalized:

| Category | Coverage to preserve |
| --- | --- |
| Brand & Design | Brand strategy and positioning; visual identity and logo design; brand guidelines; graphic design; web design; print and packaging. Include social templates/assets and presentations/pitch decks from slide 6. |
| Film & Photo | Creative direction; video production; photography; brand films, image films and commercials; event/festival content; post-production. |
| Content & Campaigns | Campaign concepts; content strategy; content production; social media management; community management; performance and reporting. |

- Keep the proposed alternating dark/light sections and concise descriptions, with a short category subtitle and a localized “You leave with” label introducing deliverables.
- Use one of the supplied hero subtitle options; proposed default: “Built to work alone. Better together.”
- Preserve the substance of slide 6 when consolidating: its specific graphic-design deliverables should not disappear behind the generic “Graphic Design” label.
- Incorporate “brand films” and “image films” naturally into approved English/German service bullets. Treat SEO/GEO improvement as the feedback's goal, not a guaranteed outcome.
- Existing service data has title, description, features, media, order, and alternating layout. Add a localized category subtitle field if using slide 7; the common deliverables label can live in UI translations.
- Update CMS content and English/German fallback data together. Keep page metadata and existing structured service descriptions consistent with the final offering.
- Check the home-page service teaser titles for consistency after consolidation; change labels where necessary without expanding this into a home-page redesign.
- Prepare CMS changes without deleting old entries; switch references only when the final three-category content is ready to preview.

Primary files/content: `src/pages/Services.tsx`, `src/lib/cms.ts`, `src/lib/cms.types.ts`, `src/i18n/en.ts`, `src/i18n/de.ts`, `serviceItem`, and `servicesPage`.

Acceptance: the chosen category structure is rendered consistently in both languages; all requested deliverables remain represented; each section has a clear subtitle and relevant media.

## Suggested delivery sequence

1. **Confirm remaining content decisions:** three project identities/assets and gallery meaning. Services direction is confirmed. Inspect the live CMS model and relevant source media read-only.
2. **Small visual corrections:** home fade and logo spacing; diagnose and resolve the gallery appearance issue.
3. **Project foundation:** backward-compatible CMS fields, shared carousel, overview behavior, then the new detail template.
4. **Content and services:** restructure the approved services, add the three project entries, and validate the editor workflow.
5. **Review:** preview all affected pages in both languages; resolve visual and interaction issues before publication.

Projects are the largest implementation piece. Start their shared media/data foundation before populating the three new entries to avoid entering content twice.

## Verification for implementation

- Run the repository's strict lint and production build checks; no test framework is currently configured.
- Preview mobile (approximately 390px), tablet (768px), desktop (1440px), and large desktop (at least 1536px).
- Check carousel selection/playback with touch, keyboard, reduced motion, missing videos, blocked autoplay, and changing project counts. Add focused automated coverage for playback/state behavior if a suitable harness is introduced; do not add tests merely for static style changes.
- Verify English/German copy, direct project URLs, CMS preview versus published content, and empty optional fields.
- Compare the About gallery with original assets and check home transitions through a full scroll, not just static screenshots.
- Complete build/sitemap validation with the intended CMS configuration. A checkout without Contentful configuration shows the maintenance page, so meaningful page QA requires the configured environment.

Application code has been changed locally as summarized above. The two CMS models have been updated and published, and three unpublished service drafts have been created. Existing content entries and live page references are unchanged.
