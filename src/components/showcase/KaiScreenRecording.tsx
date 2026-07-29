import { useEffect, useRef, useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import ChatBubble from "@/components/chat/ChatBubble";
import { demoConversations } from "@/data/demoConversations";
import millennialWoman from "@/assets/millennial-woman-portrait.jpg";

type Turn = { kind: "user" | "kai"; text: string; typingMs: number; holdMs: number };
type Rendered = Turn & { id: number };

const KAI_AVATAR = "/lovable-uploads/kai-avatar-new.png";
const USER_AVATAR = millennialWoman;
const LOOP_PAUSE_MS = 1600;

// Cycle through several real conversations from the app
const CONVERSATIONS = demoConversations.slice(0, 5).map((c) => ({
  title: c.title.toLowerCase(),
  theme: c.theme.toLowerCase(),
  turns: c.messages.map<Turn>((m) => {
    const text = m.content.toLowerCase();
    const len = text.length;
    return {
      kind: m.type === "user" ? "user" : "kai",
      text,
      typingMs: Math.min(1600, 500 + Math.round(len * 18)),
      holdMs: Math.min(2200, 800 + Math.round(len * 12)),
    };
  }),
}));

const TypingDots = () => (
  <div className="flex items-center gap-1 px-1 py-1">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-white/80 animate-pulse"
        style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.9s" }}
      />
    ))}
  </div>
);

const Avatar = ({ src, alt }: { src: string; alt: string }) => (
  <span className="relative inline-block h-7 w-7 shrink-0 overflow-hidden rounded-full ring-2 ring-white/25 shadow-[0_0_16px_hsl(24_95%_60%/0.35)]">
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      style={{ aspectRatio: "1 / 1" }}
    />
  </span>
);

export const KaiScreenRecording = () => {
  const [messages, setMessages] = useState<Rendered[]>([]);
  const [typing, setTyping] = useState<"user" | "kai" | null>(null);
  const [paused, setPaused] = useState(false);
  const [convoIndex, setConvoIndex] = useState(0);
  const idRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = window.setTimeout(resolve, ms);
        timers.push(t);
      });

    const run = async () => {
      let i = 0;
      while (!cancelled) {
        const convo = CONVERSATIONS[i % CONVERSATIONS.length];
        setConvoIndex(i % CONVERSATIONS.length);
        setMessages([]);
        setTyping(null);
        idRef.current = 0;
        await wait(500);
        for (const turn of convo.turns) {
          if (cancelled) return;
          setTyping(turn.kind);
          await wait(turn.typingMs);
          if (cancelled) return;
          setTyping(null);
          idRef.current += 1;
          setMessages((prev) => [...prev, { ...turn, id: idRef.current }]);
          await wait(turn.holdMs);
        }
        // linger on the finished convo before moving on
        await wait(LOOP_PAUSE_MS);
        i += 1;
      }
    };

    run();
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [paused]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-col items-center justify-center"
      style={{ paddingTop: "clamp(0.25rem, 1vh, 1rem)", paddingBottom: "clamp(0.25rem, 1vh, 1rem)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ambient rose/gold glow */}
      <div
        aria-hidden
        className="absolute -inset-10 rounded-[3rem] blur-3xl opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 80% 15%, hsl(24 95% 55% / 0.55), transparent 55%), radial-gradient(circle at 20% 80%, hsl(350 100% 65% / 0.4), transparent 60%)",
        }}
      />

      {/* glassmorphic phone — larger, height-first so it never clips */}
      <div
        className="relative min-h-0 flex-1 rounded-[2.25rem] border border-white/15 bg-white/[0.04] backdrop-blur-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]"
        style={{
          aspectRatio: "9 / 18",
          maxHeight: "min(80svh, 760px)",
          maxWidth: "100%",
          width: "auto",
        }}
      >
        {/* top status */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <span className="text-[11px] font-medium text-white/80 tabular-nums">
            9:41
          </span>
          <span
            aria-hidden
            className="relative inline-flex h-6 w-6 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20 shadow-[0_0_24px_hsl(24_95%_60%/0.55)]"
          >
            <MessageSquare className="h-3 w-3 text-white/90" strokeWidth={2.4} />
          </span>
        </div>

        {/* header */}
        <div className="flex items-center gap-3 px-5 pb-3">
          <Avatar src={KAI_AVATAR} alt="kai" />
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold lowercase text-white">
              kai
            </span>
            <span key={CONVERSATIONS[convoIndex].theme} className="text-[11px] lowercase text-white/55 animate-in fade-in duration-500">
              {CONVERSATIONS[convoIndex].theme}
            </span>
          </div>
        </div>

        {/* chat stream */}
        <div
          ref={scrollRef}
          className="absolute left-0 right-0 top-[104px] bottom-[76px] overflow-hidden px-4"
        >
          <div className="flex flex-col gap-2.5 pb-2">
            {messages.map((m) => (
              <div key={m.id} className="animate-in fade-in slide-in-from-bottom-1 duration-300">
                {m.kind === "user" ? (
                  <div className="flex items-end justify-end gap-2">
                    <ChatBubble isUser variant="default">
                      {m.text}
                    </ChatBubble>
                    <Avatar src={USER_AVATAR} alt="you" />
                  </div>
                ) : (
                  <div className="flex items-end gap-2">
                    <Avatar src={KAI_AVATAR} alt="kai" />
                    <ChatBubble variant="kai">{m.text}</ChatBubble>
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div
                className={`flex items-end gap-2 ${
                  typing === "user" ? "justify-end flex-row-reverse" : ""
                }`}
              >
                <Avatar
                  src={typing === "user" ? USER_AVATAR : KAI_AVATAR}
                  alt={typing}
                />
                <div className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 backdrop-blur-sm shadow-lg shadow-white/5">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* composer */}
        <div className="absolute inset-x-4 bottom-4">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] pl-4 pr-1.5 py-1.5 backdrop-blur-sm">
            <span className="flex-1 text-[12px] lowercase text-white/45">
              chat with kai...
            </span>
            <button
              aria-hidden
              tabIndex={-1}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(350_100%_70%)] to-[hsl(24_95%_53%)] shadow-lg shadow-rose-500/30"
            >
              <Send className="h-3.5 w-3.5 text-white -rotate-45" />
            </button>
          </div>
        </div>
      </div>

      {/* category caption + progress */}
      <div className="relative z-10 mt-3 flex shrink-0 flex-col items-center gap-2">
        <span key={CONVERSATIONS[convoIndex].title} className="text-sm font-semibold lowercase text-white/90 animate-in fade-in duration-500">
          {CONVERSATIONS[convoIndex].title}
        </span>
        <div className="flex items-center gap-1.5" aria-hidden>
          {CONVERSATIONS.map((_, i) => (
            <span
              key={i}
              className={`h-1 w-8 rounded-full transition-all duration-500 ${
                i === convoIndex
                  ? "bg-gradient-to-r from-[hsl(350_100%_70%)] to-[hsl(24_95%_53%)] shadow-[0_0_10px_hsl(24_95%_60%/0.7)]"
                  : "bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default KaiScreenRecording;
