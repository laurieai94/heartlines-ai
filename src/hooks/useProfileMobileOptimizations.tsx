import { useEffect, useCallback, useRef, useState } from 'react';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';

/**
 * Mobile-specific optimizations for profile pages
 * Handles performance, touch interactions, and pull-to-refresh for profile components
 */
export const useProfileMobileOptimizations = () => {
  const { isMobile } = useOptimizedMobile();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const touchStartY = useRef<number>(0);
  const pullToRefreshThreshold = 60;

  // Enhanced haptic feedback for profile interactions
  const simulateProfileFeedback = useCallback((element: HTMLElement, type: 'complete' | 'start' | 'touch' = 'touch') => {
    if (!isMobile) return;
    
    const effects = {
      complete: { scale: 'scale-[1.02]', duration: 200 },
      start: { scale: 'scale-[0.98]', duration: 100 },
      touch: { scale: 'scale-[0.99]', duration: 75 }
    };
    
    const effect = effects[type];
    element.classList.add('transition-transform', `duration-${effect.duration}`, effect.scale);
    
    setTimeout(() => {
      element.classList.remove('transition-transform', `duration-${effect.duration}`, effect.scale);
    }, effect.duration);
  }, [isMobile]);

  // Optimize card rendering with intersection observer
  const observeProfileCards = useCallback((callback: (entries: IntersectionObserverEntry[]) => void) => {
    if (!isMobile) return;
    
    intersectionObserverRef.current = new IntersectionObserver(
      (entries) => {
        callback(entries);
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );
    
    return intersectionObserverRef.current;
  }, [isMobile]);

  // Pull-to-refresh functionality
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!isMobile || window.scrollY > 0) return;
    touchStartY.current = e.touches[0].clientY;
  }, [isMobile]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isMobile || window.scrollY > 0 || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const pullDistance = currentY - touchStartY.current;
    
    if (pullDistance > pullToRefreshThreshold) {
      // Visual feedback for pull-to-refresh
      const refreshIndicator = document.querySelector('[data-refresh-indicator]');
      if (refreshIndicator) {
        (refreshIndicator as HTMLElement).style.opacity = '1';
        (refreshIndicator as HTMLElement).style.transform = `translateY(${Math.min(pullDistance - pullToRefreshThreshold, 20)}px)`;
      }
    }
  }, [isMobile, isRefreshing]);

  const handleTouchEnd = useCallback((e: TouchEvent, onRefresh?: () => Promise<void>) => {
    if (!isMobile || window.scrollY > 0 || isRefreshing) return;
    
    const currentY = e.changedTouches[0].clientY;
    const pullDistance = currentY - touchStartY.current;
    
    if (pullDistance > pullToRefreshThreshold && onRefresh) {
      setIsRefreshing(true);
      onRefresh().finally(() => {
        setIsRefreshing(false);
        // Reset visual indicator
        const refreshIndicator = document.querySelector('[data-refresh-indicator]');
        if (refreshIndicator) {
          (refreshIndicator as HTMLElement).style.opacity = '0';
          (refreshIndicator as HTMLElement).style.transform = 'translateY(0)';
        }
      });
    } else {
      // Reset visual indicator
      const refreshIndicator = document.querySelector('[data-refresh-indicator]');
      if (refreshIndicator) {
        (refreshIndicator as HTMLElement).style.opacity = '0';
        (refreshIndicator as HTMLElement).style.transform = 'translateY(0)';
      }
    }
  }, [isMobile, isRefreshing]);

  // Enhanced touch target optimization for profile components
  useEffect(() => {
    if (!isMobile) return;
    
    const optimizeProfileTouchTargets = () => {
      // Focus on profile-specific interactive elements
      const profileElements = document.querySelectorAll(
        '[data-profile-card] button, [data-onboarding-nudge] button, .profile-card button, .onboarding-step-nudge button'
      );
      
      profileElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const rect = htmlElement.getBoundingClientRect();
        
        // Ensure minimum touch target size
        if (rect.width < 44 || rect.height < 44) {
          htmlElement.style.minHeight = '44px';
          htmlElement.style.minWidth = '44px';
          // Add specific mobile touch improvements
          htmlElement.style.touchAction = 'manipulation';
          htmlElement.classList.add('flex', 'items-center', 'justify-center');
        }
      });
    };

    optimizeProfileTouchTargets();
    
    const observer = new MutationObserver(optimizeProfileTouchTargets);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'data-profile-card', 'data-onboarding-nudge']
    });
    
    return () => observer.disconnect();
  }, [isMobile]);

  // Optimize profile animations for mobile performance
  useEffect(() => {
    if (!isMobile) return;
    
    const profileCards = document.querySelectorAll('[data-profile-card], .profile-card');
    
    profileCards.forEach((card) => {
      const htmlCard = card as HTMLElement;
      // Reduce motion on mobile for better performance
      htmlCard.style.setProperty('--motion-reduce', 'reduce');
      // Optimize transforms for mobile
      htmlCard.style.willChange = 'transform';
      htmlCard.style.backfaceVisibility = 'hidden';
    });
  }, [isMobile]);

  // Keyboard handling for mobile
  useEffect(() => {
    if (!isMobile) return;
    
    const handleVisualViewportChange = () => {
      // Adjust layout when virtual keyboard appears
      const viewport = window.visualViewport;
      if (viewport) {
        const profileContainer = document.querySelector('[data-profile-container]');
        if (profileContainer) {
          (profileContainer as HTMLElement).style.height = `${viewport.height}px`;
        }
      }
    };
    
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleVisualViewportChange);
      };
    }
  }, [isMobile]);

  // Memory optimization for mobile
  useEffect(() => {
    if (!isMobile) return;
    
    // Debounce expensive operations
    let timeoutId: NodeJS.Timeout;
    
    const debouncedOptimization = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        // Clean up unused elements
        const hiddenElements = document.querySelectorAll('[data-profile-hidden]');
        hiddenElements.forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      }, 1000);
    };
    
    window.addEventListener('scroll', debouncedOptimization, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', debouncedOptimization);
      clearTimeout(timeoutId);
    };
  }, [isMobile]);

  return {
    isMobile,
    isRefreshing,
    simulateProfileFeedback,
    observeProfileCards,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    pullToRefreshThreshold
  };
};