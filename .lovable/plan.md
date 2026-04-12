

## Fix square avatars and update 2077 slide tagline

### 1. Fix user avatars to be circular
The wrapper div already has `rounded-full overflow-hidden` but avatars still render as squares. The fix: add `rounded-full` directly to the `<img>` element as well, and ensure `aspect-square` is set on the wrapper to guarantee a perfect circle. Apply this in **3 locations** in `HeroPhoneScroll.tsx`:

- **Line 49** (ChatRow user avatar wrapper): Add `aspect-square` to the div
- **Line 51** (ChatRow user avatar img): Add `rounded-full` to the img class
- **Typing indicator user avatar** (~line 320+): Same fixes

### 2. Update 2077 slide tagline
In `HeroCarousel.tsx`, change line 51:
```
"stronger relationships start here" → "isn't this what it's all for?"
```

### Files changed
- `src/components/HeroPhoneScroll.tsx` — force circular avatars with `aspect-square` on wrapper + `rounded-full` on img
- `src/components/HeroCarousel.tsx` — update 2077 tagline

