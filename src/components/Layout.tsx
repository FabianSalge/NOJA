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
      <main className={className ?? ''}>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;



