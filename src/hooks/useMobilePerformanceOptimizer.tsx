// DISABLED: Mobile performance optimizations - was causing performance issues
export const useMobilePerformanceOptimizer = () => {
  // Return static values to prevent any overhead
  const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 768);
  
  return {
    isMobile,
    throttleRender: () => false,
    isThrottled: false,
    cleanupMemory: () => {},
    renderCount: 0
  };
};