import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Heart,
  Plus,
  Menu,
  Info,
  Send,
  User,
  Pencil,
  Crown,
  Star,
  Search,
  Lock,
  MessageSquare,
  Check,
  ArrowRight,
  UserPlus,
  RotateCcw,
  X,
} from "lucide-react";
import ChatBubble from "@/components/chat/ChatBubble";
import FlipPhoneIcon from "@/components/icons/FlipPhoneIcon";
import { BRAND } from "@/branding";
import heroImage from "@/assets/hero-carousel/cowboys-with-wheelchair.webp";
import {
  THANKSGIVING_CONVO,
  type ChatTurn,
} from "@/data/showcaseThanksgiving";

/**
 * Auto-playing product tour rendered inside the phone frame on /showcase.
 * Walks through 5 phases, then reloads to loop.
 *
 * NOTE: production carousel/modal components pull router+auth+supabase
 * context, so each phase is a screenshot-accurate scripted replica built
 * from the same tokens and copy. The chat phase reuses the real ChatBubble.
 */

type Phase = "hero" | "situationship" | "profileForm" | "chatEmpty" | "chatConvo";
type RenderedTurn = ChatTurn & { id: number };

const PHASE_MS: Record<Phase, number> = {
  hero: 6500,
  situationship: 9000,
  profileForm: 13000,
  chatEmpty: 4500,
  chatConvo: 0, // driven by convo script
};

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

// tap flash overlay for simulated user taps
const TapFlash = ({
  visible,
  style,
}: {
  visible: boolean;
  style: React.CSSProperties;
}) => (
  <div
    className={`pointer-events-none absolute z-40 transition-opacity duration-200 ${
      visible ? "opacity-100" : "opacity-0"
    }`}
    style={style}
  >
    <div className="h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25 ring-2 ring-white/70 animate-ping" />
  </div>
);

