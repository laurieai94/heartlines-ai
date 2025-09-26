// Performance safeguards to prevent page unresponsiveness

interface PerformanceGuard {
  name: string;
  startTime: number;
  maxDuration: number;
}

const activeGuards = new Map<string, PerformanceGuard>();
const PERFORMANCE_WARNINGS: string[] = [];

// Create a performance guard for long-running operations
export const createPerformanceGuard = (name: string, maxDuration: number = 500): string => {
  const guardId = `${name}_${Date.now()}_${Math.random()}`;
  
  activeGuards.set(guardId, {
    name,
    startTime: performance.now(),
    maxDuration
  });
  
  return guardId;
};

// Check and release a performance guard
export const releasePerformanceGuard = (guardId: string): void => {
  const guard = activeGuards.get(guardId);
  if (!guard) return;
  
  const duration = performance.now() - guard.startTime;
  
  if (duration > guard.maxDuration) {
    const warning = `⚠️ Performance: ${guard.name} took ${duration.toFixed(2)}ms (threshold: ${guard.maxDuration}ms)`;
    console.warn(warning);
    PERFORMANCE_WARNINGS.push(warning);
    
    // Keep only last 10 warnings
    if (PERFORMANCE_WARNINGS.length > 10) {
      PERFORMANCE_WARNINGS.shift();
    }
  }
  
  activeGuards.delete(guardId);
};

// Wrapper function to guard any operation
export const withPerformanceGuard = async <T>(
  name: string,
  operation: () => T | Promise<T>,
  maxDuration: number = 500
): Promise<T> => {
  const guardId = createPerformanceGuard(name, maxDuration);
  
  try {
    const result = await operation();
    return result;
  } finally {
    releasePerformanceGuard(guardId);
  }
};

// Yield control back to the browser main thread
export const yieldToMainThread = (): Promise<void> => {
  return new Promise(resolve => {
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      (window as any).scheduler.postTask(resolve, { priority: 'user-blocking' });
    } else {
      setTimeout(resolve, 0);
    }
  });
};

// Break up heavy operations into chunks
export const processInChunks = async <T>(
  items: T[],
  processor: (item: T) => void,
  chunkSize: number = 10
): Promise<void> => {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    
    // Process the chunk
    chunk.forEach(processor);
    
    // Yield control if there are more items to process
    if (i + chunkSize < items.length) {
      await yieldToMainThread();
    }
  }
};

// Get current performance warnings
export const getPerformanceWarnings = (): string[] => {
  return [...PERFORMANCE_WARNINGS];
};

// Check for long-running guards (potential memory leaks or stuck operations)
export const checkStuckGuards = (): void => {
  const now = performance.now();
  
  for (const [guardId, guard] of activeGuards.entries()) {
    const duration = now - guard.startTime;
    
    if (duration > guard.maxDuration * 3) { // 3x the threshold
      console.error(`🚨 Stuck operation detected: ${guard.name} has been running for ${duration.toFixed(2)}ms`);
      
      // Force release the stuck guard
      activeGuards.delete(guardId);
    }
  }
};

// Initialize performance monitoring
export const initPerformanceMonitoring = (): void => {
  // Check for stuck guards every 10 seconds
  setInterval(checkStuckGuards, 10000);
  
  // Log performance warnings periodically in development
  if (import.meta.env.DEV) {
    setInterval(() => {
      if (PERFORMANCE_WARNINGS.length > 0) {
        console.group('📊 Performance Warnings');
        PERFORMANCE_WARNINGS.forEach(warning => console.warn(warning));
        console.groupEnd();
      }
    }, 30000); // Every 30 seconds
  }
};
