import { useEffect, useCallback } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Mobile-specific optimizations for chat interface
 * Handles haptic feedback simulation, touch target improvements, and performance optimizations
 */
export const useMobileOptimizations = () => {
  const isMobile = useIsMobile();

  // Simulated haptic feedback through visual feedback
  const simulateHapticFeedback = useCallback((element: HTMLElement, type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!isMobile) return;
    
    const intensity = {
      light: 'scale-[0.98]',
      medium: 'scale-[0.95]',
      heavy: 'scale-[0.92]'
    };
    
    element.classList.add('transition-transform', 'duration-75', intensity[type]);
    
    setTimeout(() => {
      element.classList.remove('transition-transform', 'duration-75', intensity[type]);
    }, 150);
  }, [isMobile]);

  // Optimize touch target sizes
  useEffect(() => {
    if (!isMobile) return;
    
    const optimizeTouchTargets = () => {
      // Ensure minimum 44px touch targets on mobile
      const interactiveElements = document.querySelectorAll('button, [role="button"], a, input, textarea, select');
      
      interactiveElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const rect = htmlElement.getBoundingClientRect();
        
        // Add padding if touch target is too small
        if (rect.width < 44 || rect.height < 44) {
          htmlElement.style.minHeight = '44px';
          htmlElement.style.minWidth = '44px';
          htmlElement.classList.add('flex', 'items-center', 'justify-center');
        }
      });
    };

    // Run on mount and when DOM changes
    optimizeTouchTargets();
    
    const observer = new MutationObserver(optimizeTouchTargets);
    observer.observe(document.body, { childList: true, subtree: true });
    
    return () => observer.disconnect();
  }, [isMobile]);

  // Optimize scroll momentum for iOS
  useEffect(() => {
    if (!isMobile) return;
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // Add momentum scrolling to all scrollable elements
      const scrollableElements = document.querySelectorAll('[data-radix-scroll-area-viewport], .overflow-auto, .overflow-y-auto');
      
      scrollableElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        // Use setProperty for webkit-specific CSS properties
        htmlElement.style.setProperty('-webkit-overflow-scrolling', 'touch');
        htmlElement.style.overscrollBehavior = 'contain';
      });
    }
  }, [isMobile]);

  return {
    simulateHapticFeedback,
    isMobile
  };
};