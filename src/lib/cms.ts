import { Document, BLOCKS, TopLevelBlock } from "@contentful/rich-text-types";
import type { Asset, Entry } from "contentful";
import { contentfulClient, getAssetUrl, cachedGetEntries, isContentfulConfigured } from "./contentful";
import type {
    CmsAboutPage,
    CmsHome,
    CmsProjectDetail,
    CmsProjectsPage,
    CmsProjectSummary,
    CmsServiceItem,
    CmsServicesPage,
    CmsWhatYouNeedCard,
    CmsBrand,
} from "./cms.types";
export type {
    CmsAboutPage,
    CmsHome,
    CmsProjectDetail,
    CmsProjectsPage,
    CmsProjectSummary,
    CmsServiceItem,
    CmsServicesPage,
    CmsWhatYouNeedCard,
    CmsBrand,
} from "./cms.types";

// Minimal helper types for Contentful results
type EntriesResult = { items?: Entry[] };

// Types moved to cms.types.ts

// Helpers to safely read fields
function getField<T>(obj: Record<string, unknown> | undefined, key: string): T | undefined {
	return obj && obj[key] !== undefined ? (obj[key] as T) : undefined;
}

function assetUrlFromField(field: unknown): string | undefined {
	return getAssetUrl(field as Asset | undefined);
}

export function splitDocumentByParagraphs(doc: Document): [Document, Document] {
	const totalParagraphs = doc.content.filter((n: TopLevelBlock) => n.nodeType === BLOCKS.PARAGRAPH).length;
	const cutoff = Math.ceil(totalParagraphs / 2);
	let seen = 0;
	const leftNodes: TopLevelBlock[] = [];
	const rightNodes: TopLevelBlock[] = [];

	for (const node of doc.content) {
		const isPara = node.nodeType === BLOCKS.PARAGRAPH;
		const goesLeft = seen < cutoff;
		if (goesLeft) leftNodes.push(node); else rightNodes.push(node);
		if (isPara) seen += 1;
	}

	return [
		{ ...doc, content: leftNodes },
		{ ...doc, content: rightNodes },
	];
}

// Queries
export async function fetchHome(): Promise<CmsHome | undefined> {
	if (!isContentfulConfigured()) return undefined;
	const res = await cachedGetEntries<EntriesResult>({
		content_type: "homePage",
		include: 2,
		limit: 1,
	});
	const entry = res.items?.[0];
	if (!entry) return undefined;
	const fields = (entry as Entry).fields as Record<string, unknown>;
	const brandsRaw = (fields.brands as Entry[] | undefined) ?? [];
	const brands: CmsBrand[] = brandsRaw.map((b: Entry) => ({
		name: getField<string>(b.fields as Record<string, unknown>, "name") ?? "",
		logoUrl: assetUrlFromField(getField<Asset>(b.fields as Record<string, unknown>, "logo")),
		websiteUrl: getField<string>(b.fields as Record<string, unknown>, "websiteUrl"),
	}));
	const cardsRaw = (fields.whatYouNeedCards as Entry[] | undefined) ?? [];
	const whatYouNeedCards: CmsWhatYouNeedCard[] = cardsRaw
		.map((c: Entry) => ({
			title: getField<string>(c.fields as Record<string, unknown>, "title") ?? "",
			imageUrl: assetUrlFromField(getField<Asset>(c.fields as Record<string, unknown>, "image")),
			order: getField<number>(c.fields as Record<string, unknown>, "order"),
		}))
		.sort((a: CmsWhatYouNeedCard, b: CmsWhatYouNeedCard) => (a.order ?? 0) - (b.order ?? 0));
	return {
		whatWeDoBestText: getField<Document>(fields, "whatWeDoBestText"),
		brands,
		whatYouNeedCards,
	};
}

