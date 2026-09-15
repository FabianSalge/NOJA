import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowDown } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/animations";
import LoopingVideo from "@/components/LoopingVideo";
import { LOGOS } from "@/lib/assets";
import { useTranslation } from "@/i18n";

type HeroProps = {
  onScrollIndicatorClick?: () => void;
  title?: string;
};

const Hero = ({ onScrollIndicatorClick, title }: HeroProps) => {
  const { t, language } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  const yRange = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const opacityRange = useTransform(scrollYProgress, [0, 0.65, 1], [1, 1, 0]);

  const pulseAnimation = {
    opacity: [1, 0.9, 1],
    textShadow: [
      "0 0 12px hsl(var(--secondary) / 0.5), 0 0 24px hsl(var(--secondary) / 0.2)",
      "0 0 32px hsl(var(--secondary) / 0.9), 0 0 64px hsl(var(--secondary) / 0.5), 0 0 96px hsl(var(--secondary) / 0.25)",
      "0 0 12px hsl(var(--secondary) / 0.5), 0 0 24px hsl(var(--secondary) / 0.2)",
    ],
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: reducedMotion ? 0 : yRange,
          opacity: reducedMotion ? 1 : opacityRange,
        }}
      >
        <LoopingVideo
          src={`${import.meta.env.BASE_URL}videos/hero-optimized.mp4`}
          poster={`${import.meta.env.BASE_URL}videos/hero-poster.webp`}
        >
          {/* Dark overlay for better text readability */}
          <div className="pointer-events-none absolute inset-0 bg-black/40" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
        </LoopingVideo>
      </motion.div>

      <div
        className="max-w-6xl 2xl:max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10 pt-16"
        ref={heroRef}
      >
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate={heroInView ? "visible" : "hidden"}
        >
          <motion.div
            className="space-y-4"
            variants={itemVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-block relative"
              animate={reducedMotion ? undefined : { y: [-8, 8] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            >
              <motion.div
                className="absolute -inset-6 rounded-full bg-gradient-to-b from-white/20 to-transparent blur-xl"
                animate={
                  reducedMotion
                    ? undefined
                    : { opacity: [0.2, 0.35, 0.2], scale: [0.98, 1.02, 0.98] }
                }
                transition={{ duration: 3, repeat: Infinity }}
                aria-hidden
              />
              <motion.img
                src={LOGOS.nojaWordmark}
                alt="NOJA"
                className="w-56 sm:w-64 h-auto md:h-36 md:w-auto mx-auto drop-shadow-2xl brightness-0 invert"
                loading="eager"
                decoding="async"
                whileHover={{ scale: 1.08, y: -2, rotate: 0.4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </motion.div>

            <motion.div
              className="space-y-6"
              variants={itemVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h1
                className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-[0.25em] uppercase drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {title ? (
                  title
                ) : (
                  <>
                    {language === "de" ? "CONTENT MIT " : "CONTENT WITH A "}
                    <motion.span
                      className="text-secondary"
                      animate={reducedMotion ? undefined : pulseAnimation}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    >
                      {language === "de" ? "PULS" : "PULSE"}
                    </motion.span>
                  </>
                )}
              </motion.h1>
              <div className="pt-1">
                <Link
                  to="/projects"
                  className="group inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold text-lg md:text-xl drop-shadow-md"
                >
                  <span className="relative">
                    {t.home.hero.cta}
                    <span className="absolute left-0 -bottom-0.5 h-[2px] w-full bg-white/60 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  </span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
        <motion.button
          type="button"
          aria-label={t.media.scroll}
          className="inline-flex items-center p-3 rounded-full border border-white/50 text-white/90 backdrop-blur-xs transition-colors hover:bg-white/10"
          animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={onScrollIndicatorClick}
        >
          <ArrowDown className="w-4 h-4" />
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;
