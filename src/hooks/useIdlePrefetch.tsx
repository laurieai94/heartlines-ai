import { useEffect } from 'react';

// Idle prefetching for route chunks to improve navigation speed
export const useIdlePrefetch = () => {
  useEffect(() => {
    // Only prefetch in production and when network conditions are good
    if (import.meta.env.DEV) return;
    
    const prefetchRoutes = () => {
      // Check if we're on a fast connection
      const connection = (navigator as any).connection;
      if (connection && (connection.saveData || connection.effectiveType === 'slow-2g')) {
        return; // Skip prefetching on slow connections
      }
      
      // Prefetch critical route chunks during idle time
      const routesToPrefetch = [
        () => import('@/pages/Account'),
        () => import('@/pages/Mission'),
        () => import('@/pages/Pricing'),
        () => import('@/components/AIInsights'),
        () => import('@/components/PrivacySettings')
      ];
      
      routesToPrefetch.forEach((importFn, index) => {
        // Stagger prefetching to avoid overwhelming the network
        setTimeout(() => {
          requestIdleCallback(() => {
            importFn().catch(() => {
              // Silently ignore prefetch failures
            });
          });
        }, index * 1000);
      });
    };
    
    // Wait for page to be fully loaded before prefetching
    if (document.readyState === 'complete') {
      prefetchRoutes();
    } else {
      window.addEventListener('load', prefetchRoutes, { once: true });
    }
  }, []);
};