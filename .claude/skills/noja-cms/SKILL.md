---
name: noja-cms
description: Use when reading or editing NOJA's Contentful content programmatically — changing entry fields, adding content types, bulk updates, or working in scripts/cma/. Covers the token policy, the content model, and the management-SDK patterns/gotchas.
---

# NOJA Contentful (CMS) Skill

NOJA's content lives in Contentful. The website reads it with the **Delivery API** (read-only); developers edit it with the **Content Management API (CMA)** via `scripts/cma/`. Use this instead of hand-editing in the Contentful web UI.

## Token policy (do not violate)

- **Site / production:** read-only `VITE_CONTENTFUL_ACCESS_TOKEN` only (used in `src/lib/contentful.ts`). Never put a write token in `src/`.
- **Dev / scripts:** write token `CONTENTFUL_MANAGEMENT_TOKEN` (a `CFPAT-…` Personal Access Token). It has **no `VITE_` prefix** on purpose, so Vite never bundles it.
- After any change that could touch env handling, verify the write token is absent from the build:
  ```bash
  npx vite build && grep -rl "CFPAT\|CONTENTFUL_MANAGEMENT_TOKEN" dist/   # must print nothing
  ```
- Both tokens live in `.env` (gitignored). To create a write token: Contentful → Settings → API keys → Content management tokens.

## Running scripts

```bash
npm run cms:inventory                              # lists content types, fields, entry counts (also a connection test)
node --env-file=.env scripts/cma/<script>.mjs      # any CMA script — the --env-file flag loads .env for Node
```
`scripts/cma/client.mjs` exports `getClient()` → `{ client, scope }` where `scope = { spaceId, environmentId }`. Spread `...scope` into every call.

## Content model (8 types, default locale `en-US`)

Singletons (1 entry each): `homePage`, `servicesPage`, `aboutPageSettings`, `projectsPageSettings`.
Collections: `project`, `serviceItem`, `whatYouNeedCard`, `brand`.

Run `npm run cms:inventory` for the live field list. Fetch/transform logic is in `src/lib/cms.ts`; types in `src/lib/cms.types.ts`.

**Frontend ↔ CMS quirks to know:**
- **German is NOT in Contentful.** Contentful has only `en-US`. German text comes from the app's i18n layer (`src/i18n/de.ts`). Several pages render CMS rich text only when `language === 'en'` and fall back to static German strings — so editing CMS rich text won't change the German site.
- `servicesPage.heroBackgroundImage` is optional; renders only when set.
- Projects page shows everything in the main grid until there are >6 projects, then splits off a "more work" grid (see `fetchProjectsPage` in `cms.ts`).

## SDK patterns & gotchas (contentful-management v11)

**Gotcha 1 — plain client:** `createClient(...)` defaults to the scoped "plain" API here, so there is **no `client.getSpace()`**. Always create it as plain (already done in `client.mjs`):
```js
createClient({ accessToken }, { type: "plain" })
// then: client.contentType.getMany({...scope, query}), client.entry.get({...scope, entryId}), etc.
```

**Gotcha 2 — fields are locale-keyed and updates need the version.** The CMA returns `fields.<id>['en-US']` (not flat like delivery), and `update`/`publish` require the current `sys.version`. Always get → mutate → update → publish:

```js
// scripts/cma/example-update.mjs  →  node --env-file=.env scripts/cma/example-update.mjs
import { getClient } from "./client.mjs";

const { client, scope } = getClient();
const entryId = "REPLACE_ME";

const entry = await client.entry.get({ ...scope, entryId });   // includes sys.version
entry.fields.title = { ...(entry.fields.title || {}), "en-US": "New title" };

const updated = await client.entry.update({ ...scope, entryId }, entry);  // pass the whole entry
await client.entry.publish({ ...scope, entryId }, updated);               // pass the UPDATED entry
console.log("done — now v", updated.sys.version);
```

Find an entry id without knowing it:
```js
const { items } = await client.entry.getMany({ ...scope, query: { content_type: "project", "fields.slug": "luniky", limit: 1 } });
```

Tips: link fields use `{ "en-US": { sys: { type: "Link", linkType: "Asset"|"Entry", id } } }`; uploading new assets is a separate `client.asset.create` → `processForAllLocales` → `publish` flow. Always re-publish after updating, or the live (delivery) site won't see the change.
