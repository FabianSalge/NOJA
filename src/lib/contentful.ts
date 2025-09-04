import { createClient, type Asset } from "contentful";

const spaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID as string | undefined;
const environmentId = (import.meta.env.VITE_CONTENTFUL_ENVIRONMENT as string | undefined) || "master";
const usePreview = (import.meta.env.VITE_CONTENTFUL_USE_PREVIEW as string | undefined) === "true";
const deliveryToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN as string | undefined;
const previewToken = import.meta.env.VITE_CONTENTFUL_PREVIEW_ACCESS_TOKEN as string | undefined;

const accessToken = usePreview ? previewToken : deliveryToken;

if (!spaceId || !accessToken) {
	// Fail fast to make missing configuration obvious during development
	console.warn(
		"Contentful is not fully configured."
	);
}

export const contentfulClient = createClient({
	space: spaceId ?? "",
	environment: environmentId,
	accessToken: accessToken ?? "",
	host: usePreview ? "preview.contentful.com" : undefined,
});

export function getAssetUrl(asset: Asset | undefined): string | undefined {
	const fields = asset?.fields as unknown as { file?: { url?: string } } | undefined;
	const url = fields?.file?.url;
	if (!url) return undefined;
	return url.startsWith("http") ? url : `https:${url}`;
}

export function isContentfulConfigured(): boolean {
	return Boolean(spaceId && accessToken);
}

// Lightweight SWR-style cache wrapper for GET-only methods
const swrCache = new Map<string, unknown>();

export async function cachedGetEntries<T = unknown>(params: Record<string, unknown>): Promise<T> {
  const key = JSON.stringify(params);
  if (swrCache.has(key)) {
    // return cached response immediately; refresh in background
    const cached = swrCache.get(key) as T;
    const getEntriesFn = contentfulClient.getEntries as unknown as (p: Record<string, unknown>) => Promise<unknown>;
    getEntriesFn(params).then((fresh) => {
      swrCache.set(key, fresh);
    }).catch(() => {});
    return cached;
  }
  const getEntriesFn = contentfulClient.getEntries as unknown as (p: Record<string, unknown>) => Promise<unknown>;
  const res = await getEntriesFn(params);
  swrCache.set(key, res as T);
  return res as T;
}
