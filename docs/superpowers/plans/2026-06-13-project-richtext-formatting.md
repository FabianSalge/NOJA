# Rich-text Formatting in Project Body Fields — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Contentful rich-text formatting (bulleted/numbered lists, bold, italic, links, headings, blockquotes) render for both project-detail body fields, `firstTextBody` and `secondTextBody`, on `/projects/:slug`.

**Architecture:** Frontend-only. Both fields are already Contentful RichText `Document`s fetched by `fetchProjectBySlug`. `firstTextBody` already renders via `documentToReactComponents(doc, richTextOptions)`; the only field that doesn't is `secondTextBody`, which `ProjectDetail.tsx` flattens to plain text and re-splits into two columns. We replace that flatten-and-split with a single-column rich-text render, fix bullet spacing in the shared renderer, and delete a now-irrelevant dead helper. No Contentful, content-model, or CMA changes.

**Tech Stack:** React 18 + TypeScript + Vite, `@contentful/rich-text-react-renderer`, `@contentful/rich-text-types`, Tailwind CSS.

**Baseline:** This branch (`feat/project-richtext-formatting`) is rebased on top of the merged bilingual `main`, so `ProjectDetail.tsx` already has the locale-aware fetch. The `secondTextBody` render block and the two helper files below are unaffected by the bilingual work.

**Testing note:** This project has **no test framework** (per `CLAUDE.md`). The verification gate for each task is `npm run lint` (zero warnings enforced) + `npx tsc --noEmit`, with a final `npm run build` and a manual browser check (Task 4) as the acceptance test. Commit messages must **not** include a Claude co-author trailer (project preference).

---

## File Structure

- `src/lib/richtext.tsx` — shared `richTextOptions` (node renderers for the Contentful renderer). Responsibility: how each rich-text node type is rendered. Change: tighten list-item spacing.
- `src/pages/ProjectDetail.tsx` — the project detail page. Responsibility: layout + rendering of one project's fields. Change: render `secondTextBody` as single-column rich text; drop the plain-text flatten helper and its imports.
- `src/lib/cms.ts` — CMS fetch/transform layer. Change: remove the dead `splitDocumentByParagraphs` helper and the imports it alone used.

---

## Task 1: Tighten bullet/list-item spacing in the rich-text renderer

**Files:**
- Modify: `src/lib/richtext.tsx` (the `[BLOCKS.LIST_ITEM]` renderer)

**Why:** Contentful wraps each list item's text in a `PARAGRAPH` node, and the `PARAGRAPH` renderer applies `mb-4`. Inside a list that produces large gaps between bullets. Stripping the bottom margin of paragraphs that are direct children of an `<li>` makes lists read tightly.

- [ ] **Step 1: Update the `LIST_ITEM` renderer**

In `src/lib/richtext.tsx`, replace:

```tsx
    [BLOCKS.LIST_ITEM]: (_node, children) => (
      <li>{children}</li>
    ),
```

with:

```tsx
    [BLOCKS.LIST_ITEM]: (_node, children) => (
      <li className="[&>p]:mb-0">{children}</li>
    ),
```

- [ ] **Step 2: Verify lint + types pass**

Run: `npm run lint && npx tsc --noEmit`
Expected: lint prints no warnings; `tsc` exits 0 with no output.

- [ ] **Step 3: Commit**

```bash
git add src/lib/richtext.tsx
git commit -m "fix(richtext): tighten list-item spacing for Contentful bullet lists"
```

---

## Task 2: Render `secondTextBody` as single-column rich text

**Files:**
- Modify: `src/pages/ProjectDetail.tsx` (the `secondTextBody` render block in the "Project Text" section, and the rich-text-types import)

**Why:** The current block flattens `secondTextBody` to plain text (`getTextFromDocument`) and sentence-splits it into two columns, discarding all formatting. Rendering the Document directly (like `firstTextBody`) preserves bullets/bold/links.

- [ ] **Step 1: Replace the flatten-and-split block with a single-column render**

In `src/pages/ProjectDetail.tsx`, find the block that begins with `{project.secondTextBody ? (() => {` and ends with the matching `)}` after the `No content available` fallback (the entire IIFE plus its `else`). Replace that whole expression with:

```tsx
          <div className="text-lg leading-relaxed text-foreground/85">
            {project.secondTextBody
              ? documentToReactComponents(project.secondTextBody, richTextOptions)
              : <p>No content available</p>}
          </div>
```

For reference, the code being removed is exactly:

```tsx
          {project.secondTextBody ? (() => {
            // Get the raw text content from the document
            const getTextFromDocument = (doc: import('@contentful/rich-text-types').Document): string => {
              return doc.content.map((node: TopLevelBlock) => {
                if (node.nodeType === BLOCKS.PARAGRAPH && 'content' in node) {
                  // @ts-expect-error content is present on paragraph nodes
                  return node.content.map((textNode: { value?: string }) => textNode.value || '').join('');
                }
                return '';
              }).join(' ');
            };

            const fullText = getTextFromDocument(project.secondTextBody);
            
            if (fullText.length < 200) {
              // Short content - single column
              return (
                <div className="text-lg leading-relaxed text-foreground/85">
                  {documentToReactComponents(project.secondTextBody, richTextOptions)}
                </div>
              );
            }

            // Split long text into sentences for better column balance
            const sentences = fullText.split(/(?<=[.!?])\s+/).filter((s: string) => s.trim().length > 0);
            const midPoint = Math.ceil(sentences.length / 2);
            const leftText = sentences.slice(0, midPoint).join(' ');
            const rightText = sentences.slice(midPoint).join(' ');

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-lg leading-relaxed text-foreground/85">
                <div>
                  <p className="mb-4">{leftText}</p>
                </div>
                <div>
                  <p className="mb-4">{rightText}</p>
                </div>
              </div>
            );
          })() : (
            <div className="text-lg leading-relaxed text-foreground/85">
              <p>No content available</p>
            </div>
          )}
```

