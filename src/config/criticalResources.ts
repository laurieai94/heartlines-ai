// Critical resources that must load before showing the landing page
import { BRAND } from '@/branding';
import heartlinesLogo from "@/assets/heartlines-logo-white.svg";
import image2016 from "@/assets/hero-carousel/elderly-native-american-women.webp";
import image2018 from "@/assets/hero-carousel/joyful-heritage-living-room.webp";
import image2020 from "@/assets/hero-carousel/cowboys-with-wheelchair.webp";
import image2022 from "@/assets/hero-carousel/warm-gathering-diverse-souls.webp";
import image2024 from "@/assets/hero-carousel/manos-unidas.webp";
import image2025 from "@/assets/hero-carousel/warm-embrace-pride.webp";
import image2027 from "@/assets/hero-carousel/couple-on-couch.webp";
import imageAsianCouple from "@/assets/hero-carousel/asian-couple-serene-moment.webp";
import imageFramedMemory from "@/assets/hero-carousel/man-with-treasured-memory.webp";
import imageFriendsCats from "@/assets/hero-carousel/friends-cats-city-view.webp";
import imageRetroPeace from "@/assets/hero-carousel/retro-peace-living-room.webp";
import imageVintageHome from "@/assets/hero-carousel/warm-smiles-vintage-home.webp";

// Mobile: Load critical above-fold images + first 4 carousel slides
// Desktop: Load all resources for complete initial experience
export const CRITICAL_IMAGES_MOBILE = [
  heartlinesLogo,           // Logo is most critical - must appear instantly
  BRAND.coach.avatarSrc,
  BRAND.phoneLockupSrc,
  image2016,                // First 4 carousel images for smooth start
  image2018,
  image2020,
  imageAsianCouple,
] as const;

// Desktop: Preload ALL carousel images for zero progressive loading
export const CRITICAL_IMAGES_DESKTOP = [
  heartlinesLogo,           // Logo is most critical - must appear instantly
  BRAND.coach.avatarSrc,
  BRAND.phoneLockupSrc,
  image2016,                // All 12 carousel images
  image2018,
  image2020,
  imageAsianCouple,
  image2022,
  imageFramedMemory,
  image2024,
  imageFriendsCats,
  image2025,
  imageRetroPeace,
  image2027,
  imageVintageHome,
] as const;

// Use mobile-optimized list for faster initial load
export const CRITICAL_IMAGES = 
  typeof window !== 'undefined' && window.innerWidth < 768
    ? CRITICAL_IMAGES_MOBILE
    : CRITICAL_IMAGES_DESKTOP;

export type CriticalImage = typeof CRITICAL_IMAGES[number];
