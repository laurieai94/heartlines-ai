import { useEffect, useRef, useState } from "react";
import { SHOWCASE_CONVERSATION, type ShowcaseMessage } from "@/data/showcaseConversation";
import { BRAND } from "@/branding";

type RenderedMessage = ShowcaseMessage & { id: number };

const TypingDots = () => (
  <div className="flex items-center gap-1 px-1 py-2">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse"
        style={{ animationDelay: `${i * 150}ms`, animationDuration: "1s" }}
      />
    ))}
  </div>
);

export const KaiChatDemo = () => {
  const [messages, setMessages] = useState<RenderedMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [paused, setPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    if (paused) return;
    let cancelled = false;
    let timers: number[] = [];

    const play = async () => {
      // reset on loop
      setMessages([]);
      setIsTyping(false);
      idRef.current = 0;

      const wait = (ms: number) =>
        new Promise<void>((resolve) => {
          const t = window.setTimeout(resolve, ms);
          timers.push(t);
        });

      await wait(500);

      for (const msg of SHOWCASE_CONVERSATION) {
        if (cancelled) return;

        if (msg.role === "kai" && msg.typingMs) {
          setIsTyping(true);
          await wait(msg.typingMs);
          if (cancelled) return;
          setIsTyping(false);
        }

        idRef.current += 1;
        setMessages((prev) => [...prev, { ...msg, id: idRef.current }]);

        await wait(msg.pauseAfterMs ?? 1200);
      }

      // hold then loop
      await wait(3500);
      if (!cancelled) play();
    };

    play();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [paused]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  return (
    <div
      className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* glow */}
      <div
        aria-hidden
        className="absolute -inset-8 rounded-[3rem] blur-3xl opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, hsl(350 100% 70% / 0.35), transparent 60%), radial-gradient(circle at 70% 80%, hsl(24 95% 53% / 0.25), transparent 60%)",
        }}
      />

      {/* phone frame */}
      <div className="relative rounded-[2.75rem] bg-neutral-900 p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
        <div
          className="relative overflow-hidden rounded-[2.25rem] h-[640px] flex flex-col"
          style={{ background: "hsl(345 60% 15%)" }}
        >
          {/* notch */}
          <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />

          {/* header */}
          <div className="flex items-center gap-3 px-5 pt-10 pb-4 border-b border-white/5 z-10 bg-[hsl(345_60%_15%)]">
            <div className="relative">
              <img
                src={BRAND.coach.avatarSrc}
                alt="kai"
                className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10"
                style={{ aspectRatio: "1 / 1" }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[hsl(345_60%_15%)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white/95 text-sm font-medium lowercase">kai</div>
              <div className="text-white/50 text-[11px] lowercase">always here</div>
            </div>
          </div>

          {/* messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-none"
            style={{ scrollbarWidth: "none" }}
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {isTyping && (
              <div className="flex items-end gap-2">
                <img
                  src={BRAND.coach.avatarSrc}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover opacity-80"
                  style={{ aspectRatio: "1 / 1" }}
                />
                <div className="rounded-2xl rounded-bl-sm bg-white/8 px-3">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* input mock */}
          <div className="border-t border-white/5 bg-[hsl(345_60%_13%)] px-4 py-3">
            <div className="flex items-center gap-2 rounded-full bg-white/8 px-4 py-2.5">
              <span className="text-white/40 text-sm lowercase flex-1 truncate">
                message kai…
              </span>
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[hsl(350_100%_70%)] to-[hsl(24_95%_53%)]" />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-white/40 lowercase tracking-wide">
        hover to pause · autoplays a scripted conversation
      </p>
    </div>
  );
};

const MessageBubble = ({ message }: { message: RenderedMessage }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <img
          src={BRAND.coach.avatarSrc}
          alt=""
          className="h-6 w-6 rounded-full object-cover opacity-80 shrink-0"
          style={{ aspectRatio: "1 / 1" }}
        />
      )}
      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-[13.5px] leading-relaxed ${
          isUser
            ? "rounded-br-sm bg-gradient-to-br from-[hsl(350_100%_70%)] to-[hsl(24_95%_53%)] text-white shadow-lg shadow-rose-500/20"
            : "rounded-bl-sm bg-white/8 text-white/95"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default KaiChatDemo;
