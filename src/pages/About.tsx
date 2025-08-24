import { Eye, Lightbulb, RefreshCcw } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useEffect, useRef, useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import HaveProjectCTA from '@/components/HaveProjectCTA';
import { fetchAbout, type CmsAboutPage } from '@/lib/cms';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const About = () => {
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });

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
      description: 'Adjusting strategies to trends and client needs fast.',
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
      image: `${import.meta.env.BASE_URL}images/talia.avif`,
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
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Our Story (Beige) */}
      <section className="pt-28 md:pt-32 pb-20 relative overflow-hidden" ref={storyRef}>
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ backgroundColor: 'hsl(var(--primary))' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
              <motion.h2 
                className="text-4xl font-bold text-background"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Our Story
              </motion.h2>
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
                      We saw the gap between great ideas and flawless execution — so we built an agency that does both.
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
                className="aspect-square bg-gradient-to-br from-[hsl(var(--primary))]/60 to-[hsl(var(--primary))]/80 rounded-3xl overflow-hidden border border-background/20 shadow-2xl"
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.img 
                  src={about?.ourStoryImageUrl || `${import.meta.env.BASE_URL}uploads/98ba3b82-16aa-4114-baf8-100af2d90634.png`}
                  alt="Team collaboration" 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              
              {/* Floating accent elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-secondary/20 rounded-full blur-md"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-20 h-20 bg-background/30 rounded-full blur-lg"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.6, 0.3] 
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Transition: beige -> dark (between Story and Values) */}
      <section className="h-8 md:h-12" style={{ backgroundColor: 'hsl(var(--primary))' }} />
      <section className="h-40 md:h-60 bg-gradient-to-b from-[hsl(var(--primary))] to-background" />
      <section className="h-10 md:h-12" style={{ backgroundColor: 'hsl(var(--background))' }} />

      {/* Values Section */}
      <section className="py-24 relative overflow-hidden" ref={valuesRef}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-background" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">Our Values</h2>
            <motion.div 
              className="w-24 h-1 bg-foreground/60 mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={valuesInView ? { width: 96 } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className="text-center space-y-4 group bg-foreground/5 rounded-2xl p-6 border border-foreground/10"
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-foreground text-background rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-foreground/20"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <value.icon size={32} />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground">
                  {value.title}
                </h3>
                <p className="text-foreground/80 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 bg-gradient-to-b from-background to-[hsl(var(--primary))] relative" ref={teamRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-foreground">Meet the Team</h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
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
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 aspect-[4/5]"
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

      {/* In Action Marquee (beige -> dark) */}
      <section className="py-20 bg-gradient-to-b from-[hsl(var(--primary))] to-background overflow-hidden">
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