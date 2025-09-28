import { useEffect } from 'react';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';

/**
 * Ultra-lightweight mobile optimizations
 * CSS-only approach with minimal JavaScript overhead
 */
export const useLightweightMobile = () => {
  const { isMobile } = useOptimizedMobile();

  // Apply CSS-only mobile optimizations
  useEffect(() => {
    if (!isMobile) return;
    
    // Add mobile optimization classes to body - CSS handles everything
    document.body.classList.add('mobile-optimized');
    
    // iOS-specific optimizations
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      document.body.classList.add('ios-optimized');
    }
    
    return () => {
      document.body.classList.remove('mobile-optimized', 'ios-optimized');
    };
  }, [isMobile]);

  return { isMobile };
};