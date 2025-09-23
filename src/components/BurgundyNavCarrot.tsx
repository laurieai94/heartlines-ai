import React, { useCallback, useState } from 'react';
import { ChevronUp } from 'lucide-react';
import { useMobileHeaderVisibility } from '@/contexts/MobileHeaderVisibilityContext';
import { useKeyboardDetection } from '@/hooks/useKeyboardDetection';
import { useIsMobile } from '@/hooks/use-mobile';

interface BurgundyNavCarrotProps {
  isScrollingUp: boolean;
  onOpenNavigation?: () => void;
}

export const BurgundyNavCarrot = ({ isScrollingUp, onOpenNavigation }: BurgundyNavCarrotProps) => {
  const { visible, forceVisible } = useMobileHeaderVisibility();
  const isKeyboardVisible = useKeyboardDetection();
  const isMobile = useIsMobile();
  const [isAnimating, setIsAnimating] = useState(false);

  // Haptic feedback simulation
  const simulateHaptic = useCallback((element: HTMLElement) => {
    element.style.transform = 'scale(0.92)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 120);
  }, []);

  // Show only when: mobile + keyboard visible + scrolling up + header not visible
  const shouldShow = isMobile && isKeyboardVisible && isScrollingUp && !visible && !isAnimating;
  
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
    console.log('🥕 Burgundy carrot tapped - flying up to reveal navigation');
    forceVisible();
    onOpenNavigation?.();
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <div 
      className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[70] 
                  bg-burgundy-600 backdrop-blur-md rounded-full p-3 shadow-2xl cursor-pointer 
                  transition-all duration-300 border-2 border-burgundy-500/60
                  ${isAnimating ? 'animate-[slide-up_0.6s_ease-out_forwards]' : 'animate-pulse hover:animate-none'}
                  active:bg-burgundy-700`}
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
      <ChevronUp className="w-6 h-6 text-white drop-shadow-lg" />
      <div className="sr-only">Tap to show navigation</div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-burgundy-500/30 rounded-full blur-lg -z-10 animate-pulse"></div>
      
      {/* Animated ring indicator */}
      <div className="absolute inset-0 rounded-full border-2 border-burgundy-400/40 animate-ping"></div>
    </div>
  );
};