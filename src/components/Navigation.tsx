
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
    { name: 'Home', path: '/' },
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
          {/* Logo */}
          <Link to="/" className="flex items-center group relative">
            <div className="relative">
              <img 
                src="/images/logo-white.png" 
                alt="NOJA" 
                className={`h-12 w-auto transition-all duration-500 group-hover:scale-110 drop-shadow-sm ${scrolled ? 'invert' : ''}`}
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-primary/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Sparkles className={`absolute -top-2 -right-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse ${scrolled ? 'text-secondary-foreground' : 'text-foreground'}`} />
              <Stars className={`absolute -bottom-1 -left-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 ${scrolled ? 'text-secondary-foreground' : 'text-foreground'}`} />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 group rounded-md ${
                  isActive(item.path)
                    ? (scrolled ? 'text-brand-brown' : 'text-primary')
                    : (scrolled ? 'text-secondary-foreground hover:text-brand-brown' : 'text-foreground hover:text-primary')
                }`}
              >
                {item.name}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 transition-all duration-300 ${
                    scrolled ? 'bg-secondary-foreground' : 'bg-primary'
                  } ${
                    isActive(item.path) ? 'w-4' : 'w-0 group-hover:w-4'
                  }`}
                />
              </Link>
            ))}
          </div>

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
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`md:hidden absolute top-full left-0 right-0 backdrop-blur-xl border-b shadow-xl ${scrolled ? 'bg-secondary border-secondary-foreground/20' : 'bg-background/98 border-primary/20'}`}>
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
