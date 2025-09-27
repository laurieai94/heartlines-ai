import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  isLowEndDevice: boolean;
  isOverloaded: boolean;
  performanceScore: number;
}

// Mobile performance guard to prevent freezing
export const useMobilePerformanceGuard = () => {
  const metricsRef = useRef<PerformanceMetrics>({
    isLowEndDevice: false,
    isOverloaded: false,
    performanceScore: 1.0
  });

  const performanceCheckRef = useRef<NodeJS.Timeout>();

  // Detect device capabilities
  const assessDeviceCapabilities = useCallback(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    try {
      // Check device memory (Chrome only)
      const memory = (navigator as any).deviceMemory;
      const cores = navigator.hardwareConcurrency || 1;
      
      // Basic performance assessment
      const memoryFactor = memory ? Math.min(memory / 4, 1) : 0.5; // Assume 4GB is good
      const coreFactor = Math.min(cores / 4, 1); // Assume 4 cores is good
      
      const performanceScore = (memoryFactor + coreFactor) / 2;
      const isLowEndDevice = performanceScore < 0.4;

      metricsRef.current = {
        ...metricsRef.current,
        isLowEndDevice,
        performanceScore
      };

      console.log(`[MobileGuard] Device assessment: Score ${performanceScore.toFixed(2)}, Low-end: ${isLowEndDevice}`);
    } catch (error) {
      // Fallback for unsupported browsers
      metricsRef.current.isLowEndDevice = true;
      metricsRef.current.performanceScore = 0.3;
    }
  }, []);

  // Monitor performance and detect overload
  const checkPerformanceHealth = useCallback(() => {
    if (typeof window === 'undefined' || typeof performance === 'undefined') return;

    try {
      // Check for long tasks and memory pressure
      const now = performance.now();
      const memoryInfo = (performance as any).memory;
      
      if (memoryInfo) {
        const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
        const isOverloaded = memoryUsage > 0.8; // 80% memory usage threshold
        
        metricsRef.current.isOverloaded = isOverloaded;
        
        if (isOverloaded) {
          console.warn('[MobileGuard] High memory usage detected:', Math.round(memoryUsage * 100) + '%');
          
          // Trigger emergency cleanup
          if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(() => {
              // Force garbage collection if available
              if ('gc' in window && typeof (window as any).gc === 'function') {
                try {
                  (window as any).gc();
                } catch {}
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('[MobileGuard] Performance check error:', error);
    }
  }, []);

  // Initialize performance monitoring
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    if (!isMobile) return;

    // Initial assessment
    assessDeviceCapabilities();

    // Periodic health checks - less frequent on low-end devices
    const checkInterval = metricsRef.current.isLowEndDevice ? 30000 : 15000;
    
    performanceCheckRef.current = setInterval(checkPerformanceHealth, checkInterval);

    return () => {
      if (performanceCheckRef.current) {
        clearInterval(performanceCheckRef.current);
      }
    };
  }, [assessDeviceCapabilities, checkPerformanceHealth]);

  // Get current performance state
  const getPerformanceState = useCallback(() => {
    return { ...metricsRef.current };
  }, []);

  // Check if feature should be disabled for performance
  const shouldDisableFeature = useCallback((featureType: 'animation' | 'focus' | 'cursor' | 'interval') => {
    const { isLowEndDevice, isOverloaded, performanceScore } = metricsRef.current;
    
    if (isOverloaded) return true;
    
    switch (featureType) {
      case 'animation':
        return isLowEndDevice || performanceScore < 0.5;
      case 'focus':
        return isLowEndDevice || performanceScore < 0.4;
      case 'cursor':
        return isLowEndDevice || performanceScore < 0.6;
      case 'interval':
        return isLowEndDevice;
      default:
        return false;
    }
  }, []);

  return {
    getPerformanceState,
    shouldDisableFeature,
    isLowEndDevice: metricsRef.current.isLowEndDevice,
    isOverloaded: metricsRef.current.isOverloaded
  };
};