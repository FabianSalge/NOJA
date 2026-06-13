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
