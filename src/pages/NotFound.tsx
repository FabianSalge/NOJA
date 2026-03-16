import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground pt-20 px-6">
      <Helmet>
        <title>Page Not Found — NOJA</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <div className="text-center max-w-lg space-y-8">
        <div className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-black tracking-tight">404</h1>
          <p className="text-xl md:text-2xl text-foreground/70">
            This page doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] font-semibold hover:opacity-90 transition-opacity"
          >
            Go Home
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-foreground/20 font-semibold hover:bg-foreground/5 transition-colors"
          >
            View Projects
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-foreground/20 font-semibold hover:bg-foreground/5 transition-colors"
          >
            Our Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
