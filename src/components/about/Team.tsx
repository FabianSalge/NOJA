import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useRef } from 'react';

type TeamMember = { name: string; role: string; image: string };

type TeamProps = {
  members: TeamMember[];
};

const Team = ({ members }: TeamProps) => {
  const teamRef = useRef(null);
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: teamRef, offset: ["start center", "end start"] });
  const y = useTransform(scrollYProgress, [0.3, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0.5, 0.95], [1, 0.1]);

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden bg-[hsl(var(--primary))]" ref={teamRef}>
      <motion.div className="absolute inset-0" style={{ y, opacity }}>
        <div className="absolute inset-0 bg-[hsl(var(--primary))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(var(--primary))]/90 to-transparent" />
      </motion.div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div className="text-center mb-12 space-y-4" initial={{ opacity: 0, y: 30 }} animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-background text-center leading-[0.9]">We are NOJA</h2>
          </motion.div>
        </motion.div>
        <motion.div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6" variants={containerVariants} initial="hidden" animate={teamInView ? 'visible' : 'hidden'}>
          {members.map((member) => (
            <motion.div key={member.name} className="relative group overflow-hidden rounded-xl shadow-md" variants={itemVariants} transition={{ duration: 0.5, ease: 'easeOut' }}>
              <img src={member.image} alt={member.name} className="w-full h-auto object-cover object-top transition-transform duration-500 group-hover:scale-105 aspect-[3/4]" />
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white">
                <p className="text-[10px] sm:text-xs opacity-90">{member.role}</p>
                <h3 className="text-sm sm:text-base font-semibold leading-tight">{member.name}</h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Team;


