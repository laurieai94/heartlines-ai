// Simple cache for expensive calculations to prevent redundant computation
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  inputHash: string;
}

class CalculationCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly ttl: number;

  constructor(ttlMs = 30000) { // 30 second default TTL
    this.ttl = ttlMs;
  }

  // Create a simple hash from input data
  private hashInput(input: any): string {
    return JSON.stringify(input);
  }

  get(key: string, input: any, calculator: () => T): T {
    const inputHash = this.hashInput(input);
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached result if valid
    if (cached && 
        cached.inputHash === inputHash && 
        (now - cached.timestamp) < this.ttl) {
      return cached.value;
    }

    // Calculate and cache new result
    const value = calculator();
    this.cache.set(key, {
      value,
      timestamp: now,
      inputHash
    });

    // Clean up old entries
    this.cleanup();
    
    return value;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }
}

// Global cache instances for different calculation types
export const profileCompletionCache = new CalculationCache<number>(60000); // 1 minute
export const validationCache = new CalculationCache<boolean>(30000); // 30 seconds
export const requirementCache = new CalculationCache<any>(120000); // 2 minutes