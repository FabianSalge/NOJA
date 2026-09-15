export function appendParam(
  url: string,
  key: string,
  value: string | number,
): string {
  const hasQuery = url.includes("?");
  const sep = hasQuery ? "&" : "?";
  return `${url}${sep}${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
}

export function buildContentfulSrcSet(
  url: string | undefined,
  widths: number[] = [480, 768, 1024, 1366, 1600],
): string | undefined {
  if (!url || !isContentfulImage(url)) return undefined;
  return widths.map((w) => `${optimizedImageUrl(url, w)} ${w}w`).join(", ");
}

function isContentfulImage(url: string): boolean {
  try {
    return new URL(url).hostname === "images.ctfassets.net";
  } catch {
    return false;
  }
}

export function optimizedImageUrl(
  url: string | undefined,
  width = 1600,
): string | undefined {
  if (!url || !isContentfulImage(url)) return url;
  const result = new URL(url);
  result.searchParams.set("w", String(width));
  result.searchParams.set("fm", "webp");
  result.searchParams.set("q", "80");
  return result.toString();
}
