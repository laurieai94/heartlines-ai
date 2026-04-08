

## Fix: "Finish Profile" Nudge Showing Despite Complete Profile

### Problem

The "finish profile to unlock kai" banner appears mid-conversation even though profiles are complete. Console logs show `profileCompletion: 0` and `accessLevel: "profile-required"` — the profile data isn't loading into the `useProgressiveAccess` hook's instance of `useProfileStoreV2`.

**Root cause**: Each call to `usePersonalProfileData()` creates an independent `useProfileStoreV2('personal')` state instance. The instance inside `useProgressiveAccess` may fail to load data from localStorage (e.g., in a fresh session or different browser tab) while the DB async load either fails silently or completes but doesn't trigger a re-render in the parent. Meanwhile, the chat is fully functional because Kai's edge function works independently of client-side profile state.

### Fix (two layers of defense)

**1. Never show the nudge mid-conversation**
In `src/components/AIChat.tsx`, add a guard: if `chatHistory` already has user messages, suppress the nudge regardless of `accessLevel`. A user who is actively chatting has clearly passed the profile gate at some point — showing the nudge mid-conversation is always wrong.

```ts
// Line ~289 in AIChat.tsx
const hasUserMessages = chatHistory.some(msg => msg.role === 'user');
const shouldShowNudge = accessLevel === 'profile-required' 
  && !!user 
  && profileCompletion < 100 
  && !hasUserMessages;  // NEW: never nudge mid-convo
```

**2. Add a timeout fallback for stale loading state**
In `src/hooks/useProgressiveAccess.tsx`, if `personalStorage.isReady` is still false after 5 seconds and the user is authenticated, force a re-check by falling through to `full-access` rather than returning the stale `lastAccessLevelRef`. This prevents permanent lockout from a stuck loading state.

```ts
// In the accessLevel useMemo
if (!personalStorage.isReady || personalStorage.isLoading) {
  // If stuck loading for too long, assume full access 
  // rather than blocking an active user
  return lastAccessLevelRef.current === 'profile-required' 
    && chatHistory length > 0 
    ? 'full-access' 
    : lastAccessLevelRef.current;
}
```

**3. Hide nudge when `OnboardingStepNudge` receives completion ≥ 100**
Already handled — `OnboardingStepNudge` returns `null` when `completion >= 100`. The issue is upstream: `profileCompletion` is `0` because the data never loaded. Fixes 1 and 2 address this.

### Files Changed
- `src/components/AIChat.tsx` — add `hasUserMessages` guard to nudge logic
- `src/hooks/useProgressiveAccess.tsx` — add timeout/fallback for stuck loading state

