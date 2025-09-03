import { ArrowRight, Play, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useEffect, useRef, useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import HaveProjectCTA from '@/components/HaveProjectCTA';
 
import BrandCarousel from '@/components/BrandCarousel';
import PackageCard from '@/components/PackageCard';
 
import { HOME_IMAGES, LOGOS, HOME_VIDEOS } from '@/lib/assets';
import { fetchHome, type CmsHome } from '@/lib/cms';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
// Removed PreFooterCTA from Index per new section flow

const Index = () => {
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const whatWeDoRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const ctaRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
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
  
  const yRange = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacityRange = useTransform(scrollY, [0, 300], [1, 0]);

  

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
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          style={{ y: yRange, opacity: opacityRange }}
        >
          <div className="absolute inset-0 bg-[hsl(var(--primary))]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(var(--primary))]/90 to-transparent" />
        </motion.div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-secondary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10 pt-16" ref={heroRef}>
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            {/* Logo */}
            <motion.div 
              className="space-y-4" 
              variants={itemVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="inline-block relative"
                animate={{
                  y: [-8, 8],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="absolute -inset-6 rounded-full bg-gradient-to-b from-[hsl(var(--primary))]/40 to-transparent blur-xl"
                  animate={{ opacity: [0.2, 0.35, 0.2], scale: [0.98, 1.02, 0.98] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  aria-hidden
                />
                <motion.img 
                  src={LOGOS.nojaWordmark} 
                  alt="NOJA" 
                  className="h-28 md:h-36 lg:h-44 w-auto mx-auto drop-shadow-2xl"
                  loading="eager"
                  decoding="async"
                  whileHover={{ scale: 1.08, y: -2, rotate: 0.4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </motion.div>
              
              <motion.div 
                className="space-y-6" 
                variants={itemVariants}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.h2 
                  className="text-2xl md:text-3xl lg:text-4xl font-semibold text-background tracking-[0.25em] uppercase"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  CONTENT WITH A <motion.span 
                    className="text-secondary"
                    animate={{ 
                      opacity: [1, 0.8, 1],
                      textShadow: [
                        '0 0 0 hsl(var(--secondary))',
                        '0 0 12px hsl(var(--secondary) / 0.4)',
                        '0 0 0 hsl(var(--secondary))'
                      ]
                    }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                  >PULSE</motion.span>
                </motion.h2>
                {/* Minimal CTA */}
                <div className="pt-1">
                  <Link to="/projects" className="group inline-flex items-center gap-2 text-background hover:text-foreground font-semibold text-lg md:text-xl">
                    <span className="relative">
                      Tap into our work
                      <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-background/60 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                    </span>
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced scroll indicator */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <motion.button 
            className="inline-flex items-center p-3 rounded-full border backdrop-blur-sm transition-colors"
            style={{
              borderColor: 'rgba(255,255,255,0.5)',
              color: 'rgba(255,255,255,0.95)'
            }}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={handleScroll}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.button>
        </div>
      </section>

      {/* Creative Marketing - What we do best (dark) */}
      <section id="content" className="min-h-screen flex items-center relative overflow-hidden bg-[hsl(var(--primary))]" ref={whatWeDoRef}>
        {/* Hero-style background transition */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: whatWeDoY, opacity: whatWeDoOpacity }}
        >
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-transparent" />
        </motion.div>
        {/* Section particles (subtle) */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
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
              <div className="relative mx-auto w-full max-w-[140px] md:max-w-[180px] lg:max-w-[220px]">
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
                {/* Visual enhancement */}
                <div className="absolute -inset-8 bg-gradient-to-br from-[hsl(var(--primary))]/20 to-transparent rounded-full blur-3xl opacity-60" />
                {/* Halo shadow under phone */}
                <div
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2 -bottom-5 w-[65%] h-5 md:h-6 lg:h-7 rounded-full"
                  style={{
                    background:
                      'radial-gradient(50% 60% at 50% 50%, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.22) 40%, rgba(0,0,0,0.08) 70%, rgba(0,0,0,0) 100%)',
                    filter: 'blur(5px)',
                    opacity: 0.7,
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Brand logos marquee */}
          <motion.div 
            className="mt-16"
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
      <section className="min-h-screen flex items-center relative overflow-hidden bg-background" ref={statsRef}>
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
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-background text-[hsl(var(--primary))] font-semibold hover:bg-background/90 transition-all duration-300 hover:scale-105"
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

      <Footer />
    </div>
  );
};

export default Index;
