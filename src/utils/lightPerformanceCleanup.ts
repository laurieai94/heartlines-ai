// Lightweight performance cleanup that won't cause mobile freezing
const isDev = import.meta.env.DEV;

// Emergency cleanup for critical situations only
export const emergencyCleanup = () => {
  if (isDev) return; // Keep all logging in development
  
  // Only clear critical errors in production
  const originalError = console.error;
  console.error = (message: any, ...args: any[]) => {
    if (typeof message === 'string' && message.includes('Critical')) {
      originalError(message, ...args);
    }
  };
};

// Gentle memory management - no aggressive cleanup
export const gentleMemoryCleanup = () => {
  if (isDev) return;
  
  // Only if garbage collection is explicitly available
  if ('gc' in window && typeof (window as any).gc === 'function') {
    try {
      (window as any).gc();
    } catch {
      // Silently fail - no aggressive cleanup
    }
  }
};

// Initialize minimal optimizations with mobile optimizer integration
export const initLightPerformanceOptimizations = () => {
  if (isDev) return;
  
  // Minimal console cleanup
  emergencyCleanup();
  
  // Import mobile optimizer for production
  import('@/utils/mobileOptimizer').then(({ mobileOptimizer }) => {
    // Let mobile optimizer handle memory management
    const devicePerformance = mobileOptimizer.assessDevicePerformance();
    
    // Adjust cleanup frequency based on device capabilities
    const cleanupInterval = devicePerformance.overall === 'low' ? 300000 : 600000; // 5-10 minutes
    
    setTimeout(gentleMemoryCleanup, 30000); // 30 seconds initial delay
    setInterval(gentleMemoryCleanup, cleanupInterval);
  }).catch(() => {
    // Fallback to original behavior if mobile optimizer fails to load
    setTimeout(gentleMemoryCleanup, 30000);
    setInterval(gentleMemoryCleanup, 600000);
  });
};