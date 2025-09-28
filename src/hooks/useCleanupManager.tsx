import { useEffect, useRef } from 'react';
import { MemoryManager } from '@/utils/memoryManager';

// Enhanced hook to automatically manage cleanup on component unmount
export const useCleanupManager = (componentName?: string) => {
  const cleanupRef = useRef<(() => void)[]>([]);
  
  useEffect(() => {
    return () => {
      // Execute all registered cleanup functions
      cleanupRef.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          if (!import.meta.env.PROD) {
            console.error(`Cleanup error in ${componentName}:`, error);
          }
        }
      });
      
      // Global cleanup for timers and listeners
      MemoryManager.cleanup();
    };
  }, [componentName]);

  // Return utilities for manual resource management
  const addCleanup = (cleanup: () => void) => {
    cleanupRef.current.push(cleanup);
  };

  return {
    addTimeout: MemoryManager.addTimeout,
    addInterval: MemoryManager.addInterval,
    addListener: MemoryManager.addListener,
    removeTimeout: MemoryManager.removeTimeout,
    removeInterval: MemoryManager.removeInterval,
    removeListener: MemoryManager.removeListener,
    addCleanup,
    forceCleanup: MemoryManager.cleanup,
    getStats: MemoryManager.getStats
  };
};