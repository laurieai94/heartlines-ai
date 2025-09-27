import React from 'react'
import { createRoot } from 'react-dom/client'
import OptimizedApp from '@/components/OptimizedApp'
import './index.css'
import './styles/mobile-optimizations.css'
import { MobileProvider } from "@/hooks/useOptimizedMobile"
import { ViewportProvider } from "@/contexts/ViewportContext"
import ErrorBoundary from '@/components/ErrorBoundary'
import MobileErrorBoundary from '@/components/MobileErrorBoundary'

// Mobile detection for error boundary selection only
const checkMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

const ErrorBoundaryComponent = checkMobile() ? MobileErrorBoundary : ErrorBoundary;

// Remove StrictMode even in development to prevent double renders and performance issues
const app = (
  <ErrorBoundaryComponent>
    <MobileProvider>
      <ViewportProvider>
        <OptimizedApp />
      </ViewportProvider>
    </MobileProvider>
  </ErrorBoundaryComponent>
);

createRoot(document.getElementById("root")!).render(app);
