# CMS-Driven Bilingual Content + Team-Managed Images — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make substantive site text editable from Contentful in English and German (via a native `de-CH` locale), and let the NOJA team manage team cards and the "In Action" marquee from Contentful.

**Architecture:** Add a `de-CH` locale (fallback `en-US`) to the Contentful space; make the read layer (`contentful.ts`/`cms.ts`) locale-aware and refetch on language toggle; mark existing text fields localized and add new localized fields + two new content types (`teamMember`, `aboutValue`) referenced from `aboutPageSettings`; migrate static i18n copy into the CMS, seeding German from the existing `src/i18n/de.ts`. Idempotent CMA scripts perform all Contentful mutations.

**Tech Stack:** React 18 + TypeScript + Vite, Contentful Delivery API (read, `contentful` SDK) + Content Management API (write, `contentful-management` SDK via `scripts/cma/`), `@contentful/rich-text-*`.

**No test framework is configured.** "Verify" steps use: `npm run lint` (zero warnings), `npm run build` (tsc + vite + sitemap), `npm run cms:inventory` / ad-hoc CMA read scripts, and manual EN↔DE toggling in `npm run dev`. Do **not** introduce a test framework.

**Reference spec:** `docs/superpowers/specs/2026-06-13-cms-bilingual-content-design.md`

**Token safety (applies to every CMA task):** CMA scripts use `CONTENTFUL_MANAGEMENT_TOKEN` (no `VITE_` prefix). Never add a write token to `src/`. After any env-touching change run `npx vite build && grep -rl "CFPAT\|CONTENTFUL_MANAGEMENT_TOKEN" dist/` — it must print nothing.

---

## File Structure

