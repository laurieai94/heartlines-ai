import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { throttle } from '@/utils/throttle';

const MOBILE_BREAKPOINT = 768;

interface MobileContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

const MobileContext = createContext<MobileContextType>({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
});

// Singleton pattern with throttled resize handler and safe initialization
let globalIsMobile = false;
let globalIsTablet = false;
let isInitialized = false;
let listeners = new Set<() => void>();

// Safe initialization that works in both SSR and client
const initializeGlobals = () => {
  if (isInitialized || typeof window === 'undefined') return;
  
  try {
    globalIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
    globalIsTablet = window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < 1024;
    isInitialized = true;
  } catch (error) {
    console.error('Error initializing mobile detection:', error);
    // Safe fallbacks
    globalIsMobile = false;
    globalIsTablet = false;
    isInitialized = true;
  }
};

const throttledUpdate = throttle(() => {
  if (typeof window === 'undefined') return;
  
  try {
    const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
    const newIsTablet = window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < 1024;
    
    if (newIsMobile !== globalIsMobile || newIsTablet !== globalIsTablet) {
      globalIsMobile = newIsMobile;
      globalIsTablet = newIsTablet;
      listeners.forEach(listener => {
        try {
          listener();
        } catch (error) {
          console.error('Error in mobile detection listener:', error);
        }
      });
    }
  } catch (error) {
    console.error('Error in throttled update:', error);
  }
}, 100);

// Single global event listener with safe initialization
if (typeof window !== 'undefined') {
  // Initialize on first run
  initializeGlobals();
  
  // Add resize listener
  try {
    window.addEventListener('resize', throttledUpdate, { passive: true });
  } catch (error) {
    console.error('Error adding resize listener:', error);
  }
}

export function MobileProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MobileContextType>(() => {
    // Ensure initialization happens before state creation
    initializeGlobals();
    
    return {
      isMobile: globalIsMobile,
      isTablet: globalIsTablet,
      isDesktop: !globalIsMobile && !globalIsTablet,
    };
  });

  useEffect(() => {
    const updateState = () => {
      setState({
        isMobile: globalIsMobile,
        isTablet: globalIsTablet,
        isDesktop: !globalIsMobile && !globalIsTablet,
      });
    };

    listeners.add(updateState);
    return () => {
      listeners.delete(updateState);
    };
  }, []);

  return (
    <MobileContext.Provider value={state}>
      {children}
    </MobileContext.Provider>
  );
}

export function useOptimizedMobile() {
  const context = useContext(MobileContext);
  
  // Enhanced mobile optimizations with haptic feedback
  const simulateHapticFeedback = useCallback((element: HTMLElement, type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!context.isMobile) return;
    
    const intensity = {
      light: 'scale-[0.98]',
      medium: 'scale-[0.95]',
      heavy: 'scale-[0.92]'
    };
    
    element.classList.add('transition-transform', 'duration-75', intensity[type]);
    
    setTimeout(() => {
      element.classList.remove('transition-transform', 'duration-75', intensity[type]);
    }, 150);
  }, [context.isMobile]);

  // Apply CSS-based mobile optimizations
  useEffect(() => {
    if (!context.isMobile) return;
    
    // Add mobile optimization classes to body
    document.body.classList.add('mobile-optimized');
    
    // iOS-specific optimizations
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    if (isIOS) {
      document.body.classList.add('ios-optimized');
    }
    
    return () => {
      document.body.classList.remove('mobile-optimized', 'ios-optimized');
    };
  }, [context.isMobile]);
  
  return {
    ...context,
    simulateHapticFeedback
  };
}

// Legacy hook for backward compatibility
export function useIsMobile() {
  const { isMobile } = useOptimizedMobile();
  return isMobile;
}