import { useCallback } from 'react';

// SIMPLIFIED: Performance safeguards - removed timeout complexity that was causing issues
export const usePerformanceSafeguards = () => {
  // Simple pass-through function - no timeouts or circuit breakers
  const withTimeout = useCallback(<T extends (...args: any[]) => Promise<any>>(
    operation: T,
    timeoutMs?: number, 
    operationName?: string
  ): T => {
    // Just return the operation as-is
    return operation;
  }, []);

  return {
    withTimeout,
    isEmergencyMode: false
  };
};
