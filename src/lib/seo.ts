import { localizedPath, type Language } from "./locale";

export function getSiteUrl(): string {
  return (import.meta.env.VITE_SITE_URL || "https://nojaagency.com").replace(
    /\/$/,
    "",
  );
}

export function buildCanonical(
  pathname: string,
  language: Language = "en",
): string {
  return `${getSiteUrl()}${localizedPath(pathname, language)}`;
}

export function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function richTextDescription(node: unknown): string {
  function text(value: unknown): string {
    if (!value || typeof value !== "object") return "";
    const item = value as { value?: string; content?: unknown[] };
    return item.value ?? item.content?.map(text).join(" ") ?? "";
  }
  const value = text(node).replace(/\s+/g, " ").trim();
  return value.length > 160
    ? `${value.slice(0, 157).replace(/\s+\S*$/, "")}…`
    : value;
}
