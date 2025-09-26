// Production-specific optimizations and development performance fixes
const isProduction = !import.meta.env.DEV;

// Remove console statements in ALL builds to prevent performance issues
// Development mode was causing page unresponsiveness due to excessive logging
const noop = () => {};
if (typeof console !== 'undefined') {
  console.log = noop;
  console.info = noop;
  console.debug = noop;
  console.warn = noop;
  // Keep console.error for critical issues only
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
