
import React, { createContext, useContext, ReactNode } from 'react';

interface NavigationContextType {
  goToProfile: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
  goToProfile: () => void;
}

export const NavigationProvider = ({ children, goToProfile }: NavigationProviderProps) => {
  return (
    <NavigationContext.Provider value={{ goToProfile }}>
      {children}
    </NavigationContext.Provider>
  );
};
