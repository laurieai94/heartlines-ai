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

  // Only show pull tab on mobile when header is hidden and keyboard is visible
  if (!isMobile || visible || !isKeyboardVisible) {
    return null;
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setVisible(true);
    onOpenNavigation?.();
  };

  return (
    <div 
      className="fixed top-0 left-1/2 transform -translate-x-1/2 z-[60] bg-white/20 backdrop-blur-sm rounded-b-lg px-4 py-1 shadow-lg cursor-pointer active:bg-white/30 transition-all duration-200"
      onTouchStart={handleTouchStart}
      onClick={() => setVisible(true)}
      style={{
        touchAction: 'manipulation',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      <Menu className="w-4 h-4 text-white" />
      <div className="sr-only">Pull to show navigation</div>
    </div>
  );
};

export default NavigationPullTab;