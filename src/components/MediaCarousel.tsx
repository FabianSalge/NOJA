import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import MediaPreview from "@/components/MediaPreview";
import { useTranslation } from "@/i18n";

export type CarouselItem = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  videoUrl?: string;
  href?: string;
};

type MediaCarouselProps = {
  items: CarouselItem[];
  label: string;
  showCaptions?: boolean;
};

export default function MediaCarousel({
  items,
  label,
  showCaptions = true,
}: MediaCarouselProps) {
  const { t } = useTranslation();
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ x: 0, scroll: 0, down: false, moved: false });
  const reducedMotion = useReducedMotion();
  const initialIndex = items.length >= 3 ? 1 : 0;
  const [selection, setSelection] = useState(initialIndex);
  const activeIndex = Math.min(selection, Math.max(0, items.length - 1));
  const shouldPlay = !reducedMotion;
  const active = items[activeIndex];

  const goTo = (index: number) => {
    const rail = railRef.current;
    const slide = rail?.children[index] as HTMLElement | undefined;
    if (!rail || !slide) return;
    rail.scrollTo({
      left: slide.offsetLeft - (rail.clientWidth - slide.offsetWidth) / 2,
      behavior: reducedMotion ? "instant" : "smooth",
    });
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const first = rail.children[initialIndex] as HTMLElement | undefined;
    if (first)
      rail.scrollLeft =
        first.offsetLeft - (rail.clientWidth - first.offsetWidth) / 2;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const middle = rail.scrollLeft + rail.clientWidth / 2;
        let closest = 0;
        let distance = Infinity;
        Array.from(rail.children).forEach((child, index) => {
          const slide = child as HTMLElement;
          const delta = Math.abs(
            slide.offsetLeft + slide.offsetWidth / 2 - middle,
          );
          if (delta < distance) {
            closest = index;
            distance = delta;
          }
        });
        setSelection(closest);
      });
    };
    rail.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(rail);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      rail.removeEventListener("scroll", measure);
    };
  }, [initialIndex]);

  if (!items.length)
    return <p className="px-6 py-16 text-center">{t.projects.empty}</p>;

  return (
    <section
      className="media-carousel"
      aria-label={label}
      aria-roledescription={t.carousel.carousel}
    >
      <div
        ref={railRef}
        className="media-carousel-rail"
        tabIndex={0}
        aria-label={t.carousel.instructions}
        onKeyDown={(event) => {
          let next: number | undefined;
          if (event.key === "ArrowLeft") next = Math.max(0, activeIndex - 1);
          if (event.key === "ArrowRight")
            next = Math.min(items.length - 1, activeIndex + 1);
          if (event.key === "Home") next = 0;
          if (event.key === "End") next = items.length - 1;
          if (next !== undefined) {
            event.preventDefault();
            goTo(next);
          }
        }}
        onPointerDown={(event) => {
          drag.current.moved = false;
          if (event.pointerType !== "mouse" || event.button !== 0) return;
          drag.current = {
            x: event.clientX,
            scroll: event.currentTarget.scrollLeft,
            down: true,
            moved: false,
          };
        }}
        onPointerMove={(event) => {
          if (!drag.current.down) return;
          const dx = event.clientX - drag.current.x;
          if (Math.abs(dx) > 6) {
            drag.current.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.style.scrollSnapType = "none";
            event.currentTarget.scrollLeft = drag.current.scroll - dx;
          }
        }}
        onPointerUp={(event) => {
          drag.current.down = false;
          event.currentTarget.style.scrollSnapType = "";
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          drag.current.down = false;
          if (railRef.current) railRef.current.style.scrollSnapType = "";
        }}
        onClickCapture={(event) => {
          if (drag.current.moved) {
            drag.current.moved = false;
            if (event.detail > 0) {
              event.preventDefault();
              event.stopPropagation();
            }
          }
        }}
        onDragStart={(event) => event.preventDefault()}
      >
        {items.map((item, index) => {
          const offset = Math.max(-2, Math.min(2, index - activeIndex));
          const content = (
            <>
              <MediaPreview
                key={`${item.id}-${item.videoUrl}`}
                imageUrl={item.imageUrl}
                videoUrl={item.videoUrl}
                alt={item.title}
                enabled={index === activeIndex && shouldPlay}
                sizes="(min-width: 1536px) 360px, (min-width: 768px) 300px, 72vw"
              />
              {showCaptions && (
                <div className="media-carousel-caption">
                  {item.subtitle && (
                    <p className="mb-2 text-xs sm:text-sm text-white/85">
                      {item.subtitle}
                    </p>
                  )}
                  <h2 className="text-xl md:text-2xl font-bold leading-tight">
                    {item.title}
                  </h2>
                  {item.href && (
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-wide">
                      {t.projects.viewProject} <ArrowRight size={14} />
                    </span>
                  )}
                </div>
              )}
            </>
          );
          return (
            <div
              key={item.id}
              className="media-carousel-slide"
              role="group"
              aria-roledescription={t.carousel.slide}
              aria-label={`${index + 1} / ${items.length}`}
              style={
                {
                  "--card-angle": `${offset * -9}deg`,
                  "--card-lift": `${Math.abs(offset) * 16}px`,
                } as CSSProperties
              }
            >
              {item.href ? (
                <Link
                  to={item.href}
                  className="media-carousel-card"
                  draggable={false}
                >
                  {content}
                </Link>
              ) : (
                <div className="media-carousel-card">{content}</div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-5 px-6 pt-5">
        {items.length > 1 && (
          <button
            type="button"
            className="carousel-control"
            aria-label={t.carousel.previous}
            disabled={activeIndex === 0}
            onClick={() => goTo(activeIndex - 1)}
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div
          className="flex max-w-[55vw] flex-wrap justify-center gap-1.5"
          aria-label={t.carousel.selectSlide}
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="flex h-8 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label={`${t.carousel.slide} ${index + 1}: ${item.title}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => goTo(index)}
            >
              <span
                className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-5 bg-background" : "w-1.5 bg-background/30"}`}
              />
            </button>
          ))}
        </div>
        {items.length > 1 && (
          <button
            type="button"
            className="carousel-control"
            aria-label={t.carousel.next}
            disabled={activeIndex === items.length - 1}
            onClick={() => goTo(activeIndex + 1)}
          >
            <ArrowRight size={18} />
          </button>
        )}
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {active?.title}, {activeIndex + 1} / {items.length}
      </p>
    </section>
  );
}
