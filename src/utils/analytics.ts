import { logger } from './logger';

export const logEvent = (name: string, props?: Record<string, any>) => {
  try {
    logger.debug(`[analytics] ${name}`, props ?? {});
  } catch {
    // no-op
  }
};

// Auth flow specific events
export const trackAuthFlow = {
  signUpStarted: () => logEvent('auth_signup_started'),
  signUpCompleted: () => logEvent('auth_signup_completed'),
  signInStarted: () => logEvent('auth_signin_started'),
  signInCompleted: () => logEvent('auth_signin_completed'),
  progressViewed: (step: number) => logEvent('auth_progress_viewed', { step })
};
