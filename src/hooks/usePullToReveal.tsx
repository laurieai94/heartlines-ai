import { useEffect, useRef, useState } from 'react';
import { useMobileHeaderVisibility } from '@/contexts/MobileHeaderVisibilityContext';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';

interface PullToRevealOptions {
  threshold?: number;
  velocityThreshold?: number;
  enabled?: boolean;
}

export const usePullToReveal = (options: PullToRevealOptions = {}) => {
  const {
    threshold = 30, // Lowered from 50px for easier access
    velocityThreshold = 0.3, // Lowered for more responsive activation
    enabled = true
  } = options;

  const { isMobile } = useOptimizedMobile();
  const { visible, setVisible } = useMobileHeaderVisibility();
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const touchStartRef = useRef<{ y: number; time: number } | null>(null);
  const touchMoveRef = useRef<{ y: number; time: number } | null>(null);
  const isAtTopRef = useRef(true);
  const scrollElementRef = useRef<HTMLElement | null>(null);

  // Set scroll element reference
  const setScrollElement = (element: HTMLElement | null) => {
    scrollElementRef.current = element;
  };

  // Track if user is at top of scroll area
  const updateScrollPosition = (scrollTop: number) => {
    isAtTopRef.current = scrollTop === 0;
    
    // Auto-show header when at top
    if (isAtTopRef.current && !visible) {
      setVisible(true);
    }
  };

  useEffect(() => {
    if (!enabled || !isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      // Early exit if not at top - prevents any processing
      if (!isAtTopRef.current) return;
      
      const touch = e.touches[0];
      if (!touch) return;

      touchStartRef.current = {
        y: touch.clientY,
        time: Date.now()
      };
      
      setIsPulling(false);
      setPullDistance(0);
    };

    const handleTouchMove = (e: TouchEvent) => {
      // Early exit if not at top - prevents any processing
      if (!isAtTopRef.current) return;
      
      const touch = e.touches[0];
      if (!touch || !touchStartRef.current) return;

      const currentY = touch.clientY;
      const startY = touchStartRef.current.y;
      const deltaY = currentY - startY;
      const currentTime = Date.now();

      touchMoveRef.current = {
        y: currentY,
        time: currentTime
      };

      // Only capture touches when at exact scroll top with minimum pull
      const isPullingDown = deltaY > 0;
      
      // ONLY intercept if scroll position is exactly 0 and significant pull
      if (isPullingDown && deltaY > 15) {
        setIsPulling(true);
        setPullDistance(Math.min(deltaY, threshold * 2));
        
        // Show header after sufficient pull
        if (deltaY > threshold / 2 && !visible) {
          setVisible(true);
        }
      }
    };

    const handleTouchEnd = () => {
      // Early exit if not at top - prevents any processing
      if (!isAtTopRef.current) {
        touchStartRef.current = null;
        touchMoveRef.current = null;
        return;
      }
      
      if (!touchStartRef.current || !touchMoveRef.current) {
        setIsPulling(false);
        setPullDistance(0);
        return;
      }

      const startY = touchStartRef.current.y;
      const endY = touchMoveRef.current.y;
      const deltaY = endY - startY;
      const deltaTime = touchMoveRef.current.time - touchStartRef.current.time;
      const velocity = deltaTime > 0 ? deltaY / deltaTime : 0;

      const isPullingDown = deltaY > 0;
      const exceededThreshold = deltaY > threshold;
      const exceededVelocity = velocity > velocityThreshold;

      // Only reveal if truly at top
      if (isPullingDown) {
        if (exceededThreshold || exceededVelocity) {
          setVisible(true);
        }
      }

      // Reset pull state
      setIsPulling(false);
      setPullDistance(0);
      touchStartRef.current = null;
      touchMoveRef.current = null;
    };

    // Add touch event listeners to document
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    document.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [enabled, isMobile, threshold, velocityThreshold, visible, setVisible]);

  // Enhanced scroll-based header visibility - more responsive
  const handleScroll = (scrollTop: number, scrollDirection: 'up' | 'down' | null) => {
    updateScrollPosition(scrollTop);
    
    if (!isMobile) return;

    // Keep header always visible - no hiding on scroll down
    if (scrollDirection === 'up' && scrollTop > 50) {
      setVisible(true);
    }
    // Removed the scroll-down hiding logic
  };

  return {
    isPulling,
    pullDistance,
    setScrollElement,
    handleScroll,
    headerVisible: visible,
    setHeaderVisible: setVisible
  };
};