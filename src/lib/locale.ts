export type Language = "en" | "de";

export function languageFromPath(pathname: string): Language {
  return /^\/de(?:\/|$)/.test(pathname) ? "de" : "en";
}

export function stripLanguage(pathname: string): string {
  return pathname.replace(/^\/de(?=\/|$)/, "") || "/";
}

export function localizedPath(pathname: string, language: Language): string {
  const path = stripLanguage(pathname).replace(/\/$/, "") || "/";
  return language === "de" ? `/de${path === "/" ? "" : path}` : path;
}
