// Performance cleanup utilities for production
const isDev = import.meta.env.DEV;

// Clean up unused console logs across the application
export const replaceConsoleLogging = () => {
  if (isDev) return; // Keep logging in development

  // Store originals for critical errors only
  const originalError = console.error;

  // Replace all console methods with no-ops
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
  
  // Keep only critical errors
  console.error = (message: any, ...args: any[]) => {
    if (typeof message === 'string' && 
        (message.includes('Critical') || message.includes('Fatal') || message.includes('Uncaught'))) {
      originalError(message, ...args);
    }
  };
};

// Memory cleanup for production
export const performMemoryCleanup = () => {
  if (isDev) return;

  // Force garbage collection if available
  if ('gc' in window && typeof (window as any).gc === 'function') {
    try {
      (window as any).gc();
    } catch {}
  }

  // Clean up DOM event listeners
  document.querySelectorAll('[data-performance-cleanup]').forEach(element => {
    if (element.parentNode) {
      const clone = element.cloneNode(true);
      element.parentNode.replaceChild(clone, element);
    }
  });
};

// Initialize all production optimizations
export const initPerformanceOptimizations = () => {
  if (isDev) return;

  replaceConsoleLogging();
  
  // Schedule memory cleanup
  setTimeout(performMemoryCleanup, 10000);
  
  // Periodic cleanup every 5 minutes
  setInterval(performMemoryCleanup, 300000);
};
