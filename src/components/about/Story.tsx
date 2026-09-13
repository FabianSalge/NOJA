import { motion, useInView } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import { useRef } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { richTextOptions } from "@/lib/richtext";
import { useTranslation } from "@/i18n";

type StoryProps = {
  text?: import("@contentful/rich-text-types").Document;
  fallbackText?: string;
  imageUrl?: string;
  eyebrow?: string;
  heading?: string;
};

const Story = ({
  text,
  fallbackText,
  imageUrl,
  eyebrow,
  heading,
}: StoryProps) => {
  const { t } = useTranslation();
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });

  return (
    <section
      className="min-h-[100svh] md:min-h-screen relative overflow-hidden surface-fade isolate"
      ref={storyRef}
    >
      <div className="relative z-10 flex flex-col md:flex-row min-h-[100svh] md:min-h-screen">
        {/* Left half — text */}
        <motion.div
          className="flex-1 flex items-center px-6 sm:px-10 lg:px-16 xl:px-20 py-24 md:py-0"
          variants={containerVariants}
          initial="hidden"
          animate={storyInView ? "visible" : "hidden"}
        >
          <motion.div
            className="space-y-6 max-w-xl"
            variants={itemVariants}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="space-y-4">
              <span className="block text-xs sm:text-sm md:text-base font-semibold tracking-[0.35em] uppercase text-background/60">
                {eyebrow || t.about.title}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black text-background tracking-tight leading-[0.95]">
                {heading || t.about.subtitle}
              </h1>
            </div>
            <div className="space-y-4 text-lg text-background/80 leading-relaxed">
              {text ? (
                documentToReactComponents(text, richTextOptions)
              ) : (
                <p>{fallbackText}</p>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Right half — image edge-to-edge */}
        <motion.div
          className="flex-1 relative min-h-[50vh] md:min-h-0"
          variants={itemVariants}
          initial="hidden"
          animate={storyInView ? "visible" : "hidden"}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Team collaboration"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Story;
