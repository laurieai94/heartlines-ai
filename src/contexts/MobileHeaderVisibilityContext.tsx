import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();

  // Force header visible on route changes
  useEffect(() => {
    console.log('🚀 Route changed, forcing header visible:', location.pathname);
    setVisible(true);
  }, [location.pathname]);

  // Force visible function for emergency situations
  const forceVisible = useCallback(() => {
    console.log('🔥 Force visible triggered');
    setVisible(true);
  }, []);

  // Enhanced setVisible (keeping original signature)
  const enhancedSetVisible = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    console.log('📱 Mobile header visibility changed:', value);
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