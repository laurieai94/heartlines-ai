
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
import { ScrollToTop } from "@/components/ScrollToTop";

// Import FirstVisitSplash for session-based splash screen
import FirstVisitSplash from "@/components/FirstVisitSplash";
// Lazy load non-critical components
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const AuthCallback = React.lazy(() => import("@/pages/AuthCallback"));
const PrivacySecurity = React.lazy(() => import("@/pages/PrivacySecurity"));
const Pricing = React.lazy(() => import("@/pages/Pricing"));
const BillingSuccess = React.lazy(() => import("@/pages/BillingSuccess"));
const Account = React.lazy(() => import("@/pages/Account"));
const Auth = React.lazy(() => import("@/pages/Auth"));
const Mission = React.lazy(() => import("@/pages/Mission"));
const Terms = React.lazy(() => import("@/pages/Terms"));
const Contact = React.lazy(() => import("@/pages/Contact"));
const AdminCostDashboard = React.lazy(() => import("@/pages/AdminCostDashboard"));

const AppContent = () => {
  // Removed disabled performance functions to eliminate unnecessary calls
  
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public landing page - with first-visit splash */}
        <Route path="/" element={
          <ErrorBoundary>
            <FirstVisitSplash />
          </ErrorBoundary>
        } />
        
        {/* Authenticated app routes protected by AuthGuard inside Dashboard */}
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/coach" element={<Dashboard />} />
        <Route path="/company" element={<Dashboard />} />
        
        {/* Legacy redirects */}
        <Route path="/insights" element={<Navigate to="/coach" replace />} />
        <Route path="/dashboard" element={<Navigate to="/profile" replace />} />
        <Route path="/privacy" element={<Navigate to="/privacy-and-security" replace />} />
        
        {/* Non-critical routes can be lazy */}
        <Route path="/mission" element={
          <Suspense fallback={<div />}>
            <Mission />
          </Suspense>
        } />
        <Route path="/privacy-and-security" element={
          <Suspense fallback={<div />}>
            <PrivacySecurity />
          </Suspense>
        } />
        <Route path="/plans" element={
          <Suspense fallback={<div />}>
            <Pricing />
          </Suspense>
        } />
        <Route path="/billing/success" element={
          <Suspense fallback={<div />}>
            <BillingSuccess />
          </Suspense>
        } />
        <Route path="/auth/callback" element={
          <Suspense fallback={<div />}>
            <AuthCallback />
          </Suspense>
        } />
        <Route path="/signin" element={
          <Suspense fallback={<div />}>
            <Auth />
          </Suspense>
        } />
        <Route path="/signup" element={
          <Suspense fallback={<div />}>
            <Auth />
          </Suspense>
        } />
        <Route path="/account" element={
          <Suspense fallback={<div />}>
            <Account />
          </Suspense>
        } />
        <Route path="/terms" element={
          <Suspense fallback={<div />}>
            <Terms />
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<div />}>
            <Contact />
          </Suspense>
        } />
        <Route path="/admin/costs" element={
          <Suspense fallback={<div />}>
            <AdminCostDashboard />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<div />}>
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
      <TooltipProvider delayDuration={500}>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
