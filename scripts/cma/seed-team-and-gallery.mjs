// scripts/cma/seed-team-and-gallery.mjs
// Run ONCE: node --env-file=.env scripts/cma/seed-team-and-gallery.mjs
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { getClient } from "./client.mjs";
import { COPY } from "./lib/i18n-data.mjs";

const { client, scope } = getClient();
const PUB = resolve(process.cwd(), "public");
const CT_MAP = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", mp4: "video/mp4" };

async function uploadAsset(relPath, title) {
  const abs = resolve(PUB, relPath);
  const data = await readFile(abs);
  const ext = relPath.split(".").pop().toLowerCase();
  const upload = await client.upload.create({ spaceId: scope.spaceId }, { file: data });
  const fileName = relPath.split("/").pop();
  let asset = await client.asset.create({ ...scope }, {
    fields: {
      title: { "en-US": title },
      file: { "en-US": { contentType: CT_MAP[ext], fileName, uploadFrom: { sys: { type: "Link", linkType: "Upload", id: upload.sys.id } } } },
    },
  });
  asset = await client.asset.processForAllLocales({ ...scope }, asset);
  for (let i = 0; i < 30; i++) {
    const fresh = await client.asset.get({ ...scope, assetId: asset.sys.id });
    if (fresh.fields.file?.["en-US"]?.url) { asset = fresh; break; }
    await new Promise((r) => setTimeout(r, 1000));
  }
  await client.asset.publish({ ...scope, assetId: asset.sys.id }, asset);
  console.log(`  uploaded ${relPath}`);
  return asset.sys.id;
}
const link = (id, linkType = "Asset") => ({ sys: { type: "Link", linkType, id } });

// 1) aboutValue entries
const valueIds = [];
for (const v of COPY.values) {
  const entry = await client.entry.create({ ...scope, contentTypeId: "aboutValue" }, {
    fields: {
      title: { "en-US": v.title.en, "de-CH": v.title.de },
      description: { "en-US": v.description.en, "de-CH": v.description.de },
      icon: { "en-US": v.icon },
      order: { "en-US": v.order },
    },
  });
  await client.entry.publish({ ...scope, entryId: entry.sys.id }, entry);
  valueIds.push(entry.sys.id);
  console.log(`  created aboutValue ${v.icon}`);
}

// 2) teamMember entries (with uploaded photo + video)
const teamIds = [];
for (const m of COPY.team) {
  const photoId = await uploadAsset(`images/team-pictures/${m.photo}`, `${m.name} photo`);
  const videoId = m.video ? await uploadAsset(`images/team-pictures/${m.video}`, `${m.name} video`) : null;
  const fields = {
    name: { "en-US": m.name },
    role: { "en-US": m.role.en, "de-CH": m.role.de },
    description: { "en-US": m.description.en, "de-CH": m.description.de },
    funFact: { "en-US": m.funFact.en, "de-CH": m.funFact.de },
    photo: { "en-US": link(photoId) },
    order: { "en-US": m.order },
  };
  if (videoId) fields.hoverVideo = { "en-US": link(videoId) };
  const entry = await client.entry.create({ ...scope, contentTypeId: "teamMember" }, { fields });
  await client.entry.publish({ ...scope, entryId: entry.sys.id }, entry);
  teamIds.push(entry.sys.id);
  console.log(`  created teamMember ${m.name}`);
}

// 3) In Action gallery assets (18 slides)
const ACTION = ["slide-01.png","slide-02.jpg","slide-03.png","slide-04.png","slide-05.png","slide-06.jpg","slide-07.jpg","slide-08.jpg","slide-09.png","slide-10.png","slide-11.png","slide-12-lecle.png","slide-13-naomi.jpg","slide-14-talia.png","slide-15.png","slide-16.png","slide-17.png","slide-18.png"];
const galleryIds = [];
for (const f of ACTION) {
  galleryIds.push(await uploadAsset(`images/action-slider/${f}`, `In Action ${f}`));
}

// 4) link everything onto aboutPageSettings
const { items } = await client.entry.getMany({ ...scope, query: { content_type: "aboutPageSettings", limit: 1 } });
const about = items[0];
about.fields.aboutValues = { "en-US": valueIds.map((id) => link(id, "Entry")) };
about.fields.teamMembers = { "en-US": teamIds.map((id) => link(id, "Entry")) };
about.fields.inActionImages = { "en-US": galleryIds.map((id) => link(id, "Asset")) };
const updated = await client.entry.update({ ...scope, entryId: about.sys.id }, about);
await client.entry.publish({ ...scope, entryId: about.sys.id }, updated);
console.log("linked values/team/gallery onto aboutPageSettings");
console.log("seed-team-and-gallery done");
