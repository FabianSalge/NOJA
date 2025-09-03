
import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, Variants } from 'framer-motion';
import { Send } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
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
    <div className="min-h-screen bg-[hsl(var(--primary))] text-foreground">
      <Navigation />
      
      {/* Contact Form Section */}
      <section 
        ref={formRef}
        className="min-h-screen flex items-center py-24 relative"
      >
        {/* Background video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            src={`${import.meta.env.BASE_URL}videos/contact.mp4`}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={isFormInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-black leading-tight tracking-tight">
                WE LIKE BOLD BRIEFS
              </h1>
            </motion.div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div>
                  <label htmlFor="firstName" className="block text-base font-normal text-black/80 mb-4">First name *</label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    type="text" 
                    required 
                    value={formData.firstName} 
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-black/30 focus:border-black focus:ring-0 rounded-none pb-2 text-black text-base placeholder:text-black/40 font-normal"
                    placeholder=""
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-base font-normal text-black/80 mb-4">Last name</label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    type="text" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-black/30 focus:border-black focus:ring-0 rounded-none pb-2 text-black text-base placeholder:text-black/40 font-normal"
                    placeholder=""
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-base font-normal text-black/80 mb-4">Email *</label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={handleChange}
                    className="w-full bg-transparent border-0 border-b-2 border-black/30 focus:border-black focus:ring-0 rounded-none pb-2 text-black text-base placeholder:text-black/40 font-normal"
                    placeholder=""
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="project" className="block text-base font-normal text-black/80 mb-4">Tell us about your project.</label>
                <Textarea 
                  id="project" 
                  name="project" 
                  value={formData.project} 
                  onChange={handleChange} 
                  rows={4}
                  required
                  className="w-full bg-transparent border-0 border-b-2 border-black/30 focus:border-black focus:ring-0 rounded-none pb-2 text-black text-base placeholder:text-black/40 resize-none font-normal"
                  placeholder=""
                />
              </div>
              
              <div className="text-center pt-6">
                <motion.button
                  type="submit"
                  className="bg-black text-white px-10 py-3 rounded-full font-bold text-base transition-all duration-300 hover:bg-black/90"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Thanks
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
