// Safe logging utility to prevent circular reference issues on mobile
const isDev = import.meta.env.DEV;

// Mobile detection
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         (window.innerWidth <= 768);
};

// Safe stringify with circular reference handling
const safeStringify = (obj: any, maxDepth: number = 3): string => {
  const seen = new WeakSet();
  
  const stringify = (value: any, depth: number): any => {
    if (depth > maxDepth) return '[Max Depth Reached]';
    
    if (value === null || typeof value !== 'object') {
      return value;
    }
    
    if (seen.has(value)) {
      return '[Circular Reference]';
    }
    
    seen.add(value);
    
    if (Array.isArray(value)) {
      return value.slice(0, 5).map(item => stringify(item, depth + 1));
    }
    
    const result: any = {};
    const keys = Object.keys(value).slice(0, 10); // Limit keys for performance
    
    for (const key of keys) {
      try {
        result[key] = stringify(value[key], depth + 1);
      } catch {
        result[key] = '[Error Serializing]';
      }
    }
    
    return result;
  };
  
  try {
    return JSON.stringify(stringify(obj, 0));
  } catch {
    return '[Serialization Failed]';
  }
};

// Safe logging functions with mobile optimization
export const safeLog = {
  info: (...args: any[]) => {
    if (!isDev) return;
    
    // On mobile, use simpler logging to prevent freezing
    if (isMobile()) {
      // Only log basic field names and types, no complex objects
      const safeArgs = args.map(arg => {
        if (typeof arg === 'string') return arg;
        if (typeof arg === 'number' || typeof arg === 'boolean') return arg;
        if (arg === null || arg === undefined) return arg;
        if (Array.isArray(arg)) return `[Array(${arg.length})]`;
        if (typeof arg === 'object') return `[Object]`;
        return '[Unknown]';
      });
      console.log(...safeArgs);
    } else {
      // Desktop can handle more complex logging
      const safeArgs = args.map(arg => {
        if (typeof arg === 'object' && arg !== null) {
          return safeStringify(arg, 2);
        }
        return arg;
      });
      console.log(...safeArgs);
    }
  },
  
  warn: (...args: any[]) => {
    if (!isDev) return;
    console.warn(...args);
  },
  
  error: (...args: any[]) => {
    console.error(...args); // Always log errors
  },
  
  // Field-only logging for performance-critical operations
  fieldUpdate: (source: string, field: string, hasValue: boolean) => {
    if (!isDev) return;
    console.log(`[${source}] ${field}: ${hasValue ? 'updated' : 'cleared'}`);
  },
  
  // Multi-select logging without object serialization
  multiSelect: (source: string, field: string, action: 'add' | 'remove', value: string) => {
    if (!isDev) return;
    console.log(`[${source}] ${field}: ${action} "${value}"`);
  }
};

// Performance-safe object inspection (mobile-optimized)
export const inspectObject = (obj: any, label: string = 'Object') => {
  if (!isDev) return;
  
  if (isMobile()) {
    // Mobile: just show basic info
    const type = Array.isArray(obj) ? `Array(${obj.length})` : typeof obj;
    console.log(`${label}: ${type}`);
  } else {
    // Desktop: show more detail
    console.log(label, safeStringify(obj, 2));
  }
};