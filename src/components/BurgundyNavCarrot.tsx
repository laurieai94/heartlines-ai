import React, { useCallback, useState, useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';
import { useMobileHeaderVisibility } from '@/contexts/MobileHeaderVisibilityContext';
import { useViewport } from '@/contexts/ViewportContext';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';

interface BurgundyNavCarrotProps {
  isScrollingUp: boolean;
  onOpenNavigation?: () => void;
  onResetAvailability?: (resetFn: () => void) => void;
  scrollPosition?: number; // Current scroll position for reset logic
}

export const BurgundyNavCarrot = ({ isScrollingUp, onOpenNavigation, onResetAvailability, scrollPosition = 0 }: BurgundyNavCarrotProps) => {
  const { visible, forceVisible, navigationOpened } = useMobileHeaderVisibility();
  const { isKeyboardVisible } = useViewport();
  const { isMobile, isTablet } = useOptimizedMobile();
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasBeenUsed, setHasBeenUsed] = useState(false);
  
  // Refs to track state changes and timeouts
  const lastUsedTimeRef = useRef<number | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevNavigationOpenedRef = useRef(navigationOpened);
  const prevScrollPositionRef = useRef(scrollPosition);

  // Haptic feedback simulation
  const simulateHaptic = useCallback((element: HTMLElement) => {
    element.style.transform = 'scale(0.92)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 120);
  }, []);

  // Enhanced reset function with multiple triggers
  const resetAvailability = useCallback(() => {
    setHasBeenUsed(false);
    lastUsedTimeRef.current = null;
    
    // Clear any existing timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }
    
    console.log('[BurgundyNavCarrot] Availability reset');
  }, []);

  // Register reset function with parent
  useEffect(() => {
    onResetAvailability?.(resetAvailability);
  }, [onResetAvailability, resetAvailability]);

  // Reset when navigation closes
  useEffect(() => {
    const wasOpen = prevNavigationOpenedRef.current;
    const isNowOpen = navigationOpened;
    
    // Reset when navigation closes (was open, now closed)
    if (wasOpen && !isNowOpen && hasBeenUsed) {
      console.log('[BurgundyNavCarrot] Resetting due to navigation close');
      resetAvailability();
    }
    
    prevNavigationOpenedRef.current = isNowOpen;
  }, [navigationOpened, hasBeenUsed, resetAvailability]);

  // Reset after significant downward scroll (200px+)
  useEffect(() => {
    const prevScroll = prevScrollPositionRef.current;
    const currentScroll = scrollPosition;
    const scrollDelta = currentScroll - prevScroll;
    
    // If user scrolled down significantly (200px+) and tooltip was used
    if (scrollDelta > 200 && hasBeenUsed) {
      console.log('[BurgundyNavCarrot] Resetting due to significant downward scroll:', scrollDelta);
      resetAvailability();
    }
    
    prevScrollPositionRef.current = currentScroll;
  }, [scrollPosition, hasBeenUsed, resetAvailability]);

  // Auto-reset after 30 seconds of inactivity
  useEffect(() => {
    if (hasBeenUsed && lastUsedTimeRef.current) {
      // Clear any existing timeout
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
      
      // Set new timeout for 30 seconds
      resetTimeoutRef.current = setTimeout(() => {
        console.log('[BurgundyNavCarrot] Resetting due to timeout (30s)');
        resetAvailability();
      }, 30000);
    }
    
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    };
  }, [hasBeenUsed, resetAvailability]);

  // Show only when: mobile phone (not tablet) + scrolling up + navigation not opened + not been used
  const shouldShow = isMobile && !isTablet && isScrollingUp && !navigationOpened && !hasBeenUsed;
  
  if (!shouldShow) {
    return null;
  }

  const handleTap = async (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.currentTarget as HTMLElement;
    simulateHaptic(target);
    
    // Mark as used and record time
    setHasBeenUsed(true);
    lastUsedTimeRef.current = Date.now();
    console.log('[BurgundyNavCarrot] Used - starting reset timers');
    
    // Start fly-up animation
    setIsAnimating(true);
    
    // Trigger navigation
    forceVisible();
    onOpenNavigation?.();
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div 
      className={`fixed bottom-32 left-1/2 transform -translate-x-1/2 z-[999] 
                  bg-red-900 rounded-full p-3 shadow-lg cursor-pointer 
                  transition-all duration-300
                  ${isAnimating ? 'translate-y-[-200px] opacity-0' : 'hover:scale-105'}
                  active:scale-95`}
      onTouchStart={handleTap}
      onClick={handleTap}
      style={{
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        minWidth: '48px',
        minHeight: '48px'
      }}
    >
      <ChevronUp className="w-6 h-6 text-white" />
      <div className="sr-only">Tap to show navigation</div>
    </div>
  );
};