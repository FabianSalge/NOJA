import { buildContentfulSrcSet } from '@/lib/images';

type ResponsiveImageProps = {
  src?: string;
  alt: string;
  className?: string;
  widths?: number[];
  sizes?: string;
  eager?: boolean;
  decoding?: 'sync' | 'async' | 'auto';
  style?: React.CSSProperties;
};

const ResponsiveImage = ({
  src,
  alt,
  className,
  widths = [480, 768, 1024, 1366, 1600],
  sizes = '100vw',
  eager = false,
  decoding = 'async',
  style,
}: ResponsiveImageProps) => {
  if (!src) return null;

  return (
    <img
      src={src}
      srcSet={buildContentfulSrcSet(src, widths)}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={eager ? 'eager' : 'lazy'}
      decoding={decoding}
      style={style}
    />
  );
};

export default ResponsiveImage;


