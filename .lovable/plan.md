

## Rebuild Kai Demo Video — Match Site's Actual Interface

The current Remotion demo looks nothing like the real app. This rebuild will replicate the exact `ProductPhoneDemo` component styling from the site into the Remotion scenes.

### What's Wrong Now

1. Chat bubbles are nearly invisible (opacity too low)
2. Phone UI doesn't match the site — missing avatars, wrong bubble styles, no input bar, no glow effects
3. "heartlines" wordmark uses wrong font (CrimsonText instead of Shrikhand)
4. No avatar circles next to messages, no gradient backgrounds

### What the Site Actually Looks Like

From `ProductPhoneDemo.tsx`:
- **Phone**: 300x600px, `rounded-[3rem]`, `border-8 border-white/15`, dark gradient bg (`from-burgundy-900 via-burgundy-800 to-coral-900`)
- **Header**: Kai avatar (purple-to-pink gradient fallback) with green online dot, coach name, theme subtitle, info icon
- **Kai bubbles**: `bg-white/10` with `border-2 border-white/30` (variant="kai" from ChatBubble)
- **Maya bubbles**: `bg-gradient-to-br from-coral-400/20 to-pink-500/30` with `border-2 border-coral-400/40` (variant="maya")
- **Avatars**: Small 24px circles next to each message — Kai gets purple-pink gradient, Maya gets coral-pink with initial "M"
- **Typing indicator**: Purple bubble (`bg-purple-600/90`) with 3 bouncing dots
- **Input bar**: `bg-white/10` rounded-full with "chat with kai" placeholder + coral send button
- **Glow effects**: Burgundy and coral blur circles

### Technical Plan

**`remotion/src/scenes/KaiDemoScene.tsx`** — Complete rebuild:
- Replicate the phone frame exactly: `bg-gray-900`, `rounded-[3rem]`, `border-8 border-white/15`
- Inner gradient: `from-burgundy-900 via-burgundy-800 to-coral-900`
- Header with avatar circle (purple-pink gradient), green dot, "kai" name, "communication" theme
- Kai bubbles: white/10 bg, white/30 border, avatar beside each
- Maya bubbles: coral-pink gradient bg, coral/40 border, "M" avatar
- Typing indicator: purple-600/90 bubble with animated dots
- Input bar at bottom with send button
- Decorative glow blurs (using `filter: blur()` not `backdropFilter`)
- Phone notch bar at top

**`remotion/src/scenes/IntroScene.tsx`** — Fix branding:
- Use Shrikhand font for "heartlines" wordmark (via `@remotion/google-fonts/Shrikhand`)
- Apply pink-to-orange gradient text effect
- Add "powered by laurie ai" tagline

**`remotion/src/scenes/OutroScene.tsx`** — Same branding fixes:
- Shrikhand wordmark
- Tagline + "say what you actually mean"

**`remotion/package.json`** — Add Shrikhand font dependency

### No changes to the web app. Only `remotion/` files, then re-render to `/mnt/documents/kai-demo.mp4`.

