// Mobile-specific performance optimizations
const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;
const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  
  const memory = (navigator as any).deviceMemory;
  const cores = navigator.hardwareConcurrency || 1;
  
  return memory ? memory <= 2 : cores <= 2;
};

interface OptimizationConfig {
  enableTouchOptimizations: boolean;
  enableAnimationReduction: boolean;
  enableMemoryManagement: boolean;
  enableBatteryOptimizations: boolean;
}

class MobileOptimizer {
  private config: OptimizationConfig;
  private observers: Set<IntersectionObserver> = new Set();
  private timers: Set<NodeJS.Timeout> = new Set();
  private rafCallbacks: Set<number> = new Set();
  private memoryCleanupInterval?: NodeJS.Timeout;

  constructor(config: Partial<OptimizationConfig> = {}) {
    this.config = {
      enableTouchOptimizations: true,
      enableAnimationReduction: isLowEndDevice(),
      enableMemoryManagement: true,
      enableBatteryOptimizations: isMobile(),
      ...config
    };

    this.init();
  }

  private init() {
    if (!isMobile()) return;

    this.setupTouchOptimizations();
    this.setupAnimationOptimizations();
    this.setupMemoryManagement();
    this.setupBatteryOptimizations();
  }

  // Touch and gesture optimizations
  private setupTouchOptimizations() {
    if (!this.config.enableTouchOptimizations) return;

    // Add touch-action CSS for better touch handling
    const style = document.createElement('style');
    style.textContent = `
      .touch-optimized {
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      .scroll-optimized {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }
    `;
    document.head.appendChild(style);

    // Apply touch optimizations to interactive elements
    document.body.classList.add('touch-optimized');
  }

