import { useCallback, useEffect, useRef, useState } from 'react';
import { throttle } from '@/utils/throttle';

interface ScrollDirection {
  isScrollingUp: boolean;
  isScrollingDown: boolean;
  scrollY: number;
}

export function useScrollDirection(element?: HTMLElement | null) {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>({
    isScrollingUp: false,
    isScrollingDown: false,
    scrollY: 0,
  });

  const lastScrollYRef = useRef(0);
  const isInitializedRef = useRef(false);

  const updateScrollDirection = useCallback(
    throttle(() => {
      try {
        const currentScrollY = element ? element.scrollTop : window.pageYOffset;
        
        if (!isInitializedRef.current) {
          lastScrollYRef.current = currentScrollY;
          isInitializedRef.current = true;
          return;
        }

        const difference = currentScrollY - lastScrollYRef.current;
        const threshold = 5; // Minimum scroll distance to register direction change

        if (Math.abs(difference) > threshold) {
          setScrollDirection({
            isScrollingUp: difference < 0,
            isScrollingDown: difference > 0,
            scrollY: currentScrollY,
          });
        }

        lastScrollYRef.current = currentScrollY;
      } catch (error) {
        console.error('Error in scroll direction tracking:', error);
      }
    }, 100),
    [element]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const targetElement = element || window;
    const eventName = element ? 'scroll' : 'scroll';

    try {
      targetElement.addEventListener(eventName, updateScrollDirection, { passive: true });
      
      // Initialize scroll position
      updateScrollDirection();

      return () => {
        targetElement.removeEventListener(eventName, updateScrollDirection);
      };
    } catch (error) {
      console.error('Error setting up scroll direction listener:', error);
    }
  }, [element, updateScrollDirection]);

  return scrollDirection;
}