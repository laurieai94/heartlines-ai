
import React, { useEffect } from "react";
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

// All pages loaded synchronously for instant navigation
import NotFound from "@/pages/NotFound";
import AuthCallback from "@/pages/AuthCallback";
import PrivacySecurity from "@/pages/PrivacySecurity";
import Pricing from "@/pages/Pricing";
import BillingSuccess from "@/pages/BillingSuccess";
import Account from "@/pages/Account";
import Auth from "@/pages/Auth";
import Mission from "@/pages/Mission";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import AdminDashboard from "@/pages/AdminDashboard";

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
        
        {/* All routes load instantly without skeleton screens */}
        <Route path="/mission" element={<Mission />} />
        <Route path="/privacy-and-security" element={<PrivacySecurity />} />
        <Route path="/plans" element={<Pricing />} />
        <Route path="/billing/success" element={<BillingSuccess />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />
        <Route path="/account" element={<Account />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
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
