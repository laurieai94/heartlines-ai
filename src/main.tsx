import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/mobile-optimizations.css'
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

// Mobile detection for error boundary selection
const checkMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

const ErrorBoundaryComponent = checkMobile() ? MobileErrorBoundary : ErrorBoundary;

// Optimized app structure with comprehensive performance monitoring
const app = (
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

createRoot(document.getElementById("root")!).render(app);
