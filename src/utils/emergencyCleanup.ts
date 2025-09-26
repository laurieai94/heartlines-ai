// EMERGENCY: Cleanup utilities to fix page unresponsiveness
export const emergencyProfileCleanup = () => {
  try {
    // Clear potentially corrupted localStorage entries
    const keysToCheck = [
      'heartlines-personal-profile',
      'heartlines-partner-profile',
      'heartlines-profile-completion',
      'heartlines-temp-profile',
      'heartlines-questionnaire-state'
    ];
    
    keysToCheck.forEach(key => {
      try {
        const item = localStorage.getItem(key);
        if (item) {
          // Try to parse to check if corrupted
          JSON.parse(item);
        }
      } catch (e) {
        // Remove corrupted entries
        localStorage.removeItem(key);
        console.warn(`Removed corrupted localStorage entry: ${key}`);
      }
    });
    
    // Clear any stuck timers or intervals
    const highestTimeoutId = setTimeout(() => {}, 0) as any;
    for (let i = 0; i < Number(highestTimeoutId); i++) {
      clearTimeout(i);
      clearInterval(i);
    }
    
    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      setTimeout(() => {
        (window as any).gc();
      }, 100);
    }
  } catch (error) {
    console.warn('Emergency cleanup failed:', error);
  }
};

// Initialize emergency cleanup
emergencyProfileCleanup();