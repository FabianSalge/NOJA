import { Document, BLOCKS, TopLevelBlock } from "@contentful/rich-text-types";
import type { Asset } from "contentful";
import { contentfulClient, getAssetUrl } from "./contentful";

// Basic types mapped to UI needs
export type CmsBrand = {
	name: string;
	logoUrl?: string;
	websiteUrl?: string;
};

export type CmsWhatYouNeedCard = {
	title: string;
	imageUrl?: string;
	order?: number;
};

export type CmsHome = {
	whatWeDoBestText?: Document;
	brands: CmsBrand[];
	whatYouNeedCards: CmsWhatYouNeedCard[];
};

export type CmsProjectSummary = {
	slug: string;
	title: string;
	subtitle: string;
	dateISO: string; // ISO string to derive year on UI
	coverImageUrl?: string;
};

export type CmsProjectsPage = {
	ourWorkSubtext?: Document;
	featured: CmsProjectSummary[];
	all: CmsProjectSummary[];
};

export type CmsProjectDetail = {
	slug: string;
	title: string;
	subtitle: string;
	dateISO: string;
	coverImageUrl?: string;
	secondImageUrl?: string;
	firstTextTitle: string;
	firstTextBody?: Document;
	quoteImageUrl?: string;
	quote: string;
	secondTextTitle: string;
	secondTextBody?: Document;
};

export type CmsAboutPage = {
	ourStoryText?: Document;
	ourStoryImageUrl?: string;
};

export type CmsServiceItem = {
	title: string;
	subtitle?: string;
	description: string;
	features: string[];
	serviceMediaUrl?: string;
	iconType: string;
	order: number;
	alternateLayout?: boolean;
};

export type CmsServicesPage = {
	heroTitle: string;
	heroSubtitle: string;
	heroBackgroundImageUrl?: string;
	services: CmsServiceItem[];
};

// Helpers to safely read fields
function getField<T>(obj: any, key: string): T | undefined {
	return obj && obj[key] !== undefined ? (obj[key] as T) : undefined;
}

function assetUrlFromField(field: any): string | undefined {
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
	const res = await contentfulClient.getEntries<any>({
		content_type: "homePage",
		include: 2,
		limit: 1,
	});
	const entry = res.items?.[0];
	if (!entry) return undefined;
	const fields = entry.fields ?? {};
	const brands: CmsBrand[] = (fields.brands ?? []).map((b: any) => ({
		name: getField<string>(b.fields, "name") ?? "",
		logoUrl: assetUrlFromField(getField<any>(b.fields, "logo")),
		websiteUrl: getField<string>(b.fields, "websiteUrl"),
	}));
	const whatYouNeedCards: CmsWhatYouNeedCard[] = (fields.whatYouNeedCards ?? [])
		.map((c: any) => ({
			title: getField<string>(c.fields, "title") ?? "",
			imageUrl: assetUrlFromField(getField<any>(c.fields, "image")),
			order: getField<number>(c.fields, "order"),
		}))
		.sort((a: CmsWhatYouNeedCard, b: CmsWhatYouNeedCard) => (a.order ?? 0) - (b.order ?? 0));
	return {
		whatWeDoBestText: getField<Document>(fields, "whatWeDoBestText"),
		brands,
		whatYouNeedCards,
	};
}

export async function fetchProjectsPage(): Promise<CmsProjectsPage> {
	// Fetch settings entry
	const settingsRes = await contentfulClient.getEntries<any>({
		content_type: "projectsPageSettings",
		limit: 1,
	});
	const settings = settingsRes.items?.[0]?.fields ?? {};

	// Fetch projects ordered by date desc
	const projRes = await contentfulClient.getEntries<any>({
		content_type: "project",
		order: ["-fields.date"],
		include: 1,
		limit: 100,
	});
	const allSummaries: CmsProjectSummary[] = (projRes.items ?? []).map((p: any) => ({
		slug: getField<string>(p.fields, "slug") ?? "",
		title: getField<string>(p.fields, "title") ?? "",
		subtitle: getField<string>(p.fields, "subtitle") ?? "",
		dateISO: getField<string>(p.fields, "date") ?? "",
		coverImageUrl: assetUrlFromField(getField<any>(p.fields, "coverImage")),
	}));
	return {
		ourWorkSubtext: getField<Document>(settings, "ourWorkSubtext"),
		featured: allSummaries.slice(0, 3),
		all: allSummaries.slice(3),
	};
}

export async function fetchProjectBySlug(slug: string): Promise<CmsProjectDetail | undefined> {
	const res = await contentfulClient.getEntries<any>({
		content_type: "project",
		"fields.slug": slug,
		include: 2,
		limit: 1,
	});
	const item = res.items?.[0];
	if (!item) return undefined;
	const f = item.fields ?? {};
	return {
		slug: getField<string>(f, "slug") ?? "",
		title: getField<string>(f, "title") ?? "",
		subtitle: getField<string>(f, "subtitle") ?? "",
		dateISO: getField<string>(f, "date") ?? "",
		coverImageUrl: assetUrlFromField(getField<any>(f, "coverImage")),
		secondImageUrl: assetUrlFromField(getField<any>(f, "secondImage")),
		firstTextTitle: getField<string>(f, "firstTextTitle") ?? "",
		firstTextBody: getField<Document>(f, "firstTextBody"),
		quoteImageUrl: assetUrlFromField(getField<any>(f, "quoteImage")),
		quote: getField<string>(f, "quote") ?? "",
		secondTextTitle: getField<string>(f, "secondTextTitle") ?? "",
		secondTextBody: getField<Document>(f, "secondTextBody"),
	};
}

export async function fetchAbout(): Promise<CmsAboutPage | undefined> {
	const res = await contentfulClient.getEntries<any>({
		content_type: "aboutPageSettings",
		include: 1,
		limit: 1,
	});
	const fields = res.items?.[0]?.fields ?? {};
	return {
		ourStoryText: getField<Document>(fields, "ourStoryText"),
		ourStoryImageUrl: assetUrlFromField(getField<any>(fields, "ourStoryImage")),
	};
}

export async function fetchServicesPage(): Promise<CmsServicesPage | undefined> {
	const res = await contentfulClient.getEntries<any>({
		content_type: "servicesPage",
		include: 2,
		limit: 1,
	});
	const entry = res.items?.[0];
	if (!entry) return undefined;
	const fields = entry.fields ?? {};
	
	// Get referenced services and sort by order
	const servicesData = getField<any[]>(fields, "services") ?? [];
	const services: CmsServiceItem[] = servicesData
		.map((service: any) => ({
			title: getField<string>(service.fields, "title") ?? "",
			subtitle: getField<string>(service.fields, "subtitle"),
			description: getField<string>(service.fields, "description") ?? "",
			features: getField<string[]>(service.fields, "features") ?? [],
			serviceMediaUrl: assetUrlFromField(getField<any>(service.fields, "serviceImage")),
			iconType: getField<string>(service.fields, "iconType") ?? "lightbulb",
			order: getField<number>(service.fields, "order") ?? 0,
			alternateLayout: getField<boolean>(service.fields, "alternateLayout") ?? false,
		}))
		.sort((a, b) => a.order - b.order);
	
	return {
		heroTitle: getField<string>(fields, "heroTitle") ?? "",
		heroSubtitle: getField<string>(fields, "heroSubtitle") ?? "",
		heroBackgroundImageUrl: assetUrlFromField(getField<any>(fields, "heroBackgroundImage")),
		services,
	};
}
