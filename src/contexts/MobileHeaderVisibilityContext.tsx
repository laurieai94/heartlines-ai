import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface MobileHeaderVisibilityContextType {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  forceVisible: () => void;
  navigationOpened: boolean;
  setNavigationOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileHeaderVisibilityContext = createContext<MobileHeaderVisibilityContextType | undefined>(undefined);

interface MobileHeaderVisibilityProviderProps {
  children: ReactNode;
}

export const MobileHeaderVisibilityProvider = ({ children }: MobileHeaderVisibilityProviderProps) => {
  const [visible, setVisible] = useState(true);
  const [navigationOpened, setNavigationOpened] = useState(false);

  // Force visible function for emergency situations
  const forceVisible = useCallback(() => {
    setVisible(true);
  }, []);

  // Throttled setVisible to prevent excessive re-renders
  const throttleRef = React.useRef<number | null>(null);
  const enhancedSetVisible = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    if (throttleRef.current) return;
    
    throttleRef.current = window.requestAnimationFrame(() => {
      setVisible(value);
      throttleRef.current = null;
    });
  }, []);

  return (
    <MobileHeaderVisibilityContext.Provider value={{ visible, setVisible: enhancedSetVisible, forceVisible, navigationOpened, setNavigationOpened }}>
      {children}
    </MobileHeaderVisibilityContext.Provider>
  );
};

export const useMobileHeaderVisibility = () => {
  const context = useContext(MobileHeaderVisibilityContext);
  
  // Safe fallback when context is missing (e.g., on non-dashboard pages)
  if (context === undefined) {
    return {
      visible: true,
      setVisible: () => {}, // no-op - don't interfere with scroll
      forceVisible: () => {}, // no-op
      navigationOpened: false,
      setNavigationOpened: () => {} // no-op
    };
  }
  
  return context;
};