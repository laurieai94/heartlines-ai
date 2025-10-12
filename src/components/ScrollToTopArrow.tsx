import { ArrowUp } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { useMobileHeaderVisibility } from '@/contexts/MobileHeaderVisibilityContext';
import { ChatMessage } from '@/types/AIInsights';

interface ScrollToTopArrowProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  chatHistory: ChatMessage[];
}

export const ScrollToTopArrow = ({ scrollContainerRef, chatHistory }: ScrollToTopArrowProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastScrollTopRef = useRef(0);
  const rafIdRef = useRef<number>();
  const userIsScrollingRef = useRef(false);
  const touchEndTimeoutRef = useRef<number>();
  const hasNewActivityRef = useRef(true);
  const { isMobile, isTablet } = useOptimizedMobile();
  const isMobilePhone = isMobile && !isTablet;
  const { forceVisible } = useMobileHeaderVisibility();

  useEffect(() => {
    if (!isMobilePhone || !scrollContainerRef.current || !buttonRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const button = buttonRef.current;

    // Track when user starts touching
    const handleTouchStart = () => {
      userIsScrollingRef.current = true;
      if (touchEndTimeoutRef.current) {
        clearTimeout(touchEndTimeoutRef.current);
      }
    };

    // Track when user stops touching (with delay for momentum)
    const handleTouchEnd = () => {
      // Keep flag true for 300ms to catch momentum scrolling
      touchEndTimeoutRef.current = window.setTimeout(() => {
        userIsScrollingRef.current = false;
      }, 300);
    };

    // Direct DOM manipulation for instant response
    const handleScroll = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const currentScrollTop = scrollContainer.scrollTop;
        const previousScrollTop = lastScrollTopRef.current;
        const isScrollingUp = currentScrollTop < previousScrollTop;
        const isAtTop = currentScrollTop <= 10;

        // When user reaches top, disable arrow until new activity
        if (isAtTop) {
          hasNewActivityRef.current = false;
          button.style.opacity = '0';
          button.style.pointerEvents = 'none';
          button.style.transform = 'translateY(10px)';
          lastScrollTopRef.current = currentScrollTop;
          return;
        }

        // CRITICAL: Only respond if user is actually scrolling
        if (!userIsScrollingRef.current) {
          lastScrollTopRef.current = currentScrollTop;
          return; // Ignore programmatic scrolls
        }

        // Show arrow only if user is scrolling up AND there's been new chat activity
        if (isScrollingUp && hasNewActivityRef.current) {
          button.style.opacity = '1';
          button.style.pointerEvents = 'auto';
          button.style.transform = 'translateY(0)';
        }

        lastScrollTopRef.current = currentScrollTop;
      });
    };

    // Add event listeners
    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    scrollContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchend', handleTouchEnd);
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (touchEndTimeoutRef.current) {
        clearTimeout(touchEndTimeoutRef.current);
      }
    };
  }, [isMobilePhone, scrollContainerRef]);

  // Track when new messages arrive (chat engagement)
  useEffect(() => {
    if (!isMobilePhone) return;
    
    // Set flag to true when chat history changes (new message sent/received)
    hasNewActivityRef.current = true;
  }, [chatHistory.length, isMobilePhone]);

  const handleClick = () => {
    if (!scrollContainerRef.current) return;

    // Reveal navigation
    forceVisible();

    // Scroll chat to top
    scrollContainerRef.current.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Scroll page to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isMobilePhone) return null;

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className="fixed bottom-24 right-4 rounded-full w-12 h-12 shadow-lg z-[999] 
                 bg-red-900 hover:bg-red-800 text-white
                 flex items-center justify-center
                 transition-opacity duration-100"
      style={{
        opacity: 0,
        pointerEvents: 'none',
        transform: 'translateY(10px)',
        transition: 'opacity 100ms ease-out, transform 100ms ease-out'
      }}
      aria-label="Scroll to top and show navigation"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
