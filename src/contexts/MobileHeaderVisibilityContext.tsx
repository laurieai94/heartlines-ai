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
    console.log('🚨 FORCE VISIBLE triggered');
    setVisible(true);
  }, []);

  // Enhanced setVisible with logging (but keeping original signature)
  const enhancedSetVisible = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    const newValue = typeof value === 'function' ? value(visible) : value;
    console.log('🎭 Header visibility changing:', { from: visible, to: newValue });
    setVisible(value);
  }, [visible]);

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