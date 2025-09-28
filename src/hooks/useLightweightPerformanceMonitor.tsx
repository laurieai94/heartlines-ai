import { useEffect, useRef } from 'react';

// Lightweight performance monitor that actually works
export const useLightweightPerformanceMonitor = () => {
  const performanceIssues = useRef(0);
  const isEmergencyMode = useRef(false);
  
  useEffect(() => {
    // Only run on mobile where performance issues are most critical
    const isMobile = window.innerWidth < 768;
    if (!isMobile) return;
    
    let longTaskCount = 0;
    const startTime = performance.now();
    
    // Monitor for long tasks (actual performance bottlenecks)
    const checkPerformance = () => {
      const currentTime = performance.now();
      const runTime = currentTime - startTime;
      
      // If page has been running for more than 30 seconds and we have performance issues
      if (runTime > 30000 && longTaskCount > 5) {
        isEmergencyMode.current = true;
        
        // Aggressive cleanup
        try {
          // Clear any cached data that might be causing memory issues
          const keysToClean = Object.keys(localStorage).filter(key => 
            key.includes('temp') || key.includes('cache') || key.includes('debug')
          );
          keysToClean.forEach(key => localStorage.removeItem(key));
          
          // Force garbage collection if available
          if ((window as any).gc) {
            (window as any).gc();
          }
          
          // Reduce CSS animations
          document.body.classList.add('emergency-performance');
          
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
    
    // Use PerformanceObserver if available for real monitoring
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 100) { // Tasks over 100ms are problematic
              longTaskCount++;
            }
          });
          
          if (longTaskCount > 3) {
            checkPerformance();
          }
        });
        
        observer.observe({ entryTypes: ['longtask', 'measure'] });
        
        return () => observer.disconnect();
      } catch (e) {
        // PerformanceObserver not supported, fall back to timer
        const timer = setInterval(checkPerformance, 10000);
        return () => clearInterval(timer);
      }
    }
    
    // Fallback: Simple timer-based check
    const timer = setInterval(checkPerformance, 10000);
    return () => clearInterval(timer);
  }, []);
  
  return {
    isEmergencyMode: isEmergencyMode.current
  };
};