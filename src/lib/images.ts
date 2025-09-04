export function appendParam(url: string, key: string, value: string | number): string {
  const hasQuery = url.includes('?');
  const sep = hasQuery ? '&' : '?';
  return `${url}${sep}${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
}

export function buildContentfulSrcSet(url: string | undefined, widths: number[] = [480, 768, 1024, 1366, 1600]): string | undefined {
  if (!url) return undefined;
  return widths.map((w) => `${appendParam(url, 'w', w)} ${w}w`).join(', ');
}


