import { useCallback, useRef } from 'react';

// Hook to optimize rendering by batching state updates and reducing unnecessary renders
export const useRenderOptimization = () => {
  const batchedUpdatesRef = useRef<{ [key: string]: any }>({});
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Batch multiple state updates into a single render cycle
  const batchUpdate = useCallback((key: string, value: any, setter: (value: any) => void) => {
    batchedUpdatesRef.current[key] = { value, setter };
    
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }
    
    batchTimeoutRef.current = setTimeout(() => {
      // Apply all batched updates in a single frame
      Object.values(batchedUpdatesRef.current).forEach(({ value, setter }) => {
        setter(value);
      });
      
      batchedUpdatesRef.current = {};
      batchTimeoutRef.current = null;
    }, 0);
  }, []);

  // Debounced state setter to prevent excessive re-renders
  const debouncedSetter = useCallback((setter: (value: any) => void, delay = 100) => {
    const timeoutRef = { current: null as NodeJS.Timeout | null };
    
    return (value: any) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setter(value);
      }, delay);
    };
  }, []);

  return {
    batchUpdate,
    debouncedSetter
  };
};