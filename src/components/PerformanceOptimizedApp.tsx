import React, { useEffect } from 'react'

interface PerformanceOptimizedAppProps {
  children: React.ReactNode;
}

// SIMPLIFIED: Performance wrapper - mobile detection handled by MobileProvider
export const PerformanceOptimizedApp: React.FC<PerformanceOptimizedAppProps> = ({ children }) => {
  // Note: Mobile detection is now handled by MobileProvider (single source of truth)
  // This component only applies CSS classes that are set by useOptimizedMobile hook
  
  return <>{children}</>;
};