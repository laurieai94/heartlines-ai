import { useCallback } from 'react';
import { logger } from '@/utils/productionLogger';

// React hook for component-based logging
export const useProductionLogging = (componentName: string) => {
  const logError = useCallback((message: string, error?: Error, context?: any) => {
    logger.error(message, error, { component: componentName, ...context });
  }, [componentName]);

  const logInfo = useCallback((message: string, data?: any, context?: any) => {
    logger.info(message, data, { component: componentName, ...context });
  }, [componentName]);

  const logWarn = useCallback((message: string, data?: any, context?: any) => {
    logger.warn(message, data, { component: componentName, ...context });
  }, [componentName]);

  const logDebug = useCallback((message: string, data?: any, context?: any) => {
    logger.debug(message, data, { component: componentName, ...context });
  }, [componentName]);

  const logUserAction = useCallback((action: string, context?: any) => {
    logger.userAction(action, { component: componentName, ...context });
  }, [componentName]);

  const logPerformance = useCallback((name: string, duration: number, context?: any) => {
    logger.performance(name, duration, { component: componentName, ...context });
  }, [componentName]);

  return {
    logError,
    logInfo,
    logWarn,
    logDebug,
    logUserAction,
    logPerformance
  };
};