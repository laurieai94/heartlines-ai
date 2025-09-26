// EMERGENCY performance system - prevents page unresponsive issues
const MAX_EXECUTION_TIME = 16; // 16ms per frame
const MAX_CONCURRENT_OPERATIONS = 2;

let activeOperations = 0;
let frameStartTime = 0;

// Emergency circuit breaker for operations taking too long
export const withPerformanceCircuitBreaker = <T>(
  operation: () => T | Promise<T>,
  fallback?: T
): T | Promise<T> => {
  // Check if we're over the operation limit
  if (activeOperations >= MAX_CONCURRENT_OPERATIONS) {
    return fallback as T;
  }

  frameStartTime = performance.now();
  activeOperations++;

  try {
    const result = operation();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        activeOperations--;
      });
    }
    
    // Check if operation took too long
    const executionTime = performance.now() - frameStartTime;
    if (executionTime > MAX_EXECUTION_TIME) {
      // Operation took too long, return fallback for future similar operations
      console.warn(`Operation exceeded ${MAX_EXECUTION_TIME}ms limit: ${executionTime.toFixed(2)}ms`);
    }
    
    activeOperations--;
    return result;
  } catch (error) {
    activeOperations--;
    return fallback as T;
  }
};

// Emergency throttle for DOM operations
export const throttledDOMOperation = (() => {
  let isThrottled = false;
  
  return (operation: () => void) => {
    if (isThrottled) return;
    
    isThrottled = true;
    requestAnimationFrame(() => {
      operation();
      isThrottled = false;
    });
  };
})();

// Emergency memory cleanup
export const emergencyCleanup = () => {
  // Force garbage collection if available
  if ('gc' in window && typeof (window as any).gc === 'function') {
    (window as any).gc();
  }
  
  // Clear any large caches
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('temp') || name.includes('cache')) {
          caches.delete(name);
        }
      });
    });
  }
};

// Monitor for performance issues and trigger emergency measures
export const initEmergencyMonitoring = () => {
  let longTaskCount = 0;
  
  // Monitor long tasks
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            longTaskCount++;
            
            // If we get too many long tasks, trigger emergency cleanup
            if (longTaskCount > 3) {
              emergencyCleanup();
              longTaskCount = 0;
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // PerformanceObserver not supported
    }
  }
  
  // Monitor memory usage if available
  if ('memory' in performance) {
    const checkMemory = () => {
      const memory = (performance as any).memory;
      if (memory && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
        emergencyCleanup();
      }
    };
    
    // Check memory usage every 30 seconds
    setInterval(checkMemory, 30000);
  }
};