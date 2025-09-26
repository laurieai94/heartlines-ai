// Ultra-optimized logging utility for production performance
const isDev = import.meta.env.DEV;
const isLogEnabled = isDev;

// Production-optimized logger with zero overhead when disabled
export const logger = isDev ? {
  info: (message: string, ...args: any[]) => console.log(`[INFO] ${message}`, ...args),
  warn: (message: string, ...args: any[]) => console.warn(`[WARN] ${message}`, ...args),
  error: (message: string, ...args: any[]) => console.error(`[ERROR] ${message}`, ...args),
  debug: (message: string, ...args: any[]) => console.debug(`[DEBUG] ${message}`, ...args)
} : {
  // No-op functions in production for zero performance impact
  info: () => {},
  warn: () => {},
  error: (message: string, ...args: any[]) => {
    // Only critical errors in production
    if (message.includes('Critical') || message.includes('Fatal')) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  debug: () => {}
};