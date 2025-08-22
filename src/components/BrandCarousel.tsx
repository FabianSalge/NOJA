import { BRAND_LOGOS, withBase } from '@/lib/assets';

type BrandCarouselProps = {
  className?: string;
};

const BrandCarousel = ({ className = '' }: BrandCarouselProps) => {
  return (
    <div className={`overflow-hidden w-screen relative left-1/2 -translate-x-1/2 ${className}`}>
      <div className="relative h-16 md:h-20">
        <div className="absolute top-0 left-0 flex gap-14 opacity-80 marquee-ltr" style={{ width: '200%' }}>
          <div className="flex gap-14 w-1/2 justify-around">
            {BRAND_LOGOS.map((logo) => (
              <img key={logo} src={withBase(logo)} alt="brand logo" className="h-12 md:h-16 w-auto object-contain" />
            ))}
          </div>
          <div className="flex gap-14 w-1/2 justify-around">
            {BRAND_LOGOS.map((logo) => (
              <img key={`dup-${logo}`} src={withBase(logo)} alt="brand logo" className="h-12 md:h-16 w-auto object-contain" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCarousel;


