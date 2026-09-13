# Health fixes and shared theme — 13 September 2026

Implemented on `codex/website-feedback` after the user approved the health review and requested cohesive backgrounds across About, Services and Home.

## Media and accessibility

| Media | Previous size | Replacement size |
| --- | ---: | ---: |
| Home phone animation | 17.80 MiB GIF | 1.41 MiB MP4 |
| Home hero | 11.54 MiB MP4 | 3.44 MiB MP4 |
| Contact background | 5.71 MiB MP4 | 0.73 MiB MP4 |

The phone is cropped to its 484×922 content bounds, with the transparent margin removed and the edge background matched to the dark section. This avoids a wide opaque video canvas overlapping the text. Original sources remain available; the site now references the optimized files. These are file-size comparisons, not a measured page-speed score.

`LoopingVideo` handles Home, Contact and service video playback. Video sources attach near the viewport; playback pauses offscreen or when the document is hidden. Reduced-motion preference defaults to a static poster/paused video, without visible playback buttons, per the subsequent design review. Small WebP posters accompany the local videos. Service videos without posters load metadata only when nearby.

About's gallery defers image mounting until nearby, requests 240/480/640px WebP variants, and hides its duplicate loop from assistive technology. `ResponsiveImage` now uses optimized Contentful image URLs; local files no longer receive meaningless resizing query parameters.

Home and About have H1 headings. The home scroll arrow has a translated accessible label. The Values icons now have dark strokes on their light backgrounds. Team hover videos respect reduced motion.

## Form and CMS

- Restored native required/email validation and trim checks. Replaced the configuration-specific failure toast with a localized email fallback. Restored the existing Formspree ID to the ignored local preview configuration.
- Verified empty submission and malformed email are rejected by the browser. No actual message was sent.
- Fixed both Luniky rich-text video URLs to its existing published MP4. Backed up the entry before changing it and verified that only those two URLs changed. Published this correction; service drafts remain unpublished.

## Shared theme

The exact colors `#d7c6b9` and `#fbf8f6` are reusable surface tokens. All light surfaces fade top to bottom. Following the user’s review, sand is held through the first 25%, remains dominant at the 70% stop, and reaches ivory only at the bottom. Visible playback controls were removed; offscreen pausing and reduced-motion handling remain.

- About: gradient Story, stable dark Values, one continuous gradient spanning Team and Action gallery.
- Services: gradient header and alternating light sections; crisp boundaries between categories. The final CTA fade is added only when the preceding service is light.
- Home: stable dark Pulse Effect, gradient Services teasers, shared fade into the CTA. The hero video retains its delayed scroll exit.
- Projects: both existing gradients are preserved. Overview and detail pages use the shared CTA treatment.

Removed redundant whole-background scroll layers and standardized ordinary section/CTA spacing. Accent colors and the dark/light hierarchy remain intact.

## Verification

Lint, TypeScript, production build, sitemap generation, and management-token exclusion checks pass. Browser checks covered 390px mobile, normal desktop, and 1600px desktop; native form validation; video pause/offscreen behavior; gallery image deferral; exact gradient colors; and the repaired CMS URLs. No horizontal overflow was found on inspected Home, About and Services layouts.

Pending content remains separate: three new project identities/assets, OASG date/video selection, clean source exports for the four dim About images, and service draft copy/media review.
