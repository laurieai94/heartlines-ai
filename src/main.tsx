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

// Production optimizations component with enhanced mobile diagnostics
const ProductionWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isEmergencyMode } = useProductionOptimizations();
  
  // Enhanced mobile diagnostics
  React.useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Detect iOS version
      const ua = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua);
      const iOSVersion = isIOS ? ua.match(/OS (\d+)_/) : null;
      const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
      
      // Connection info
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      const connectionType = connection?.effectiveType || 'unknown';
      
      console.log('[Mobile] App initializing', {
        width: window.innerWidth,
        height: window.innerHeight,
        userAgent: navigator.userAgent,
        isIOS,
        iOSVersion: iOSVersion ? iOSVersion[1] : 'unknown',
        browser: isSafari ? 'Safari' : 'Chrome/Other',
        connectionType,
        memory: (performance as any).memory ? `${Math.round((performance as any).memory.usedJSHeapSize / 1048576)}MB` : 'unknown',
        orientation: window.screen?.orientation?.type || 'unknown'
      });
    }
  }, []);
  
  return <>{children}</>;
};

// Optimized app structure - always use MobileErrorBoundary (handles both mobile and desktop)
const AppWithBoundary = () => {
  return (
    <MobileErrorBoundary>
      <PerformanceOptimizedApp>
        <ProductionWrapper>
          <MobileProvider>
            <ViewportProvider>
              <App />
            </ViewportProvider>
          </MobileProvider>
        </ProductionWrapper>
      </PerformanceOptimizedApp>
    </MobileErrorBoundary>
  );
};

createRoot(document.getElementById("root")!).render(<AppWithBoundary />);
