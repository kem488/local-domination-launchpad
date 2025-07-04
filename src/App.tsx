import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import { CriticalCSS } from "@/components/ui/critical-css";
import { ResourceHints } from "@/components/optimization/ResourceHints";
import { ServiceWorker } from "@/components/optimization/ServiceWorker";
import { HeatmapTracking } from "@/components/optimization/HeatmapTracking";
import { usePerformanceMonitoring } from "@/hooks/usePerformanceMonitoring";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useUTMTracking } from "@/hooks/useUTMTracking";

const queryClient = new QueryClient();

const App = () => {
  // Initialize performance monitoring and analytics
  usePerformanceMonitoring();
  useAnalytics();
  useUTMTracking();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CriticalCSS />
        <ResourceHints />
        <ServiceWorker />
        <HeatmapTracking />
        <Toaster />
        <Sonner />
        <Index />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
