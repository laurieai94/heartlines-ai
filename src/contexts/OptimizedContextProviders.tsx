import React, { useMemo } from 'react';
import { MobileHeaderVisibilityProvider } from './MobileHeaderVisibilityContext';
import { ViewportProvider } from './ViewportContext';
import { AuthProvider } from './AuthContext';

// Memoized context providers to prevent unnecessary re-renders
export const OptimizedMobileHeaderProvider = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    return (
      <MobileHeaderVisibilityProvider>
        {children}
      </MobileHeaderVisibilityProvider>
    );
  }
);

export const OptimizedViewportProvider = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    return (
      <ViewportProvider>
        {children}
      </ViewportProvider>
    );
  }
);


export const OptimizedAuthProvider = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }
);

// Compound provider that memoizes the provider tree to prevent cascade re-renders
export const OptimizedProviderStack = React.memo(
  ({ children }: { children: React.ReactNode }) => {
    const providerStack = useMemo(() => (
      <OptimizedAuthProvider>
        <OptimizedViewportProvider>
          <OptimizedMobileHeaderProvider>
            {children}
          </OptimizedMobileHeaderProvider>
        </OptimizedViewportProvider>
      </OptimizedAuthProvider>
    ), [children]);

    return providerStack;
  }
);

// Set display names for debugging
OptimizedMobileHeaderProvider.displayName = 'OptimizedMobileHeaderProvider';
OptimizedViewportProvider.displayName = 'OptimizedViewportProvider';
OptimizedAuthProvider.displayName = 'OptimizedAuthProvider';
OptimizedProviderStack.displayName = 'OptimizedProviderStack';