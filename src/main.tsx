import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/mobile-optimizations.css'
import './styles/performance-mobile.css'
import { MobileProvider } from "@/hooks/useOptimizedMobile"
import { ViewportProvider } from "@/contexts/ViewportContext"
import { useProductionOptimizations } from "@/hooks/useProductionOptimizations"
import ErrorBoundary from '@/components/ErrorBoundary'
import MobileErrorBoundary from '@/components/MobileErrorBoundary'
import { PerformanceOptimizedApp } from '@/components/PerformanceOptimizedApp'

// Production optimizations component
const ProductionWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isEmergencyMode } = useProductionOptimizations();
  return <>{children}</>;
};

// Safe mobile detection that won't break at module load
const getErrorBoundary = () => {
  if (typeof window === 'undefined') return ErrorBoundary;
  return window.innerWidth < 768 ? MobileErrorBoundary : ErrorBoundary;
};

// Optimized app structure with safe error boundary detection
const AppWithBoundary = () => {
  const ErrorBoundaryComponent = getErrorBoundary();
  
  return (
    <ErrorBoundaryComponent>
      <PerformanceOptimizedApp>
        <ProductionWrapper>
          <MobileProvider>
            <ViewportProvider>
              <App />
            </ViewportProvider>
          </MobileProvider>
        </ProductionWrapper>
      </PerformanceOptimizedApp>
    </ErrorBoundaryComponent>
  );
};

createRoot(document.getElementById("root")!).render(<AppWithBoundary />);
