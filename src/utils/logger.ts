// Ultra-optimized logging utility - PRODUCTION DISABLED
const isDev = false; // Force disabled for performance

// No-op logger for zero performance impact
export const logger = {
  info: (...args: any[]) => {},
  warn: (...args: any[]) => {},
  error: (...args: any[]) => {},
  debug: (...args: any[]) => {}
};