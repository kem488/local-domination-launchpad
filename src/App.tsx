import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import NotFound from "./pages/NotFound";
import { CriticalCSS } from "@/components/ui/critical-css";
import { ResourceHints } from "@/components/optimization/ResourceHints";
import { ServiceWorker } from "@/components/optimization/ServiceWorker";
import { HeatmapTracking } from "@/components/optimization/HeatmapTracking";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useUTMTracking } from "@/hooks/useUTMTracking";
import { useErrorLogger } from "@/hooks/useErrorLogger";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { CookieBanner } from "@/components/ui/cookie-banner";
import { RealTimeAlerts } from "@/components/monitoring/RealTimeAlerts";
import { SecurityHeaders } from "@/components/security/SecurityHeaders";
import { PerformanceOptimizer } from "@/components/optimization/PerformanceOptimizer";
import { OfflineSupport } from "@/components/optimization/OfflineSupport";
import { ABTestingProvider } from "@/components/testing/ABTestingProvider";
import React from "react";

const queryClient = new QueryClient();

const App = () => {
  // Initialize performance monitoring and analytics
  usePerformanceMonitoring();
  useAnalytics();
  useUTMTracking();
  
  const { setupGlobalErrorHandling } = useErrorLogger();
  
  // Set up global error handling on app load
  React.useEffect(() => {
    setupGlobalErrorHandling();
  }, [setupGlobalErrorHandling]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ABTestingProvider>
          <TooltipProvider>
            <BrowserRouter>
              <SecurityHeaders />
              <CriticalCSS />
              <ResourceHints />
              <ServiceWorker />
              <HeatmapTracking />
              <PerformanceOptimizer />
              <RealTimeAlerts />
              <OfflineSupport />
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <CookieBanner />
            </BrowserRouter>
          </TooltipProvider>
        </ABTestingProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
