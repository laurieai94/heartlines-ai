import { useRef, useEffect, useCallback } from 'react';

// Production-optimized timer hook with proper cleanup
export const useOptimizedTimer = () => {
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const setOptimizedTimeout = useCallback((
    callback: () => void,
    delay: number,
    id?: string
  ) => {
    // Skip in production for non-critical timers
    if (!import.meta.env.DEV && delay < 1000) {
      return null;
    }

    const timerId = setTimeout(callback, delay);
    
    if (id) {
      // Clear existing timer with same ID
      const existing = timersRef.current.get(id);
      if (existing) {
        clearTimeout(existing);
      }
      timersRef.current.set(id, timerId);
    }

    return timerId;
  }, []);

  const setOptimizedInterval = useCallback((
    callback: () => void,
    delay: number,
    id?: string
  ) => {
    // Skip in production for frequent intervals
    if (!import.meta.env.DEV && delay < 5000) {
      return null;
    }

    const intervalId = setInterval(callback, delay);
    
    if (id) {
      // Clear existing interval with same ID
      const existing = timersRef.current.get(id);
      if (existing) {
        clearInterval(existing);
      }
      timersRef.current.set(id, intervalId);
    }

    return intervalId;
  }, []);

  const clearOptimizedTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      clearInterval(timer);
      timersRef.current.delete(id);
    }
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer);
      });
      timersRef.current.clear();
    };
  }, []);

  return {
    setOptimizedTimeout,
    setOptimizedInterval,
    clearOptimizedTimer
  };
};