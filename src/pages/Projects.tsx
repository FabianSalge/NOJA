import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import HaveProjectCTA from '@/components/HaveProjectCTA';
import { fetchProjectsPage, type CmsProjectSummary } from '@/lib/cms';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { Document } from '@contentful/rich-text-types';

const Projects = () => {
  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const [featured, setFeatured] = useState<CmsProjectSummary[]>([]);
  const [allProjects, setAllProjects] = useState<CmsProjectSummary[]>([]);
  const [subtext, setSubtext] = useState<Document | undefined>(undefined);

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
          alt={project.title}
          className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 ease-in-out group-hover:scale-105"
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
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[hsl(var(--primary))]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(var(--primary))]/90 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-foreground"
              variants={itemVariants}
            >
              Our{' '}
              <motion.span 
                className="text-secondary"
                animate={{ 
                  textShadow: [
                    '0 0 10px hsl(var(--secondary) / 0.5)',
                    '0 0 20px hsl(var(--secondary) / 0.8)',
                    '0 0 10px hsl(var(--secondary) / 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Work
              </motion.span>
            </motion.h1>
            <motion.div 
              className="text-xl text-background/80 max-w-3xl mx-auto leading-relaxed border-l-4 border-background/30 pl-6"
              variants={itemVariants}
            >
              {subtext ? (
                documentToReactComponents(subtext)
              ) : (
                <p>
                  We've had the privilege of working with a diverse range of clients to create content that captivates, inspires, and drives results.
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 relative" ref={projectsRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              A curated selection of recent collaborations. Click into any project to see the story and outcomes.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {featured.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </motion.div>

          {/* All Projects */}
          {allProjects.length > 0 && (
            <div className="mt-20">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">All Projects</h3>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
              >
                {allProjects.map((project, index) => (
                  <ProjectCard key={`all-${index}`} project={project} />
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <HaveProjectCTA className="py-24" variant="dark" />
      <Footer />
    </div>
  );
};

export default Projects;
