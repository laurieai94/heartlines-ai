import { useEffect } from 'react';
import { warmupNetwork } from '@/utils/networkWarmup';

// Homepage-specific optimization hook - lightweight version
export const useHomepageOptimization = () => {
  useEffect(() => {
    // Only in production and skip on slow connections
    if (import.meta.env.DEV) return;
    
    const connection = (navigator as any).connection;
    const isMobile = window.innerWidth < 768;
    
    // Skip optimization on slow connections or save-data mode
    if (connection && (connection.saveData || connection.effectiveType === 'slow-2g')) {
      return;
    }
    
    // Much more conservative optimization
    const runOptimizations = () => {
      // Only essential font preloading, skip on mobile
      if (!isMobile) {
        const addResourceHint = (rel: string, href: string, as?: string) => {
          if (!document.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
            const link = document.createElement('link');
            link.rel = rel;
            link.href = href;
            if (as) link.as = as;
            document.head.appendChild(link);
          }
        };

        addResourceHint('preload', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap', 'style');
      }
      
      // Defer network warmup much longer
      setTimeout(() => {
        if (!document.hidden && document.hasFocus()) {
          warmupNetwork();
        }
      }, isMobile ? 10000 : 5000);
    };

    // Much longer delay before optimization
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(runOptimizations, { timeout: 5000 });
    } else {
      setTimeout(runOptimizations, isMobile ? 3000 : 2000);
    }
  }, []);
};