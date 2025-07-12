import { ArrowRight, Play, Users, Award, Zap, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import PreFooterCTA from '@/components/PreFooterCTA';

const Index = () => {
  const { scrollY } = useScroll();
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  
  const yRange = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacityRange = useTransform(scrollY, [0, 300], [1, 0]);

  const handleScroll = () => {
    const contentElement = document.getElementById('content');
    if (contentElement) {
      contentElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const stats = [
    { icon: Users, label: 'Happy Clients', value: '150+' },
    { icon: Award, label: 'Projects Completed', value: '500+' },
    { icon: Zap, label: 'Years Experience', value: '8+' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-brand-brown/30 to-secondary/30"
          style={{ y: yRange, opacity: opacityRange }}
        />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-secondary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10 pt-16" ref={heroRef}>
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
          >
            {/* Logo */}
            <motion.div 
              className="space-y-4" 
              variants={itemVariants}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="inline-block"
                animate={{
                  y: [-10, 10],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                <motion.img 
                  src="/images/logo-white.png" 
                  alt="NOJA" 
                  className="h-32 md:h-40 lg:h-48 w-auto mx-auto drop-shadow-2xl"
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
              </motion.div>
              
              <motion.div 
                className="space-y-6" 
                variants={itemVariants}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.h2 
                  className="text-lg md:text-xl lg:text-2xl font-light text-gray-100 tracking-[0.2em] uppercase"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  Content with a{' '}
                  <motion.span 
                    className="text-secondary"
                    animate={{ 
                      opacity: [0.7, 1, 0.7],
                      textShadow: ['0 0 10px hsl(var(--secondary) / 0.5)', '0 0 20px hsl(var(--secondary) / 0.8)', '0 0 10px hsl(var(--secondary) / 0.5)']
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Pulse
                  </motion.span>
                </motion.h2>
                
                {/* CTA Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-6"
                  variants={itemVariants}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <Link to="/projects">
                    <motion.button
                      className="group relative flex items-center justify-center text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-secondary-foreground font-semibold rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-secondary/30"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Our Work
                        <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                      <motion.div 
                        className="absolute inset-0 bg-white/20"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.5, opacity: 1 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        style={{ borderRadius: '50%' }}
                      />
                    </motion.button>
                  </Link>
                  
                  <motion.button 
                    className="group relative flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-secondary/50 text-secondary font-semibold rounded-full overflow-hidden transition-all duration-300 ease-in-out hover:bg-secondary/10 hover:border-secondary hover:shadow-lg hover:shadow-secondary/20"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                     <motion.div 
                      className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      whileHover={{ rotate: 360, transition: { duration: 2, ease: "linear", repeat: Infinity } }}
                    >
                      <Play className="w-4 h-4 text-secondary" />
                    </motion.div>
                    <span className="relative z-10">Watch Showreel</span>
                    <motion.div 
                      className="absolute inset-0 bg-secondary/10"
                      initial={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.5, opacity: 1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      style={{ borderRadius: '50%' }}
                    />
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced scroll indicator */}
        <motion.div 
          className="absolute bottom-12 left-0 right-0 mx-auto w-10 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          onClick={handleScroll}
          whileHover={{ scale: 1.1 }}
        >
          <div className="flex flex-col items-center space-y-3 p-2">
            <div 
              className="w-10 h-10 border-2 border-secondary/60 rounded-full flex items-center justify-center transition-all duration-300 hover:border-secondary hover:bg-secondary/10"
            >
              <ArrowDown className="w-5 h-5 text-secondary/80" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Content Section */}
      <section id="content" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-secondary/10 to-gray-900"></div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
          <motion.div 
            className="space-y-8 mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Turning ideas into scroll-stopping visuals.
    
            </motion.p>
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Concept-driven, hands-on, and end-to-end.
              We don't just capture the story, we shape it.
            </motion.p>
      
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden" ref={statsRef}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-gray-900 to-brand-brown/10"></div>
          <div className="absolute inset-0 bg-gradient-radial from-brand-brown/10 via-transparent to-secondary/10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center space-y-6 group"
                variants={itemVariants}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ y: -10 }}
              >
                <motion.div 
                  className="relative w-20 h-20 mx-auto"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-brand-brown/30 to-secondary/30 rounded-2xl rotate-6"
                    animate={{ rotate: [6, 12, 6] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-brand-brown via-brand-brown/90 to-secondary/30 rounded-2xl flex items-center justify-center shadow-lg border border-secondary/20">
                    <stat.icon size={32} className="text-secondary-foreground" />
                  </div>
                </motion.div>
                <div className="space-y-2">
                  <motion.div 
                    className="text-5xl font-black text-secondary mb-2 tracking-tight"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-300 font-medium uppercase tracking-wider text-sm border-b border-secondary/20 pb-1">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 relative overflow-hidden" ref={servicesRef}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-secondary/10 to-gray-900"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-transparent to-brand-brown/10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
          <motion.div 
            className="space-y-6 mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-black text-gray-100 tracking-tight"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={servicesInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              What We Do{' '}
              <motion.span 
                className="bg-gradient-to-r from-brand-brown to-secondary bg-clip-text text-transparent"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Best
              </motion.span>
            </motion.h2>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-brand-brown to-secondary mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={servicesInView ? { width: 96 } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.p 
              className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0 }}
              animate={servicesInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              From strategy to execution, we deliver content that makes an impact.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
          >
            {[
              {
                title: 'Full Production',
                description: 'Combining all packages. From creative concept and project management to delivering a finished, ready-to-use product.',
              },
              {
                title: 'Content Strategy & Creative Direction',
                description: 'Turning your idea into an actionable plan from start to scroll. We develop concepts that resonate.',
              },
              {
                title: 'Video & Photography Production',
                description: 'We bring the equipment, capture your vision, and deliver ready-to-edit content that tells your story.',
              },
              {
                title: 'Post-Production & Editing',
                description: 'A top-up to add on to your package to make your vision even more crystal clear through expert editing.',
              },
            ].map((service, index) => (
              <motion.div 
                key={index} 
                className="group relative"
                variants={itemVariants}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-brand-brown/10 to-secondary/10 rounded-3xl blur-xl"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.5, 0.8, 0.5] 
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative bg-gradient-to-br from-gray-800/80 via-gray-800/60 to-gray-800/40 backdrop-blur-sm border border-secondary/20 p-10 rounded-3xl hover:border-secondary/40 transition-all duration-500 hover:shadow-2xl">
                  <div className="space-y-6">
                    <motion.h3 
                      className="text-2xl font-bold text-gray-100 group-hover:text-secondary transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      {service.title}
                    </motion.h3>
                    <p className="text-gray-300 leading-relaxed border-l-2 border-secondary/30 pl-4">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/services"
                className="group inline-flex items-center gap-3 text-secondary font-semibold text-lg hover:gap-4 transition-all duration-300 relative border border-secondary/30 px-6 py-3 rounded-full hover:border-secondary/60"
              >
                <span>Explore All Services</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={20} />
                </motion.div>
                <motion.div 
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-brand-brown to-secondary"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <PreFooterCTA />
      <Footer />
    </div>
  );
};

export default Index;
