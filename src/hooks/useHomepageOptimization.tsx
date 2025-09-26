import { useEffect, useCallback } from 'react';
import { warmupNetwork } from '@/utils/networkWarmup';

// Optimized homepage hook with better performance
export const useHomepageOptimization = () => {
  const runOptimizations = useCallback(() => {
    // Only in production and skip on slow connections
    if (import.meta.env.DEV) return;
    
    const connection = (navigator as any).connection;
    const isMobile = window.innerWidth < 768;
    
    // Skip optimization on slow connections or save-data mode
    if (connection && (connection.saveData || connection.effectiveType === 'slow-2g')) {
      return;
    }
    
    // Very lightweight optimization - only network warmup
    const performWarmup = () => {
      if (!document.hidden && document.hasFocus()) {
        warmupNetwork();
      }
    };
    
    // Much longer delays for non-blocking performance
    setTimeout(performWarmup, isMobile ? 15000 : 8000);
  }, []);

  useEffect(() => {
    // Use requestIdleCallback for non-blocking execution
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(runOptimizations, { timeout: 10000 });
    } else {
      setTimeout(runOptimizations, 5000);
    }
  }, [runOptimizations]);
};