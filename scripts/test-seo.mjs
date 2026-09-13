import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { writeSitemap } from "./generate-sitemap.mjs";

const output = path.resolve("dist");
const manifest = JSON.parse(
  await readFile(path.join(output, "prerender-manifest.json"), "utf8"),
);
const pages = new Map(
  await Promise.all(
    manifest.paths.map(async (pathname) => [
      pathname,
      await readFile(
        path.join(
          output,
          pathname === "/" ? "index.html" : `${pathname.slice(1)}.html`,
        ),
        "utf8",
      ),
    ]),
  ),
);
const decode = (value) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
function attrs(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [
      key.toLowerCase(),
      decode(value),
    ]),
  );
}
const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map(([tag]) =>
    attrs(tag),
  );
const canonical = (html) =>
  tags(html, "link").find((link) => link.rel === "canonical")?.href;
const site = new URL(canonical(pages.get("/"))).origin;

test("every indexable page has real content and unique localized metadata before JavaScript", () => {
  const titles = new Set();
  for (const [pathname, html] of pages) {
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${pathname}: one H1`);
    assert.equal(
      (html.match(/<title\b/g) || []).length,
      1,
      `${pathname}: one title`,
    );
    const title = html.match(/<title[^>]*>(.*?)<\/title>/s)?.[1];
    assert.ok(
      title?.length > 15 && !titles.has(title),
      `${pathname}: meaningful unique title`,
    );
    titles.add(title);
    const language = /^\/de(?:\/|$)/.test(pathname) ? "de" : "en";
    assert.ok(html.includes(`<html lang="${language}">`));
    const descriptions = tags(html, "meta").filter(
      (meta) => meta.name === "description",
    );
    assert.equal(descriptions.length, 1);
    assert.ok(
      descriptions[0].content.length > 35,
      `${pathname}: description has substance`,
    );
    assert.equal(canonical(html), site + pathname);
    assert.ok(
      tags(html, "meta").some(
        (meta) => meta.name === "robots" && meta.content === "index,follow",
      ),
    );
    assert.ok(
      !html.includes("SearchAction") &&
        !html.includes("CFPAT") &&
        !html.includes("CONTENTFUL_MANAGEMENT_TOKEN"),
    );
    const snapshot = JSON.parse(
      html.match(
        /<script id="page-data" type="application\/json">(.*?)<\/script>/s,
      )[1],
    );
    assert.equal(snapshot.pathname, pathname);
    if (pathname.includes("/projects/"))
      assert.ok(snapshot.data.title && html.includes(snapshot.data.title));
    const social = tags(html, "meta").find(
      (meta) => meta.property === "og:image",
    );
    assert.ok(social?.content.startsWith("https://"));
    for (const [, json] of html.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
    ))
      JSON.parse(json);
  }
});

test("language alternates are reciprocal, crawlable, and preserve project paths", () => {
  for (const [pathname, html] of pages) {
    const english = pathname.replace(/^\/de(?=\/|$)/, "") || "/";
    const german = `/de${english === "/" ? "" : english}`;
    const alternates = tags(html, "link").filter(
      (link) => link.rel === "alternate",
    );
    assert.deepEqual(
      Object.fromEntries(alternates.map((link) => [link.hreflang, link.href])),
      {
        en: site + english,
        "de-CH": site + german,
        "x-default": site + english,
      },
    );
    const opposite = pathname === german ? english : german;
    assert.ok(
      tags(html, "a").some((link) => link.href === opposite),
      `${pathname}: crawlable language switch`,
    );
    assert.ok(pages.has(english) && pages.has(german));
    for (const link of tags(html, "a")) {
      if (!link.href?.startsWith("/") || link.href.startsWith("//")) continue;
      const target = new URL(link.href, site).pathname;
      if (/\.[a-z0-9]+$/i.test(target)) continue; // PDF and media files.
      assert.ok(
        pages.has(target),
        `${pathname}: broken internal link ${target}`,
      );
      if (pathname === german && !link.hreflang)
        assert.ok(
          target === "/de" || target.startsWith("/de/"),
          `${pathname}: link lost German locale`,
        );
    }
  }
});

test("sitemap matches prerendered URLs and robots advertises it", async () => {
  const xml = await readFile(path.join(output, "sitemap.xml"), "utf8");
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map(([, value]) => decode(value))
    .sort();
  assert.deepEqual(urls, manifest.paths.map((p) => site + p).sort());
  assert.equal(
    (xml.match(/<xhtml:link /g) || []).length,
    manifest.paths.length * 3,
  );
  assert.ok(
    (await readFile(path.join(output, "robots.txt"), "utf8")).includes(
      `Sitemap: ${site}/sitemap.xml`,
    ),
  );
});

test("missing pages are noindex and hosting has no catch-all 200 rewrite", async () => {
  for (const filename of ["404.html", "de/404.html"]) {
    const html = await readFile(path.join(output, filename), "utf8");
    assert.ok(
      tags(html, "meta").some(
        (meta) => meta.name === "robots" && meta.content === "noindex,follow",
      ),
    );
    assert.equal(canonical(html), undefined);
  }
  const config = JSON.parse(await readFile("vercel.json", "utf8"));
  assert.equal(config.cleanUrls, true);
  assert.equal(config.rewrites, undefined);
});

test("sitemap generation rejects incomplete locale pairs", async () => {
  const folder = await mkdtemp(path.join(tmpdir(), "noja-seo-test-"));
  try {
    await assert.rejects(
      () => writeSitemap([{ pathname: "/" }], site, folder),
      /Missing language counterpart/,
    );
  } finally {
    await rm(folder, { recursive: true, force: true });
  }
});

if (process.env.SEO_TEST_ORIGIN) {
  test("production preview serves all static routes and returns HTTP 404 for missing routes", async () => {
    for (const pathname of manifest.paths) {
      const response = await fetch(process.env.SEO_TEST_ORIGIN + pathname);
      assert.equal(response.status, 200, pathname);
      assert.equal(canonical(await response.text()), site + pathname);
    }
    for (const pathname of [
      "/not-a-page",
      "/projects/not-a-project",
      "/de/projects/not-a-project",
    ]) {
      assert.equal(
        (await fetch(process.env.SEO_TEST_ORIGIN + pathname)).status,
        404,
        pathname,
      );
    }
  });
}

test('English homepage service cards do not contain the misplaced German CMS titles', () => {
  const html = pages.get('/');
  const snapshot = JSON.parse(html.match(/<script id="page-data" type="application\/json">(.*?)<\/script>/s)[1]);
  const misplacedTitles = new Set([
    'Strategische & Kreative Direktion',
    'Kampagnen- & Projektmanagement',
    'Video- & Fotografie',
    'Bearbeitung',
  ]);
  assert.ok(snapshot.data.whatYouNeedCards.length > 0);
  for (const card of snapshot.data.whatYouNeedCards) {
    assert.ok(!misplacedTitles.has(card.title), `German title in English homepage content: ${card.title}`);
  }
});
