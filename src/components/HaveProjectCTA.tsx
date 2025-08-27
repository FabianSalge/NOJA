import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

type HaveProjectCTAProps = {
  className?: string;
  variant?: 'dark' | 'beige';
};

const HaveProjectCTA = ({ className = 'py-20', variant = 'dark' }: HaveProjectCTAProps) => {
  const backgroundClass = variant === 'dark' ? 'bg-background relative' : 'bg-[hsl(var(--primary))]';

  return (
    <section className={`${backgroundClass} ${className} relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {variant === 'dark' && (
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))]/0 via-[hsl(var(--primary))]/0 to-[hsl(var(--primary))]/0" />
          </div>
        )}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-foreground mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Have a project in mind?
        </motion.h2>
        <motion.p
          className="text-xl text-foreground/80 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          From concept to delivery, we combine strategy, project management, and production to create content that stands out and performs.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 bg-secondary text-secondary-foreground font-semibold text-lg md:text-xl px-8 py-4 rounded-full hover:shadow-lg hover:shadow-secondary/20 transition-all"
          >
            <span>We like Bold Breifs</span>
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HaveProjectCTA;


