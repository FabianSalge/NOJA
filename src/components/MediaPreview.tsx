import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import ResponsiveImage from '@/components/ResponsiveImage';
import { optimizedImageUrl } from '@/lib/images';

type MediaPreviewProps = {
  imageUrl?: string;
  videoUrl?: string;
  alt: string;
  enabled: boolean;
  eager?: boolean;
  sizes?: string;
};

/** Keep the poster visible until playback succeeds; never autoplay offscreen. */
export default function MediaPreview({
  imageUrl,
  videoUrl,
  alt,
  enabled,
  eager,
  sizes,
}: MediaPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(containerRef, { amount: 0.35 });
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;
    let cancelled = false;
    const syncPlayback = () => {
      if (enabled && inView && !document.hidden) {
        video
          .play()
          .then(() => {
            if (cancelled || document.hidden) video.pause();
          })
          .catch(() => {
            /* Browser restrictions leave the poster visible. */
          });
      } else {
        video.pause();
      }
    };
    syncPlayback();
    document.addEventListener('visibilitychange', syncPlayback);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', syncPlayback);
      video.pause();
    };
  }, [enabled, inView, failed]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-background/10"
    >
      <ResponsiveImage
        src={imageUrl}
        alt={alt}
        sizes={sizes}
        eager={eager}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {videoUrl && !failed && (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={optimizedImageUrl(imageUrl, 768)}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${playing && enabled ? 'opacity-100' : 'opacity-0'}`}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
