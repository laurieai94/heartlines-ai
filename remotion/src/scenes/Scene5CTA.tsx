import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Shrikhand";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });

const BURGUNDY = "#33000D";
const BURGUNDY_DEEP = "#1A0007";
const CORAL = "#E8735A";
const CREAM = "#FAF5F5";
const GOLD = "#D4A574";

export const Scene5CTA = () => {
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const wordmarkOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  const wordmarkY = interpolate(frame, [10, 30], [30, 0], { extrapolateRight: "clamp" });
  const lineWidth = interpolate(frame, [25, 50], [0, 600], { extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [55, 70], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BURGUNDY_DEEP, fontFamily, alignItems: "center", justifyContent: "center", opacity: bgOpacity }}>
      <div style={{ opacity: wordmarkOpacity, transform: `translateY(${wordmarkY}px)` }}>
        <p style={{ fontSize: 64, color: CREAM, margin: 0, letterSpacing: 2 }}>heartlines</p>
      </div>

      <div style={{ width: lineWidth, height: 1, backgroundColor: GOLD, marginTop: 24, marginBottom: 24 }} />

      <div style={{ opacity: taglineOpacity }}>
        <p style={{ fontSize: 28, color: "rgba(250,245,245,0.8)", margin: 0, letterSpacing: 1, fontFamily: "sans-serif" }}>
          stronger relationships start here
        </p>
      </div>

      <div style={{ opacity: subOpacity, position: "absolute", bottom: 120 }}>
        <p style={{ fontSize: 18, color: "rgba(212,165,116,0.7)", margin: 0, letterSpacing: 1, fontFamily: "sans-serif" }}>
          powered by laurie ai
        </p>
      </div>
    </AbsoluteFill>
  );
};
