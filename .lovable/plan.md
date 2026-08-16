# showcase: phone always fully visible, top and bottom

The showcase phone currently gets clipped: the status bar row at the top and the composer/rounded bottom edge run past the visible area at some window sizes.

## Cause

The phone frame is sized from viewport units (`min(72svh, 640px)`) rather than from the space its column actually has. The right column shares a fixed-height grid row with the headline column and also has to fit the caption and the progress dots below the phone, so on shorter or wider windows the requested height exceeds the room available and the frame overflows.

## What changes

- Size the phone from the space its container actually gives it, not from viewport units: the frame becomes a height-constrained flex child whose width follows from its 11/18 aspect ratio.
- Reserve room for the caption and progress dots in the same height budget so they never push the phone past the edges.
- Add small top/bottom breathing room so the status row and the rounded bottom edge, including the glow, always sit inside the visible area.
- Keep the phone as large as the space allows, so nothing shrinks unnecessarily on tall screens.

## Verification

Playwright screenshots of `/showcase` at 1440x900, 1280x800, the current preview size (961x697), 1024x1366 tablet, and 390x844 mobile, confirming the 9:41 status row, the header, the composer, and the rounded bottom corners are fully visible at each size, with the caption and dots below still in frame.

## Technical

- Files: `src/components/showcase/KaiScreenRecording.tsx` (primary), `src/pages/Showcase.tsx` only if the right column needs a min-height-0 or padding adjustment.
- Replace `maxHeight: "min(72svh, 640px)"` with container-driven sizing (`flex-1 min-h-0` plus `height: 100%`, `width: auto`, aspect ratio preserved) and keep the caption block `shrink-0`.
