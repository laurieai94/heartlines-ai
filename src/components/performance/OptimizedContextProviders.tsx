import React from 'react';
import { MobileHeaderVisibilityProvider } from '@/contexts/MobileHeaderVisibilityContext';
import { ViewportProvider } from '@/contexts/ViewportContext';

// Optimized context providers with minimal re-renders
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

OptimizedMobileHeaderProvider.displayName = 'OptimizedMobileHeaderProvider';
OptimizedViewportProvider.displayName = 'OptimizedViewportProvider';