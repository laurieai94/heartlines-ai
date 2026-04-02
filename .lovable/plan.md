

## Fix: Replace Logo + Add Flip Phone to Campaign Assets

The generated quote cards, carousel slides, and demo reel are using the wrong heartlines logo. The correct brand identity features the **flip phone illustration** (from `src/assets/heartlines-flip-phone.png` or the SVG at `src/assets/flip-phone.svg`) paired with the Shrikhand wordmark, matching the uploaded reference images.

### What Changes

**Quote Cards + Carousel (Python/Pillow regeneration):**
- Replace the current logo lockup at the bottom of each card with the **flip phone illustration** (`src/assets/heartlines-flip-phone.png`) + "heartlines" wordmark + "powered by laurie ai" tagline — matching the layout in the uploaded reference images
- Two layout options based on your references: phone bottom-left with wordmark bottom-right (image 13), or phone centered below wordmark (image 14), or phone as background element with quote overlay (image 15)
- Use the reference image style: flip phone drawn in pink/coral line art on burgundy, wordmark in white Shrikhand

**Demo Reel (Remotion Scene5CTA):**
- Add the flip phone illustration to the CTA scene as a static or animated element
- Copy `src/assets/heartlines-flip-phone.png` into `remotion/public/` for use via `staticFile()`
- Position it alongside the wordmark similar to the uploaded reference layouts

### Steps
1. Copy flip phone asset into the Remotion public directory
2. Regenerate all 5 quote cards with flip phone + correct wordmark lockup
3. Regenerate all 5 carousel slides with the same treatment
4. Update Scene5CTA to include the flip phone illustration
5. Re-render demo reel
6. QA all 11 assets visually

