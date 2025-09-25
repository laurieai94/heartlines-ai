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
  const [state, setState] = useState<ViewportState>({
    keyboardHeight: 0,
    isKeyboardVisible: false,
    visualViewportHeight: typeof window !== 'undefined' ? (window.visualViewport?.height || window.innerHeight) : 0,
    windowHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const keyboardListeners = new Set<(isVisible: boolean) => void>();

  const updateViewport = useCallback(
    debounce(() => {
      if (typeof window === 'undefined') return;

      const windowHeight = window.innerHeight;
      const visualHeight = window.visualViewport?.height || windowHeight;
      const keyboardHeight = Math.max(0, windowHeight - visualHeight);
      const isKeyboardVisible = keyboardHeight > 50; // Threshold for keyboard detection

      setState(prev => {
        if (prev.isKeyboardVisible !== isKeyboardVisible) {
          keyboardListeners.forEach(listener => listener(isKeyboardVisible));
        }
        
        return {
          keyboardHeight,
          isKeyboardVisible,
          visualViewportHeight: visualHeight,
          windowHeight,
        };
      });
    }, 150),
    []
  );

  const registerKeyboardListener = useCallback((callback: (isVisible: boolean) => void) => {
    keyboardListeners.add(callback);
    return () => keyboardListeners.delete(callback);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial state
    updateViewport();

    // Use visualViewport if available (more accurate)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport, { passive: true });
      return () => window.visualViewport?.removeEventListener('resize', updateViewport);
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', updateViewport, { passive: true });
      return () => window.removeEventListener('resize', updateViewport);
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