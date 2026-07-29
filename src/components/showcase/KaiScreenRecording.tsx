import { useEffect, useRef, useState } from "react";

/**
 * Renders the actual /showcase/demo interface inside a phone frame via
 * iframe. This gives pixel-parity with the real app — same components,
 * same styles — while the demo route itself runs on scripted mock data
 * (no auth, no backend).
 */
export const KaiScreenRecording = () => {
  const [paused, setPaused] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Reload the demo every ~22s to loop the scripted flow cleanly.
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => {
      setReloadKey((k) => k + 1);
    }, 22000);
    return () => window.clearInterval(t);
  }, [paused]);

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
          className="relative overflow-hidden rounded-[2.25rem] h-[640px]"
          style={{ background: "hsl(345 60% 13%)" }}
        >
          {/* notch overlay */}
          <div className="absolute left-1/2 top-2 z-30 h-5 w-24 -translate-x-1/2 rounded-full bg-black pointer-events-none" />

          {/* live interface, mocked */}
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
        live interface · scripted flow · hover to pause
      </p>
    </div>
  );
};

export default KaiScreenRecording;
