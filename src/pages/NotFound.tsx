import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from 'react-helmet-async';
import { buildCanonical } from '@/lib/seo';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <Helmet>
          <title>Page Not Found — NOJA</title>
          <meta name="robots" content="noindex,follow" />
          <link rel="canonical" href={buildCanonical('/404')} />
        </Helmet>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-foreground/60 mb-4">Oops! Page not found</p>
        <Link to="/" className="text-secondary hover:text-primary underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
