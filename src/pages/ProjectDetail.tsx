import { usePageData } from "@/lib/page-data";
import { useParams, Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import PageSEO from "@/components/PageSEO";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import SEOJsonLd from "@/components/SEOJsonLd";
import ResponsiveImage from "@/components/ResponsiveImage";
import MediaPreview from "@/components/MediaPreview";
import MediaCarousel from "@/components/MediaCarousel";
import HaveProjectCTA from "@/components/HaveProjectCTA";
import { richTextDescription } from "@/lib/seo";
import {
  fetchProjectBySlug,
  localeForLanguage,
  type CmsProjectDetail,
} from "@/lib/cms";
import { richTextOptions } from "@/lib/richtext";
import { useTranslation } from "@/i18n";

function ProjectContent({ slug }: { slug: string }) {
  const { t, language } = useTranslation();
  const initialData = usePageData<CmsProjectDetail>();
  const [project, setProject] = useState<CmsProjectDetail | undefined>(
    initialData,
  );
  const [loading, setLoading] = useState(!initialData);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const reducedMotion = useReducedMotion();
  const shouldPlay = !reducedMotion;
  useEffect(() => {
    if (initialData) return;
    let cancelled = false;
    fetchProjectBySlug(slug, localeForLanguage(language))
      .then((result) => {
        if (!cancelled) {
          setProject(result);
          setFailed(false);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, language, attempt, initialData]);

  if (loading)
    return (
      <div
        className="min-h-screen bg-background pt-40 px-6 text-center"
        role="status"
      >
        {t.common.loading}
      </div>
    );
  if (!project)
    return (
      <div className="min-h-screen bg-background pt-40 px-6 text-center">
        <PageSEO noindex title={`${t.projects.notFound} — NOJA`} />
        <h1 className="text-4xl font-bold">
          {failed ? t.projects.unavailable : t.projects.notFound}
        </h1>
        <p className="mt-5">{!failed && t.projects.notFoundDescription}</p>
        {failed && (
          <button
            className="block mx-auto mt-6 underline"
            onClick={() => setAttempt((value) => value + 1)}
          >
            {t.projects.retry}
          </button>
        )}
        <Link className="inline-block mt-8 underline" to="/projects">
          {t.projects.back}
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-background pt-20">
      <PageSEO
        title={`${project.title} | ${project.subtitle || t.nav.projects} — NOJA`}
        description={
          richTextDescription(project.firstTextBody) ||
          `${project.title} — ${project.subtitle}. ${language === "de" ? "Ein Projekt von NOJA: Entdecke die Idee, die Umsetzung und das Ergebnis." : "A project by NOJA. Explore the idea, the production and the finished work."}`
        }
        image={project.coverImageUrl}
      />
      <SEOJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: project.title,
          datePublished: project.dateISO,
          image: project.coverImageUrl,
          description:
            richTextDescription(project.firstTextBody) || project.subtitle,
        }}
      />
      <section className="project-fade overflow-hidden text-background">
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 md:px-10 pt-8 md:pt-10">
          <Link
            to="/projects"
            className="inline-flex gap-2 items-center text-xs uppercase tracking-[0.15em] font-semibold hover:!text-background"
          >
            <ArrowLeft size={15} />
            {t.projects.back}
          </Link>
          <div className="grid md:grid-cols-[0.9fr_1.1fr] items-center gap-10 lg:gap-20 pt-10 md:pt-12">
            <div className="order-2 md:order-1 relative h-[340px] sm:h-[420px] md:h-[470px] 2xl:h-[550px] overflow-hidden">
              <div className="relative w-[210px] sm:w-[250px] md:w-[275px] 2xl:w-[320px] aspect-[9/18.5] mx-auto mt-5 -rotate-[11deg] rounded-[38px] border-[7px] border-background bg-background shadow-2xl overflow-hidden">
                <MediaPreview
                  key={project.heroVideoUrl || project.coverImageUrl}
                  imageUrl={project.coverImageUrl}
                  videoUrl={project.heroVideoUrl}
                  alt={project.title}
                  enabled={shouldPlay}
                  eager
                  sizes="320px"
                />
                <div
                  aria-hidden="true"
                  className="absolute top-2 left-1/2 -translate-x-1/2 w-[35%] h-5 rounded-full bg-background"
                />
              </div>
            </div>
            <div className="order-1 md:order-2 pb-2 md:pb-16 max-w-2xl">
              <p className="mb-5 text-xs md:text-sm uppercase tracking-[0.25em] text-background/65">
                NOJA / {project.dateISO.slice(0, 4)}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-bold leading-[1.05] tracking-tight">
                {project.title}
              </h1>
              <p className="mt-6 text-base md:text-lg 2xl:text-xl text-background/75 leading-relaxed">
                {project.subtitle}
              </p>
            </div>
          </div>
        </div>
      </section>

      {(project.secondImageUrl || project.firstTextBody) && (
        <section className="grid md:grid-cols-2 bg-background text-foreground">
          {project.secondImageUrl && (
            <div className="min-h-[320px] md:min-h-[500px] relative">
              <ResponsiveImage
                src={project.secondImageUrl}
                alt={`${project.title} — ${project.firstTextTitle}`}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          )}
          <div
            className={`px-6 md:px-10 lg:px-16 2xl:px-24 py-12 md:py-16 flex flex-col justify-center ${!project.secondImageUrl ? "md:col-span-2 max-w-4xl mx-auto" : ""}`}
          >
            {project.firstTextTitle && (
              <h2 className="text-2xl md:text-3xl 2xl:text-4xl font-bold mb-6">
                {project.firstTextTitle}
              </h2>
            )}
            <div className="text-sm md:text-base 2xl:text-lg leading-relaxed text-foreground/85">
              {project.firstTextBody &&
                documentToReactComponents(
                  project.firstTextBody,
                  richTextOptions,
                )}
            </div>
          </div>
        </section>
      )}

      <section className="project-fade text-background pt-16 md:pt-24 pb-12 overflow-hidden">
        <div className="max-w-3xl 2xl:max-w-4xl mx-auto px-6 mb-7 md:mb-10 text-center">
          {project.quote && (
            <p className="text-xs uppercase tracking-[0.2em] text-background/60 mb-5">
              {project.quote}
            </p>
          )}
          {project.secondTextTitle && (
            <h2 className="text-2xl md:text-3xl 2xl:text-4xl font-semibold mb-5">
              {project.secondTextTitle}
            </h2>
          )}
          {project.secondTextBody && (
            <div className="text-sm md:text-base 2xl:text-lg leading-relaxed text-background/75">
              {documentToReactComponents(
                project.secondTextBody,
                richTextOptions,
              )}
            </div>
          )}
        </div>
        {project.gallery.length > 0 && (
          <MediaCarousel
            key={project.gallery.map((item) => item.id).join("|")}
            label={`${project.title} — ${t.projects.gallery}`}
            items={project.gallery}
            showCaptions={false}
          />
        )}
      </section>
      <HaveProjectCTA variant="dark" fadeFromLight />
    </div>
  );
}

export default function ProjectDetail() {
  const { slug = "" } = useParams();
  const { language } = useTranslation();
  return <ProjectContent key={`${slug}-${language}`} slug={slug} />;
}
