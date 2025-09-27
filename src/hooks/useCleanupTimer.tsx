import { useRef, useEffect, useCallback } from 'react';

// Production-optimized timer management with automatic cleanup
export const useCleanupTimer = () => {
  const timersRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const setOptimizedTimeout = useCallback((
    callback: () => void,
    delay: number,
    skipInProduction = false
  ) => {
    // Skip non-critical timers in production
    if (!import.meta.env.DEV && skipInProduction) {
      return null;
    }

    const timer = setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);
    
    timersRef.current.add(timer);
    return timer;
  }, []);

  const setOptimizedInterval = useCallback((
    callback: () => void,
    delay: number,
    skipInProduction = true
  ) => {
    // Skip frequent intervals in production
    if (!import.meta.env.DEV && skipInProduction) {
      return null;
    }

    const timer = setInterval(callback, delay);
    timersRef.current.add(timer);
    return timer;
  }, []);

  const clearTimer = useCallback((timer: NodeJS.Timeout | null) => {
    if (timer) {
      clearTimeout(timer);
      clearInterval(timer);
      timersRef.current.delete(timer);
    }
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => {
        clearTimeout(timer);
        clearInterval(timer);
      });
      timersRef.current.clear();
    };
  }, []);

  return { setOptimizedTimeout, setOptimizedInterval, clearTimer };
};