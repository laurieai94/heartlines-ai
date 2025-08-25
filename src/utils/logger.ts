// Production-optimized logging utility
const isDev = import.meta.env.DEV;
const isLogEnabled = isDev || import.meta.env.VITE_ENABLE_LOGS === 'true';

export const logger = {
  info: (message: string, ...args: any[]) => {
    if (isLogEnabled) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (isLogEnabled) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    // Always log errors, even in production
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  debug: (message: string, ...args: any[]) => {
    if (isDev) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};