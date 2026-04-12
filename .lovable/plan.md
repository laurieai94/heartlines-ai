
Goal: use your exact 2077 line and fix the remaining square avatar, which is Kai’s inline message avatar.

What I found
- `src/components/HeroCarousel.tsx` already overrides the 2077 slide, but it currently says `isn't this what it's all for?`
- `src/components/HeroPhoneScroll.tsx` already fixed the user avatars.
- The avatar still showing square in your screenshot is Kai’s assistant avatar on the left side of the chat. Those spots still use plain `<img>` tags instead of the same clipped circular wrapper.

Implementation
1. Update the 2077 tagline
- In `src/components/HeroCarousel.tsx`, change the 2077 copy to the exact text:
  `this is what it's all for`

2. Make Kai’s inline avatars truly circular
- In `src/components/HeroPhoneScroll.tsx`, update both assistant-avatar locations:
  - the `ChatRow` assistant avatar
  - the assistant typing indicator avatar
- Keep the current look and halo, but put Kai’s image inside a fixed-size circular wrapper with:
  - `aspect-square`
  - `rounded-full`
  - `overflow-hidden`
  - `flex-shrink-0`
- Make the inner image fill the wrapper with `w-full h-full object-cover block rounded-full`
- Keep `FlameIconHalo`, but wrap the clipped circle inside it so the halo stays outside while the avatar itself is actually round.
- If the asset still feels boxy, slightly tighten the crop so Kai fills the circle more like the header avatar.

Files to update
- `src/components/HeroCarousel.tsx`
- `src/components/HeroPhoneScroll.tsx`

QA after implementation
- Check the homepage at the same mobile-sized viewport as your screenshot.
- Verify Kai is circular in:
  - assistant message rows
  - assistant typing state
- Verify the 2077 slide reads exactly:
  `this is what it's all for`
