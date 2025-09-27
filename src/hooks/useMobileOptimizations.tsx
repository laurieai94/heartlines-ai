import { useEffect, useCallback } from 'react';
import { useLightMobileGuard } from './useLightMobileGuard';
import { useOptimizedMobile } from './useOptimizedMobile';
import { useOptimizedEventListener } from './useOptimizedEventListener';
import { mobileOptimizer, optimizeTouchElement } from '@/utils/mobileOptimizer';

/**
 * Lightweight mobile optimizations that prevent freezing
 * Minimal DOM manipulation and no heavy observers
 */
export const useMobileOptimizations = () => {
  const { isMobile } = useOptimizedMobile();
  const { shouldDisableFeature } = useLightMobileGuard();

  // Optimized haptic feedback using mobile optimizer
  const simulateHapticFeedback = useCallback((element: HTMLElement, type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!isMobile || shouldDisableFeature('animation')) return;

    // Optimize touch element first
    optimizeTouchElement(element);

    const intensities = {
      light: { scale: 0.98, duration: 75 },
      medium: { scale: 0.95, duration: 100 },
      heavy: { scale: 0.92, duration: 150 }
    };

    const intensity = intensities[type];
    element.style.transform = `scale(${intensity.scale})`;
    element.style.transition = `transform ${intensity.duration}ms ease-out`;

    mobileOptimizer.createOptimizedRAF(() => {
      element.style.transform = 'scale(1)';
      mobileOptimizer.createOptimizedTimeout(() => {
        element.style.transform = '';
        element.style.transition = '';
      }, intensity.duration);
    });
  }, [isMobile, shouldDisableFeature]);

  // Minimal mobile CSS optimizations - set once, no observers
  useEffect(() => {
    if (!isMobile) return;

    document.body.classList.add('mobile-optimized');
    return () => document.body.classList.remove('mobile-optimized');
  }, [isMobile]);

  // Basic iOS optimizations without aggressive viewport handling
  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (!isIOS || !isMobile) return;

    document.body.classList.add('ios-optimized');
    return () => document.body.classList.remove('ios-optimized');
  }, [isMobile]);

  return {
    simulateHapticFeedback,
    isMobile,
    mobileOptimizer
  };
};