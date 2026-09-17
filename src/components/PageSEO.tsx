import { Helmet } from "@dr.pogodin/react-helmet";
import { useLocation } from "react-router-dom";
import { useTranslation } from "@/i18n";
import { buildCanonical, getSiteUrl } from "@/lib/seo";

const metadata = {
  en: {
    "/": [
      "Creative Agency Zurich | Film, Design & Content — NOJA",
      "NOJA is a creative agency based in Zurich. We bring brands to life through creative direction, film, photography, design and content production.",
    ],
    "/about": [
      "About NOJA | Creative Team in Zurich",
      "Meet NOJA, the Zurich creative team bringing together strategy, concepts and production to create distinctive visual content for brands.",
    ],
    "/services": [
      "Brand & Design, Film & Content Services — NOJA",
      "Explore Brand & Design, Film & Photo, and Content & Campaigns from NOJA in Zurich. From brand identity and image films to social media and campaign production.",
    ],
    "/projects": [
      "Our Work | Film, Brand & Content Projects — NOJA",
      "Explore NOJA’s selected projects, from brand films and photography to creative content. Discover the ideas, production and stories behind our work.",
    ],
    "/contact": [
      "Contact NOJA | Start Your Creative Project",
      "Have a project in mind? Contact NOJA in Zurich to discuss creative direction, film, photography, design and content production for your brand.",
    ],
    "/cookie-declaration": [
      "Cookie Declaration — NOJA",
      "Cookie declaration for NOJA Productions KLG.",
    ],
  },
  de: {
    "/": [
      "Kreativagentur Zürich | Film, Design & Content — NOJA",
      "NOJA ist eine Kreativagentur aus Zürich. Wir machen Marken erlebbar – mit kreativen Konzepten, Film, Fotografie, Design und Content-Produktion.",
    ],
    "/about": [
      "Über NOJA | Kreativteam aus Zürich",
      "Lerne NOJA kennen: Unser Kreativteam aus Zürich verbindet Strategie, Konzeption und Produktion zu unverwechselbaren visuellen Inhalten für Marken.",
    ],
    "/services": [
      "Brand, Design, Film & Content | Leistungen — NOJA",
      "Brand & Design, Film & Photo und Content & Campaigns von NOJA aus Zürich: von Markenidentität und Imagefilmen bis zu Social Media und Kampagnen.",
    ],
    "/projects": [
      "Unsere Arbeit | Film, Marken & Content — NOJA",
      "Entdecke ausgewählte Projekte von NOJA – von Markenfilmen und Fotografie bis zu kreativem Content. Einblicke in Ideen, Produktion und Geschichten.",
    ],
    "/contact": [
      "Kontakt NOJA | Dein kreatives Projekt starten",
      "Du hast ein Projekt im Kopf? Kontaktiere NOJA in Zürich für kreative Konzepte, Film, Fotografie, Design und Content-Produktion für deine Marke.",
    ],
    "/cookie-declaration": [
      "Cookie-Erklärung — NOJA",
      "Cookie-Erklärung von NOJA Productions KLG.",
    ],
  },
};

export default function PageSEO({
  title,
  description,
  image,
  noindex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
}) {
  const { language } = useTranslation();
  const { pathname } = useLocation();
  const defaults = metadata[language][pathname as keyof typeof metadata.en];
  const pageTitle = title || defaults?.[0] || "NOJA";
  const pageDescription = description || defaults?.[1] || "";
  const canonical = buildCanonical(pathname, language);
  const socialImage = image || `${getSiteUrl()}/videos/hero-poster.webp`;
  return (
    <Helmet>
      <html lang={language} />
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta
        name="robots"
        content={noindex ? "noindex,follow" : "index,follow"}
      />
      {!noindex && <link rel="canonical" href={canonical} />}
      {!noindex && (
        <link
          rel="alternate"
          hrefLang="en"
          href={buildCanonical(pathname, "en")}
        />
      )}
      {!noindex && (
        <link
          rel="alternate"
          hrefLang="de-CH"
          href={buildCanonical(pathname, "de")}
        />
      )}
      {!noindex && (
        <link
          rel="alternate"
          hrefLang="x-default"
          href={buildCanonical(pathname, "en")}
        />
      )}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="NOJA" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={socialImage} />
      <meta
        property="og:image:alt"
        content={title || "NOJA — Film, Design & Content"}
      />
      <meta
        property="og:locale"
        content={language === "de" ? "de_CH" : "en_GB"}
      />
      <meta
        property="og:locale:alternate"
        content={language === "de" ? "en_GB" : "de_CH"}
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={socialImage} />
    </Helmet>
  );
}
