import { useEffect, useRef } from 'react';
import { useMobilePerformanceOptimizer } from '@/hooks/useMobilePerformanceOptimizer';

// Emergency performance mode to handle severe performance issues
export const useEmergencyPerformanceMode = () => {
  const performanceIssueDetected = useRef(false);
  const errorCount = useRef(0);
  const { isMobile, cleanupMemory } = useMobilePerformanceOptimizer();
  
  useEffect(() => {
    // Monitor for performance issues
    const handleError = () => {
      errorCount.current += 1;
      
      // More aggressive response on mobile
      const errorThreshold = isMobile ? 3 : 5;
      
      // If too many errors, enable emergency mode
      if (errorCount.current > errorThreshold) {
        performanceIssueDetected.current = true;
        
        // Immediate cleanup on mobile
        if (isMobile) {
          cleanupMemory();
        }
        
        // Disable all heavy operations
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback = () => 0;
        }
        
        // Disable animations more aggressively
        document.body.classList.add('emergency-performance');
        document.body.style.setProperty('--transition-smooth', 'none');
        document.body.style.setProperty('animation-duration', '0s');
        
        // Clear localStorage frequently written data
        try {
          const keysToClean = Object.keys(localStorage).filter(key => 
            key.includes('profile') || key.includes('temp') || key.includes('cache')
          );
          keysToClean.forEach(key => {
            if (!key.includes('_v2') && !key.includes('_migrated')) {
              localStorage.removeItem(key);
            }
          });
        } catch {
          // Ignore cleanup errors
        }
      }
    };
    
    // More sensitive error detection on mobile
    const handleConsoleError = (event: any) => {
      const message = event?.message || '';
      if (message.includes('circular') || message.includes('stringify') || message.includes('freeze')) {
        handleError();
      }
    };
    
    // Listen for unhandled errors
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    
    // Monitor console errors on mobile
    if (isMobile) {
      const originalConsoleError = console.error;
      console.error = (...args) => {
        handleConsoleError({ message: args.join(' ') });
        return originalConsoleError.apply(console, args);
      };
    }
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, [isMobile, cleanupMemory]);
  
  return {
    isEmergencyMode: performanceIssueDetected.current,
    errorCount: errorCount.current
  };
};