import { useRef, useCallback } from 'react';

interface DebouncedPersistenceOptions {
  delay: number;
  immediate?: boolean;
}

export const useDebouncedPersistence = <T,>(
  persistFunction: (data: T) => void | Promise<void>,
  options: DebouncedPersistenceOptions = { delay: 1000 }
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = useRef<T | null>(null);

  const debouncedPersist = useCallback((data: T) => {
    pendingDataRef.current = data;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(async () => {
      if (pendingDataRef.current !== null) {
        try {
          await persistFunction(pendingDataRef.current);
        } catch (error) {
          console.error('Persistence failed:', error);
        } finally {
          pendingDataRef.current = null;
          timeoutRef.current = null;
        }
      }
    }, options.delay);
  }, [persistFunction, options.delay]);

  const persistImmediately = useCallback(async () => {
    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Persist current data if any
    if (pendingDataRef.current !== null) {
      try {
        await persistFunction(pendingDataRef.current);
      } catch (error) {
        console.error('Immediate persistence failed:', error);
      } finally {
        pendingDataRef.current = null;
      }
    }
  }, [persistFunction]);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    pendingDataRef.current = null;
  }, []);

  return { debouncedPersist, persistImmediately, cleanup };
};