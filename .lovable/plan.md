

## Health Check & Cleanup — Safe Incremental Plan

Each stage is independent. We verify nothing breaks before moving to the next.

### Stage 1: Remove unused dependencies
- Remove `@anthropic-ai/sdk` from `package.json` (it's never imported client-side — all AI calls go through edge functions)
- Verify the app builds and runs

### Stage 2: Remove dead code files
- Delete `src/components/ProductionApp.tsx` (unused — `App.tsx` is the real router)
- Delete `src/main-production.tsx` (unused — `main.tsx` is the entry point)
- Delete `src/components/ProductionDashboard.tsx` (unused — `Dashboard.tsx` is the real one)
- Verify no imports reference these files before deleting

### Stage 3: Simplify no-op wrappers
- `PerformanceOptimizedApp.tsx` just renders `{children}` — inline it out of `main.tsx`
- Remove the file
- Verify app renders

### Stage 4: Fix Supabase function search_path warnings
- Add `SET search_path = public` to `generate_priority_code()` and `check_signup_cap()` via migrations
- These are backend-only, no frontend impact

### Stage 5: Sanitize voice function error messages
- In `voice-to-text` and `text-to-speech` edge functions, replace raw API error text with generic user-friendly messages
- Backend-only change, deployed automatically

### Stage 6: Add SEO meta tags
- Add `react-helmet-async` usage to public pages (landing, mission, pricing, privacy, terms, contact) with proper `<title>` and `<meta>` tags
- Additive only — no existing code modified

### Approach to safety
- Each stage is a separate implementation step
- I'll search for all imports/references before deleting any file
- Backend changes (stages 4-5) deploy independently from frontend
- Stage 6 is purely additive

