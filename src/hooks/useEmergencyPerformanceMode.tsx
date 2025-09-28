import { useEffect, useRef } from 'react';

// Emergency performance mode to handle severe performance issues
export const useEmergencyPerformanceMode = () => {
  const performanceIssueDetected = useRef(false);
  const errorCount = useRef(0);
  
  useEffect(() => {
    // Monitor for performance issues
    const handleError = () => {
      errorCount.current += 1;
      
      // If too many errors, enable emergency mode
      if (errorCount.current > 5) {
        performanceIssueDetected.current = true;
        
        // Disable all heavy operations
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback = () => 0;
        }
        
        // Disable animations
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
    
    // Listen for unhandled errors
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);
    
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);
  
  return {
    isEmergencyMode: performanceIssueDetected.current,
    errorCount: errorCount.current
  };
};