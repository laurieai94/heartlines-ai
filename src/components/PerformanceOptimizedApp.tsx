import React, { useEffect } from 'react'

interface PerformanceOptimizedAppProps {
  children: React.ReactNode;
}

// SIMPLIFIED: Performance wrapper without complex monitoring
export const PerformanceOptimizedApp: React.FC<PerformanceOptimizedAppProps> = ({ children }) => {
  // Simple mobile detection without performance overhead
  const isMobile = window.innerWidth < 768;
  
  useEffect(() => {
    // Apply basic mobile optimizations only
    if (isMobile) {
      document.body.classList.add('mobile-optimized');
      
      // Add iOS-specific optimizations
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        document.body.classList.add('ios-optimized');
      }
    }
    
    return () => {
      // Cleanup classes on unmount
      document.body.classList.remove('mobile-optimized', 'ios-optimized');
    };
  }, [isMobile]);
  
  return <>{children}</>;
};