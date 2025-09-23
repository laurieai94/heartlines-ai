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

  // DEBUG: Log all state variables
  console.log('🥕 Burgundy Carrot Debug:', {
    isMobile,
    isKeyboardVisible,
    isScrollingUp,
    headerVisible: visible,
    isAnimating,
    timestamp: Date.now()
  });

  // Haptic feedback simulation
  const simulateHaptic = useCallback((element: HTMLElement) => {
    element.style.transform = 'scale(0.92)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 120);
  }, []);

  // SIMPLIFIED CONDITIONS FOR DEBUGGING - Show on mobile when scrolling up OR keyboard visible
  const shouldShow = isMobile && (isScrollingUp || isKeyboardVisible || true); // Force show for now
  
  console.log('🥕 Should show carrot:', shouldShow);
  
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
      className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 z-[999] 
                  bg-red-600 backdrop-blur-md rounded-full p-4 shadow-2xl cursor-pointer 
                  transition-all duration-300 border-4 border-white
                  ${isAnimating ? 'translate-y-[-200px]' : 'animate-pulse hover:animate-none'}
                  active:bg-red-700 hover:scale-110`}
      onTouchStart={handleTap}
      onClick={handleTap}
      style={{
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        minWidth: '56px',
        minHeight: '56px'
      }}
    >
      <ChevronUp className="w-8 h-8 text-white drop-shadow-lg" />
      <div className="sr-only">Tap to show navigation</div>
      
      {/* Debug text */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-white bg-black px-2 py-1 rounded">
        DEBUG CARROT
      </div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-red-500/50 rounded-full blur-lg -z-10 animate-pulse"></div>
    </div>
  );
};