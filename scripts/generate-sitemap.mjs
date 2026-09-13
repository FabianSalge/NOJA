import { writeFile } from "node:fs/promises";
import path from "node:path";

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Use exactly the successful prerender set, so sitemap and deployed pages cannot drift.
export async function writeSitemap(pages, siteUrl, output) {
  const paths = new Set(pages.map((page) => page.pathname));
  const urls = pages.map(({ pathname }) => {
    const english = pathname.replace(/^\/de(?=\/|$)/, "") || "/";
    const german = `/de${english === "/" ? "" : english}`;
    if (!paths.has(english) || !paths.has(german))
      throw new Error(`Missing language counterpart for ${pathname}`);
    return (
      `  <url>\n    <loc>${escapeXml(siteUrl + pathname)}</loc>\n` +
      [
        ["en", english],
        ["de-CH", german],
        ["x-default", english],
      ]
        .map(
          ([lang, target]) =>
            `    <xhtml:link rel="alternate" hreflang="${lang}" href="${escapeXml(siteUrl + target)}" />`,
        )
        .join("\n") +
      "\n  </url>"
    );
  });
  await writeFile(
    path.join(output, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`,
  );
}
