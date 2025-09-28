import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

// Mobile-specific performance optimizations
export const useMobilePerformanceOptimizer = () => {
  const performanceMetrics = useRef({
    renderCount: 0,
    lastRenderTime: Date.now(),
    isThrottled: false,
    errorCount: 0
  });

  // Detect mobile device
  const isMobile = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (window.innerWidth <= 768);
  }, []);

  // Throttle renders on mobile to prevent freezing
  const throttleRender = useCallback(() => {
    if (!isMobile()) return false;
    
    const now = Date.now();
    const timeSinceLastRender = now - performanceMetrics.current.lastRenderTime;
    
    // If rendering too frequently, throttle
    if (timeSinceLastRender < 50) {
      performanceMetrics.current.isThrottled = true;
      return true;
    }
    
    performanceMetrics.current.lastRenderTime = now;
    performanceMetrics.current.renderCount++;
    performanceMetrics.current.isThrottled = false;
    
    return false;
  }, [isMobile]);

  // Emergency performance mode detection
  const checkEmergencyMode = useCallback(() => {
    const metrics = performanceMetrics.current;
    
    // If too many renders in short time, enable emergency mode
    if (metrics.renderCount > 100 && metrics.isThrottled) {
      console.warn('[MobileOptimizer] Emergency mode activated - too many renders');
      
      // Clear console logs to free memory
      if (console.clear && isMobile()) {
        console.clear();
      }
      
      // Reduce animation complexity
      document.body.style.setProperty('--transition-smooth', 'none');
      
      // Show user notification
      toast.warning('Optimizing for your device...');
      
      return true;
    }
    
    return false;
  }, [isMobile]);

  // Memory cleanup for mobile
  const cleanupMemory = useCallback(() => {
    if (!isMobile()) return;
    
    // Clear any cached data that might be causing issues
    try {
      // Clear temporary profile data that might have circular references
      const keysToClean = Object.keys(localStorage).filter(key => 
        key.includes('temp') || key.includes('cache') || key.includes('_old')
      );
      
      keysToClean.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`[MobileOptimizer] Could not clean ${key}:`, error);
        }
      });
    } catch (error) {
      console.warn('[MobileOptimizer] Memory cleanup failed:', error);
    }
  }, [isMobile]);

  // Handle mobile viewport changes (keyboard show/hide)
  useEffect(() => {
    if (!isMobile()) return;

    let timeoutId: NodeJS.Timeout;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Trigger a gentle layout recalculation
        document.documentElement.style.height = window.innerHeight + 'px';
      }, 150);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is hidden, clean up resources
        cleanupMemory();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial cleanup
    cleanupMemory();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isMobile, cleanupMemory]);

  // Performance monitoring
  useEffect(() => {
    if (!isMobile()) return;

    const monitorInterval = setInterval(() => {
      if (checkEmergencyMode()) {
        clearInterval(monitorInterval);
      }
    }, 5000);

    return () => clearInterval(monitorInterval);
  }, [checkEmergencyMode, isMobile]);

  return {
    isMobile: isMobile(),
    throttleRender,
    isThrottled: performanceMetrics.current.isThrottled,
    cleanupMemory,
    renderCount: performanceMetrics.current.renderCount
  };
};