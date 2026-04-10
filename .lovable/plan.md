

## Fix: Kai is Broken — Extended Thinking Header Rejected

### Problem

Kai is returning "something went wonky" for every message. The edge function logs show:

```
API error 400: Unexpected value(s) `extended-thinking-2025-01-24` for the `anthropic-beta` header
```

The `extended-thinking-2025-01-24` beta header and `thinking` parameter we added in the previous change are not supported for `claude-sonnet-4-5` via this API configuration. Every API call fails, retries 5 times, then returns an error to the user.

### Fix

**File: `supabase/functions/anthropic-chat/index.ts`**

1. **Remove** `extended-thinking-2025-01-24` from the `anthropic-beta` header (keep `prompt-caching-2024-07-31`)
2. **Remove** the `thinking` block (`type: 'enabled'`, `budget_tokens: 1024`)
3. **Remove** the `+ 1024` extra max_tokens budget added for thinking
4. **Keep** `temperature: 0.75` (that part is valid and useful)
5. **Simplify** the response parsing back — the `textBlock` finder still works fine (it finds `type: 'text'` which is the normal response format too), so no change needed there

After editing, redeploy the edge function.

### What stays
- `temperature: 0.75`
- Prompt caching header
- All prompt template changes from the previous update
- Response parsing (already handles normal text blocks correctly)

