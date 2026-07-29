## Goal

Fix Kai's partner-name specificity failure (Kai defaults to "they/them" instead of using the partner's actual name from profile context), then run a fresh 100-scenario evaluation through the production pipeline so results reflect the real runtime behavior.

## Part 1 — Fix partner name enforcement

**Prompt-level fix** in `src/utils/prompt/promptTemplate.ts` (static system prompt):

Add a short, high-priority "NAME USAGE" hard rule near the top of the behavioral rules (alongside the bias/crisis hard rules), stating:
- When a partner name is present in user context, refer to them by name on first mention in every response.
- Never default to "they/them/your partner" when a name is known.
- Pronouns are fine on subsequent mentions in the same reply.
- Applies to all categories including bias, crisis, advice, and everyday.

Keep it under ~10 lines to protect cache hit rate (per the static/dynamic split memory).

**Runtime reinforcement** in `src/utils/prompt/promptTemplate.ts` `buildUserContext`:

At the top of the user-context block (dynamic portion), when `partnerName` is present, prepend one explicit line:
`PARTNER'S NAME: {partnerName}. Use this name — do not say "they" or "your partner" on first mention.`

This puts the name in both the cached rule and the per-request context so the model can't miss it.

## Part 2 — Fix the eval harness to reflect production

The prior v2 sweep called Claude directly with only the static prompt, so partner-name context was never actually injected — that's why specificity looked worse than reality. Update `/tmp/kai_eval/run.py` (and `run_flagged.py`) to:

1. Build a minimal `PersonContext` per scenario with `yourTraits.name = "Alex"` and `partnerTraits.name = "Jordan"` (matching the scenarios' assumed names).
2. Call `PromptTemplate.buildUserContext(...)` via a small Bun helper (extend `scripts/dump_prompt.ts` to accept names and emit the combined `static + user-context` prompt as JSON per scenario), OR shell out per-scenario to produce the exact system prompt the app would send.
3. Send that combined system prompt to Claude so the eval measures the actual production prompt.

## Part 3 — Run fresh 100-scenario sweep

- Run all 100 scenarios with the updated prompt + updated harness.
- Judge with the same Gemini rubric.
- Produce `/mnt/documents/kai-eval/REPORT_v3.md` with:
  - Overall pass/warn/fail
  - Per-category deltas vs v1 and v2
  - Specificity dimension score (partner name usage) as the headline metric
  - Any regressions in bias/crisis/adversarial

## Out of scope

- No changes to `useConversationalKai`, `AIResponseCoordinator`, or client chat flow.
- No new tests beyond the eval harness.
- No changes to bias/crisis rules already shipped in v2.
