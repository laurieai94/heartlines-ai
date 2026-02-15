

## Redesign Bento Grid Custom SVG Icons

Make the 7 bento card icons larger, bolder, and more visually distinct from each other while keeping the hand-drawn gradient line-art style.

### Current Issues
- All icons are 32x32 -- too small to make an impact in the card layout
- Stroke width of 1.5 makes them feel wispy against the dark background
- Several icons look similar at a glance (PersonalIcon and CommunityIcon both use circles/people shapes)
- The gradient is identical across all 7 icons, reducing visual variety

### Proposed Improvements

| Card | Icon | Redesign Direction |
|---|---|---|
| no fake positivity | HeartSupportIcon (heart + plus) | Broken speech bubble with a crossed-out smiley -- "no toxic positivity" feel |
| for actual humans | InclusiveIcon (venn diagram) | Spectrum/rainbow arc with diverse abstract figures -- more recognizably "inclusive" |
| made for right now | ClockIcon (clock face) | Lightning bolt through a clock -- urgency and immediacy |
| conflict-ready | ConversationIcon (chat bubble) | Two speech bubbles colliding with a spark -- constructive tension |
| private, always | ShieldIcon (shield + check) | Lock with a heart keyhole -- privacy meets intimacy |
| context-aware | PersonalIcon (person + check) | Brain with connecting threads -- "knows the lore" |
| built to give back | CommunityIcon (circles) | Hands cupping a seedling/sprout -- growth and giving |

### Technical Changes

**File: `src/components/ui/timeline.tsx`**

1. **Increase canvas size**: 32x32 to 48x48 for sharper detail at card scale
2. **Increase stroke width**: 1.5 to 2 for bolder presence
3. **Per-icon gradient hues**: Shift each icon's gradient slightly so they aren't all identical orange-to-pink. For example:
   - Card 1: warm coral to rose
   - Card 2: violet to pink
   - Card 3: amber to orange
   - Card 4: coral to red
   - Card 5: teal-pink to lavender
   - Card 6: gold to coral
   - Card 7: green-teal to warm gold
4. **Redraw all 7 SVG paths** with more distinctive, recognizable shapes
5. **Update icon container padding** in the Timeline component to accommodate the larger 48px icons (adjust the `p-2.5` / `p-3.5` classes)

**File: `src/components/LandingPage.tsx`** -- no changes needed (icons are referenced by component name, which stays the same)

### Result
Each card gets a unique, immediately recognizable icon that feels bold and editorial, with subtle color variation that adds visual richness while staying within the warm brand palette.

