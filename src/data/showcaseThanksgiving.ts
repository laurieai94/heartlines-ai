export type ChatTurn = {
  role: "user" | "kai";
  content: string;
  typingMs?: number;
  holdMs?: number;
};

export type PartnerCard = {
  name: string;
  meta: string;
  tag: string;
  gradient: string; // css gradient for avatar
  initial: string;
};

export const PARTNERS: PartnerCard[] = [
  {
    name: "priya",
    meta: "ex · 3y",
    tag: "still figuring it out",
    gradient: "linear-gradient(135deg, hsl(340 90% 65%), hsl(20 95% 60%))",
    initial: "p",
  },
  {
    name: "sam",
    meta: "friend · complicated",
    tag: "boundary work",
    gradient: "linear-gradient(135deg, hsl(280 70% 60%), hsl(340 85% 55%))",
    initial: "s",
  },
  {
    name: "marcus",
    meta: "partner · 8 months",
    tag: "meeting the family",
    gradient: "linear-gradient(135deg, hsl(24 95% 55%), hsl(350 100% 65%))",
    initial: "m",
  },
];

// index of the profile the user "taps" into
export const SELECTED_INDEX = 2;

export const THANKSGIVING_CONVO: ChatTurn[] = [
  {
    role: "user",
    content:
      "thanksgiving was a disaster. brought marcus home and my mom barely looked at him.",
    holdMs: 700,
  },
  {
    role: "kai",
    content:
      "that's a specific kind of pain — being unseen while the person you love watches it happen. what part is sitting with you the most?",
    typingMs: 900,
    holdMs: 700,
  },
  {
    role: "user",
    content: "that i didn't say anything. i just let it happen.",
    holdMs: 600,
  },
  {
    role: "kai",
    content:
      "you froze to keep the peace. survival move, not a failure. but marcus was in that room too — what do you think he needed from you?",
    typingMs: 900,
    holdMs: 700,
  },
  {
    role: "user",
    content: "for me to have his back.",
    holdMs: 600,
  },
  {
    role: "kai",
    content:
      "yeah. so the repair isn't with your mom yet — it's with marcus. one sentence tonight: \"i saw what happened. i should've said something. i'm sorry.\"",
    typingMs: 1000,
    holdMs: 2500,
  },
];
