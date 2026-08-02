# hero carousel: no cropped heads, ten american rooms, less grain

Three fixes: framing so the nav bar and the fullscreen crop never clip a head, ten regionally distinct American interiors instead of variations on the same house, and a lighter film treatment.

## 1. Heads never get cropped

The carousel fills the whole viewport and crops the image to fit, so tall narrow viewports cut the top and bottom. Two changes together:

- Regenerate every image much wider and further back, with the subjects sitting in the middle third of the frame and roughly the top 30 percent of the image as empty room and ceiling. Full bodies with floor visible below the feet.
- Shift the image crop anchor so the safe center of each frame stays on screen instead of the top edge being sacrificed. This is a small style change in `HeroCarousel.tsx`.

## 2. Ten different places in America

Each slide gets a room that belongs to a specific region, so the set reads like a road trip:

| slide | place |
| --- | --- |
| couple-on-couch | midwest Ohio wood-panel basement rec room, bowling trophies, snow outside |
| joyful-heritage-living-room | Atlanta Georgia parlor, floral wallpaper, sweet tea, church fans, porch light |
| asian-couple | Honolulu Hawaii lanai, rattan, hibiscus, ocean light through jalousie windows |
| pride-couple | Miami Beach art deco apartment, pastel terrazzo, palms, pink and mint walls |
| cowboys-with-wheelchair | Montana lodge near Yellowstone, log walls, elk antlers, mountain window |
| native-american-women | New Mexico adobe home, vigas, woven rugs, high desert light |
| retro-peace | San Francisco bay window flat, houseplants, records, fog outside |
| friends-with-cats | New Orleans shotgun house, high ceilings, ceiling fan, jazz posters |
| warm-gathering | coastal Maine cottage, white shiplap, buoys, lobster traps, harbor window |
| man-with-framed-memory | Detroit Michigan brick apartment, radiator, Motown records, steel window |

Wall color, flooring, furniture, and window light all differ per room. No two slides share a palette.

## 3. Less grain

Soften the film treatment in `HeroCarousel.tsx` so the photos read clean and modern rather than heavily processed:

- Cut the three grain overlay layers roughly in half (soft-light 0.75 to 0.3, multiply 0.25 to 0.1, remove the screen layer).
- Ease the sepia grade so skin and color stay natural.
- Keep the vignette, just lighter.

## What stays the same

- Same 10 filenames, slide order, year labels, taglines.
- Same people and pairings: 3 heterosexual couples, 3 male couples, 3 female couples, plus the solo man holding his framed photo.
- Gen z streetwear: baggy jeans, cargos, oversized graphic tees, cropped puffers, bucket hats, chunky sneakers, wire sunglasses, layered chains.
- Stiff posed straight-to-camera portrait energy, distinct faces and outfits, no twinning.

## Technical

- Regenerate all 10 files in place at `src/assets/hero-carousel/cheesy/`.
- Edit only the image style and overlay opacities in `HeroCarousel.tsx`; imports and slide data untouched.
- Verify with a build plus hero screenshots at desktop, tablet, and mobile widths, checking the top of every head clears the nav bar on each slide.
