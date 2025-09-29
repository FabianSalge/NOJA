import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useEffect, useRef, useState } from 'react';
import HaveProjectCTA from '@/components/HaveProjectCTA';
 
import BrandCarousel from '@/components/BrandCarousel';
import PackageCard from '@/components/PackageCard';
 
import { HOME_IMAGES, HOME_VIDEOS } from '@/lib/assets';
import { fetchHome, type CmsHome } from '@/lib/cms';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Helmet } from 'react-helmet-async';
import SEOJsonLd from '@/components/SEOJsonLd';
import { buildCanonical, getSiteUrl } from '@/lib/seo';
import Hero from '@/components/home/Hero';

const Index = () => {
  const whatWeDoRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const ctaRef = useRef(null);
  
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });

  // Hero-style scroll transitions for each section
  const { scrollYProgress: whatWeDoProgress } = useScroll({
    target: whatWeDoRef,
    offset: ["start center", "end start"]
  });
  const whatWeDoY = useTransform(whatWeDoProgress, [0.3, 1], [0, -150]);
  const whatWeDoOpacity = useTransform(whatWeDoProgress, [0.5, 0.95], [1, 0.1]);

  const { scrollYProgress: statsProgress } = useScroll({
    target: statsRef,
    offset: ["start center", "end start"]
  });
  const statsY = useTransform(statsProgress, [0.3, 1], [0, -150]);
  const statsOpacity = useTransform(statsProgress, [0.5, 0.95], [1, 0.1]);

  const [home, setHome] = useState<CmsHome | undefined>(undefined);
  useEffect(() => {
    fetchHome().then(setHome).catch(() => {
      console.warn('Failed to fetch Home data from Contentful. Falling back to static content.');
    });
  }, []);
  
  

  const handleScroll = () => {
    const contentElement = document.getElementById('content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const defaultPackages = [
    { title: 'Content Strategy & Creative Direction', image: HOME_IMAGES.contentStrategy, link: '/services' },
    { title: 'Video & Photography Production', image: HOME_IMAGES.videoPhotography, link: '/services' },
    { title: 'Post-Production & Editing', image: HOME_IMAGES.postProduction, link: '/services' },
  ];

  const packages = (home?.whatYouNeedCards?.length ? home.whatYouNeedCards : undefined)?.map((c) => ({
    title: c.title || 'What you need',
    image: c.imageUrl || HOME_IMAGES.contentStrategy,
    link: '/services',
  })) || defaultPackages;

  

  return (
    <div className="min-h-screen beige-orbs text-foreground relative">
      <Helmet>
        <title>NOJA — Content With A Pulse</title>
        <meta name="description" content="Creative marketing agency crafting scroll-stopping content that drives impact." />
        <link rel="canonical" href={buildCanonical('/')} />
        <meta property="og:title" content="NOJA — Content With A Pulse" />
        <meta property="og:description" content="Creative marketing agency crafting scroll-stopping content that drives impact." />
        <meta property="og:type" content="website" />
      </Helmet>
      <SEOJsonLd
        json={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'NOJA',
            url: getSiteUrl(),
            logo: `${getSiteUrl()}/Logos/Noja_Productions.png`,
            sameAs: [
              'https://instagram.com/nojaagency',
              'https://tiktok.com/@nojaagency'
            ]
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'NOJA',
            url: getSiteUrl(),
            potentialAction: {
              '@type': 'SearchAction',
              target: `${getSiteUrl()}/?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          }
        ]}
      />
      <Hero onScrollIndicatorClick={handleScroll} />

      {/* Creative Marketing - What we do best (dark) */}
      <section id="content" className="min-h-screen flex items-center relative overflow-hidden bg-[hsl(var(--primary))]" ref={whatWeDoRef}>
        {/* Hero-style background transition */}
        <motion.div 
          className="absolute inset-0 hidden md:block"
          style={{ y: whatWeDoY, opacity: whatWeDoOpacity }}
        >
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-transparent" />
        </motion.div>
        {/* Static dark background for mobile to keep section dark without parallax */}
        <div className="absolute inset-0 md:hidden">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-transparent" />
        </div>
        {/* Section particles (subtle) */}
        <div className="absolute inset-0 overflow-hidden hidden md:block" aria-hidden>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`wd-${i}`}
              className="absolute rounded-full bg-[hsl(var(--primary))]/35"
              style={{
                left: `${(i * 17 + 10) % 95}%`,
                top: `${(i * 21 + 8) % 85}%`,
                width: `${6 + (i % 3) * 4}px`,
                height: `${6 + (i % 3) * 4}px`,
                filter: 'blur(0.5px)'
              }}
              animate={{ y: [-16, 14, -16], opacity: [0.3, 0.8, 0.3], scale: [1, 1.18, 1] }}
              transition={{ duration: 6 + (i % 4), repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
        
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[0.9]">
                  The Pulse Effect
                </h2>
              </div>
              <div className="text-foreground/80 text-lg md:text-xl leading-relaxed">
                {home?.whatWeDoBestText ? (
                  documentToReactComponents(home.whatWeDoBestText)
                ) : (
                  <p>
                    We craft bold visual stories that capture attention and drive results. From concept to execution, our creative marketing approach ensures your brand stands out in the digital landscape.
                  </p>
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
              <div className="relative mx-auto w-full max-w-[520px] md:max-w-[560px] lg:max-w-[640px] xl:max-w-[720px] 2xl:max-w-[780px] sm:scale-[1.15] lg:scale-[1.15] xl:scale-[1.3] 2xl:scale-[1.45] rotate-[4deg]">
                {/\.gif$/i.test(HOME_VIDEOS.homePhone) ? (
                  <img
                    src={HOME_VIDEOS.homePhone}
                    alt="Phone preview animation"
                    className="w-full h-auto rounded-xl"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <video
                    src={HOME_VIDEOS.homePhone}
                    className="w-full h-auto rounded-xl"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={HOME_IMAGES.iphone}
                  />
                )}
                {/* Visual enhancement */}
                <div className="absolute -inset-10 bg-gradient-to-br from-[hsl(var(--primary))]/25 via-[hsl(var(--primary))]/8 to-transparent rounded-full blur-2xl opacity-60" />
                <div
                  className="absolute -inset-16 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(50% 50% at 50% 50%, rgba(225,208,193,0.20) 0%, rgba(225,208,193,0.12) 35%, rgba(225,208,193,0) 70%)',
                    filter: 'blur(20px)',
                    opacity: 0.6,
                  }}
                />
                {/* Halo shadow under phone */}
                <div
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-6 w-[80%] h-8 md:h-10 lg:h-12 rounded-full"
                  style={{
                    background:
                      'radial-gradient(50% 60% at 50% 50%, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.10) 70%, rgba(0,0,0,0) 100%)',
                    filter: 'blur(6px)',
                    opacity: 0.75,
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Brand logos marquee */}
          <motion.div 
            className="mt-28 md:mt-32 lg:mt-36 mb-0 relative z-0"
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
      <section className="min-h-screen flex items-start relative overflow-hidden bg-background pt-6 md:pt-8 lg:pt-10" ref={statsRef}>
        {/* Static beige background (primary state) */}
        <div className="absolute inset-0 bg-[hsl(var(--primary))]" />
        {/* Hero-style background transition (peels away to reveal dark) */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: statsY, opacity: statsOpacity }}
        >
          <div className="absolute inset-0 bg-[hsl(var(--primary))]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(var(--primary))]/90 to-transparent" />
        </motion.div>
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
                filter: 'blur(0.5px)'
              }}
              animate={{ y: [-14, 12, -14], opacity: [0.3, 0.8, 0.3], scale: [1, 1.15, 1] }}
              transition={{ duration: 7 + (i % 5), repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </div>
        
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
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
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-background text-center leading-[0.9]">
                  Services
                </h2>
              </motion.div>
              <motion.p 
                className="text-lg md:text-xl text-background/80 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Concepts, creation, execution — turning ideas into scroll-stopping visuals.
              </motion.p>
            </div>

            {/* Service cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8"
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
                    <PackageCard title={pkg.title} image={pkg.image} link={pkg.link} />
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
                  Explore all Services
                  <ArrowRight size={18} />
                </Link>
                <Link 
                  to="/contact" 
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-background text-[hsl(var(--primary))] font-semibold hover:bg-background/90 transition-all duration-300 hover:scale-105 mb-6 sm:mb-0"
                >
                  Start a Project
                  <Play size={16} />
                </Link>
              </div>
              

            </motion.div>
          </motion.div>
        </div>
      </section>

      <HaveProjectCTA className="py-20" variant="dark" />

      
    </div>
  );
};

export default Index;
