import { build, loadEnv } from "vite";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { describeBuildError } from "./lib/build-error.mjs";
import { writeSitemap } from "./generate-sitemap.mjs";

const root = process.cwd();
const env = { ...loadEnv("production", root, "VITE_"), ...process.env };
const output = path.resolve(root, "dist");
const serverOutput = path.resolve(root, ".prerender");
try {
  if (!env.VITE_CONTENTFUL_SPACE_ID || !env.VITE_CONTENTFUL_ACCESS_TOKEN) {
    throw new Error(
      "Prerendering requires the Contentful delivery space and read-only access token.",
    );
  }
  if (env.VITE_CONTENTFUL_USE_PREVIEW === "true") {
    throw new Error(
      "Production prerendering must use published Contentful delivery content.",
    );
  }
  await build({
    build: {
      ssr: "src/entry-server.tsx",
      outDir: serverOutput,
      emptyOutDir: true,
      copyPublicDir: false,
      rollupOptions: {
        output: { manualChunks: undefined, entryFileNames: "entry-server.mjs" },
      },
    },
  });
  const { loadPages, renderPage, getSiteUrl } = await import(
    pathToFileURL(path.join(serverOutput, "entry-server.mjs")).href
  );
  const siteUrl = getSiteUrl();
  const site = new URL(siteUrl);
  if (
    site.protocol !== "https:" ||
    site.pathname !== "/" ||
    site.search ||
    site.hash
  ) {
    throw new Error(
      "VITE_SITE_URL must be a production HTTPS origin, without a path or query.",
    );
  }
  const pages = await loadPages();
  const template = await readFile(path.join(output, "index.html"), "utf8");
  const fallbackPages = [
    { pathname: "/404", data: null },
    { pathname: "/de/404", data: null },
  ];
  for (const page of [...pages, ...fallbackPages]) {
    const rendered = await renderPage(page);
    // JSON is data, never executable. Escape HTML delimiters from CMS rich text.
    const data = JSON.stringify(page)
      .replace(/</g, "\\u003c")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
    const html = template
      .replace('<html lang="en">', `<html lang="${rendered.language}">`)
      .replace("<!--page-head-->", rendered.head)
      .replace(
        '<div id="root"></div>',
        `<div id="root">${rendered.body}</div>\n<script id="page-data" type="application/json">${data}</script>`,
      );
    const destination = path.join(
      output,
      page.pathname === "/" ? "index.html" : `${page.pathname.slice(1)}.html`,
    );
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, html);
  }
  await writeSitemap(pages, siteUrl, output);
  await writeFile(
    path.join(output, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
  );
  await writeFile(
    path.join(output, "prerender-manifest.json"),
    JSON.stringify({ paths: pages.map((page) => page.pathname) }, null, 2),
  );
  console.log(
    `Prerendered ${pages.length} pages in English/German, plus two 404 pages.`,
  );
} catch (error) {
  // Do not leave a partially generated site that could be deployed accidentally.
  await rm(output, { recursive: true, force: true });
  throw new Error(
    `SEO build failed: ${describeBuildError(error)}`,
  );
} finally {
  await rm(serverOutput, { recursive: true, force: true });
}
