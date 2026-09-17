// Complete the approved Services rollout. Dry-run unless --apply is supplied.
// Keep old entries available; publish children before switching page references.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { getClient } from "./client.mjs";
import {
  feedbackServices,
  feedbackServicesSubtitle,
} from "../../src/content/service-categories.ts";

const categoryIds = [
  "feedback-brand-design",
  "feedback-film-photo",
  "feedback-content-campaigns",
];
const cardIds = [
  "services-card-brand-design",
  "services-card-film-photo",
  "services-card-content-campaigns",
];
const imageSourceIds = [
  "4DAYSr3ZW8fMPPeXmwI9ce",
  "ILLQx2S7iEzsrZDGNtwpS",
  "1Vnu2qCH809RfhMXNnqzTW",
];
const link = (id) => ({ sys: { type: "Link", linkType: "Entry", id } });
const clean = (entry) =>
  entry.sys.publishedVersion !== undefined &&
  entry.sys.version === entry.sys.publishedVersion + 1;

async function main() {
  const { client, scope } = getClient();
  const get = (entryId) => client.entry.get({ ...scope, entryId });
  const [home, services, ...categories] = await Promise.all([
    get("6erVDgdPic0Rjd89orRGgQ"),
    get("6WpbELbKyeq3LfPOpPgR1a"),
    ...categoryIds.map(get),
  ]);
  assert.ok(
    clean(home) && clean(services),
    "Page entries have unrelated unpublished edits.",
  );
  const originals = await Promise.all(imageSourceIds.map(get));
  const cards = originals.map((entry, index) => ({
    title: {
      "en-US": feedbackServices("en")[index].title,
      "de-CH": feedbackServices("de")[index].title,
    },
    image: entry.fields.image,
    order: { "en-US": index + 1 },
  }));
  const existingCards = await Promise.all(
    cardIds.map(
      async (id) =>
        (
          await client.entry.getMany({
            ...scope,
            query: { "sys.id": id, limit: 1 },
          })
        ).items[0] || null,
    ),
  );
  for (const [index, entry] of categories.entries()) {
    assert.ok(
      !entry.sys.publishedVersion || clean(entry),
      `Unpublished edits on ${entry.sys.id}`,
    );
    for (const [language, locale] of [
      ["en", "en-US"],
      ["de", "de-CH"],
    ]) {
      const expected = feedbackServices(language)[index];
      for (const field of ["title", "subtitle", "description", "features"]) {
        assert.deepEqual(
          entry.fields[field]?.[locale],
          expected[field],
          `Review changed draft: ${entry.sys.id}/${field}/${locale}`,
        );
      }
    }
    assert.equal(entry.fields.order["en-US"], index + 1);
    assert.equal(entry.fields.alternateLayout["en-US"], index % 2 === 0);
    if (existingCards[index]) {
      assert.ok(
        !existingCards[index].sys.publishedVersion ||
          clean(existingCards[index]),
        `Unpublished edits on ${cardIds[index]}`,
      );
      assert.deepEqual(
        existingCards[index].fields,
        cards[index],
        `Unexpected existing card: ${cardIds[index]}`,
      );
    }
  }
  // Every reused asset must already be published; never publish unrelated assets.
  const assetIds = new Set([
    ...categories.map((e) => e.fields.serviceImage?.["en-US"]?.sys.id),
    ...cards.map((c) => c.image?.["en-US"]?.sys.id),
  ]);
  assert.ok(!assetIds.has(undefined), "Missing category/card media.");
  for (const assetId of assetIds) {
    const asset = await client.asset.get({ ...scope, assetId });
    assert.ok(asset.sys.publishedVersion, `Unpublished media: ${assetId}`);
  }
  const patches = [
    [
      services,
      {
        services: { "en-US": categoryIds.map(link) },
        heroSubtitle: {
          "en-US": feedbackServicesSubtitle.en,
          "de-CH": feedbackServicesSubtitle.de,
        },
      },
    ],
    [
      home,
      {
        whatYouNeedCards: { "en-US": cardIds.map(link) },
        servicesSectionSubtitle: {
          "en-US": feedbackServicesSubtitle.en,
          "de-CH": feedbackServicesSubtitle.de,
        },
      },
    ],
  ];
  console.log(
    "Ready: three bilingual services, three matching homepage cards, and both page references/subtitles.",
  );
  if (!process.argv.includes("--apply"))
    return console.log("Dry run complete; nothing published.");
  await mkdir("/tmp/noja-contentful-review", { recursive: true });
  const backup = `/tmp/noja-contentful-review/services-rollout-${Date.now()}.json`;
  await writeFile(
    backup,
    JSON.stringify(
      { home, services, categories, originals, existingCards },
      null,
      2,
    ),
    { mode: 0o600 },
  );
  console.log(`Backup: ${backup}`);
  for (const entry of categories) {
    const current = await get(entry.sys.id);
    assert.equal(
      current.sys.version,
      entry.sys.version,
      "Category changed during preflight.",
    );
    if (!current.sys.publishedVersion)
      await client.entry.publish({ ...scope, entryId: entry.sys.id }, current);
  }
  for (const [index, entryId] of cardIds.entries()) {
    if (existingCards[index]?.sys.publishedVersion) continue;
    const entry =
      existingCards[index] ||
      (await client.entry.createWithId(
        { ...scope, contentTypeId: "whatYouNeedCard", entryId },
        { fields: cards[index] },
      ));
    await client.entry.publish({ ...scope, entryId }, entry);
  }
  for (const [original, patch] of patches) {
    const entryId = original.sys.id;
    const current = await get(entryId);
    assert.equal(
      current.sys.version,
      original.sys.version,
      "Page changed during preflight.",
    );
    const fields = { ...current.fields, ...patch };
    if (JSON.stringify(fields) === JSON.stringify(current.fields)) continue;
    const updated = await client.entry.update(
      { ...scope, entryId },
      { ...current, fields },
    );
    await client.entry.publish({ ...scope, entryId }, updated);
    const verified = await get(entryId);
    assert.deepEqual(verified.fields, fields, "Unexpected content changed.");
  }
  console.log(
    "Published Services rollout. Old service/card entries remain available.",
  );
}
main().catch((error) => {
  console.error(`Services rollout failed (${error.name}).`);
  process.exitCode = 1;
});
