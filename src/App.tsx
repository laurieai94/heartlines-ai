
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
import LazyPageSkeleton from "@/components/LazyPageSkeleton";

// Lazy load non-critical components
const NotFound = React.lazy(() => import("@/pages/NotFound"));
const AuthCallback = React.lazy(() => import("@/pages/AuthCallback"));
const PrivacySecurity = React.lazy(() => import("@/pages/PrivacySecurity"));
import Pricing from "@/pages/Pricing";
const BillingSuccess = React.lazy(() => import("@/pages/BillingSuccess"));
const Account = React.lazy(() => import("@/pages/Account"));
import Auth from "@/pages/Auth"; // Synchronous import for instant loading
const Mission = React.lazy(() => import("@/pages/Mission"));
const Terms = React.lazy(() => import("@/pages/Terms"));
const Contact = React.lazy(() => import("@/pages/Contact"));
const AdminDashboard = React.lazy(() => import("@/pages/AdminDashboard"));

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
          <Suspense fallback={<LazyPageSkeleton />}>
            <Mission />
          </Suspense>
        } />
        <Route path="/privacy-and-security" element={
          <Suspense fallback={<LazyPageSkeleton />}>
            <PrivacySecurity />
          </Suspense>
        } />
        <Route path="/plans" element={<Pricing />} />
        <Route path="/billing/success" element={
          <Suspense fallback={<LazyPageSkeleton />}>
            <BillingSuccess />
          </Suspense>
        } />
        <Route path="/auth/callback" element={
          <Suspense fallback={<LazyPageSkeleton />}>
            <AuthCallback />
          </Suspense>
        } />
        <Route path="/signin" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/account" element={
          <Suspense fallback={<LazyPageSkeleton />}>
            <Account />
          </Suspense>
        } />
        <Route path="/terms" element={
          <Suspense fallback={<LazyPageSkeleton />}>
            <Terms />
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<LazyPageSkeleton />}>
            <Contact />
          </Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<LazyPageSkeleton />}>
            <AdminDashboard />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<LazyPageSkeleton />}>
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
      staleTime: 10 * 60 * 1000, // 10 minutes - increased for better caching
      gcTime: 30 * 60 * 1000, // 30 minutes - keep data longer in cache
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      refetchOnMount: false, // Use cached data when available
      retry: 1, // Reduce retry attempts for faster failures
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
