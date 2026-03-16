import type { ReactNode } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-[hsl(var(--primary))] focus:text-[hsl(var(--primary-foreground))] focus:font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main-content" className={className ?? ''}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;



