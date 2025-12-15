import { useState, useEffect, useCallback } from 'react';

const GRACE_PERIOD_MS = 3 * 60 * 1000; // 3 minutes in milliseconds

interface NameLockState {
  isLocked: boolean;
  remainingMs: number;
  formattedTime: string;
  isInGracePeriod: boolean;
}

export const usePartnerNameLock = (lockedAt: string | null | undefined): NameLockState => {
  const [state, setState] = useState<NameLockState>({
    isLocked: false,
    remainingMs: 0,
    formattedTime: '',
    isInGracePeriod: false
  });

  const calculateState = useCallback((): NameLockState => {
    if (!lockedAt) {
      return {
        isLocked: false,
        remainingMs: GRACE_PERIOD_MS,
        formattedTime: '3:00',
        isInGracePeriod: false
      };
    }

    const lockTime = new Date(lockedAt).getTime();
    const now = Date.now();
    const elapsed = now - lockTime;
    const remainingMs = Math.max(0, GRACE_PERIOD_MS - elapsed);
    
    const isLocked = remainingMs === 0;
    const isInGracePeriod = remainingMs > 0;
    
    // Format as M:SS
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    return {
      isLocked,
      remainingMs,
      formattedTime,
      isInGracePeriod
    };
  }, [lockedAt]);

  useEffect(() => {
    // Initial calculation
    setState(calculateState());

    // If not locked and there's a lock time, start countdown
    if (lockedAt) {
      const lockTime = new Date(lockedAt).getTime();
      const now = Date.now();
      const elapsed = now - lockTime;
      
      if (elapsed < GRACE_PERIOD_MS) {
        // Update every second during grace period
        const interval = setInterval(() => {
          const newState = calculateState();
          setState(newState);
          
          // Stop interval when locked
          if (newState.isLocked) {
            clearInterval(interval);
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [lockedAt, calculateState]);

  return state;
};
