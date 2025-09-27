// Mobile-specific performance cleanup utilities
const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;

// Emergency cleanup for mobile freezing
export const emergencyMobileCleanup = () => {
  if (!isMobile()) return;
  
  console.log('[MobileCleanup] Running emergency cleanup...');
  
  try {
    // Clear all intervals and timeouts aggressively
    for (let id = 1; id < 1000; id++) {
      clearTimeout(id);
      clearInterval(id);
    }
    
    // Remove heavy event listeners
    const events = ['scroll', 'resize', 'touchmove', 'mousemove'];
    events.forEach(event => {
      document.removeEventListener(event, () => {});
      window.removeEventListener(event, () => {});
    });
    
    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      try {
        (window as any).gc();
      } catch {}
    }
    
    // Clear any performance observers
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const observer = new PerformanceObserver(() => {});
        observer.disconnect();
      } catch {}
    }
    
    console.log('[MobileCleanup] Emergency cleanup completed');
  } catch (error) {
    console.error('[MobileCleanup] Error during cleanup:', error);
  }
};

// Throttled mobile performance monitor
let lastCleanup = 0;
const CLEANUP_THROTTLE = 30000; // 30 seconds

export const throttledMobileCleanup = () => {
  if (!isMobile()) return;
  
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_THROTTLE) return;
  
  lastCleanup = now;
  
  // Gentle cleanup
  try {
    // Check memory pressure
    const memoryInfo = (performance as any).memory;
    if (memoryInfo && memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit > 0.7) {
      console.warn('[MobileCleanup] High memory usage detected, running cleanup');
      emergencyMobileCleanup();
    }
  } catch (error) {
    console.error('[MobileCleanup] Error checking memory:', error);
  }
};

// Initialize mobile performance monitoring
export const initMobilePerformanceCleanup = () => {
  if (!isMobile()) return;
  
  // Set up periodic cleanup
  setInterval(throttledMobileCleanup, 15000);
  
  // Set up emergency cleanup on page visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      throttledMobileCleanup();
    }
  });
  
  // Set up cleanup on low memory (if supported)
  if ('onmemorywarning' in window) {
    window.addEventListener('memorywarning', emergencyMobileCleanup);
  }
  
  console.log('[MobileCleanup] Mobile performance monitoring initialized');
};