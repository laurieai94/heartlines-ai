import React, { useEffect } from 'react';
import { useLightweightPerformanceMonitor } from '@/hooks/useLightweightPerformanceMonitor';
import { useOptimizedTimers } from '@/hooks/useOptimizedTimers';
import { productionConsole } from '@/utils/productionConsole';

interface PerformanceOptimizedAppProps {
  children: React.ReactNode;
}

// High-level performance wrapper that coordinates all optimizations
export const PerformanceOptimizedApp: React.FC<PerformanceOptimizedAppProps> = ({ children }) => {
  const { isEmergencyMode } = useLightweightPerformanceMonitor();
  const { isMobile } = useOptimizedTimers();
  
  useEffect(() => {
    // Apply mobile optimizations
    if (isMobile) {
      document.body.classList.add('mobile-optimized');
      
      // Add iOS-specific optimizations
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        document.body.classList.add('ios-optimized');
      }
    }
    
    // Apply emergency mode if needed
    if (isEmergencyMode) {
      document.body.classList.add('emergency-performance');
      productionConsole.warn('Emergency performance mode activated');
    }
    
    return () => {
      // Cleanup classes on unmount
      document.body.classList.remove('mobile-optimized', 'ios-optimized', 'emergency-performance');
    };
  }, [isMobile, isEmergencyMode]);
  
  // Add performance monitoring attributes to help with debugging
  useEffect(() => {
    if (isEmergencyMode) {
      document.documentElement.setAttribute('data-performance-mode', 'emergency');
    } else if (isMobile) {
      document.documentElement.setAttribute('data-performance-mode', 'mobile-optimized');
    } else {
      document.documentElement.setAttribute('data-performance-mode', 'normal');
    }
  }, [isEmergencyMode, isMobile]);
  
  return <>{children}</>;
};