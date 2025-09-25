import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';

/**
 * EMERGENCY DISABLED VERSION of mobile optimizations
 * This hook is temporarily disabled to resolve performance issues
 * Once the "Page Unresponsive" errors are resolved, we can re-enable optimizations
 */
export const useProfileMobileOptimizations = () => {
  const { isMobile } = useOptimizedMobile();

  // Return minimal interface with same signatures to prevent breaking existing code
  return {
    isMobile,
    isRefreshing: false,
    simulateProfileFeedback: (element: HTMLElement, type?: 'complete' | 'start' | 'touch') => {
      // Disabled - no operation
    },
    observeProfileCards: (callback: (entries: IntersectionObserverEntry[]) => void) => {
      // Disabled - return null
      return null;
    },
    handleTouchStart: (e: TouchEvent) => {
      // Disabled - no operation
    },
    handleTouchMove: (e: TouchEvent) => {
      // Disabled - no operation
    },
    handleTouchEnd: (e: TouchEvent, onRefresh?: () => Promise<void>) => {
      // Disabled - no operation
    },
    pullToRefreshThreshold: 60
  };
};