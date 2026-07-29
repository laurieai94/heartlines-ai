export type TextingAnxietyTurn =
  | { kind: "user"; text: string; typingMs: number; holdMs: number }
  | { kind: "kai"; text: string; typingMs: number; holdMs: number };

export const TEXTING_ANXIETY_SCRIPT: TextingAnxietyTurn[] = [
  { kind: "user", text: "kai, he hasn't texted me all day.", typingMs: 900, holdMs: 900 },
  {
    kind: "kai",
    text: "that feels rough. what's the first thought that hit you?",
    typingMs: 1100,
    holdMs: 1400,
  },
  { kind: "user", text: "that he's losing interest.", typingMs: 800, holdMs: 900 },
  {
    kind: "kai",
    text: "okay. is that a familiar thought, or new with him?",
    typingMs: 1100,
    holdMs: 2200,
  },
];

export const LOOP_PAUSE_MS = 1800;
