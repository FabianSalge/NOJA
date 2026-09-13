# SEO implementation — 13 September 2026

Implemented in the working branch; not deployed.

## Pages and language

English keeps the existing URLs. German uses `/de`, `/de/about`, `/de/services`,
`/de/projects`, `/de/projects/:slug`, `/de/contact` and `/de/cookie-declaration`.
The URL determines the language, regardless of a previously stored preference.
Language links preserve the current page, query and fragment. React Router's
basename keeps internal navigation within the selected language.

The production build renders the same React components with published Contentful
data, then hydrates the resulting HTML in the browser. A serialized, HTML-escaped
page snapshot prevents duplicate CMS requests on hydration. The current published
content produces 18 indexable pages (nine in each language), plus 404 documents.
No new framework or runtime dependency was introduced.

Metadata is centralized in `src/components/PageSEO.tsx`: descriptive EN/DE titles,
descriptions, fixed production canonical URLs, reciprocal English/German and
x-default alternates, Open Graph and Twitter tags. Project descriptions derive
from the actual localized scope copy rather than the short category subtitle.
Project previews use their cover images; general previews use the existing hero
video poster. The unsupported homepage SearchAction has been removed.

## Indexing and build behavior

`scripts/prerender.mjs` generates HTML and calls the sitemap writer using exactly
the successful page set. The sitemap contains reciprocal language alternates;
robots.txt advertises its URL. Production builds reject preview content and fail
when delivery credentials or required published content are unavailable. Vite's
production env files and process environment supply the read-only credentials.
Management credentials are never used by this build.

Vercel now serves clean static URLs, without the previous catch-all rewrite to
index.html. Unknown URLs therefore return HTTP 404, with the generated root
404.html as the fallback. Both normal and missing-project error UIs use noindex.
The production preview also disables the SPA fallback, allowing HTTP status tests.
Vercel's custom 404 behavior is documented at
https://vercel.com/kb/guide/custom-404-page . Its deployed response still needs
verification after release; no deployment occurred during this work.

## Validation

- Production build and both application/config TypeScript checks pass.
- Strict ESLint passes.
- `npm run test:seo` verifies initial HTML, one H1/title per page, meaningful unique
  titles, descriptions, canonical URLs, reciprocal hreflang, internal links,
  JSON-LD, data snapshots, sitemap parity, robots and 404 configuration.
- With `SEO_TEST_ORIGIN=http://127.0.0.1:8081`, the same suite confirms HTTP 200
  and correct initial canonicals for all 18 pages, and HTTP 404 for unknown normal,
  project and German project URLs. All six test groups pass.
- Production browser checks cover German home, About and project hydration;
  switching Luniky from German to English retains the project and updates the
  content, links and metadata. No hydration errors were observed. Remembered
  cookie consent also survives page loads without hydration mismatches.
- No management-token markers appear in dist.

## Publishing and remaining account setup

Use `npm run build` on Vercel with output `dist`, and configure the existing
read-only Contentful secrets in GitHub Actions as well. Direct `vite build` alone
does not generate the SEO pages.

Contentful publication, unpublication, deletion or copy changes require a rebuild
and deployment to update the static HTML and sitemap. New project URLs return
404 until included in a deployed build. A Contentful publication webhook can
trigger a Vercel deploy hook; this account-level hook has not been configured.
Until then, redeploy after publishing content. Changing existing slugs also needs
explicit redirects from old URLs.

After deployment, verify the production canonical host, redirects and 404
responses, then submit `/sitemap.xml` in Search Console and request indexing for
representative English/German pages. Search Console verification can use DNS or
the existing `VITE_GSC_VERIFICATION` setting. No Search Console account data was
accessed, so this work makes no ranking or traffic claims.

The three proposed service categories remain unpublished CMS drafts. Production
prerendering continues to use the currently published service references, while
the established local feedback preview remains available in development.
