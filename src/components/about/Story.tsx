import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useRef } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

type StoryProps = {
  text?: import('@contentful/rich-text-types').Document;
  imageUrl?: string;
};

const Story = ({ text, imageUrl }: StoryProps) => {
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: storyRef, offset: ["start center", "end start"] });
  const y = useTransform(scrollYProgress, [0.3, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0.5, 0.95], [1, 0.1]);

  return (
    <section className="min-h-[100svh] md:min-h-screen flex items-center relative overflow-hidden bg-background isolate pb-8 md:pb-0" ref={storyRef}>
      <motion.div className="absolute inset-x-0 top-[-160px] bottom-[-160px] md:top-0 md:bottom-0 transform-gpu will-change-transform" style={{ y, opacity }}>
        <div className="absolute inset-0 bg-[hsl(var(--primary))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(var(--primary))]/90 to-[hsl(var(--primary))] md:to-transparent" />
      </motion.div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center" variants={containerVariants} initial="hidden" animate={storyInView ? 'visible' : 'hidden'}>
          <motion.div className="space-y-6" variants={itemVariants} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <div className="space-y-4">
              <span className="block text-xs sm:text-sm md:text-base font-semibold tracking-[0.35em] uppercase text-background/60">About NOJA</span>
              <motion.h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-background tracking-tight leading-[0.95]" whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>Why Us</motion.h2>
            </div>
            <div className="space-y-4 text-lg text-background/80 leading-relaxed">
              {text ? documentToReactComponents(text) : null}
            </div>
          </motion.div>
          <motion.div className="relative" variants={itemVariants} transition={{ duration: 0.6, ease: 'easeOut' }}>
            <motion.div className="bg-gradient-to-br from-[hsl(var(--primary))]/60 to-[hsl(var(--primary))]/80 rounded-3xl overflow-hidden border border-background/10 shadow-2xl max-w-xs sm:max-w-md mx-auto" style={{ aspectRatio: '1 / 1' }} whileHover={{ y: -8 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
              {imageUrl ? (<img src={imageUrl} alt="Team collaboration" className="block w-full h-full object-cover" />) : null}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Story;


