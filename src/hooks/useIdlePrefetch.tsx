import { useEffect } from 'react';

// DISABLED prefetching for performance
export const useIdlePrefetch = () => {
  useEffect(() => {
    // COMPLETELY DISABLED for performance
    return;
  }, []);
};