import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems: NavItem[] = useMemo(() => [
    { name: t.nav.aboutUs, path: '/about' },
    { name: t.nav.projects, path: '/projects' },
    { name: t.nav.services, path: '/services' },
    { name: t.nav.contact, path: '/contact' },
  ], [t.nav]);

  const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isOpen) return;
    const menu = mobileMenuRef.current;
    if (!menu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = menu.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // All pages use white text + white logo.
  // Homepage: transparent → dark translucent on scroll.
  // Other pages: always dark translucent.
  const showSolidBg = !isHomePage || scrolled;

  const navBg = !isHomePage
    ? 'bg-black/60 backdrop-blur-xl'
    : scrolled
      ? 'bg-black/60 backdrop-blur-xl'
      : 'bg-transparent';

  const textColor = 'text-white';
  const textColorMuted = 'text-white/80';
  const hoverTextColor = 'hover:text-white';
  const underlineBg = 'bg-white';
  const hoverBgClass = 'hover:bg-white/10';

  const linkClass = (path: string) =>
    `relative px-3 py-2 text-[13px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 group ${
      isActive(path) ? textColor : `${textColorMuted} ${hoverTextColor}`
    }`;

  const underlineClass = (path: string) =>
    `absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[1.5px] transition-all duration-300 ${underlineBg} ${
      isActive(path) ? 'w-full' : 'w-0 group-hover:w-full'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo (mobile) */}
          <Link to="/" className="flex items-center group relative md:hidden">
            <img
              src={LOGOS.njWhite}
              alt="NOJA"
              className="h-8 w-auto transition-all duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 transition-colors duration-300 ${textColor}`}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center w-full">
            <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-8">
              {/* Left group */}
              <div className="flex items-center gap-1 justify-end">
                {navItems.slice(0,2).map((item) => (
                  <Link key={item.name} to={item.path} className={linkClass(item.path)}>
                    {item.name}
                    <span className={underlineClass(item.path)} />
                  </Link>
                ))}
              </div>

              {/* Center logo */}
              <Link to="/" className="group relative mx-6">
                <img
                  src={LOGOS.njWhite}
                  alt="NOJA"
                  className="h-8 w-auto transition-all duration-500 group-hover:scale-105"
                />
              </Link>

              {/* Right group */}
              <div className="flex items-center gap-1 justify-start">
                {navItems.slice(2).map((item) => (
                  <Link key={item.name} to={item.path} className={linkClass(item.path)}>
                    {item.name}
                    <span className={underlineClass(item.path)} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className={`ml-6 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${textColorMuted} ${hoverTextColor} ${hoverBgClass}`}
              aria-label={`Switch to ${language === 'en' ? 'German' : 'English'}`}
            >
              <Globe size={15} />
              <span>{language}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div ref={mobileMenuRef} className="md:hidden absolute top-full left-0 right-0 bg-black/85 backdrop-blur-xl border-b border-white/10">
            <div className="px-6 pt-8 pb-10 space-y-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-2 py-3.5 text-[15px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 ${
                    isActive(item.path) ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                  style={{
                    transform: 'translateY(10px)',
                    opacity: 0,
                    animation: `slideUp 0.4s ease-out forwards ${index * 0.06}s`,
                  }}
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px my-2 bg-white/10" />
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2.5 px-2 py-3.5 text-[15px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 w-full text-white/70 hover:text-white"
                style={{
                  transform: 'translateY(10px)',
                  opacity: 0,
                  animation: `slideUp 0.4s ease-out forwards ${navItems.length * 0.06}s`,
                }}
              >
                <Globe size={16} />
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
