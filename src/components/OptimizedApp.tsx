import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "@/pages/Dashboard";
import SplashScreen from "@/components/SplashScreen";
import ErrorBoundary from "@/components/ErrorBoundary";

// Optimized landing page with code splitting
const OptimizedLandingPage = React.lazy(() => import("./OptimizedLandingPage"));

// Lazy load all non-critical components
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
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page - lazy loaded */}
        <Route path="/" element={
          <ErrorBoundary>
            <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
              <OptimizedLandingPage />
            </Suspense>
          </ErrorBoundary>
        } />
        
        {/* Authenticated app routes */}
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/coach" element={<Dashboard />} />
        <Route path="/privacy" element={<Dashboard />} />
        <Route path="/company" element={<Dashboard />} />
        
        {/* Legacy redirects */}
        <Route path="/insights" element={<Navigate to="/coach" replace />} />
        <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
        
        {/* Non-critical routes - all lazy loaded */}
        <Route path="/mission" element={
          <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
            <Mission />
          </Suspense>
        } />
        <Route path="/privacy-and-security" element={
          <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
            <PrivacySecurity />
          </Suspense>
        } />
        <Route path="/pricing" element={
          <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
            <Pricing />
          </Suspense>
        } />
        <Route path="/billing/success" element={
          <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
            <BillingSuccess />
          </Suspense>
        } />
        <Route path="/auth/callback" element={
          <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
            <AuthCallback />
          </Suspense>
        } />
        <Route path="/auth" element={
          <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
            <Auth />
          </Suspense>
        } />
        <Route path="/get-started" element={
          <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
            <GetStarted />
          </Suspense>
        } />
        <Route path="/account" element={
          <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
            <Account />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </BrowserRouter>
  );
};

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - increased for better caching
      gcTime: 30 * 60 * 1000, // 30 minutes - increased for better memory usage
      retry: 1, // Reduced retries for faster failure handling
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
    },
  },
});

const OptimizedApp: React.FC = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default OptimizedApp;