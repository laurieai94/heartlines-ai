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
  // Mobile-optimized defaults: faster timeouts
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
    
    // Track readiness states
    let imagesLoaded = false;
    let documentReady = false;
    let fontsReady = false;
    let minTimeElapsed = false;

    // Aggressive timeout fallback - force proceed on mobile
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log(`[ResourceLoader] Timeout after ${maxTimeout}ms - forcing proceed`);
        setIsLoading(false);
        setError(true);
      }
    }, maxTimeout);

    // Track minimum display time
    const minTimeId = setTimeout(() => {
      minTimeElapsed = true;
      checkComplete();
    }, minDisplayTime);

    const checkComplete = () => {
      if (!isMounted) return;
      
      const allLoaded = loadedCount >= totalImages;
      
      // Wait for images, document, fonts, and minimum time
      if (allLoaded && documentReady && fontsReady && minTimeElapsed) {
        const elapsed = Date.now() - startTime;
        console.log(`[ResourceLoader] All resources loaded in ${elapsed}ms (images: ${totalImages}, doc: ready, fonts: ready)`);
        setIsLoading(false);
      }
    };
    
    // Check if images are loaded
    const markImagesLoaded = () => {
      imagesLoaded = true;
      checkComplete();
    };
    
    // Wait for document to be fully loaded
    const checkDocumentReady = () => {
      if (document.readyState === 'complete') {
        documentReady = true;
        checkComplete();
      }
    };
    
    // Initial check
    checkDocumentReady();
    
    // Listen for document load
    if (document.readyState !== 'complete') {
      window.addEventListener('load', checkDocumentReady);
    }
    
    // Wait for fonts to be ready
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (isMounted) {
          fontsReady = true;
          checkComplete();
        }
      });
    } else {
      fontsReady = true; // Fallback if font API not supported
    }

    // Load all images
    const imagePromises = imageSources.map((src, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        
        img.onload = () => {
          if (isMounted) {
            loadedCount++;
            const newProgress = Math.round((loadedCount / totalImages) * 100);
            setProgress(newProgress);
            checkComplete();
          }
          resolve();
        };
        
        img.onerror = () => {
          if (isMounted) {
            console.log(`[ResourceLoader] Failed to load: ${src} - continuing anyway`);
            loadedCount++; // Count as loaded to not block
            const newProgress = Math.round((loadedCount / totalImages) * 100);
            setProgress(newProgress);
            checkComplete(); // Continue even on error
          }
          resolve();
        };
        
        img.src = src;
      });
    });

    // Wait for all images
    Promise.all(imagePromises).then(() => {
      if (isMounted) {
        markImagesLoaded();
      }
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
