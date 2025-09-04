export function getSiteUrl(): string {
  const envUrl = import.meta.env.VITE_SITE_URL as string | undefined;
  if (envUrl) return envUrl.replace(/\/$/, '');
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin;
  return 'https://nojaagency.com';
}

export function buildCanonical(pathname: string): string {
  const base = getSiteUrl();
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

export function toJsonLd(data: unknown): string {
  try {
    return JSON.stringify(data);
  } catch {
    return '{}';
  }
}


