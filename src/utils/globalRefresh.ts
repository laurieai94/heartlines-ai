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

export const refreshPersonalProfile = async () => {
  // Dispatch events to refresh only personal profile data
  window.dispatchEvent(new CustomEvent('profile:forceReload', {
    detail: { profileType: 'personal' }
  }));
  
  window.dispatchEvent(new CustomEvent('profile:clear', {
    detail: { profileType: 'personal' }
  }));
};

export const refreshPartnerProfile = async () => {
  // Dispatch events to refresh only partner profile data
  window.dispatchEvent(new CustomEvent('profile:forceReload', {
    detail: { profileType: 'partner' }
  }));
  
  window.dispatchEvent(new CustomEvent('profile:clear', {
    detail: { profileType: 'partner' }
  }));
};

export const clearAllProfileData = async () => {
  // Dispatch events to clear all profile data
  window.dispatchEvent(new CustomEvent('profile:clear', {
    detail: { profileType: 'all' }
  }));
};