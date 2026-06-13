import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { containerVariants, itemVariants } from '@/lib/animations';
import { useRef } from 'react';
import { useTranslation } from '@/i18n';

type TeamMember = { name: string; role: string; image: string; video?: string };

type TeamProps = {
  members: TeamMember[];
  title?: string;
};

const TeamCard = ({ member, isMobile = false }: { member: TeamMember; isMobile?: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    if (videoRef.current && member.video) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  if (isMobile) {
    return (
      <motion.div
        className="relative overflow-hidden"
        variants={itemVariants}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <img
          src={member.image}
          alt={member.name}
          className="w-full aspect-[3/2] object-cover object-[center_30%]"
        />
        <div className="absolute inset-x-0 bottom-0 top-1/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-5">
          <h3 className="text-xl font-bold text-white leading-tight">{member.name}</h3>
          <p className="text-sm text-white/80 mt-1">{member.role}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="relative group overflow-hidden rounded-xl shadow-md"
      variants={itemVariants}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-auto object-cover object-top aspect-[3/4]"
      />
      {member.video && (
        <video
          ref={videoRef}
          src={member.video}
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
        />
      )}
      <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
        <p className="text-xs opacity-90">{member.role}</p>
        <h3 className="text-base font-semibold leading-tight">{member.name}</h3>
      </div>
    </motion.div>
  );
};

const Team = ({ members, title }: TeamProps) => {
  const { t } = useTranslation();
  const teamRef = useRef(null);
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({ target: teamRef, offset: ["start center", "end start"] });
  const y = useTransform(scrollYProgress, [0.3, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0.5, 0.95], [1, 0.1]);

  return (
    <section className="py-16 sm:py-20 2xl:py-28 relative overflow-hidden bg-[hsl(var(--primary))]" ref={teamRef}>
      <motion.div className="absolute inset-0" style={{ y, opacity }}>
        <div className="absolute inset-0 bg-[hsl(var(--primary))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--primary))] via-[hsl(var(--primary))]/90 to-transparent" />
      </motion.div>
      <div className="max-w-6xl 2xl:max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <motion.div
          className="text-center mb-12 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={teamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black text-background text-center leading-[0.9]">
              {title || t.about.team.title}
            </h2>
          </motion.div>
        </motion.div>

        {/* Desktop: 3-column grid */}
        <motion.div
          className="hidden md:grid grid-cols-3 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={teamInView ? 'visible' : 'hidden'}
        >
          {members.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </motion.div>

        {/* Mobile: full-width stacked */}
        <motion.div
          className="md:hidden -mx-4 sm:-mx-6"
          variants={containerVariants}
          initial="hidden"
          animate={teamInView ? 'visible' : 'hidden'}
        >
          {members.map((member) => (
            <TeamCard key={`mobile-${member.name}`} member={member} isMobile />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
