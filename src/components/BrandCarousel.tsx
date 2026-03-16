import { BRAND_LOGOS, withBase } from '@/lib/assets';

type CmsBrandMinimal = {
	name: string;
	logoUrl?: string;
};

type BrandCarouselProps = {
	className?: string;
	brands?: CmsBrandMinimal[];
};

const BrandCarousel = ({ className = '', brands }: BrandCarouselProps) => {
	const cmsLogos: string[] | undefined = brands
		?.map((b) => b.logoUrl)
		.filter((u): u is string => Boolean(u) && typeof u === 'string');

	const useCms = cmsLogos && cmsLogos.length > 0;
	const items: string[] = useCms
		? cmsLogos
		: BRAND_LOGOS.map((logo) => withBase(logo));

	const logoItem = (src: string, idx: number, keyPrefix = '') => (
		<img
			key={`${keyPrefix}${idx}`}
			src={src}
			alt={useCms ? (brands?.[idx]?.name || 'brand') : 'brand logo'}
			className="h-10 sm:h-12 md:h-16 max-w-[100px] sm:max-w-[120px] md:max-w-[160px] w-auto object-contain shrink-0"
			loading="lazy"
			decoding="async"
		/>
	);

	return (
		<div className={`overflow-hidden w-screen relative left-1/2 -translate-x-1/2 ${className}`}>
			<div className="relative h-16 md:h-20">
				{/* Content-sized marquee: items determine width, animation shifts by exactly 50% (one full set) */}
				<div
					className="absolute top-0 left-0 flex items-center gap-12 sm:gap-16 md:gap-20 opacity-90 marquee-ltr will-change-transform"
					style={{ width: 'max-content' }}
				>
					{items.map((src, idx) => logoItem(src, idx))}
					{items.map((src, idx) => logoItem(src, idx, 'dup-'))}
				</div>
			</div>
		</div>
	);
};

export default BrandCarousel;
