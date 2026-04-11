

## Landing page refresh: visual diversity, smaller year text, image edits

### 1. Shrink year text on hero carousel
Reduce from `text-4xl md:text-6xl` to `text-2xl md:text-4xl` so the year is subtle, not dominating.

**File:** `src/components/HeroCarousel.tsx`

### 2. Edit the framed memory image
Use the AI image editing API to modify `man-with-treasured-memory.webp` — change the photo inside the picture frame to a **color photo of a 20-something woman at an outdoor music festival**. Keep the man, room, and everything else identical.

**File:** `src/assets/hero-carousel/man-with-treasured-memory.webp`

### 3. Make some couples interracial
Use AI image editing on 2-3 carousel images to make the couples interracial (e.g. `couple-on-couch.webp`, `warm-smiles-vintage-home.webp`, `asian-couple-serene-moment.webp`). Keep poses, room, lighting, and composition identical — only adjust the subjects' appearances to reflect interracial pairings.

**Files:** select hero-carousel images

### 4. Redesign "How It Works" — horizontal step flow (already done, keep as-is)
The horizontal numbered flow (01-04) is already implemented and visually distinct from the bento grid. No changes needed here.

### 5. Refresh "Why We're Different" — break bento monotony
The bento grid already has accent card variations (coral/rose gradients at indices 2, 4, 6). To push visual diversity further:
- Give the full-width bottom card ("built to give back") a **larger title size** and a **subtle repeating pattern overlay**
- Add **outlined icon containers** on dark cards vs filled containers on accent cards
- Increase size contrast between large (span-2) and small (span-1) cards

**File:** `src/components/ui/timeline.tsx`

### Technical summary
- `HeroCarousel.tsx` — reduce year font size
- `man-with-treasured-memory.webp` — AI edit: color festival photo in frame
- 2-3 couple images — AI edit: make interracial
- `timeline.tsx` — stronger visual differentiation between card types

