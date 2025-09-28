import { useEffect } from 'react';
import { initProductionConsole } from '@/utils/productionConsole';
import { useLightweightPerformanceMonitor } from '@/hooks/useLightweightPerformanceMonitor';

// Production-only optimizations hook
export const useProductionOptimizations = () => {
  const { isEmergencyMode } = useLightweightPerformanceMonitor();
  
  useEffect(() => {
    // Initialize safe console logging
    initProductionConsole();
    
    // Memory cleanup - only run in production and when needed
    if (!import.meta.env.DEV) {
      const cleanupUnusedListeners = () => {
        try {
          // Clear any excessive DOM listeners
          document.querySelectorAll('[data-cleanup]').forEach(node => {
            if (node.parentNode) {
              const clone = node.cloneNode(true);
              node.parentNode.replaceChild(clone, node);
            }
          });
          
          // Clear temporary localStorage entries
          const keysToClean = Object.keys(localStorage).filter(key => 
            key.includes('temp') || key.includes('debug') || key.includes('cache')
          );
          keysToClean.forEach(key => localStorage.removeItem(key));
          
        } catch {
          // Ignore cleanup errors
        }
      };

      // Cleanup after app stabilizes
      const cleanupTimer = setTimeout(cleanupUnusedListeners, 15000);
      
      return () => clearTimeout(cleanupTimer);
    }
  }, []);
  
  return { isEmergencyMode };
};