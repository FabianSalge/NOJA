import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PreFooterCTA = () => {
  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto pt-40 pb-16 px-4 sm:px-6 lg:px-8 text-center">
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
            className="group inline-flex items-center gap-3 bg-secondary text-secondary-foreground font-semibold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span>Let's work together</span>
            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default PreFooterCTA; 