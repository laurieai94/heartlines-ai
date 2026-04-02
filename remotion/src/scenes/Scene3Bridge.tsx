import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });

const BURGUNDY = "#33000D";
const CREAM = "#FAF5F5";
const CORAL = "#E8735A";
const GOLD = "#D4A574";

export const Scene3Bridge = () => {
  const frame = useCurrentFrame();

  const words = "heartlines steps into the beat between your overthinking and your actual words".split(" ");

  return (
    <AbsoluteFill style={{ backgroundColor: BURGUNDY, fontFamily, justifyContent: "center", padding: "0 80px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 12px" }}>
        {words.map((word, i) => {
          const delay = i * 4;
          const opacity = interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateRight: "clamp" });
          const y = interpolate(frame, [delay, delay + 12], [20, 0], { extrapolateRight: "clamp" });
          const isAccent = ["heartlines", "beat", "overthinking", "actual"].includes(word);
          return (
            <span
              key={i}
              style={{
                fontSize: 48,
                color: isAccent ? CORAL : CREAM,
                opacity,
                transform: `translateY(${y}px)`,
                lineHeight: 1.4,
                letterSpacing: 0.5,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      <div style={{
        position: "absolute",
        bottom: 300,
        left: 80,
        right: 80,
        height: 1,
        backgroundColor: GOLD,
        opacity: interpolate(frame, [70, 90], [0, 0.5], { extrapolateRight: "clamp" }),
      }} />
    </AbsoluteFill>
  );
};
