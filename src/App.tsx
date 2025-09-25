
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

// Import LandingPage directly for immediate rendering (critical path)
import LandingPage from "@/components/LandingPage";
import AppLayout from "@/components/AppLayout";
// Lazy load non-critical components
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const AuthCallback = React.lazy(() => import("@/pages/AuthCallback"));
const PrivacySecurity = React.lazy(() => import("@/pages/PrivacySecurity"));
const Pricing = React.lazy(() => import("@/pages/Pricing"));
const BillingSuccess = React.lazy(() => import("@/pages/BillingSuccess"));
const Account = React.lazy(() => import("@/pages/Account"));
const Auth = React.lazy(() => import("@/pages/Auth"));
const GetStarted = React.lazy(() => import("@/pages/GetStarted"));
const Mission = React.lazy(() => import("@/pages/Mission"));

const AppContent = () => {
  // Initialize performance optimizations - fixed timer cleanup issue
  useIdlePrefetch();
  
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.init();
    
    // Defer network warmup to after page is stable
    const deferWarmup = () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          warmupNetwork();
        }, { timeout: 2000 });
      } else {
        setTimeout(warmupNetwork, 1000);
      }
    };
    
    deferWarmup();
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page - direct load for immediate rendering */}
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
        
        {/* Non-critical routes with AppLayout wrapper */}
        <Route path="/mission" element={
          <AppLayout>
            <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
              <Mission />
            </Suspense>
          </AppLayout>
        } />
        <Route path="/privacy-and-security" element={
          <AppLayout>
            <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
              <PrivacySecurity />
            </Suspense>
          </AppLayout>
        } />
        <Route path="/pricing" element={
          <AppLayout>
            <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
              <Pricing />
            </Suspense>
          </AppLayout>
        } />
        <Route path="/billing/success" element={
          <AppLayout>
            <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
              <BillingSuccess />
            </Suspense>
          </AppLayout>
        } />
        <Route path="/auth/callback" element={
          <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
            <AuthCallback />
          </Suspense>
        } />
        <Route path="/auth" element={
          <AppLayout>
            <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
              <Auth />
            </Suspense>
          </AppLayout>
        } />
        <Route path="/get-started" element={
          <AppLayout>
            <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
              <GetStarted />
            </Suspense>
          </AppLayout>
        } />
        <Route path="/account" element={
          <AppLayout>
            <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
              <Account />
            </Suspense>
          </AppLayout>
        } />
        <Route path="*" element={
          <AppLayout>
            <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
              <NotFound />
            </Suspense>
          </AppLayout>
        } />
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
