

## Optimize Bento Grid Layout for Visual Appeal

### Problem
The current layout has a tall card (row-span-2) that can look unbalanced, and the content-to-size pairing isn't optimized -- some short punchy titles sit in wide cards while longer subtitles are cramped in small ones.

### Current Layout (desktop)
```text
Row 1: [ no fake positivity (2col) ] [ for actual humans (1col, TALL) ]
Row 2: [ made for right now (1col) ] [        ^^ still tall ^^        ]
Row 3: [    conflict-ready (2col)                                     ]
Row 4: [ private, always (1col) ] [ context-aware (2col)              ]
Row 5: [          built to give back (3col full)                      ]
```

### Proposed Layout -- Zigzag Rhythm
```text
Row 1: [ conflict-ready (1col) ] [   for actual humans (2col)        ]
Row 2: [   private, always (2col)       ] [ made for right now (1col) ]
Row 3: [ no fake positivity (1col) ] [  context-aware (2col)         ]
Row 4: [          built to give back (3col full)                      ]
```

The zigzag pattern (narrow-wide, wide-narrow, narrow-wide, full) creates a dynamic visual rhythm that draws the eye down the page.

### Why This Order Works
- **Row 1**: "conflict-ready" is a punchy, provocative opener in a compact card; "for actual humans" gets the wide space its longer subtitle needs
- **Row 2**: "private, always" has the longest subtitle (dataset line) and benefits from width; "made for right now" is short and urgent -- perfect for a tight card
- **Row 3**: "no fake positivity" is compact and bold; "context-aware" fills the wide space
- **Row 4**: "built to give back" stays as the full-width mission-statement closer

### Technical Changes

**File: `src/components/LandingPage.tsx`**

Reorder the stops array:
1. conflict-ready (was 4)
2. for actual humans (was 2)
3. private, always (was 5)
4. made for right now (was 3)
5. no fake positivity (was 1)
6. context-aware (was 6)
7. built to give back (stays 7)

**File: `src/components/ui/timeline.tsx`**

1. Update `gridPlacements` -- remove the tall `row-span-2` entry, use a clean zigzag:
   - Card 1: `md:col-span-1` (narrow)
   - Card 2: `md:col-span-2` (wide)
   - Card 3: `md:col-span-2` (wide)
   - Card 4: `md:col-span-1` (narrow)
   - Card 5: `md:col-span-1` (narrow)
   - Card 6: `md:col-span-2` (wide)
   - Card 7: `md:col-span-3` (full width)

2. Update `isLarge` logic -- apply larger padding to the wide cards (indices 1, 2, 5) instead of hardcoded 0 and 3

3. Remove `isTall` logic entirely (no more row-span-2)

4. Shuffle `cardGradients` to match the new card order so gradient variety is preserved

