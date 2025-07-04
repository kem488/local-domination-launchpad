import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Success } from "./pages/Success";
import { Onboarding } from "./pages/Onboarding";
import { Dashboard } from "./pages/Dashboard";
import { Auth } from "./pages/Auth";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PaymentProtectedRoute } from "@/components/auth/PaymentProtectedRoute";
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
      <AuthProvider>
        <TooltipProvider>
          <CriticalCSS />
          <ResourceHints />
          <ServiceWorker />
          <HeatmapTracking />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/success" element={<Success />} />
              <Route path="/onboarding" element={
                <PaymentProtectedRoute>
                  <Onboarding />
                </PaymentProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
