
import { useEffect } from 'react';

export const useAutoSave = (
  data: any, 
  saveFunction: (data: any) => void, 
  delay: number = 2000  // Reduced from 500ms to 2000ms for better performance
) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveFunction(data);
    }, delay);
    
    return () => clearTimeout(timeoutId);
  }, [data, saveFunction, delay]);
};
