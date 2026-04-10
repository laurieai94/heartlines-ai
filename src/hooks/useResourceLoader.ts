import { useState, useEffect } from 'react';

interface UseResourceLoaderResult {
  isLoading: boolean;
  progress: number;
  error: boolean;
}

export const useResourceLoader = (
  imageSources: readonly string[],
  options: {
    minDisplayTime?: number;
    maxTimeout?: number;
  } = {}
): UseResourceLoaderResult => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const { 
    minDisplayTime = isMobile ? 500 : 1000, 
    maxTimeout = isMobile ? 1500 : 5000 
  } = options;
  
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;
    const totalImages = imageSources.length;
    const startTime = Date.now();
    
    let imagesLoaded = false;
    let documentReady = false;
    let fontsReady = false;
    let minTimeElapsed = false;

    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
        setError(true);
      }
    }, maxTimeout);

    const minTimeId = setTimeout(() => {
      minTimeElapsed = true;
      checkComplete();
    }, minDisplayTime);

    const checkComplete = () => {
      if (!isMounted) return;
      const allLoaded = loadedCount >= totalImages;
      if (allLoaded && documentReady && fontsReady && minTimeElapsed) {
        setIsLoading(false);
      }
    };
    
    const markImagesLoaded = () => {
      imagesLoaded = true;
      checkComplete();
    };
    
    const checkDocumentReady = () => {
      if (document.readyState === 'complete') {
        documentReady = true;
        checkComplete();
      }
    };
    
    checkDocumentReady();
    
    if (document.readyState !== 'complete') {
      window.addEventListener('load', checkDocumentReady);
    }
    
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (isMounted) {
          fontsReady = true;
          checkComplete();
        }
      });
    } else {
      fontsReady = true;
    }

    const imagePromises = imageSources.map((src) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          if (isMounted) {
            loadedCount++;
            setProgress(Math.round((loadedCount / totalImages) * 100));
            checkComplete();
          }
          resolve();
        };
        img.onerror = () => {
          if (isMounted) {
            loadedCount++;
            setProgress(Math.round((loadedCount / totalImages) * 100));
            checkComplete();
          }
          resolve();
        };
        img.src = src;
      });
    });

    Promise.all(imagePromises).then(() => {
      if (isMounted) markImagesLoaded();
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      clearTimeout(minTimeId);
      if (document.readyState !== 'complete') {
        window.removeEventListener('load', checkDocumentReady);
      }
    };
  }, [imageSources, minDisplayTime, maxTimeout]);

  return { isLoading, progress, error };
};
