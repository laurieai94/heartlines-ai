

## Safe Codebase Cleanup — Phase 3

This phase has two parts: more dead file deletions (same zero-risk approach), plus one targeted code fix for the hardcoded credentials.

### Part A: Delete more dead files (confirmed zero imports)

**Components (5 files):**
- `src/components/APIKeyInput.tsx` — never imported
- `src/components/MemoizedChatContainer.tsx` — never imported
- `src/components/Company.tsx` — never imported
- `src/components/FrostedHeartShowcase.tsx` — never imported
- `src/components/MobileErrorBoundary.tsx` — never imported (only referenced in main.tsx import, need to verify)
- `src/components/ProfileCompletionOptions.tsx` — never imported

**Hooks (5 files):**
- `src/hooks/usePerformanceSafeguards.tsx` — never imported
- `src/hooks/useResourceLoader.ts` — never imported
- `src/hooks/useDataMigration.tsx` — never imported
- `src/hooks/useInputStateTracking.tsx` — never imported
- `src/hooks/useDebouncedPersistence.tsx` — never imported
- `src/hooks/usePullToReveal.tsx` — only imported by itself (self-referencing, never used)

**Folder:**
- `src/components/Brand/` — empty directory left from Phase 1

Wait -- `MobileErrorBoundary` showed up in `main.tsx`. Let me re-confirm before listing it.

Actually, re-checking: the search for `from "@/components/MobileErrorBoundary"` returned no results, but the `useProductionOptimizations` search showed main.tsx line 11 imports it. Let me drop MobileErrorBoundary from the delete list since it IS imported in main.tsx.

**Revised dead file list (10 files):**

Components:
- `src/components/APIKeyInput.tsx`
- `src/components/MemoizedChatContainer.tsx`
- `src/components/Company.tsx`
- `src/components/FrostedHeartShowcase.tsx`
- `src/components/ProfileCompletionOptions.tsx`

Hooks:
- `src/hooks/usePerformanceSafeguards.tsx`
- `src/hooks/useResourceLoader.ts`
- `src/hooks/useDataMigration.tsx`
- `src/hooks/useInputStateTracking.tsx`
- `src/hooks/useDebouncedPersistence.tsx`
- `src/hooks/usePullToReveal.tsx`

### Part B: Remove dead `initializeSupabase` method

The `AIResponseCoordinator.initializeSupabase()` method contains hardcoded Supabase credentials but does nothing useful -- it just checks if two hardcoded strings are truthy (they always are) and returns `true`. The credentials aren't even used; `aiService.ts` already imports the shared Supabase client.

**Changes:**
1. Delete the `initializeSupabase` method from `src/utils/aiResponseCoordinator.ts`
2. Delete the passthrough `initializeSupabase` method from `src/components/AICoachEngine.tsx`
3. In `src/components/AIInsights.tsx`, remove the `useEffect` that calls `initializeSupabase()` and just set `isConfigured = true` directly (or remove the `isConfigured` state if it only gates rendering)

This removes hardcoded credentials from the codebase and eliminates dead code in one step.

### What we still won't touch
- No folder reorganization of the 60+ remaining loose components
- No hook consolidation (used hooks stay put)
- No import path rewiring

### Risk level
- Part A: Zero (confirmed no imports)
- Part B: Very low (removing a no-op method that always returns true)

### Technical detail
11 dead files deleted. One vestigial initialization flow removed along with its hardcoded credentials. Total of ~14 files touched.

