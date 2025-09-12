import { BRAND } from "@/branding";

// Preload Kai's avatar image to ensure immediate loading
export const preloadKaiAvatar = () => {
  if (typeof window !== 'undefined') {
    const img = new Image();
    img.src = BRAND.coach.avatarSrc;
    
    // Cache the image
    img.onload = () => {
      console.log('Kai avatar preloaded successfully');
    };
    
    img.onerror = () => {
      console.warn('Failed to preload Kai avatar');
    };
  }
};

// Auto-preload on module import
preloadKaiAvatar();