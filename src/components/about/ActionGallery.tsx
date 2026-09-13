import { useRef } from "react";
import { useInView } from "framer-motion";
import ResponsiveImage from "@/components/ResponsiveImage";

export default function ActionGallery({ images }: { images: string[] }) {
  const root = useRef<HTMLElement>(null);
  const near = useInView(root, { margin: "300px", once: true });
  return (
    <section ref={root} className="py-16 md:py-20 2xl:py-28 overflow-hidden">
      <div className="flex w-max marquee-content">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex"
            aria-hidden={copy === 1 ? true : undefined}
          >
            {images.map((src, index) => (
              <div key={`${index}-${src}`} className="shrink-0 px-2">
                <div className="overflow-hidden rounded-2xl w-40 sm:w-56 aspect-[9/16] bg-background/5">
                  {near && (
                    <ResponsiveImage
                      src={src}
                      alt={copy ? "" : `NOJA — ${index + 1}`}
                      widths={[240, 480, 640]}
                      sizes="(min-width: 640px) 224px, 160px"
                      className="w-full h-full object-cover object-center"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
