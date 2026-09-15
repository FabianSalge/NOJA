import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/i18n";

type HaveProjectCTAProps = {
  className?: string;
  variant?: "dark" | "beige";
  fadeFromLight?: boolean;
};

const HaveProjectCTA = ({
  className,
  variant = "dark",
  fadeFromLight = false,
}: HaveProjectCTAProps) => {
  const { t } = useTranslation();
  const backgroundClass =
    variant === "dark" ? "bg-background relative" : "bg-[hsl(var(--primary))]";

  const spacing =
    className ??
    (fadeFromLight ? "pt-10 md:pt-12 pb-20" : "py-16 md:py-20 2xl:py-28");
  return (
    <>
      {fadeFromLight && <div className="surface-to-dark" aria-hidden="true" />}
      <section
        className={`${backgroundClass} ${spacing} relative overflow-hidden`}
      >
        <div className="max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {t.cta.haveProject}
          </motion.h2>
          {/* Subtext removed per request */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 bg-secondary text-secondary-foreground font-semibold text-lg px-8 py-4 rounded-full hover:shadow-lg hover:shadow-secondary/20 transition-all"
            >
              <span>{t.cta.boldBriefs}</span>
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HaveProjectCTA;
