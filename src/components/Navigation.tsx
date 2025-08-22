
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles, Stars } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { name: 'About Us', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg transition-all duration-300 ${
        scrolled
          ? 'bg-secondary shadow-lg shadow-black/10 border-b border-secondary-foreground/20'
          : 'border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo (mobile) */}
          <Link to="/" className="flex items-center group relative md:hidden">
            <div className="relative">
              <img 
                src={`${import.meta.env.BASE_URL}Logos/${scrolled ? 'NJ_beige.png' : 'NJ_white.png'}`} 
                alt="NOJA" 
                className={`h-8 w-auto transition-all duration-500 group-hover:scale-105 drop-shadow-sm`}
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
                  : 'text-foreground bg-primary/10 hover:bg-primary/20 border-primary/20'
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
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center w-full gap-6">
            {/* Left group */}
            <div className="flex items-center gap-3 justify-end">
              {navItems.slice(0,2).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-1.5 py-2 text-lg font-semibold transition-colors duration-300 group rounded-md ${
                    isActive(item.path)
                      ? 'text-[hsl(var(--background))]'
                      : 'text-[hsl(var(--background))]/90 hover:text-[hsl(var(--background))]'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 bg-[hsl(var(--background))] ${
                      isActive(item.path) ? 'w-8' : 'w-0 group-hover:w-8'
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Center logo */}
            <Link to="/" className="group relative mx-4">
              <div className="relative">
                <img 
                  src={`${import.meta.env.BASE_URL}Logos/${scrolled ? 'NJ_beige.png' : 'NJ_white.png'}`} 
                  alt="NOJA" 
                  className={`h-8 w-auto transition-all duration-500 group-hover:scale-105 drop-shadow-sm`}
                />
                <Sparkles className={`absolute -top-2 -right-2 h-4 w-4 transition-opacity duration-300 ${scrolled ? 'text-[hsl(var(--background))]' : 'text-foreground'} opacity-70`} />
              </div>
            </Link>

            {/* Right group */}
            <div className="flex items-center gap-3 justify-start">
              {navItems.slice(2).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative px-1.5 py-2 text-lg font-semibold transition-colors duration-300 group rounded-md ${
                    isActive(item.path)
                      ? 'text-[hsl(var(--background))]'
                      : 'text-[hsl(var(--background))]/90 hover:text-[hsl(var(--background))]'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 bg-[hsl(var(--background))] ${
                      isActive(item.path) ? 'w-8' : 'w-0 group-hover:w-8'
                    }`}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`md:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b shadow-xl ${scrolled ? 'bg-secondary border-secondary-foreground/20' : 'bg-background border-primary/20'}`}>
            <div className="px-6 pt-6 pb-8 space-y-3">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 text-base font-medium transition-colors duration-300 rounded-lg ${
                    isActive(item.path)
                      ? (scrolled ? 'text-brand-brown bg-black/10' : 'text-primary bg-primary/10')
                      : (scrolled ? 'text-secondary-foreground hover:bg-black/10' : 'text-foreground hover:bg-primary/10 hover:text-primary')
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
