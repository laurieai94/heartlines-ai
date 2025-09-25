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
      // Check if we're on a fast connection and not on mobile data
      const connection = (navigator as any).connection;
      if (connection && (connection.saveData || connection.effectiveType === 'slow-2g' || (isMobile && connection.type === 'cellular'))) {
        return; // Skip prefetching on slow/limited connections
      }
      
      // Prefetch critical route chunks during idle time
      const routesToPrefetch = [
        () => import('@/pages/Dashboard'),
        () => import('@/pages/Account'),
        // Reduce prefetching on mobile to save bandwidth
        ...(isMobile ? [] : [
          () => import('@/pages/Mission'),
          () => import('@/pages/Pricing'),
          () => import('@/components/PrivacySettings'),
        ]),
        // Profile experience chunks
        () => import('@/components/ProfileBuilder'),
        () => import('@/components/NewPersonalQuestionnaire'),
        () => import('@/components/NewPartnerProfile')
      ];
      
      routesToPrefetch.forEach((importFn, index) => {
        // Longer stagger on mobile to reduce resource contention
        const staggerDelay = isMobile ? index * 2000 : index * 1000;
        setTimeout(() => {
          requestIdleCallbackSafe(() => {
            importFn().catch(() => {
              // Silently ignore prefetch failures
            });
          });
        }, staggerDelay);
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