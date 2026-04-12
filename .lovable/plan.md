

## Add scroll-reveal animation to bento cards on mobile

The cards already have a basic fade-in via IntersectionObserver, but the effect is subtle. I'll enhance it with a more dramatic staggered scroll-and-reveal on mobile.

### Changes in `src/components/ui/timeline.tsx`

1. **Increase translate distance** for the initial hidden state: change `translate-y-6` to `translate-y-12` for a more dramatic entrance
2. **Increase stagger delay** per card: change `index * 100ms` to `index * 150ms` for a more visible cascade effect
3. **Add slight scale** to the entrance: cards start at `scale-95` and animate to `scale-100`
4. **Lower the IntersectionObserver threshold** from `0.15` to `0.1` and add a `rootMargin` of `0px 0px -40px 0px` so cards trigger slightly before fully in view — feels snappier on mobile scroll

### Files
- `src/components/ui/timeline.tsx`

