import { useState, useRef, useCallback } from 'react';

interface InputState {
  isUserActive: boolean;
  lastActivityTime: number;
  activeInputType: 'selection' | 'typing' | 'scrolling' | null;
}

export const useInputStateTracking = (settleDelayMs: number = 500) => {
  const [inputState, setInputState] = useState<InputState>({
    isUserActive: false,
    lastActivityTime: 0,
    activeInputType: null
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const trackActivity = useCallback((activityType: 'selection' | 'typing' | 'scrolling') => {
    const now = Date.now();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setInputState({ isUserActive: true, lastActivityTime: now, activeInputType: activityType });
    timeoutRef.current = setTimeout(() => {
      setInputState(prev => ({ ...prev, isUserActive: false, activeInputType: null }));
    }, settleDelayMs);
  }, [settleDelayMs]);

  const trackSelection = useCallback(() => trackActivity('selection'), [trackActivity]);
  const trackTyping = useCallback(() => trackActivity('typing'), [trackActivity]);
  const trackScrolling = useCallback(() => trackActivity('scrolling'), [trackActivity]);

  const isNavigationSafe = useCallback(() => {
    return !inputState.isUserActive;
  }, [inputState.isUserActive]);

  return { inputState, trackSelection, trackTyping, trackScrolling, isNavigationSafe };
};
