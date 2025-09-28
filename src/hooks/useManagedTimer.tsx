import { useRef, useEffect, useCallback } from 'react';
import { MemoryManager } from '@/utils/memoryManager';

interface TimerOptions {
  id?: string;
  cleanup?: boolean; // Auto cleanup on unmount (default: true)
}

// Centralized timer management hook
export function useManagedTimer() {
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const isMountedRef = useRef(true);

  const setManagedTimeout = useCallback((
    callback: () => void,
    delay: number,
    options: TimerOptions = {}
  ) => {
    const { id, cleanup = true } = options;
    
    // Don't create timers on unmounted components
    if (!isMountedRef.current) return null;

    // Clear existing timer with same ID
    if (id) {
      const existing = timersRef.current.get(id);
      if (existing) {
        clearTimeout(existing);
        MemoryManager.removeTimeout(existing);
        timersRef.current.delete(id);
      }
    }

    const wrappedCallback = () => {
      // Only execute if component is still mounted
      if (isMountedRef.current) {
        callback();
      }
    };

    const timerId = setTimeout(wrappedCallback, delay);
    
    // Register with MemoryManager for global cleanup
    MemoryManager.addTimeout(timerId);
    
    // Track locally for component cleanup
    if (id) {
      timersRef.current.set(id, timerId);
    }

    return timerId;
  }, []);

  const setManagedInterval = useCallback((
    callback: () => void,
    delay: number,
    options: TimerOptions = {}
  ) => {
    const { id, cleanup = true } = options;
    
    if (!isMountedRef.current) return null;

    // Clear existing interval with same ID
    if (id) {
      const existing = timersRef.current.get(id);
      if (existing) {
        clearInterval(existing);
        MemoryManager.removeInterval(existing);
        timersRef.current.delete(id);
      }
    }

    const wrappedCallback = () => {
      if (isMountedRef.current) {
        callback();
      }
    };

    const intervalId = setInterval(wrappedCallback, delay);
    
    // Register with MemoryManager
    MemoryManager.addInterval(intervalId);
    
    if (id) {
      timersRef.current.set(id, intervalId);
    }

    return intervalId;
  }, []);

  const clearManagedTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      clearInterval(timer);
      MemoryManager.removeTimeout(timer);
      MemoryManager.removeInterval(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach((timer) => {
      clearTimeout(timer);
      clearInterval(timer);
      MemoryManager.removeTimeout(timer);
      MemoryManager.removeInterval(timer);
    });
    timersRef.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      clearAllTimers();
    };
  }, [clearAllTimers]);

  return {
    setManagedTimeout,
    setManagedInterval,
    clearManagedTimer,
    clearAllTimers,
    activeTimers: timersRef.current.size
  };
}