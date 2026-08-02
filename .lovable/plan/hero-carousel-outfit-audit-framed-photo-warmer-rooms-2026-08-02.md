# Hero carousel: outfit audit, framed photo, warmer rooms

## Goal
Every slide reads as a different life: no repeated or near-matching outfits within or across frames, rooms that feel fully lived in and warm, and the Detroit man holding a clear color portrait of his wife's face.

## 1. Outfit and similarity audit
Review all ten images in `src/assets/hero-carousel/cheesy/` side by side and log, per person: garment type, color, silhouette, headwear, eyewear, footwear. Flag any pair that shares two or more of: dominant color, garment type, headwear style. Flag repeated framing or pose across slides too.

Only the flagged slides get regenerated. Slides that already pass stay untouched.

## 2. Framed photo (Detroit loft slide)
Regenerate `man-with-framed-memory.jpg` so the frame he holds contains a warm color portrait of an elderly woman, her face clearly legible and lit, filling the frame. Everything else about the slide (loft, pose, wardrobe) stays as-is unless the audit flags it.

## 3. Fully decorated, warm rooms
For every regenerated slide, push interior dressing further: layered rugs, art on more than one wall, shelves with books and objects, plants, lamps with warm bulbs, throws and cushions, small personal clutter. No empty walls, no bare corners. Keep the modern 2026 warm-minimal direction, keep regional distinctiveness (Miami, Yellowstone, Detroit, New Mexico, etc.), keep the wide framing with headroom so no head is cropped.

## Constraints carried forward
- Same cheesy straight-to-camera portrait energy, couples posed close and affectionate.
- Elderly subjects in current Gen Z fits.
- Wide framing, whole room visible, roughly 30 percent ceiling space.
- Low grain, warm grade, no true orange.

## Technical notes
Images are regenerated in place at the same paths, so `src/components/landing/HeroCarousel.tsx` imports need no change. After regeneration, verify the carousel renders all ten slides and the build passes.
