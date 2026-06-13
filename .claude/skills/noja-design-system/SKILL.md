---
name: noja-design-system
description: Use when building, styling, or restyling NOJA's UI — pages, sections, components, responsive/large-screen work. Covers brand tokens, the Syne type system, the dark/beige section motif, animation conventions, and the 2xl: responsive scaling rules.
---

# NOJA Design System Skill

NOJA is a creative-agency site: bold, editorial, motion-rich. Match the existing feel rather than introducing new patterns.

## Brand tokens (HSL CSS vars in `src/index.css`)

Always style via the tokens, not raw hex. Core palette:
- `--background` `0 0% 12%` — near-black `#202020` (dark sections)
- `--foreground` / `--secondary` — warm off-white `#FBF8F6`
- `--primary` `28 35% 82%` — warm beige `#E1D0C1` (the signature color)

Use Tailwind tokens: `bg-background`, `text-foreground`, `bg-[hsl(var(--primary))]`, `text-background`, etc. Brand reference: `.cursor/brandguidlines.md`.

## Typography

- Font: **Syne** (`font-sans` is mapped to Syne in `tailwind.config.ts`). No other font.
- Headings: heavy (`font-black`), tight leading (`leading-[0.9]`), often ALL CAPS for hero/section titles.
- Body: `text-foreground/80` on dark, `text-background/80` on beige.

## Signature layout motif

The site alternates **full-height dark ↔ beige sections** with Framer Motion parallax "peel" transitions and subtle floating particle dots. Pattern (see `src/pages/Index.tsx`, `Projects.tsx`, `about/*`):
- `min-h-screen` sections, `bg-background` (dark) alternating with `bg-[hsl(var(--primary))]` (beige).
- A `motion.div` absolute background layer driven by `useScroll`/`useTransform` (`y` + `opacity`) that reveals the next section's color.
- Content wrapper: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10`.
- Text color flips with the background: dark section → `text-foreground`; beige section → `text-background`.

## Components & libraries

- shadcn/ui primitives live in `src/components/ui/` (most are unused — only import what you need).
- Animation: **Framer Motion** (`motion`, `useScroll`, `useTransform`, `useInView`). Reveal-on-scroll uses `useInView(ref, { once: true, margin: "-100px" })`.
- Images: use `ResponsiveImage` + `buildContentfulSrcSet` (`src/lib/images.ts`) for Contentful assets so srcset/sizes are generated.
- Respect `prefers-reduced-motion` (already globally handled in `index.css`).

## Responsive convention — IMPORTANT for large screens

Mobile-first Tailwind. The historical weakness was that type and containers stopped scaling at `lg` (1024px), so the site looked small/lost on 1440px+ displays. The established fix is **additive `2xl:` utilities** (≥1536px) — never change the sub-1536px classes:

- **Containers:** `max-w-7xl` → add `2xl:max-w-[1600px]`; `max-w-6xl` → add `2xl:max-w-[1320px]`.
- **Headings:** add one step at `2xl`, e.g. `lg:text-7xl 2xl:text-8xl`, `lg:text-6xl 2xl:text-7xl`, `lg:text-5xl 2xl:text-6xl`.
- **Body / subtitles:** `text-lg md:text-xl` → add `2xl:text-2xl`; widen measure (`max-w-2xl 2xl:max-w-3xl`).
- **Vertical rhythm:** standard sections `py-16 md:py-20` → add `2xl:py-28` (skip `min-h-screen` sections).

When adding any new section, apply these `2xl:` steps from the start so it stays consistent with the rest of the site.

## Checks before done

`npm run lint` (zero warnings enforced) and `npx tsc --noEmit` must pass. Preview large-screen work at ≥1536px via `npm run dev`.
