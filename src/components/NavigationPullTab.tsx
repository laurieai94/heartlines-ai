import { Menu } from 'lucide-react';
import { useMobileHeaderVisibility } from '@/contexts/MobileHeaderVisibilityContext';
import { useKeyboardDetection } from '@/hooks/useKeyboardDetection';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavigationPullTabProps {
  onOpenNavigation?: () => void;
}

const NavigationPullTab = ({ onOpenNavigation }: NavigationPullTabProps) => {
  const { visible, setVisible, forceVisible } = useMobileHeaderVisibility();
  const isKeyboardVisible = useKeyboardDetection();
  const isMobile = useIsMobile();

  // Show pull tab on mobile when keyboard is visible (regardless of header visibility)
  if (!isMobile || !isKeyboardVisible) {
    return null;
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('📱 Pull tab touched - forcing header visible');
    forceVisible();
    onOpenNavigation?.();
  };

  return (
    <div 
      className="fixed top-0 left-1/2 transform -translate-x-1/2 z-[60] bg-primary backdrop-blur-md rounded-b-3xl px-10 py-4 shadow-2xl cursor-pointer active:bg-primary/80 transition-all duration-200 border-b-4 border-primary-foreground/40 animate-bounce"
      onTouchStart={handleTouchStart}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('📱 Pull tab clicked - forcing header visible');
        forceVisible();
        onOpenNavigation?.();
      }}
      style={{
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <Menu className="w-7 h-7 text-primary-foreground drop-shadow-lg" />
      <div className="sr-only">Tap to show navigation</div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-primary"></div>
    </div>
  );
};

export default NavigationPullTab;