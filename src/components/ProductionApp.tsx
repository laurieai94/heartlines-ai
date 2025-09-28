import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductionErrorBoundary from './ProductionErrorBoundary';
import { LoadingState } from './loading';
import { ResourceMonitor } from './ResourceMonitor';
import { Toaster } from './ui/toaster';

// Lazy load pages for better performance
const LandingPage = React.lazy(() => import('@/components/LandingPage'));
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Auth = React.lazy(() => import('@/pages/Auth'));
const AuthCallback = React.lazy(() => import('@/pages/AuthCallback'));
const GetStarted = React.lazy(() => import('@/pages/GetStarted'));
const Mission = React.lazy(() => import('@/pages/Mission'));
const Pricing = React.lazy(() => import('@/pages/Pricing'));
const Account = React.lazy(() => import('@/pages/Account'));
const NotFound = React.lazy(() => import('@/pages/NotFound'));
const PrivacySecurity = React.lazy(() => import('@/pages/PrivacySecurity'));
const BillingSuccess = React.lazy(() => import('@/pages/BillingSuccess'));

const ProductionApp: React.FC = () => {
  return (
    <ProductionErrorBoundary level="app" name="ProductionApp">
      <Router>
        <div className="min-h-screen">
          <Suspense fallback={<LoadingState variant="spinner" message="Loading..." fullScreen />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route 
                path="/coach" 
                element={
                  <ProductionErrorBoundary level="page" name="Dashboard">
                    <Dashboard />
                  </ProductionErrorBoundary>
                } 
              />
              <Route 
                path="/get-started" 
                element={
                  <ProductionErrorBoundary level="page" name="GetStarted">
                    <GetStarted />
                  </ProductionErrorBoundary>
                } 
              />
              <Route 
                path="/auth" 
                element={
                  <ProductionErrorBoundary level="page" name="Auth">
                    <Auth />
                  </ProductionErrorBoundary>
                } 
              />
              <Route 
                path="/auth/callback" 
                element={
                  <ProductionErrorBoundary level="page" name="AuthCallback">
                    <AuthCallback />
                  </ProductionErrorBoundary>
                } 
              />
              <Route path="/mission" element={<Mission />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/privacy-security" element={<PrivacySecurity />} />
              <Route path="/billing/success" element={<BillingSuccess />} />
              <Route 
                path="/account/*" 
                element={
                  <ProductionErrorBoundary level="page" name="Account">
                    <Account />
                  </ProductionErrorBoundary>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          
          <Toaster />
          
          {/* Development-only resource monitoring */}
          {import.meta.env.DEV && <ResourceMonitor />}
        </div>
      </Router>
    </ProductionErrorBoundary>
  );
};

export default ProductionApp;