import { useState, useRef, useCallback } from 'react';

interface InputState {
  isUserActive: boolean;
  lastActivityTime: number;
  activeInputType: 'selection' | 'typing' | 'scrolling' | null;
}

export const useInputStateTracking = (settleDelayMs: number = 2000) => {
  const [inputState, setInputState] = useState<InputState>({
    isUserActive: false,
    lastActivityTime: 0,
    activeInputType: null
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const trackActivity = useCallback((activityType: 'selection' | 'typing' | 'scrolling') => {
    const now = Date.now();
    
    // Check if user is typing in any input element globally
    const activeElement = document.activeElement;
    const isTypingGlobally = activeElement?.tagName === 'INPUT' || 
                            activeElement?.tagName === 'TEXTAREA' ||
                            activeElement?.getAttribute('contenteditable') === 'true' ||
                            activeElement?.closest('form') !== null;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Mark as active
    setInputState({
      isUserActive: true || isTypingGlobally, // Always active if typing anywhere
      lastActivityTime: now,
      activeInputType: activityType
    });

    // Extended timeout for typing activities
    const extendedDelay = activityType === 'typing' ? settleDelayMs * 2 : settleDelayMs;

    // Set timeout to mark as inactive
    timeoutRef.current = setTimeout(() => {
      // Double-check if still typing when timeout executes
      const currentActive = document.activeElement;
      const stillTyping = currentActive?.tagName === 'INPUT' || 
                         currentActive?.tagName === 'TEXTAREA' ||
                         currentActive?.getAttribute('contenteditable') === 'true';
      
      if (!stillTyping) {
        setInputState(prev => ({
          ...prev,
          isUserActive: false,
          activeInputType: null
        }));
      }
    }, extendedDelay);
  }, [settleDelayMs]);

  const trackSelection = useCallback(() => trackActivity('selection'), [trackActivity]);
  const trackTyping = useCallback(() => trackActivity('typing'), [trackActivity]);
  const trackScrolling = useCallback(() => trackActivity('scrolling'), [trackActivity]);

  const isNavigationSafe = useCallback(() => {
    return !inputState.isUserActive;
  }, [inputState.isUserActive]);

  return {
    inputState,
    trackSelection,
    trackTyping, 
    trackScrolling,
    isNavigationSafe
  };
};