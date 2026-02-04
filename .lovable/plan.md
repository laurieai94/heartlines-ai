

# Heartlines.ai Health Check Report

## Executive Summary

Your app is **functional but has several issues** that should be addressed. I found **1 critical issue**, **7 security improvements needed**, and a few minor housekeeping items.

---

## Critical Issue (Fix Immediately)

### Missing Edge Function: `process-due-reminders`

A cron job runs **every minute** calling `process-due-reminders`, but this edge function doesn't exist in your codebase. Every call returns **403 Forbidden**.

| Metric | Value |
|--------|-------|
| Error Rate | 100% |
| Frequency | Every minute |
| Status Code | 403 |

**Impact**: User reminders aren't being processed/sent.

**Fix Options**:
1. **Create the edge function** if reminders are a planned feature
2. **Delete the cron job** if reminders are deprecated

```sql
-- To disable the cron job:
SELECT cron.unschedule('process-due-reminders-every-minute');
```

---

## Security Findings (8 Issues)

### High Priority (Errors)

| Issue | Description | Action |
|-------|-------------|--------|
| Security Definer Views (2) | Two database views bypass RLS | Review and convert to INVOKER or add explicit security checks |
| Sensitive Data Tables | `profiles`, `chat_conversations`, `crisis_logs`, `user_profiles` contain PII | Already protected by RLS - verify policies are correct |

### Medium Priority (Warnings)

| Issue | Recommendation |
|-------|----------------|
| **Postgres Security Patches** | Upgrade database via Supabase dashboard |
| **Leaked Password Protection Disabled** | Enable in Auth settings |
| **OTP Expiry Too Long** | Reduce to recommended threshold |
| **Overly Permissive RLS (2)** | Review policies using `WITH CHECK (true)` |
| **Mutable Function Search Paths** | Set explicit search paths on functions |

---

## Database Health

| Table | Size | Status |
|-------|------|--------|
| user_token_usage | 360 KB | Active |
| chat_conversations | 344 KB | Active |
| cache_metrics | 192 KB | Monitoring |
| Total Users | 6 | Low traffic |

**No database errors** in recent logs.

---

## Edge Functions Status

| Function | Status |
|----------|--------|
| anthropic-chat | ✅ Deployed |
| stripe-webhook | ✅ Deployed |
| health-check | ✅ Deployed (no recent calls) |
| process-due-reminders | ❌ Missing (cron calling non-existent function) |

All required secrets are configured: `ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `RESEND_API_KEY`, etc.

---

## Dependencies Check

Your packages are reasonably current. Notable versions:

| Package | Your Version | Status |
|---------|-------------|--------|
| React | ^18.3.1 | ✅ Current |
| @supabase/supabase-js | ^2.50.0 | ✅ Current |
| @tanstack/react-query | ^5.85.5 | ✅ Current |
| Tailwind | ^3.4.11 | ✅ Current |
| lucide-react | ^0.462.0 | ✅ Current |

No critical dependency updates needed.

---

## Usage Metrics

- **Last conversation**: January 22, 2026 (about 2 weeks ago)
- **Total users**: 6
- **AI API Health**: No recent failures logged

---

## Recommended Action Plan

### Immediate (Today)

1. **Fix the broken cron job** - Either create `process-due-reminders` function or delete the cron job to stop the 403 errors

### This Week

2. **Upgrade Postgres** - Apply security patches via Supabase dashboard
3. **Enable leaked password protection** - Auth settings in Supabase
4. **Review Security Definer views** - Check if they're intentional or should be changed

### When Time Permits

5. **Audit RLS policies** with `WITH CHECK (true)` for overly permissive access
6. **Reduce OTP expiry** to recommended threshold
7. **Set explicit search paths** on database functions

---

## Technical Details

### Files That Need Changes

| Priority | Change |
|----------|--------|
| Critical | Create `supabase/functions/process-due-reminders/index.ts` OR run SQL to disable cron |
| Medium | Database migrations for security hardening |

### Cron Job SQL to Disable (if reminders not needed)

```sql
SELECT cron.unschedule('process-due-reminders-every-minute');
```

### Supabase Dashboard Links for Manual Fixes

- Database upgrade: Settings → Database
- Auth settings: Authentication → Providers → Email
- Edge function logs: Functions → [function-name] → Logs

