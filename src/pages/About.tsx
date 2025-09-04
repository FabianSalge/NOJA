import { Eye, Lightbulb, RefreshCcw } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HaveProjectCTA from '@/components/HaveProjectCTA';
 
import { fetchAbout, type CmsAboutPage } from '@/lib/cms';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Helmet } from 'react-helmet-async';
import { buildCanonical } from '@/lib/seo';

const About = () => {
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });

  // Hero-style scroll transitions for each section
  const { scrollYProgress: storyProgress } = useScroll({
    target: storyRef,
    offset: ["start center", "end start"]
  });
  const storyY = useTransform(storyProgress, [0.3, 1], [0, -150]);
  const storyOpacity = useTransform(storyProgress, [0.5, 0.95], [1, 0.1]);

  const { scrollYProgress: valuesProgress } = useScroll({
    target: valuesRef,
    offset: ["start center", "end start"]
  });
  const valuesY = useTransform(valuesProgress, [0.3, 1], [0, -150]);
  const valuesOpacity = useTransform(valuesProgress, [0.5, 0.95], [1, 0.1]);

  const { scrollYProgress: teamProgress } = useScroll({
    target: teamRef,
    offset: ["start center", "end start"]
  });
  const teamY = useTransform(teamProgress, [0.3, 1], [0, -150]);
  const teamOpacity = useTransform(teamProgress, [0.5, 0.95], [1, 0.1]);

  const [about, setAbout] = useState<CmsAboutPage | undefined>(undefined);
  useEffect(() => {
    fetchAbout().then(setAbout).catch(() => {
      console.warn('Failed to fetch About page content from Contentful. Falling back to static copy.');
    });
  }, []);

  const values = [
    {
      icon: Eye,
      title: 'Transparency',
      description: 'Open communication and expectations.',
    },
    {
      icon: Lightbulb,
      title: 'Strategic Creativity',
      description: 'Blending concept development, production, and project management for end-to-end solutions.',
    },
    {
      icon: RefreshCcw,
      title: 'Adaptability',
      description: 'Adjusting strategies to client needs fast.',
    }
  ];

  const team = [
    {
      name: 'Naomi Ross',
      role: 'Content Producer',
      image: `${import.meta.env.BASE_URL}images/naomi.avif`,
      description: "Multimedia roots and a natural eye for social-media-savvy, clever transitions.",
      funFact: "Animal hoarder."
    },
    {
      name: 'Talia Persis Jenny',
      role: 'Operations & Management',
      image: `${import.meta.env.BASE_URL}images/talia.png`,
      description: "Versed in design & project management, leading team through the details.",
      funFact: "People pleaser."
    },
    {
      name: 'Jamilla Metzger',
      role: 'Content Producer',
      image: `${import.meta.env.BASE_URL}images/jamilla.avif`,
      description: "Background in multimedia with a gift for bringing out the fullest potential behind lenses.",
      funFact: "Drives a motorcycle..."
    }
  ];

  const actionImages = [
    `${import.meta.env.BASE_URL}images/im1.png`,
    `${import.meta.env.BASE_URL}images/im2.png`,
    `${import.meta.env.BASE_URL}images/im3.jpg`,
    `${import.meta.env.BASE_URL}images/im4.png`,
    `${import.meta.env.BASE_URL}images/im5.png`,
    `${import.meta.env.BASE_URL}images/im6.png`,
    `${import.meta.env.BASE_URL}images/im7.jpg`,
    `${import.meta.env.BASE_URL}images/im8.jpg`,
  ];

  

  return (
    <div className="min-h-screen bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
      <Helmet>
        <title>About NOJA — Why Us</title>
        <meta name="description" content="We blend concept, production, and project management to deliver strategic creative content." />
        <link rel="canonical" href={buildCanonical('/about')} />
      </Helmet>
      <Navigation />

      {/* Our Story (Beige) */}
      <section className="min-h-screen flex items-center relative overflow-hidden bg-background" ref={storyRef}>
        {/* Hero-style background transition */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: storyY, opacity: storyOpacity }}
        >
          <div className="absolute inset-0 bg-[hsl(var(--primary))]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(var(--primary))]/90 to-transparent" />
        </motion.div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            variants={containerVariants}
            initial="hidden"
            animate={storyInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="space-y-6" 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="space-y-4">
                <span className="block text-sm md:text-base font-semibold tracking-[0.35em] uppercase text-background/60">
                  About NOJA
                </span>
                <motion.h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-black text-background tracking-tight leading-[0.9]"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Why Us
                </motion.h2>
              </div>
              <div className="space-y-4 text-lg text-background/80 leading-relaxed">
                {about?.ourStoryText ? (
                  documentToReactComponents(about.ourStoryText)
                ) : (
                  <>
                    <motion.p
                      initial={{ opacity: 0, x: -30 }}
                      animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="border-l-2 border-background/30 pl-4"
                    >
                      NOJA was born from a shared vision between three creatives with backgrounds in Design Management and Multimedia.
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, x: -30 }}
                      animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      className="border-l-2 border-background/30 pl-4"
                    >
                      We saw the gap between great ideas and great execution — so we built an agency that does both.
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, x: -30 }}
                      animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="border-l-2 border-background/30 pl-4"
                    >
                      From concept to delivery, we combine strategy, project management, and production to create content that stands out and performs.
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, x: -30 }}
                      animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="border-l-2 border-background/30 pl-4"
                    >
                      Based in Zurich, working worldwide.
                    </motion.p>
                  </>
                )}
              </div>
            </motion.div>
            <motion.div 
              className="relative" 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div 
                className="aspect-square bg-gradient-to-br from-[hsl(var(--primary))]/60 to-[hsl(var(--primary))]/80 rounded-3xl overflow-hidden border border-background/10 shadow-2xl max-w-md mx-auto"
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <img 
                  src={about?.ourStoryImageUrl || `${import.meta.env.BASE_URL}uploads/98ba3b82-16aa-4114-baf8-100af2d90634.png`}
                  alt="Team collaboration" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      

      {/* Values Section */}
      <section className="pt-24 pb-40 relative overflow-hidden bg-[hsl(var(--primary))]" ref={valuesRef}>
        {/* Hero-style background transition */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: valuesY, opacity: valuesOpacity }}
        >
          <div className="absolute inset-0 bg-background" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-transparent" />
        </motion.div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            className="text-center mb-12 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground text-center leading-[0.9]">
                Our Values
              </h2>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className="group"
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <motion.div 
                  className="bg-foreground/5 backdrop-blur-sm rounded-2xl p-6 h-full border border-foreground/10 hover:border-foreground/20 transition-all duration-300 text-center"
                  whileHover={{ y: -4 }}
                >
                  <motion.div 
                    className="w-12 h-12 bg-foreground text-[hsl(var(--primary))] rounded-xl flex items-center justify-center mx-auto mb-4"
                    whileHover={{ rotate: 15 }}
                    transition={{ duration: 0.3 }}
                  >
                    <value.icon size={24} />
                  </motion.div>
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 relative overflow-hidden bg-[hsl(var(--primary))]" ref={teamRef}>
        {/* Hero-style background transition */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: teamY, opacity: teamOpacity }}
        >
          <div className="absolute inset-0 bg-[hsl(var(--primary))]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(var(--primary))]/90 to-transparent" />
        </motion.div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            className="text-center mb-12 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-background text-center leading-[0.9]">
                We are NOJA
              </h2>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={teamInView ? 'visible' : 'hidden'}
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                className="relative group overflow-hidden rounded-2xl shadow-lg"
                variants={itemVariants}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 aspect-[2/3]"
                />
                <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1 text-white">
                  <p className="text-secondary font-semibold">{member.role}</p>
                  <h3 className="text-3xl font-bold">{member.name}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* In Action Marquee */}
      <section className="py-20 bg-[hsl(var(--primary))] overflow-hidden">
        <div className="relative w-full">
          <div className="flex w-max marquee-content">
            {[...actionImages, ...actionImages].map((src, index) => (
              <div key={index} className="flex-shrink-0 px-2">
                <div className="overflow-hidden rounded-2xl w-56 aspect-[9/16]">
                  <img
                    src={src}
                    alt={`Action shot ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HaveProjectCTA className="py-24" variant="dark" />
      <Footer />
    </div>
  );
};

export default About;