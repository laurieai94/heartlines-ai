## Fix the two visual glitches on the hero phone mock

Two issues visible in the screenshot on `/`:

### 1. Mystery line above the first chat bubble

The chat header (`src/components/landing/HeroPhoneScroll.tsx` line 265) has `border-b border-white/10`. Because the messages area uses `flex-1` and bubbles flow from the top, there's a clear horizontal divider line followed by empty space before the first bubble — making the line look orphaned.

**Fix:** Remove the `border-b border-white/10` from the chat header. The header already has its own translucent gradient background which gives enough visual separation from the messages area. No divider line needed.

### 2. Bottom-right corner cut off / phone clipped on the right

The floating CTA button (line 218) is positioned `absolute top-0 right-0` with `translate-x-2 sm:translate-x-4` — pushing it past the right edge of its container. When the hero column is narrow (around the current ~895px viewport before `sm`/`md` kicks in fully), the button + its blur halo + the phone's rounded corner sit flush against (or past) the section's right edge, creating the clipped look.

**Fix:** 
- Reduce the outward translate on the CTA button so it stays inside the container: change `translate-x-2 sm:translate-x-4 -translate-y-2 sm:-translate-y-4` → `translate-x-0 sm:translate-x-2 -translate-y-0 sm:-translate-y-2`. The button still floats over the phone's top-right corner but no longer pokes past the parent's right edge.
- Add a small right-side safety pad on the phone wrapper (line 242): change `pt-4 pb-0 px-0 sm:p-2 lg:p-4` → `pt-4 pb-0 px-2 sm:p-2 lg:p-4` so the phone itself never touches the section's right edge on small/medium viewports.

### Files

- `src/components/landing/HeroPhoneScroll.tsx` — three small className edits (header divider, CTA translate, wrapper padding)

### Out of scope

- No changes to the phone size, aspect ratio, conversation content, or section spacing.
- No changes to the CTA button's color or shape — only its position.
