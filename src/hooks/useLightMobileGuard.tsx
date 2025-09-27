import { useEffect, useRef, useCallback } from 'react';

interface LightPerformanceMetrics {
  isLowEndDevice: boolean;
  shouldOptimize: boolean;
}

/**
 * Lightweight performance guard that detects device capabilities
 * without aggressive monitoring that causes freezing
 */
export const useLightMobileGuard = () => {
  const metricsRef = useRef<LightPerformanceMetrics>({
    isLowEndDevice: false,
    shouldOptimize: false
  });

  // One-time device assessment on mount
  useEffect(() => {
    const assessDevice = () => {
      if (typeof window === 'undefined') return;

      const isMobile = window.innerWidth <= 768;
      if (!isMobile) {
        metricsRef.current = { isLowEndDevice: false, shouldOptimize: false };
        return;
      }

      try {
        // Simple device capability check
        const memory = (navigator as any).deviceMemory;
        const cores = navigator.hardwareConcurrency || 1;
        
        // Conservative assessment - optimize for most mobile devices
        const isLowEndDevice = memory ? memory <= 2 : true; // Assume low-end if unknown
        const shouldOptimize = isMobile; // Always optimize on mobile
        
        metricsRef.current = { isLowEndDevice, shouldOptimize };
        
        // Add device class for CSS optimizations
        if (shouldOptimize) {
          document.body.classList.add('mobile-performance-mode');
        }
        if (isLowEndDevice) {
          document.body.classList.add('low-end-device');
        }
      } catch (error) {
        // Fallback - assume optimization needed
        metricsRef.current = { isLowEndDevice: true, shouldOptimize: true };
        document.body.classList.add('mobile-performance-mode', 'low-end-device');
      }
    };

    assessDevice();
  }, []);

  // Simple feature check without aggressive monitoring
  const shouldDisableFeature = useCallback((featureType: 'animation' | 'observer' | 'heavy') => {
    const { isLowEndDevice, shouldOptimize } = metricsRef.current;
    
    switch (featureType) {
      case 'animation':
        return isLowEndDevice;
      case 'observer':
        return shouldOptimize; // Disable observers on all mobile
      case 'heavy':
        return shouldOptimize;
      default:
        return false;
    }
  }, []);

  return {
    shouldDisableFeature,
    isLowEndDevice: metricsRef.current.isLowEndDevice,
    shouldOptimize: metricsRef.current.shouldOptimize
  };
};