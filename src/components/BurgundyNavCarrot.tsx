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
  const [cooldownActive, setCooldownActive] = useState(false);

  // Haptic feedback simulation
  const simulateHaptic = useCallback((element: HTMLElement) => {
    element.style.transform = 'scale(0.92)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 120);
  }, []);

  // Simple cooldown to prevent spam tapping
  const startCooldown = useCallback(() => {
    setCooldownActive(true);
    setTimeout(() => {
      setCooldownActive(false);
    }, 2000); // 2 second cooldown
  }, []);

  // Show when: mobile phone (not tablet) + scrolling up + navigation not opened + not in cooldown
  const shouldShow = isMobile && !isTablet && isScrollingUp && !navigationOpened && !cooldownActive;
  
  if (!shouldShow) {
    return null;
  }

  const handleTap = async (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.currentTarget as HTMLElement;
    simulateHaptic(target);
    
    // Start cooldown and animation
    startCooldown();
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