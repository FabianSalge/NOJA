# Spec: Rich-text formatting in project body fields

- **Date:** 2026-06-13
- **Status:** Approved (design)
- **Scope:** Frontend-only. No Contentful, content-model, or CMA changes.

## Summary

Render Contentful rich-text formatting (bulleted/numbered lists, bold, italic, links, headings, blockquotes) for the two project-detail body fields, `firstTextBody` and `secondTextBody`, on `/projects/:slug`.

## Background / Problem

- `firstTextBody` and `secondTextBody` are already Contentful **RichText** fields.
- `firstTextBody` renders correctly today via `documentToReactComponents(doc, richTextOptions)`.
- `secondTextBody` is **flattened to plain text** in `src/pages/ProjectDetail.tsx`: a local `getTextFromDocument` helper extracts paragraph text, which is then sentence-split into a two-column layout for long content. This discards all formatting — bullet lists entered in Contentful never appear.
- `src/lib/richtext.tsx` already styles `UL_LIST`/`OL_LIST`/`LIST_ITEM`, headings, `HR`, blockquote, and hyperlinks; the renderer's defaults cover `BOLD`/`ITALIC`/`UNDERLINE`/`CODE` marks.
- Dead code: `splitDocumentByParagraphs` in `src/lib/cms.ts` is defined but never called (confirmed on `main` and on the bilingual branch).

## Goals

1. Bullets / numbered lists / bold / links entered in Contentful for `firstTextBody` **and** `secondTextBody` render on the project detail page.
2. Bullet lists have clean, tight spacing (no oversized gaps between items).

## Non-goals (YAGNI)

- No formatting for `quote`, `subtitle`, or title fields — they stay plain `Symbol`/`Text`.
- No content-model or CMA changes (both target fields are already RichText).
- No `@tailwindcss/typography` / `prose` — manual `richTextOptions` already cover styling and avoid conflicts with the custom dark/beige theming.
- No change to `firstTextBody` rendering (already correct); it is in scope only as a verification target.

## Design / Changes (3 files, net-negative LOC)

### 1. `src/pages/ProjectDetail.tsx` — render `secondTextBody` as rich text, single column

Remove the `secondTextBody` block that defines `getTextFromDocument`, computes `fullText`, branches on length, and sentence-splits into two columns. Replace with a single-column render mirroring `firstTextBody`:

```tsx
<div className="text-lg leading-relaxed text-foreground/85">
  {project.secondTextBody
    ? documentToReactComponents(project.secondTextBody, richTextOptions)
    : <p>No content available</p>}
</div>
```

Then remove the now-unused `getTextFromDocument` helper and the `BLOCKS` / `TopLevelBlock` imports from this file (after confirming no other use).

### 2. `src/lib/richtext.tsx` — tighten list-item spacing

Contentful wraps each list item's text in a `PARAGRAPH` node, and the `PARAGRAPH` renderer applies `mb-4`, producing large gaps between bullets. Update `LIST_ITEM`:

```tsx
[BLOCKS.LIST_ITEM]: (_node, children) => (
  <li className="[&>p]:mb-0">{children}</li>
),
```

No other renderer changes.

### 3. `src/lib/cms.ts` — remove dead helper

Delete `splitDocumentByParagraphs`. Its only consumers of the `@contentful/rich-text-types` import are `BLOCKS` and `TopLevelBlock`, so drop those two from the import; keep `Document` (still used by the `getField<Document>(...)` calls throughout the file).

## Data flow

Contentful RichText `Document` → `fetchProjectBySlug` (unchanged; returns `firstTextBody`/`secondTextBody` as `Document`) → `ProjectDetail.tsx` → `documentToReactComponents(doc, richTextOptions)` → styled React nodes.

## Coordination / sequencing

The in-flight `feat/cms-bilingual-content` PR edits `ProjectDetail.tsx` (locale-aware fetch: `fetchProjectBySlug(slug, localeForLanguage(language))`, adds a `language` effect dependency) but does **not** touch the `secondTextBody` render block. **Implement this feature on top of merged bilingual `main`.** The only overlap is import lines; the conflict surface is trivial. Rebase this branch onto `main` once bilingual lands.

## Error / edge cases

- `secondTextBody` undefined/empty → render the existing `<p>No content available</p>` fallback.
- Mixed content (headings, blockquotes, nested lists) → handled by existing `richTextOptions`.

## Verification (no automated test framework configured)

1. In Contentful (or via a one-off CMA script), add to a project's `firstTextBody` and `secondTextBody`: a bulleted list, a numbered list, bold text, and a hyperlink.
2. `npm run dev`, open `/projects/<slug>`; confirm both bodies show list markers with tight spacing, bold text, and working links.
3. `npm run lint` (zero warnings), `npx tsc --noEmit`, and `npm run build` all pass.

## Files touched

- `src/pages/ProjectDetail.tsx` (primary)
- `src/lib/richtext.tsx` (list-item spacing)
- `src/lib/cms.ts` (remove dead `splitDocumentByParagraphs`)
