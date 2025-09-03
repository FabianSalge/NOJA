
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Check } from 'lucide-react';
import HaveProjectCTA from '@/components/HaveProjectCTA';
import { fetchServicesPage, type CmsServicesPage, type CmsServiceItem } from '@/lib/cms';
 

const Services = () => {
  const [servicesData, setServicesData] = useState<CmsServicesPage | undefined>(undefined);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    fetchServicesPage()
      .then((data) => {
        setServicesData(data);
        setIsDataLoaded(true);
      })
      .catch(() => {
        console.warn('Failed to fetch Services from Contentful.');
        setIsDataLoaded(true); // Still set to true to prevent infinite loading
      });
  }, []);

  // Media component that handles both images and videos
  const ServiceMedia = ({ mediaUrl, alt, className }: { 
    mediaUrl?: string; 
    alt: string; 
    className?: string; 
  }) => {
    const [hasVideoError, setHasVideoError] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);

    if (!mediaUrl) {
      return (
        <img
          src={`${import.meta.env.BASE_URL}images/placeholder.svg`}
          alt={alt}
          className={className}
        />
      );
    }

    // Check if the media is a video based on file extension
    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);

    if (isVideo && !hasVideoError) {
      return (
        <div className="relative w-full h-full">
          {isVideoLoading && (
            <div className="absolute inset-0 bg-background/10 animate-pulse rounded-2xl" />
          )}
          <video
            src={mediaUrl}
            className={className}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            style={{ objectFit: 'cover' }}
            onError={() => {
              setHasVideoError(true);
              setIsVideoLoading(false);
            }}
            onLoadStart={() => {
              setHasVideoError(false);
              setIsVideoLoading(true);
            }}
            onCanPlay={() => setIsVideoLoading(false)}
            onLoadedData={() => setIsVideoLoading(false)}
            aria-label={alt}
          />
        </div>
      );
    }

    // Fallback to image if it's not a video or video failed to load
    return (
      <img
        src={mediaUrl}
        alt={alt}
        className={className}
        loading="lazy"
      />
    );
  };

  const ServiceSection = ({ service, isDark }: { 
    service: CmsServiceItem; 
    isDark: boolean;
  }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-150px" });

    const isReverse = service.alternateLayout;
    const textColor = isDark ? 'text-foreground' : 'text-background'; // Dark bg = light text, Beige bg = dark text
    const subtleTextColor = isDark ? 'text-foreground/80' : 'text-background/80';

    return (
      <section 
        ref={sectionRef}
        className={`py-16 md:py-20 relative overflow-hidden ${
          isDark ? 'bg-background' : 'bg-[hsl(var(--primary))]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div
        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.div
              className={`aspect-[4/3] relative overflow-hidden rounded-2xl shadow-xl ${
                isReverse ? 'lg:order-last' : ''
              }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
              <ServiceMedia
                mediaUrl={service.serviceMediaUrl}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>

        <div className="space-y-6">
              {/* Icon removed per request */}
              
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black ${textColor} leading-[0.9]`}>
                    {service.title}
                  </h2>
                </motion.div>
          </div>

              <motion.p 
                className={`${textColor}/80 leading-relaxed text-lg`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {service.description}
              </motion.p>

          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            {service.features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                    <Check className={`w-5 h-5 flex-shrink-0 ${
                      isDark ? 'text-foreground' : 'text-background'
                    }`} />
                    <span className={`${textColor} font-medium`}>{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
        </div>
      </section>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  // We'll create refs inside the ServiceSection component instead

  if (!isDataLoaded || !servicesData) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="pt-36 pb-24 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Loading Services...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Compact Header */}
      <section className="pt-24 pb-16 bg-[hsl(var(--primary))] text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-background text-center leading-[0.9]">
                {servicesData.heroTitle}
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-lg md:text-xl text-background/80 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {servicesData.heroSubtitle}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Sections */}
      {servicesData.services.map((service, index) => {
        const isDark = index % 2 === 0; // First service section (index 0) is dark, since hero is beige
        return (
          <ServiceSection 
            key={service.title} 
            service={service} 
            isDark={isDark}
          />
        );
      })}

      <HaveProjectCTA className="py-20" variant="dark" />
      <Footer />
    </div>
  );
};

export default Services;