  // Animation and transition optimizations
  private setupAnimationOptimizations() {
    if (!this.config.enableAnimationReduction) return;

    const style = document.createElement('style');
    style.textContent = `
      .mobile-performance-mode * {
        animation-duration: 0.01ms !important;
        animation-delay: 0.01ms !important;
        transition-duration: 0.01ms !important;
        transition-delay: 0.01ms !important;
      }
      .mobile-performance-mode .animate-pulse,
      .mobile-performance-mode .animate-spin,
      .mobile-performance-mode .animate-bounce {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);

    if (isLowEndDevice()) {
      document.body.classList.add('mobile-performance-mode');
    }
  }

  // Memory management optimizations
  private setupMemoryManagement() {
    if (!this.config.enableMemoryManagement) return;

    // Periodic memory cleanup
    this.memoryCleanupInterval = setInterval(() => {
      this.performMemoryCleanup();
    }, 30000); // Every 30 seconds

    // Cleanup on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.performMemoryCleanup();
      }
    });
  }

  // Battery and CPU optimizations
  private setupBatteryOptimizations() {
    if (!this.config.enableBatteryOptimizations) return;

    // Reduce work when battery is low (if battery API is available)
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const checkBattery = () => {
          if (battery.level < 0.2) { // Less than 20% battery
            document.body.classList.add('low-battery-mode');
          } else {
            document.body.classList.remove('low-battery-mode');
          }
        };

        battery.addEventListener('levelchange', checkBattery);
        checkBattery();
      });
    }

    // Add CSS for low battery mode
    const style = document.createElement('style');
    style.textContent = `
      .low-battery-mode * {
        animation: none !important;
        transition: none !important;
      }
      .low-battery-mode .animate-pulse,
      .low-battery-mode .animate-spin,
      .low-battery-mode .animate-bounce {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Optimized IntersectionObserver creation
  createOptimizedObserver(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ): IntersectionObserver {
    const optimizedOptions = {
      rootMargin: '50px', // Larger margin for better performance
      threshold: 0.1, // Lower threshold to reduce callbacks
      ...options
    };

    const observer = new IntersectionObserver(callback, optimizedOptions);
    this.observers.add(observer);
    return observer;
  }

  // Optimized timeout/interval management
  createOptimizedTimeout(callback: () => void, delay: number): NodeJS.Timeout {
    const timeout = setTimeout(() => {
      this.timers.delete(timeout);
      callback();
    }, delay);
    
    this.timers.add(timeout);
    return timeout;
  }

  createOptimizedInterval(callback: () => void, delay: number): NodeJS.Timeout {
    // Increase intervals on mobile for battery savings
    const mobileDelay = isMobile() ? Math.max(delay * 1.5, delay + 1000) : delay;
    
    const interval = setInterval(callback, mobileDelay);
    this.timers.add(interval);
    return interval;
  }

  // Optimized requestAnimationFrame
  createOptimizedRAF(callback: FrameRequestCallback): number {
    const rafId = requestAnimationFrame((time) => {
      this.rafCallbacks.delete(rafId);
      callback(time);
    });
    
    this.rafCallbacks.add(rafId);
    return rafId;
  }

  // Memory cleanup utilities
  private performMemoryCleanup() {
    try {
      // Clear completed timers and observers
      this.cleanupTimers();
      this.cleanupObservers();

      // Force garbage collection if available
      if ('gc' in window && typeof (window as any).gc === 'function') {
        try {
          (window as any).gc();
        } catch (e) {
          // Silently ignore gc errors
        }
      }

      // Clear unused DOM references
      this.cleanupDOMReferences();
    } catch (error) {
      console.warn('[MobileOptimizer] Memory cleanup error:', error);
    }
  }

  private cleanupTimers() {
    // Remove completed timers from tracking
    this.timers.forEach(timer => {
      try {
        clearTimeout(timer);
        clearInterval(timer);
      } catch (e) {
        // Timer might already be cleared
      }
    });
  }

  private cleanupObservers() {
    // Disconnect observers that are no longer needed
    this.observers.forEach(observer => {
      try {
        observer.disconnect();
      } catch (e) {
        // Observer might already be disconnected
      }
    });
  }

  private cleanupDOMReferences() {
    // Remove elements marked for cleanup
    document.querySelectorAll('[data-mobile-cleanup="true"]').forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }

  // Manual cleanup method
  cleanup() {
    this.cleanupTimers();
    this.cleanupObservers();
    
    this.rafCallbacks.forEach(rafId => {
      cancelAnimationFrame(rafId);
    });
    
    if (this.memoryCleanupInterval) {
      clearInterval(this.memoryCleanupInterval);
    }

    this.observers.clear();
    this.timers.clear();
    this.rafCallbacks.clear();
  }

  // Performance assessment
  assessDevicePerformance() {
    const memory = (navigator as any).deviceMemory || 1;
    const cores = navigator.hardwareConcurrency || 1;
    const connection = (navigator as any).connection;
    
    const score = {
      memory: memory >= 4 ? 'high' : memory >= 2 ? 'medium' : 'low',
      cpu: cores >= 4 ? 'high' : cores >= 2 ? 'medium' : 'low',
      network: connection ? 
        (['4g', 'wifi'].includes(connection.effectiveType) ? 'high' : 'low') : 'unknown'
    };

    return {
      overall: Object.values(score).includes('low') ? 'low' : 
               Object.values(score).includes('medium') ? 'medium' : 'high',
      details: score
    };
  }
}

// Singleton instance
export const mobileOptimizer = new MobileOptimizer();

// Utility functions
export const optimizeTouchElement = (element: HTMLElement) => {
  element.classList.add('touch-optimized');
  element.style.touchAction = 'manipulation';
};

export const optimizeScrollElement = (element: HTMLElement) => {
  element.classList.add('scroll-optimized');
};

export const shouldReduceAnimations = () => {
  return isLowEndDevice() || 
         window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getOptimalImageQuality = () => {
  const performance = mobileOptimizer.assessDevicePerformance();
  
  switch (performance.overall) {
    case 'high': return 0.9;
    case 'medium': return 0.7;
    case 'low': return 0.5;
    default: return 0.7;
  }
};

export const getOptimalUpdateFrequency = (baseMs: number) => {
  const performance = mobileOptimizer.assessDevicePerformance();
  
  switch (performance.overall) {
    case 'high': return baseMs;
    case 'medium': return baseMs * 1.5;
    case 'low': return baseMs * 2;
    default: return baseMs * 1.5;
  }
};

export { MobileOptimizer };