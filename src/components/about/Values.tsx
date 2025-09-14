import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useRef } from 'react';
import type { LucideIcon } from 'lucide-react';

type ValueItem = { icon: LucideIcon; title: string; description: string };

type ValuesProps = {
  items: ValueItem[];
};

const Values = ({ items }: ValuesProps) => {
  const valuesRef = useRef(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: valuesRef, offset: ["start center", "end start"] });
  const y = useTransform(scrollYProgress, [0.3, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0.5, 0.95], [1, 0.1]);

  return (
    <section className="pt-20 sm:pt-24 pb-24 sm:pb-40 relative overflow-hidden bg-[hsl(var(--primary))]" ref={valuesRef}>
      <motion.div className="absolute inset-0" style={{ y, opacity }}>
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-transparent" />
      </motion.div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div className="text-center mb-8 sm:mb-12 space-y-4" initial={{ opacity: 0, y: 30 }} animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.8 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground text-center leading-[0.9]">Our Values</h2>
          </motion.div>
        </motion.div>
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6" variants={containerVariants} initial="hidden" animate={valuesInView ? 'visible' : 'hidden'}>
          {items.map((value, index) => (
            <motion.div key={index} className="group" variants={itemVariants} transition={{ duration: 0.6, ease: 'easeOut' }}>
              <motion.div className="bg-foreground/5 backdrop-blur-sm rounded-2xl p-6 h-full border border-foreground/10 hover:border-foreground/20 transition-all duration-300 text-center" whileHover={{ y: -4 }}>
                <motion.div className="w-12 h-12 bg-foreground text-[hsl(var(--primary))] rounded-xl flex items-center justify-center mx-auto mb-4" whileHover={{ rotate: 15 }} transition={{ duration: 0.3 }}>
                  <value.icon size={24} />
                </motion.div>
                <h3 className="text-lg font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Values;


