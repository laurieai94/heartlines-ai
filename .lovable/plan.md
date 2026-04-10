

## Bug: Personal Profile Not Persisting to Database

### Root Cause

Your personal profile data saves to **localStorage** but never reaches the **database**. When you return on a new session (cleared cache, different device), localStorage is empty and the DB has no personal profile row — so you see a blank profile.

The partner profile works because partner profile saves go through a different code path with `p_partner_profile_id`, which resolves unambiguously to the 3-parameter version of the `upsert_user_profile_patch` RPC function.

**The likely cause is a PostgreSQL function overload conflict.** There are TWO versions of `upsert_user_profile_patch`:
- A 2-parameter version: `(p_profile_type text, p_patch jsonb)`
- A 3-parameter version: `(p_profile_type text, p_patch jsonb, p_partner_profile_id text DEFAULT NULL)`

When the personal profile calls the RPC with just 2 arguments, PostgreSQL may hit an ambiguity error because the 3-param version with its DEFAULT also matches 2 arguments. This would cause a silent failure (the error is caught and logged via `safeLog.error` which may not appear in normal console output).

### Fix

**1. Drop the old 2-parameter function overload** (database migration)

The 3-parameter version with `DEFAULT NULL` already handles the personal profile case correctly (when `p_partner_profile_id` is NULL, it skips partner-specific logic). The 2-param version is redundant and causes ambiguity.

```sql
DROP FUNCTION IF EXISTS public.upsert_user_profile_patch(text, jsonb);
```

**2. Add better error visibility** in `useProfileStoreV2.tsx`

Change the `syncToDatabase` error handler from `safeLog.error` to `console.error` so failures are visible in the browser console, making future debugging easier.

**3. Backfill the user's personal profile** (one-time)

Since the data currently exists in the user's localStorage but not the DB, the next time they edit any field after the fix, it will sync properly. No manual migration needed — the existing debounce/auto-save logic will push pending data to the DB.

### Files Changed
- **Database migration**: Drop the 2-param overload of `upsert_user_profile_patch`
- **`src/hooks/useProfileStoreV2.tsx`**: Improve error logging in `syncToDatabase` (change `safeLog.error` to `console.error` for visibility)

### What's NOT Changing
- localStorage caching logic
- Partner profile isolation
- Virgin profile pattern
- Debounce timing or auto-save intervals

