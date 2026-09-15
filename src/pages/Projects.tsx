import { usePageData } from "@/lib/page-data";
import { useEffect, useState } from "react";
import PageSEO from "@/components/PageSEO";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import MediaCarousel from "@/components/MediaCarousel";
import HaveProjectCTA from "@/components/HaveProjectCTA";
import SEOJsonLd from "@/components/SEOJsonLd";
import {
  fetchProjectsPage,
  localeForLanguage,
  type CmsProjectsPage,
} from "@/lib/cms";
import { richTextOptions } from "@/lib/richtext";
import { buildCanonical } from "@/lib/seo";
import { useTranslation } from "@/i18n";

function ProjectsContent() {
  const { t, language } = useTranslation();
  const initialData = usePageData<CmsProjectsPage>();
  const [data, setData] = useState<CmsProjectsPage | undefined>(initialData);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    fetchProjectsPage(localeForLanguage(language))
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setFailed(false);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [language, attempt, initialData]);

  const projects = data ? [...data.featured, ...data.all] : [];
  return (
    <div className="min-h-screen bg-background pt-20">
      <PageSEO />
      <SEOJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t.projects.title,
          url: buildCanonical("/projects", language),
        }}
      />
      <section className="project-fade overflow-hidden pt-16 md:pt-24 pb-16 md:pb-24 text-background">
        <div className="max-w-4xl 2xl:max-w-5xl mx-auto px-6 text-center mb-8 md:mb-12">
          <p className="mb-5 text-xs uppercase tracking-[0.3em] font-semibold">
            NOJA / {t.nav.projects}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-black leading-[0.95]">
            {data?.pageTitle || t.projects.title}
          </h1>
          <div className="mt-6 mx-auto max-w-2xl text-base md:text-lg 2xl:text-xl text-background/75 leading-relaxed">
            {data?.ourWorkSubtext ? (
              documentToReactComponents(data.ourWorkSubtext, richTextOptions)
            ) : (
              <p>{data?.pageSubtitle || t.projects.subtitle}</p>
            )}
          </div>
        </div>
        {failed ? (
          <div className="text-center px-6 py-24" role="alert">
            <p>{t.projects.unavailable}</p>
            <button
              className="mt-5 underline underline-offset-4"
              onClick={() => setAttempt((value) => value + 1)}
            >
              {t.projects.retry}
            </button>
          </div>
        ) : !data ? (
          <div
            className="h-[450px] flex items-center justify-center"
            role="status"
          >
            {t.common.loading}
          </div>
        ) : (
          <MediaCarousel
            key={projects.map((project) => project.slug).join("|")}
            label={t.projects.title}
            items={projects.map((project) => ({
              id: project.slug,
              title: project.title,
              subtitle: [project.subtitle, project.dateISO?.slice(0, 4)]
                .filter(Boolean)
                .join(" · "),
              imageUrl: project.coverImageUrl,
              videoUrl: project.videoUrl,
              href: `/projects/${project.slug}`,
            }))}
          />
        )}
      </section>
      <HaveProjectCTA variant="dark" fadeFromLight />
    </div>
  );
}

export default function Projects() {
  const { language } = useTranslation();
  return <ProjectsContent key={language} />;
}
