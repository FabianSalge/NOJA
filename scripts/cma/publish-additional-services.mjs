// Publish slide 6 as two standalone service sections. Dry-run unless --apply.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { getClient } from "./client.mjs";
import { additionalServices } from "../../src/content/additional-services.ts";

const categoryIds = [
  "feedback-brand-design",
  "feedback-film-photo",
  "feedback-content-campaigns",
];
const additionalIds = ["feedback-brand-identity", "feedback-graphic-design"];
// Reuse published creative-work imagery; new copy does not require client-created pages.
const assetIds = ["5oEYPCggssIWb53kx4KdhA", "2qdkIPjeC77tgrUcxkZ7Ez"];
const link = (id, linkType = "Entry") => ({
  sys: { type: "Link", linkType, id },
});
const clean = (entry) =>
  entry.sys.publishedVersion !== undefined &&
  entry.sys.version === entry.sys.publishedVersion + 1;

async function main() {
  const { client, scope } = getClient();
  const get = (entryId) => client.entry.get({ ...scope, entryId });
  const page = await get("6WpbELbKyeq3LfPOpPgR1a");
  const brand = await get(categoryIds[0]);
  assert.ok(
    clean(page) && clean(brand),
    "Unrelated unpublished edits require review.",
  );
  const ids = page.fields.services["en-US"].map((item) => item.sys.id);
  assert.ok(
    JSON.stringify(ids) === JSON.stringify(categoryIds) ||
      JSON.stringify(ids) ===
        JSON.stringify([...categoryIds, ...additionalIds]),
    "Unexpected page references.",
  );
  const existing = [];
  const planned = [];
  for (const [index, entryId] of additionalIds.entries()) {
    const asset = await client.asset.get({
      ...scope,
      assetId: assetIds[index],
    });
    assert.ok(
      asset.sys.publishedVersion,
      "Section image must already be published.",
    );
    const fields = {
      serviceImage: { "en-US": link(assetIds[index], "Asset") },
      order: { "en-US": index + 4 },
      alternateLayout: { "en-US": index % 2 !== 0 },
    };
    for (const [language, locale] of [
      ["en", "en-US"],
      ["de", "de-CH"],
    ]) {
      const content = additionalServices(language)[index];
      for (const field of ["title", "description", "features"]) {
        fields[field] ??= {};
        fields[field][locale] = content[field];
      }
    }
    const entry = (
      await client.entry.getMany({
        ...scope,
        query: { "sys.id": entryId, limit: 1 },
      })
    ).items[0];
    if (entry) {
      assert.ok(
        !entry.sys.publishedVersion || clean(entry),
        "Unpublished section edits require review.",
      );
      assert.deepEqual(
        entry.fields,
        fields,
        "Existing section differs from slide 6 copy.",
      );
    }
    existing.push(entry || null);
    planned.push(fields);
  }
  // Remove only the nested copy created in this task before the user clarified
  // that the additions must be independent sections. Never discard editor changes.
  if (brand.fields.groups) {
    for (const [language, locale] of [
      ["en", "en-US"],
      ["de", "de-CH"],
    ]) {
      const expected = additionalServices(language).map(
        ({ title, description, features }, index) => ({
          title,
          description,
          features:
            index === 1
              ? [...features, language === "en" ? "Web Design" : "Webdesign"]
              : features,
        }),
      );
      assert.deepEqual(
        brand.fields.groups[locale],
        expected,
        "Nested content changed; review first.",
      );
    }
  }
  console.log(
    "Ready: add standalone Brand & Identity and Graphic Design sections after the existing three categories.",
  );
  if (!process.argv.includes("--apply"))
    return console.log("Dry run complete; no changes.");
  await mkdir("/tmp/noja-contentful-review", { recursive: true });
  const backup = `/tmp/noja-contentful-review/additional-services-${Date.now()}.json`;
  await writeFile(
    backup,
    JSON.stringify({ page, brand, existing, planned }, null, 2),
    { mode: 0o600 },
  );
  console.log(`Backup: ${backup}`);
  for (const [index, entryId] of additionalIds.entries()) {
    if (existing[index]?.sys.publishedVersion) continue;
    const entry =
      existing[index] ||
      (await client.entry.createWithId(
        { ...scope, contentTypeId: "serviceItem", entryId },
        { fields: planned[index] },
      ));
    await client.entry.publish({ ...scope, entryId }, entry);
  }
  const current = await get(page.sys.id);
  assert.equal(
    current.sys.version,
    page.sys.version,
    "Page changed during preflight.",
  );
  const fields = {
    ...current.fields,
    services: {
      ...current.fields.services,
      "en-US": [...categoryIds, ...additionalIds].map((id) => link(id)),
    },
  };
  if (JSON.stringify(fields) !== JSON.stringify(current.fields)) {
    const updated = await client.entry.update(
      { ...scope, entryId: page.sys.id },
      { ...current, fields },
    );
    await client.entry.publish({ ...scope, entryId: page.sys.id }, updated);
  }
  if (brand.fields.groups) {
    const currentBrand = await get(brand.sys.id);
    assert.equal(
      currentBrand.sys.version,
      brand.sys.version,
      "Brand category changed during preflight.",
    );
    const brandFields = { ...currentBrand.fields };
    delete brandFields.groups;
    const updated = await client.entry.update(
      { ...scope, entryId: brand.sys.id },
      { ...currentBrand, fields: brandFields },
    );
    await client.entry.publish({ ...scope, entryId: brand.sys.id }, updated);
    assert.deepEqual((await get(brand.sys.id)).fields, brandFields);
  }
  const verified = await get(page.sys.id);
  assert.deepEqual(verified.fields, fields);
  assert.ok(clean(verified));
  console.log(
    "Published five standalone Services sections in English and German. Homepage category cards unchanged.",
  );
}

main().catch((error) => {
  console.error(`Additional services failed (${error.name}).`);
  process.exitCode = 1;
});
