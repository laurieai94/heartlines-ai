import React from "react";

type Props = {
  size?: number;           // pixel size of the square icon
  className?: string;      // extra utility classes if you want
};

/**
 * HeartAppIcon — rounded gradient square with a soft inner glow and a white heart outline
 * Drop in anywhere in a Tailwind project.
 */
export default function HeartAppIcon({ size = 256, className = "" }: Props) {
  const px = `${size}px`;
  return (
    <div
      className={`relative isolate rounded-[28%] ${className}`}
      style={{
        width: px,
        height: px,
        // Base gradient (pink → burgundy)
        background:
          "radial-gradient(120% 120% at 50% 40%, #FFB6C1 0%, #FF69B4 25%, #DC143C 60%, #8B0000 100%)",
        // Soft outer shadow + subtle inner depth
        boxShadow:
          "0 18px 40px rgba(139, 0, 0, .35), inset 0 2px 0 rgba(255,255,255,.35), inset 0 -10px 30px rgba(0,0,0,.12)",
      }}
    >
      {/* top-left glassy highlight */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[28%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.35) 0%, rgba(255,255,255,.10) 30%, rgba(255,255,255,0) 60%)",
          WebkitMask:
            "radial-gradient(90% 65% at 20% 10%, #000 0% , transparent 60%)",
          mask:
            "radial-gradient(90% 65% at 20% 10%, #000 0% , transparent 60%)",
        }}
      />
      {/* subtle inner glow */}
      <span
        className="pointer-events-none absolute inset-0 rounded-[28%]"
        style={{
          boxShadow: "inset 0 0 80px rgba(255, 105, 180, .35)",
        }}
      />

      {/* Heart outline */}
      <svg
        viewBox="0 0 200 200"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: size * 0.56, height: size * 0.56 }}
        fill="none"
        stroke="white"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* clean geometric heart path */}
        <path d="M100 162 C 92 154, 60 129, 44 110 C 22 83, 26 48, 54 36 C 71 28, 89 33, 100 47 C 111 33, 129 28, 146 36 C 174 48, 178 83, 156 110 C 140 129, 108 154, 100 162 Z" />
      </svg>
    </div>
  );
}