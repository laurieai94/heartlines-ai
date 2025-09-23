import { useEffect, useRef, useState } from 'react';
import { useMobileHeaderVisibility } from '@/contexts/MobileHeaderVisibilityContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface PullToRevealOptions {
  threshold?: number;
  velocityThreshold?: number;
  enabled?: boolean;
}

export const usePullToReveal = (options: PullToRevealOptions = {}) => {
  const {
    threshold = 20, // Very small threshold - only at absolute top
    velocityThreshold = 0.5, // Higher threshold to prevent accidental triggers
    enabled = true
  } = options;

  const isMobile = useIsMobile();
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
    isAtTopRef.current = scrollTop <= 10;
    
    // Auto-show header when at top
    if (isAtTopRef.current && !visible) {
      setVisible(true);
    }
  };

  useEffect(() => {
    if (!enabled || !isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;

      // Only activate pull-to-reveal at the very top of the screen
      const isAtVeryTop = touch.clientY < 30 && isAtTopRef.current;
      if (!isAtVeryTop) return;

      touchStartRef.current = {
        y: touch.clientY,
        time: Date.now()
      };
      setIsPulling(false);
      setPullDistance(0);
    };

    const handleTouchMove = (e: TouchEvent) => {
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

      // Only respond to deliberate downward pulls from the very top
      const isPullingDown = deltaY > 10; // Require more deliberate movement
      
      if (isPullingDown && isAtTopRef.current) {
        setIsPulling(true);
        setPullDistance(Math.min(deltaY, threshold * 1.5));
        
        if (deltaY > threshold && !visible) {
          setVisible(true);
        }
      }
    };

    const handleTouchEnd = () => {
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

      const isPullingDown = deltaY > 10;
      const exceededThreshold = deltaY > threshold;
      const exceededVelocity = velocity > velocityThreshold;

      // Only reveal header for deliberate pulls from the very top
      if (isAtTopRef.current && isPullingDown) {
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

    // More responsive scroll-based visibility logic
    if (scrollDirection === 'up' && scrollTop > 50) { // Reduced from 100px
      setVisible(true);
    } else if (scrollDirection === 'down' && scrollTop > 150) { // Reduced from 200px
      // Only hide if not currently pulling and not near top
      if (!isPulling && scrollTop > 100) {
        setVisible(false);
      }
    }
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