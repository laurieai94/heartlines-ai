# hero carousel: more grain, no cropped heads

Two changes, both in the carousel component. No image regeneration.

## 1. Stronger film grain on every slide

The carousel already renders two grain layers over each photo (a soft-light layer at 0.3 opacity and a multiply layer at 0.1). They read as very subtle at the current settings.

- Raise the soft-light grain to a clearly visible level and nudge the multiply/dust layer up with it.
- Tighten the noise frequency slightly so the grain reads as film stock rather than digital fuzz.
- Grain stays identical across all ten slides so the set feels shot on one roll.

## 2. Heads never crop

Heads get clipped when the viewport is shorter and wider than the source photos, because the image fills the frame and the crop eats the top of the picture.

- Shift the image anchor higher so the crop always keeps the ceiling space that each photo was generated with.
- Add a slight downward safe zone on short viewports so the top nav bar never overlaps a head.

## Verification

Screenshots of the hero at desktop (1440x900), the current preview size (999x700), tablet, and mobile, confirming every head has clear space below the nav and the grain is visible on each slide.

## Technical

- File: `src/components/landing/HeroCarousel.tsx` only.
- Adjust `feTurbulence baseFrequency` and the two grain overlay opacities.
- Adjust the `objectPosition` Y value used by the slide `<img>`.
