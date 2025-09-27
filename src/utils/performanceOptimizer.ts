// Lightweight performance optimization utilities
import { startTransition } from 'react';

// Debounce function optimized for React
export const deferUpdate = (callback: () => void, priority: 'high' | 'low' = 'low') => {
  if (priority === 'high') {
    // High priority updates run immediately
    callback();
  } else {
    // Low priority updates are deferred using React's concurrent features
    startTransition(() => {
      callback();
    });
  }
};

// Batch DOM updates to prevent layout thrashing
export const batchDOMUpdates = (updates: Array<() => void>) => {
  if (updates.length === 0) return;
  
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
};

// Optimized event listener management
export const createOptimizedListener = (
  element: Element | Window,
  event: string,
  handler: (event: Event) => void,
  options?: AddEventListenerOptions
) => {
  const optimizedHandler = (event: Event) => {
    // Use passive listeners for better performance where possible
    if (options?.passive !== false && ['scroll', 'touchstart', 'touchmove', 'wheel'].includes(event.type)) {
      handler(event);
    } else {
      // Defer non-critical event handling
      requestAnimationFrame(() => handler(event));
    }
  };

  const optimizedOptions = {
    passive: true,
    ...options
  };

  element.addEventListener(event, optimizedHandler, optimizedOptions);
  
  return () => {
    element.removeEventListener(event, optimizedHandler, optimizedOptions);
  };
};

// Memory-efficient object comparison
export const shallowEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  
  if (!obj1 || !obj2) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
};

// Optimized array comparison for React.memo
export const arrayEqual = (arr1: any[], arr2: any[]): boolean => {
  if (arr1 === arr2) return true;
  if (!arr1 || !arr2 || arr1.length !== arr2.length) return false;
  
  return arr1.every((item, index) => item === arr2[index]);
};

// Performance budget tracking (development only)
export const performanceBudget = {
  startMeasure: (name: string) => {
    if (process.env.NODE_ENV === 'development') {
      performance.mark(`${name}-start`);
    }
  },
  
  endMeasure: (name: string, budget: number = 16) => {
    if (process.env.NODE_ENV === 'development') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const entries = performance.getEntriesByName(name, 'measure');
      const duration = entries[entries.length - 1]?.duration || 0;
      
      if (duration > budget) {
        console.warn(`Performance budget exceeded: ${name} took ${duration.toFixed(2)}ms (budget: ${budget}ms)`);
      }
      
      // Clean up measurements to prevent memory leaks
      performance.clearMarks(`${name}-start`);
      performance.clearMarks(`${name}-end`);
      performance.clearMeasures(name);
    }
  }
};