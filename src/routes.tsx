import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import RouteFallback from "@/components/RouteFallback";
import Layout from "@/components/Layout";

// Prefetch route chunks when idle
if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
  (window as Window & { requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number })
    .requestIdleCallback(() => {
      import('./pages/About');
      import('./pages/Projects');
      import('./pages/Services');
      import('./pages/Contact');
    });
}

const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AppRoutes = () => (
  <Suspense fallback={<RouteFallback />}> 
    <Routes>
      <Route path="/" element={<Layout><Index /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/projects" element={<Layout><Projects /></Layout>} />
      <Route path="/projects/:slug" element={<Layout><ProjectDetail /></Layout>} />
      <Route path="/services" element={<Layout><Services /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  </Suspense>
);

export default AppRoutes;


