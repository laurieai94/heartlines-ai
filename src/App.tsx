
import React, { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "./pages/Dashboard"; // Synchronous import for faster shell
import { warmupNetwork } from "@/utils/networkWarmup";
import { useIdlePrefetch } from "@/hooks/useIdlePrefetch";
import { performanceMonitor } from "@/utils/performanceMonitor";

// Lazy load non-critical components
const NotFound = React.lazy(() => import("./pages/NotFound"));
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));
const PrivacySecurity = React.lazy(() => import("./pages/PrivacySecurity"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const BillingSuccess = React.lazy(() => import("./pages/BillingSuccess"));
const Account = React.lazy(() => import("./pages/Account"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Mission = React.lazy(() => import("./pages/Mission"));

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
        {/* Critical routes load synchronously for instant shell */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/coach" element={<Dashboard />} />
        <Route path="/privacy" element={<Dashboard />} />
        <Route path="/company" element={<Dashboard />} />
        
        {/* Legacy redirects */}
        <Route path="/insights" element={<Navigate to="/coach" replace />} />
        
        {/* Non-critical routes can be lazy */}
        <Route path="/mission" element={
          <Suspense fallback={<div className="flex items-center justify-center h-[100dvh] bg-burgundy-900"><div className="text-card-foreground">Loading...</div></div>}>
            <Mission />
          </Suspense>
        } />
        <Route path="/privacy-and-security" element={
          <Suspense fallback={<div className="flex items-center justify-center h-[100dvh] bg-burgundy-900"><div className="text-card-foreground">Loading...</div></div>}>
            <PrivacySecurity />
          </Suspense>
        } />
        <Route path="/pricing" element={
          <Suspense fallback={<div className="flex items-center justify-center h-[100dvh] bg-burgundy-900"><div className="text-card-foreground">Loading...</div></div>}>
            <Pricing />
          </Suspense>
        } />
        <Route path="/billing/success" element={
          <Suspense fallback={<div className="flex items-center justify-center h-[100dvh] bg-burgundy-900"><div className="text-card-foreground">Loading...</div></div>}>
            <BillingSuccess />
          </Suspense>
        } />
        <Route path="/auth/callback" element={
          <Suspense fallback={<div className="flex items-center justify-center h-[100dvh] bg-burgundy-900"><div className="text-card-foreground">Loading...</div></div>}>
            <AuthCallback />
          </Suspense>
        } />
        <Route path="/auth" element={
          <Suspense fallback={<div className="flex items-center justify-center h-[100dvh] bg-burgundy-900"><div className="text-card-foreground">Loading...</div></div>}>
            <Auth />
          </Suspense>
        } />
        <Route path="/account" element={
          <Suspense fallback={<div className="flex items-center justify-center h-[100dvh] bg-burgundy-900"><div className="text-card-foreground">Loading...</div></div>}>
            <Account />
          </Suspense>
        } />
        <Route path="*" element={
          <Suspense fallback={<div className="flex items-center justify-center h-[100dvh] bg-burgundy-900"><div className="text-card-foreground">Loading...</div></div>}>
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
