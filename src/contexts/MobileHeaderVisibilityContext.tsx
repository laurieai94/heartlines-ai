import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface MobileHeaderVisibilityContextType {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  forceVisible: () => void;
}

const MobileHeaderVisibilityContext = createContext<MobileHeaderVisibilityContextType | undefined>(undefined);

interface MobileHeaderVisibilityProviderProps {
  children: ReactNode;
}

export const MobileHeaderVisibilityProvider = ({ children }: MobileHeaderVisibilityProviderProps) => {
  const [visible, setVisible] = useState(true);

  // Enhanced setVisible with logging
  const enhancedSetVisible = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    const newValue = typeof value === 'function' ? value(visible) : value;
    console.log('🎭 Header visibility changing:', { from: visible, to: newValue, stack: new Error().stack?.split('\n')[2] });
    setVisible(value);
  }, [visible]);

  // Force visible function for emergency situations
  const forceVisible = useCallback(() => {
    console.log('🚨 FORCE VISIBLE triggered');
    setVisible(true);
  }, []);

  return (
    <MobileHeaderVisibilityContext.Provider value={{ visible, setVisible: enhancedSetVisible, forceVisible }}>
      {children}
    </MobileHeaderVisibilityContext.Provider>
  );
};

export const useMobileHeaderVisibility = () => {
  const context = useContext(MobileHeaderVisibilityContext);
  if (context === undefined) {
    throw new Error('useMobileHeaderVisibility must be used within a MobileHeaderVisibilityProvider');
  }
  return context;
};