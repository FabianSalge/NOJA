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
