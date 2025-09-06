// Performance monitoring utilities
import { logger } from './logger';

class PerformanceMonitor {
  private metrics = new Map<string, number>();
  
  // Mark the start of a performance measurement
  mark(name: string) {
    this.metrics.set(name, performance.now());
  }
  
  // Measure time since mark and log if over threshold
  measure(name: string, threshold = 100) {
    const startTime = this.metrics.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.delete(name);
      
      if (duration > threshold) {
        logger.warn(`Performance: ${name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`);
      }
      
      return duration;
    }
    return 0;
  }
  
  // Monitor long tasks using PerformanceObserver
  observeLongTasks() {
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              logger.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
            }
          });
        });
        
        observer.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // PerformanceObserver might not be supported
      }
    }
  }
  
  // Monitor largest contentful paint
  observeLCP() {
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          
          logger.info(`LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Not supported in all browsers
      }
    }
  }
  
  // Initialize all performance monitoring
  init() {
    this.observeLongTasks();
    this.observeLCP();
    
    // Monitor page load performance
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        logger.info(`DOM ready: ${performance.now().toFixed(2)}ms`);
      });
      
      window.addEventListener('load', () => {
        logger.info(`Page load complete: ${performance.now().toFixed(2)}ms`);
      });
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();