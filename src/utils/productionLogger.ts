// Production-safe logger that only logs errors in production, full logging in development
const isDev = import.meta.env.DEV;

interface LogContext {
  component?: string;
  userId?: string;
  action?: string;
  [key: string]: any;
}

class ProductionLogger {
  private isDev = isDev;

  // Only log errors in production, everything in development
  error(message: string, error?: Error, context?: LogContext) {
    console.error(`[ERROR] ${message}`, error?.message || '', context || {});
    
    // In production, send to analytics/monitoring service
    if (!this.isDev && typeof window !== 'undefined') {
      // Send to error tracking service (e.g., Sentry, LogRocket)
      if ((window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: message,
          fatal: false,
        });
      }
    }
  }

  // Development-only logging
  info(message: string, data?: any, context?: LogContext) {
    if (this.isDev) {
      console.log(`[INFO] ${message}`, data || '', context || {});
    }
  }

  warn(message: string, data?: any, context?: LogContext) {
    if (this.isDev) {
      console.warn(`[WARN] ${message}`, data || '', context || {});
    }
  }

  debug(message: string, data?: any, context?: LogContext) {
    if (this.isDev) {
      console.debug(`[DEBUG] ${message}`, data || '', context || {});
    }
  }

  // Performance tracking - development only
  performance(name: string, duration: number, context?: LogContext) {
    if (this.isDev && duration > 100) {
      console.warn(`[PERF] ${name} took ${duration}ms`, context || {});
    }
  }

  // User action tracking - production safe
  userAction(action: string, context?: LogContext) {
    if (this.isDev) {
      console.log(`[USER] ${action}`, context || {});
    }
    
    // Analytics in production
    if (!this.isDev && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', action, context || {});
    }
  }
}

export const logger = new ProductionLogger();

// Convenience functions for common use cases
export const logError = (message: string, error?: Error, context?: LogContext) => 
  logger.error(message, error, context);

export const logInfo = (message: string, data?: any, context?: LogContext) => 
  logger.info(message, data, context);

export const logWarn = (message: string, data?: any, context?: LogContext) => 
  logger.warn(message, data, context);

export const logDebug = (message: string, data?: any, context?: LogContext) => 
  logger.debug(message, data, context);

export const logPerformance = (name: string, duration: number, context?: LogContext) => 
  logger.performance(name, duration, context);

export const logUserAction = (action: string, context?: LogContext) => 
  logger.userAction(action, context);