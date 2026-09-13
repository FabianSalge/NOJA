import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes";

import ScrollToTop from "./components/ScrollToTop";
import ConditionalAnalytics from "./components/ConditionalAnalytics";
import CookieConsent from "./components/CookieConsent";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const LocalizedRoutes = () => {
  const { pathname } = useLocation();
  return <AppRoutes key={pathname} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />

      <ErrorBoundary>
        <ScrollToTop />
        <ConditionalAnalytics />
        <LocalizedRoutes />
        <CookieConsent />
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
