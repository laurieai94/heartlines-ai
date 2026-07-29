import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import KaiScreenRecording from "@/components/showcase/KaiScreenRecording";
import FlipPhoneIcon from "@/components/icons/FlipPhoneIcon";

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] lowercase tracking-wide text-white/70 backdrop-blur">
    {children}
  </span>
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
        <title>heartlines · showcase</title>
        <meta
          name="description"
          content="heartlines helps you connect. kai is your ai friend for the relationships that matter."
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

      {/* hero + phone centerpiece */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-8 md:pt-16">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-8">
          <div className="px-2 sm:px-0">
            <div className="mb-6 flex flex-wrap gap-2">
              <Chip>powered by laurie ai</Chip>
              <Chip>2026</Chip>
            </div>
            <h1 className="font-playfair text-4xl font-normal leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="font-brand">heartlines</span> helps you connect.
            </h1>
            <p className="mt-6 max-w-lg text-[15px] lowercase leading-relaxed text-white/65">
              kai is your ai friend for the relationships that matter. she
              remembers the people in your life, notices your patterns, and
              meets you where you are.
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

          <div className="flex justify-center">
            <KaiScreenRecording />
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="mx-auto max-w-6xl px-6 pb-16 pt-8">
        <div className="flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <div className="flex items-center gap-2.5">
            <FlipPhoneIcon size={22} />
            <div className="flex flex-col leading-none">
              <span className="font-brand text-base lowercase text-white/85">
                heartlines
              </span>
              <span className="font-glacial mt-0.5 text-[10px] font-semibold tracking-wide text-white/50">
                powered by laurie ai
              </span>
            </div>
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
