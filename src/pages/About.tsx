
import { Users, Target, Award, Heart, Camera, Radio, Clapperboard, Monitor } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import PreFooterCTA from '@/components/PreFooterCTA';

const About = () => {
  const storyRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  
  const storyInView = useInView(storyRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });

  const values = [
    {
      icon: Target,
      title: 'Built Different',
      description: 'We keep it all together, delivering full-service production from concept to final cut under one roof.',
    },
    {
      icon: Users,
      title: 'Collaborative',
      description: 'We work closely with our clients as true partners, ensuring their vision comes to life.',
    },
    {
      icon: Award,
      title: 'Content with a PULSE',
      description: 'You bring the spark, we ignite the flow. Handling concept, crew & every detail. You can focus on what matters most. We believe timeless content is more important than ever in a fast-paced digital world.',
    
    }
  ];

  const team = [
    {
      name: 'Naomi Ross',
      role: 'Content Producer',
      image: '/images/naomi.avif',
      description: "Multimedia roots and a natural eye for social-media-savvy, clever transitions.",
      funFact: "Animal hoarder."
    },
    {
      name: 'Talia Persis Jenny',
      role: 'Operations & Management',
      image: '/images/talia.avif',
      description: "Versed in design & project management, leading team through the details.",
      funFact: "People pleaser."
    },
    {
      name: 'Jamilla Metzger',
      role: 'Content Producer',
      image: '/images/jamilla.avif',
      description: "Background in multimedia with a gift for bringing out the fullest potential behind lenses.",
      funFact: "Drives a motorcycle..."
    }
  ];

  const actionImages = [
    '/images/im1.png',
    '/images/im2.png',
    '/images/im3.jpg',
    '/images/im4.png',
    '/images/im5.png',
    '/images/im6.png',
    '/images/im7.jpg',
    '/images/im8.jpg',
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-secondary/20 via-brand-brown/20 to-secondary/30 relative overflow-hidden" ref={storyRef}>
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 border border-secondary/10 rounded-full"
              style={{
                left: `${20 + i * 25}%`,
                top: `${20 + (i % 2) * 40}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-bold text-gray-100"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              About{' '}
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
                NOJA
              </motion.span>
            </motion.h1>
            <div className="space-y-6">
              <motion.p 
                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed border-l-4 border-secondary/30 pl-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Run by three women from diverse corners of the media industry.
              </motion.p>
              <motion.p 
                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed border-l-4 border-secondary/30 pl-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Bringing together our unique strengths to deliver seamless, bold production.
              </motion.p>
              <motion.p 
                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed border-l-4 border-secondary/30 pl-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                Leading with what we do best, supporting where our expertise complements the process.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden" ref={storyRef}>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-secondary/20 to-gray-900/80" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            variants={containerVariants}
            initial="hidden"
            animate={storyInView ? "visible" : "hidden"}
          >
            <motion.div 
              className="space-y-6" 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.h2 
                className="text-4xl font-bold text-gray-100"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Our Story
              </motion.h2>
              <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="border-l-2 border-secondary/30 pl-4"
                >
                  Founded in 2024, NOJA emerged from a simple belief: that great content has the power to create meaningful connections between brands and their audiences.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="border-l-2 border-brand-brown/30 pl-4"
                >
                  What started as a small team of creatives has grown into a full-service content production studio, working with startups and Fortune 500 companies alike.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={storyInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="border-l-2 border-secondary/30 pl-4"
                >
                  Today, we're proud to have created content that has generated millions of views, driven significant engagement, and most importantly, helped our clients achieve their business goals.
                </motion.p>
              </div>
            </motion.div>
            <motion.div 
              className="relative" 
              variants={itemVariants}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div 
                className="aspect-square bg-gradient-to-br from-secondary/20 to-brand-brown/20 rounded-3xl overflow-hidden border border-secondary/20 shadow-2xl"
                whileHover={{ scale: 1.02, rotate: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <motion.img 
                  src="/uploads/98ba3b82-16aa-4114-baf8-100af2d90634.png" 
                  alt="Team collaboration" 
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
              
              {/* Floating accent elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-16 h-16 bg-secondary/20 rounded-full blur-md"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5] 
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-20 h-20 bg-brand-brown/20 rounded-full blur-lg"
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.6, 0.3] 
                }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Equipment & Expertise Section */}
      <section className="py-20 bg-gradient-to-b from-secondary/5 to-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="relative"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div 
                className="aspect-[4/3] bg-gradient-to-br from-brand-brown/20 to-secondary/20 rounded-3xl overflow-hidden border border-secondary/20 shadow-2xl"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src="/lovable-uploads/98ba3b82-16aa-4114-baf8-100af2d90634.png" 
                  alt="Professional lighting equipment" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
            <motion.div 
              className="space-y-6"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-4xl font-bold text-gray-100">Professional Equipment & Expertise</h2>
              <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
                <p className="border-l-2 border-secondary/30 pl-4">
                  Our state-of-the-art equipment and technical expertise ensure that every project meets the highest production standards.
                </p>
                <p className="border-l-2 border-brand-brown/30 pl-4">
                  From professional lighting setups to cutting-edge cameras and audio equipment, we bring the full arsenal of production tools to every shoot.
                </p>
                <p className="border-l-2 border-secondary/30 pl-4">
                  But it's not just about the gear – it's about knowing how to use it to tell your story in the most compelling way possible.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-secondary/30 via-brand-brown/20 to-secondary/20 relative overflow-hidden" ref={valuesRef}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/15 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-brand-brown/15 rounded-full blur-2xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100">Our Values</h2>
            <motion.div 
              className="w-24 h-1 bg-gradient-to-r from-brand-brown to-brand-warm mx-auto rounded-full"
              initial={{ width: 0 }}
              animate={valuesInView ? { width: 96 } : { width: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              The principles that guide everything we do.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
          >
            {values.map((value, index) => (
              <motion.div 
                key={index} 
                className="text-center space-y-4 group"
                variants={itemVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-brand-brown to-brand-warm rounded-2xl flex items-center justify-center mx-auto shadow-lg border border-secondary/20"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <value.icon size={32} className="text-gray-900" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-100 group-hover:text-secondary transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed border-l-2 border-secondary/20 pl-3">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-20 bg-gradient-to-b from-secondary/10 via-brand-brown/10 to-transparent relative" ref={teamRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 drop-shadow-lg">
              Meet the{' '}
              <span className="text-secondary">Team</span>
            </h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            animate={teamInView ? 'visible' : 'hidden'}
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                className="relative group overflow-hidden rounded-2xl shadow-lg"
                variants={itemVariants}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 aspect-[4/5]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1 text-white">
                  <p className="text-secondary font-semibold">{member.role}</p>
                  <h3 className="text-3xl font-bold">{member.name}</h3>
                  <p className="text-gray-200 mt-2 text-sm max-w-xs">{member.description}</p>
                  <p className="text-gray-400 text-sm pt-2 italic">{member.funFact}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* In Action Marquee */}
      <section className="py-20 bg-gray-900 overflow-hidden">
        <div className="relative w-full">
          <div className="flex w-max marquee-content">
            {[...actionImages, ...actionImages].map((src, index) => (
              <div key={index} className="flex-shrink-0 px-2">
                <div className="overflow-hidden rounded-2xl w-80 h-80">
                  <img
                    src={src}
                    alt={`Action shot ${index + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PreFooterCTA />
      <Footer />
    </div>
  );
};

export default About;
