// Ultra-optimized production logger with zero overhead
const isDev = import.meta.env.DEV;

export const optimizedLogger = isDev ? {
  info: (message: string, ...args: any[]) => console.log(`[INFO] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => console.warn(`[WARN] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[ERROR] ${message}`, ...args),
  debug: (message: string, ...args: any[]) => console.debug(`[DEBUG] ${message}`, ...args)
} : {
  // Complete no-ops in production for zero performance impact
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {}
};

// Production-safe event tracking - no analytics overhead
export const trackEvent = isDev 
  ? (name: string, props?: Record<string, any>) => {
      console.debug(`[EVENT] ${name}`, props ?? {});
    }
  : () => {};