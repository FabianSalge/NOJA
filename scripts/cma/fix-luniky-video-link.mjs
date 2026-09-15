// Replace the broken rich-text destination with the project's published video.
// Dry run by default. --apply updates/publishes only an otherwise clean entry.
import { getClient } from "./client.mjs";
import { writeFileSync } from "node:fs";
const { client, scope } = getClient();
try {
  const entryId = "43dHUKbvCvijbqBc7uIt3q";
  const entry = await client.entry.get({ ...scope, entryId });
  const assetId = entry.fields.video?.["en-US"]?.sys?.id;
  if (!assetId) throw new Error("Missing linked video");
  const asset = await client.asset.get({ ...scope, assetId });
  if (!asset.sys.publishedVersion) throw new Error("Video is not published");
  const file = asset.fields.file?.["en-US"];
  if (file?.contentType !== "video/mp4" || !file.url)
    throw new Error("Unexpected video asset");
  const destination = file.url.startsWith("//")
    ? `https:${file.url}`
    : file.url;
  const original = JSON.stringify(entry);
  let changed = 0;
  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (
      node.nodeType === "hyperlink" &&
      [
        "promotional video",
        "https://www.nojaagency.com/projects/promotional%20video",
      ].includes(node.data?.uri)
    ) {
      node.data.uri = destination;
      changed += 1;
    }
    for (const child of Object.values(node)) {
      if (Array.isArray(child)) child.forEach(visit);
      else if (child && typeof child === "object") visit(child);
    }
  }
  visit(entry.fields);
  console.log(
    `Found ${changed} broken links; destination is the linked Luniky MP4.`,
  );
  if (process.argv.includes("--apply") && changed) {
    if (entry.sys.version !== entry.sys.publishedVersion + 1) {
      throw new Error(
        "Entry has unpublished edits; do not publish them implicitly",
      );
    }
    writeFileSync(
      "/tmp/noja-contentful-review/luniky-before-link-fix.json",
      original,
      { mode: 0o600 },
    );
    const updated = await client.entry.update({ ...scope, entryId }, entry);
    await client.entry.publish({ ...scope, entryId }, updated);
    console.log(
      "Published the two link corrections. Other fields are unchanged.",
    );
  }
} catch (error) {
  // SDK errors may contain credentials in their request headers.
  console.error(`Luniky link repair failed: ${error.name}`);
  process.exitCode = 1;
}
