import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { LOGOS } from '@/lib/assets';
import { useTranslation } from '@/i18n';

type NavItem = {
  name: string;
  path: string;
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t, language, toggleLanguage } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems: NavItem[] = useMemo(() => [
    { name: t.nav.aboutUs, path: '/about' },
    { name: t.nav.projects, path: '/projects' },
    { name: t.nav.services, path: '/services' },
    { name: t.nav.contact, path: '/contact' },
  ], [t.nav]);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg shadow-lg shadow-black/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo (mobile) */}
          <Link to="/" className="flex items-center group relative md:hidden">
            <div className="relative">
              <img 
                src={scrolled ? LOGOS.njBeige : LOGOS.njWhite} 
                alt="NOJA" 
                className={`h-7 w-auto transition-all duration-500 group-hover:scale-105 drop-shadow-sm`}
              />
            </div>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`relative p-3 focus:outline-none backdrop-blur-sm transition-all duration-300 group border ${
                scrolled
                  ? 'text-secondary-foreground bg-secondary-foreground/10 hover:bg-secondary-foreground/20 border-secondary-foreground/20'
                  : 'text-white bg-white/10 hover:bg-white/20 border-white/20'
              }`}
            >
              {isOpen ? (
                <X size={24} className="relative z-10 transition-all duration-300" />
              ) : (
                <Menu size={24} className="relative z-10 transition-all duration-300" />
              )}
            </button>
          </div>

          {/* Desktop Navigation: split groups with true-centered logo (compact) */}
          <div className="hidden md:flex items-center w-full">
            {/* Nav items with centered logo */}
            <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-6">
              {/* Left group */}
              <div className="flex items-center gap-3 justify-end">
                {navItems.slice(0,2).map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-1.5 py-2 text-lg font-semibold transition-colors duration-300 group rounded-md ${
                      scrolled
                        ? (isActive(item.path) ? 'text-[hsl(var(--background))]' : 'text-[hsl(var(--background))]/90 hover:text-[hsl(var(--background))]')
                        : (isActive(item.path) ? 'text-white' : 'text-white/90 hover:text-white')
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ${
                        scrolled ? 'bg-[hsl(var(--background))]' : 'bg-white'
                      } ${isActive(item.path) ? 'w-8' : 'w-0 group-hover:w-8'}`}
                    />
                  </Link>
                ))}
              </div>

              {/* Center logo */}
              <Link to="/" className="group relative mx-4">
                <div className="relative">
                  <img 
                    src={scrolled ? LOGOS.njBeige : LOGOS.njWhite} 
                    alt="NOJA" 
                    className={`h-7 w-auto transition-all duration-500 group-hover:scale-105 drop-shadow-sm`}
                  />
                  
                </div>
              </Link>

              {/* Right group */}
              <div className="flex items-center gap-3 justify-start">
                {navItems.slice(2).map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`relative px-1.5 py-2 text-lg font-semibold transition-colors duration-300 group rounded-md ${
                      scrolled
                        ? (isActive(item.path) ? 'text-[hsl(var(--background))]' : 'text-[hsl(var(--background))]/90 hover:text-[hsl(var(--background))]')
                        : (isActive(item.path) ? 'text-white' : 'text-white/90 hover:text-white')
                    }`}
                  >
                    {item.name}
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ${
                        scrolled ? 'bg-[hsl(var(--background))]' : 'bg-white'
                      } ${isActive(item.path) ? 'w-8' : 'w-0 group-hover:w-8'}`}
                    />
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Language toggle - positioned at far right */}
            <button
              onClick={toggleLanguage}
              className={`ml-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-300 ${
                scrolled
                  ? 'text-[hsl(var(--background))]/90 hover:text-[hsl(var(--background))] hover:bg-[hsl(var(--background))]/10'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              aria-label={`Switch to ${language === 'en' ? 'German' : 'English'}`}
            >
              <Globe size={18} />
              <span className="text-sm font-semibold uppercase">{language}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`md:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b shadow-xl ${
            scrolled ? 'bg-white/95 border-black/10' : 'bg-black/80 border-white/10'
          }`}>
            <div className="px-6 pt-6 pb-8 space-y-3">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 text-base font-medium transition-colors duration-300 rounded-lg ${
                    scrolled
                      ? (isActive(item.path) ? 'text-brand-brown bg-black/10' : 'text-secondary-foreground hover:bg-black/10')
                      : (isActive(item.path) ? 'text-white bg-white/10' : 'text-white/90 hover:bg-white/10')
                  }`}
                  style={{
                    transform: 'translateX(-30px)',
                    opacity: 0,
                    animation: `slideInLeft 0.6s ease-out forwards ${index * 0.1}s`,
                  }}
                >
                  {item.name}
                </Link>
              ))}
              {/* Language toggle for mobile */}
              <button
                onClick={toggleLanguage}
                className={`flex items-center gap-2 px-4 py-3 text-base font-medium transition-colors duration-300 rounded-lg w-full ${
                  scrolled ? 'text-secondary-foreground hover:bg-black/10' : 'text-white/90 hover:bg-white/10'
                }`}
                style={{
                  transform: 'translateX(-30px)',
                  opacity: 0,
                  animation: `slideInLeft 0.6s ease-out forwards ${navItems.length * 0.1}s`,
                }}
              >
                <Globe size={18} />
                <span>{language === 'en' ? 'Deutsch' : 'English'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
