import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Heart, Plus, Menu, Info, Send } from "lucide-react";
import ChatBubble from "@/components/chat/ChatBubble";
import { BRAND } from "@/branding";
import {
  PARTNERS,
  SELECTED_INDEX,
  THANKSGIVING_CONVO,
  type ChatTurn,
} from "@/data/showcaseThanksgiving";

/**
 * Chrome-free demo of the real Heartlines interface, driven by scripted mock
 * data (no auth, no backend). Designed to be embedded as an iframe inside the
 * phone frame on /showcase.
 */

type Phase = "profiles" | "tap" | "chat";
type RenderedTurn = ChatTurn & { id: number };

const PROFILE_STEP_MS = 550;

const TypingDots = () => (
  <div className="flex items-center gap-1 px-1 py-1.5">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-white/70 animate-pulse"
        style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.9s" }}
      />
    ))}
  </div>
);

const ShowcaseDemo = () => {
  const [phase, setPhase] = useState<Phase>("profiles");
  const [profileIndex, setProfileIndex] = useState(0);
  const [messages, setMessages] = useState<RenderedTurn[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loopKey, setLoopKey] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = window.setTimeout(resolve, ms);
        timers.push(t);
      });

    const run = async () => {
      setPhase("profiles");
      setProfileIndex(0);
      setMessages([]);
      setIsTyping(false);
      idRef.current = 0;

      await wait(600);

      for (let i = 1; i <= SELECTED_INDEX; i++) {
        if (cancelled) return;
        await wait(PROFILE_STEP_MS);
        setProfileIndex(i);
      }

      await wait(650);
      if (cancelled) return;
      setPhase("tap");
      await wait(380);
      if (cancelled) return;
      setPhase("chat");
      await wait(500);

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

      await wait(2200);
      if (!cancelled) setLoopKey((k) => k + 1);
    };

    run();
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [loopKey]);

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
      className="fixed inset-0 flex flex-col overflow-hidden text-white antialiased"
      style={{ background: "hsl(345 60% 13%)" }}
    >
      <Helmet>
        <title>heartlines · demo</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* PROFILES SCREEN — mirrors production People layout */}
      {phase !== "chat" && (
        <div
          className={`absolute inset-0 flex flex-col transition-opacity duration-300 ${
            phase === "tap" ? "opacity-80" : "opacity-100"
          }`}
        >
          <div className="px-5 pt-6 pb-3">
            <div className="text-white/50 text-[11px] uppercase tracking-[0.18em]">
              people
            </div>
            <div className="mt-1 font-serif text-[26px] leading-tight text-white/95 lowercase">
              your relationships
            </div>
            <div className="mt-1 text-white/55 text-[12px] lowercase">
              3 people · tap to open with kai
            </div>
          </div>

          <div className="flex-1 px-4 pb-6 space-y-2.5">
            {PARTNERS.map((p, i) => (
              <ProfileCard
                key={p.name}
                partner={p}
                active={i === profileIndex}
                tapped={phase === "tap" && i === SELECTED_INDEX}
                hidden={i > profileIndex}
              />
            ))}

            {/* add-partner slot, echoes production */}
            <div
              className={`mt-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-3 flex items-center gap-3 transition-opacity duration-300 ${
                profileIndex >= PARTNERS.length - 1 ? "opacity-70" : "opacity-0"
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                <Plus className="h-4 w-4 text-white/60" />
              </div>
              <div className="text-white/60 text-[13px] lowercase">
                add someone
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHAT SCREEN — real ChatBubble variant="kai" for pixel-parity */}
      {phase === "chat" && (
        <div className="absolute inset-0 flex flex-col animate-in fade-in duration-300">
          {/* header mirrors production ChatHeader (mobile variant) */}
          <div className="chat-header shrink-0 bg-burgundy-800 border-b border-pink-400/10 shadow-lg">
            <div className="w-full px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-coral-400/20 to-burgundy-400/20 rounded-full blur-md animate-pulse" />
                    <div className="relative z-10 w-[42px] h-[42px] rounded-full overflow-hidden bg-gradient-to-br from-coral-400 to-burgundy-500 border-2 border-white/20 shadow-lg">
                      <img
                        src={BRAND.coach.avatarSrc}
                        alt="kai"
                        className="h-full w-full object-cover"
                        style={{ aspectRatio: "1 / 1" }}
                      />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse shadow-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold text-[15px] truncate lowercase">
                        kai
                      </h3>
                      <div className="h-5 w-5 rounded-full bg-white/10 flex items-center justify-center">
                        <Info className="w-3 h-3 text-white/70" />
                      </div>
                    </div>
                    <span className="text-white/70 text-[11px] truncate block lowercase">
                      about {selectedPartner.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="text-white/70 hover:text-white p-2 rounded-xl">
                    <Plus className="w-5 h-5" />
                  </button>
                  <button className="text-white/70 hover:text-white p-2 rounded-xl">
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3.5 py-4 space-y-3"
            style={{ scrollbarWidth: "none" }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-400"
              >
                {m.role === "kai" ? (
                  <div className="flex items-end gap-2 justify-start">
                    <img
                      src={BRAND.coach.avatarSrc}
                      alt=""
                      className="h-6 w-6 rounded-full object-cover opacity-90 shrink-0"
                      style={{ aspectRatio: "1 / 1" }}
                    />
                    <div className="flex-1">
                      <ChatBubble variant="kai">{m.content}</ChatBubble>
                    </div>
                  </div>
                ) : (
                  <ChatBubble isUser>{m.content}</ChatBubble>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-end gap-2 animate-in fade-in duration-200">
                <img
                  src={BRAND.coach.avatarSrc}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover opacity-90 shrink-0"
                  style={{ aspectRatio: "1 / 1" }}
                />
                <div className="rounded-2xl rounded-bl-sm bg-white/10 backdrop-blur-sm border-2 border-white/30 px-3 py-1.5">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* input — mirrors production composer */}
          <div className="shrink-0 border-t border-white/5 bg-burgundy-900/60 px-3 py-2.5">
            <div className="flex items-center gap-2 rounded-full bg-white/[0.08] border border-white/10 pl-4 pr-1.5 py-1.5">
              <span className="text-white/45 text-[13px] lowercase flex-1 truncate">
                message kai…
              </span>
              <button
                aria-label="send"
                className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(350_100%_70%)] to-[hsl(24_95%_53%)] flex items-center justify-center shadow-lg shadow-rose-500/20"
              >
                <Send className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
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
      className={`rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur px-4 py-3.5 flex items-center gap-3 transition-all duration-300 ${
        hidden
          ? "opacity-0 translate-y-3"
          : active
          ? "opacity-100 translate-y-0"
          : "opacity-55 translate-y-0"
      } ${
        tapped
          ? "scale-[0.97] bg-white/[0.10] ring-2 ring-[hsl(350_100%_70%/0.7)]"
          : "scale-100"
      }`}
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
      <Heart className="h-3.5 w-3.5 text-white/30 shrink-0" />
    </div>
  );
};

export default ShowcaseDemo;
