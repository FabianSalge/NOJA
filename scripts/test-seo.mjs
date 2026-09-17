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

test("English homepage service cards do not contain the misplaced German CMS titles", () => {
  const html = pages.get("/");
  const snapshot = JSON.parse(
    html.match(
      /<script id="page-data" type="application\/json">(.*?)<\/script>/s,
    )[1],
  );
  const misplacedTitles = new Set([
    "Strategische & Kreative Direktion",
    "Kampagnen- & Projektmanagement",
    "Video- & Fotografie",
    "Bearbeitung",
  ]);
  assert.ok(snapshot.data.whatYouNeedCards.length > 0);
  for (const card of snapshot.data.whatYouNeedCards) {
    assert.ok(
      !misplacedTitles.has(card.title),
      `German title in English homepage content: ${card.title}`,
    );
  }
});

test("Services retains the three main categories and matching homepage teasers in both languages", () => {
  const titles = ["Brand & Design", "Film & Photo", "Content & Campaigns"];
  const snapshot = (pathname) =>
    JSON.parse(
      pages
        .get(pathname)
        .match(
          /<script id="page-data" type="application\/json">(.*?)<\/script>/s,
        )[1],
    ).data;
  for (const prefix of ["", "/de"]) {
    const services = snapshot(`${prefix}/services`);
    const home = snapshot(prefix || "/");
    assert.deepEqual(
      services.services.slice(0, 3).map((service) => service.title),
      titles,
    );
    assert.deepEqual(
      home.whatYouNeedCards.map((card) => card.title),
      titles,
    );
    assert.equal(
      services.heroSubtitle,
      prefix
        ? "Einzeln stark. Zusammen noch besser."
        : "Built to work alone. Better together.",
    );
    assert.equal(home.servicesSectionSubtitle, services.heroSubtitle);
    for (const service of services.services.slice(0, 3)) {
      assert.ok(
        service.subtitle && service.description && service.features.length >= 6,
      );
      assert.ok(service.serviceMediaUrl?.startsWith("https://"));
    }
    for (const card of home.whatYouNeedCards)
      assert.ok(card.imageUrl?.startsWith("https://"));
  }
  const english = snapshot("/services");
  assert.ok(
    english.services[0].features.some((value) =>
      value.includes("Social Media Templates"),
    ),
  );
  assert.ok(
    english.services[0].features.some(
      (value) => value.includes("Print Design") && value.includes("Packaging"),
    ),
  );
  assert.ok(
    english.services[0].features.some((value) =>
      value.includes("Presentations & Pitch Decks"),
    ),
  );
  assert.ok(
    english.services[1].features.some(
      (value) => value.includes("Brand Films") && value.includes("Image Films"),
    ),
  );
  assert.ok(english.services[2].features.includes("Community Management"));
  assert.ok(english.services[2].features.includes("Performance & Reporting"));
});

test("slide 6 additions are standalone Services sections with the exact copy and three deliverables", () => {
  const expected = {
    "/services": [
      [
        "Brand & Identity",
        "Design paired with strategy — so the visuals remain timeless.",
        [
          "Brand Strategy & Positioning",
          "Visual Identity & Logo Design",
          "Brand Guidelines",
        ],
      ],
      [
        "Graphic Design",
        "Different formats, same standard: social, print, decks.",
        [
          "Social Media Templates & Assets",
          "Print Design (Flyers, Posters, Packaging)",
          "Presentations & Pitch Decks",
        ],
      ],
    ],
    "/de/services": [
      [
        "Marke & Identität",
        "Design trifft Strategie — damit die Gestaltung zeitlos bleibt.",
        [
          "Markenstrategie & Positionierung",
          "Visuelle Identität & Logodesign",
          "Brand Guidelines",
        ],
      ],
      [
        "Grafikdesign",
        "Verschiedene Formate, derselbe Anspruch: Social Media, Print, Präsentationen.",
        [
          "Social-Media-Vorlagen & Assets",
          "Printdesign (Flyer, Poster, Verpackungen)",
          "Präsentationen & Pitch Decks",
        ],
      ],
    ],
  };
  for (const [pathname, additions] of Object.entries(expected)) {
    const source = pages.get(pathname);
    const services = JSON.parse(
      source.match(
        /<script id="page-data" type="application\/json">(.*?)<\/script>/s,
      )[1],
    ).data.services;
    assert.equal(
      services.length,
      5,
      `${pathname}: three categories plus two added sections`,
    );
    // Verify actual section markup, excluding the hydration JSON snapshot.
    const html = decode(
      source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, ""),
    );
    const sections = [
      ...html.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/g),
    ].map(([, body]) => body);
    for (const [index, [title, description, features]] of additions.entries()) {
      const service = services[index + 3];
      assert.equal(service.title, title);
      assert.equal(service.description, description);
      assert.deepEqual(service.features, features);
      assert.equal(service.order, index + 4);
      assert.ok(service.serviceMediaUrl?.startsWith("https://"));
      assert.ok(
        !service.groups,
        "No nested substitutes for the requested sections",
      );
      const body = sections.find(
        (section) => section.match(/<h2[^>]*>(.*?)<\/h2>/s)?.[1] === title,
      );
      assert.ok(body, `${pathname}: missing standalone H2 section ${title}`);
      assert.equal((body.match(/<h2\b/g) || []).length, 1);
      assert.equal(body.match(/<p[^>]*>(.*?)<\/p>/s)?.[1], description);
      for (const feature of features)
        assert.ok(body.includes(feature), `${title}: missing ${feature}`);
    }
  }
});
