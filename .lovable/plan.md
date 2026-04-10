

## Safe Codebase Cleanup — Phase 1

Zero-risk changes only. No moving files, no renaming folders, no import rewiring. Just deleting confirmed dead code and removing dev artifacts.

### What we'll do

**1. Delete unused files (3 files)**
These files have zero imports anywhere in the codebase:
- `src/components/MemoizedDashboardContent.tsx` — dead wrapper, never imported
- `src/components/MemoizedProfileBuilder.tsx` — dead wrapper, never imported  
- `PHASE_4_SUMMARY.md` — development artifact, doesn't belong in repo

**2. Merge duplicate `Brand/` and `brand/` folders**
There are two brand component folders with different casing — confusing and a potential issue on case-sensitive file systems:
- `src/components/Brand/` (HeartlinesWordmark, PhoneLockup) — used by 4 files
- `src/components/brand/` (BrandColorSwatch, BrandSection) — used by 1 file

We'll move everything into `src/components/brand/` (lowercase, consistent with other folders like `chat/`, `auth/`, `sidebar/`) and update the 5 import paths.

### What we won't touch
- No folder reorganization of the 70+ loose component files (risky)
- No hook consolidation (behavioral risk)
- No credential changes (needs testing)
- No renaming of any actively-used files

### Risk level: Minimal
- Deleting unused files: zero risk (confirmed no imports)
- Brand folder merge: very low risk (only 5 import paths to update, easy to verify)

