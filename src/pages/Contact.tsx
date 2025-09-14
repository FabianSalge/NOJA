
import { useState, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { buildCanonical } from '@/lib/seo';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Honeypot field to deter bots
  const [company, setCompany] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    // If honeypot filled, silently ignore
    if (company.trim().length > 0) return;
    const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as string | undefined;
    if (!FORMSPREE_ID) {
      toast({ title: 'Contact temporarily unavailable', description: "Please configure VITE_FORMSPREE_ID to enable the form.", });
      return;
    }
    try {
      setIsSubmitting(true);
      const endpoint = `https://formspree.io/f/${FORMSPREE_ID}`;
      const form = new FormData();
      form.append('firstName', formData.firstName);
      form.append('lastName', formData.lastName);
      form.append('email', formData.email);
      form.append('message', formData.project);
      // Useful metadata
      form.append('_subject', 'NOJA Contact Form');
      form.append('_gotcha', '');
      const res = await fetch(endpoint, {
        method: 'POST',
        body: form,
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to submit');
      toast({ title: 'Message sent successfully!', description: "Thanks for reaching out! We'll be in touch soon.", });
      setFormData({ firstName: '', lastName: '', email: '', project: '' });
    } catch {
      toast({ title: 'Something went wrong', description: 'Please try again in a moment.', });
    } finally {
      setIsSubmitting(false);
    }
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
      <Helmet>
        <title>Contact — NOJA</title>
        <meta name="description" content="Start a project with NOJA. We like bold briefs." />
        <link rel="canonical" href={buildCanonical('/contact')} />
      </Helmet>
      
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
            
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {/* Honeypot */}
              <input type="text" name="company" value={company} onChange={(e) => setCompany(e.target.value)} className="hidden" aria-hidden tabIndex={-1} autoComplete="off" />
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
                  disabled={isSubmitting}
                  className="bg-black text-white px-10 py-3 rounded-full font-bold text-base transition-all duration-300 hover:bg-black/90 disabled:opacity-60 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? 'Sending…' : 'Thanks'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
      
    </div>
  );
};

export default Contact;
