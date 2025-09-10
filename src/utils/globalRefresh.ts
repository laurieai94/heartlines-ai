/**
 * Global refresh utility for coordinating data refresh across the app
 */

export const refreshAllAppData = async () => {
  // Dispatch events to refresh all app data
  window.dispatchEvent(new CustomEvent('profile:forceReload', {
    detail: { profileType: 'all' }
  }));
  
  window.dispatchEvent(new CustomEvent('user-profile:refresh'));
  
  window.dispatchEvent(new CustomEvent('chat:refresh'));
};