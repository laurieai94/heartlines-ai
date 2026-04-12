

## Remove images and enlarge year text

### Changes to `src/components/HeroCarousel.tsx`

1. **Remove two carousel images** shown in the screenshots:
   - `manos-unidas.webp` (image2024 — the couple with religious statues)
   - `warm-smiles-vintage-home.webp` (imageVintageHome — the AI-edited interracial couple)
   - Remove their imports and corresponding slide entries from the `slides` array

2. **Increase year text size** from `text-2xl md:text-4xl` back up to `text-3xl md:text-5xl`

Single file change: `src/components/HeroCarousel.tsx`

