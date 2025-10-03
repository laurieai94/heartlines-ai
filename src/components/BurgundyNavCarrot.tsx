import React, { useCallback, useState, useEffect, useRef } from 'react';
import { ChevronUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { visible, forceVisible, navigationOpened } = useMobileHeaderVisibility();
  const { isKeyboardVisible } = useViewport();
  const { isMobile, isTablet } = useOptimizedMobile();
  const [isAnimating, setIsAnimating] = useState(false);

  // Only show on dashboard route
  const isDashboardRoute = location.pathname === '/';

  // Haptic feedback simulation
  const simulateHaptic = useCallback((element: HTMLElement) => {
    element.style.transform = 'scale(0.92)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 120);
  }, []);

  // Simplified shouldShow logic - appears immediately on scroll up
  const shouldShow = isDashboardRoute &&
                    isMobile && 
                    !isTablet && 
                    isScrollingUp && 
                    scrollPosition > 20;
  
  if (!shouldShow) {
    return null;
  }

  const handleTap = async (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.currentTarget as HTMLElement;
    simulateHaptic(target);
    
    setIsAnimating(true);
    
    // Trigger navigation immediately
    forceVisible();
    onOpenNavigation?.();
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div 
      className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[999]
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