- [ ] **Step 2: Remove the now-unused import**

`BLOCKS` and `TopLevelBlock` were only used by the deleted helper. In `src/pages/ProjectDetail.tsx`, delete this import line:

```tsx
import { BLOCKS, type TopLevelBlock } from '@contentful/rich-text-types';
```

`documentToReactComponents` (from `@contentful/rich-text-react-renderer`) and `richTextOptions` (from `@/lib/richtext`) are already imported and stay.

- [ ] **Step 3: Verify no other references to the removed symbols remain in this file**

Run: `grep -nE "getTextFromDocument|TopLevelBlock|BLOCKS" src/pages/ProjectDetail.tsx`
Expected: no output.

- [ ] **Step 4: Verify lint + types pass**

Run: `npm run lint && npx tsc --noEmit`
Expected: no warnings; `tsc` exits 0. (If lint flags an unused var, a reference to the removed helper/import was missed — re-check Steps 1–2.)

- [ ] **Step 5: Commit**

```bash
git add src/pages/ProjectDetail.tsx
git commit -m "feat(projects): render secondTextBody as rich text instead of flattened plain text"
```

---

## Task 3: Remove the dead `splitDocumentByParagraphs` helper

**Files:**
- Modify: `src/lib/cms.ts` (delete the function; trim its imports)

**Why:** `splitDocumentByParagraphs` is exported but never called anywhere (verified on `main` and the bilingual branch). With the two-column split gone from `ProjectDetail.tsx`, it has no future use.

- [ ] **Step 1: Confirm it is genuinely unused**

Run: `grep -rn "splitDocumentByParagraphs" src/`
Expected: exactly one line — the definition in `src/lib/cms.ts`. (If any other file references it, stop and reassess; do not delete.)

- [ ] **Step 2: Delete the function**

In `src/lib/cms.ts`, remove the entire `splitDocumentByParagraphs` function:

```tsx
export function splitDocumentByParagraphs(doc: Document): [Document, Document] {
	const totalParagraphs = doc.content.filter((n: TopLevelBlock) => n.nodeType === BLOCKS.PARAGRAPH).length;
	const cutoff = Math.ceil(totalParagraphs / 2);
	let seen = 0;
	const leftNodes: TopLevelBlock[] = [];
	const rightNodes: TopLevelBlock[] = [];

	for (const node of doc.content) {
		const isPara = node.nodeType === BLOCKS.PARAGRAPH;
		const goesLeft = seen < cutoff;
		if (goesLeft) leftNodes.push(node); else rightNodes.push(node);
		if (isPara) seen += 1;
	}

	return [
		{ ...doc, content: leftNodes },
		{ ...doc, content: rightNodes },
	];
}
```

- [ ] **Step 3: Trim the import**

`BLOCKS` and `TopLevelBlock` were used only by that function; `Document` is still used by the `getField<Document>(...)` calls throughout the file. Change the first import line:

```tsx
import { Document, BLOCKS, TopLevelBlock } from "@contentful/rich-text-types";
```

to:

```tsx
import { Document } from "@contentful/rich-text-types";
```

- [ ] **Step 4: Verify lint + types pass**

Run: `npm run lint && npx tsc --noEmit`
Expected: no warnings (an unused-import warning here means a symbol was left behind); `tsc` exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/lib/cms.ts
git commit -m "chore(cms): remove unused splitDocumentByParagraphs helper"
```

---

## Task 4: Acceptance check — production build + manual browser verification

**Files:** none (verification only)

- [ ] **Step 1: Full production build**

Run: `npm run build`
Expected: `tsc` passes and `vite build` completes with no errors. (The post-build sitemap step may warn without Contentful env locally — that is fine and unrelated.)

- [ ] **Step 2: Add formatted content in Contentful**

In Contentful (or via a one-off CMA script using `scripts/cma/`), edit any one published `project` entry. In **both** `firstTextBody` and `secondTextBody`, add: a bulleted list (2–3 items), a numbered list, one **bold** word, and one hyperlink. Save and publish.

- [ ] **Step 3: Run the dev server and inspect the page**

Run: `npm run dev`
Open: `http://localhost:8080/projects/<slug>` for the edited project.
Expected:
- `firstTextBody` and `secondTextBody` both show list markers (• and 1./2.), with tight spacing between items (no large gaps).
- Bold text is bold; the link is underlined and opens in a new tab.
- `secondTextBody` is a single full-width column (no two-column split), and the empty-state ("No content available") still shows for a project whose `secondTextBody` is blank.

- [ ] **Step 4: Final lint + typecheck (sanity)**

Run: `npm run lint && npx tsc --noEmit`
Expected: clean.

---

## Done criteria

- Bullets/numbered lists/bold/links entered in Contentful render for both project body fields on `/projects/:slug`.
- List items are tightly spaced.
- `npm run lint`, `npx tsc --noEmit`, and `npm run build` all pass.
- No dead code left behind (`getTextFromDocument`, `splitDocumentByParagraphs`, and their now-unused imports are gone).
