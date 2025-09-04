import { Link } from 'react-router-dom';

type PackageCardProps = {
  title: string;
  image: string;
  link: string;
};

const PackageCard = ({ title, image, link }: PackageCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-md bg-background">
      <img
        src={image}
        srcSet={[480, 768, 1024, 1366].map(w => `${image}${image.includes('?') ? '&' : '?'}w=${w} ${w}w`).join(', ')}
        sizes="(min-width: 1024px) 33vw, 50vw"
        alt={title}
        className="w-full h-80 md:h-96 lg:h-[26rem] object-cover"
        loading="lazy"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end">
        <h3 className="text-xl md:text-2xl font-bold text-[hsl(var(--primary))] drop-shadow-md">{title}</h3>
      </div>
      <Link to={link} className="absolute inset-0" aria-label={title} />
    </div>
  );
};

export default PackageCard;


