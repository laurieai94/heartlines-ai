// Production-optimized console that prevents performance issues
const isProduction = !import.meta.env.DEV;

// Store original methods
const originalConsole = {
  log: console.log,
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error
};

// Safe console methods that won't cause performance issues
export const productionConsole = {
  log: isProduction ? () => {} : originalConsole.log,
  debug: isProduction ? () => {} : originalConsole.debug,
  info: isProduction ? () => {} : originalConsole.info,
  warn: isProduction ? () => {} : originalConsole.warn,
  error: (message: any, ...args: any[]) => {
    // Always show errors, but prevent circular reference issues
    try {
      if (typeof message === 'object') {
        originalConsole.error('[Error Object]', message?.message || 'Unknown error', ...args);
      } else {
        originalConsole.error(message, ...args);
      }
    } catch {
      originalConsole.error('Error occurred but could not be logged safely');
    }
  }
};

// Initialize production console overrides - AGGRESSIVE MODE
export const initProductionConsole = () => {
  // Always disable console in production for maximum performance
  if (isProduction) {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
    console.error = productionConsole.error; // Keep error logging for critical issues
  }
};

// Restore original console (for development)
export const restoreConsole = () => {
  if (!isProduction) {
    Object.assign(console, originalConsole);
  }
};