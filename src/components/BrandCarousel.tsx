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

	return (
		<div className={`overflow-hidden w-screen relative left-1/2 -translate-x-1/2 ${className}`}>
			<div className="relative h-16 md:h-20">
				{/* Enhanced visibility with full opacity and better contrast */}
				<div className="absolute top-0 left-0 flex gap-14 opacity-90 marquee-ltr" style={{ width: '200%' }}>
					<div className="flex gap-14 w-1/2 justify-around">
						{items.map((src, idx) => (
							<img 
								key={`brand-${idx}`} 
								src={src} 
								alt="brand logo" 
								className="h-12 md:h-16 w-auto object-contain" 
							/>
						))}
					</div>
					<div className="flex gap-14 w-1/2 justify-around">
						{items.map((src, idx) => (
							<img 
								key={`dup-brand-${idx}`} 
								src={src} 
								alt="brand logo" 
								className="h-12 md:h-16 w-auto object-contain" 
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BrandCarousel;


