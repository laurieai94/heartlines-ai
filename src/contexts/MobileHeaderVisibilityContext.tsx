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
    <MobileHeaderVisibilityContext.Provider value={{ visible, setVisible: enhancedSetVisible, forceVisible }}>
      {children}
    </MobileHeaderVisibilityContext.Provider>
  );
};

export const useMobileHeaderVisibility = () => {
  const context = useContext(MobileHeaderVisibilityContext);
  
  // Safe fallback when context is missing (e.g., on landing page)
  if (context === undefined) {
    console.log('🔄 MobileHeaderVisibility context missing - using fallback');
    return {
      visible: true,
      setVisible: () => {}, // no-op
      forceVisible: () => {
        // Emergency DOM-based navigation reveal
        const headers = document.querySelectorAll('[data-mobile-header]');
        headers.forEach(header => {
          (header as HTMLElement).style.transform = 'translateY(0)';
          (header as HTMLElement).style.opacity = '1';
        });
      }
    };
  }
  
  return context;
};