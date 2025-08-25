
import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Lazy load components for better performance
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));
const PrivacySecurity = React.lazy(() => import("./pages/PrivacySecurity"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const BillingSuccess = React.lazy(() => import("./pages/BillingSuccess"));
const Account = React.lazy(() => import("./pages/Account"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Mission = React.lazy(() => import("./pages/Mission"));

const AppContent = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-6 text-muted-foreground">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Dashboard />} />
          <Route path="/coach" element={<Dashboard />} />
          <Route path="/privacy" element={<Dashboard />} />
          <Route path="/company" element={<Dashboard />} />
          
          {/* Legacy redirects */}
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
      </Suspense>
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
