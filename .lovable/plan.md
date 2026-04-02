

## Heartlines Campaign Assets — Pillar 1: Messy Modern Love

First batch: raw, editorial-tone assets for TikTok and Instagram focused on the "beat between your overthinking and your actual words" messaging.

### Deliverables

**1. Quote/Text Cards (5 static images, 1080x1350 for feed)**

Zine-inspired design: off-white/cream textured backgrounds, lowercase type, tight leading, subtle burgundy accents. Each card features one sharp line from the playbook:

- "stop writing twelve drafts and land on one line you'd actually say out loud."
- "advice that knows the lore."
- "turn 'did i overreact?' into 'here's my next move.'"
- "figure out love while you're still feeling it."
- "your 2am texts help fund 2pm support in your community."

Small heartlines wordmark + "powered by laurie ai" lockup at the bottom. Generated as PNGs via Python/Pillow with downloaded editorial fonts.

**2. Product Demo Reel (1 x 15-20s vertical video, 1080x1920)**

Remotion-built reel with raw editorial energy — no flashy transitions, just honest pacing:

- Scene 1 (3s): Big lowercase text fading in: "it's 1:47am. you're staring at a text."
- Scene 2 (4s): Phone mockup showing Kai chat interface, message typing animation
- Scene 3 (4s): Text card: "heartlines steps into the beat between your overthinking and your actual words"
- Scene 4 (3s): Quick cuts of playbook copy lines appearing one by one
- Scene 5 (3s): Wordmark + "stronger relationships start here" + app store hint

Muted palette, thin editorial typography, deliberate pacing. No music (muted render).

**3. Carousel Post (1 x 5-slide set, 1080x1350 PNGs)**

Editorial storytelling carousel for Instagram:

- Slide 1: "the messy middle" — hook slide with big type
- Slide 2: The problem — "most tools help you find people or heal later. nothing helps you with the text you're about to send."
- Slide 3: The solution — "meet kai. an ai relationship coach built for that gap."
- Slide 4: What it does — 3-4 short bullet points from playbook value drivers
- Slide 5: CTA — heartlines wordmark + "stronger relationships start here"

Same zine aesthetic as the quote cards for visual consistency.

### Visual System

- **Backgrounds**: Off-white (#F5F0EB) with subtle paper grain texture, occasional burgundy (#33000D) panels for contrast slides
- **Typography**: Thin editorial sans-serif (Instrument Sans or similar from Google Fonts), all lowercase, generous tracking
- **Accent**: Muted coral (#E8735A) for highlights, warm gold (#D4A574) sparingly
- **Heartlines branding**: Small wordmark from project assets, never dominant
- **Feel**: Like a poetry broadsheet or indie zine — restrained, honest, typographic

### Technical Approach

- Quote cards + carousel: Python script with Pillow, custom fonts, paper texture overlay
- Demo reel: Remotion project (1080x1920, 30fps), programmatic render to MP4
- All outputs saved to `/mnt/documents/` as downloadable files
- Visual QA on every asset before delivery

### Output Files

```
/mnt/documents/
  heartlines-quote-01.png
  heartlines-quote-02.png
  heartlines-quote-03.png
  heartlines-quote-04.png
  heartlines-quote-05.png
  heartlines-demo-reel.mp4
  heartlines-carousel-01.png
  heartlines-carousel-02.png
  heartlines-carousel-03.png
  heartlines-carousel-04.png
  heartlines-carousel-05.png
```

