
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
// import { useDataMigration } from "@/hooks/useDataMigration";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import PrivacySecurity from "./pages/PrivacySecurity";
import Pricing from "./pages/Pricing";
import BillingSuccess from "./pages/BillingSuccess";
import Account from "./pages/Account";
import Auth from "./pages/Auth";
import Mission from "./pages/Mission";
import { BRAND } from "@/branding";

const AppContent = () => {
  // DISABLED: Initialize data migration - replaced by unified storage system
  // useDataMigration();
  
  React.useEffect(() => {
    const img = new Image();
    img.src = BRAND.iconSrc;
    img.onload = () => console.info("[Brand Asset] Loaded:", BRAND.iconSrc);
    img.onerror = () => console.error("[Brand Asset] Failed to load:", BRAND.iconSrc);
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Dashboard />} />
        <Route path="/coach" element={<Dashboard />} />
        <Route path="/privacy" element={<Dashboard />} />
        <Route path="/company" element={<Dashboard />} />
        
        {/* Legacy redirects */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="/dashboard/home" element={<Navigate to="/" replace />} />
        <Route path="/dashboard/profile" element={<Navigate to="/profile" replace />} />
        <Route path="/dashboard/coach" element={<Navigate to="/coach" replace />} />
        <Route path="/dashboard/privacy" element={<Navigate to="/privacy" replace />} />
        <Route path="/dashboard/actions" element={<Navigate to="/" replace />} />
        <Route path="/dashboard/company" element={<Navigate to="/company" replace />} />
        <Route path="/dashboard/insights" element={<Navigate to="/coach" replace />} />
        <Route path="/insights" element={<Navigate to="/coach" replace />} />
        
        <Route path="/mission" element={<Mission />} />
        <Route path="/privacy-and-security" element={<PrivacySecurity />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/billing/success" element={<BillingSuccess />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/account" element={<Account />} />
        <Route path="*" element={<NotFound />} />
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
