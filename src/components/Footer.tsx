
import { Instagram, Play } from 'lucide-react';
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
            <h3 className="text-2xl font-extrabold text-background">NOJA Productions</h3>
            <p className="text-background/80 text-lg leading-relaxed">Visual Production House</p>
            <p className="text-background/80 text-lg leading-relaxed">Based in Zurich & available Worldwide</p>
            <a href="mailto:team@noja-productions.com" className="inline-block text-background font-semibold underline underline-offset-4 break-words mx-auto md:mx-0">team@noja-productions.com</a>
            <div className="pt-6 flex items-center gap-4 justify-center md:justify-start">
              <a href="#" aria-label="Instagram" className="p-3 bg-background/10 hover:bg-brand-warm rounded-full transition-colors">
                <Instagram size={20} className="text-background/70" />
              </a>
              <a href="#" aria-label="TikTok" className="p-3 bg-background/10 hover:bg-brand-warm rounded-full transition-colors">
                <Play size={20} className="text-background/70" />
              </a>
            </div>
          </div>

          {/* Right links block */}
          <div className="space-y-3 text-center md:text-right pt-8 md:pt-0">
            <Link to="/about" className="block text-background/90 hover:text-brand-warm">About us</Link>
            <Link to="/projects" className="block text-background/90 hover:text-brand-warm">Projects</Link>
            <Link to="/contact" className="block text-background/90 hover:text-brand-warm">Contact</Link>
            <a href="#" className="block text-background/90 hover:text-brand-warm">Terms and Conditions</a>
            <a href="#" className="block text-background/90 hover:text-brand-warm">Data Protection and Security</a>
            <img
              src={`${import.meta.env.BASE_URL}Logos/Noja_Productions.png`}
              alt="NOJA Productions"
              className="block mx-auto md:ml-auto md:mr-0 mt-8 md:mt-6 w-28 sm:w-32 md:w-40 opacity-70 select-none"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
