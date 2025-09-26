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
      const rawKeyboardHeight = Math.max(0, windowHeight - visualHeight);
      
      // Cap keyboard height at 300px to prevent over-compensation
      const keyboardHeight = Math.min(rawKeyboardHeight, 300);
      
      // Enhanced device detection
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipod/.test(userAgent);
      const isAndroidDevice = /android/.test(userAgent);
      const isMobileDevice = isIOSDevice || isAndroidDevice || /mobile/.test(userAgent);
      const isTabletDevice = /ipad/.test(userAgent) || (windowHeight >= 768 && windowHeight < 1024);
      
      // Multiple keyboard detection methods
      const heightDifference = keyboardHeight;
      const isInputFocused = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA';
      
      // Device-specific thresholds with multiple detection strategies
      let keyboardThreshold = 30; // Very low threshold
      if (isIOSDevice) keyboardThreshold = 50;
      if (isAndroidDevice) keyboardThreshold = 40;
      if (isTabletDevice) keyboardThreshold = 100;
      
      // Multi-method keyboard detection
      const heightBasedDetection = heightDifference > keyboardThreshold;
      const focusBasedDetection = isInputFocused && heightDifference > 10;
      const isKeyboardVisible = heightBasedDetection || focusBasedDetection;
      
      // Enhanced debug logging
      console.log('🔍 Enhanced Viewport Debug:', {
        windowHeight,
        visualHeight,
        rawKeyboardHeight,
        keyboardHeight: heightDifference,
        cappedAt300: rawKeyboardHeight !== heightDifference,
        keyboardThreshold,
        isKeyboardVisible,
        userAgent: userAgent.substring(0, 50),
        isIOSDevice,
        isAndroidDevice,
        isMobileDevice,
        isTabletDevice,
        isInputFocused,
        heightBasedDetection,
        focusBasedDetection,
        activeElement: document.activeElement?.tagName,
        supportedAPIs: {
          visualViewport: !!window.visualViewport,
          innerHeight: !!window.innerHeight,
        }
      });

      setState(prev => {
        if (prev.isKeyboardVisible !== isKeyboardVisible) {
          console.log('🎯 Keyboard state changed:', { from: prev.isKeyboardVisible, to: isKeyboardVisible });
          keyboardListeners.forEach(listener => {
            try {
              listener(isKeyboardVisible);
            } catch (error) {
              console.error('Critical: Error in keyboard listener:', error);
            }
          });
        }
        
        return {
          keyboardHeight: heightDifference,
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
    // Return safe defaults instead of throwing error to prevent crashes
    console.warn('useViewport used outside ViewportProvider, returning defaults');
    return {
      keyboardHeight: 0,
      isKeyboardVisible: false,
      visualViewportHeight: window.innerHeight,
      windowHeight: window.innerHeight,
      registerKeyboardListener: () => () => {} // No-op unsubscribe function
    };
  }
  return context;
}