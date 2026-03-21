

## Product Shots + Promo Video for Heartlines

### Part 1: Product Shots (3-4 polished screenshots)

Capture screenshots of key pages, then run them through the product shot generator with a custom gradient matching the Heartlines burgundy/coral palette.

**Pages to capture:**
1. Landing page hero (top fold with phone demo + branding)
2. Pricing page
3. Chat interface (if accessible without auth, otherwise the phone demo close-up)
4. "Meet Kai" or "How It Works" section

**Style:** Custom mesh gradient using the Heartlines palette — deep burgundy (#33000D), warm coral (#E8735A), soft pink (#D4A574). The `candy` or `ember` preset may work, but a custom gradient from the brand colors will look more cohesive.

**Output:** 4 PNG files in `/mnt/documents/` — each screenshot framed in a macOS-style window with drop shadow on a rich branded gradient background.

### Part 2: Product Walkthrough Video (30s, 9:16 vertical)

A Remotion-rendered MP4, 1080x1920 (vertical), 30fps, ~900 frames.

**Creative Direction:**
- **Palette:** Deep burgundy (#33000D), coral (#E8735A), cream (#FAF5F5), warm gold (#D4A574)
- **Fonts:** Shrikhand (brand display), Inter (body) via @remotion/google-fonts
- **Motion style:** Luxury/Editorial — smooth ease curves, refined pacing, warm tones
- **Motifs:** Soft gradient orbs (matching PremiumBackground), glassmorphic panels, subtle pulse/breathe animations

**Scene Breakdown (~30s at 30fps = 900 frames):**

1. **Hook (0-3s / frames 0-90):** Heartlines wordmark fades in with warm glow. Tagline "powered by laurie ai" appears beneath. Burgundy-to-coral gradient breathes slowly.

2. **Problem Statement (3-8s / frames 90-240):** Typographic scene — "relationships are hard." → "getting help shouldn't be." Elegant text reveals with spring physics.

3. **Meet Kai (8-14s / frames 240-420):** The kai avatar slides in with a glassmorphic chat bubble showing a sample exchange. Phone mockup frame with the chat interface product shot composited in.

4. **Features (14-22s / frames 420-660):** 3 feature cards animate in sequence — "phd-level psychology", "evidence-based", "lgbtq+ inclusive". Each with a small icon and brief label. Staggered spring entries.

5. **CTA/Close (22-30s / frames 660-900):** Heartlines phone lockup image scales up elegantly. "your relationship deserves better" in Shrikhand. Warm gradient pulse as the logo settles.

**Transitions:** Wipe and fade from @remotion/transitions, consistent throughout.

**Output:** `/mnt/documents/heartlines-promo.mp4` (1080x1920, 9:16 vertical)

### Execution Order

1. Take 4 screenshots using browser tools
2. Generate 4 product shots via the product shot script
3. Scaffold Remotion project, build scenes, render video
4. QA all outputs visually before delivering

### Technical Details

- Product shots: Python script from `knowledge://skill/product-shot/generate.py` with custom `--gradient "#33000D,#E8735A,#D4A574"`
- Video: Remotion 4.x with programmatic render script, `chromeMode: "chrome-for-testing"`, `muted: true`, `concurrency: 1`
- All outputs to `/mnt/documents/`
- Brand assets (kai avatar, wordmark, phone lockup) copied into the Remotion `public/` directory for use as static files

