// Read-only sanity check for the CMA connection.
// Lists every content type, its fields, and the entry count per type.
//
//   node --env-file=.env scripts/cma/inventory.mjs

import { getClient, config } from "./client.mjs";

const { client, scope } = getClient();
console.log(`Connected to space ${config.SPACE_ID} / env ${config.ENVIRONMENT_ID}\n`);

const { items: contentTypes } = await client.contentType.getMany({
  ...scope,
  query: { limit: 100 },
});

for (const ct of contentTypes.sort((a, b) => a.name.localeCompare(b.name))) {
  const { total } = await client.entry.getMany({
    ...scope,
    query: { content_type: ct.sys.id, limit: 0 },
  });
  console.log(`\n=== ${ct.name}  (id: ${ct.sys.id})  — ${total} entries`);
  for (const f of ct.fields) {
    const flags = [
      f.required && "required",
      f.disabled && "DISABLED",
      f.omitted && "OMITTED",
    ].filter(Boolean);
    const linkType = f.linkType || f.items?.linkType || "";
    const type = f.type + (linkType ? `(${linkType})` : "");
    console.log(`  - ${f.id}: ${type}${flags.length ? "  [" + flags.join(",") + "]" : ""}`);
  }
}
