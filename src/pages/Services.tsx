
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Camera, Video, Edit3, Lightbulb, Check } from 'lucide-react';
import PreFooterCTA from '@/components/PreFooterCTA';

const Services = () => {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const areServicesInView = useInView(servicesRef, { once: true, margin: "-100px" });

  const services = {
    'full-production': {
      title: 'Full Production',
      description: 'End-to-end content creation from concept to delivery.',
      icon: <Video className="h-8 w-8 text-secondary" />,
      features: [
        'Pre-production planning',
        'Script development',
        'Location scouting',
        'Talent coordination',
        'Full crew management',
        'Equipment provision',
        'Post-production editing',
        'Final delivery'
      ],
      image: '/images/full_package.avif',
    },
    'content-strategy': {
      title: 'Content Strategy & Creative Direction',
      description: 'Strategic planning and creative direction for your content needs.',
      icon: <Lightbulb className="h-8 w-8 text-secondary" />,
      features: [
        'Content audit and analysis',
        'Brand voice development',
        'Content calendar creation',
        'Platform optimization',
        'Audience research',
        'Competitive analysis',
        'Performance metrics',
        'Strategic recommendations'
      ],
      image: '/images/concept.avif',
    },
    'video-photography': {
      title: 'Video & Photography Production',
      description: 'Professional visual content creation and production.',
      icon: <Camera className="h-8 w-8 text-secondary" />,
      features: [
        'Corporate photography',
        'Event documentation',
        'Product photography',
        'Promotional videos',
        'Interview recordings',
        'Live streaming',
        'Drone footage',
        'Studio sessions'
      ],
      image: '/images/video_production.avif',
    },
    'post-production': {
      title: 'Post-Production & Editing',
      description: 'Professional editing and finishing services.',
      icon: <Edit3 className="h-8 w-8 text-secondary" />,
      features: [
        'Video editing',
        'Color correction',
        'Audio mixing',
        'Motion graphics',
        'Visual effects',
        'Title sequences',
        'Format optimization',
        'Quality assurance'
      ],
      image: '/images/editing.avif',
    }
  };

  const ServiceSection = ({ service, reverse = false }: { service: typeof services[keyof typeof services], reverse?: boolean }) => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-150px" });

    return (
      <motion.div
        ref={sectionRef}
        className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className={`aspect-[4/3] relative overflow-hidden rounded-2xl shadow-xl border border-secondary/20 ${reverse ? 'lg:order-last' : ''}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </motion.div>

        <div className="space-y-6">
          <div className="p-4 bg-secondary/10 rounded-xl inline-block border border-secondary/20">
            {service.icon}
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-100">{service.title}</h2>
          <p className="text-gray-300 leading-relaxed text-lg">{service.description}</p>
          <div className="grid sm:grid-cols-2 gap-4 pt-4">
            {service.features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                <span className="text-gray-200 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-secondary/30 via-brand-brown/20 to-secondary/20 relative overflow-hidden" ref={heroRef}>
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-48 h-48 border-2 border-secondary/10 rounded-2xl"
              style={{
                left: `${(i * 20) + 5}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.1, 0.15, 0.1],
                rotate: [0, -45, 0],
              }}
              transition={{
                duration: 12 + i * 3,
                repeat: Infinity,
                delay: i * 0.7,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center space-y-8"
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
            variants={containerVariants}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gray-100"
              variants={itemVariants}
            >
              Our{' '}
              <motion.span 
                className="text-secondary"
                animate={{ 
                  textShadow: [
                    '0 0 10px hsl(var(--secondary) / 0.5)',
                    '0 0 20px hsl(var(--secondary) / 0.8)',
                    '0 0 10px hsl(var(--secondary) / 0.5)'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Services
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed border-l-4 border-secondary/30 pl-6"
              variants={itemVariants}
            >
              From concept to completion, we provide comprehensive content creation services 
              tailored to your brand's unique needs and objectives.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Services Content */}
      <section className="py-20 relative overflow-hidden" ref={servicesRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-brown/10 via-secondary/10 to-background" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-28">
          {Object.values(services).map((service, index) => (
            <ServiceSection key={service.title} service={service} reverse={index % 2 !== 0} />
          ))}
        </div>
      </section>

      <PreFooterCTA />
      <Footer />
    </div>
  );
};

export default Services;
