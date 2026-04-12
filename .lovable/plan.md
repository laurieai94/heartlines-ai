

## Fix user avatar shape and regenerate California couple image

### 1. Make user avatars circular
The `img` tags for user avatars in `HeroPhoneScroll.tsx` have `rounded-full` but may render with visible corners due to the ring or missing overflow clipping. Fix by wrapping user avatar images in a circular container with `overflow-hidden rounded-full`, ensuring the image is fully clipped to a circle.

**File:** `src/components/HeroPhoneScroll.tsx`
- Line 49-53 (ChatRow component): Wrap the `img` in a `div` with `w-6 h-6 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full overflow-hidden ring-2 ring-coral-400/40 flex-shrink-0`, move ring styling to the wrapper
- Line 326-330 (typing indicator user avatar): Same wrapping fix

### 2. Regenerate California couple image
Re-generate `retro-peace-living-room.webp` with the couple more zoomed out (showing more of the room) and visibly happier/smiling. Same prompt style: 35mm film, 14mm wide-angle, warm California home, fit white couple in 70s in athletic wear — but pulled back further and with big genuine smiles.

**File:** `src/assets/hero-carousel/retro-peace-living-room.webp` — overwrite with new generation

### Technical summary
- `HeroPhoneScroll.tsx` — wrap user avatar `img` elements in overflow-hidden circular containers (2 locations)
- `retro-peace-living-room.webp` — regenerate via AI image API with wider framing and happier expressions

