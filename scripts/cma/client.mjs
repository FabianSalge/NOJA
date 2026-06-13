// Shared Contentful Content Management API (CMA) client.
//
// The site itself only uses the read-only Delivery API. These scripts use the
// CMA so we can create/update/publish entries without hand-editing in the web UI.
//
// Requires a Management token (Personal Access Token) — NOT the delivery token.
// Create one at: Contentful → Settings → API keys → Content management tokens.
//
// Run scripts with the env file loaded, e.g.:
//   node --env-file=.env scripts/cma/inventory.mjs
//
// .env must contain (never prefix with VITE_ — it must not ship to the browser):
//   CONTENTFUL_MANAGEMENT_TOKEN=CFPAT-xxxxxxxx

import { createClient } from "contentful-management";

const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const SPACE_ID = process.env.VITE_CONTENTFUL_SPACE_ID;
const ENVIRONMENT_ID = process.env.VITE_CONTENTFUL_ENVIRONMENT || "master";

export function assertConfigured() {
  const missing = [];
  if (!MANAGEMENT_TOKEN) missing.push("CONTENTFUL_MANAGEMENT_TOKEN");
  if (!SPACE_ID) missing.push("VITE_CONTENTFUL_SPACE_ID");
  if (missing.length) {
    console.error(
      `Missing env var(s): ${missing.join(", ")}.\n` +
        "Add them to .env and run with:  node --env-file=.env scripts/cma/<script>.mjs"
    );
    process.exit(1);
  }
}

// `scope` is { spaceId, environmentId } — pre-filled params every plain-client call needs.
// Returns the plain (scoped) CMA client plus that scope for convenience.
//
//   const { client, scope } = getClient();
//   const cts = await client.contentType.getMany({ ...scope, query: { limit: 100 } });
//   const entry = await client.entry.get({ ...scope, entryId });
export function getClient() {
  assertConfigured();
  const client = createClient({ accessToken: MANAGEMENT_TOKEN }, { type: "plain" });
  return { client, scope: { spaceId: SPACE_ID, environmentId: ENVIRONMENT_ID } };
}

export const config = { SPACE_ID, ENVIRONMENT_ID };
