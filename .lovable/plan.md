## Fix the hero phone clipping and square edge

The glow is still getting clipped because the hero section itself has `overflow-hidden`, so anything extending outside the phone area gets chopped. The square edge at the bottom-right is coming from the phone’s inner gradient/input layers being clipped by a rounded parent but not shaped enough at the bottom.

### Changes

- Update the main hero section wrapper in `src/components/landing/LandingPage.tsx` from `overflow-hidden` to `overflow-visible` so the floating button glow can extend naturally.
- Keep horizontal page safety by leaving the outer page wrapper as `overflow-x-hidden`, so this won’t create sideways scrolling.
- In `src/components/landing/HeroPhoneScroll.tsx`, give the phone shell a slightly stronger outer radius and isolate its clipping so the rounded mask behaves cleanly.
- Round the input-area bottom corners to match the phone shell, so the bottom-right no longer reads as a hard square edge.
- Slightly increase the CTA glow clearance/position only if needed so it sits inside the visible canvas while the blur remains fully visible.

### Validation

- Preview mobile at 390×844 around the hero phone.
- Confirm the pink CTA glow is no longer cut off.
- Confirm the bottom-right of the phone reads as rounded, with no visible square edge.