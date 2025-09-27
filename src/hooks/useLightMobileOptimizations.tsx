import { useEffect, useCallback, useState } from 'react';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';

/**
 * Lightweight mobile optimizations that won't cause freezing
 * Replaces the heavy useProfileMobileOptimizations hook
 */
export const useLightMobileOptimizations = () => {
  const { isMobile } = useOptimizedMobile();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Minimal haptic feedback - CSS only, no DOM manipulation
  const simulateHapticFeedback = useCallback((element: HTMLElement) => {
    if (!isMobile) return;
    
    // Use CSS transitions only - no classList manipulation
    element.style.transform = 'scale(0.98)';
    element.style.transition = 'transform 100ms ease-out';
    
    requestAnimationFrame(() => {
      element.style.transform = 'scale(1)';
      setTimeout(() => {
        element.style.transform = '';
        element.style.transition = '';
      }, 100);
    });
  }, [isMobile]);

  // Basic mobile CSS optimizations - set once, no observers
  useEffect(() => {
    if (!isMobile) return;

    // Add mobile optimization class once
    document.body.classList.add('mobile-optimized');

    return () => {
      document.body.classList.remove('mobile-optimized');
    };
  }, [isMobile]);

  return {
    isMobile,
    isRefreshing,
    setIsRefreshing,
    simulateHapticFeedback
  };
};