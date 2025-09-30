
import React, { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "@/pages/Dashboard"; // Synchronous import for faster shell
// Removed disabled performance imports
import SplashScreen from "@/components/SplashScreen";
import ErrorBoundary from "@/components/ErrorBoundary";

// Import LandingPage directly for immediate rendering (critical path)
import LandingPage from "@/components/LandingPage";
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
const Terms = React.lazy(() => import("@/pages/Terms"));
const Contact = React.lazy(() => import("@/pages/Contact"));

const AppContent = () => {
  // Removed disabled performance functions to eliminate unnecessary calls
  
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
        
        {/* Non-critical routes can be lazy */}
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
        <Route path="/plans" element={
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
        <Route path="/terms" element={
          <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
            <Terms />
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<SplashScreen titleText="heartlines loading..." />}>
            <Contact />
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
