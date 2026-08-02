# hero carousel: no cropped heads, everyone reads 70+

Two problems visible in the screenshots: the top of a head sits under or is clipped by the burgundy nav bar, and several subjects read as late 50s or 60s rather than genuinely elderly.

## 1. Heads never touch the top edge

Two changes working together:

- Framing anchor: shift the carousel image crop down so the top of the frame is preserved instead of sacrificed. Change `objectPosition` in `HeroCarousel.tsx` from `50% 45%` to roughly `50% 62%`, so the empty ceiling area at the top of each source image stays on screen and the extra crop comes off the floor instead.
- Source images: regenerate any slide where the subject's head sits above the vertical midpoint. Target composition is heads landing around 35 to 45 percent down the frame, with clear empty wall and ceiling above and floor visible below the feet.

After the change, check each slide at desktop, tablet, and mobile widths and confirm the top of every head clears the nav bar with visible space.

## 2. Every person reads 70 or older

Regenerate any subject who does not clearly read 70+. Age cues to specify in every prompt:

- Fully white or silver hair, thinning at the temples, or bald.
- Deep set facial lines, crow's feet, nasolabial folds, softened jawline, visible age spots on hands and face.
- Older posture and body language, thinner or more relaxed frame.
- Age range stated explicitly as 72 to 85 for every person in the frame.

## What stays exactly the same

- Same 10 filenames, slide order, year labels, taglines, and imports.
- Same pairings: 3 heterosexual couples, 3 male couples, 3 female couples, plus the solo man holding the color portrait of his wife.
- Gen Z streetwear fits, warm affectionate couple posing, straight to camera.
- Same ten modern regional interiors, fully decorated and warm.
- No matching outfits within a frame, no twinning, every face fully visible.
- Current grain, sepia grade, and vignette levels.

## Technical

- Edit only `objectPosition` in `src/components/landing/HeroCarousel.tsx`.
- Regenerate affected images in place at `src/assets/hero-carousel/cheesy/*.jpg` at 1920x1200.
- Verify with a build plus hero screenshots at three widths, cycling all ten slides.
