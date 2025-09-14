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
      <Navigation />
      <main className={`pt-20 ${className ?? ''}`}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;



