

## Fix: Rebrand Campaign Assets to Match Heartlines Site

The quote cards, carousel, and demo reel are using off-brand colors (light cream backgrounds, Instrument Sans font) instead of the actual Heartlines visual identity. Here's the fix:

### What's Wrong
- **Background**: Using off-white #F5F0EB instead of deep burgundy #33000D / #660029
- **Font**: Using Instrument Sans instead of **Shrikhand** (brand wordmark), **Crimson Text** (serif body), **Playfair Display** (headings), and **Glacial Indifference** (taglines)
- **Logo**: Not using the actual heartlines logo/wordmark from the site assets
- **Color palette**: Missing the burgundy-dominant dark theme with cream text (#FAF5F5), warm gold accents (#D4A574), and coral highlights (#E8735A)

### What Changes

**Quote Cards + Carousel (Python/Pillow script):**
- Dark burgundy backgrounds (#33000D) with subtle gradient or glassmorphic overlay
- Cream (#FAF5F5) text using Shrikhand for hero words and Playfair Display or Crimson Text for body lines
- Warm gold (#D4A574) accent lines instead of coral dividers
- Pull the actual heartlines wordmark logo from `public/lovable-uploads/heartlines-logo.png` for the footer lockup
- "powered by laurie ai" in Glacial Indifference, matching site tagline styling

**Demo Reel (Remotion scenes):**
- Scene backgrounds: burgundy (#33000D) instead of cream
- Text color: cream (#FAF5F5) instead of dark
- Use Shrikhand for the "heartlines" wordmark renders
- Use Playfair Display or Crimson Text for body copy
- Phone mockup already uses burgundy — keep that, but update surrounding scenes
- Copy the wordmark logo into `remotion/public/` for the CTA scene

### Steps
1. Download brand fonts (Shrikhand, Crimson Text, Playfair Display, Glacial Indifference) from Google Fonts
2. Regenerate all 5 quote cards + 5 carousel slides with corrected palette, fonts, and logo
3. Update Remotion scene components (Scene1Hook, Scene3Bridge, Scene4Lines, Scene5CTA) to use burgundy backgrounds + cream text + brand fonts
4. Re-render the demo reel video
5. QA all 11 assets visually before delivering

