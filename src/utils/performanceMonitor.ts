// Performance monitoring utilities - DISABLED for performance optimization
import { logger } from './logger';

// Lightweight no-op performance monitor to replace the heavy original
class DisabledPerformanceMonitor {
  private isEnabled = false;
  
  mark(name: string) {
    // Disabled for performance
  }
  
  measure(name: string, threshold = 100) {
    // Disabled for performance
    return 0;
  }
  
  observeLongTasks() {
    // Disabled for performance
  }
  
  observeLCP() {
    // Disabled for performance
  }
  
  init() {
    // Disabled for performance
  }
}

export const performanceMonitor = new DisabledPerformanceMonitor();