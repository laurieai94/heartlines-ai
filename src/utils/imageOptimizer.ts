// Lazy loading and image optimization utilities
import { useEffect, useRef, useCallback } from 'react';

// Intersection Observer for lazy loading images
let observer: IntersectionObserver | null = null;

const getIntersectionObserver = () => {
  if (!observer && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.removeAttribute('data-src');
              observer?.unobserve(img);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Load images 50px before they come into view
        threshold: 0.1
      }
    );
  }
  return observer;
};

// Hook for lazy loading images
export const useLazyImage = (src: string) => {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imgElement = imgRef.current;
    if (!imgElement) return;

    const observer = getIntersectionObserver();
    if (observer) {
      imgElement.dataset.src = src;
      observer.observe(imgElement);
    } else {
      // Fallback for browsers without Intersection Observer
      imgElement.src = src;
    }

    return () => {
      if (observer && imgElement) {
        observer.unobserve(imgElement);
      }
    };
  }, [src]);

  return imgRef;
};

// Optimized image component props
export interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

// Utility to create responsive image sources
export const createResponsiveImageSources = (baseSrc: string) => {
  return {
    mobile: baseSrc,
    tablet: baseSrc,
    desktop: baseSrc,
  };
};

// Preload critical images
export const preloadCriticalImages = (imageSources: string[]) => {
  if (typeof window === 'undefined') return;
  
  imageSources.forEach((src, index) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    if (index === 0) {
      link.fetchPriority = 'high';
    }
    document.head.appendChild(link);
  });
};