import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { debounce } from '@/utils/throttle';

interface ViewportState {
  keyboardHeight: number;
  isKeyboardVisible: boolean;
  visualViewportHeight: number;
  windowHeight: number;
}

interface ViewportContextType extends ViewportState {
  registerKeyboardListener: (callback: (isVisible: boolean) => void) => () => void;
}

const ViewportContext = createContext<ViewportContextType | null>(null);

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ViewportState>(() => {
    // Safe initialization for SSR
    const safeHeight = typeof window !== 'undefined' ? (window.visualViewport?.height || window.innerHeight) : 768;
    
    return {
      keyboardHeight: 0,
      isKeyboardVisible: false,
      visualViewportHeight: safeHeight,
      windowHeight: safeHeight,
    };
  });

  const keyboardListeners = new Set<(isVisible: boolean) => void>();

  const updateViewport = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const windowHeight = window.innerHeight;
      const visualHeight = window.visualViewport?.height || windowHeight;
      const keyboardHeight = Math.max(0, windowHeight - visualHeight);
      
      // Device-specific keyboard detection thresholds
      const isTabletDevice = windowHeight >= 768 && windowHeight < 1024;
      const keyboardThreshold = isTabletDevice ? 150 : 50; // Lower threshold for better detection
      const isKeyboardVisible = keyboardHeight > keyboardThreshold;
      
      // Debug logging for keyboard positioning
      console.log('🔍 Viewport Debug:', {
        windowHeight,
        visualHeight,
        keyboardHeight,
        keyboardThreshold,
        isKeyboardVisible,
        isTabletDevice
      });

      setState(prev => {
        if (prev.isKeyboardVisible !== isKeyboardVisible) {
          keyboardListeners.forEach(listener => {
            try {
              listener(isKeyboardVisible);
            } catch (error) {
              console.error('Critical: Error in keyboard listener:', error);
            }
          });
        }
        
        return {
          keyboardHeight,
          isKeyboardVisible,
          visualViewportHeight: visualHeight,
          windowHeight,
        };
      });
    } catch (error) {
      console.error('Error updating viewport:', error);
    }
  }, []);

  const registerKeyboardListener = useCallback((callback: (isVisible: boolean) => void) => {
    keyboardListeners.add(callback);
    return () => keyboardListeners.delete(callback);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial state
    try {
      updateViewport();
    } catch (error) {
      console.error('Error during initial viewport update:', error);
    }

    // Focus/blur fallback for keyboard detection
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        setTimeout(updateViewport, 300); // Delay for keyboard animation
      }
    };

    const handleFocusOut = () => {
      setTimeout(updateViewport, 300); // Delay for keyboard animation
    };

    // Use visualViewport if available (more accurate)
    if (window.visualViewport) {
      try {
        window.visualViewport.addEventListener('resize', updateViewport, { passive: true });
        document.addEventListener('focusin', handleFocusIn, { passive: true });
        document.addEventListener('focusout', handleFocusOut, { passive: true });
        
        return () => {
          window.visualViewport?.removeEventListener('resize', updateViewport);
          document.removeEventListener('focusin', handleFocusIn);
          document.removeEventListener('focusout', handleFocusOut);
        };
      } catch (error) {
        console.error('Error setting up visualViewport listener:', error);
      }
    } else {
      // Fallback for older browsers
      try {
        window.addEventListener('resize', updateViewport, { passive: true });
        document.addEventListener('focusin', handleFocusIn, { passive: true });
        document.addEventListener('focusout', handleFocusOut, { passive: true });
        
        return () => {
          window.removeEventListener('resize', updateViewport);
          document.removeEventListener('focusin', handleFocusIn);
          document.removeEventListener('focusout', handleFocusOut);
        };
      } catch (error) {
        console.error('Error setting up window resize listener:', error);
      }
    }
  }, [updateViewport]);

  const contextValue: ViewportContextType = {
    ...state,
    registerKeyboardListener,
  };

  return (
    <ViewportContext.Provider value={contextValue}>
      {children}
    </ViewportContext.Provider>
  );
}

export function useViewport() {
  const context = useContext(ViewportContext);
  if (!context) {
    throw new Error('useViewport must be used within a ViewportProvider');
  }
  return context;
}