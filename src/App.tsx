
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
// import { useDataMigration } from "@/hooks/useDataMigration";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import PrivacySecurity from "./pages/PrivacySecurity";
import Pricing from "./pages/Pricing";
import BillingSuccess from "./pages/BillingSuccess";

const AppContent = () => {
  // DISABLED: Initialize data migration - replaced by unified storage system
  // useDataMigration();
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />
        <Route path="/dashboard" element={<Navigate to="/dashboard/home" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard/home" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<Dashboard />} />
        <Route path="/dashboard/coach" element={<Dashboard />} />
        <Route path="/dashboard/privacy" element={<Dashboard />} />
        
        <Route path="/dashboard/actions" element={<Navigate to="/dashboard/home" replace />} />
        <Route path="/dashboard/company" element={<Dashboard />} />
        <Route path="/privacy-and-security" element={<PrivacySecurity />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/billing/success" element={<BillingSuccess />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
