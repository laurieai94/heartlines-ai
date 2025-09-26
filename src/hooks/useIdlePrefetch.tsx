import { useEffect } from 'react';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';

// Safari-safe polyfill for requestIdleCallback
const requestIdleCallbackSafe = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback);
  }
  // Fallback for Safari and older browsers
  return setTimeout(callback, 100);
};

// Idle prefetching for route chunks to improve navigation speed
export const useIdlePrefetch = () => {
  const { isMobile } = useOptimizedMobile();
  
  useEffect(() => {
    // Only prefetch in production and when network conditions are good
    if (import.meta.env.DEV) return;
    
    const prefetchRoutes = () => {
      // More aggressive filtering for mobile and slow connections
      const connection = (navigator as any).connection;
      if (connection && (
        connection.saveData || 
        connection.effectiveType === 'slow-2g' || 
        connection.effectiveType === '2g' ||
        (isMobile && connection.type === 'cellular')
      )) {
        return; // Skip prefetching on slow/limited connections
      }
      
      // Significantly reduced prefetching - only critical routes
      const routesToPrefetch = isMobile ? [
        // Mobile: only prefetch most critical route
        () => import('@/pages/Dashboard')
      ] : [
        // Desktop: limited prefetching
        () => import('@/pages/Dashboard'),
        () => import('@/pages/Account')
      ];
      
      // Much longer delays to prevent main thread blocking
      let totalDelay = 0;
      routesToPrefetch.forEach((importFn, index) => {
        totalDelay += isMobile ? 5000 : 3000; // Much longer stagger
        
        setTimeout(() => {
          // Double-check we're still idle
          if (document.hidden || !document.hasFocus()) return;
          
          requestIdleCallbackSafe(() => {
            // Final check before prefetching
            if (performance.now() > 30000) return; // Skip after 30s
            
            importFn().catch(() => {
              // Silently ignore prefetch failures
            });
          });
        }, totalDelay);
      });
    };
    
    // Wait for page to be fully loaded before prefetching
    if (document.readyState === 'complete') {
      prefetchRoutes();
    } else {
      window.addEventListener('load', prefetchRoutes, { once: true });
    }
  }, [isMobile]);
};