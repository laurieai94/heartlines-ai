// Production-specific optimizations and development performance fixes
const isProduction = !import.meta.env.DEV;
const isDev = import.meta.env.DEV;

// Aggressive console suppression to prevent page unresponsiveness
// Even in development, limit console output to prevent performance issues
const noop = () => {};
const conditionalLog = (...args: any[]) => {
  if (isDev && args.length > 0 && !args[0]?.includes?.('📏')) {
    console.log(...args);
  }
};

// Override console methods completely in ALL environments for performance
if (typeof console !== 'undefined') {
  // Completely disable all console methods except critical errors
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  console.warn = isDev ? console.warn : noop;
  
  // Wrap console.error to only show critical errors
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // Only show critical/fatal errors or in development
    if (isDev || args.some(arg => typeof arg === 'string' && (arg.includes('Critical') || arg.includes('Fatal')))) {
      originalError.apply(console, args);
    }
  };
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
