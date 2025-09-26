// Production-optimized analytics with zero overhead
const isProduction = !import.meta.env.DEV;

export const logEvent = (name: string, props?: Record<string, any>) => {
  // No-op in production for zero performance impact
  if (isProduction) return;
  
  try {
    console.debug(`[analytics] ${name}`, props ?? {});
  } catch {
    // no-op
  }
};

// Auth flow specific events - optimized for production
export const trackAuthFlow = isProduction ? {
  // No-op functions in production
  signUpStarted: () => {},
  signUpCompleted: () => {},
  signInStarted: () => {},
  signInCompleted: () => {},
  progressViewed: () => {}
} : {
  // Full functionality in development
  signUpStarted: () => logEvent('auth_signup_started'),
  signUpCompleted: () => logEvent('auth_signup_completed'),
  signInStarted: () => logEvent('auth_signin_started'),
  signInCompleted: () => logEvent('auth_signin_completed'),
  progressViewed: (step: number) => logEvent('auth_progress_viewed', { step })
};
