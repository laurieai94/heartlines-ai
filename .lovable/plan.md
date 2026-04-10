
## fix the remaining avatar flicker on the homepage demo

I checked the live homepage path and found the issue: `/` renders `HeroPhoneScroll`, not `ProductPhoneDemo`. So the earlier fix was applied to the wrong component, which is why the flicker is still happening.

### what to change
1. **Update `src/components/HeroPhoneScroll.tsx`**
   - Replace the Radix `Avatar` components inside:
     - the message list
     - the assistant typing indicator
     - the user typing indicator
   - Use plain `<img>` tags for real avatars and a simple styled `<div>` fallback for initials.

2. **Reduce rerenders of old message rows**
   - Extract each chat row into a small memoized component so previously rendered messages do not visually reset whenever `isTyping`, `currentMessageIndex`, or `visibleMessages` changes.

3. **Stabilize avatar props**
   - Compute the current user avatar source once per conversation instead of recalculating it during every row render.
   - Remove the `visibleMessages.indexOf(message)` loading-priority logic from row avatars since it adds churn and is unnecessary for this preloaded demo.

4. **Keep the header as-is unless needed**
   - The top header avatar is not the main source of the every-message flicker, so it can stay unless testing shows it also flashes.

### expected result
- old avatars stay fixed when new messages appear
- typing indicators can come and go without making earlier avatars flash
- the homepage hero demo keeps the same visual design

### files to touch
- `src/components/HeroPhoneScroll.tsx`
- optionally `src/components/ProductPhoneDemo.tsx` later for consistency, but the real fix for this bug is in `HeroPhoneScroll`

### technical note
The problem is not the image file itself. The active homepage demo still uses Radix Avatar inside a frequently re-rendering animated message loop, so those avatar elements are the ones still visually resetting.
