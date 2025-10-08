// Critical resources that must load before showing the landing page
import { BRAND } from '@/branding';
import sarahAvatar from '@/assets/money-woman-avatar.png';
import mayaAvatar from '@/assets/millennial-african-american-woman.png';
import alexAvatar from '@/assets/gay-man-avatar.png';
import jordanAvatar from '@/assets/moving-in-avatar.png';
import marcusAvatar from '@/assets/new-dad-avatar.png';

// Import first two carousel images as critical resources
import warmGatheringImage from '@/assets/warm-gathering-diverse-souls.png';
import elderlyCouplePrideLivingRoomImage from '@/assets/elderly-couple-pride-living-room.png';

export const CRITICAL_IMAGES = [
  BRAND.coach.avatarSrc,
  BRAND.phoneLockupSrc,
  sarahAvatar,
  mayaAvatar,
  alexAvatar,
  jordanAvatar,
  marcusAvatar,
  // First two carousel images for immediate hero display
  warmGatheringImage,
  elderlyCouplePrideLivingRoomImage
] as const;

export type CriticalImage = typeof CRITICAL_IMAGES[number];
