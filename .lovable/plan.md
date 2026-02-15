

## Bento Grid for "Why We're Different"

Replace the vertical Timeline with a compact bento grid layout that shows all 5 differentiators in a visually interesting, space-efficient grid.

### Layout Design

**Desktop (md+): 3-column bento grid**

```text
+---------------------------+  +--------------+
|                           |  |              |
|   real talk only (large)  |  | queer- and   |
|                           |  | trauma-      |
+---------------------------+  | informed     |
                               |              |
+--------------+  +------------+--------------+
|              |  |                           |
| built for    |  |  tough talks welcome      |
| busy         |  |  (large)                  |
|              |  |                           |
+--------------+  +---------------------------+

         +---------------------------+
         |   private by design       |
         |   (full-width accent)     |
         +---------------------------+
```

- Row 1: "real talk only" spans 2 columns (hero card), "queer- and trauma-informed" spans 1 column but 2 rows tall
- Row 2: "built for busy" spans 1 column, "tough talks welcome" spans 2 columns
- Row 3: "private by design" spans full width as a compact accent strip

**Mobile: Single-column stack**
- All cards stack vertically as equal-sized compact cards
- Clean and scannable

### Visual Style

- Glass cards matching existing brand: `bg-gradient-to-br from-burgundy-800/90 via-burgundy-700/80 to-pink-900/70` with `backdrop-blur-xl`
- `border border-pink-400/30` with `hover:border-orange-400/50`
- Large cards get more padding and bigger icon treatment
- Hover: subtle lift (`hover:-translate-y-1`) and glow (`hover:shadow-pink-400/30`)
- Scroll-triggered fade-in using Intersection Observer (staggered by index with 100ms delay increments)

### Card Content

Each card keeps: icon, bold title, single-line subtitle (the parenthetical quip). The main descriptive text before the parenthetical gets dropped to keep things punchy and scannable.

### Technical Details

**File: `src/components/ui/timeline.tsx`**
- Rename/repurpose the file or create a new `BentoGrid` component
- Keep the existing icon components (PersonalIcon, InclusiveIcon, etc.) -- they're reused
- New component accepts the same `stops` prop interface so LandingPage.tsx needs no data changes
- Use CSS Grid with `grid-template-columns` and `grid-row` / `grid-column` span utilities
- Intersection Observer with staggered delays: each card gets `transition-delay: ${index * 100}ms`

**File: `src/components/LandingPage.tsx`**
- Swap `<Timeline stops={...} />` for the new bento grid component (same prop shape)
- No data changes needed

### Animations
- Cards start `opacity-0 translate-y-6`
- On viewport entry: transition to `opacity-100 translate-y-0`
- Staggered via `transition-delay` per card index
- `transition-all duration-700 ease-out`

