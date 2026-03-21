import React, { Profiler } from 'react'
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

// React Profiler callback for development only
const onRenderCallback = (
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number
) => {
  if (!import.meta.env.PROD && actualDuration > 16) {
    console.log(`[Profiler] ${id} ${phase}:`, {
      actualDuration: actualDuration.toFixed(2) + 'ms',
      baseDuration: baseDuration.toFixed(2) + 'ms',
      startTime: startTime.toFixed(2),
      commitTime: commitTime.toFixed(2)
    });
  }
};

// Production optimizations component with enhanced mobile diagnostics
const ProductionWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isEmergencyMode } = useProductionOptimizations();
  
  // Enhanced mobile diagnostics - development only
  React.useEffect(() => {
    if (import.meta.env.PROD) return;
    
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const ua = navigator.userAgent;
      const isIOS = /iPad|iPhone|iPod/.test(ua);
      const iOSVersion = isIOS ? ua.match(/OS (\d+)_/) : null;
      const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
      
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

// Optimized app structure with React Profiler in development
const AppWithBoundary = () => {
  const content = (
    <MobileErrorBoundary>
      <ProductionWrapper>
        <MobileProvider>
          <ViewportProvider>
            <App />
          </ViewportProvider>
        </MobileProvider>
      </ProductionWrapper>
    </MobileErrorBoundary>
  );

  // Wrap with Profiler only in development
  if (!import.meta.env.PROD) {
    return (
      <Profiler id="App" onRender={onRenderCallback}>
        {content}
      </Profiler>
    );
  }

  return content;
};

createRoot(document.getElementById("root")!).render(<AppWithBoundary />);
