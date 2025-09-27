import { useEffect, useRef, useMemo, useCallback } from 'react';

// Production-optimized useEffect with automatic cleanup
export const useOptimizedEffect = (
  effect: () => void | (() => void),
  deps: React.DependencyList,
  options?: { immediate?: boolean; production?: boolean }
) => {
  const cleanupRef = useRef<(() => void) | void>();
  const { immediate = false, production = true } = options || {};
  
  useEffect(() => {
    // Skip non-essential effects in production for performance
    if (!import.meta.env.DEV && !production) return;
    
    if (immediate) {
      cleanupRef.current = effect();
    } else {
      // Use requestIdleCallback for deferred execution
      if ('requestIdleCallback' in window) {
        const id = (window as any).requestIdleCallback(() => {
          cleanupRef.current = effect();
        }, { timeout: 5000 });
        
        return () => {
          (window as any).cancelIdleCallback(id);
          if (typeof cleanupRef.current === 'function') {
            cleanupRef.current();
          }
        };
      } else {
        cleanupRef.current = effect();
      }
    }
    
    return () => {
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
    };
  }, deps);
};

// Memoized callback with production optimization
export const useProductionCallback = function<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  return useCallback(callback, deps);
};

// Memoized value with shallow comparison
export const useOptimizedMemo = function<T>(
  factory: () => T,
  deps: React.DependencyList
): T {
  return useMemo(factory, deps);
};