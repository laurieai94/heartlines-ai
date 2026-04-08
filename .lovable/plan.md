

## Fix: Kai Avatar Flickering/Reloading in Chat

The Kai avatar sometimes flashes or reloads during chat because of two issues:

### Root Causes

1. **Thinking avatar missing `delayMs={Infinity}`** — In `ChatContainer.tsx` (line 250), the "pondering" thinking indicator's `AvatarFallback` doesn't use `delayMs={Infinity}`, so the fallback briefly shows before the image loads, causing a visible flash when Kai starts/stops "thinking."

2. **Streaming triggers full message list re-render** — During AI response streaming, `chatHistory` content changes every few hundred ms. The `MemoizedChatContainer` comparison checks `msg.content === nextMsg.content`, which changes on every stream chunk, causing ALL `AIChatMessage` components to re-render and their avatar `<img>` elements to potentially remount.

3. **Unstable `onRetry` callback** — In `renderMessages()` (line 220-222), a new arrow function is created on every render for `onRetry`, which breaks `AIChatMessage`'s `memo` for error messages.

### Changes

**File: `src/components/ChatContainer.tsx`**
- Add `delayMs={Infinity}` to the thinking avatar's `AvatarFallback` (line 250) — prevents fallback flash
- Stabilize the `onRetry` callback with `useCallback` or move it outside the render loop

**File: `src/components/MemoizedChatContainer.tsx`**
- Refine the memo comparison: only compare the *last* message's content (the one being streamed) instead of deep-checking every message's content. Earlier messages are immutable once complete.

**File: `src/components/AIChatMessage.tsx`**
- Add a stable key or CSS `will-change` / `contain` property to the avatar container to hint the browser not to tear down and rebuild the image element during re-renders

These are small, targeted changes across 3 files — no layout or visual changes, just render stability.

