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
