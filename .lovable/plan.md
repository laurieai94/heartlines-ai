

## Replace Descriptions with Parenthesized Copy

**File: `src/components/LandingPage.tsx`**

### Card Data Changes (lines 652-679)

Swap descriptions to use the current secondary text content (without parentheses), then remove `secondaryText` fields:

| Card | New Description |
|------|----------------|
| 01 | "no fake bios here" |
| 02 | "every story has two (+) main characters" |
| 03 | "less textbook therapy, more real talk" |
| 04 | "because the magic happens offline" |

### Remove Secondary Text Rendering (lines 96-100)

Delete the `{secondaryText && ...}` conditional block from the `StepCard` component since it's no longer needed.

### Result

Each card gets a short, punchy one-liner instead of two competing text blocks -- cleaner and more visually appealing.

