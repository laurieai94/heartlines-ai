

## Update CommunityIcon to "Hands Reaching Out"

### Change
Replace the current CommunityIcon SVG (circles and arcs) with two open hands reaching upward/outward, cupping a small seedling or heart -- a clear "giving back" visual.

### Technical Detail

**File: `src/components/ui/timeline.tsx`** (lines 95-111)

Replace the CommunityIcon SVG paths with new paths depicting:
- Two open hands reaching out from the bottom, palms up
- A small sprout/seedling rising from the cupped hands
- Same 32x32 viewBox, same `community-gradient`, same stroke style (1.5 width, round caps)

The new paths will draw:
- Left hand: curved palm and fingers reaching up-right
- Right hand: curved palm and fingers reaching up-left
- Small stem with two leaves between the hands

No other files need changes -- the component name stays `CommunityIcon`.

