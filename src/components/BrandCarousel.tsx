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
			className="h-14 sm:h-16 md:h-20 2xl:h-24 max-w-[140px] sm:max-w-[160px] md:max-w-[200px] 2xl:max-w-[240px] w-auto object-contain shrink-0"
			loading="lazy"
			decoding="async"
		/>
	);

	return (
		<div className={`overflow-hidden w-screen relative left-1/2 -translate-x-1/2 ${className}`}>
			<div className="relative h-20 sm:h-24 md:h-28 2xl:h-32">
				{/* Content-sized marquee: items determine width, animation shifts by exactly 50% (one full set) */}
				<div
					className="absolute top-0 left-0 flex items-center gap-12 sm:gap-16 md:gap-20 opacity-90 marquee-ltr will-change-transform"
					style={{ width: 'max-content' }}
				>
					{items.map((src, idx) => logoItem(src, idx))}
					{items.map((src, idx) => logoItem(src, idx, 'b-'))}
					{items.map((src, idx) => logoItem(src, idx, 'c-'))}
					{items.map((src, idx) => logoItem(src, idx, 'd-'))}
					{items.map((src, idx) => logoItem(src, idx, 'e-'))}
					{items.map((src, idx) => logoItem(src, idx, 'f-'))}
				</div>
			</div>
		</div>
	);
};

export default BrandCarousel;
