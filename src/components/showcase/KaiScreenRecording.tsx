import { useEffect, useRef, useState } from "react";
import { BRAND } from "@/branding";
import {
  PARTNERS,
  SELECTED_INDEX,
  THANKSGIVING_CONVO,
  type ChatTurn,
} from "@/data/showcaseThanksgiving";

type Phase = "profiles" | "tap" | "chat";
type RenderedTurn = ChatTurn & { id: number };

const PROFILE_STEP_MS = 550;

const TypingDots = () => (
  <div className="flex items-center gap-1 px-1 py-2">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse"
        style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.9s" }}
      />
    ))}
  </div>
);

export const KaiScreenRecording = () => {
  const [phase, setPhase] = useState<Phase>("profiles");
  const [profileIndex, setProfileIndex] = useState(0);
  const [messages, setMessages] = useState<RenderedTurn[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [paused, setPaused] = useState(false);
  const [loopKey, setLoopKey] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

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
      // reset
      setPhase("profiles");
      setProfileIndex(0);
      setMessages([]);
      setIsTyping(false);
      idRef.current = 0;

      await wait(500);

      // Act 1: flip through profiles
      for (let i = 1; i <= SELECTED_INDEX; i++) {
        if (cancelled) return;
        await wait(PROFILE_STEP_MS);
        setProfileIndex(i);
      }

      // Act 2: tap
      await wait(600);
      if (cancelled) return;
      setPhase("tap");
      await wait(350);
      if (cancelled) return;
      setPhase("chat");
      await wait(500);

      // Act 3: conversation
      for (const turn of THANKSGIVING_CONVO) {
        if (cancelled) return;

        if (turn.role === "kai" && turn.typingMs) {
          setIsTyping(true);
          await wait(turn.typingMs);
          if (cancelled) return;
          setIsTyping(false);
        }

        idRef.current += 1;
        setMessages((prev) => [...prev, { ...turn, id: idRef.current }]);
        await wait(turn.holdMs ?? 700);
      }

      // hold, then loop
      await wait(1500);
      if (!cancelled) setLoopKey((k) => k + 1);
    };

    run();

    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [paused, loopKey]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const selectedPartner = PARTNERS[SELECTED_INDEX];

  return (
    <div
      className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ambient glow */}
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
          <div className="absolute left-1/2 top-2 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />

          {/* PROFILES SCREEN */}
          {phase !== "chat" && (
            <div
              className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${
                phase === "tap" ? "opacity-70" : "opacity-100"
              }`}
            >
              <div className="px-5 pt-10 pb-3">
                <div className="text-white/50 text-[11px] uppercase tracking-[0.18em]">
                  people
                </div>
                <div className="mt-1 font-serif text-2xl text-white/95 lowercase">
                  your relationships
                </div>
              </div>

              <div className="flex-1 px-5 pb-6 relative">
                {PARTNERS.map((p, i) => (
                  <ProfileCard
                    key={p.name}
                    partner={p}
                    active={i === profileIndex}
                    tapped={phase === "tap" && i === SELECTED_INDEX}
                    hidden={i > profileIndex}
                  />
                ))}
              </div>
            </div>
          )}

          {/* CHAT SCREEN */}
          {phase === "chat" && (
            <div className="absolute inset-0 flex flex-col animate-in fade-in duration-300">
              {/* header */}
              <div className="flex items-center gap-3 px-5 pt-10 pb-4 border-b border-white/5 bg-[hsl(345_60%_15%)]">
                <div
                  className="h-9 w-9 rounded-full ring-2 ring-white/10 flex items-center justify-center text-white font-medium text-sm"
                  style={{ background: selectedPartner.gradient, aspectRatio: "1 / 1" }}
                >
                  {selectedPartner.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white/95 text-sm font-medium lowercase">
                    kai · about {selectedPartner.name}
                  </div>
                  <div className="text-white/50 text-[11px] lowercase">
                    always here
                  </div>
                </div>
                <img
                  src={BRAND.coach.avatarSrc}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover opacity-90"
                  style={{ aspectRatio: "1 / 1" }}
                />
              </div>

              {/* messages */}
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5"
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
                    <div className="rounded-2xl rounded-bl-sm bg-white/10 px-3">
                      <TypingDots />
                    </div>
                  </div>
                )}
              </div>

              {/* input mock */}
              <div className="border-t border-white/5 bg-[hsl(345_60%_13%)] px-4 py-3">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5">
                  <span className="text-white/40 text-sm lowercase flex-1 truncate">
                    message kai…
                  </span>
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[hsl(350_100%_70%)] to-[hsl(24_95%_53%)]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-white/40 lowercase tracking-wide">
        autoplays a scripted flow · hover to pause
      </p>
    </div>
  );
};

const ProfileCard = ({
  partner,
  active,
  tapped,
  hidden,
}: {
  partner: (typeof PARTNERS)[number];
  active: boolean;
  tapped: boolean;
  hidden: boolean;
}) => {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur px-4 py-3.5 mb-3 flex items-center gap-3 transition-all duration-300 ${
        hidden
          ? "opacity-0 translate-y-3"
          : active
          ? "opacity-100 translate-y-0"
          : "opacity-50 translate-y-0"
      } ${tapped ? "scale-[0.97] bg-white/[0.09] ring-2 ring-[hsl(350_100%_70%/0.6)]" : "scale-100"}`}
    >
      <div
        className="h-11 w-11 rounded-full flex items-center justify-center text-white font-medium text-base shrink-0"
        style={{ background: partner.gradient, aspectRatio: "1 / 1" }}
      >
        {partner.initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white/95 text-[14px] font-medium lowercase">
          {partner.name}
        </div>
        <div className="text-white/50 text-[11px] lowercase truncate">
          {partner.meta}
        </div>
      </div>
      <div className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70 lowercase whitespace-nowrap">
        {partner.tag}
      </div>
    </div>
  );
};

const MessageBubble = ({ message }: { message: RenderedTurn }) => {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex items-end gap-2 animate-in fade-in slide-in-from-bottom-2 duration-400 ${
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
            : "rounded-bl-sm bg-white/10 text-white/95"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default KaiScreenRecording;
