

## Safe Codebase Cleanup — Phase 2

Continuing the same zero-risk approach from Phase 1. Only deleting confirmed dead files — no moving, renaming, or import rewiring.

### What we'll do

**Delete 9 unused files (confirmed zero imports)**

Components with no imports anywhere in the codebase:
- `src/components/ResourceMonitor.tsx` — unused monitoring widget
- `src/components/LandingPageFallback.tsx` — unused fallback, though it imports BrandMark (nothing imports *it*)
- `src/components/ProductionErrorBoundary.tsx` — unused error boundary (the app uses `ErrorBoundary.tsx` instead)
- `src/components/LazyPageSkeleton.tsx` — unused loading skeleton
- `src/components/LazySection.tsx` — unused lazy wrapper
- `src/components/ChatHeader.tsx` — old duplicate; the app only uses `src/components/chat/ChatHeader.tsx`
- `src/components/ScrollToTopArrow.tsx` — unused (the app uses `ScrollToTop.tsx`)
- `src/components/SaveIndicator.tsx` — unused save state indicator
- `src/components/BurgundyNavCarrot.tsx` — unused nav element

Hooks with no imports anywhere in the codebase:
- `src/hooks/useProductionLogging.tsx` — never imported
- `src/hooks/useRenderOptimization.tsx` — never imported
- `src/hooks/useOptimizedCallback.tsx` — never imported
- `src/hooks/useCleanupManager.tsx` — never imported
- `src/hooks/useManagedTimer.tsx` — never imported

**Also delete the empty `Brand/` folder** left over from Phase 1 (if it still exists on disk).

### What we still won't touch
- No moving files between folders
- No hook consolidation (hooks that *are* imported stay put)
- No import path changes
- No credential changes

### Risk level: Zero
Every file listed has been confirmed to have zero imports across the entire codebase. Deleting them removes dead weight with no possibility of breaking anything.

### Technical detail
14 files total. Each was verified by searching for its import pattern across all `.ts` and `.tsx` files. None returned results.

