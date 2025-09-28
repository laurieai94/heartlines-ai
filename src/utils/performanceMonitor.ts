// Performance monitoring utilities - DISABLED IN PRODUCTION
// Performance monitoring disabled for production optimization

class PerformanceMonitor {
  private metrics = new Map<string, number>();
  // COMPLETELY DISABLED for production performance
  private isEnabled = false;
  
  // Mark the start of a performance measurement
  mark(name: string) {
    if (!this.isEnabled) return;
    this.metrics.set(name, performance.now());
  }
  
  // Measure time since mark and log if over threshold
  measure(name: string, threshold = 100) {
    if (!this.isEnabled) return 0;
    
    const startTime = this.metrics.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.delete(name);
      
      if (duration > threshold) {
        // Performance: ${name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms) - logging removed for performance
      }
      
      return duration;
    }
    return 0;
  }
  
  // Monitor long tasks using PerformanceObserver - throttled
  observeLongTasks() {
    if (!this.isEnabled || typeof PerformanceObserver === 'undefined') return;
    
    let lastLogTime = 0;
    const LOG_THROTTLE = 5000; // Only log every 5 seconds
    
    try {
      const observer = new PerformanceObserver((list) => {
        const now = Date.now();
        if (now - lastLogTime < LOG_THROTTLE) return;
        
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            // Long task detected: ${entry.duration.toFixed(2)}ms - logging removed for performance
            lastLogTime = now;
          }
        });
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // PerformanceObserver might not be supported
    }
  }
  
  // Monitor largest contentful paint - once only
  observeLCP() {
    if (!this.isEnabled || typeof PerformanceObserver === 'undefined') return;
    
    let hasLogged = false;
    
    try {
      const observer = new PerformanceObserver((list) => {
        if (hasLogged) return;
        
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        // LCP: ${lastEntry.startTime.toFixed(2)}ms - logging removed for performance
        hasLogged = true;
        observer.disconnect();
      });
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Not supported in all browsers
    }
  }
  
  // Initialize performance monitoring - development only
  init() {
    if (!this.isEnabled) return;
    
    this.observeLongTasks();
    this.observeLCP();
    
    // Monitor page load performance - once only
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        // DOM ready: ${performance.now().toFixed(2)}ms - logging removed for performance
      }, { once: true });
      
      window.addEventListener('load', () => {
        // Page load complete: ${performance.now().toFixed(2)}ms - logging removed for performance
      }, { once: true });
    }
  }
}

export const performanceMonitor = new PerformanceMonitor();