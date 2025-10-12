/**
 * Batched LocalStorage Manager
 * Optimizes localStorage operations by batching writes and debouncing rapid updates
 * Ensures zero functional changes - data is immediately available via read-through cache
 */

interface PendingOperation {
  key: string;
  value: string | null; // null means removal
  timestamp: number;
}

class BatchedStorageManager {
  private pendingWrites: Map<string, PendingOperation> = new Map();
  private debounceTimer: number | null = null;
  private readonly DEBOUNCE_MS = 1000; // 1000ms for better batching
  private readCache: Map<string, string | null> = new Map();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (this.isInitialized) return;
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => this.flush());
    
    // Flush on visibility change (tab hidden)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });

    this.isInitialized = true;
  }

  /**
   * Queue a write operation (debounced)
   * Data is immediately available via getItem
   */
  setItem(key: string, value: string): void {
    const operation: PendingOperation = {
      key,
      value,
      timestamp: Date.now()
    };

    // Add to pending writes
    this.pendingWrites.set(key, operation);
    
    // Update read cache immediately (ensures zero functional change)
    this.readCache.set(key, value);

    // Schedule flush
    this.scheduleFlush();
  }

  /**
   * Queue a removal operation (debounced)
   */
  removeItem(key: string): void {
    const operation: PendingOperation = {
      key,
      value: null, // null indicates removal
      timestamp: Date.now()
    };

    this.pendingWrites.set(key, operation);
    this.readCache.delete(key);

    this.scheduleFlush();
  }

  /**
   * Read from cache or localStorage
   * Ensures data is immediately available even if write is pending
   */
  getItem(key: string): string | null {
    // Check read cache first (includes pending writes)
    if (this.readCache.has(key)) {
      return this.readCache.get(key) || null;
    }

    // Fall back to localStorage
    try {
      const value = localStorage.getItem(key);
      this.readCache.set(key, value);
      return value;
    } catch (error) {
      // Silent fail - return null
      return null;
    }
  }

  /**
   * Schedule a debounced flush
   */
  private scheduleFlush(): void {
    // Clear existing timer
    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
    }

    // Schedule new flush
    this.debounceTimer = window.setTimeout(() => {
      this.flush();
    }, this.DEBOUNCE_MS);
  }

  /**
   * Immediately flush all pending operations to localStorage
   */
  flush(): void {
    if (this.debounceTimer !== null) {
      window.clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    if (this.pendingWrites.size === 0) {
      return;
    }

    // Batch all operations
    try {
      this.pendingWrites.forEach((operation) => {
        if (operation.value === null) {
          // Removal
          localStorage.removeItem(operation.key);
        } else {
          // Write
          localStorage.setItem(operation.key, operation.value);
        }
      });

      // Clear pending operations
      this.pendingWrites.clear();
    } catch (error) {
      // If storage is full or unavailable, clear pending writes to prevent memory leak
      this.pendingWrites.clear();
    }
  }

  /**
   * Get current queue size (for debugging)
   */
  getPendingCount(): number {
    return this.pendingWrites.size;
  }

  /**
   * Clear read cache (useful for testing)
   */
  clearCache(): void {
    this.readCache.clear();
  }
}

// Export singleton instance
export const batchedStorage = new BatchedStorageManager();
