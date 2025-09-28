// Enhanced memory management utilities for cleanup and optimization
export class MemoryManager {
  private static intervals = new Set<NodeJS.Timeout>();
  private static timeouts = new Set<NodeJS.Timeout>();
  private static listeners = new Map<string, { element: Element; listener: EventListener; event: string }>();
  private static isProduction = import.meta.env.PROD;

  // Register timer for automatic cleanup
  static addInterval(interval: NodeJS.Timeout): void {
    this.intervals.add(interval);
  }

  static addTimeout(timeout: NodeJS.Timeout): void {
    this.timeouts.add(timeout);
  }

  // Register event listener for cleanup
  static addListener(key: string, element: Element, listener: EventListener, event: string = 'click'): void {
    // Remove any existing listener with same key first
    this.removeListener(key);
    this.listeners.set(key, { element, listener, event });
    element.addEventListener(event, listener, { passive: true });
  }

  // Clean up all registered resources
  static cleanup(): void {
    // Clear all intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();

    // Clear all timeouts  
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();

    // Remove all event listeners
    this.listeners.forEach(({ element, listener, event }) => {
      try {
        element.removeEventListener(event, listener);
      } catch (e) {
        // Element may have been removed from DOM
      }
    });
    this.listeners.clear();
  }

  // Force garbage collection if available
  static forceGC(): void {
    if (typeof window !== 'undefined' && 'gc' in window) {
      try {
        (window as any).gc();
      } catch (e) {
        // GC not available in this environment
      }
    }
  }

  // Remove timeout/interval from tracking
  static removeTimeout(timeout: NodeJS.Timeout): void {
    this.timeouts.delete(timeout);
    clearTimeout(timeout);
  }

  static removeInterval(interval: NodeJS.Timeout): void {
    this.intervals.delete(interval);
    clearInterval(interval);
  }

  // Remove specific event listener
  static removeListener(key: string): void {
    const listenerData = this.listeners.get(key);
    if (listenerData) {
      try {
        listenerData.element.removeEventListener(listenerData.event, listenerData.listener);
      } catch (e) {
        // Element may have been removed
      }
      this.listeners.delete(key);
    }
  }

  // Get resource usage stats (development only)
  static getStats() {
    if (this.isProduction) return null;
    
    return {
      intervals: this.intervals.size,
      timeouts: this.timeouts.size,
      listeners: this.listeners.size,
      totalResources: this.intervals.size + this.timeouts.size + this.listeners.size
    };
  }
}