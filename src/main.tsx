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
import { initPerformanceMonitoring } from '@/utils/performanceSafeguards';

// Import production optimizer
import '@/utils/productionOptimizer';

// Initialize performance monitoring for mobile optimizations
initPerformanceMonitoring();

// Global error handler for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Mobile-specific error handler
const checkMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

// Enhanced error reporting for mobile
if (checkMobile()) {
  window.addEventListener('error', (event) => {
    console.error('Mobile error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      userAgent: navigator.userAgent,
      viewport: { width: window.innerWidth, height: window.innerHeight }
    });
  });
}

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
      console.info('Skipping heavy initialization on slow mobile connection');
      return;
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

const app = isDev ? (
  <React.StrictMode>
    <ErrorBoundaryComponent>
      <MobileProvider>
        <ViewportProvider>
          <App />
        </ViewportProvider>
      </MobileProvider>
    </ErrorBoundaryComponent>
  </React.StrictMode>
) : (
  <ErrorBoundaryComponent>
    <MobileProvider>
      <ViewportProvider>
        <App />
      </ViewportProvider>
    </MobileProvider>
  </ErrorBoundaryComponent>
);

createRoot(document.getElementById("root")!).render(app);
