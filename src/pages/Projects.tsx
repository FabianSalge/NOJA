import { buildContentfulSrcSet } from '@/lib/images';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HaveProjectCTA from '@/components/HaveProjectCTA';
 
import { fetchProjectsPage, type CmsProjectSummary } from '@/lib/cms';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Helmet } from 'react-helmet-async';
import SEOJsonLd from '@/components/SEOJsonLd';
import { buildCanonical, getSiteUrl } from '@/lib/seo';
import type { Document } from '@contentful/rich-text-types';

const Projects = () => {
  const featuredRef = useRef(null);
  const allProjectsRef = useRef(null);
  const [featured, setFeatured] = useState<CmsProjectSummary[]>([]);
  const [allProjects, setAllProjects] = useState<CmsProjectSummary[]>([]);
  const [subtext, setSubtext] = useState<Document | undefined>(undefined);

  const featuredInView = useInView(featuredRef, { once: true, margin: "-100px" });
  const allProjectsInView = useInView(allProjectsRef, { once: true, margin: "-100px" });

  // Hero-style scroll transitions for sections
  const { scrollYProgress: featuredProgress } = useScroll({
    target: featuredRef,
    offset: ["start center", "end start"]
  });
  const featuredY = useTransform(featuredProgress, [0.3, 1], [0, -150]);
  const featuredOpacity = useTransform(featuredProgress, [0.5, 0.95], [1, 0.1]);

  useEffect(() => {
    fetchProjectsPage()
      .then((data) => {
        setFeatured(data.featured);
        setAllProjects(data.all);
        setSubtext(data.ourWorkSubtext);
      })
      .catch(() => {
        console.warn('Failed to fetch Projects from Contentful.');
      });
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const ProjectCard = ({ project }: { project: CmsProjectSummary }) => (
    <Link to={`/projects/${project.slug}`} className="block">
      <motion.div
        variants={itemVariants}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="group relative overflow-hidden rounded-2xl shadow-lg bg-foreground/5 border border-foreground/10"
      >
        <img
          src={project.coverImageUrl}
          srcSet={buildContentfulSrcSet(project.coverImageUrl)}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          alt={project.title}
          className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 ease-in-out group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
          <p className="text-sm text-white/80">{project.subtitle} · {new Date(project.dateISO).getFullYear()}</p>
          <h3 className="text-3xl lg:text-4xl font-bold text-white tracking-wide">
            {project.title}
          </h3>
        </div>
      </motion.div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Projects — NOJA</title>
        <meta name="description" content="Featured and recent creative projects by NOJA." />
        <link rel="canonical" href={buildCanonical('/projects')} />
      </Helmet>
      <SEOJsonLd
        json={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem', position: 1,
              name: 'Home', item: getSiteUrl()
            },
            {
              '@type': 'ListItem', position: 2,
              name: 'Projects', item: buildCanonical('/projects')
            }
          ]
        }}
      />
      <Navigation />
      
      {/* Featured Projects Section */}
      <section className="min-h-screen flex items-center relative overflow-hidden bg-background" ref={featuredRef}>
        {/* Hero-style background transition */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: featuredY, opacity: featuredOpacity }}
        >
          <div className="absolute inset-0 bg-[hsl(var(--primary))]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(var(--primary))]/90 to-transparent" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
            className="text-center mb-16 space-y-8"
            initial="hidden"
            animate={featuredInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <span className="block text-sm md:text-base font-semibold tracking-[0.35em] uppercase text-background/60 mb-4">
                Portfolio
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-background text-center leading-[0.9]">
                Featured Projects
              </h1>
            </motion.div>
            <motion.div 
              className="text-lg md:text-xl text-background/80 max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              {subtext ? (
                documentToReactComponents(subtext)
              ) : (
                <p>
                  The Pulse Effect in Action
                </p>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            initial="hidden"
            animate={featuredInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {featured.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </motion.div>

          {/* All Projects - Compact Display */}
          {allProjects.length > 0 && (
            <div className="mt-20">
              <motion.div
                className="text-center mb-12 space-y-4"
                initial={{ opacity: 0, y: 30 }}
                animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuredInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <span className="block text-sm md:text-base font-semibold tracking-[0.35em] uppercase text-background/60 mb-4">
                    More Work
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-background text-center leading-[0.9]">
                    All Projects
                  </h2>
                </motion.div>
              </motion.div>

              {/* Compact grid for all projects */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6"
                initial="hidden"
                animate={featuredInView ? "visible" : "hidden"}
                variants={containerVariants}
              >
                {allProjects.map((project, index) => (
                  <Link key={`all-${index}`} to={`/projects/${project.slug}`} className="block">
                    <motion.div
                      variants={itemVariants}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="group relative overflow-hidden rounded-xl shadow-md bg-background/5 border border-background/10"
                      whileHover={{ y: -4, scale: 1.02 }}
                    >
                      <img
                        src={project.coverImageUrl}
                        srcSet={buildContentfulSrcSet(project.coverImageUrl)}
                        sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
                        alt={project.title}
                        className="w-full h-full object-cover aspect-square transition-transform duration-500 ease-in-out group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 p-3 w-full">
                        <p className="text-xs text-white/80 mb-1">{new Date(project.dateISO).getFullYear()}</p>
                        <h3 className="text-sm font-bold text-white leading-tight line-clamp-2">
                          {project.title}
                        </h3>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <HaveProjectCTA className="py-20" variant="dark" />
      <Footer />
    </div>
  );
};

export default Projects;
