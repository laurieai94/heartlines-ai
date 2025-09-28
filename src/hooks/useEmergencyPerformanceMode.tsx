// DISABLED: Performance monitoring hook - was causing performance issues
export const useEmergencyPerformanceMode = () => {
  // Return static values to prevent any overhead
  return {
    isEmergencyMode: false,
    errorCount: 0
  };
};