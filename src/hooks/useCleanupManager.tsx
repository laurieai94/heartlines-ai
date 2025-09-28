import { useEffect } from 'react';
import { MemoryManager } from '@/utils/memoryManager';

// Hook to automatically manage cleanup on component unmount
export const useCleanupManager = (componentName?: string) => {
  useEffect(() => {
    return () => {
      // Component-specific cleanup
      if (componentName) {
        console.log(`Cleaning up ${componentName}`);
      }
      
      // Global cleanup for timers and listeners
      MemoryManager.cleanup();
    };
  }, [componentName]);

  // Return utilities for manual resource management
  return {
    addTimeout: MemoryManager.addTimeout,
    addInterval: MemoryManager.addInterval,
    addListener: MemoryManager.addListener,
    removeTimeout: MemoryManager.removeTimeout,
    removeInterval: MemoryManager.removeInterval,
    forceCleanup: MemoryManager.cleanup
  };
};