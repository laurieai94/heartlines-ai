import { useEffect, useState, useCallback } from 'react';
import { useViewport } from '@/contexts/ViewportContext';
import { useOptimizedMobile } from '@/hooks/useOptimizedMobile';

export const useKeyboardDetection = (): boolean => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [initialViewportHeight, setInitialViewportHeight] = useState<number>(0);
  const { isKeyboardVisible: viewportKeyboardVisible } = useViewport();
  const { isMobile } = useOptimizedMobile();

  // Use centralized viewport detection when available
  if (viewportKeyboardVisible !== undefined) {
    return viewportKeyboardVisible;
  }

  // Immediate keyboard detection via input focus
  const handleFocusIn = useCallback((e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      setIsKeyboardVisible(true);
    }
  }, []);

  const handleFocusOut = useCallback(() => {
    // Delay to prevent flicker when switching between inputs
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement;
      if (!activeElement || (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA')) {
        setIsKeyboardVisible(false);
      }
    }, 100);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsKeyboardVisible(false);
      return;
    }

    // Store initial viewport height
    setInitialViewportHeight(window.visualViewport?.height || window.innerHeight);

    // Add focus event listeners for immediate detection
    document.addEventListener('focusin', handleFocusIn, { passive: true });
    document.addEventListener('focusout', handleFocusOut, { passive: true });

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
      window.visualViewport.addEventListener('resize', handleViewportChange, { passive: true });
    } else {
      window.addEventListener('resize', handleViewportChange, { passive: true });
    }

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      } else {
        window.removeEventListener('resize', handleViewportChange);
      }
    };
  }, [isMobile, initialViewportHeight, handleFocusIn, handleFocusOut]);

  // Fallback to legacy detection
  return isKeyboardVisible;
};