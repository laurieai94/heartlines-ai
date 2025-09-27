import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { NavigationProvider, useNavigation } from './NavigationContext';
import { MobileHeaderVisibilityProvider } from './MobileHeaderVisibilityContext';

// Consolidated context for optimized provider access
interface OptimizedContextValue {
  auth: ReturnType<typeof useAuth>;
  navigation: ReturnType<typeof useNavigation>;
}

const OptimizedContext = createContext<OptimizedContextValue | null>(null);

// Internal provider that combines all contexts
const OptimizedContextProviderInternal: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const navigation = useNavigation();

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    auth,
    navigation
  }), [auth, navigation]);

  return (
    <OptimizedContext.Provider value={contextValue}>
      {children}
    </OptimizedContext.Provider>
  );
};

// Main provider that wraps all context providers
interface OptimizedContextProviderProps {
  children: ReactNode;
  goToProfile?: (origin?: 'header' | 'chat') => void;
  goToCoach?: () => void;
  goToPartner?: () => void;
}

export const OptimizedContextProvider: React.FC<OptimizedContextProviderProps> = ({ 
  children, 
  goToProfile = () => {},
  goToCoach,
  goToPartner 
}) => {
  return (
    <AuthProvider>
      <NavigationProvider goToProfile={goToProfile} goToCoach={goToCoach} goToPartner={goToPartner}>
        <MobileHeaderVisibilityProvider>
          <OptimizedContextProviderInternal>
            {children}
          </OptimizedContextProviderInternal>
        </MobileHeaderVisibilityProvider>
      </NavigationProvider>
    </AuthProvider>
  );
};

// Optimized hook to access all contexts
export const useOptimizedContext = () => {
  const context = useContext(OptimizedContext);
  if (!context) {
    throw new Error('useOptimizedContext must be used within OptimizedContextProvider');
  }
  return context;
};

// Individual optimized hooks for backwards compatibility
export const useOptimizedAuth = () => {
  const { auth } = useOptimizedContext();
  return auth;
};

export const useOptimizedNavigation = () => {
  const { navigation } = useOptimizedContext();
  return navigation;
};