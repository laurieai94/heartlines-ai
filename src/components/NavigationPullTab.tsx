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
      className="fixed top-0 left-1/2 transform -translate-x-1/2 z-[60] bg-primary/80 backdrop-blur-sm rounded-b-xl px-6 py-2 shadow-lg cursor-pointer active:bg-primary/90 transition-all duration-200 border-b border-primary-foreground/20"
      onTouchStart={handleTouchStart}
      onClick={() => setVisible(true)}
      style={{
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <Menu className="w-5 h-5 text-primary-foreground" />
      <div className="sr-only">Tap to show navigation</div>
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-primary/80"></div>
    </div>
  );
};

export default NavigationPullTab;