import { useEffect, useRef, useState } from "react";

/**
 * Renders the actual /showcase/demo interface inside a phone frame via
 * iframe. Constrained so it always has breathing room on every screen size.
 */
export const KaiScreenRecording = () => {
  const [paused, setPaused] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => {
      setReloadKey((k) => k + 1);
    }, 42000);
    return () => window.clearInterval(t);
  }, [paused]);

  return (
    <div
      className="w-full flex justify-center items-start px-6 sm:px-8 md:px-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative mx-auto w-full max-w-[240px] sm:max-w-[260px] md:max-w-[280px]"
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
        <div className="relative rounded-[2.5rem] bg-neutral-900 p-[3%] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
          <div
            className="relative overflow-hidden rounded-[2rem] w-full"
            style={{ background: "hsl(345 60% 13%)", aspectRatio: "9 / 19.5" }}
          >
            <div className="absolute left-1/2 top-2 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-black pointer-events-none" />

            <iframe
              key={reloadKey}
              ref={iframeRef}
              src="/showcase/demo"
              title="heartlines interface demo"
              loading="eager"
              className="absolute inset-0 h-full w-full border-0 bg-transparent"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-white/40 lowercase tracking-wide">
          live interface, hover to pause
        </p>
      </div>
    </div>
  );
};

export default KaiScreenRecording;
