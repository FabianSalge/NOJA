import { usePageData } from "@/lib/page-data";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import { useEffect, useRef, useState } from "react";
import HaveProjectCTA from "@/components/HaveProjectCTA";

import BrandCarousel from "@/components/BrandCarousel";
import PackageCard from "@/components/PackageCard";

import { HOME_IMAGES, HOME_VIDEOS } from "@/lib/assets";
import { fetchHome, localeForLanguage, type CmsHome } from "@/lib/cms";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { richTextOptions } from "@/lib/richtext";
import PageSEO from "@/components/PageSEO";
import SEOJsonLd from "@/components/SEOJsonLd";
import { getSiteUrl } from "@/lib/seo";
import Hero from "@/components/home/Hero";
import LoopingVideo from "@/components/LoopingVideo";
import { useTranslation } from "@/i18n";
import { feedbackServices } from "@/content/service-categories";

const Index = () => {
  const { t, language } = useTranslation();
  const initialData = usePageData<CmsHome>();
  const whatWeDoRef = useRef(null);
  const statsRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const reducedMotion = useReducedMotion();

  const [home, setHome] = useState<CmsHome | undefined>(initialData);
  useEffect(() => {
    if (initialData) return;
    fetchHome(localeForLanguage(language))
      .then(setHome)
      .catch(() => {
        console.warn(
          "Failed to fetch Home data from Contentful. Falling back to static content.",
        );
      });
  }, [language, initialData]);

  const handleScroll = () => {
    const contentElement = document.getElementById("content");
    if (contentElement) {
      contentElement.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  };

  const defaultPackages = [
    {
      title: "Content Strategy & Creative Direction",
      image: HOME_IMAGES.contentStrategy,
      link: "/services",
    },
    {
      title: "Video & Photography Production",
      image: HOME_IMAGES.videoPhotography,
      link: "/services",
    },
    {
      title: "Post-Production & Editing",
      image: HOME_IMAGES.postProduction,
      link: "/services",
    },
  ];

  const currentPackages =
    (home?.whatYouNeedCards?.length ? home.whatYouNeedCards : undefined)?.map(
      (c) => ({
        title: c.title || "What you need",
        image: c.imageUrl || HOME_IMAGES.contentStrategy,
        link: "/services",
      }),
    ) || defaultPackages;

  const previewCategories =
    import.meta.env.DEV &&
    import.meta.env.VITE_FEEDBACK_SERVICES_PREVIEW === "true";
  const packages = previewCategories
    ? feedbackServices(language).map((category, index) => ({
        title: category.title,
        image:
          currentPackages[[0, 2, 1][index]]?.image ||
          HOME_IMAGES.contentStrategy,
        link: "/services",
      }))
    : currentPackages;

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <PageSEO />
      <SEOJsonLd
        json={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "NOJA",
            url: getSiteUrl(),
            logo: `${getSiteUrl()}/Logos/Noja_Productions.png`,
            sameAs: [
              "https://instagram.com/nojaagency",
              "https://tiktok.com/@nojaagency",
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "NOJA",
            url: getSiteUrl(),
          },
        ]}
      />
      <Hero onScrollIndicatorClick={handleScroll} title={home?.heroTitle} />

      {/* Creative Marketing - What we do best (dark) */}
      <section
        id="content"
        className="min-h-screen scroll-mt-20 flex items-center relative overflow-hidden bg-background py-16 md:py-20 2xl:py-28"
        ref={whatWeDoRef}
      >
        {/* Section particles (subtle) */}
        <div
          className="absolute inset-0 overflow-hidden hidden md:block"
          aria-hidden
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`wd-${i}`}
              className="absolute rounded-full bg-[hsl(var(--primary))]/35"
              style={{
                left: `${(i * 17 + 10) % 95}%`,
                top: `${(i * 21 + 8) % 85}%`,
                width: `${6 + (i % 3) * 4}px`,
                height: `${6 + (i % 3) * 4}px`,
                filter: "blur(0.5px)",
              }}
              animate={{
                y: [-16, 14, -16],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.18, 1],
              }}
              transition={{
                duration: 6 + (i % 4),
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-black text-foreground tracking-tight leading-[0.9]">
                  {home?.pulseEffectTitle || t.home.pulseEffect.title}
                </h2>
              </div>
              <div className="text-foreground/80 text-lg md:text-xl 2xl:text-2xl leading-relaxed">
                {home?.whatWeDoBestText ? (
                  documentToReactComponents(
                    home.whatWeDoBestText,
                    richTextOptions,
                  )
                ) : (
                  <p>{t.home.pulseEffect.description}</p>
                )}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative mx-auto w-[210px] sm:w-[240px] lg:w-[270px] 2xl:w-[300px] aspect-[484/922]">
                <LoopingVideo
                  src={HOME_VIDEOS.homePhone}
                  poster={`${import.meta.env.BASE_URL}videos/home-phone-poster.webp`}
                  mediaClassName="rotate-[4deg] rounded-[28px]"
                />
              </div>
            </motion.div>
          </div>

          {/* Brand logos marquee */}
          <motion.div
            className="mt-24 sm:mt-28 md:mt-36 lg:mt-44 2xl:mt-56 mb-10 md:mb-12 relative z-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <BrandCarousel brands={home?.brands} />
          </motion.div>
        </div>
      </section>

      {/* What you need - Beige section */}
      <section
        className="flex items-start relative overflow-hidden surface-fade py-16 md:py-20 2xl:py-28"
        ref={statsRef}
      >
        {/* Section particles (subtle) */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={`ny-${i}`}
              className="absolute rounded-full bg-[hsl(var(--primary))]/35"
              style={{
                left: `${(i * 23 + 6) % 96}%`,
                top: `${(i * 19 + 12) % 86}%`,
                width: `${6 + (i % 4) * 4}px`,
                height: `${6 + (i % 4) * 4}px`,
                filter: "blur(0.5px)",
              }}
              animate={
                reducedMotion
                  ? undefined
                  : {
                      y: [-14, 12, -14],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.15, 1],
                    }
              }
              transition={{
                duration: 7 + (i % 5),
                repeat: Infinity,
                delay: i * 0.18,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
          <motion.div
            className="space-y-16"
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Section header without pre-heading */}
            <div className="text-center space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-black text-background text-center leading-[0.9]">
                  {home?.servicesSectionTitle || t.home.services.title}
                </h2>
              </motion.div>
              <motion.p
                className="text-lg md:text-xl 2xl:text-2xl text-background/80 max-w-2xl 2xl:max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {home?.servicesSectionSubtitle || t.home.services.subtitle}
              </motion.p>
            </div>

            {/* Service cards */}
            <motion.div
              className={`grid grid-cols-1 ${packages.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"} gap-6 lg:gap-8`}
              variants={containerVariants}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
            >
              {packages.map((pkg, index) => (
                <motion.div
                  key={pkg.title}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  custom={index}
                >
                  <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-b from-[hsl(var(--primary))]/60 via-[hsl(var(--primary))]/15 to-transparent">
                    <PackageCard
                      title={pkg.title}
                      image={pkg.image}
                      link={pkg.link}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Action section */}
            <motion.div
              className="text-center space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-background/40 text-background font-semibold hover:bg-background/10 transition-all duration-300 hover:scale-105"
                >
                  {t.home.services.exploreAll}
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-background text-[hsl(var(--primary))] font-semibold hover:bg-background/90 transition-all duration-300 hover:scale-105 mb-6 sm:mb-0"
                >
                  {t.home.services.startProject}
                  <Play size={16} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <HaveProjectCTA variant="dark" fadeFromLight />
    </div>
  );
};

export default Index;
