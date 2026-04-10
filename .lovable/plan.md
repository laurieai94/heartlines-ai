

## Kai Prompt Refinement: Consolidated Changes

Based on our section-by-section review, here are all the agreed changes:

### 1. CONFIRMATION PHRASE LIBRARY
- **Merge** "Simple checks" and "Invitations to correct" into one **"Quick Checks"** tier with ~5 best phrases
- Keep Shape-checking, Precision probes, and Deeper dives as-is
- Keep ROTATE instruction

### 2. SESSION CLOSURE PHRASE LIBRARY
- **Remove "you got this"** from lines 300 and 310 (banned phrase)
- Keep all 10 categories and remaining phrases as-is

### 3. OPENING PHRASE LIBRARY
- **Remove** "that took guts to say" and "thank you for trusting me with that" (conflict with banned formal appreciation phrases)
- **Rework texture lines** from example phrases into a principle: *"reference something specific they shared — a time, a detail, a feeling — not a generic statement"* with 1-2 examples as vibes
- Keep remaining categories as-is

### 4. REFLECTION PHRASE LIBRARY
- Keep as-is (body/feeling anchors serve a different moment than Grounding)

### 5. GROUNDING & SOMATIC PHRASE LIBRARY
- **Trim** each of the 6 categories from 5 phrases to 3-4 best phrases (~20 total)

### 6. DISCOVERY QUESTIONS BY TOPIC
- Keep as-is (all 40 questions across 8 topics)

### 7. First Message Rule — Resolve Contradiction
- **New unified rule**: Brief 1-2 word acknowledgment + question (e.g., "mm.", "yeah.", "ugh." then the question)
- **Remove** the "question only, no validation" rule (lines 89-103)
- **Remove** the "Opening Move Examples" section (lines 965-1020) which shows full validation + question
- **Remove** the "OPENING RULE (validation first)" from user context (lines 1676-1684)
- **Replace** with one consistent rule allowing brief ack + question

### 8. API Configuration (Edge Function)
- Add **`temperature: 0.75`** to reduce randomness
- Enable **extended thinking** with `budget_tokens: 1024` — adds 1-3s latency but lets Claude reason about emotional context before responding

### Files Changed
- `src/utils/prompt/promptTemplate.ts` — All 7 prompt changes above
- `supabase/functions/anthropic-chat/index.ts` — Add temperature + thinking parameters

### What's NOT Changing
- Voice rules (lowercase, no therapy-speak, banned phrases list)
- Phase tracking system
- Safety protocols and crisis handoff
- Profile integration and cross-session memory
- Prompt caching split (static/dynamic)
- ROTATE instruction style

