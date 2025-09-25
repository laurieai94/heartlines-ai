import { useEffect } from 'react';
import { warmupNetwork } from '@/utils/networkWarmup';

// Homepage-specific optimization hook - lightweight version
export const useHomepageOptimization = () => {
  useEffect(() => {
    // Only in production
    if (import.meta.env.DEV) return;
    
    // Defer optimization to idle time
    const runOptimizations = () => {
      // Critical fonts for hero section
      const addResourceHint = (rel: string, href: string, as?: string) => {
        if (!document.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
          const link = document.createElement('link');
          link.rel = rel;
          link.href = href;
          if (as) link.as = as;
          document.head.appendChild(link);
        }
      };

      addResourceHint('preload', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', 'style');
      
      // Warm up network connections
      warmupNetwork();
    };

    // Use requestIdleCallback or fallback to setTimeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(runOptimizations, { timeout: 2000 });
    } else {
      setTimeout(runOptimizations, 1000);
    }
  }, []);
};