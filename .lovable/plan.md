# Kai: zero em dashes, zero AI language

Kai currently uses em dashes constantly and slips into AI-sounding phrasing. The root cause is the prompt itself: the system prompt and its example lines contain 175+ em dashes, so the model is literally being shown that style as the house voice. Telling Kai "don't use em dashes" while every example uses one will not work.

Fix in three layers.

## 1. Clean the prompt source (the real cause)

Rewrite every em dash and en dash out of the Kai prompt files so every example line models the target voice:

- `src/utils/prompt/promptTemplate.ts` (175 occurrences)
- `src/utils/prompt/relationshipMapper.ts` (3)
- `supabase/functions/anthropic-chat/index.ts` inline prompt strings and error copy (5)

Replacement is rewritten per sentence, not a blind find-and-replace: split into two sentences where the dash joined two thoughts, use a comma for an aside, use a colon where a list or example follows. No dash characters survive anywhere in the prompt.

## 2. Add a hard voice rule to the prompt

New non-negotiable section near the top of the system prompt:

- Never use em dashes, en dashes, or double hyphens. Use a period, comma, or colon.
- Banned AI constructions, with the reason stated once so the model generalizes:
  - "it's not just X, it's Y" and every "not X, but Y" balance
  - "X and Y" triads and rule-of-three lists used for rhythm
  - "delve", "navigate", "journey", "tapestry", "landscape", "realm", "testament to", "at the end of the day"
  - "I'm here for you", "you're not alone in this", "it's completely valid to feel"
  - "let's unpack", "let's dive into", "that's a great question"
  - opening with "It sounds like" or "It seems like" (already partly banned)
  - closing with a summary paragraph that restates what was just said
- Positive instruction: short plain sentences, one idea per sentence, concrete nouns, the partner's name.

## 3. Server-side sanitizer (safety net)

In `supabase/functions/anthropic-chat/index.ts`, in the same block that already forces lowercase, run the response through a sanitizer before returning it:

- Replace ` — `, `—`, `–`, `--` with a comma plus space, or a period plus space when the following clause starts a new independent thought.
- Collapse any resulting double punctuation or double spaces.
- Log a warning with the offending phrase when a banned AI construction is detected, so we can see whether the prompt rule is holding.

Also strip the em dashes from the three user-facing error strings in that file ("kai is busy right now—try again...").

## Technical notes

- Sanitizer lives in a small shared helper (`supabase/functions/_shared/sanitizeVoice.ts`) so `anthropic-chat` and any future Kai-voiced function use the same logic.
- Sanitizer runs after the existing `.toLowerCase()` call so ordering stays predictable.
- No model, temperature, or caching change. The prompt edits are text-only, so the static/dynamic cache split and prompt caching behavior are unchanged.
- No database or UI changes.

## Verification

- Grep the prompt files and edge function for dash characters; expect zero.
- Run a short set of Kai turns through the function covering an emotional venting message, an advice request, and a first message, and confirm no dashes and no banned constructions in the output.
