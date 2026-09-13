// Enable localized homepage service titles and repair the English values.
// Dry-run by default; --apply publishes only the reviewed title changes.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { getClient } from './client.mjs';

const translations = [
  ['4DAYSr3ZW8fMPPeXmwI9ce', 'Strategy & Creative Direction', 'Strategische & Kreative Direktion'],
  ['1Vnu2qCH809RfhMXNnqzTW', 'Campaign & Project Management', 'Kampagnen- & Projektmanagement'],
  ['ILLQx2S7iEzsrZDGNtwpS', 'Video & Photography', 'Video- & Fotografie'],
  ['50B8MddMk6am3rUxu6vUlY', 'Post-Production & Editing', 'Bearbeitung'],
];

async function main() {
  const { client, scope } = getClient();
  const model = await client.contentType.get({ ...scope, contentTypeId: 'whatYouNeedCard' });
  const entries = await Promise.all(translations.map(async ([entryId]) => client.entry.get({ ...scope, entryId })));
  const isClean = entity => entity.sys.publishedVersion !== undefined && entity.sys.version === entity.sys.publishedVersion + 1;
  assert.ok(isClean(model), 'Content model has unpublished changes; refusing to publish unrelated edits.');
  for (const [index, entry] of entries.entries()) {
    const [, en, de] = translations[index];
    assert.ok(isClean(entry), `Unpublished changes on card ${entry.sys.id}.`);
    assert.ok([en, de].includes(entry.fields.title?.['en-US']), `Unexpected English title on ${entry.sys.id}.`);
    assert.ok(!entry.fields.title?.['de-CH'] || entry.fields.title['de-CH'] === de, `Unexpected German title on ${entry.sys.id}.`);
    console.log(`${entry.sys.id}: en-US = ${en}; de-CH = ${de}`);
  }
  if (!process.argv.includes('--apply')) {
    console.log('Dry run: would localize the title field and publish four translated titles.');
    return;
  }
  const directory = '/tmp/noja-contentful-review';
  await mkdir(directory, { recursive: true });
  const backup = path.join(directory, `home-service-translations-${Date.now()}.json`);
  await writeFile(backup, JSON.stringify({ model, entries }, null, 2), { mode: 0o600 });
  console.log(`Backup: ${backup}`);
  const titleField = model.fields.find(field => field.id === 'title');
  assert.ok(titleField, 'Missing title field.');
  if (!titleField.localized) {
    titleField.localized = true;
    const updated = await client.contentType.update({ ...scope, contentTypeId: model.sys.id }, model);
    await client.contentType.publish({ ...scope, contentTypeId: model.sys.id }, updated);
  }
  for (const [index, original] of entries.entries()) {
    const [entryId, en, de] = translations[index];
    const entry = await client.entry.get({ ...scope, entryId });
    assert.equal(entry.sys.version, original.sys.version, `Card changed since preflight: ${entryId}`);
    if (entry.fields.title['en-US'] === en && entry.fields.title['de-CH'] === de) continue;
    entry.fields.title = { ...entry.fields.title, 'en-US': en, 'de-CH': de };
    const updated = await client.entry.update({ ...scope, entryId }, entry);
    await client.entry.publish({ ...scope, entryId }, updated);
    const verified = await client.entry.get({ ...scope, entryId });
    assert.equal(verified.fields.title['en-US'], en);
    assert.equal(verified.fields.title['de-CH'], de);
    const { title: _beforeTitle, ...before } = original.fields;
    const { title: _afterTitle, ...after } = verified.fields;
    assert.deepEqual(after, before, `Non-title fields changed on ${entryId}`);
  }
  console.log('Published homepage service translations; images, order and page references preserved.');
}

main().catch(error => {
  // SDK errors can contain credentials; print only the error class.
  console.error(`Home service translation repair failed (${error.name}).`);
  process.exitCode = 1;
});
