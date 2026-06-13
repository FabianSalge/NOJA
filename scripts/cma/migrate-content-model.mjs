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
