

## Fix: Scroll to Top of Section on Navigation

When clicking "next", "previous", or a section tab in the profile questionnaire, the scroll container stays at whatever position the user was at. It should scroll to the top so the user sees the first question in the new section.

### What Changes

**File: `src/components/NewPersonalQuestionnaire/components/QuestionnaireLayout.tsx`**

Add a scroll-to-top side effect whenever `currentSection` changes. The scroll container is already tracked via `scrollContainerRef`. Add a `useEffect` that resets `scrollContainerRef.current.scrollTop = 0` whenever `currentSection` changes — this covers next, previous, and tab click navigation.

### Technical Detail

```ts
useEffect(() => {
  if (scrollContainerRef.current) {
    scrollContainerRef.current.scrollTop = 0;
  }
}, [currentSection]);
```

Single addition, no other files affected.