const ShowcaseDemo = () => {
  const [phase, setPhase] = useState<Phase>("hero");
  const [loopKey, setLoopKey] = useState(0);
  const [messages, setMessages] = useState<RenderedTurn[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [tap, setTap] = useState<{ top: string; left: string } | null>(null);
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

    const flashTap = async (top: string, left: string) => {
      setTap({ top, left });
      await wait(500);
      if (cancelled) return;
      setTap(null);
    };

    const run = async () => {
      setPhase("hero");
      setMessages([]);
      setIsTyping(false);
      setTap(null);
      idRef.current = 0;

      await wait(PHASE_MS.hero - 700);
      if (cancelled) return;
      // tap "get started"
      await flashTap("38px", "82%");

      setPhase("situationship");
      await wait(PHASE_MS.situationship - 700);
      if (cancelled) return;
      // tap the partner "cam" edit
      await flashTap("60%", "88%");

      setPhase("profileForm");
      // tap next once mid-way
      await wait(6000);
      if (cancelled) return;
      await flashTap("95%", "92%");
      await wait(PHASE_MS.profileForm - 6700);
      if (cancelled) return;

      setPhase("chatEmpty");
      await wait(PHASE_MS.chatEmpty - 700);
      if (cancelled) return;
      // tap "Hard-to-Say Feelings"
      await flashTap("74%", "28%");

      setPhase("chatConvo");
      await wait(400);

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

      await wait(2500);
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

  return (
    <div
      className="fixed inset-0 overflow-hidden text-white antialiased"
      style={{ background: "hsl(345 60% 13%)" }}
    >
      <Helmet>
        <title>heartlines · demo</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {phase === "hero" && <HeroPhase />}
      {phase === "situationship" && <SituationshipPhase />}
      {phase === "profileForm" && <ProfileFormPhase />}
      {phase === "chatEmpty" && <ChatEmptyPhase />}
      {phase === "chatConvo" && (
        <ChatConvoPhase
          messages={messages}
          isTyping={isTyping}
          scrollRef={scrollRef}
        />
      )}

      {tap && (
        <TapFlash
          visible
          style={{ top: tap.top, left: tap.left, position: "absolute" }}
        />
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* PHASE 1 — landing hero                                                     */
/* -------------------------------------------------------------------------- */

const HeroPhase = () => (
  <div className="absolute inset-0 flex flex-col animate-in fade-in duration-500">
    <img
      src={heroImage}
      alt=""
      className="absolute inset-0 h-full w-full object-cover"
      style={{ filter: "saturate(1.05) contrast(1.02)" }}
    />
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(to bottom, hsl(345 60% 13% / 0.85) 0%, transparent 22%, transparent 60%, hsl(345 60% 8% / 0.85) 100%)",
      }}
    />

    {/* top nav */}
    <div className="relative z-10 flex items-center justify-between px-4 pt-3">
      <FlipPhoneIcon size={26} />
      <div className="flex items-center gap-2">
        <User className="h-4 w-4 text-white/85" />
        <button className="rounded-full bg-gradient-to-r from-[hsl(350_100%_70%)] to-[hsl(24_95%_53%)] px-4 py-1.5 text-[11px] font-medium lowercase text-white shadow-lg shadow-rose-500/30">
          get started
        </button>
      </div>
    </div>

    {/* wordmark bottom-right of image */}
    <div className="relative z-10 mt-auto flex flex-col items-end px-4 pb-1">
      <span className="font-brand text-[38px] leading-none lowercase text-white">
        heartlines
      </span>
      <span className="mt-1 text-[9px] tracking-wide text-white/70 lowercase">
        powered laurie ai
      </span>
    </div>

    {/* year lockup bottom-left */}
    <div className="relative z-10 px-5 pb-6">
      <div
        className="font-playfair italic text-[52px] leading-none"
        style={{
          color: "hsl(24 95% 60%)",
          textShadow: "0 2px 24px hsl(24 95% 40% / 0.6)",
        }}
      >
        2063
      </div>
      <div className="mt-2 text-[13px] lowercase text-white/85">
        what it's all for
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* PHASE 2 — situationship setup                                              */
/* -------------------------------------------------------------------------- */

const SituationshipPhase = () => (
  <div className="absolute inset-0 flex flex-col animate-in fade-in duration-500 overflow-y-auto">
    <div className="flex items-center justify-start px-4 pt-3">
      <FlipPhoneIcon size={22} />
    </div>

    <div className="px-5 pt-6 text-center">
      <h1
        className="font-brand text-[26px] leading-[1.1] lowercase"
        style={{
          background:
            "linear-gradient(180deg, hsl(350 100% 88%), hsl(350 90% 78%))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 0 32px hsl(350 100% 70% / 0.5)",
        }}
      >
        let's get to know your situationship
      </h1>
    </div>

    <div className="mt-5 flex justify-center px-5">
      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 backdrop-blur">
        <div
          className="h-6 w-6 rounded-full"
          style={{
            background:
              "url(" + BRAND.coach.avatarSrc + ") center/cover, hsl(24 95% 55%)",
          }}
        />
        <span className="text-[11px] font-medium lowercase text-white/95">
          unlock coaching with kai
        </span>
        <MessageSquare className="h-3 w-3 text-white/70" />
      </div>
    </div>

    <div className="mt-5 space-y-3 px-4 pb-6">
      {/* your profile card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3.5 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <HeartAvatar letter="s" />
          <div className="flex-1">
            <div className="text-[13px] font-medium lowercase text-white/95">
              your profile
            </div>
            <div className="text-[10px] lowercase text-white/60">
              the realer you, the smarter kai
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full"
              style={{
                width: "75%",
                background:
                  "linear-gradient(90deg, hsl(24 95% 60%), hsl(350 100% 70%))",
              }}
            />
          </div>
          <div className="text-[11px] font-medium text-[hsl(45_95%_70%)]">
            75%
          </div>
        </div>
        <div className="mt-3 space-y-1.5 rounded-xl border border-white/8 bg-white/[0.02] p-2.5">
          <ProfileRow icon={Star} text="5 quick qs, big feels" />
          <ProfileRow icon={Search} text="deep dive if it feels right" />
          <ProfileRow icon={Lock} text="private by design" />
        </div>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[hsl(24_95%_60%)] to-[hsl(350_100%_70%)] py-2 text-[12px] font-medium lowercase text-white shadow-lg">
          keep it real
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* partner profiles card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3.5 backdrop-blur">
        <div className="flex items-start gap-2.5">
          <HeartAvatar icon={<UserPlus className="h-3.5 w-3.5 text-white" />} />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-medium lowercase text-white/95">
                partner profiles
              </div>
              <div className="text-[10px] lowercase text-white/45">1/1</div>
            </div>
            <div className="text-[10px] lowercase text-white/60">
              help kai understand them
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/25">
            <Check className="h-3 w-3 text-green-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium lowercase text-white/95">
              cam
            </div>
            <div className="text-[10px] lowercase text-white/50 truncate">
              anxious · thoughtful gifts that show you...
            </div>
          </div>
          <Pencil className="h-3.5 w-3.5 text-white/60" />
        </div>
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] lowercase text-[hsl(45_80%_65%)]">
          <Crown className="h-3 w-3" />
          upgrade for more
        </div>
      </div>
    </div>
  </div>
);

const ProfileRow = ({
  icon: Icon,
  text,
}: {
  icon: any;
  text: string;
}) => (
  <div className="flex items-center gap-2">
    <Icon className="h-3 w-3 text-[hsl(45_90%_65%)]" />
    <span className="text-[11px] lowercase text-white/80">{text}</span>
  </div>
);

const HeartAvatar = ({
  letter,
  icon,
}: {
  letter?: string;
  icon?: React.ReactNode;
}) => (
  <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center">
    <Heart
      className="absolute inset-0 h-full w-full"
      style={{
        fill: "url(#heartGrad)",
        color: "transparent",
        filter: "drop-shadow(0 0 6px hsl(350 100% 70% / 0.5))",
      }}
    />
    <svg width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="heartGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="hsl(350 100% 72%)" />
          <stop offset="1" stopColor="hsl(24 95% 60%)" />
        </linearGradient>
      </defs>
    </svg>
    <div className="relative z-10 text-white text-[13px] font-semibold lowercase">
      {icon ?? letter}
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* PHASE 3 — sam's profile form                                               */
/* -------------------------------------------------------------------------- */

const ProfileFormPhase = () => (
  <div className="absolute inset-0 flex flex-col animate-in fade-in duration-500 p-3">
    <div
      className="flex-1 rounded-2xl border border-white/10 bg-[hsl(345_55%_11%)] p-3 shadow-2xl flex flex-col overflow-hidden"
      style={{
        boxShadow: "0 0 40px hsl(350 100% 40% / 0.25)",
      }}
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="text-[15px] font-semibold lowercase text-white/95">
          sam's profile
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-white/80">100%</span>
          <RotateCcw className="h-3.5 w-3.5 text-white/60" />
          <X className="h-3.5 w-3.5 text-white/60" />
        </div>
      </div>
      <div className="mt-1.5 h-0.5 w-full rounded-full bg-green-400/70" />

      {/* tabs */}
      <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1">
        <TabPill label="the basics" active icon={<User className="h-3 w-3" />} />
        <TabPill
          label="your situationship"
          icon={<Heart className="h-3 w-3" />}
          done
        />
      </div>
      <div className="mt-1.5 flex gap-1.5 overflow-x-auto pb-1">
        <TabPill label="how you operate" done />
        <TabPill label="your foundation" done />
      </div>

      {/* card */}
      <div className="mt-3 rounded-xl border border-white/8 bg-white/[0.02] p-3">
        <div className="flex gap-3">
          <HeartAvatar letter="s" />
          <div className="flex-1">
            <div className="text-[11px] lowercase text-white/85">
              what should we call you? <span className="text-rose-300">*</span>
            </div>
            <div className="mt-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[13px] text-white lowercase">
              sam
            </div>
          </div>
        </div>
        <div className="mt-3">
          <div className="text-[11px] lowercase text-white/85">
            what pronouns do you use? <span className="text-rose-300">*</span>
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <PronounChip label="she/her" active />
            <PronounChip label="he/him" />
            <PronounChip label="they/them" />
            <PronounChip label="she/they" />
            <PronounChip label="he/they" />
            <PronounChip label="other" />
          </div>
        </div>
      </div>

      <div className="mt-2 rounded-xl border border-white/8 bg-white/[0.02] p-2.5 flex items-center gap-2">
        <span className="rounded-md border border-white/20 px-1.5 py-0.5 text-[9px] lowercase text-white/80">
          optional
        </span>
        <span className="text-[10px] lowercase text-green-300">
          +better insights
        </span>
      </div>

      <div className="flex-1" />

      {/* footer */}
      <div className="mt-2 flex items-center gap-1.5">
        <button className="rounded-lg bg-white/5 px-2 py-1.5 text-[10px] lowercase text-white/60">
          previous
        </button>
        <div className="flex gap-1 px-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1 w-1 rounded-full bg-green-400/80"
            />
          ))}
        </div>
        <div className="flex-1" />
        <button className="rounded-lg bg-gradient-to-r from-[hsl(24_95%_60%)] to-[hsl(350_100%_70%)] px-2.5 py-1.5 text-[10px] font-medium lowercase text-white shadow">
          next
        </button>
      </div>
    </div>
  </div>
);

const TabPill = ({
  label,
  active,
  done,
  icon,
}: {
  label: string;
  active?: boolean;
  done?: boolean;
  icon?: React.ReactNode;
}) => (
  <div
    className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-medium lowercase whitespace-nowrap ${
      active
        ? "bg-gradient-to-r from-[hsl(350_100%_65%)] to-[hsl(24_95%_55%)] text-white shadow"
        : "border border-white/10 bg-white/[0.03] text-white/70"
    }`}
  >
    {icon}
    {label}
    {(active || done) && (
      <span
        className={`ml-0.5 flex h-3 w-3 items-center justify-center rounded-full ${
          active ? "bg-white/25" : "bg-green-500/70"
        }`}
      >
        <Check className="h-2 w-2 text-white" />
      </span>
    )}
  </div>
);

const PronounChip = ({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) => (
  <div
    className={`rounded-md border px-2 py-1 text-[10px] lowercase ${
      active
        ? "border-white/40 bg-white/10 text-white shadow-[inset_0_0_0_1px_hsl(350_100%_70%/0.6)]"
        : "border-white/10 bg-white/[0.03] text-white/70"
    }`}
  >
    {label}
  </div>
);

/* -------------------------------------------------------------------------- */
/* PHASE 4 — kai chat empty state                                             */
/* -------------------------------------------------------------------------- */

const STARTER_CATEGORIES = [
  "Conflict & Repeating Patterns",
  "Disconnection & Distance",
  "Hard-to-Say Feelings",
  "Growth & Understanding",
  "Intimacy & Closeness",
  "Partnership & Fairness",
];

const ChatEmptyPhase = () => (
  <div className="absolute inset-0 flex flex-col animate-in fade-in duration-500">
    {/* header */}
    <div className="shrink-0 border-b border-white/8 bg-[hsl(345_55%_10%)] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-white/15">
            <img
              src={BRAND.coach.avatarSrc}
              alt="kai"
              className="h-full w-full object-cover"
            />
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border border-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[13px] font-semibold lowercase text-white/95">
                kai
              </span>
              <Info className="h-3 w-3 text-white/60" />
            </div>
            <div className="text-[10px] lowercase text-white/60">
              your ai relationship coach
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <div className="flex flex-col items-center">
            <Menu className="h-4 w-4" />
            <span className="mt-0.5 text-[8px] lowercase">chats</span>
          </div>
          <div className="flex flex-col items-center">
            <Plus className="h-4 w-4" />
            <span className="mt-0.5 text-[8px] lowercase">new</span>
          </div>
        </div>
      </div>
    </div>

    <div className="flex-1" />

    {/* starters */}
    <div className="px-4">
      <div className="mb-2 text-center text-[11px] font-medium lowercase text-white/85">
        what's on your mind?
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {STARTER_CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            className={`rounded-lg border px-2 py-2 text-[9px] font-medium lowercase text-white/90 transition ${
              i === 2
                ? "border-[hsl(350_100%_70%/0.6)] bg-white/[0.06] shadow-[0_0_16px_hsl(350_100%_60%/0.3)]"
                : "border-white/10 bg-white/[0.02]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>

    {/* composer */}
    <div className="mt-3 px-3 pb-3">
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] pl-3.5 pr-1 py-1">
        <span className="flex-1 text-[12px] lowercase text-white/40">
          what's up?
        </span>
        <button className="h-7 w-7 rounded-full bg-gradient-to-br from-[hsl(350_100%_70%)] to-[hsl(24_95%_53%)] flex items-center justify-center shadow-lg">
          <Send className="h-3 w-3 text-white" />
        </button>
      </div>
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* PHASE 5 — scripted chat convo (reuses production ChatBubble)               */
/* -------------------------------------------------------------------------- */

const ChatConvoPhase = ({
  messages,
  isTyping,
  scrollRef,
}: {
  messages: RenderedTurn[];
  isTyping: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
}) => (
  <div className="absolute inset-0 flex flex-col animate-in fade-in duration-300">
    {/* header */}
    <div className="shrink-0 border-b border-pink-400/10 bg-[hsl(345_55%_10%)] shadow-lg">
      <div className="w-full px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="relative z-10 w-[38px] h-[38px] rounded-full overflow-hidden ring-2 ring-white/15">
                <img
                  src={BRAND.coach.avatarSrc}
                  alt="kai"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-white font-semibold text-[13px] lowercase">
                  kai
                </h3>
                <Info className="w-3 h-3 text-white/60" />
              </div>
              <span className="text-white/60 text-[10px] lowercase">
                about cam
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-white/70">
            <Plus className="w-4 h-4" />
            <Menu className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>

    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5"
      style={{ scrollbarWidth: "none" }}
    >
      {messages.map((m) => (
        <div
          key={m.id}
          className="animate-in fade-in slide-in-from-bottom-2 duration-400"
        >
          {m.role === "kai" ? (
            <div className="flex items-end gap-1.5 justify-start">
              <img
                src={BRAND.coach.avatarSrc}
                alt=""
                className="h-5 w-5 rounded-full object-cover opacity-90 shrink-0"
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
        <div className="flex items-end gap-1.5 animate-in fade-in duration-200">
          <img
            src={BRAND.coach.avatarSrc}
            alt=""
            className="h-5 w-5 rounded-full object-cover opacity-90 shrink-0"
          />
          <div className="rounded-2xl rounded-bl-sm bg-white/10 border border-white/20 px-3 py-1.5">
            <TypingDots />
          </div>
        </div>
      )}
    </div>

    <div className="shrink-0 border-t border-white/5 bg-[hsl(345_55%_10%)] px-3 py-2">
      <div className="flex items-center gap-2 rounded-full bg-white/[0.06] border border-white/10 pl-3.5 pr-1 py-1">
        <span className="text-white/40 text-[12px] lowercase flex-1 truncate">
          message kai...
        </span>
        <button
          aria-label="send"
          className="h-7 w-7 rounded-full bg-gradient-to-br from-[hsl(350_100%_70%)] to-[hsl(24_95%_53%)] flex items-center justify-center shadow-lg"
        >
          <Send className="h-3 w-3 text-white" />
        </button>
      </div>
    </div>
  </div>
);

export default ShowcaseDemo;
