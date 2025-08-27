import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

type ScrollTransitionProps = {
  kind: 'dark-to-beige' | 'beige-to-dark';
  heightClass?: string; // visual scroll range; we'll cancel layout with negative margins on the next section
};

const ScrollTransition = ({ kind, heightClass = 'h-16 md:h-20' }: ScrollTransitionProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 90%', 'end 10%'] });
  // Smooth bell curve visibility
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  const gradientClass =
    kind === 'dark-to-beige'
      ? 'bg-gradient-to-b from-background to-[hsl(var(--primary))]'
      : 'bg-gradient-to-b from-[hsl(var(--primary))] to-background';

  return (
    <div ref={ref} className={`relative ${heightClass}`} aria-hidden>
      {/* Fixed overlay fades in/out with scroll; no pointer events; behind content */}
      <motion.div
        className={`fixed inset-0 pointer-events-none ${gradientClass}`}
        style={{ opacity, zIndex: 0 }}
      />
    </div>
  );
};

export default ScrollTransition;


