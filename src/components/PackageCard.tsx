import { Link } from 'react-router-dom';

type PackageCardProps = {
  title: string;
  image: string;
  link: string;
};

const PackageCard = ({ title, image, link }: PackageCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-md border border-background/20">
      <img src={image} alt={title} className="w-full h-80 md:h-96 lg:h-[26rem] object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end">
        <h3 className="text-xl md:text-2xl font-bold text-[hsl(var(--primary))] drop-shadow-md">{title}</h3>
      </div>
      <Link to={link} className="absolute inset-0" aria-label={title} />
    </div>
  );
};

export default PackageCard;


