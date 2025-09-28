import { useRef, useEffect, useCallback } from 'react';

// Optimized timer management for better performance
export const useOptimizedTimers = () => {
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const isMobile = useRef(window.innerWidth < 768);
  
  const createOptimizedTimeout = useCallback((
    callback: () => void,
    delay: number,
    id?: string
  ) => {
    // Increase delays on mobile to reduce CPU usage
    const optimizedDelay = isMobile.current ? Math.max(delay * 1.5, 1000) : delay;
    
    // Skip very short timeouts in production on mobile
    if (isMobile.current && optimizedDelay < 500) {
      return null;
    }
    
    const timeoutId = setTimeout(callback, optimizedDelay);
    
    if (id) {
      // Clear existing timer with same ID
      const existing = timersRef.current.get(id);
      if (existing) {
        clearTimeout(existing);
      }
      timersRef.current.set(id, timeoutId);
    }
    
    return timeoutId;
  }, []);
  
  const createOptimizedInterval = useCallback((
    callback: () => void,
    delay: number,
    id?: string
  ) => {
    // Much longer intervals on mobile
    const optimizedDelay = isMobile.current ? Math.max(delay * 2, 2000) : delay;
    
    // Skip frequent intervals in production on mobile
    if (isMobile.current && optimizedDelay < 1000) {
      return null;
    }
    
    const intervalId = setInterval(callback, optimizedDelay);
    
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
  
  const clearTimer = useCallback((id: string) => {
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
    createOptimizedTimeout,
    createOptimizedInterval,
    clearTimer,
    isMobile: isMobile.current
  };
};