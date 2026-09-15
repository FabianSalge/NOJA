import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/** Decorative video: defer bytes, pause offscreen, and respect reduced motion. */
export default function LoopingVideo({
  src,
  poster,
  children,
  mediaClassName = "",
}: {
  src: string;
  poster?: string;
  children?: ReactNode;
  mediaClassName?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const near = useInView(root, { margin: "200px", once: true });
  const visible = useInView(root, { amount: 0.25 });
  const reducedMotion = useReducedMotion();
  const [failed, setFailed] = useState(false);
  const enabled = !reducedMotion;

  useEffect(() => {
    const element = video.current;
    if (!element || failed) return;
    let cancelled = false;
    const sync = () => {
      if (near && visible && enabled && !document.hidden) {
        element
          .play()
          .then(() => {
            if (cancelled || document.hidden) element.pause();
          })
          .catch(() => {});
      } else element.pause();
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelled = true;
      element.pause();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [near, visible, enabled, failed]);

  return (
    <div ref={root} className="relative h-full w-full bg-background">
      <video
        ref={video}
        src={near && !failed ? src : undefined}
        poster={poster}
        className={`absolute inset-0 h-full w-full object-cover ${mediaClassName}`}
        muted
        loop
        playsInline
        preload={poster ? "none" : "metadata"}
        aria-hidden="true"
        onError={() => setFailed(true)}
      />
      {children}
    </div>
  );
}
