import { useState, useEffect, useRef } from 'react';
import { throttle } from '@/utils/throttle';

interface ScrollDirectionState {
  isScrollingUp: boolean;
  isScrollingDown: boolean;
  scrollY: number;
}

export const useScrollDirection = (threshold = 10) => {
  const [scrollState, setScrollState] = useState<ScrollDirectionState>({
    isScrollingUp: false,
    isScrollingDown: false,
    scrollY: 0,
  });

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const updateScrollDirection = throttle(() => {
    const scrollY = window.scrollY;
    const difference = Math.abs(scrollY - lastScrollY.current);

    if (difference >= threshold) {
      const isScrollingUp = scrollY < lastScrollY.current;
      const isScrollingDown = scrollY > lastScrollY.current;

      setScrollState({
        isScrollingUp,
        isScrollingDown,
        scrollY,
      });
      
      lastScrollY.current = scrollY;
    }

    ticking.current = false;
  }, 100);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [updateScrollDirection]);

  return scrollState;
};