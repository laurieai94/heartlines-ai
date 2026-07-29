import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import KaiScreenRecording from "@/components/showcase/KaiScreenRecording";
import FlipPhoneIcon from "@/components/icons/FlipPhoneIcon";

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

      {/* hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-4 md:pt-10">
        <div className="grid gap-16 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-10">
          <div className="px-1 sm:px-0 order-2 md:order-1">
            <h1
              className="font-playfair font-normal leading-[1.02] tracking-tight"
              style={{ fontSize: "clamp(2.25rem, 9vw, 4.75rem)" }}
            >
              <span
                className="block whitespace-nowrap bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(105deg, hsl(30 40% 82%) 0%, hsl(350 70% 78%) 55%, hsl(24 90% 68%) 100%)",
                }}
              >
                relationships
              </span>
              <span
                className="block whitespace-nowrap bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(105deg, hsl(350 75% 80%) 0%, hsl(24 90% 65%) 100%)",
                }}
              >
                aren't rom-coms.
              </span>
            </h1>

            <p className="mt-8 max-w-lg text-[18px] lowercase leading-relaxed text-white/85 sm:text-[20px]">
              <span className="font-brand italic text-white">heartlines</span>{" "}
              helps you connect.
            </p>

            <div className="mt-10">
              <a
                href="https://heartlines.ai"
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[hsl(350_100%_70%)] to-[hsl(24_95%_53%)] px-7 py-3.5 text-[15px] lowercase font-medium text-white shadow-[0_0_40px_hsl(24_95%_55%/0.55)] transition hover:shadow-[0_0_60px_hsl(24_95%_55%/0.75)]"
              >
                let's get real
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          <div className="order-1 flex justify-center md:order-2">
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
