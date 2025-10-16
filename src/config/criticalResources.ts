// Critical resources that must load before showing the landing page
import { BRAND } from '@/branding';

// Mobile: Only load truly critical above-fold images
// Desktop: Load additional resources for better initial experience
export const CRITICAL_IMAGES_MOBILE = [
  BRAND.coach.avatarSrc,
  BRAND.phoneLockupSrc,
] as const;

// Lazy load these on mobile (not blocking)
export const CRITICAL_IMAGES_DESKTOP = [
  BRAND.coach.avatarSrc,
  BRAND.phoneLockupSrc,
] as const;

// Use mobile-optimized list for faster initial load
export const CRITICAL_IMAGES = 
  typeof window !== 'undefined' && window.innerWidth < 768
    ? CRITICAL_IMAGES_MOBILE
    : CRITICAL_IMAGES_DESKTOP;

export type CriticalImage = typeof CRITICAL_IMAGES[number];
