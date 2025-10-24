// Critical resources that must load before showing the landing page
import { BRAND } from '@/branding';
import image2016 from "@/assets/hero-carousel/elderly-native-american-women.webp";
import image2018 from "@/assets/hero-carousel/joyful-heritage-living-room.webp";
import image2020 from "@/assets/hero-carousel/cowboys-with-wheelchair.webp";
import image2022 from "@/assets/hero-carousel/warm-gathering-diverse-souls.webp";

// Mobile: Only load truly critical above-fold images
// Desktop: Load additional resources for better initial experience
export const CRITICAL_IMAGES_MOBILE = [
  BRAND.coach.avatarSrc,
  BRAND.phoneLockupSrc,
  image2016, // First hero image for instant display
] as const;

// Lazy load these on mobile (not blocking)
export const CRITICAL_IMAGES_DESKTOP = [
  BRAND.coach.avatarSrc,
  BRAND.phoneLockupSrc,
  image2016,
  image2018,
  image2020,
  image2022,
] as const;

// Use mobile-optimized list for faster initial load
export const CRITICAL_IMAGES = 
  typeof window !== 'undefined' && window.innerWidth < 768
    ? CRITICAL_IMAGES_MOBILE
    : CRITICAL_IMAGES_DESKTOP;

export type CriticalImage = typeof CRITICAL_IMAGES[number];
