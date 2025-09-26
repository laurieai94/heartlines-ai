// EMERGENCY performance optimizer - eliminates ALL console overhead IMMEDIATELY
const noop = () => {};

// CONDITIONAL console suppression - only in production builds
(() => {
  // Only suppress console in production builds, keep in development
  const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost' || 
               typeof window !== 'undefined' && window.location.hostname === '127.0.0.1' ||
               import.meta.env.DEV;
  
  if (!isDev && typeof console !== 'undefined') {
    // Create safe no-op functions that won't throw errors
    const safeNoop = () => {};
    
    // Only disable non-critical console methods in production
    const nonCriticalMethods = ['log', 'info', 'debug', 'trace', 'time', 'timeEnd', 'group', 'groupEnd'];
    
    nonCriticalMethods.forEach(method => {
      if (console[method as keyof Console]) {
        (console as any)[method] = safeNoop;
      }
    });
    
    // Keep warn and error for critical issues but make them lightweight
    if (console.warn) {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        try {
          if (args[0] && args[0].toString().includes('Critical')) {
            originalWarn.apply(console, args);
          }
        } catch (e) {
          // Silent fail
        }
      };
    }
  }
})();

// Emergency performance optimizations
export const optimizeForPerformance = () => {
  // Apply aggressive optimizations in ALL environments
  const style = document.createElement('style');
  style.textContent = `
    /* Disable expensive animations */
    .animate-pulse,
    .animate-float,
    .animate-float-slow,
    .animate-bounce-gentle,
    .animate-spin,
    .animate-ping,
    .animate-bounce { 
      animation: none !important; 
    }
    
    /* Optimize rendering */
    * { 
      will-change: auto !important;
      backface-visibility: hidden !important;
    }
    
    /* Reduce reflows */
    img, video {
      content-visibility: auto !important;
    }
  `;
  document.head.appendChild(style);
  
  // Emergency garbage collection hint
  if ('gc' in window && typeof (window as any).gc === 'function') {
    setTimeout(() => (window as any).gc(), 1000);
  }
};

// Initialize emergency optimizations IMMEDIATELY
// Run optimizations as early as possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', optimizeForPerformance, { once: true });
} else {
  optimizeForPerformance();
}