**New files:**
- `scripts/cma/add-locale.mjs` — create the `de-CH` locale (Phase A).
- `scripts/cma/lib/i18n-data.mjs` — EN/DE seed strings + a `richTextParagraphs(text)` helper shared by seed scripts (avoids importing `.ts`).
- `scripts/cma/migrate-content-model.mjs` — localize existing fields, add new fields, create new types (Phases A/B/C, idempotent; re-run after each phase's additions).
- `scripts/cma/seed-existing-locales.mjs` — seed `de-CH` for already-existing localized fields (Phase A).
- `scripts/cma/seed-static-text.mjs` — seed new homePage/about/projects text fields, both locales (Phase B).
- `scripts/cma/seed-team-and-gallery.mjs` — upload assets, create `teamMember`/`aboutValue` entries, link `inActionImages` (Phase C).

**Modified files:**
- `src/lib/contentful.ts` — pass `locale` through `cachedGetEntries`.
- `src/lib/cms.ts` — locale-aware fetch fns, `localeForLanguage` helper, new transforms.
- `src/lib/cms.types.ts` — new/extended types.
- `src/pages/Index.tsx`, `src/components/home/Hero.tsx` — home strings from CMS.
- `src/pages/About.tsx`, `src/components/about/Story.tsx`, `Values.tsx`, `Team.tsx` — about strings, values, team, gallery from CMS.
- `src/pages/Projects.tsx` — projects-page strings from CMS.
- `src/pages/Services.tsx` — remove static `germanServices` branch; CMS for both locales.
- `src/pages/ProjectDetail.tsx` — pass locale.

---

## CMA helper reference (read before writing scripts)

From `scripts/cma/client.mjs`: `getClient()` → `{ client, scope }` where `scope = { spaceId, environmentId }`. The client is the **plain** `contentful-management` API (v11). Key calls used here (always spread `...scope`):

- Locales: `client.locale.getMany({ ...scope })`, `client.locale.create({ ...scope }, { name, code, fallbackCode })`.
- Content types: `client.contentType.get({ ...scope, contentTypeId })`, `client.contentType.createWithId({ ...scope, contentTypeId }, ctData)`, `client.contentType.update({ ...scope, contentTypeId }, ct)`, `client.contentType.publish({ ...scope, contentTypeId }, ct)`. A content type object has `{ name, displayField, fields: [{ id, name, type, localized, required, items?, validations? }] }`. `update`/`publish` require the current `sys.version` (present on a fetched object; for `createWithId` the returned object carries it).
- Entries: `client.entry.get({ ...scope, entryId })`, `client.entry.getMany({ ...scope, query })`, `client.entry.create({ ...scope, contentTypeId }, { fields })`, `client.entry.update({ ...scope, entryId }, entry)`, `client.entry.publish({ ...scope, entryId }, entry)`. Fields are locale-keyed: `fields.<id> = { "en-US": value, "de-CH": value }`. Link fields: `{ "en-US": { sys: { type: "Link", linkType: "Asset"|"Entry", id } } }`.
- Assets: `client.asset.create({ ...scope }, { fields: { title, file: { "en-US": { contentType, fileName, upload: <publicUrl> } } } })` → `client.asset.processForAllLocales({ ...scope }, asset)` → wait → `client.asset.publish({ ...scope, assetId }, asset)`.

**Idempotency rule for all scripts:** read current state first; only create/patch what's missing; log what was skipped vs changed.

---

# PHASE A — Locale infrastructure + localize existing CMS fields

## Task A1: Add the `de-CH` locale

**Files:**
- Create: `scripts/cma/add-locale.mjs`

- [ ] **Step 1: Write the script**

```js
// scripts/cma/add-locale.mjs
// Run: node --env-file=.env scripts/cma/add-locale.mjs
import { getClient } from "./client.mjs";

const { client, scope } = getClient();
const TARGET = { code: "de-CH", name: "German (Switzerland)", fallbackCode: "en-US" };

const { items } = await client.locale.getMany({ ...scope });
const existing = items.find((l) => l.code === TARGET.code);
if (existing) {
  console.log(`Locale ${TARGET.code} already exists (fallback=${existing.fallbackCode}).`);
  process.exit(0);
}
try {
  const created = await client.locale.create({ ...scope }, TARGET);
  console.log(`Created locale ${created.code} (fallback=${created.fallbackCode}).`);
} catch (err) {
  console.error("Failed to create locale. If this is a plan limit, the space must allow >=2 locales.");
  console.error(err?.message || err);
  process.exit(1);
}
```

- [ ] **Step 2: Run it**

Run: `node --env-file=.env scripts/cma/add-locale.mjs`
Expected: `Created locale de-CH (fallback=en-US).` (or an explicit plan-limit error — if so, STOP and report; the German-from-CMS work is blocked until the plan allows a 2nd locale.)

- [ ] **Step 3: Verify**

Run: `node --env-file=.env -e 'import("./scripts/cma/client.mjs").then(async m=>{const{client,scope}=m.getClient();const{items}=await client.locale.getMany({...scope});console.log(items.map(l=>l.code+(l.default?"*":"")+"->"+(l.fallbackCode||"-")).join(", "))})'`
Expected: includes `en-US*->-, de-CH->en-US`.

- [ ] **Step 4: Commit**

```bash
git add scripts/cma/add-locale.mjs
git commit -m "feat(cms): add script to create de-CH locale"
```

## Task A2: Make `contentful.ts` pass `locale` through the cache

**Files:**
- Modify: `src/lib/contentful.ts` (the `cachedGetEntries` function and callers already pass a params object)

The Delivery API accepts `locale` inside the params object, and `cachedGetEntries` already keys its cache on `JSON.stringify(params)`. So **no change to `contentful.ts` is strictly required** — callers add `locale` to params. Confirm this is the case and add a short doc comment.

- [ ] **Step 1: Add a clarifying comment above `cachedGetEntries`**

```ts
// Pass `locale` inside `params` (e.g. { content_type, locale: "de-CH" }) to fetch a
// specific locale. The cache key includes params, so each locale caches separately.
export async function cachedGetEntries<T = unknown>(params: Record<string, unknown>): Promise<T> {
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: passes (no behavior change yet).

- [ ] **Step 3: Commit**

```bash
git add src/lib/contentful.ts
git commit -m "docs(cms): note locale param support in cachedGetEntries"
```

## Task A3: Locale-aware fetch functions in `cms.ts`

**Files:**
- Modify: `src/lib/cms.ts`

- [ ] **Step 1: Add the locale helper near the top of `cms.ts` (after imports)**

```ts
export type AppLanguage = "en" | "de";
export type ContentfulLocale = "en-US" | "de-CH";

export function localeForLanguage(language: AppLanguage): ContentfulLocale {
  return language === "de" ? "de-CH" : "en-US";
}
```

- [ ] **Step 2: Thread `locale` into every fetch function**

For each of `fetchHome`, `fetchProjectsPage`, `fetchProjectBySlug`, `fetchAbout`, `fetchServicesPage`: add a parameter `locale: ContentfulLocale = "en-US"` and include `locale` in every `cachedGetEntries({...})` params object inside that function. Example for `fetchHome`:

```ts
export async function fetchHome(locale: ContentfulLocale = "en-US"): Promise<CmsHome | undefined> {
  if (!isContentfulConfigured()) return undefined;
  const res = await cachedGetEntries<EntriesResult>({
    content_type: "homePage",
    include: 2,
    limit: 1,
    locale,
  });
  // ...unchanged below
```

Apply the same pattern (add `locale` param + `locale` in each query) to `fetchProjectsPage`, `fetchProjectBySlug(slug, locale = "en-US")`, `fetchAbout`, `fetchServicesPage`. For `fetchProjectsPage` add `locale` to BOTH the `projectsPageSettings` and `project` queries.

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: both pass. Existing callers still compile because `locale` defaults to `"en-US"`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/cms.ts
git commit -m "feat(cms): make fetch functions locale-aware"
```

## Task A4: Localize existing text fields in the content model

**Files:**
- Create: `scripts/cma/migrate-content-model.mjs`

This script is built up across phases. In Phase A it only **localizes existing fields**. Phases B and C add field-creation and type-creation blocks to the same file.

- [ ] **Step 1: Write the script with a reusable `localizeFields` helper**

```js
// scripts/cma/migrate-content-model.mjs
// Run: node --env-file=.env scripts/cma/migrate-content-model.mjs
import { getClient } from "./client.mjs";

const { client, scope } = getClient();

// Fields to mark localized: { contentTypeId: [fieldId, ...] }
const LOCALIZE = {
  homePage: ["whatWeDoBestText"],
  aboutPageSettings: ["ourStoryText"],
  projectsPageSettings: ["ourWorkSubtext"],
  servicesPage: ["heroTitle", "heroSubtitle"],
  serviceItem: ["title", "description", "features"],
  project: ["title", "subtitle", "firstTextTitle", "firstTextBody", "quote", "secondTextTitle", "secondTextBody"],
};

async function localizeFields(contentTypeId, fieldIds) {
  const ct = await client.contentType.get({ ...scope, contentTypeId });
  let changed = false;
  for (const id of fieldIds) {
    const field = ct.fields.find((f) => f.id === id);
    if (!field) { console.warn(`  ! ${contentTypeId}.${id} not found`); continue; }
    if (!field.localized) { field.localized = true; changed = true; console.log(`  localized ${contentTypeId}.${id}`); }
  }
  if (changed) {
    const updated = await client.contentType.update({ ...scope, contentTypeId }, ct);
    await client.contentType.publish({ ...scope, contentTypeId }, updated);
    console.log(`  published ${contentTypeId}`);
  } else {
    console.log(`  ${contentTypeId}: nothing to localize`);
  }
}

for (const [ctId, fields] of Object.entries(LOCALIZE)) {
  await localizeFields(ctId, fields);
}
console.log("migrate-content-model: localize pass done");
```

- [ ] **Step 2: Run it**

Run: `node --env-file=.env scripts/cma/migrate-content-model.mjs`
Expected: logs `localized homePage.whatWeDoBestText`, etc., then `published <type>` per changed type.

- [ ] **Step 3: Verify idempotency**

Run the same command again.
Expected: every type logs `nothing to localize`.

- [ ] **Step 4: Commit**

```bash
git add scripts/cma/migrate-content-model.mjs
git commit -m "feat(cms): localize existing text fields"
```

## Task A5: Seed `de-CH` values for existing localized fields

**Files:**
- Create: `scripts/cma/lib/i18n-data.mjs`
- Create: `scripts/cma/seed-existing-locales.mjs`

- [ ] **Step 1: Create the shared seed-data module with a rich-text helper**

```js
// scripts/cma/lib/i18n-data.mjs
// Plain-text -> Contentful rich-text Document (paragraphs split on blank lines).
export function richTextParagraphs(text) {
  const paras = String(text).split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  return {
    nodeType: "document",
    data: {},
    content: paras.map((p) => ({
      nodeType: "paragraph",
      data: {},
      content: [{ nodeType: "text", value: p, marks: [], data: {} }],
    })),
  };
}

// EN/DE copy mirrored from src/i18n/{en,de}.ts (kept in sync manually; seed-only).
export const COPY = {
  home: {
    heroTitle: { en: "CONTENT WITH A PULSE", de: "CONTENT MIT PULS" },
    pulseEffectTitle: { en: "The Pulse Effect", de: "The Pulse Effect" },
    pulseEffectBody: {
      en: "We craft strategies, campaigns, and visual content that make your brand impossible to ignore. When people feel your brand, they believe in it.",
      de: "Wir entwickeln Strategien, Kampagnen und visuelle Inhalte, die deine Marke unübersehbar machen. Wenn Menschen deine Marke spüren, glauben sie an sie.",
    },
    servicesSectionTitle: { en: "Services", de: "Services" },
    servicesSectionSubtitle: {
      en: "Concepts, creation, execution — turning ideas into scroll-stopping visuals.",
      de: "Konzepte, Kreation, Umsetzung – wir verwandeln Ideen in visuelle Inhalte, die aufsehen erzielen.",
    },
  },
  about: {
    eyebrow: { en: "About NOJA", de: "Über Noja" },
    heading: { en: "Why Us?", de: "Why Us?" },
    storyText: {
      en: "NOJA was born from a shared vision of three creatives with backgrounds in design management and multimedia. We saw a gap between strong ideas and flawless execution — so we founded an agency that bridges both. From concept to delivery, we combine strategy, project management, and production to create content that stands out and delivers.",
      de: "NOJA entstand aus einer gemeinsamen Vision von drei Kreativen mit Hintergründen in Design Management und Multimedia. Wir sahen eine Lücke zwischen starken Ideen und einwandfreier Umsetzung – also gründeten wir eine Agentur, die beides verbindet. Von der Idee bis zur Auslieferung vereinen wir Strategie, Projektmanagement und Produktion, um Inhalte zu schaffen, die auffallen und wirken.",
    },
    valuesTitle: { en: "Our Values", de: "Unsere Werte" },
    teamTitle: { en: "We are Noja", de: "Wir sind Noja" },
  },
  projects: {
    pageTitle: { en: "Featured Projects", de: "Ausgewählte Projekte" },
    pageSubtitle: { en: "The Pulse Effect in Action", de: "Der Pulse Effect in Aktion" },
    moreWorkTitle: { en: "More Work", de: "Mehr Arbeiten" },
    allProjectsTitle: { en: "All Projects", de: "Alle Projekte" },
  },
  values: [
    { icon: "eye", order: 0,
      title: { en: "Transparency", de: "Transparenz" },
      description: { en: "Open communication and expectations.", de: "Offene Kommunikation und klare Erwartungen." } },
    { icon: "lightbulb", order: 1,
      title: { en: "Strategic Creativity", de: "Strategische Kreativität" },
      description: { en: "Blending concept development, production, and project management for end-to-end solutions.", de: "Die Verbindung von Konzeptentwicklung, Produktion und Projektmanagement für ganzheitliche Lösungen." } },
    { icon: "users", order: 2,
      title: { en: "Community", de: "Community" },
      description: { en: "If we don't have the solution in-house, someone in our creative network does. We collaborate with trusted specialists across other creative fields.", de: "Wenn wir eine Lösung nicht intern abdecken, findet sie jemand aus unserem kreativen Netzwerk. Wir arbeiten mit erfahrenen Spezialistinnen und Spezialisten aus allen kreativen Bereichen zusammen." } },
  ],
  team: [
    { order: 0, name: "Naomi Ross",
      role: { en: "Creative Designer", de: "Mitgründerin / Kreative Designerin" },
      description: { en: "Multimedia roots and a natural eye for social-media-savvy, clever transitions.", de: "Multimedia roots and a natural eye for social-media-savvy, clever transitions." },
      funFact: { en: "Animal hoarder.", de: "Animal hoarder." },
      photo: "Naomi_NOJA_2026.jpg", video: "Naomi_NOJA_2026.mp4" },
    { order: 1, name: "Talia Persis Jenny",
      role: { en: "Co Founder / Project Manager", de: "Mitgründerin / Projekt Managerin" },
      description: { en: "Versed in design & project management, leading team through the details.", de: "Versed in design & project management, leading team through the details." },
      funFact: { en: "People pleaser.", de: "People pleaser." },
      photo: "Talia_NOJA_2026.jpg", video: "Talia_NOJA_2026.mp4" },
    { order: 2, name: "Jamilla Metzger",
      role: { en: "Co Founder / Campaign Manager and Creative Producer", de: "Mitgründerin / Kampagnen Managerin und Content Produzentin" },
      description: { en: "Background in multimedia with a gift for bringing out the fullest potential behind lenses.", de: "Background in multimedia with a gift for bringing out the fullest potential behind lenses." },
      funFact: { en: "Drives a motorcycle...", de: "Drives a motorcycle..." },
      photo: "Jamilla_NOJA_2026.jpg", video: "Jamilla_NOJA_2026.mp4" },
  ],
  services: [
    { order: 0,
      title: { en: "Full-Service Production", de: "Full-Service Produktion" },
      description: { en: "From brand positioning and storytelling to campaign concepts that set the tone and guide execution.", de: "Von der Markenpositionierung und dem Storytelling bis hin zu Kampagnenkonzepten, die den Ton setzen und die Umsetzung leiten." },
      features: { en: ["Strategy & Creative Direction","Campaign & Project Management","Video & Photography Production","Post-Production & Editing"], de: ["Strategie & Kreative Direktion","Kampagnen- & Projektmanagement","Video- & Fotoproduktion","Post-Production & Editing"] } },
    { order: 1,
      title: { en: "Strategy & Creative Direction", de: "Strategy & Creative Direction" },
      description: { en: "From brand positioning and storytelling to campaign concepts that define direction and impact.", de: "Von der Markenpositionierung und dem Storytelling bis zu Kampagnenkonzepten, die Richtung und Wirkung definieren." },
      features: { en: ["Brand Positioning","Campaign Concepts","Creative Storytelling","Moodboards & Guidelines","Tone-of-Voice Development","Strategic Planning"], de: ["Brand Positioning","Kampagnenkonzepte","Creative Storytelling","Moodboards & Guidelines","Tone-of-Voice-Entwicklung","Strategische Planung"] } },
    { order: 2,
      title: { en: "Video + Photography Production", de: "Video + Photography Production" },
      description: { en: "Visual content that stops the scroll — produced to capture the essence of your brand.", de: "Visuelle Inhalte, die zum Anhalten bringen – produziert, um den Kern deiner Marke einzufangen." },
      features: { en: ["Concept Development","Location Scouting","Casting & Talent Management","Set & Crew Coordination","On-Site Directing","Complete Photo & Video Shoots"], de: ["Konzepterstellung","Location Scouting","Casting & Talent Management","Set- & Crew-Koordination","On-Site Directing","Komplette Foto- & Videoshoots"] } },
    { order: 3,
      title: { en: "Post-Production + Editing", de: "Post-Production + Editing" },
      description: { en: "Clean, professional content — tailored to platform, audience, and brand identity.", de: "Saubere, professionelle Inhalte – abgestimmt auf Plattform, Zielgruppe und Markenidentität." },
      features: { en: ["Video Editing","Color Grading","Sound Design & Mixing","Photo Retouching","Motion Graphics","Final Delivery & Formatting"], de: ["Video Editing","Color Grading","Sound Design & Mixing","Foto-Retouching","Motion Graphics","Finale Auslieferung & Formatierung"] } },
  ],
};
```

- [ ] **Step 2: Write the seed-existing-locales script**

Seeds `de-CH` for the fields that already existed before this project (story text, projects subtext, services hero + serviceItems). Matches `serviceItem` rows to `COPY.services` by `order`. The home `whatWeDoBestText` de-CH is seeded here too (rich text).

```js
// scripts/cma/seed-existing-locales.mjs
// Run: node --env-file=.env scripts/cma/seed-existing-locales.mjs
import { getClient } from "./client.mjs";
import { COPY, richTextParagraphs } from "./lib/i18n-data.mjs";

const { client, scope } = getClient();
const DE = "de-CH";

function setLocale(entry, fieldId, value) {
  entry.fields[fieldId] = { ...(entry.fields[fieldId] || {}), [DE]: value };
}
async function savePublish(entryId, entry) {
  const updated = await client.entry.update({ ...scope, entryId }, entry);
  await client.entry.publish({ ...scope, entryId }, updated);
}
async function getSingleton(contentTypeId) {
  const { items } = await client.entry.getMany({ ...scope, query: { content_type: contentTypeId, limit: 1 } });
  return items[0];
}

// homePage.whatWeDoBestText (rich text)
const home = await getSingleton("homePage");
if (home) {
  setLocale(home, "whatWeDoBestText", richTextParagraphs(COPY.home.pulseEffectBody.de));
  await savePublish(home.sys.id, home);
  console.log("seeded de-CH homePage.whatWeDoBestText");
}

// aboutPageSettings.ourStoryText (rich text)
const about = await getSingleton("aboutPageSettings");
if (about) {
  setLocale(about, "ourStoryText", richTextParagraphs(COPY.about.storyText.de));
  await savePublish(about.sys.id, about);
  console.log("seeded de-CH aboutPageSettings.ourStoryText");
}

// projectsPageSettings.ourWorkSubtext (rich text)
const projects = await getSingleton("projectsPageSettings");
if (projects) {
  setLocale(projects, "ourWorkSubtext", richTextParagraphs(COPY.projects.pageSubtitle.de));
  await savePublish(projects.sys.id, projects);
  console.log("seeded de-CH projectsPageSettings.ourWorkSubtext");
}

// servicesPage hero
const services = await getSingleton("servicesPage");
if (services) {
  setLocale(services, "heroTitle", "Unsere Services");
  setLocale(services, "heroSubtitle", "Von der Idee bis zur Umsetzung bieten wir umfassende Content-Creation-Services.");
  await savePublish(services.sys.id, services);
  console.log("seeded de-CH servicesPage hero");
}

// serviceItem entries by order
const { items: serviceItems } = await client.entry.getMany({ ...scope, query: { content_type: "serviceItem", limit: 50 } });
for (const item of serviceItems) {
  const order = item.fields.order?.["en-US"];
  const row = COPY.services.find((s) => s.order === order);
  if (!row) { console.warn(`  ! no COPY.services for order ${order}`); continue; }
  setLocale(item, "title", row.title.de);
  setLocale(item, "description", row.description.de);
  setLocale(item, "features", row.features.de);
  await savePublish(item.sys.id, item);
  console.log(`seeded de-CH serviceItem order=${order}`);
}
console.log("seed-existing-locales done");
```

- [ ] **Step 3: Run it**

Run: `node --env-file=.env scripts/cma/seed-existing-locales.mjs`
Expected: a `seeded de-CH ...` line per entry, then `seed-existing-locales done`.

- [ ] **Step 4: Verify via read**

Run: `node --env-file=.env -e 'import("./scripts/cma/client.mjs").then(async m=>{const{client,scope}=m.getClient();const{items}=await client.entry.getMany({...scope,query:{content_type:"aboutPageSettings",limit:1}});console.log(Object.keys(items[0].fields.ourStoryText))})'`
Expected: `[ 'en-US', 'de-CH' ]`.

- [ ] **Step 5: Commit**

```bash
git add scripts/cma/lib/i18n-data.mjs scripts/cma/seed-existing-locales.mjs
git commit -m "feat(cms): seed de-CH for existing localized fields"
```

## Task A6: Wire locale into already-CMS components + remove `language===` gates

**Files:**
- Modify: `src/pages/Index.tsx`, `src/pages/About.tsx`, `src/pages/Projects.tsx`, `src/pages/Services.tsx`, `src/pages/ProjectDetail.tsx`, `src/components/about/Story.tsx`

- [ ] **Step 1: `Index.tsx` — fetch by locale, refetch on language change**

Replace the home fetch effect and remove the `language === 'en'` gate on the pulse body:

```ts
const { t, language } = useTranslation();
// ...
const [home, setHome] = useState<CmsHome | undefined>(undefined);
useEffect(() => {
  fetchHome(localeForLanguage(language)).then(setHome).catch(() => {
    console.warn('Failed to fetch Home data from Contentful. Falling back to static content.');
  });
}, [language]);
```

And change the pulse body render (around the `language === 'en' && home?.whatWeDoBestText` block) to:

```tsx
{home?.whatWeDoBestText ? (
  documentToReactComponents(home.whatWeDoBestText, richTextOptions)
) : (
  <p>{t.home.pulseEffect.description}</p>
)}
```

Add `localeForLanguage` to the import from `@/lib/cms`.

- [ ] **Step 2: `About.tsx` — fetch by locale; story renders CMS in both locales**

```ts
const { t, language } = useTranslation();
const [about, setAbout] = useState<CmsAboutPage | undefined>(undefined);
useEffect(() => {
  fetchAbout(localeForLanguage(language)).then(setAbout).catch(() => {
    console.warn('Failed to fetch About page content from Contentful. Falling back to static copy.');
  });
}, [language]);
```

Change the `<Story>` usage to drop the `language === 'en'` gate:

```tsx
<Story
  text={about?.ourStoryText}
  fallbackText={t.about.story.text}
  imageUrl={about?.ourStoryImageUrl || `${import.meta.env.BASE_URL}uploads/98ba3b82-16aa-4114-baf8-100af2d90634.png`}
/>
```

Import `localeForLanguage` from `@/lib/cms`. (Team/values/gallery wiring comes in Phase C — leave the static `team`, `values`, `actionImages` arrays untouched in this task.)

- [ ] **Step 3: `Projects.tsx` — fetch by locale; subtext both locales**

`Projects.tsx` holds separate state: `featured`, `allProjects`, `subtext`. Update the effect to fetch by locale and refetch on language change:

```tsx
useEffect(() => {
  fetchProjectsPage(localeForLanguage(language))
    .then((data) => {
      setFeatured(data.featured);
      setAllProjects(data.all);
      setSubtext(data.ourWorkSubtext);
    });
}, [language]);
```

Change the subtext gate (line ~142) from `language === 'en' && subtext` to just `subtext`:

```tsx
{subtext ? (
  documentToReactComponents(subtext, richTextOptions)
) : (
  <p>{t.projects.subtitle}</p>
)}
```

Import `localeForLanguage` from `@/lib/cms` and ensure `language` comes from `useTranslation()`. (Keep `t.projects.title` etc. here — those strings move to CMS in Phase B.)

- [ ] **Step 4: `Services.tsx` — fetch by locale; drop the German static branch**

Update the fetch effect (line ~20) to `fetchServicesPage(localeForLanguage(language))` and add `language` to the effect deps. Import `localeForLanguage` from `@/lib/cms`.

Delete the now-dead `germanServices` image-merge (lines ~213-217) — with the `de-CH` locale, `servicesData.services` already carries German text *and* images. Keep `germanServicesBase` (lines ~182-211) as the offline fallback only. Replace the `displayServices/displayTitle/displaySubtitle` block (lines ~220-222) so both locales use CMS, falling back to i18n only when CMS is absent:

```ts
const displayServices: CmsServiceItem[] = servicesData?.services?.length ? servicesData.services : germanServicesBase;
const displayTitle = servicesData?.heroTitle || t.services.title;
const displaySubtitle = servicesData?.heroSubtitle || t.services.subtitle;
```

Update the loading guard (line ~229) from `(!servicesData && language === 'en')` to `!servicesData` so it no longer special-cases language. (`germanServicesBase` items omit the optional `serviceMediaUrl`, which is fine for `CmsServiceItem[]`.)

- [ ] **Step 5: `ProjectDetail.tsx` — fetch by locale**

`ProjectDetail.tsx` does **not** currently use `useTranslation`. Add the import `import { useTranslation } from '@/i18n';` and, inside the component, `const { language } = useTranslation();`. Add `localeForLanguage` to the existing `@/lib/cms` import. Change the `fetchProjectBySlug(slug)` call (line ~23) to `fetchProjectBySlug(slug, localeForLanguage(language))` and add `language` to that effect's dependency array (alongside `slug`).

- [ ] **Step 6: Verify build, lint, manual**

Run: `npm run build && npm run lint`
Expected: pass.
Run: `npm run dev`, open About/Home/Projects/Services, toggle EN↔DE.
Expected: German now renders from CMS (story, services, pulse body); switching language refetches without errors; untranslated fields fall back to English.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Index.tsx src/pages/About.tsx src/pages/Projects.tsx src/pages/Services.tsx src/pages/ProjectDetail.tsx
git commit -m "feat(cms): fetch CMS content per locale and drop language gates"
```

**PHASE A COMPLETE — checkpoint:** existing CMS content is now bilingual. Verify `npx vite build && grep -rl "CFPAT\|CONTENTFUL_MANAGEMENT_TOKEN" dist/` prints nothing.

---

# PHASE B — Move static substantive text into the CMS

## Task B1: Add new text fields to existing content types

**Files:**
- Modify: `scripts/cma/migrate-content-model.mjs` (append an `ADD_FIELDS` pass)

- [ ] **Step 1: Append a field-adding helper + config to the script (after the localize pass)**

```js
// --- Phase B: add new localized text fields ---
const ADD_FIELDS = {
  homePage: [
    { id: "heroTitle", name: "Hero Title", type: "Symbol", localized: true },
    { id: "pulseEffectTitle", name: "Pulse Effect Title", type: "Symbol", localized: true },
    { id: "servicesSectionTitle", name: "Services Section Title", type: "Symbol", localized: true },
    { id: "servicesSectionSubtitle", name: "Services Section Subtitle", type: "Text", localized: true },
  ],
  aboutPageSettings: [
    { id: "aboutEyebrow", name: "About Eyebrow", type: "Symbol", localized: true },
    { id: "aboutHeading", name: "About Heading", type: "Symbol", localized: true },
    { id: "valuesTitle", name: "Values Title", type: "Symbol", localized: true },
    { id: "teamTitle", name: "Team Title", type: "Symbol", localized: true },
  ],
  projectsPageSettings: [
    { id: "pageTitle", name: "Page Title", type: "Symbol", localized: true },
    { id: "pageSubtitle", name: "Page Subtitle", type: "Symbol", localized: true },
    { id: "moreWorkTitle", name: "More Work Title", type: "Symbol", localized: true },
    { id: "allProjectsTitle", name: "All Projects Title", type: "Symbol", localized: true },
  ],
};

async function addFields(contentTypeId, fields) {
  const ct = await client.contentType.get({ ...scope, contentTypeId });
  let changed = false;
  for (const def of fields) {
    if (ct.fields.some((f) => f.id === def.id)) { console.log(`  ${contentTypeId}.${def.id} exists`); continue; }
    ct.fields.push({ required: false, omitted: false, disabled: false, ...def });
    changed = true; console.log(`  added ${contentTypeId}.${def.id}`);
  }
  if (changed) {
    const updated = await client.contentType.update({ ...scope, contentTypeId }, ct);
    await client.contentType.publish({ ...scope, contentTypeId }, updated);
    console.log(`  published ${contentTypeId}`);
  }
}

for (const [ctId, fields] of Object.entries(ADD_FIELDS)) {
  await addFields(ctId, fields);
}
console.log("migrate-content-model: add-fields pass done");
```

- [ ] **Step 2: Run + verify idempotency**

Run: `node --env-file=.env scripts/cma/migrate-content-model.mjs`
Expected: `added homePage.heroTitle`, etc.; rerun shows all `exists`.

- [ ] **Step 3: Commit**

```bash
git add scripts/cma/migrate-content-model.mjs
git commit -m "feat(cms): add static-text fields to home/about/projects types"
```

## Task B2: Seed EN + DE for the new text fields

**Files:**
- Create: `scripts/cma/seed-static-text.mjs`

- [ ] **Step 1: Write the script**

```js
// scripts/cma/seed-static-text.mjs
// Run: node --env-file=.env scripts/cma/seed-static-text.mjs
import { getClient } from "./client.mjs";
import { COPY } from "./lib/i18n-data.mjs";

const { client, scope } = getClient();

function set(entry, fieldId, en, de) {
  entry.fields[fieldId] = { "en-US": en, "de-CH": de };
}
async function savePublish(entryId, entry) {
  const updated = await client.entry.update({ ...scope, entryId }, entry);
  await client.entry.publish({ ...scope, entryId }, updated);
}
async function getSingleton(ctId) {
  const { items } = await client.entry.getMany({ ...scope, query: { content_type: ctId, limit: 1 } });
  return items[0];
}

const home = await getSingleton("homePage");
set(home, "heroTitle", COPY.home.heroTitle.en, COPY.home.heroTitle.de);
set(home, "pulseEffectTitle", COPY.home.pulseEffectTitle.en, COPY.home.pulseEffectTitle.de);
set(home, "servicesSectionTitle", COPY.home.servicesSectionTitle.en, COPY.home.servicesSectionTitle.de);
set(home, "servicesSectionSubtitle", COPY.home.servicesSectionSubtitle.en, COPY.home.servicesSectionSubtitle.de);
await savePublish(home.sys.id, home);
console.log("seeded homePage text");

const about = await getSingleton("aboutPageSettings");
set(about, "aboutEyebrow", COPY.about.eyebrow.en, COPY.about.eyebrow.de);
set(about, "aboutHeading", COPY.about.heading.en, COPY.about.heading.de);
set(about, "valuesTitle", COPY.about.valuesTitle.en, COPY.about.valuesTitle.de);
set(about, "teamTitle", COPY.about.teamTitle.en, COPY.about.teamTitle.de);
await savePublish(about.sys.id, about);
console.log("seeded aboutPageSettings text");

const projects = await getSingleton("projectsPageSettings");
set(projects, "pageTitle", COPY.projects.pageTitle.en, COPY.projects.pageTitle.de);
set(projects, "pageSubtitle", COPY.projects.pageSubtitle.en, COPY.projects.pageSubtitle.de);
set(projects, "moreWorkTitle", COPY.projects.moreWorkTitle.en, COPY.projects.moreWorkTitle.de);
set(projects, "allProjectsTitle", COPY.projects.allProjectsTitle.en, COPY.projects.allProjectsTitle.de);
await savePublish(projects.sys.id, projects);
console.log("seeded projectsPageSettings text");
console.log("seed-static-text done");
```

- [ ] **Step 2: Run it**

Run: `node --env-file=.env scripts/cma/seed-static-text.mjs`
Expected: three `seeded ...` lines + `seed-static-text done`.

- [ ] **Step 3: Commit**

```bash
git add scripts/cma/seed-static-text.mjs
git commit -m "feat(cms): seed EN/DE values for new static-text fields"
```

## Task B3: Extend types + transforms in `cms.ts` / `cms.types.ts`

**Files:**
- Modify: `src/lib/cms.types.ts`, `src/lib/cms.ts`

- [ ] **Step 1: Extend types in `cms.types.ts`**

```ts
export type CmsHome = {
  heroTitle?: string;
  pulseEffectTitle?: string;
  whatWeDoBestText?: Document;
  servicesSectionTitle?: string;
  servicesSectionSubtitle?: string;
  brands: CmsBrand[];
  whatYouNeedCards: CmsWhatYouNeedCard[];
};

export type CmsAboutPage = {
  aboutEyebrow?: string;
  aboutHeading?: string;
  valuesTitle?: string;
  teamTitle?: string;
  ourStoryText?: Document;
  ourStoryImageUrl?: string;
};

export type CmsProjectsPage = {
  pageTitle?: string;
  pageSubtitle?: string;
  moreWorkTitle?: string;
  allProjectsTitle?: string;
  ourWorkSubtext?: Document;
  featured: CmsProjectSummary[];
  all: CmsProjectSummary[];
};
```

- [ ] **Step 2: Populate new fields in the `cms.ts` transforms**

In `fetchHome`'s returned object add: `heroTitle: getField<string>(fields, "heroTitle")`, `pulseEffectTitle: getField<string>(fields, "pulseEffectTitle")`, `servicesSectionTitle: getField<string>(fields, "servicesSectionTitle")`, `servicesSectionSubtitle: getField<string>(fields, "servicesSectionSubtitle")`.

In `fetchAbout`'s returned object add: `aboutEyebrow`, `aboutHeading`, `valuesTitle`, `teamTitle` via `getField<string>(fields as Record<string, unknown>, "<id>")`.

In `fetchProjectsPage`'s returned object add: `pageTitle`, `pageSubtitle`, `moreWorkTitle`, `allProjectsTitle` via `getField<string>(settings as Record<string, unknown>, "<id>")`.

- [ ] **Step 3: Verify build/lint**

Run: `npm run build && npm run lint`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/cms.ts src/lib/cms.types.ts
git commit -m "feat(cms): map new static-text fields in transforms"
```

## Task B4: Wire components to CMS strings (i18n fallback retained)

**Files:**
- Modify: `src/components/home/Hero.tsx`, `src/pages/Index.tsx`, `src/pages/Projects.tsx`, `src/pages/About.tsx`, `src/components/about/Story.tsx`, `src/components/about/Values.tsx`, `src/components/about/Team.tsx`

- [ ] **Step 1: `Hero.tsx` — accept a CMS hero title**

Give `Hero` a `title?: string` prop. Replace the inline `language === 'de' ? 'CONTENT MIT ' : 'CONTENT WITH A '` markup with rendering of `title` when present, falling back to the current EN/DE inline behaviour when absent. Keep the pulsing-word styling: if `title` is present, render it whole inside the `<motion.h2>` (drop the split-word `<motion.span>` accent, or keep the accent on the last word by splitting `title` on the last space). Minimal approach:

```tsx
type HeroProps = { onScrollIndicatorClick?: () => void; title?: string };
// inside the <motion.h2>:
{title ? title : (<>{language === 'de' ? 'CONTENT MIT ' : 'CONTENT WITH A '}<motion.span className="text-secondary" animate={pulseAnimation} transition={{ duration: 2.2, repeat: Infinity }}>{language === 'de' ? 'PULS' : 'PULSE'}</motion.span></>)}
```

In `Index.tsx`, pass `<Hero onScrollIndicatorClick={handleScroll} title={home?.heroTitle} />`.

- [ ] **Step 2: `Index.tsx` — pulse title + services section from CMS**

Replace `{t.home.pulseEffect.title}` with `{home?.pulseEffectTitle || t.home.pulseEffect.title}`. Replace `{t.home.services.title}` with `{home?.servicesSectionTitle || t.home.services.title}` and `{t.home.services.subtitle}` with `{home?.servicesSectionSubtitle || t.home.services.subtitle}`.

- [ ] **Step 3: `Projects.tsx` — page title + section titles from CMS**

Add one new state to hold the page-text fields, set it in the existing effect (alongside the setters from Task A6 Step 3):

```tsx
const [pageText, setPageText] = useState<CmsProjectsPage | undefined>(undefined);
// inside the effect's .then((data) => { ... }):
setPageText(data);
```

Import `CmsProjectsPage` from `@/lib/cms`. Then replace `{t.projects.title}` → `{pageText?.pageTitle || t.projects.title}`; the subtitle fallback `<p>` → `{pageText?.pageSubtitle || t.projects.subtitle}`; `{t.projects.moreWork}` → `{pageText?.moreWorkTitle || t.projects.moreWork}`; `{t.projects.allProjects}` → `{pageText?.allProjectsTitle || t.projects.allProjects}`.

- [ ] **Step 4: `Story.tsx` + `About.tsx` — eyebrow & heading from CMS**

`Story` currently reads `t.about.title`/`t.about.subtitle` internally. Add props `eyebrow?: string` and `heading?: string`; render `{eyebrow || t.about.title}` and `{heading || t.about.subtitle}`. In `About.tsx` pass `eyebrow={about?.aboutEyebrow}` and `heading={about?.aboutHeading}` to `<Story>`.

- [ ] **Step 5: `Values.tsx` + `Team.tsx` — section titles from CMS**

`Values` reads `t.about.values.title`; add a `title?: string` prop and render `{title || t.about.values.title}`. Pass `title={about?.valuesTitle}` from `About.tsx`. `Team` reads `t.about.team.title`; add a `title?: string` prop, render `{title || t.about.team.title}`, pass `title={about?.teamTitle}` from `About.tsx`.

- [ ] **Step 6: Verify build/lint/manual**

Run: `npm run build && npm run lint`
Expected: pass.
Run `npm run dev`: toggle EN↔DE on Home/Projects/About; titles/subtitles come from CMS in both languages, fall back to i18n if a field is empty.

- [ ] **Step 7: Commit**

```bash
git add src/components/home/Hero.tsx src/pages/Index.tsx src/pages/Projects.tsx src/pages/About.tsx src/components/about/Story.tsx src/components/about/Values.tsx src/components/about/Team.tsx
git commit -m "feat(cms): render home/about/projects static text from CMS"
```

**PHASE B COMPLETE — checkpoint:** substantive static copy is now CMS-driven and bilingual.

---

# PHASE C — Team members + In Action gallery from CMS

## Task C1: Create `aboutValue` + `teamMember` types and reference fields

**Files:**
- Modify: `scripts/cma/migrate-content-model.mjs` (append a type-creation + reference-field pass)

- [ ] **Step 1: Append type creation to the script**

```js
// --- Phase C: new content types ---
const NEW_TYPES = {
  aboutValue: {
    name: "About Value", displayField: "title",
    fields: [
      { id: "title", name: "Title", type: "Symbol", required: true, localized: true },
      { id: "description", name: "Description", type: "Text", required: true, localized: true },
      { id: "icon", name: "Icon", type: "Symbol", required: true, validations: [{ in: ["eye", "lightbulb", "users"] }] },
      { id: "order", name: "Order", type: "Integer", required: false },
    ],
  },
  teamMember: {
    name: "Team Member", displayField: "name",
    fields: [
      { id: "name", name: "Name", type: "Symbol", required: true },
      { id: "role", name: "Role", type: "Symbol", required: true, localized: true },
      { id: "description", name: "Description", type: "Text", required: false, localized: true },
      { id: "funFact", name: "Fun Fact", type: "Symbol", required: false, localized: true },
      { id: "photo", name: "Photo", type: "Link", linkType: "Asset", required: true },
      { id: "hoverVideo", name: "Hover Video", type: "Link", linkType: "Asset", required: false },
      { id: "order", name: "Order", type: "Integer", required: false },
    ],
  },
};

async function ensureType(contentTypeId, def) {
  try {
    await client.contentType.get({ ...scope, contentTypeId });
    console.log(`  type ${contentTypeId} exists`);
    return;
  } catch { /* not found -> create */ }
  const created = await client.contentType.createWithId({ ...scope, contentTypeId }, {
    name: def.name, displayField: def.displayField,
    fields: def.fields.map((f) => ({ required: false, omitted: false, disabled: false, ...f })),
  });
  await client.contentType.publish({ ...scope, contentTypeId }, created);
  console.log(`  created+published type ${contentTypeId}`);
}

for (const [id, def] of Object.entries(NEW_TYPES)) {
  await ensureType(id, def);
}

// reference + asset-array fields on aboutPageSettings
await addFields("aboutPageSettings", [
  { id: "aboutValues", name: "Values", type: "Array",
    items: { type: "Link", linkType: "Entry", validations: [{ linkContentType: ["aboutValue"] }] } },
  { id: "teamMembers", name: "Team Members", type: "Array",
    items: { type: "Link", linkType: "Entry", validations: [{ linkContentType: ["teamMember"] }] } },
  { id: "inActionImages", name: "In Action Images", type: "Array",
    items: { type: "Link", linkType: "Asset" } },
]);
console.log("migrate-content-model: new-types pass done");
```

- [ ] **Step 2: Run + verify idempotency**

Run: `node --env-file=.env scripts/cma/migrate-content-model.mjs`
Expected: `created+published type aboutValue`, `created+published type teamMember`, `added aboutPageSettings.aboutValues` etc. Rerun → all `exists`.

- [ ] **Step 3: Commit**

```bash
git add scripts/cma/migrate-content-model.mjs
git commit -m "feat(cms): add aboutValue + teamMember types and reference fields"
```

## Task C2: Upload assets + create value/team entries + link gallery

**Files:**
- Create: `scripts/cma/seed-team-and-gallery.mjs`

Assets are uploaded from the local files under `public/images/team-pictures/` and `public/images/action-slider/`. Contentful's `upload` field needs a **public URL**; since these files are local, use the `file` upload-from-buffer path via `client.upload.create` then reference it. To keep this dependency-free, the script reads each file and creates an upload, then an asset linking that upload.

- [ ] **Step 1: Write the script**

```js
// scripts/cma/seed-team-and-gallery.mjs
// Run: node --env-file=.env scripts/cma/seed-team-and-gallery.mjs
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getClient } from "./client.mjs";
import { COPY } from "./lib/i18n-data.mjs";

const { client, scope } = getClient();
const PUB = resolve(process.cwd(), "public");
const CT_MAP = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", mp4: "video/mp4" };

async function uploadAsset(relPath, title) {
  const abs = resolve(PUB, relPath);
  const data = await readFile(abs);
  const ext = relPath.split(".").pop().toLowerCase();
  const upload = await client.upload.create({ ...scope }, { file: data });
  const fileName = relPath.split("/").pop();
  let asset = await client.asset.create({ ...scope }, {
    fields: {
      title: { "en-US": title },
      file: { "en-US": { contentType: CT_MAP[ext], fileName, uploadFrom: { sys: { type: "Link", linkType: "Upload", id: upload.sys.id } } } },
    },
  });
  asset = await client.asset.processForAllLocales({ ...scope }, asset);
  // processing is async; poll until the file URL is present
  for (let i = 0; i < 20; i++) {
    const fresh = await client.asset.get({ ...scope, assetId: asset.sys.id });
    if (fresh.fields.file?.["en-US"]?.url) { asset = fresh; break; }
    await new Promise((r) => setTimeout(r, 1000));
  }
  await client.asset.publish({ ...scope, assetId: asset.sys.id }, asset);
  console.log(`  uploaded ${relPath}`);
  return asset.sys.id;
}
const link = (id, linkType = "Asset") => ({ sys: { type: "Link", linkType, id } });

// 1) aboutValue entries
const valueIds = [];
for (const v of COPY.values) {
  const entry = await client.entry.create({ ...scope, contentTypeId: "aboutValue" }, {
    fields: {
      title: { "en-US": v.title.en, "de-CH": v.title.de },
      description: { "en-US": v.description.en, "de-CH": v.description.de },
      icon: { "en-US": v.icon },
      order: { "en-US": v.order },
    },
  });
  await client.entry.publish({ ...scope, entryId: entry.sys.id }, entry);
  valueIds.push(entry.sys.id);
  console.log(`  created aboutValue ${v.icon}`);
}

// 2) teamMember entries (with uploaded photo + video)
const teamIds = [];
for (const m of COPY.team) {
  const photoId = await uploadAsset(`images/team-pictures/${m.photo}`, `${m.name} photo`);
  const videoId = m.video ? await uploadAsset(`images/team-pictures/${m.video}`, `${m.name} video`) : null;
  const fields = {
    name: { "en-US": m.name },
    role: { "en-US": m.role.en, "de-CH": m.role.de },
    description: { "en-US": m.description.en, "de-CH": m.description.de },
    funFact: { "en-US": m.funFact.en, "de-CH": m.funFact.de },
    photo: { "en-US": link(photoId) },
    order: { "en-US": m.order },
  };
  if (videoId) fields.hoverVideo = { "en-US": link(videoId) };
  const entry = await client.entry.create({ ...scope, contentTypeId: "teamMember" }, { fields });
  await client.entry.publish({ ...scope, entryId: entry.sys.id }, entry);
  teamIds.push(entry.sys.id);
  console.log(`  created teamMember ${m.name}`);
}

// 3) In Action gallery assets (18 slides)
const ACTION = ["slide-01.png","slide-02.jpg","slide-03.png","slide-04.png","slide-05.png","slide-06.jpg","slide-07.jpg","slide-08.jpg","slide-09.png","slide-10.png","slide-11.png","slide-12-lecle.png","slide-13-naomi.jpg","slide-14-talia.png","slide-15.png","slide-16.png","slide-17.png","slide-18.png"];
const galleryIds = [];
for (const f of ACTION) {
  galleryIds.push(await uploadAsset(`images/action-slider/${f}`, `In Action ${f}`));
}

// 4) link everything onto aboutPageSettings
const { items } = await client.entry.getMany({ ...scope, query: { content_type: "aboutPageSettings", limit: 1 } });
const about = items[0];
about.fields.aboutValues = { "en-US": valueIds.map((id) => link(id, "Entry")) };
about.fields.teamMembers = { "en-US": teamIds.map((id) => link(id, "Entry")) };
about.fields.inActionImages = { "en-US": galleryIds.map((id) => link(id, "Asset")) };
const updated = await client.entry.update({ ...scope, entryId: about.sys.id }, about);
await client.entry.publish({ ...scope, entryId: about.sys.id }, updated);
console.log("linked values/team/gallery onto aboutPageSettings");
console.log("seed-team-and-gallery done");
```

> **Note for executor:** this script is **not** idempotent (it creates new entries each run). Run it **once**. If it must be re-run, first delete the entries/assets it created, or guard creation by querying existing entries. Verify the `client.upload.create` signature against the installed `contentful-management` version before running (`{ file: <Buffer> }`); if uploads fail, fall back to creating assets from a temporary public URL.

- [ ] **Step 2: Run it once**

Run: `node --env-file=.env scripts/cma/seed-team-and-gallery.mjs`
Expected: `created aboutValue ...` x3, `uploaded ...` per asset, `created teamMember ...` x3, then `linked ...` and `seed-team-and-gallery done`.

- [ ] **Step 3: Verify via read**

Run: `node --env-file=.env -e 'import("./scripts/cma/client.mjs").then(async m=>{const{client,scope}=m.getClient();const{items}=await client.entry.getMany({...scope,query:{content_type:"aboutPageSettings",limit:1}});const f=items[0].fields;console.log("values",f.aboutValues?.["en-US"]?.length,"team",f.teamMembers?.["en-US"]?.length,"gallery",f.inActionImages?.["en-US"]?.length)})'`
Expected: `values 3 team 3 gallery 18`.

- [ ] **Step 4: Commit**

```bash
git add scripts/cma/seed-team-and-gallery.mjs
git commit -m "feat(cms): seed team members, values, and In Action gallery"
```

## Task C3: Types + transforms for team/values/gallery

**Files:**
- Modify: `src/lib/cms.types.ts`, `src/lib/cms.ts`

- [ ] **Step 1: Add types in `cms.types.ts`**

```ts
export type CmsAboutValue = {
  title: string;
  description: string;
  icon: "eye" | "lightbulb" | "users";
  order?: number;
};

export type CmsTeamMember = {
  name: string;
  role: string;
  description?: string;
  funFact?: string;
  photoUrl?: string;
  videoUrl?: string;
  order?: number;
};
```

Extend `CmsAboutPage` with: `values: CmsAboutValue[]; team: CmsTeamMember[]; inActionImageUrls: string[];`

- [ ] **Step 2: Transform them in `fetchAbout` (`cms.ts`)**

`fetchAbout` currently uses `include: 1`; bump to `include: 2` so referenced entries' assets resolve. Build the arrays:

```ts
const fields = res.items?.[0]?.fields ?? {};
const valuesRaw = (getField<Entry[]>(fields as Record<string, unknown>, "aboutValues") ?? []);
const values: CmsAboutValue[] = valuesRaw
  .map((v) => ({
    title: getField<string>(v.fields as Record<string, unknown>, "title") ?? "",
    description: getField<string>(v.fields as Record<string, unknown>, "description") ?? "",
    icon: (getField<string>(v.fields as Record<string, unknown>, "icon") ?? "eye") as CmsAboutValue["icon"],
    order: getField<number>(v.fields as Record<string, unknown>, "order"),
  }))
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
const teamRaw = (getField<Entry[]>(fields as Record<string, unknown>, "teamMembers") ?? []);
const team: CmsTeamMember[] = teamRaw
  .map((m) => ({
    name: getField<string>(m.fields as Record<string, unknown>, "name") ?? "",
    role: getField<string>(m.fields as Record<string, unknown>, "role") ?? "",
    description: getField<string>(m.fields as Record<string, unknown>, "description"),
    funFact: getField<string>(m.fields as Record<string, unknown>, "funFact"),
    photoUrl: assetUrlFromField(getField<Asset>(m.fields as Record<string, unknown>, "photo")),
    videoUrl: assetUrlFromField(getField<Asset>(m.fields as Record<string, unknown>, "hoverVideo")),
    order: getField<number>(m.fields as Record<string, unknown>, "order"),
  }))
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
const galleryRaw = (getField<Asset[]>(fields as Record<string, unknown>, "inActionImages") ?? []);
const inActionImageUrls = galleryRaw.map((a) => assetUrlFromField(a)).filter((u): u is string => Boolean(u));
```

Add `values`, `team`, `inActionImageUrls` (and the Phase B fields) to the returned object.

- [ ] **Step 3: Verify build/lint**

Run: `npm run build && npm run lint`
Expected: pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/cms.ts src/lib/cms.types.ts
git commit -m "feat(cms): map team, values, and gallery from CMS"
```

## Task C4: Render team/values/gallery from CMS with local fallback

**Files:**
- Modify: `src/pages/About.tsx`, `src/components/about/Values.tsx`, `src/components/about/Team.tsx`

- [ ] **Step 1: `About.tsx` — build values/team/gallery from CMS, fall back to current hardcoded arrays**

Keep the existing hardcoded `values`, `team`, `actionImages` arrays renamed with a `fallback` prefix (`fallbackValues`, `fallbackTeam`, `fallbackActionImages`). Then derive the live data:

```ts
const ICONS = { eye: Eye, lightbulb: Lightbulb, users: Users } as const;

const values = about?.values?.length
  ? about.values.map((v) => ({ icon: ICONS[v.icon] ?? Eye, title: v.title, description: v.description }))
  : fallbackValues;

const team = about?.team?.length
  ? about.team.map((m) => ({ name: m.name, role: m.role, image: m.photoUrl ?? '', video: m.videoUrl, description: m.description ?? '', funFact: m.funFact ?? '' }))
  : fallbackTeam;

const actionImages = about?.inActionImageUrls?.length ? about.inActionImageUrls : fallbackActionImages;
```

Pass `title={about?.valuesTitle}` to `<Values>` and `title={about?.teamTitle}` to `<Team>` (already added in Phase B Task B4).

- [ ] **Step 2: Verify build/lint/manual**

Run: `npm run build && npm run lint`
Expected: pass.
Run `npm run dev`, open About: team cards show CMS photos/videos, values show CMS text + correct icons, the In Action marquee shows CMS images; toggling EN↔DE switches role/description/value text. Removing all CMS team members falls back to the hardcoded trio.

- [ ] **Step 3: Commit**

```bash
git add src/pages/About.tsx src/components/about/Values.tsx src/components/about/Team.tsx
git commit -m "feat(cms): render team, values, and In Action gallery from CMS"
```

**PHASE C COMPLETE — checkpoint:** team can add/reorder members and gallery images from Contentful; all migrated text is bilingual.

---

## Final verification (run after all phases)

- [ ] `npm run lint` → zero warnings.
- [ ] `npm run build` → tsc + vite + sitemap succeed.
- [ ] `npx vite build && grep -rl "CFPAT\|CONTENTFUL_MANAGEMENT_TOKEN" dist/` → prints nothing (token safety).
- [ ] `npm run dev` manual sweep: Home, About, Projects, Services, one Project detail — toggle EN↔DE; confirm CMS text + images in both locales, EN fallback for empty `de-CH` fields, and graceful behaviour if Contentful is unconfigured (temporarily unset env to spot-check fallback).
- [ ] Update `docs/superpowers/specs/2026-06-13-cms-bilingual-content-design.md` status to "Implemented" (optional).

## Notes for the executor

- **Run order:** A1 → A2 → A3 → A4 → A5 → A6, then B1→B4, then C1→C4. CMA scripts must run against the live space in order (locale before localize before seed; types before entries).
- **`seed-team-and-gallery.mjs` is one-shot** — see its note. All other CMA scripts are idempotent.
- **Verify SDK signatures** for `client.upload.create` and `client.asset.create` `uploadFrom` against the installed `contentful-management` version before running C2 (these vary across v10/v11). The `noja-cms` skill documents the asset create→process→publish flow.
- **`src/i18n/de.ts` and `en.ts` stay** as offline fallbacks for migrated fields and as the source of truth for nav/footer/form/cookies/buttons. Do not delete migrated keys.
