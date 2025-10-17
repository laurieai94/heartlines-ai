// Centralized iOS detection utility

export const isIOS = (() => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
})();

export const iOSVersion = (() => {
  if (!isIOS || typeof navigator === 'undefined') {
    return null;
  }
  const match = navigator.userAgent.match(/OS (\d+)_/);
  return match ? parseInt(match[1], 10) : null;
})();

export const isSafari = (() => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }
  return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
})();

export const isLegacyIOSSafari = isIOS && iOSVersion !== null && iOSVersion < 13;

export const iosInfo = {
  isIOS,
  iOSVersion,
  isSafari,
  isLegacyIOSSafari,
  supportedFeatures: {
    visualViewport: !isLegacyIOSSafari && typeof window !== 'undefined' && !!window.visualViewport,
    backdropFilter: typeof window !== 'undefined' && CSS.supports('backdrop-filter', 'blur(10px)'),
  }
};
