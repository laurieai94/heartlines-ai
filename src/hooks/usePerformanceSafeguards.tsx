import { useEffect, useRef, useCallback } from 'react';

// Emergency performance safeguards
export const usePerformanceSafeguards = () => {
  const operationTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const isEmergencyMode = useRef(false);
  
  // Circuit breaker for operations
  const withTimeout = useCallback(<T extends (...args: any[]) => Promise<any>>(
    operation: T,
    timeoutMs: number = 5000,
    operationName: string
  ): T => {
    return (async (...args: any[]) => {
      if (isEmergencyMode.current) {
        return Promise.resolve();
      }

      return Promise.race([
        operation(...args),
        new Promise((_, reject) => {
          const timeout = setTimeout(() => {
            isEmergencyMode.current = true;
            reject(new Error(`Operation ${operationName} timed out after ${timeoutMs}ms`));
          }, timeoutMs);
          
          operationTimeouts.current.set(operationName, timeout);
        })
      ]).finally(() => {
        const timeout = operationTimeouts.current.get(operationName);
        if (timeout) {
          clearTimeout(timeout);
          operationTimeouts.current.delete(operationName);
        }
      });
    }) as T;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      operationTimeouts.current.forEach(timeout => clearTimeout(timeout));
      operationTimeouts.current.clear();
    };
  }, []);

  return {
    withTimeout,
    isEmergencyMode: isEmergencyMode.current
  };
};