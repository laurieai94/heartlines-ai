import { useEffect } from 'react';
import { warmupNetwork } from '@/utils/networkWarmup';

// Homepage-specific optimization hook
export const useHomepageOptimization = () => {
  useEffect(() => {
    // Immediate critical resource hints
    const addResourceHint = (rel: string, href: string, as?: string) => {
      if (!document.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        if (as) link.as = as;
        document.head.appendChild(link);
      }
    };

    // Critical fonts for hero section
    addResourceHint('preload', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', 'style');
    
    // Hero section background if any
    const heroBackground = document.querySelector('[data-hero-background]');
    if (heroBackground) {
      const bgImage = window.getComputedStyle(heroBackground).backgroundImage;
      const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
      if (urlMatch) {
        addResourceHint('preload', urlMatch[1], 'image');
      }
    }

    // Warm up network connections
    warmupNetwork();

    // Defer heavy components below the fold
    const deferBelowFold = () => {
      const belowFoldSections = document.querySelectorAll('[data-defer-load]');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.style.visibility = 'visible';
            observer.unobserve(element);
          }
        });
      }, { rootMargin: '50px' });

      belowFoldSections.forEach(section => {
        (section as HTMLElement).style.visibility = 'hidden';
        observer.observe(section);
      });
    };

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', deferBelowFold);
    } else {
      setTimeout(deferBelowFold, 100);
    }

    return () => {
      document.removeEventListener('DOMContentLoaded', deferBelowFold);
    };
  }, []);
};