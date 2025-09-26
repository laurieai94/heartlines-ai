import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/mobile-optimizations.css'
import { initReliabilitySystems } from './utils/reliabilityInit'
import { MobileProvider } from "@/hooks/useOptimizedMobile"
import { ViewportProvider } from "@/contexts/ViewportContext"
import ErrorBoundary from '@/components/ErrorBoundary'
import MobileErrorBoundary from '@/components/MobileErrorBoundary'
// Import production optimizer FIRST to suppress console immediately
import '@/utils/productionOptimizer';

// Mobile detection for error boundary selection only
const checkMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

// Defer reliability systems initialization with proper yielding
const deferInit = () => {
  // Yield to main thread before heavy initialization
  const yieldToMainThread = () => new Promise(resolve => {
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      (window as any).scheduler.postTask(resolve, { priority: 'background' });
    } else {
      setTimeout(resolve, 0);
    }
  });

  const runStaggeredInit = async () => {
    // Wait for critical rendering to complete
    await yieldToMainThread();
    
    // Only initialize reliability systems if not on mobile or if network is good
    const connection = (navigator as any).connection;
    const isMobile = window.innerWidth < 768;
    
    if (isMobile && connection && (connection.saveData || connection.effectiveType === 'slow-2g')) {
      return; // Skip heavy initialization on slow mobile
    }
    
    // Stagger initialization to prevent blocking
    setTimeout(() => {
      initReliabilitySystems();
    }, isMobile ? 2000 : 1000);
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(runStaggeredInit, { timeout: 3000 });
  } else {
    setTimeout(runStaggeredInit, 1500);
  }
};

deferInit();

const isDev = import.meta.env.DEV;

const ErrorBoundaryComponent = checkMobile() ? MobileErrorBoundary : ErrorBoundary;

// Remove StrictMode even in development to prevent double renders and performance issues
const app = (
  <ErrorBoundaryComponent>
    <MobileProvider>
      <ViewportProvider>
        <App />
      </ViewportProvider>
    </MobileProvider>
  </ErrorBoundaryComponent>
);

createRoot(document.getElementById("root")!).render(app);
