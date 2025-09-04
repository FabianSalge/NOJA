import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import SEOJsonLd from '@/components/SEOJsonLd';
import { buildCanonical } from '@/lib/seo';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { HOME_IMAGES } from '@/lib/assets';
import { fetchProjectBySlug, type CmsProjectDetail, splitDocumentByParagraphs } from '@/lib/cms';
import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, type TopLevelBlock } from '@contentful/rich-text-types';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState<CmsProjectDetail | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!slug) return;
    fetchProjectBySlug(slug)
      .then(setProject)
      .catch(() => {
        console.warn('Failed to fetch project detail from Contentful.');
      })
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="pt-36 pb-24 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Loading…</h1>
        </div>
        <Footer />
      </div>
    );
  }

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
      <Helmet>
        <title>{project.title} — NOJA</title>
        <meta name="description" content={project.subtitle} />
        <link rel="canonical" href={buildCanonical(`/projects/${project.slug}`)} />
        <meta property="og:title" content={`${project.title} — NOJA`} />
        <meta property="og:description" content={project.subtitle} />
        {project.coverImageUrl && <meta property="og:image" content={project.coverImageUrl} />}
      </Helmet>
      <SEOJsonLd
        json={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          datePublished: project.dateISO,
          image: project.coverImageUrl,
          headline: project.title,
          description: project.subtitle
        }}
      />
      <Navigation />

      {/* Header Image with title overlay */}
      <section className="pt-20 md:pt-20 relative overflow-hidden bg-[hsl(var(--primary))]">
        <div className="relative h-[48vh] md:h-[60vh]">
          {project.coverImageUrl && (
            <img
              src={project.coverImageUrl}
              srcSet={(() => {
                const u = project.coverImageUrl;
                const w = [640, 1024, 1366, 1600, 1920];
                return w.map((x) => `${u}${u.includes('?') ? '&' : '?'}w=${x} ${x}w`).join(', ');
              })()}
              sizes="100vw"
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
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
            {/* Left image column - Smart aspect ratio handling */}
            <div className="relative">
              {project.secondImageUrl && (
                <div className="relative overflow-hidden">
                  <img 
                    src={project.secondImageUrl}
                    srcSet={(() => {
                      const u = project.secondImageUrl!;
                      const w = [640, 1024, 1366, 1600];
                      return w.map((x) => `${u}${u.includes('?') ? '&' : '?'}w=${x} ${x}w`).join(', ');
                    })()}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    alt="Project visual" 
                    className="block w-full h-auto min-h-[360px] md:min-h-[480px] max-h-[600px] object-cover"
                    style={{
                      aspectRatio: 'auto',
                      objectFit: 'cover',
                      objectPosition: 'center'
                    }}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
            </div>
            {/* Right text column */}
            <div className="px-6 md:px-10 lg:px-16 py-10 md:py-12 flex items-center">
              <div className="space-y-6 w-full">
                <h2 className="text-3xl md:text-4xl font-black">{project.firstTextTitle}</h2>
                <div className="text-lg text-foreground/80 leading-relaxed">
                  {project.firstTextBody ? documentToReactComponents(project.firstTextBody, {
                    renderNode: {
                      [BLOCKS.PARAGRAPH]: (_node, children) => (
                        <p className="mb-4">{children}</p>
                      ),
                    },
                  }) : null}
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* Quote with Image in the Back */}
      {(project.quote || project.quoteImageUrl) && (
        <section className="relative overflow-hidden">
          <div className="relative h-[36vh] md:h-[44vh]">
            {project.quoteImageUrl ? (
              <img
                src={project.quoteImageUrl}
                srcSet={(() => {
                  const u = project.quoteImageUrl!;
                  const w = [640, 1024, 1366, 1600];
                  return w.map((x) => `${u}${u.includes('?') ? '&' : '?'}w=${x} ${x}w`).join(', ');
                })()}
                sizes="100vw"
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
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
          {project.secondTextBody ? (() => {
            // Get the raw text content from the document
            const getTextFromDocument = (doc: import('@contentful/rich-text-types').Document): string => {
              return doc.content.map((node: TopLevelBlock) => {
                if (node.nodeType === BLOCKS.PARAGRAPH && 'content' in node) {
                  // @ts-expect-error content is present on paragraph nodes
                  return node.content.map((textNode: { value?: string }) => textNode.value || '').join('');
                }
                return '';
              }).join(' ');
            };

            const fullText = getTextFromDocument(project.secondTextBody);
            
            if (fullText.length < 200) {
              // Short content - single column
              return (
                <div className="text-lg leading-relaxed text-foreground/85">
                  {documentToReactComponents(project.secondTextBody, {
                    renderNode: {
                      [BLOCKS.PARAGRAPH]: (_node, children) => (
                        <p className="mb-4">{children}</p>
                      ),
                    },
                  })}
                </div>
              );
            }

            // Split long text into sentences for better column balance
            const sentences = fullText.split(/(?<=[.!?])\s+/).filter((s: string) => s.trim().length > 0);
            const midPoint = Math.ceil(sentences.length / 2);
            const leftText = sentences.slice(0, midPoint).join(' ');
            const rightText = sentences.slice(midPoint).join(' ');

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-lg leading-relaxed text-foreground/85">
                <div>
                  <p className="mb-4">{leftText}</p>
                </div>
                <div>
                  <p className="mb-4">{rightText}</p>
                </div>
              </div>
            );
          })() : (
            <div className="text-lg leading-relaxed text-foreground/85">
              <p>No content available</p>
            </div>
          )}
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


