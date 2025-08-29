
import React, { createContext, useContext, ReactNode } from 'react';

interface NavigationContextType {
  goToProfile: (origin?: 'header' | 'chat') => void;
  goToCoach: () => void;
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
  goToProfile: (origin?: 'header' | 'chat') => void;
  goToCoach?: () => void;
}

export const NavigationProvider = ({ children, goToProfile, goToCoach }: NavigationProviderProps) => {
  const handleGoToCoach = goToCoach || (() => {
    // Default implementation to navigate to insights tab
    const tabsElement = document.querySelector('[data-state="active"]')?.closest('[role="tablist"]');
    if (tabsElement) {
      const insightsTab = tabsElement.querySelector('[value="insights"]') as HTMLElement;
      if (insightsTab) {
        insightsTab.click();
      }
    }
  });

  return (
    <NavigationContext.Provider value={{ goToProfile, goToCoach: handleGoToCoach }}>
      {children}
    </NavigationContext.Provider>
  );
};
