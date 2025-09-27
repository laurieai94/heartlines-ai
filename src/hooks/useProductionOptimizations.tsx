import { useEffect } from 'react';

// Production-only optimizations hook
export const useProductionOptimizations = () => {
  useEffect(() => {
    // Only run in production
    if (import.meta.env.DEV) return;

    // Override console methods in production for performance
    const originalConsole = {
      log: console.log,
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error
    };

    // Replace with no-ops except for critical errors
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = (message: any, ...args: any[]) => {
      // Only show critical/fatal errors in production
      if (typeof message === 'string' && 
          (message.includes('Critical') || message.includes('Fatal'))) {
        originalConsole.error(message, ...args);
      }
    };

    // Memory cleanup - remove unused event listeners
    const cleanupUnusedListeners = () => {
      // Remove any orphaned event listeners
      const events = ['resize', 'scroll', 'mousemove', 'touchmove'];
      events.forEach(event => {
        // Force cleanup by cloning and replacing nodes with many listeners
        document.querySelectorAll('[data-cleanup]').forEach(node => {
          if (node.parentNode) {
            const clone = node.cloneNode(true);
            node.parentNode.replaceChild(clone, node);
          }
        });
      });
    };

    // Cleanup after initial render
    setTimeout(cleanupUnusedListeners, 10000);

    // Cleanup function
    return () => {
      // Restore console in development
      if (import.meta.env.DEV) {
        Object.assign(console, originalConsole);
      }
    };
  }, []);
};