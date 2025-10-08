import { useState, useEffect } from 'react';

interface UseResourceLoaderResult {
  isLoading: boolean;
  progress: number;
  error: boolean;
}

/**
 * Hook to track loading state of critical images
 * Returns isLoading=false only when all images have loaded or timeout occurs
 */
export const useResourceLoader = (
  imageSources: readonly string[],
  options: {
    minDisplayTime?: number; // Minimum time to display loading (ms)
    maxTimeout?: number; // Maximum time to wait (ms)
  } = {}
): UseResourceLoaderResult => {
  const { minDisplayTime = 1000, maxTimeout = 5000 } = options;
  
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;
    const totalImages = imageSources.length;
    const startTime = Date.now();

    // Timeout fallback
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('Resource loading timeout - proceeding anyway');
        setIsLoading(false);
        setError(true);
      }
    }, maxTimeout);

    // Track minimum display time
    let minTimeElapsed = false;
    const minTimeId = setTimeout(() => {
      minTimeElapsed = true;
      checkComplete();
    }, minDisplayTime);

    const checkComplete = () => {
      if (!isMounted) return;
      
      const allLoaded = loadedCount >= totalImages;
      
      if (allLoaded && minTimeElapsed) {
        const elapsed = Date.now() - startTime;
        console.log(`All ${totalImages} critical resources loaded in ${elapsed}ms`);
        setIsLoading(false);
      }
    };

    // Load all images
    const imagePromises = imageSources.map((src, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          if (isMounted) {
            loadedCount++;
            const newProgress = Math.round((loadedCount / totalImages) * 100);
            setProgress(newProgress);
            console.log(`Loaded ${loadedCount}/${totalImages}: ${src}`);
            checkComplete();
          }
          resolve();
        };
        
        img.onerror = () => {
          if (isMounted) {
            console.error(`Failed to load image: ${src}`);
            loadedCount++; // Count as loaded to not block indefinitely
            const newProgress = Math.round((loadedCount / totalImages) * 100);
            setProgress(newProgress);
            setError(true);
            checkComplete();
          }
          resolve();
        };
        
        img.src = src;
      });
    });

    // Wait for all images
    Promise.all(imagePromises).then(() => {
      if (isMounted) {
        checkComplete();
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      clearTimeout(minTimeId);
    };
  }, [imageSources, minDisplayTime, maxTimeout]);

  return { isLoading, progress, error };
};
