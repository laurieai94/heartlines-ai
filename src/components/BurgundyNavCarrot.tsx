import React, { useCallback, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { useMobileHeaderVisibility } from '@/contexts/MobileHeaderVisibilityContext';
import { useViewport } from '@/contexts/ViewportContext';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';

interface BurgundyNavCarrotProps {
  isScrollingUp: boolean;
  onOpenNavigation?: () => void;
}

export const BurgundyNavCarrot = ({ isScrollingUp, onOpenNavigation }: BurgundyNavCarrotProps) => {
  const { visible, forceVisible } = useMobileHeaderVisibility();
  const { isKeyboardVisible } = useViewport();
  const { isMobile } = useOptimizedMobile();
  const [isAnimating, setIsAnimating] = useState(false);

  // Haptic feedback simulation
  const simulateHaptic = useCallback((element: HTMLElement) => {
    element.style.transform = 'scale(0.92)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 120);
  }, []);

  // Show only when: mobile + keyboard visible + scrolling up
  const shouldShow = isMobile && isKeyboardVisible && isScrollingUp;
  
  if (!shouldShow) {
    return null;
  }

  const handleTap = async (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.currentTarget as HTMLElement;
    simulateHaptic(target);
    
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