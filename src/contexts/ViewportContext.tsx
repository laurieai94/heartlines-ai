import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

// Simplified viewport context for mobile performance
interface ViewportContextType {
  height: number;
  isKeyboardVisible: boolean;
  registerKeyboardListener: (callback: (isVisible: boolean) => void) => () => void;
}

const ViewportContext = createContext<ViewportContextType>({
  height: typeof window !== 'undefined' ? window.innerHeight : 0,
  isKeyboardVisible: false,
  registerKeyboardListener: () => () => {}
});

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [height, setHeight] = useState(() => 
    typeof window !== 'undefined' ? window.innerHeight : 0
  );
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardListeners] = useState(new Set<(isVisible: boolean) => void>());

  const registerKeyboardListener = useCallback((callback: (isVisible: boolean) => void) => {
    keyboardListeners.add(callback);
    
    return () => {
      keyboardListeners.delete(callback);
    };
  }, [keyboardListeners]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Use visualViewport API for more reliable keyboard detection on iOS Safari
    const visualViewport = window.visualViewport;
    
    const handleResize = () => {
      // Prefer visualViewport for accurate mobile viewport measurement
      const newHeight = visualViewport ? visualViewport.height : window.innerHeight;
      const windowHeight = window.innerHeight;
      
      // More reliable keyboard detection using visualViewport
      const isKeyboardNowVisible = visualViewport 
        ? (windowHeight - visualViewport.height) > 150
        : false;
      
      setHeight(newHeight);
      
      if (isKeyboardNowVisible !== isKeyboardVisible) {
        setIsKeyboardVisible(isKeyboardNowVisible);
        
        // Notify listeners only when keyboard state changes
        keyboardListeners.forEach(callback => {
          try {
            callback(isKeyboardNowVisible);
          } catch (error) {
            // Silent error to prevent performance impact
          }
        });
      }
    };

    // Listen to visualViewport resize events if available (better for mobile)
    if (visualViewport) {
      visualViewport.addEventListener('resize', handleResize, { passive: true } as any);
    } else {
      // Fallback to window resize for older browsers
      window.addEventListener('resize', handleResize, { passive: true });
    }
    
    return () => {
      if (visualViewport) {
        visualViewport.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [height, isKeyboardVisible, keyboardListeners]);

  return (
    <ViewportContext.Provider value={{ 
      height, 
      isKeyboardVisible, 
      registerKeyboardListener 
    }}>
      {children}
    </ViewportContext.Provider>
  );
}

export function useViewport() {
  return useContext(ViewportContext);
}