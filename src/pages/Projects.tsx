import { motion, useInView } from 'framer-motion';
import { ExternalLink, Play } from 'lucide-react';
import { useRef } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import PreFooterCTA from '@/components/PreFooterCTA';

interface Project {
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  year: string;
}

const Projects = () => {
  const heroRef = useRef(null);
  const projectsRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const areProjectsInView = useInView(projectsRef, { once: true, margin: "-100px" });

  const projects: Project[] = [
    {
      title: 'OASG 25\'',
      category: 'Event Recap',
      description: 'A dynamic recap of the OASG 25\' event, capturing the energy and key moments of the celebration.',
      image: `${import.meta.env.BASE_URL}images/oasg.avif`,
      tags: ['Event Coverage', 'Videography', 'Recap'],
      year: '2024',
    },
    {
      title: 'LE CLÉ MARIE',
      category: 'Brand Film',
      description: 'An elegant brand film for LE CLÉ MARIE, showcasing their new collection with a cinematic touch.',
      image: `${import.meta.env.BASE_URL}images/leclemarie.avif`,
      tags: ['Brand Film', 'Fashion', 'Storytelling'],
      year: '2024',
    },
    {
      title: 'PLAZA',
      category: 'Promotional Content',
      description: 'Engaging promotional video for PLAZA, designed to boost brand visibility and drive customer engagement.',
      image: `${import.meta.env.BASE_URL}images/plaza.avif`,
      tags: ['Promotion', 'Social Media', 'Marketing'],
      year: '2023',
    },
  ];

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

  const ProjectCard = ({ project }: { project: Project }) => (
    <motion.div
      variants={itemVariants}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg"
    >
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
        <h3 className="text-3xl lg:text-4xl font-bold text-white tracking-wide">
          {project.title}
        </h3>
      </div>
    </motion.div>
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
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-24 h-24 border border-secondary/10 rounded-full"
              style={{
                left: `${10 + i * 25}%`,
                top: `${20 + (i % 2) * 50}%`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1],
                rotate: [0, 90, 180],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center space-y-8"
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
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
            <motion.p 
              className="text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed border-l-4 border-secondary/30 pl-6"
              variants={itemVariants}
            >
              We've had the privilege of working with a diverse range of clients to create content that captivates, inspires, and drives results.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
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
              A glimpse into the stories we've helped shape. Each project is a partnership forged in creativity and driven by results.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            initial="hidden"
            animate={areProjectsInView ? 'visible' : 'hidden'}
            variants={containerVariants}
          >
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </motion.div>

          {/* Coming Soon Text */}
          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-2xl md:text-3xl font-semibold tracking-wider uppercase gradient-text">
              More Fun Stuff Coming Soon!
            </h3>
          </motion.div>
        </div>
      </section>

      <PreFooterCTA />
      <Footer />
    </div>
  );
};

export default Projects;
