
import React, { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "@/pages/Dashboard"; // Synchronous import for faster shell
import { warmupNetwork } from "@/utils/networkWarmup";
import { useIdlePrefetch } from "@/hooks/useIdlePrefetch";
import { performanceMonitor } from "@/utils/performanceMonitor";
import SplashScreen from "@/components/SplashScreen";
import ErrorBoundary from "@/components/ErrorBoundary";

// Direct imports for debugging - temporarily disable lazy loading
import LandingPage from "@/components/LandingPage";
import NotFound from "@/pages/NotFound";
import AuthCallback from "@/pages/AuthCallback";
import PrivacySecurity from "@/pages/PrivacySecurity";
import Pricing from "@/pages/Pricing";
import BillingSuccess from "@/pages/BillingSuccess";
import Account from "@/pages/Account";
import Auth from "@/pages/Auth";
import GetStarted from "@/pages/GetStarted";
import Mission from "@/pages/Mission";

const AppContent = () => {
  // Initialize performance optimizations
  useIdlePrefetch();
  
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.init();
    
    // Warm up network connections
    warmupNetwork();
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page - direct load */}
        <Route path="/" element={
          <ErrorBoundary>
            <LandingPage />
          </ErrorBoundary>
        } />
        
        {/* Authenticated app routes protected by AuthGuard inside Dashboard */}
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/coach" element={<Dashboard />} />
        <Route path="/privacy" element={<Dashboard />} />
        <Route path="/company" element={<Dashboard />} />
        
        {/* Legacy redirects */}
        <Route path="/insights" element={<Navigate to="/coach" replace />} />
        <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
        
        {/* Direct imports for debugging */}
        <Route path="/mission" element={<ErrorBoundary><Mission /></ErrorBoundary>} />
        <Route path="/privacy-and-security" element={<ErrorBoundary><PrivacySecurity /></ErrorBoundary>} />
        <Route path="/pricing" element={<ErrorBoundary><Pricing /></ErrorBoundary>} />
        <Route path="/billing/success" element={<ErrorBoundary><BillingSuccess /></ErrorBoundary>} />
        <Route path="/auth/callback" element={<ErrorBoundary><AuthCallback /></ErrorBoundary>} />
        <Route path="/auth" element={<ErrorBoundary><Auth /></ErrorBoundary>} />
        <Route path="/get-started" element={<ErrorBoundary><GetStarted /></ErrorBoundary>} />
        <Route path="/account" element={<ErrorBoundary><Account /></ErrorBoundary>} />
        <Route path="*" element={<ErrorBoundary><NotFound /></ErrorBoundary>} />
      </Routes>
    </BrowserRouter>
  );
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App: React.FC = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
