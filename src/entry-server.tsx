/// <reference types="node" />
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "node:stream";
import { StaticRouter } from "react-router-dom/server";
import {
  HelmetProvider,
  type HelmetServerState,
} from "@dr.pogodin/react-helmet";
import App from "./App";
import { LanguageProvider } from "./i18n";
import { PageDataContext, type PageSnapshot } from "./lib/page-data";
import { languageFromPath, localizedPath, stripLanguage } from "./lib/locale";
import {
  fetchHome,
  fetchAbout,
  fetchServicesPage,
  fetchProjectsPage,
  fetchProjectBySlug,
  localeForLanguage,
} from "./lib/cms";
import { getSiteUrl } from "./lib/seo";

export { getSiteUrl };

export async function loadPages(): Promise<PageSnapshot[]> {
  const pages: PageSnapshot[] = [];
  for (const language of ["en", "de"] as const) {
    const locale = localeForLanguage(language);
    const [home, about, services, projects] = await Promise.all([
      fetchHome(locale),
      fetchAbout(locale),
      fetchServicesPage(locale),
      fetchProjectsPage(locale),
    ]);
    if (
      !home ||
      !about ||
      !services?.services.length ||
      !projects.featured.length
    ) {
      throw new Error(
        `Incomplete published CMS content for ${language}; refusing to build empty SEO pages.`,
      );
    }
    const entries: [string, unknown][] = [
      ["/", home],
      ["/about", about],
      ["/services", services],
      ["/projects", projects],
      ["/contact", null],
      ["/cookie-declaration", null],
    ];
    const allProjects = [...projects.featured, ...projects.all];
    for (const project of allProjects) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug))
        throw new Error("Invalid project slug.");
      const detail = await fetchProjectBySlug(project.slug, locale);
      if (!detail?.title)
        throw new Error(
          `Missing project content: ${project.slug} (${language}).`,
        );
      entries.push([`/projects/${project.slug}`, detail]);
    }
    pages.push(
      ...entries.map(([pathname, data]) => ({
        pathname: localizedPath(pathname, language),
        data,
      })),
    );
  }
  return pages;
}

export async function renderPage(snapshot: PageSnapshot) {
  const language = languageFromPath(snapshot.pathname);
  let helmet: HelmetServerState | undefined;
  const body = await new Promise<string>((resolve, reject) => {
    const output = new PassThrough();
    let html = "";
    let renderError: unknown;
    output.on("data", (chunk) => {
      html += chunk.toString();
    });
    output.on("end", () => (renderError ? reject(renderError) : resolve(html)));
    output.on("error", reject);
    const stream = renderToPipeableStream(
      <HelmetProvider
        onServerState={(state) => {
          helmet = state;
        }}
      >
        <PageDataContext.Provider value={snapshot}>
          <LanguageProvider initialLanguage={language}>
            <StaticRouter
              location={snapshot.pathname}
              basename={language === "de" ? "/de" : "/"}
            >
              <App />
            </StaticRouter>
          </LanguageProvider>
        </PageDataContext.Provider>
      </HelmetProvider>,
      {
        onAllReady() {
          clearTimeout(timeout);
          stream.pipe(output);
        },
        onShellError(error) {
          clearTimeout(timeout);
          reject(error);
        },
        onError(error) {
          renderError = error;
        },
      },
    );
    const timeout = setTimeout(() => {
      stream.abort();
      reject(new Error("Prerender timed out."));
    }, 30000);
  });
  if (!helmet) throw new Error(`Missing SEO metadata: ${snapshot.pathname}`);
  const head = [helmet.title, helmet.meta, helmet.link, helmet.script]
    .map((item) => item.toString())
    .join("\n");
  const is404 = stripLanguage(snapshot.pathname) === "/404";
  if (!is404 && (!body.includes("<h1") || !head.includes("canonical"))) {
    throw new Error(`Incomplete prerender: ${snapshot.pathname}`);
  }
  return { body, head, language };
}
