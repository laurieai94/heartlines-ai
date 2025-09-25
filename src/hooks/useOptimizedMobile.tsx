import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
  return useContext(MobileContext);
}

// Legacy hook for backward compatibility
export function useIsMobile() {
  const { isMobile } = useOptimizedMobile();
  return isMobile;
}