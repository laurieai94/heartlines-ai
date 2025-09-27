import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/mobile-optimizations.css'
import './styles/mobile-performance.css'
import { MobileProvider } from "@/hooks/useOptimizedMobile"
import { OptimizedProviderStack } from "@/contexts/OptimizedContextProviders"
import { useOptimizedEffect } from '@/hooks/useOptimizedEffects';
import { initLightPerformanceOptimizations } from '@/utils/lightPerformanceCleanup';
import ErrorBoundary from '@/components/ErrorBoundary'
import MobileErrorBoundary from '@/components/MobileErrorBoundary'

// Production optimizations component
const ProductionWrapper = ({ children }: { children: React.ReactNode }) => {
  useOptimizedEffect(() => {
    initLightPerformanceOptimizations(); // Use lightweight cleanup only
  }, [], { immediate: true, production: true });
  
  return <>{children}</>;
};

// Mobile detection for error boundary selection only
const checkMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

const ErrorBoundaryComponent = checkMobile() ? MobileErrorBoundary : ErrorBoundary;

// Optimized app structure with minimal context nesting
const app = (
  <ErrorBoundaryComponent>
    <ProductionWrapper>
      <MobileProvider>
        <OptimizedProviderStack>
          <App />
        </OptimizedProviderStack>
      </MobileProvider>
    </ProductionWrapper>
  </ErrorBoundaryComponent>
);

createRoot(document.getElementById("root")!).render(app);
