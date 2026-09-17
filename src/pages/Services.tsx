import { usePageData } from "@/lib/page-data";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Check } from "lucide-react";
import HaveProjectCTA from "@/components/HaveProjectCTA";
import {
  fetchServicesPage,
  localeForLanguage,
  type CmsServicesPage,
  type CmsServiceItem,
} from "@/lib/cms";
import PageSEO from "@/components/PageSEO";
import SEOJsonLd from "@/components/SEOJsonLd";
import { getSiteUrl } from "@/lib/seo";
import ResponsiveImage from "@/components/ResponsiveImage";
import LoopingVideo from "@/components/LoopingVideo";
import {
  feedbackServices,
  feedbackServicesSubtitle,
} from "@/content/service-categories";
import { useTranslation } from "@/i18n";
import { additionalServices } from "@/content/additional-services";

const Services = () => {
  const { t, language } = useTranslation();
  const initialData = usePageData<CmsServicesPage>();
  const [servicesData, setServicesData] = useState<CmsServicesPage | undefined>(
    initialData,
  );
  const [isDataLoaded, setIsDataLoaded] = useState(Boolean(initialData));

  useEffect(() => {
    if (initialData) return;
    fetchServicesPage(localeForLanguage(language))
      .then((data) => {
        setServicesData(data);
        setIsDataLoaded(true);
      })
      .catch(() => {
        console.warn("Failed to fetch Services from Contentful.");
        setIsDataLoaded(true); // Still set to true to prevent infinite loading
      });
  }, [language, initialData]);

  // Media component that handles both images and videos
  const ServiceMedia = ({
    mediaUrl,
    alt,
    className,
  }: {
    mediaUrl?: string;
    alt: string;
    className?: string;
  }) => {
    if (mediaUrl && /\.(mp4|webm|ogg|mov)(?:\?|$)/i.test(mediaUrl)) {
      return <LoopingVideo src={mediaUrl} />;
    }

    // Fallback to image if it's not a video or video failed to load
    return (
      <ResponsiveImage
        src={mediaUrl}
        widths={[400, 640, 1024, 1366, 1600]}
        sizes="(min-width: 1024px) 50vw, (min-width: 640px) 80vw, 100vw"
        alt={alt}
        className={className}
      />
    );
  };

  const ServiceSection = ({
    service,
    isDark,
    isReverse,
  }: {
    service: CmsServiceItem;
    isDark: boolean;
    isReverse: boolean;
  }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-150px" });
    const textColor = isDark ? "text-foreground" : "text-background"; // Dark bg = light text, Beige bg = dark text
    return (
      <section
        ref={sectionRef}
        className={`py-16 md:py-20 2xl:py-28 relative overflow-hidden ${
          isDark ? "bg-background" : "surface-fade"
        }`}
      >
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className={`aspect-[4/3] relative overflow-hidden rounded-2xl shadow-xl ${
                isReverse ? "lg:order-last" : ""
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ServiceMedia
                mediaUrl={service.serviceMediaUrl}
                alt={service.title}
                className="w-full h-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </motion.div>

            <div className="space-y-6">
              {/* Icon removed per request */}

              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2
                    className={`text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-black ${textColor} leading-[0.9]`}
                  >
                    {service.title}
                  </h2>
                  {service.subtitle && (
                    <p
                      className={`mt-3 text-base 2xl:text-lg ${textColor} opacity-75`}
                    >
                      {service.subtitle}
                    </p>
                  )}
                </motion.div>
              </div>

              <motion.p
                className={`${textColor}/80 leading-relaxed text-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {service.description}
              </motion.p>

              {service.subtitle && (
                <p className={`text-sm font-semibold ${textColor}`}>
                  {t.services.deliverables}
                </p>
              )}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {service.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <Check
                      className={`w-5 h-5 shrink-0 ${
                        isDark ? "text-foreground" : "text-background"
                      }`}
                    />
                    <span className={`${textColor} font-medium`}>
                      {feature}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  };

  const displayServices: CmsServiceItem[] = servicesData?.services?.length
    ? servicesData.services
    : [...feedbackServices(language), ...additionalServices(language)];
  const displayTitle = servicesData?.heroTitle || t.services.title;
  const displaySubtitle =
    servicesData?.heroSubtitle || feedbackServicesSubtitle[language];

  // Optional hero background image from the CMS. When absent, fall back to the flat beige header.
  const heroBg = servicesData?.heroBackgroundImageUrl;
  const heroTitleColor = heroBg ? "text-white" : "text-background";
  const heroSubtitleColor = heroBg ? "text-white/85" : "text-background/80";

  // Block only while the first fetch is in flight; once settled, fall through to
  // CMS data when present or the static fallbackServices when not.
  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="pt-36 pb-24 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">{t.common.loading}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <PageSEO />
      <SEOJsonLd
        json={{
          "@context": "https://schema.org",
          "@type": "Service",
          provider: {
            "@type": "Organization",
            name: "NOJA",
            url: getSiteUrl(),
            logo: `${getSiteUrl()}/Logos/Noja_Productions.png`,
          },
          name:
            language === "de"
              ? "Kreative Marketing-Leistungen"
              : "Creative Marketing Services",
          areaServed: "Worldwide",
          serviceType: displayServices
            .map((service) => service.title)
            .join(", "),
        }}
      />

      {/* Compact Header */}
      <section
        className={`relative overflow-hidden pt-24 pb-16 ${heroBg ? "" : "surface-fade"} text-foreground`}
      >
        {heroBg && (
          <>
            <ResponsiveImage
              src={heroBg}
              widths={[768, 1024, 1366, 1600, 1920]}
              sizes="100vw"
              alt=""
              eager
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        )}
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1
                className={`text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-black ${heroTitleColor} text-center leading-[0.9]`}
              >
                {displayTitle}
              </h1>
            </motion.div>

            <motion.p
              className={`text-lg md:text-xl 2xl:text-2xl ${heroSubtitleColor} max-w-2xl 2xl:max-w-3xl mx-auto leading-relaxed`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {displaySubtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Sections */}
      {displayServices.map((service, index) => (
        <ServiceSection
          key={service.title}
          service={service}
          isDark={index % 2 === 0}
          isReverse={service.alternateLayout ?? index % 2 !== 0}
        />
      ))}

      <HaveProjectCTA
        variant="dark"
        fadeFromLight={displayServices.length % 2 === 0}
      />
    </div>
  );
};

export default Services;
