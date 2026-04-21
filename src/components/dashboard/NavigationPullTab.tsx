import FlipPhoneIcon from '../icons/FlipPhoneIcon';
import { useLocation } from 'react-router-dom';
import { useMobileHeaderVisibility } from '@/contexts/MobileHeaderVisibilityContext';
import { useKeyboardDetection } from '@/hooks/useKeyboardDetection';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';
import { useCallback } from 'react';

interface NavigationPullTabProps {
  onOpenNavigation?: () => void;
}

const NavigationPullTab = ({ onOpenNavigation }: NavigationPullTabProps) => {
  const location = useLocation();
  const { visible, forceVisible, setNavigationOpened } = useMobileHeaderVisibility();
  const isKeyboardVisible = useKeyboardDetection();
  const { isMobile } = useOptimizedMobile();

  // Only show on dashboard route
  const isDashboardRoute = location.pathname === '/';

  // Debounced handler to open navigation drawer
  const handleOpenNavigation = useCallback(() => {
    requestAnimationFrame(() => {
      forceVisible();
      setNavigationOpened(true);
      onOpenNavigation?.();
    });
  }, [forceVisible, setNavigationOpened, onOpenNavigation]);

  // Show when keyboard is visible OR header is hidden
  const shouldShow = isDashboardRoute && isMobile && (isKeyboardVisible || !visible);
  
  if (!shouldShow) {
    return null;
  }

  return (
    <div 
      className="fixed top-0 left-1/2 transform -translate-x-1/2 z-[55] bg-primary rounded-b-3xl px-12 py-6 shadow-2xl cursor-pointer active:scale-95 border-b-4 border-primary-foreground/40"
      onClick={handleOpenNavigation}
      style={{
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        minWidth: '80px',
        minHeight: '44px'
      }}
    >
      <FlipPhoneIcon className="h-20 w-20 text-primary-foreground drop-shadow-lg" />
      <div className="sr-only">Tap to show navigation</div>
      {/* Enhanced arrow pointer */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-primary drop-shadow-md"></div>
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-primary/20 rounded-b-3xl blur-xl -z-10"></div>
    </div>
  );
};

export default NavigationPullTab;