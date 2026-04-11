

## Landing page visual refresh + hero carousel tweaks

### Problem
1. The year text on the hero carousel is too large and distracting
2. The "man with framed memory" image needs the picture frame to show a 20-something girl at a music festival
3. "How It Works" and "Why We're Different" both use identical burgundy glassmorphism cards -- feels repetitive and flat

---

### Plan

#### 1. Shrink year text on hero carousel
- Reduce from `text-6xl md:text-8xl` to `text-4xl md:text-6xl` so the year is present but not dominating the image

#### 2. Edit the framed memory image
- Use the Gemini image editing API to modify `man-with-treasured-memory.webp`
- Prompt: edit the photo inside the picture frame to show a 20-something woman at an outdoor music festival, keep everything else the same
- Replace the file in `src/assets/hero-carousel/`

#### 3. Redesign "How It Works" -- horizontal step flow (no cards)
Replace the 4 identical burgundy cards with a clean **numbered horizontal flow**:
- Large step numbers (01-04) with gradient text, connected by a thin horizontal line
- Title and description below each number
- No card backgrounds -- just typography on the page background
- On mobile, stacks vertically with a vertical connecting line
- This creates strong visual contrast against the bento grid below

#### 4. Refresh "Why We're Different" -- varied bento with accent cards
Keep the bento grid but break the visual monotony:
- Alternate between **dark burgundy cards** and **accent cards** (coral/rose gradient backgrounds) for key items like "private, always" and "built to give back"
- Give the full-width bottom card ("built to give back") a distinct treatment -- larger text, subtle background pattern
- Vary icon container styles (some with colored backgrounds, some outlined)

### Files changed
- `src/components/HeroCarousel.tsx` -- smaller year text
- `src/assets/hero-carousel/man-with-treasured-memory.webp` -- regenerated via AI image edit
- `src/components/LandingPage.tsx` -- new "How It Works" layout (inline, replaces StepCard usage)
- `src/components/ui/timeline.tsx` -- accent card variations in bento grid

