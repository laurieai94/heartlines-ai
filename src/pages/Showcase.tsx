import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, Sparkles, Shield, Brain, Layers } from "lucide-react";
import KaiScreenRecording from "@/components/showcase/KaiScreenRecording";
import FlipPhoneIcon from "@/components/icons/FlipPhoneIcon";

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] lowercase tracking-wide text-white/70 backdrop-blur">
    {children}
  </span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 flex items-center gap-3">
    <span className="h-px w-8 bg-white/30" />
    <span className="text-[11px] uppercase tracking-[0.2em] text-white/50">{children}</span>
  </div>
);

const Callout = ({
  icon: Icon,
  title,
  body,
}: {
  icon: any;
  title: string;
  body: string;
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition hover:bg-white/[0.06]">
    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(350_100%_70%)/30] to-[hsl(24_95%_53%)/20] ring-1 ring-white/10">
      <Icon className="h-4 w-4 text-white/90" />
    </div>
    <div className="mb-1.5 text-sm font-medium text-white/95 lowercase">{title}</div>
    <div className="text-[13px] leading-relaxed text-white/60">{body}</div>
  </div>
);

const Stat = ({ value, label }: { value: string; label: string }) => (
  <div>
    <div className="font-playfair text-3xl text-white/95 md:text-4xl">{value}</div>
    <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/45">{label}</div>
  </div>
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2
    className="mb-3 max-w-2xl font-brand text-4xl leading-tight tracking-wider bg-gradient-to-r from-pink-100 via-orange-200 to-pink-100 bg-clip-text text-transparent md:text-5xl"
  >
    {children}
  </h2>
);

const Showcase = () => {
  return (
    <div
      className="min-h-screen text-white antialiased"
      style={{
        background:
          "radial-gradient(ellipse at top, hsl(350 90% 22%) 0%, hsl(345 100% 12%) 55%, hsl(345 100% 8%) 100%)",
      }}
    >
      <Helmet>
        <title>heartlines — a case study</title>
        <meta
          name="description"
          content="a case study on heartlines: kai, your ai relationship coach — lowercase, evidence-based, and designed for real life."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* subtle grain */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <FlipPhoneIcon size={28} />
          <div className="flex flex-col leading-none">
            <span className="font-brand text-2xl lowercase text-white/95">
              heartlines
            </span>
            <span className="font-glacial mt-0.5 text-[10px] font-semibold tracking-wide text-white/60">
              powered by laurie ai
            </span>
          </div>
        </Link>
        <a
          href="https://heartlines.ai"
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-1.5 text-xs lowercase text-white/60 transition hover:text-white"
        >
          view live site
          <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </header>

      {/* hero + chat centerpiece */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-8 md:pt-16">
        <div className="grid gap-16 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <Chip>case study</Chip>
              <Chip>2026</Chip>
              <Chip>react · supabase · claude sonnet</Chip>
            </div>
            <h1 className="font-playfair text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="font-brand">heartlines</span> helps you connect.
              <br />
              <span className="italic text-white/70">a case study.</span>
            </h1>
            <p className="mt-6 max-w-lg text-[15px] lowercase leading-relaxed text-white/65">
              kai is your ai relationship coach — trained in phd-level psychology,
              grounded in evidence-based and trauma-informed practices. lowercase,
              lgbtq+ inclusive, and designed for real life. she remembers your
              partner's name, notices your patterns, and meets you where you are.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="https://heartlines.ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm lowercase font-medium text-[hsl(345_60%_15%)] transition hover:bg-white/90"
              >
                try heartlines
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <Link
                to="/mission"
                className="text-sm lowercase text-white/60 underline-offset-4 transition hover:text-white hover:underline"
              >
                read the mission
              </Link>
            </div>
          </div>

          <div className="md:pl-4">
            <KaiScreenRecording />
          </div>
        </div>
      </section>

      {/* anatomy of a kai reply */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <SectionLabel>anatomy of a kai reply</SectionLabel>
        <SectionHeading>every sentence is a design decision.</SectionHeading>
        <p className="mb-12 max-w-2xl text-[15px] lowercase leading-relaxed text-white/60">
          kai's voice was engineered turn by turn. six rules that make her feel
          like a person you actually want to talk to — not another therapy chatbot.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Callout
            icon={Sparkles}
            title="lowercase, always"
            body="post-processed at the edge function level. no capitals, no exclamation marks, no emoji sprawl. reads like a text from a friend, not a customer service rep."
          />
          <Callout
            icon={Heart}
            title="partner name specificity"
            body="if you told kai your partner is jordan, kai says jordan — not 'they', not 'your partner'. enforced by a hard rule at the top of the system prompt."
          />
          <Callout
            icon={Brain}
            title="no therapy-speak"
            body="banned phrases: 'i hear you', 'that sounds valid', 'sitting with that'. rotator system prevents robotic loops across turns."
          />
          <Callout
            icon={Shield}
            title="crisis handoff"
            body="mental health risk triggers a scripted response with real hotlines (988, dv, sa) in the first sentence — before any discovery questions."
          />
          <Callout
            icon={Layers}
            title="invisible memory"
            body="profile data is 100% invisible. kai never says 'you mentioned' or 'according to your profile'. she just… knows, the way a friend knows."
          />
          <Callout
            icon={Brain}
            title="direct, not softened"
            body="bias, avoidance, and stonewalling get named in the first sentence. no cushion. warmth comes from precision, not padding."
          />
        </div>
      </section>

      {/* behind the scenes */}
      <section className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-16 md:grid-cols-2 md:gap-24">
          <div>
            <SectionLabel>behind the scenes</SectionLabel>
            <SectionHeading>built to be measured, not just felt.</SectionHeading>
            <p className="mb-4 text-[15px] lowercase leading-relaxed text-white/60">
              kai is a tiered-memory system running on claude sonnet with
              anthropic prompt caching. the prompt splits into a static (cached)
              layer for character and rules, and a dynamic layer for partner
              context and cross-session memory.
            </p>
            <p className="text-[15px] lowercase leading-relaxed text-white/60">
              behavior is measured with a 100-scenario evaluation harness —
              bias, crisis, adversarial, and everyday categories — judged by
              gemini and iterated on until pass rate lifts.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:gap-10">
            <Stat value="42%" label="eval pass rate v3" />
            <Stat value="100" label="test scenarios" />
            <Stat value="2 layer" label="prompt cache split" />
            <Stat value="24h" label="context memory" />
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <FlipPhoneIcon size={22} />
            <span className="font-brand text-base lowercase text-white/80">
              heartlines
            </span>
            <span className="font-glacial text-[11px] text-white/40">
              · a case study
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs lowercase text-white/50">
            <a
              href="https://heartlines.ai"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              live site
            </a>
            <Link to="/contact" className="transition hover:text-white">
              contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Showcase;
