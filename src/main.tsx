import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/mobile-optimizations.css'
import { MobileProvider } from "@/hooks/useOptimizedMobile"
import { ViewportProvider } from "@/contexts/ViewportContext"
import { useOptimizedEffect } from '@/hooks/useOptimizedEffects';
import { initPerformanceOptimizations } from '@/utils/performanceCleanup';
import { initMobilePerformanceCleanup } from '@/utils/mobilePerformanceCleanup';
import ErrorBoundary from '@/components/ErrorBoundary'
import MobileErrorBoundary from '@/components/MobileErrorBoundary'

// Production optimizations component
const ProductionWrapper = ({ children }: { children: React.ReactNode }) => {
  useOptimizedEffect(() => {
    initPerformanceOptimizations();
    initMobilePerformanceCleanup(); // Initialize mobile-specific cleanup
  }, [], { immediate: true, production: true });
  
  return <>{children}</>;
};

// Mobile detection for error boundary selection only
const checkMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

const ErrorBoundaryComponent = checkMobile() ? MobileErrorBoundary : ErrorBoundary;

// Remove StrictMode even in development to prevent double renders and performance issues
const app = (
  <ErrorBoundaryComponent>
    <ProductionWrapper>
      <MobileProvider>
        <ViewportProvider>
          <App />
        </ViewportProvider>
      </MobileProvider>
    </ProductionWrapper>
  </ErrorBoundaryComponent>
);

createRoot(document.getElementById("root")!).render(app);
