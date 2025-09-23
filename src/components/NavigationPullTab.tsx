import { Menu } from 'lucide-react';
import { useMobileHeaderVisibility } from '@/contexts/MobileHeaderVisibilityContext';
import { useKeyboardDetection } from '@/hooks/useKeyboardDetection';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavigationPullTabProps {
  onOpenNavigation?: () => void;
}

const NavigationPullTab = ({ onOpenNavigation }: NavigationPullTabProps) => {
  const { visible, setVisible } = useMobileHeaderVisibility();
  const isKeyboardVisible = useKeyboardDetection();
  const isMobile = useIsMobile();

  // Show pull tab on mobile when keyboard is visible (regardless of header visibility)
  if (!isMobile || !isKeyboardVisible) {
    return null;
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setVisible(true);
    onOpenNavigation?.();
  };

  return (
    <div 
      className="fixed top-0 left-1/2 transform -translate-x-1/2 z-[60] bg-primary/90 backdrop-blur-md rounded-b-2xl px-8 py-3 shadow-2xl cursor-pointer active:bg-primary transition-all duration-200 border-b-2 border-primary-foreground/30 animate-pulse"
      onTouchStart={handleTouchStart}
      onClick={() => setVisible(true)}
      style={{
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <Menu className="w-6 h-6 text-primary-foreground drop-shadow-sm" />
      <div className="sr-only">Tap to show navigation</div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary/90"></div>
    </div>
  );
};

export default NavigationPullTab;