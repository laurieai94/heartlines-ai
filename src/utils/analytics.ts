import { logger } from './logger';

export const logEvent = (name: string, props?: Record<string, any>) => {
  try {
    logger.debug(`[analytics] ${name}`, props ?? {});
  } catch {
    // no-op
  }
};
