import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import PageSEO from "@/components/PageSEO";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/i18n";
import LoopingVideo from "@/components/LoopingVideo";

const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const isFormInView = useInView(formRef, { once: true, margin: "-100px" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    project: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Honeypot field to deter bots
  const [company, setCompany] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    // If honeypot filled, silently ignore
    if (company.trim().length > 0) return;
    const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID as
      | string
      | undefined;
    if (!FORMSPREE_ID) {
      toast({
        title: t.contact.errorTitle,
        description: t.contact.unavailable,
      });
      return;
    }
    if (
      !formData.firstName.trim() ||
      !formData.email.trim() ||
      !formData.project.trim()
    ) {
      toast({ title: t.contact.requiredFields });
      return;
    }
    try {
      setIsSubmitting(true);
      const endpoint = `https://formspree.io/f/${FORMSPREE_ID}`;
      const form = new FormData();
      form.append("firstName", formData.firstName.trim());
      form.append("lastName", formData.lastName.trim());
      form.append("email", formData.email.trim());
      form.append("message", formData.project.trim());
      // Useful metadata
      form.append("_subject", "NOJA Contact Form");
      form.append("_gotcha", "");
      const res = await fetch(endpoint, {
        method: "POST",
        body: form,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed to submit");
      toast({
        title: t.contact.successTitle,
        description: t.contact.successDescription,
      });
      setFormData({ firstName: "", lastName: "", email: "", project: "" });
    } catch {
      toast({
        title: t.contact.errorTitle,
        description: t.contact.errorDescription,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <PageSEO />

      {/* Contact Form Section */}
      <section
        ref={formRef}
        className="min-h-screen flex items-center py-24 relative"
      >
        {/* Background video */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <LoopingVideo
            src={`${import.meta.env.BASE_URL}videos/contact-optimized.mp4`}
            poster={`${import.meta.env.BASE_URL}videos/contact-poster.webp`}
          >
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
          </LoopingVideo>
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
              animate={
                isFormInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-black leading-tight tracking-tight">
                {t.contact.title}
              </h1>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot */}
              <input
                type="text"
                name="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="hidden"
                aria-hidden
                tabIndex={-1}
                autoComplete="off"
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-base font-normal text-black/80 mb-4"
                  >
                    {t.contact.firstName} *
                  </label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="scroll-mt-28 w-full bg-transparent border-0 border-b-2 border-black/30 focus:border-black focus:ring-0 rounded-none pb-2 text-black text-base placeholder:text-black/40 font-normal"
                    placeholder=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-base font-normal text-black/80 mb-4"
                  >
                    {t.contact.lastName}
                  </label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="scroll-mt-28 w-full bg-transparent border-0 border-b-2 border-black/30 focus:border-black focus:ring-0 rounded-none pb-2 text-black text-base placeholder:text-black/40 font-normal"
                    placeholder=""
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-base font-normal text-black/80 mb-4"
                  >
                    {t.contact.email} *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="scroll-mt-28 w-full bg-transparent border-0 border-b-2 border-black/30 focus:border-black focus:ring-0 rounded-none pb-2 text-black text-base placeholder:text-black/40 font-normal"
                    placeholder=""
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="project"
                  className="block text-base font-normal text-black/80 mb-4"
                >
                  {t.contact.projectLabel}
                </label>
                <Textarea
                  id="project"
                  name="project"
                  value={formData.project}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="scroll-mt-28 w-full bg-transparent border-0 border-b-2 border-black/30 focus:border-black focus:ring-0 rounded-none pb-2 text-black text-base placeholder:text-black/40 resize-none font-normal"
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
                  {isSubmitting ? t.contact.sending : t.contact.submit}
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