export async function fetchProjectsPage(): Promise<CmsProjectsPage> {
	if (!isContentfulConfigured()) {
		return { ourWorkSubtext: undefined, featured: [], all: [] };
	}
	// Fetch settings entry
	const settingsRes = await cachedGetEntries<EntriesResult>({
		content_type: "projectsPageSettings",
		limit: 1,
	});
	const settings = settingsRes.items?.[0]?.fields ?? {};

	// Fetch projects ordered by date desc
	const projRes = await cachedGetEntries<EntriesResult>({
		content_type: "project",
		order: ["-fields.date"],
		include: 1,
		limit: 100,
	});
	const allSummaries: CmsProjectSummary[] = (projRes.items ?? []).map((p: Entry) => ({
		slug: getField<string>(p.fields as Record<string, unknown>, "slug") ?? "",
		title: getField<string>(p.fields as Record<string, unknown>, "title") ?? "",
		subtitle: getField<string>(p.fields as Record<string, unknown>, "subtitle") ?? "",
		dateISO: getField<string>(p.fields as Record<string, unknown>, "date") ?? "",
		coverImageUrl: assetUrlFromField(getField<Asset>(p.fields as Record<string, unknown>, "coverImage")),
	}));
	return {
		ourWorkSubtext: getField<Document>(settings as Record<string, unknown>, "ourWorkSubtext"),
		featured: allSummaries.slice(0, 3),
		all: allSummaries.slice(3),
	};
}

export async function fetchProjectBySlug(slug: string): Promise<CmsProjectDetail | undefined> {
	if (!isContentfulConfigured()) return undefined;
	const res = await cachedGetEntries<EntriesResult>({
		content_type: "project",
		"fields.slug": slug,
		include: 2,
		limit: 1,
	});
	const item = res.items?.[0];
	if (!item) return undefined;
	const f = (item as Entry).fields as Record<string, unknown>;
	return {
		slug: getField<string>(f, "slug") ?? "",
		title: getField<string>(f, "title") ?? "",
		subtitle: getField<string>(f, "subtitle") ?? "",
		dateISO: getField<string>(f, "date") ?? "",
		coverImageUrl: assetUrlFromField(getField<Asset>(f, "coverImage")),
		secondImageUrl: assetUrlFromField(getField<Asset>(f, "secondImage")),
		firstTextTitle: getField<string>(f, "firstTextTitle") ?? "",
		firstTextBody: getField<Document>(f, "firstTextBody"),
		quoteImageUrl: assetUrlFromField(getField<Asset>(f, "quoteImage")),
		quote: getField<string>(f, "quote") ?? "",
		secondTextTitle: getField<string>(f, "secondTextTitle") ?? "",
		secondTextBody: getField<Document>(f, "secondTextBody"),
	};
}

export async function fetchAbout(): Promise<CmsAboutPage | undefined> {
	if (!isContentfulConfigured()) return undefined;
	const res = await cachedGetEntries<EntriesResult>({
		content_type: "aboutPageSettings",
		include: 1,
		limit: 1,
	});
	const fields = res.items?.[0]?.fields ?? {};
	return {
		ourStoryText: getField<Document>(fields as Record<string, unknown>, "ourStoryText"),
		ourStoryImageUrl: assetUrlFromField(getField<Asset>(fields as Record<string, unknown>, "ourStoryImage")),
	};
}

export async function fetchServicesPage(): Promise<CmsServicesPage | undefined> {
	if (!isContentfulConfigured()) return undefined;
	const res = await cachedGetEntries<EntriesResult>({
		content_type: "servicesPage",
		include: 2,
		limit: 1,
	});
	const entry = res.items?.[0];
	if (!entry) return undefined;
	const fields = (entry as Entry).fields as Record<string, unknown>;
	
	// Get referenced services and sort by order
	const servicesData = (getField<Entry[]>(fields, "services") ?? []);
	const services: CmsServiceItem[] = servicesData
		.map((service: Entry) => ({
			title: getField<string>(service.fields as Record<string, unknown>, "title") ?? "",
			description: getField<string>(service.fields as Record<string, unknown>, "description") ?? "",
			features: getField<string[]>(service.fields as Record<string, unknown>, "features") ?? [],
			serviceMediaUrl: assetUrlFromField(getField<Asset>(service.fields as Record<string, unknown>, "serviceImage")),
			order: getField<number>(service.fields as Record<string, unknown>, "order") ?? 0,
			alternateLayout: getField<boolean>(service.fields as Record<string, unknown>, "alternateLayout") ?? false,
		}))
		.sort((a, b) => a.order - b.order);
	
	return {
		heroTitle: getField<string>(fields, "heroTitle") ?? "",
		heroSubtitle: getField<string>(fields, "heroSubtitle") ?? "",
		heroBackgroundImageUrl: assetUrlFromField(getField<Asset>(fields, "heroBackgroundImage")),
		services,
	};
}
