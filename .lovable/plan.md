

## Alternating Timeline Layout with Scroll Animations

**File: `src/components/ui/timeline.tsx`** -- Full rewrite of the `Timeline` component

### Layout Changes

**Desktop (md+): Alternating left/right cards**
- Timeline line stays centered vertically
- Even-indexed cards (0, 2, 4) appear on the left side, odd-indexed (1, 3) on the right
- Each row uses a grid: `grid-cols-[1fr_auto_1fr]` where the middle column holds the timeline dot
- Cards on the left are right-aligned, cards on the right are left-aligned
- The opposite side of each card is empty space

**Mobile: Centered stack**
- Falls back to current centered layout (single column, cards stacked)
- Timeline line hidden on mobile for cleanliness

**Glowing connector dots**
- Unhide the center dot (currently has `hidden` class) and show it in the middle column at each stop
- Gradient dot with glow effect connecting the vertical line to each card

### Scroll Animations

**Replace CSS `animate-fade-in` with Intersection Observer-driven animations**
- Each card starts with `opacity-0` and a horizontal translate (`translate-x-8` for left cards, `-translate-x-8` for right cards)
- When the card enters the viewport (threshold ~0.15), add classes for `opacity-100 translate-x-0` with a CSS transition
- Stagger naturally since cards enter the viewport at different scroll positions
- On mobile, use `translate-y-8` instead of horizontal translate

### Technical Details

- Add a `useEffect` with `IntersectionObserver` inside the `Timeline` component using `useRef` on each card
- Each card ref stored in a `useRef<(HTMLDivElement | null)[]>([])` array
- Observer callback adds a `is-visible` class or sets state per-index
- Transition classes: `transition-all duration-700 ease-out`
- Cards use conditional classes based on visibility state

### Card Width
- Increase from `max-w-md` to `max-w-sm` within each grid cell (the grid itself handles spacing), giving cards room to breathe while not stretching too wide

### No changes needed in `LandingPage.tsx`
The Timeline component interface (`stops` prop) stays the same -- all changes are internal to `timeline.tsx`.

