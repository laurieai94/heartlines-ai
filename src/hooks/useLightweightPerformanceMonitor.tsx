// DISABLED: Performance monitoring hook - was causing performance issues
export const useLightweightPerformanceMonitor = () => {
  // Return static values to prevent any overhead
  return {
    isEmergencyMode: false
  };
};