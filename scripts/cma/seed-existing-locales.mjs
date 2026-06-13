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
