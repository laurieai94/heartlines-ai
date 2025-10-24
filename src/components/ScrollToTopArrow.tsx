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
  const hideTimeoutRef = useRef<number>();
  const hasNewActivityRef = useRef(true);
  const isProgrammaticScrollRef = useRef(false);
  const prevChatLengthRef = useRef(chatHistory.length);
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
      // Keep flag true for 1500ms to give user time to tap arrow
      touchEndTimeoutRef.current = window.setTimeout(() => {
        userIsScrollingRef.current = false;
      }, 1500);
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

        // When user reaches top, hide arrow
        if (isAtTop) {
          button.style.opacity = '0';
          button.style.pointerEvents = 'none';
          button.style.transform = 'translateY(10px)';
          lastScrollTopRef.current = currentScrollTop;
          return;
        }

        // Show arrow ONLY when user manually scrolls up (not programmatic)
        if (isScrollingUp && 
            currentScrollTop > 100 && 
            userIsScrollingRef.current && 
            !isProgrammaticScrollRef.current) {
          // Cancel any pending hide timer
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
          }
          button.style.opacity = '1';
          button.style.pointerEvents = 'auto';
          button.style.transform = 'translateY(0)';
        }

        // Hide arrow when scrolling down (with 2-second delay)
        if (!isScrollingUp && currentScrollTop > 100 && !userIsScrollingRef.current) {
          // Cancel any previous hide timer
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
          }
          
          // Start new hide timer - gives user 2 seconds to tap
          hideTimeoutRef.current = window.setTimeout(() => {
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
            button.style.transform = 'translateY(10px)';
          }, 2000);
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
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isMobilePhone, scrollContainerRef]);

  // Track when new messages arrive (chat engagement)
  useEffect(() => {
    if (!isMobilePhone) return;
    
    const hasNewMessage = chatHistory.length > prevChatLengthRef.current;
    
    if (hasNewMessage) {
      // Mark as programmatic scroll for next 1 second
      isProgrammaticScrollRef.current = true;
      
      // Clear flag after auto-scroll completes
      setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 1000);
    }
    
    prevChatLengthRef.current = chatHistory.length;
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
      className="fixed bottom-24 right-4 rounded-full w-14 h-14 shadow-lg z-[999] 
                 bg-gradient-to-br from-pink-500 to-coral-500 hover:from-pink-400 hover:to-coral-400 
                 text-white flex items-center justify-center
                 ring-2 ring-pink-400/30 shadow-[0_0_20px_rgba(236,72,153,0.3)]
                 transition-all duration-200"
      style={{
        opacity: 0,
        pointerEvents: 'none',
        transform: 'translateY(10px)',
        transition: 'opacity 100ms ease-out, transform 100ms ease-out'
      }}
      aria-label="Scroll to top and show navigation"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
};
