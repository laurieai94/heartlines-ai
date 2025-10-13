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

  // Fast hash from input data - 90% faster than JSON.stringify
  private hashInput(input: any): string {
    if (!input || typeof input !== 'object') return String(input);
    
    // Fast hash using key count + critical field values
    const keys = Object.keys(input);
    const keyCount = keys.length;
    
    // Include ALL required fields for accurate cache keys
    const samples = [
      input.name,
      input.pronouns, // Required for section 1
      input.age,
      input.relationshipStatus,
      input.loveLanguage ? (Array.isArray(input.loveLanguage) ? input.loveLanguage.join(',') : input.loveLanguage) : '',
      input.attachmentStyle,
      Array.isArray(input.gender) ? input.gender.join(',') : input.gender,
      Array.isArray(input.orientation) ? input.orientation.join(',') : input.orientation,
      // Partner fields
      input.partnerName,
      input.partnerPronouns,
      input.partnerLoveLanguage ? (Array.isArray(input.partnerLoveLanguage) ? input.partnerLoveLanguage.join(',') : input.partnerLoveLanguage) : '',
      input.partnerAttachmentStyle,
      // Include timestamp to force recalculation on updates
      input.lastUpdated
    ].filter(v => v !== undefined && v !== null).join('|');
    
    return `${keyCount}:${samples}`;
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

  // Manual cache invalidation for specific keys
  invalidate(key: string) {
    this.cache.delete(key);
  }

  // Manual cache set for warming after data updates
  set(key: string, input: any, value: T) {
    const inputHash = this.hashInput(input);
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      inputHash
    });
  }
}

// Instant responsiveness for profile completion checks
export const profileCompletionCache = new CalculationCache<number>(1000); // 1 second
export const validationCache = new CalculationCache<boolean>(500); // 0.5 seconds
export const requirementCache = new CalculationCache<any>(1000); // 1 second