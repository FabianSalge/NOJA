// Prints the proposed changes by default. --apply creates CMS fields and DRAFT
// services; it never changes page references or publishes content entries.
import {
  feedbackServices,
  feedbackServicesSubtitle,
} from '../../src/content/service-categories.ts';

const models = {
  project: [
    {
      id: 'previewVideo',
      name: 'Preview Video (optional short portrait loop)',
      type: 'Link',
      linkType: 'Asset',
      validations: [{ linkMimetypeGroup: ['video'] }],
    },
    {
      id: 'galleryMedia',
      name: 'Project Gallery (drag to reorder)',
      type: 'Array',
      items: {
        type: 'Link',
        linkType: 'Asset',
        validations: [{ linkMimetypeGroup: ['image', 'video'] }],
      },
    },
  ],
  serviceItem: [
    {
      id: 'subtitle',
      name: 'Category Subtitle',
      type: 'Symbol',
      localized: true,
    },
  ],
};
const ids = [
  'feedback-brand-design',
  'feedback-film-photo',
  'feedback-content-campaigns',
];
const drafts = feedbackServices('en').map((service, index) => {
  const german = feedbackServices('de')[index];
  return {
    id: ids[index],
    fields: {
      title: { 'en-US': service.title, 'de-CH': german.title },
      subtitle: { 'en-US': service.subtitle, 'de-CH': german.subtitle },
      description: {
        'en-US': service.description,
        'de-CH': german.description,
      },
      features: { 'en-US': service.features, 'de-CH': german.features },
      order: { 'en-US': index + 1 },
      alternateLayout: { 'en-US': service.alternateLayout },
    },
  };
});

if (!process.argv.includes('--apply')) {
  console.log(
    JSON.stringify(
      {
        models,
        optionalProjectFields: ['quote', 'quoteImage'],
        requiredProjectFields: ['title'],
        uniqueProjectFields: ['slug'],
        drafts,
        proposedHeroSubtitle: feedbackServicesSubtitle,
      },
      null,
      2,
    ),
  );
} else {
  const { getClient } = await import('./client.mjs');
  const { client, scope } = getClient();
  try {
    for (const [contentTypeId, additions] of Object.entries(models)) {
      const model = await client.contentType.get({ ...scope, contentTypeId });
      let changed = false;
      for (const field of additions) {
        if (!model.fields.some((existing) => existing.id === field.id)) {
          model.fields.push({
            required: false,
            localized: false,
            disabled: false,
            omitted: false,
            ...field,
          });
          changed = true;
        }
      }
      if (contentTypeId === 'project') {
        for (const field of model.fields) {
          if (['quote', 'quoteImage'].includes(field.id) && field.required) {
            field.required = false;
            changed = true;
          }
          if (field.id === 'title' && !field.required) {
            field.required = true;
            changed = true;
          }
          if (field.id === 'slug' && !field.validations?.some((validation) => validation.unique)) {
            field.validations = [...(field.validations || []), { unique: true }];
            changed = true;
          }
        }
      }
      if (changed) {
        const updated = await client.contentType.update(
          { ...scope, contentTypeId },
          model,
        );
        await client.contentType.publish({ ...scope, contentTypeId }, updated);
        console.log(`Updated model: ${contentTypeId}`);
      }
    }
    // Do not overwrite drafts an editor may already have refined.
    for (const draft of drafts) {
      const existing = await client.entry.getMany({
        ...scope,
        query: { 'sys.id': draft.id, limit: 1 },
      });
      if (existing.items.length) {
        console.log(`Kept existing entry: ${draft.id}`);
        continue;
      }
      await client.entry.createWithId(
        { ...scope, contentTypeId: 'serviceItem', entryId: draft.id },
        { fields: draft.fields },
      );
      console.log(`Created draft: ${draft.id}`);
    }
    console.log(
      'Drafts prepared. Assign media and review translations before publishing and changing servicesPage references.',
    );
  } catch (error) {
    // SDK errors can include request headers; do not log the error object.
    console.error(
      `CMS preparation failed: ${error.name}. No content entries were published.`,
    );
    process.exitCode = 1;
  }
}
