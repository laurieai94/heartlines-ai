// Bundle optimization utilities for production
const isDev = import.meta.env.DEV;

// Preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window === 'undefined') return;

  // Preload critical fonts
  const fontLink = document.createElement('link');
  fontLink.rel = 'preload';
  fontLink.as = 'font';
  fontLink.type = 'font/woff2';
  fontLink.crossOrigin = 'anonymous';
  fontLink.href = '/fonts/Inter-Regular.woff2'; // Adjust based on your fonts
  document.head.appendChild(fontLink);

  // Preload critical images
  const heroImage = new Image();
  heroImage.src = '/lovable-uploads/heartlines-logo.png';
  heroImage.loading = 'eager';

  // Prefetch likely next pages for better UX
  const prefetchLinks = ['/coach', '/plans', '/signin', '/signup'];
  prefetchLinks.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
};

// Bundle analysis and warnings (dev only)
export const analyzeBundleSize = () => {
  if (!isDev || typeof window === 'undefined') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const totalSize = scripts.reduce((acc, script) => {
    const src = (script as HTMLScriptElement).src;
    // Estimate based on typical Vite bundle naming
    if (src.includes('index-') && src.includes('.js')) {
      return acc + 200; // Approximate main bundle size in KB
    }
    return acc + 50; // Other chunks
  }, 0);

  if (totalSize > 500) { // Warn if total JS > 500KB
    console.warn(`[Bundle] Large bundle detected: ~${totalSize}KB`);
  }
};

// Performance monitoring
export const monitorPerformance = () => {
  if (!isDev || typeof window === 'undefined' || !('performance' in window)) return;

  // Monitor LCP
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    if (lastEntry.startTime > 2500) { // Warn if LCP > 2.5s
      console.warn(`[Performance] Slow LCP: ${lastEntry.startTime}ms`);
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // Monitor FID
  new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach((entry: any) => {
      if (entry.processingStart - entry.startTime > 100) {
        console.warn(`[Performance] Slow FID: ${entry.processingStart - entry.startTime}ms`);
      }
    });
  }).observe({ entryTypes: ['first-input'] });

  // Monitor resource loading
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    
    if (loadTime > 3000) {
      console.warn(`[Performance] Slow page load: ${loadTime}ms`);
    }
  });
};

// Cleanup unused resources
export const cleanupResources = () => {
  // Remove unused event listeners
  const obsoleteHandlers = ['resize', 'scroll', 'mousemove'].filter(event => {
    return !window.addEventListener.toString().includes(event);
  });
  
  // Clear intervals that might be running
  for (let i = 1; i < 1000; i++) {
    try { clearInterval(i); } catch {}
    try { clearTimeout(i); } catch {}
  }
};

// Initialize all optimizations
export const initializeProductionOptimizations = () => {
  preloadCriticalResources();
  
  if (isDev) {
    analyzeBundleSize();
    monitorPerformance();
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanupResources);
};