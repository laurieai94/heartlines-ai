import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/CrimsonText";

const { fontFamily } = loadFont("normal", { weights: ["400", "600"], subsets: ["latin"] });

const BURGUNDY = "#33000D";
const GOLD = "#D4A574";

export const IntroScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordmarkOpacity = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wordmarkY = interpolate(frame, [10, 40], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const lineWidth = interpolate(frame, [25, 50], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BURGUNDY, fontFamily, alignItems: "center", justifyContent: "center" }}>
      <div style={{
        opacity: wordmarkOpacity,
        transform: `translateY(${wordmarkY}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}>
        <h1 style={{
          color: "#FAF5F5",
          fontSize: 72,
          fontWeight: 600,
          letterSpacing: 6,
          margin: 0,
        }}>
          heartlines
        </h1>
        <div style={{
          width: lineWidth,
          height: 2,
          backgroundColor: GOLD,
          opacity: 0.6,
        }} />
      </div>
    </AbsoluteFill>
  );
};
