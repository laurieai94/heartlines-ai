import { useEffect, useCallback } from 'react';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { useViewport } from '@/contexts/ViewportContext';
import { useMobilePerformanceGuard } from '@/hooks/useMobilePerformanceGuard';

/**
 * Optimized mobile-specific enhancements
 * Lightweight version with CSS-first approach and minimal DOM manipulation
 */
export const useMobileOptimizations = () => {
  const { isMobile } = useOptimizedMobile();
  const { registerKeyboardListener } = useViewport();
  const { shouldDisableFeature } = useMobilePerformanceGuard();

  // Performance-aware haptic feedback simulation
  const simulateHapticFeedback = useCallback((element: HTMLElement, type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!isMobile || shouldDisableFeature('animation')) return;
    
    const intensity = {
      light: 'scale-[0.98]',
      medium: 'scale-[0.95]',
      heavy: 'scale-[0.92]'
    };
    
    element.classList.add('transition-transform', 'duration-75', intensity[type]);
    
    setTimeout(() => {
      element.classList.remove('transition-transform', 'duration-75', intensity[type]);
    }, 150);
  }, [isMobile, shouldDisableFeature]);

  // CSS-based touch optimization - no DOM manipulation needed
  useEffect(() => {
    if (!isMobile) return;
    
    // Add mobile optimization classes to body
    document.body.classList.add('mobile-optimized');
    
    return () => {
      document.body.classList.remove('mobile-optimized');
    };
  }, [isMobile]);

  // iOS scroll optimizations with centralized viewport handling
  useEffect(() => {
    if (!isMobile) return;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // Apply iOS scroll optimizations via CSS
      document.body.classList.add('ios-optimized');
      
      // Register for keyboard events through centralized viewport context
      const unregister = registerKeyboardListener((isKeyboardVisible) => {
        const profileContainer = document.querySelector('[data-profile-container]') as HTMLElement;
        if (profileContainer) {
          if (isKeyboardVisible) {
            profileContainer.style.paddingBottom = `calc(1.5rem + env(keyboard-inset-height, 0px) + env(safe-area-inset-bottom, 0px))`;
          } else {
            profileContainer.style.paddingBottom = '';
          }
        }
      });

      return () => {
        document.body.classList.remove('ios-optimized');
        unregister();
      };
    }
  }, [isMobile, registerKeyboardListener]);

  return {
    simulateHapticFeedback,
    isMobile
  };
};