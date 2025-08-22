
import { useState, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { Send } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PreFooterCTA from '@/components/PreFooterCTA';

const Contact = () => {
  const { toast } = useToast();
  const heroRef = useRef(null);
  const formRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isFormInView = useInView(formRef, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    project: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent successfully!",
      description: "Thanks for reaching out! We'll be in touch soon.",
    });
    setFormData({ firstName: '', lastName: '', email: '', project: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      {/* Contact Section */}
      <section className="py-24 sm:py-32 flex items-center justify-center relative overflow-hidden" ref={formRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-brand-brown/10 to-background" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            className="bg-secondary/90 text-background rounded-3xl p-8 sm:p-12 md:p-16 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isFormInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 tracking-wider"
              variants={itemVariants}
            >
              WE LIKE BOLD BRIEFS
            </motion.h1>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-background/80">First name *</label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    type="text" 
                    required 
                    value={formData.firstName} 
                    onChange={handleChange}
                    className="mt-1 block w-full bg-transparent border-0 border-b-2 border-background/30 focus:border-background focus:ring-0"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-background/80">Last name</label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    type="text" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    className="mt-1 block w-full bg-transparent border-0 border-b-2 border-background/30 focus:border-background focus:ring-0"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-background/80">Email *</label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={handleChange}
                  className="mt-1 block w-full bg-transparent border-0 border-b-2 border-background/30 focus:border-background focus:ring-0"
                />
              </div>
              
              <div>
                <label htmlFor="project" className="block text-sm font-medium text-background/80">Tell us about your project.</label>
                <Textarea 
                  id="project" 
                  name="project" 
                  value={formData.project} 
                  onChange={handleChange} 
                  rows={4}
                  className="mt-1 block w-full bg-transparent border-0 border-b-2 border-background/30 focus:border-background focus:ring-0"
                />
              </div>
              
              <div className="text-center pt-4">
                <motion.button
                  type="submit"
                  className="bg-background text-secondary px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg mx-auto"
                  whileHover={{ scale: 1.05, letterSpacing: '0.05em' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Thanks</span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
