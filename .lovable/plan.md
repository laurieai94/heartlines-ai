

## Match Bento Card Typography to "How It Works" Section

Align the bento grid card fonts and text styles with the StepCard component used in the "How it works" section so the two sections feel cohesive.

### Current vs Target

| Element | Bento Cards (now) | How It Works Cards | Change |
|---|---|---|---|
| Title weight | `font-bold` | `font-light` | Switch to `font-light` |
| Title color | `text-white` | `text-white` | No change |
| Title shadow | none | `drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]` | Add drop shadow |
| Subtitle color | `text-pink-100/60` | `text-pink-50/95` | Brighter, more legible |
| Subtitle style | `italic` | not italic, `font-light` | Remove italic, keep font-light |
| Subtitle shadow | none | `drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]` | Add subtle shadow |
| Hover text | subtitle becomes `text-white/70` | text becomes `text-white` | Match to full white |

### Technical Detail

**File: `src/components/ui/timeline.tsx`**

1. Title `<h3>` -- change `font-bold` to `font-light tracking-wide` and add `drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]`
2. Subtitle `<p>` -- change `text-pink-100/60` to `text-pink-50/95`, remove `italic`, add `drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]`, update hover state from `group-hover:text-white/70` to `group-hover:text-white`

Single file, two class string updates.

