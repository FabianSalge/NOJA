
import { Mail, Phone, MapPin, ArrowRight, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-brand-warm blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-primary blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Brand Section - Left side */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <img 
                src="/images/logo-white.png" 
                alt="NOJA Productions" 
                className="h-12 w-auto filter brightness-0 invert"
              />
              <p className="text-secondary-foreground/80 text-lg leading-relaxed max-w-md">
                Creating compelling visual stories that connect brands with their audiences through innovative production and creative direction.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-secondary-foreground/10 hover:bg-brand-warm rounded-full transition-all duration-300 hover:scale-110 group">
                <Instagram size={20} className="text-secondary-foreground/70 group-hover:text-secondary" />
              </a>
              <a href="#" className="p-3 bg-secondary-foreground/10 hover:bg-brand-warm rounded-full transition-all duration-300 hover:scale-110 group">
                <Linkedin size={20} className="text-secondary-foreground/70 group-hover:text-secondary" />
              </a>
              <a href="#" className="p-3 bg-secondary-foreground/10 hover:bg-brand-warm rounded-full transition-all duration-300 hover:scale-110 group">
                <Twitter size={20} className="text-secondary-foreground/70 group-hover:text-secondary" />
              </a>
            </div>
          </div>

          {/* Navigation & Contact - Right side */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-secondary-foreground">Navigate</h3>
              <div className="space-y-3">
                {[
                  { name: 'About Us', path: '/about' },
                  { name: 'Projects', path: '/projects' },
                  { name: 'Services', path: '/services' },
                  { name: 'Contact', path: '/contact' },
                ].map((link) => (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    className="flex items-center space-x-2 text-secondary-foreground/80 hover:text-brand-warm transition-colors duration-300 group"
                  >
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="font-medium">{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-secondary-foreground">Get in Touch</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <div className="p-2 bg-brand-warm/20 rounded-lg group-hover:bg-brand-warm transition-colors duration-300">
                    <Mail size={18} className="text-brand-warm group-hover:text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-foreground/60 uppercase tracking-wide">Email</p>
                    <a href="mailto:team@noja-productions.com" className="text-secondary-foreground/90 hover:text-brand-warm transition-colors font-medium">
                      team@noja-productions.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 group">
                  <div className="p-2 bg-brand-warm/20 rounded-lg group-hover:bg-brand-warm transition-colors duration-300">
                    <MapPin size={18} className="text-brand-warm group-hover:text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-foreground/60 uppercase tracking-wide">Location</p>
                    <span className="text-secondary-foreground/90 font-medium">Zurich, Switzerland</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-secondary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-secondary-foreground/60 text-sm">
              © 2025 NOJA Productions. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-secondary-foreground/60 hover:text-brand-warm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-secondary-foreground/60 hover:text-brand-warm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
