import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MobileHeaderVisibilityContextType {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileHeaderVisibilityContext = createContext<MobileHeaderVisibilityContextType | undefined>(undefined);

interface MobileHeaderVisibilityProviderProps {
  children: ReactNode;
}

export const MobileHeaderVisibilityProvider = ({ children }: MobileHeaderVisibilityProviderProps) => {
  // Always show header on mobile for better usability
  const [visible, setVisible] = useState(true);

  return (
    <MobileHeaderVisibilityContext.Provider value={{ visible: true, setVisible }}>
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