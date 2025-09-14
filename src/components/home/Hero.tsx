import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { containerVariants, itemVariants } from '@/lib/animations';
import { LOGOS } from '@/lib/assets';

type HeroProps = {
  onScrollIndicatorClick?: () => void;
};

const Hero = ({ onScrollIndicatorClick }: HeroProps) => {
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const yRange = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacityRange = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative min-h-[calc(100vh-5rem)] md:min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y: yRange, opacity: opacityRange }}>
        <div className="absolute inset-0 bg-[hsl(var(--primary))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(var(--primary))]/90 to-transparent" />
      </motion.div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-secondary/30 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [-20, 20], opacity: [0.3, 0.8, 0.3], scale: [1, 1.2, 1] }}
            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10 pt-16" ref={heroRef}>
        <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate={heroInView ? 'visible' : 'hidden'}>
          <motion.div className="space-y-4" variants={itemVariants} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <motion.div className="inline-block relative" animate={{ y: [-8, 8] }} transition={{ duration: 4.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}>
              <motion.div className="absolute -inset-6 rounded-full bg-gradient-to-b from-[hsl(var(--primary))]/40 to-transparent blur-xl" animate={{ opacity: [0.2, 0.35, 0.2], scale: [0.98, 1.02, 0.98] }} transition={{ duration: 3, repeat: Infinity }} aria-hidden />
              <motion.img src={LOGOS.nojaWordmark} alt="NOJA" className="w-56 sm:w-64 h-auto md:h-36 md:w-auto mx-auto drop-shadow-2xl" loading="eager" decoding="async" whileHover={{ scale: 1.08, y: -2, rotate: 0.4 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} />
            </motion.div>

            <motion.div className="space-y-6" variants={itemVariants} transition={{ duration: 0.8, ease: 'easeOut' }}>
              <motion.h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-background tracking-[0.25em] uppercase" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
                CONTENT WITH A <motion.span className="text-secondary" animate={{ opacity: [1, 0.8, 1], textShadow: ['0 0 0 hsl(var(--secondary))', '0 0 12px hsl(var(--secondary) / 0.4)', '0 0 0 hsl(var(--secondary))'] }} transition={{ duration: 2.2, repeat: Infinity }}>PULSE</motion.span>
              </motion.h2>
              <div className="pt-1">
                <Link to="/projects" className="group inline-flex items-center gap-2 text-background hover:text-foreground font-semibold text-lg md:text-xl">
                  <span className="relative">
                    Tap into our work
                    <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-background/60 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  </span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <motion.button className="inline-flex items-center p-3 rounded-full border backdrop-blur-sm transition-colors" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'rgba(255,255,255,0.95)' }} animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} onClick={onScrollIndicatorClick}>
          <ArrowDown className="w-4 h-4" />
        </motion.button>
      </div>
    </section>
  );
}

export default Hero;


