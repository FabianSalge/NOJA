import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { HOME_IMAGES } from '@/lib/assets';
import { fetchProjectBySlug, type CmsProjectDetail, splitDocumentByParagraphs } from '@/lib/cms';
import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<CmsProjectDetail | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    fetchProjectBySlug(slug).then(setProject).catch(() => {
      console.warn('Failed to fetch project detail from Contentful.');
    });
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="pt-36 pb-24 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Project not found</h1>
          <p className="text-foreground/80 mb-8">The project you're looking for doesn't exist or has been moved.</p>
          <Link to="/projects" className="underline">Back to Projects</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      {/* Header Image with title overlay */}
      <section className="pt-20 md:pt-20 relative overflow-hidden bg-[hsl(var(--primary))]">
        <div className="relative h-[48vh] md:h-[60vh]">
          {project.coverImageUrl && (
            <img src={project.coverImageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute left-6 md:left-10 bottom-8 md:bottom-10">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {project.title}
            </motion.h1>
            <p className="text-white/85 mt-2">{project.subtitle} · {new Date(project.dateISO).getFullYear()}</p>
          </div>
        </div>
      </section>

      {/* Image | Text */}
      <section className="pt-0 pb-0 bg-background -mt-px">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
            {/* Left image column (no card) */}
            <div className="min-h-[360px] md:min-h-[520px]">
              {project.secondImageUrl && (
                <img src={project.secondImageUrl} alt="Project visual" className="block w-full h-full object-cover" />
              )}
            </div>
            {/* Right text column */}
            <div className="px-6 md:px-10 lg:px-16 py-10 md:py-12">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-black">{project.firstTextTitle}</h2>
                {project.firstTextBody ? (() => {
                  const [leftDoc, rightDoc] = splitDocumentByParagraphs(project.firstTextBody);
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg text-foreground/80">
                      <div>
                        {documentToReactComponents(leftDoc, {
                          renderNode: {
                            [BLOCKS.PARAGRAPH]: (_node, children) => (
                              <p className="mb-4">{children}</p>
                            ),
                          },
                        })}
                      </div>
                      <div>
                        {documentToReactComponents(rightDoc, {
                          renderNode: {
                            [BLOCKS.PARAGRAPH]: (_node, children) => (
                              <p className="mb-4">{children}</p>
                            ),
                          },
                        })}
                      </div>
                    </div>
                  );
                })() : null}
              </div>
            </div>
          </div>
      </section>

      {/* Quote with Image in the Back */}
      {(project.quote || project.quoteImageUrl) && (
        <section className="relative overflow-hidden">
          <div className="relative h-[36vh] md:h-[44vh]">
            {project.quoteImageUrl ? (
              <img src={project.quoteImageUrl} alt="Background" className="absolute inset-0 w-full h-full object-cover" />
            ) : null}
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 flex items-center justify-center px-6">
              <blockquote className="text-3xl md:text-5xl font-semibold text-white text-center tracking-wide">
                {project.quote}
              </blockquote>
            </div>
          </div>
        </section>
      )}

      {/* Project Text */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-black">{project.secondTextTitle}</h3>
          <div className="h-[2px] w-24 bg-foreground/40 mt-4 mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-lg leading-relaxed text-foreground/85">
            <div>
              {project.secondTextBody ? documentToReactComponents(project.secondTextBody) : null}
            </div>
            <div>
              {/* Optional space for additional copy or future content */}
            </div>
          </div>
        </div>
      </section>

      {/* Image-based CTA */}
      <section className="relative overflow-hidden">
        <div className="relative h-[36vh] md:h-[46vh]">
          <img src={HOME_IMAGES.postProduction} alt="CTA background" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h4 className="text-3xl md:text-5xl font-semibold text-white mb-6">Like what you see?</h4>
            <Link to="/contact" className="px-6 py-3 rounded-full bg-white/90 text-black font-semibold hover:bg-white transition">Let's work together</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ProjectDetail;


