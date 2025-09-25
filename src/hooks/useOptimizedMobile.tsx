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

// Singleton pattern with throttled resize handler
let globalIsMobile = typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false;
let globalIsTablet = typeof window !== 'undefined' ? window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < 1024 : false;
let listeners = new Set<() => void>();

const throttledUpdate = throttle(() => {
  const newIsMobile = window.innerWidth < MOBILE_BREAKPOINT;
  const newIsTablet = window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < 1024;
  
  if (newIsMobile !== globalIsMobile || newIsTablet !== globalIsTablet) {
    globalIsMobile = newIsMobile;
    globalIsTablet = newIsTablet;
    listeners.forEach(listener => listener());
  }
}, 100);

// Single global event listener
if (typeof window !== 'undefined') {
  window.addEventListener('resize', throttledUpdate, { passive: true });
}

export function MobileProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MobileContextType>(() => ({
    isMobile: globalIsMobile,
    isTablet: globalIsTablet,
    isDesktop: !globalIsMobile && !globalIsTablet,
  }));

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