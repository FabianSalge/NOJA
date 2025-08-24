import { ArrowRight, Play, Users, Award, Zap, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useEffect, useRef, useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import HaveProjectCTA from '@/components/HaveProjectCTA';
import BrandCarousel from '@/components/BrandCarousel';
import PackageCard from '@/components/PackageCard';
import { HOME_IMAGES, LOGOS } from '@/lib/assets';
import { fetchHome, type CmsHome } from '@/lib/cms';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
// Removed PreFooterCTA from Index per new section flow

const Index = () => {
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });

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
    <div className="min-h-screen bg-background text-foreground">
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
                  y: [-4, 4],
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
                  className="h-32 md:h-40 lg:h-48 w-auto mx-auto drop-shadow-2xl"
                  whileHover={{ scale: 1.02 }}
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
                  <Link to="/projects" className="group inline-flex items-center gap-2 text-background font-semibold text-lg md:text-xl">
                    <span className="relative">
                      Explore our work
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
            className="inline-flex items-center p-3 rounded-full border border-background/40 text-background/90 backdrop-blur-sm hover:bg-background/10 transition-colors"
            animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={handleScroll}
          >
            <ArrowDown className="w-4 h-4" />
          </motion.button>
          </div>
      </section>

      {/* Creative Marketing - What we do best (dark) */}
      <section id="content" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))]/0 via-[hsl(var(--primary))]/0 to-background" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-2">
                <span className="block text-sm md:text-base font-semibold tracking-[0.35em] uppercase text-foreground/60">
                  Creative Marketing
                </span>
                <h2 className="text-5xl md:text-6xl font-black text-foreground tracking-tight">
                  What we do best
                </h2>
              </div>
              <div className="text-foreground/80 text-lg md:text-xl max-w-prose">
                {home?.whatWeDoBestText ? (
                  documentToReactComponents(home.whatWeDoBestText)
                ) : (
                  <p>
                    Intro Text. vIntro Text,Intro Text,Intro, Text,Intro Text,Intro Text,Intro, Text,Intro Text,Intro Text,Intro Text.
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
              <img
                src={HOME_IMAGES.iphone}
                alt="iPhone showcase"
                className="w-full max-w-[200px] md:max-w-[260px] lg:max-w-[300px] mx-auto"
              />
            </motion.div>
          </div>

          {/* Brand logos marquee */}
          <BrandCarousel className="mt-16" brands={home?.brands} />
        </div>
      </section>

      {/* Transition: full dark spacer then dark->beige gradient, then beige spacer */}
      <section className="h-8 md:h-12" style={{ backgroundColor: 'hsl(var(--background))' }} />
      <section className="h-40 md:h-60 bg-gradient-to-b from-background to-[hsl(var(--primary))]" />
      <section className="h-10 md:h-12" style={{ backgroundColor: 'hsl(var(--primary))' }} />

      {/* What you need - Beige packages section */}
      <section className="py-24 relative overflow-hidden" ref={statsRef}>
        <div className="absolute inset-0" style={{ backgroundColor: 'hsl(var(--primary))' }} />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div 
            className="space-y-12"
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-background text-center">What you need</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {packages.map((pkg) => (
                <motion.div key={pkg.title} variants={itemVariants} whileHover={{ y: -6 }}>
                  <PackageCard title={pkg.title} image={pkg.image} link={pkg.link} />
                </motion.div>
              ))}
            </div>
            <div className="pt-6 text-center">
              <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-background/40 text-background font-semibold hover:bg-background/10 transition-colors">
                Explore all Services
                <ArrowRight size={18} />
              </Link>
                </div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview - dark section */}
      {/* Transition: beige -> dark before CTA */}
      <section className="h-40 md:h-60 bg-gradient-to-b from-[hsl(var(--primary))] to-background" />

      <HaveProjectCTA className="py-24" variant="dark" />

      <Footer />
    </div>
  );
};

export default Index;
