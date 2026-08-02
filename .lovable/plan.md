# make kai less formulaic

Yes. Kai's sameness is structural, not a model problem. Four things in the current setup force every reply into the same shape.

## What's causing it (confirmed in code)

1. **Every turn has one legal shape.** The prompt enforces `ONE QUESTION ONLY`, `PHASE 1 DEFAULT: QUESTION ONLY`, and a first-message rule of "1-2 word ack, then a question" (`promptTemplate.ts` lines 108-126, 181, 587; injected again in `anthropic-chat/index.ts` line ~247). Kai literally cannot vary its move.
2. **The opener pool is 10 lines wide.** `openerLibrary` in `anthropic-chat/index.ts` has a single `direct` category, and every scenario (spiral, betrayal, jealousy, intimacy, family, default) maps to it. Ten questions serve every user and every situation.
3. **Phrase libraries teach recitation.** Six "PHRASE LIBRARY (ROTATE)" blocks (confirmation, closure, opening, reflection, grounding, discovery) give Kai fixed lines to draw from. Rotation still sounds like a deck of cards, just shuffled.
4. **Bans without replacements flatten the voice.** Long HARD-BANNED lists plus a 60-word client truncation (`aiResponseCoordinator.ts` `enforceResponseBrevity`) leave a narrow safe zone, and the model parks in the middle of it.

## The fix: give Kai more moves, not more rules

### 1. Replace "always ask a question" with a move set
Kai picks one move per turn based on what the user said, instead of always questioning:
- ask (the current default)
- name it (state the pattern plainly, no question)
- stay (a single short line, let it sit)
- offer (concrete suggestion when they asked for one)
- push back (challenge a story that doesn't hold)
- remember (connect to something from an earlier session)

Rule: never the same move twice in a row unless the user's message demands it. This alone breaks the ack-then-question rhythm.

### 2. Retire phrase libraries as scripts, keep them as range
Convert the six ROTATE blocks from "pick a line" to "here is the range of registers, write your own line." Keep 2-3 examples per register as tone anchors instead of 8-12 as a menu. Add an explicit rule: never reuse a library line verbatim.

### 3. Widen and re-map the opener pool
Expand `openerLibrary` from one `direct` bucket to per-scenario buckets (spiral, betrayal, jealousy, intimacy, family, conflict, default) with 8-10 openers each, and map `scenarioCategoryMapping` to the matching bucket. Keep the existing `kai_opener_history` dedup so a user does not see a repeat within 10 sessions.

### 4. Let length vary
Replace the flat 60-word truncation with a range tied to the move: a "stay" move is under 15 words, an "offer" can run to 90. Truncation only trips as a hard safety cap, not as the normal shaping tool.

### 5. Turn up variance
Raise sampling temperature from 0.75 to 0.9 for the main chat call. With the anti-AI-language rules and `sanitizeVoice` already in place, the guardrails hold while the phrasing loosens.

## Technical notes

- Files: `src/utils/prompt/promptTemplate.ts` (move set, library rewrite, phase rules), `supabase/functions/anthropic-chat/index.ts` (opener buckets, temperature, first-message injection), `src/utils/aiResponseCoordinator.ts` (length range).
- No schema change. `kai_opener_history` and the prompt cache static/dynamic split are unchanged; edits stay inside the static block so cache hit rate holds.
- The em-dash ban, `sanitizeVoice`, lowercase enforcement, crisis protocol, and partner-name rule are untouched.

## Verification

Run a 20-message sweep across four scenarios and check: no two consecutive turns use the same move, no verbatim library lines, reply length varies by more than 3x across the set, and zero dashes or banned phrases.
