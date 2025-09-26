// EMERGENCY performance optimizer - eliminates ALL console overhead IMMEDIATELY
const noop = () => {};

// IMMEDIATE console suppression - run before ANY other code
(() => {
  if (typeof console !== 'undefined') {
    // Aggressively disable ALL console methods in ALL environments
    const consoleMethods = [
      'log', 'info', 'debug', 'warn', 'error', 'trace', 'time', 'timeEnd',
      'group', 'groupEnd', 'table', 'count', 'clear', 'assert', 'dir',
      'dirxml', 'profile', 'profileEnd', 'timeStamp', 'context'
    ];
    
    consoleMethods.forEach(method => {
      if (console[method as keyof Console]) {
        (console as any)[method] = noop;
      }
    });
    
    // Override any remaining console properties
    Object.getOwnPropertyNames(console).forEach(prop => {
      if (typeof console[prop as keyof Console] === 'function') {
        (console as any)[prop] = noop;
      }
    });
  }
})();

// Prevent any future console method assignments
if (typeof console !== 'undefined') {
  try {
    Object.freeze(console);
  } catch (e) {
    // Silently fail if console can't be frozen
  }
}

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
