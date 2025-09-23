import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const useKeyboardDetection = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [initialViewportHeight, setInitialViewportHeight] = useState<number>(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setIsKeyboardVisible(false);
      return;
    }

    // Store initial viewport height
    setInitialViewportHeight(window.visualViewport?.height || window.innerHeight);

    const handleViewportChange = () => {
      if (!window.visualViewport) {
        // Fallback for browsers without visualViewport API
        const currentHeight = window.innerHeight;
        const heightDifference = initialViewportHeight - currentHeight;
        setIsKeyboardVisible(heightDifference > 150); // 150px threshold for keyboard
        return;
      }

      const heightRatio = window.visualViewport.height / initialViewportHeight;
      setIsKeyboardVisible(heightRatio < 0.75); // Keyboard visible if viewport shrunk by more than 25%
    };

    // Use visualViewport API if available, otherwise use resize
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
      };
    } else {
      window.addEventListener('resize', handleViewportChange);
      return () => {
        window.removeEventListener('resize', handleViewportChange);
      };
    }
  }, [isMobile, initialViewportHeight]);

  return isKeyboardVisible;
};