import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useRef } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { richTextOptions } from '@/lib/richtext';
import { useTranslation } from '@/i18n';

type StoryProps = {
  text?: import('@contentful/rich-text-types').Document;
  fallbackText?: string;
  imageUrl?: string;
};

const Story = ({ text, fallbackText, imageUrl }: StoryProps) => {
  const { t } = useTranslation();
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ["start center", "end start"] });
  const y = useTransform(scrollYProgress, [0.3, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0.5, 0.95], [1, 0.1]);

  return (
    <section className="min-h-[100svh] md:min-h-screen relative overflow-hidden bg-[hsl(var(--primary))] isolate" ref={storyRef}>
      {/* Parallax background layer */}
      <motion.div className="absolute inset-x-0 top-[-160px] bottom-[-160px] md:top-0 md:bottom-0 transform-gpu will-change-transform" style={{ y, opacity }}>
        <div className="absolute inset-0 bg-[hsl(var(--primary))]" />
      </motion.div>

      <div className="relative z-10 flex flex-col md:flex-row min-h-[100svh] md:min-h-screen">
        {/* Left half — text */}
        <motion.div
          className="flex-1 flex items-center px-6 sm:px-10 lg:px-16 xl:px-20 py-24 md:py-0"
          variants={containerVariants}
          initial="hidden"
          animate={storyInView ? 'visible' : 'hidden'}
        >
          <motion.div className="space-y-6 max-w-xl" variants={itemVariants} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <div className="space-y-4">
              <span className="block text-xs sm:text-sm md:text-base font-semibold tracking-[0.35em] uppercase text-background/60">{t.about.title}</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-background tracking-tight leading-[0.95]">{t.about.subtitle}</h2>
            </div>
            <div className="space-y-4 text-lg text-background/80 leading-relaxed">
              {text ? documentToReactComponents(text, richTextOptions) : <p>{fallbackText}</p>}
            </div>
          </motion.div>
        </motion.div>

        {/* Right half — image edge-to-edge */}
        <motion.div
          className="flex-1 relative min-h-[50vh] md:min-h-0"
          variants={itemVariants}
          initial="hidden"
          animate={storyInView ? 'visible' : 'hidden'}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Team collaboration"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default Story;


