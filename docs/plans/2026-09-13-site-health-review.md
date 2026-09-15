# Website health review — 13 September 2026

Scope: source inspection, local asset sizes, and browser checks against the compiled production build on port 8081. No live-site speed score, field Core Web Vitals, throttled mobile benchmark, or contact submission was performed. The production build uses published Contentful service entries; the port 8080 development preview shows the three proposed categories.

Implementation update: the approved findings have been addressed; see [health and theme implementation](2026-09-13-health-and-theme-implementation.md). The findings below describe the audited baseline.

## Priority findings

1. **Homepage media weight.** `public/images/Home/HomePhoneVideo.gif` is 17.80 MiB (approximately 18.7 MB) and is explicitly eager-loaded in `src/pages/Index.tsx:191`. The hero video is another 11.54 MiB (approximately 12.1 MB). These are file sizes, not a measured per-visit transfer total. Replace the GIF with a compact video and poster, load near the viewport, and optimize the hero encode. Keep playback visibility-aware.
2. **Broken Luniky link in both locales.** The English rich-text URI is literally `promotional video`; German points to `https://www.nojaagency.com/projects/promotional%20video`. The resulting route was checked in the production preview and shows “Project not found.” Correct the Contentful links once the intended video destination is established, or remove the broken hyperlink while retaining its text.
3. **Contact validation is disabled.** `src/pages/Contact.tsx:115` uses `noValidate`, but `handleSubmit` performs no required-field or email validation before sending. Restore browser validation or add accessible field-level validation. No messages were sent. This task's `.env.local` also lacks the Formspree ID, although the original checkout has one; that is a local preview configuration gap, not proof of a live outage. The missing-config toast exposes an implementation setting to visitors.
4. **About gallery loads original-size images eagerly.** Its 18-image marquee duplicates the elements for looping and uses plain images without lazy loading, responsive sources, or size transformations (`src/pages/About.tsx:138`). Duplicate URLs may share cached transfers, so do not count these as 36 unique downloads. Request appropriately sized/formatted images and defer the gallery's loading until it approaches the viewport.
5. **Accessibility and motion gaps.** The home hero's down-arrow button has no accessible name (`src/components/home/Hero.tsx:109`), confirmed in the rendered DOM. Home has no H1, and About's main heading also uses H2. The hero/contact background videos have no pause control, and reduced-motion handling does not stop their autoplay. Extend the project preview's playback behavior and label the button.

## Secondary cleanup

- Home/Services background video components request autoplay without an explicit visibility pause. Browser inspection found the visible Services video playing and the offscreen videos paused in this session; do not report offscreen playback as a reproduced fault. Explicit handling would make behavior predictable across browsers.
- Home and About have scroll-driven background contrast issues described in the separate section-transition review.
- CMS cache revalidation updates an internal map without notifying mounted components. A revisit may display cached content while a newer response silently populates the next visit's cache.
- Localized visible content shares English page metadata on several routes. Language-specific URLs/metadata and prerendering merit a separate SEO pass.

No console warnings/errors were returned for the inspected Home and Services pages. Existing build/type/lint checks passed in the preceding implementation pass. The initial review was read-only. Subsequent fixes are recorded in the implementation document linked above.
