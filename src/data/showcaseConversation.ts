export type ShowcaseMessage = {
  role: "user" | "kai";
  content: string;
  /** ms to "type" before showing (kai only) */
  typingMs?: number;
  /** ms to pause after this message before the next */
  pauseAfterMs?: number;
};

export const SHOWCASE_CONVERSATION: ShowcaseMessage[] = [
  {
    role: "user",
    content: "jordan snapped at me over dishes again. i shut down.",
    pauseAfterMs: 900,
  },
  {
    role: "kai",
    content: "the shutdown is the part i'm curious about. what happens in your body right before you go quiet with jordan?",
    typingMs: 1400,
    pauseAfterMs: 2600,
  },
  {
    role: "user",
    content: "chest gets tight. i just want the fight to end.",
    pauseAfterMs: 900,
  },
  {
    role: "kai",
    content: "that's protection, not weakness. ending the fight keeps you safe — but it also leaves jordan alone with the thing they were trying to bring to you.",
    typingMs: 1600,
    pauseAfterMs: 2400,
  },
  {
    role: "kai",
    content: "next time the chest tightens, can you name it out loud? something like: \"i'm going quiet, give me a minute, i'm not gone.\"",
    typingMs: 1400,
    pauseAfterMs: 3200,
  },
  {
    role: "user",
    content: "yeah. i can try that.",
    pauseAfterMs: 900,
  },
  {
    role: "kai",
    content: "good. that one sentence keeps the door open. we can practice it here first if you want.",
    typingMs: 1200,
    pauseAfterMs: 3000,
  },
];
