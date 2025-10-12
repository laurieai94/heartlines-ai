import { ArrowUp } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { useMobileHeaderVisibility } from '@/contexts/MobileHeaderVisibilityContext';

interface ScrollToTopArrowProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export const ScrollToTopArrow = ({ scrollContainerRef }: ScrollToTopArrowProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const lastScrollTopRef = useRef(0);
  const rafIdRef = useRef<number>();
  const { isMobile, isTablet } = useOptimizedMobile();
  const isMobilePhone = isMobile && !isTablet;
  const { forceVisible } = useMobileHeaderVisibility();

  useEffect(() => {
    if (!isMobilePhone || !scrollContainerRef.current || !buttonRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const button = buttonRef.current;

    // Direct DOM manipulation for instant response
    const handleScroll = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        const currentScrollTop = scrollContainer.scrollTop;
        const isScrolledDown = currentScrollTop > 50;

        // Show arrow whenever scrolled down, hide when at top
        if (isScrolledDown) {
          button.style.opacity = '1';
          button.style.pointerEvents = 'auto';
          button.style.transform = 'translateY(0)';
        } else {
          button.style.opacity = '0';
          button.style.pointerEvents = 'none';
          button.style.transform = 'translateY(10px)';
        }

        lastScrollTopRef.current = currentScrollTop;
      });
    };

    // Add scroll listener with passive for performance
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [isMobilePhone, scrollContainerRef]);

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
