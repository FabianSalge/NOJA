import { createClient, type Asset } from "contentful";

const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID as string | undefined;
const environmentId = (import.meta.env.VITE_CONTENTFUL_ENVIRONMENT as string | undefined) || "master";
const usePreview = (import.meta.env.VITE_CONTENTFUL_USE_PREVIEW as string | undefined) === "true";
const deliveryToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN as string | undefined;
const previewToken = import.meta.env.VITE_CONTENTFUL_PREVIEW_ACCESS_TOKEN as string | undefined;

const accessToken = usePreview ? previewToken : deliveryToken;

if (!spaceId || !accessToken) {
	// Fail fast to make missing configuration obvious during development
	// eslint-disable-next-line no-console
	console.warn(
		"Contentful is not fully configured. Please set VITE_CONTENTFUL_SPACE_ID and VITE_CONTENTFUL_ACCESS_TOKEN in your .env file."
	);
}

export const contentfulClient = createClient({
	space: spaceId ?? "",
	environment: environmentId,
	accessToken: accessToken ?? "",
	host: usePreview ? "preview.contentful.com" : undefined,
});

export function getAssetUrl(asset: Asset | undefined): string | undefined {
	const url = asset && (asset.fields as any)?.file?.url;
	if (!url) return undefined;
	return url.startsWith("http") ? url : `https:${url}`;
}

export function isContentfulConfigured(): boolean {
	return Boolean(spaceId && accessToken);
}
