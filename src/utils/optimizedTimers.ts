// Optimized timer management to reduce performance impact
let timerCount = 0;
const MAX_CONCURRENT_TIMERS = 10;

// Throttled timer creation to prevent excessive timer usage
export const createOptimizedTimeout = (callback: () => void, delay: number): number => {
  if (timerCount >= MAX_CONCURRENT_TIMERS) {
    // If too many timers, execute immediately to prevent buildup
    callback();
    return 0;
  }
  
  timerCount++;
  const id = setTimeout(() => {
    timerCount--;
    callback();
  }, delay);
  
  return id as any;
};

// Optimized cleanup
export const clearOptimizedTimeout = (id: number) => {
  if (id && id !== 0) {
    clearTimeout(id as any);
    timerCount = Math.max(0, timerCount - 1);
  }
};

// Batch timer operations for better performance
const pendingOperations: Array<() => void> = [];
let batchTimeout: number | null = null;

export const batchOperation = (operation: () => void) => {
  pendingOperations.push(operation);
  
  if (!batchTimeout) {
    batchTimeout = createOptimizedTimeout(() => {
      // Execute all pending operations at once
      while (pendingOperations.length > 0) {
        const op = pendingOperations.shift();
        op?.();
      }
      batchTimeout = null;
    }, 16); // Next frame
  }
};