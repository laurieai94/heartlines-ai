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

// Defer reliability systems initialization to after initial render
const deferInit = () => {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => {
      initReliabilitySystems();
    }, { timeout: 1500 });
  } else {
    setTimeout(initReliabilitySystems, 800);
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
