// ULTRA-AGGRESSIVE performance optimizer - eliminates ALL console overhead
const isProduction = !import.meta.env.DEV;
const isDev = import.meta.env.DEV;

// Completely disable ALL console methods in ALL environments for maximum performance
const noop = () => {};

// Nuclear option: Override ALL console methods immediately for zero performance impact
if (typeof console !== 'undefined') {
  // Completely eliminate ALL console output to prevent page unresponsiveness
  console.log = noop;
  console.info = noop; 
  console.debug = noop;
  console.warn = noop;
  console.error = noop; // Even errors are disabled for performance
  console.trace = noop;
  console.time = noop;
  console.timeEnd = noop;
  console.group = noop;
  console.groupEnd = noop;
  console.table = noop;
  console.count = noop;
  console.clear = noop;
  console.assert = noop;
  
  // Override console object completely to prevent any method calls
  Object.keys(console).forEach(key => {
    if (typeof console[key as keyof Console] === 'function') {
      (console as any)[key] = noop;
    }
  });
}

// Optimize animations for reduced motion
export const optimizeForPerformance = () => {
  if (isProduction) {
    // Disable non-essential animations in production
    const style = document.createElement('style');
    style.textContent = `
      .animate-pulse,
      .animate-float,
      .animate-float-slow,
      .animate-bounce-gentle { 
        animation: none !important; 
      }
      * { 
        will-change: auto !important; 
      }
    `;
    document.head.appendChild(style);
  }
};

// Initialize production optimizations
if (isProduction) {
  // Run optimizations after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeForPerformance);
  } else {
    optimizeForPerformance();
  }
}
