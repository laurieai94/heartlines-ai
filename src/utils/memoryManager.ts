// Memory management utilities for cleanup and optimization
export class MemoryManager {
  private static intervals = new Set<NodeJS.Timeout>();
  private static timeouts = new Set<NodeJS.Timeout>();
  private static listeners = new Map<string, { element: Element; listener: EventListener }>();

  // Register timer for automatic cleanup
  static addInterval(interval: NodeJS.Timeout): void {
    this.intervals.add(interval);
  }

  static addTimeout(timeout: NodeJS.Timeout): void {
    this.timeouts.add(timeout);
  }

  // Register event listener for cleanup
  static addListener(key: string, element: Element, listener: EventListener): void {
    this.listeners.set(key, { element, listener });
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
    this.listeners.forEach(({ element, listener }, event) => {
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
}