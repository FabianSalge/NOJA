import "@fontsource/syne/400.css";
import "@fontsource/syne/600.css";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import { createRoot, hydrateRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.tsx";
import { LanguageProvider } from "./i18n";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "@dr.pogodin/react-helmet";
import { languageFromPath, localizedPath } from "./lib/locale";
import { PageDataContext, type PageSnapshot } from "./lib/page-data";
const snapshotElement = document.getElementById("page-data");
const snapshot: PageSnapshot | undefined = snapshotElement
  ? JSON.parse(snapshotElement.textContent || "null")
  : undefined;
const basename =
  languageFromPath(window.location.pathname) === "de" ? "/de" : "/";
import "./index.css";

const app = (
  <StrictMode>
    <HelmetProvider>
      <PageDataContext.Provider value={snapshot}>
        <LanguageProvider>
          <BrowserRouter basename={basename}>
            <App />
          </BrowserRouter>
        </LanguageProvider>
      </PageDataContext.Provider>
    </HelmetProvider>
  </StrictMode>
);

const root = document.getElementById("root")!;
if (
  snapshot?.pathname ===
  localizedPath(
    window.location.pathname,
    languageFromPath(window.location.pathname),
  )
) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
