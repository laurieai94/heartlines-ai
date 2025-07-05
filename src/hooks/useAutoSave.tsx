
import { useEffect } from 'react';

export const useAutoSave = (
  data: any, 
  saveFunction: (data: any) => void, 
  delay: number = 500
) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveFunction(data);
    }, delay);
    
    return () => clearTimeout(timeoutId);
  }, [data, saveFunction, delay]);
};
