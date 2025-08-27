
import { Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#FBF8F6' }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-brand-warm blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-primary blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
          {/* Left content block */}
          <div className="space-y-2 text-center md:text-left">
            <img
              src={`${import.meta.env.BASE_URL}Logos/Noja_Productions.png`}
              alt="NOJA"
              className="w-24 h-auto mx-auto md:mx-0"
            />
            <p className="text-background/80 text-lg leading-relaxed">Creative Marketing Agency</p>
            <p className="text-background/80 text-lg leading-relaxed">Based in Zurich & available Worldwide</p>
            <a href="mailto:team@nojaagency.com" className="inline-block text-background font-semibold underline underline-offset-4 break-words mx-auto md:mx-0">team@nojaagency.com</a>
            <div className="pt-6 flex items-center gap-4 justify-center md:justify-start">
              <a href="https://instagram.com/nojaagency" target="_blank" rel="noreferrer" aria-label="Instagram" className="p-3 bg-background/10 hover:bg-brand-warm rounded-full transition-colors">
                <Instagram size={20} className="text-background/70" />
              </a>
              <a href="https://tiktok.com/@nojaagency" target="_blank" rel="noreferrer" aria-label="TikTok" className="p-3 bg-background/10 hover:bg-brand-warm rounded-full transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-background/70">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right links block */}
          <div className="space-y-3 text-center md:text-right pt-8 md:pt-0">
            <Link to="/about" className="block text-background/90 hover:text-[hsl(var(--primary))]">About us</Link>
            <Link to="/projects" className="block text-background/90 hover:text-[hsl(var(--primary))]">Projects</Link>
            <Link to="/contact" className="block text-background/90 hover:text-[hsl(var(--primary))]">Contact</Link>
            <a 
              href={`${import.meta.env.BASE_URL}Footer/Terms & Conditions.pdf`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block text-background/90 hover:text-[hsl(var(--primary))]"
            >
              Terms and Conditions
            </a>
            <a 
              href={`${import.meta.env.BASE_URL}Footer/Data Protection and Security.pdf`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block text-background/90 hover:text-[hsl(var(--primary))]"
            >
              Data Protection and Security
            </a>
            <a 
              href={`${import.meta.env.BASE_URL}Footer/Impressum 2025.pdf`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block text-background/90 hover:text-[hsl(var(--primary))]"
            >
              Impressum
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
