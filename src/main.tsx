import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/mobile-optimizations.css'
// Import production optimizer FIRST to suppress console immediately
import '@/utils/productionOptimizer';
import { initEmergencyMonitoring } from '@/utils/emergencyPerformance';
import { initReliabilitySystems } from './utils/reliabilityInit'
import { MobileProvider } from "@/hooks/useOptimizedMobile"
import { ViewportProvider } from "@/contexts/ViewportContext"
import ErrorBoundary from '@/components/ErrorBoundary'
import MobileErrorBoundary from '@/components/MobileErrorBoundary'

// Mobile detection for error boundary selection only
const checkMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;

// EMERGENCY: Dramatically throttle initialization
const emergencyDeferInit = () => {
  // Only run on fast connections and powerful devices
  const connection = (navigator as any).connection;
  const isMobile = window.innerWidth < 768;
  const isSlowNetwork = connection && (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
  const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
  
  // Skip ALL heavy initialization on mobile, slow networks, or low-end devices
  if (isMobile || isSlowNetwork || isLowEnd) {
    return;
  }
  
  // For desktop with good connections, defer initialization much longer
  const runMinimalInit = () => {
    // Only run if user hasn't interacted in the last 5 seconds
    let lastInteraction = Date.now();
    
    const updateLastInteraction = () => {
      lastInteraction = Date.now();
    };
    
    ['click', 'scroll', 'keydown', 'touchstart'].forEach(event => {
      document.addEventListener(event, updateLastInteraction, { passive: true });
    });
    
    // Wait for true idle period before running heavy operations
    const checkAndRun = () => {
      if (Date.now() - lastInteraction > 5000) {
        // User has been idle for 5+ seconds, safe to run init
        try {
          initReliabilitySystems();
        } catch (e) {
          // Silently fail to prevent any issues
        }
      } else {
        // Check again later
        setTimeout(checkAndRun, 2000);
      }
    };
    
    setTimeout(checkAndRun, 10000); // Wait 10 seconds minimum
  };

  // Use the most aggressive deferral possible
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(runMinimalInit, { timeout: 30000 });
  } else {
    setTimeout(runMinimalInit, 15000);
  }
};

emergencyDeferInit();

// Initialize emergency performance monitoring immediately
initEmergencyMonitoring();

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
