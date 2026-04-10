

## Fix Avatar Reload Flicker in ProductPhoneDemo

### Problem

Every time a new message appears in the demo, all existing message avatars visually "reload." This happens because:

1. **Radix Avatar re-checks image load state on each render** — when `visibleMessages` state updates, React re-renders all messages. The `AvatarImage` component internally resets its loaded/error state on re-render, causing a brief flash.
2. Both kai's avatar (with `AvatarImage`) and user avatars (with `AvatarFallback`) flicker because the parent components re-render.

### Fix

Replace the Radix `Avatar`/`AvatarImage`/`AvatarFallback` components inside the message list with simple `<img>` tags and styled `<div>` fallbacks. The Radix Avatar's internal load-state management is unnecessary for a demo with known static assets.

### Changes — `src/components/ProductPhoneDemo.tsx`

1. **Kai's inline message avatar** (lines ~133-140): Replace `Avatar > AvatarImage > AvatarFallback` with a plain `<img>` tag styled identically (`w-6 h-6 rounded-full object-cover`)

2. **User's inline message avatar** (lines ~148-152): Replace `Avatar > AvatarFallback` with a plain `<div>` styled with the same gradient and initial letter

3. **Typing indicator avatar** (lines ~161-167): Same replacement — plain `<img>` for kai's avatar

4. Keep the header avatar as Radix Avatar (it doesn't re-render with messages)

One file changed. No new dependencies.

