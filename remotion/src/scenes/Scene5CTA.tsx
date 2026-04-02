import { AbsoluteFill, useCurrentFrame, interpolate, staticFile, Img } from "remotion";
import { loadFont } from "@remotion/google-fonts/Shrikhand";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });

const BURGUNDY_DEEP = "#1A0007";
const CREAM = "#FAF5F5";
const GOLD = "#D4A574";

export const Scene5CTA = () => {
  const frame = useCurrentFrame();

  const bgOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const phoneOpacity = interpolate(frame, [5, 25], [0, 1], { extrapolateRight: "clamp" });
  const phoneY = interpolate(frame, [5, 25], [40, 0], { extrapolateRight: "clamp" });
  const wordmarkOpacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });
  const wordmarkY = interpolate(frame, [15, 35], [20, 0], { extrapolateRight: "clamp" });
  const lineWidth = interpolate(frame, [30, 55], [0, 500], { extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [45, 60], [0, 1], { extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [60, 75], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BURGUNDY_DEEP, alignItems: "center", justifyContent: "center", opacity: bgOpacity }}>
      {/* Flip phone illustration */}
      <div style={{ opacity: phoneOpacity, transform: `translateY(${phoneY}px)`, marginBottom: 20 }}>
        <Img src={staticFile("heartlines-flip-phone.png")} style={{ width: 140, height: "auto" }} />
      </div>

      {/* Wordmark */}
      <div style={{ opacity: wordmarkOpacity, transform: `translateY(${wordmarkY}px)` }}>
        <p style={{ fontSize: 64, color: CREAM, margin: 0, letterSpacing: 2, fontFamily }}>heartlines</p>
      </div>

      {/* Gold accent line */}
      <div style={{ width: lineWidth, height: 1, backgroundColor: GOLD, marginTop: 24, marginBottom: 24 }} />

      {/* Tagline */}
      <div style={{ opacity: taglineOpacity }}>
        <p style={{ fontSize: 28, color: "rgba(250,245,245,0.8)", margin: 0, letterSpacing: 1, fontFamily: "sans-serif" }}>
          stronger relationships start here
        </p>
      </div>

      {/* Powered by */}
      <div style={{ opacity: subOpacity, position: "absolute", bottom: 120 }}>
        <p style={{ fontSize: 18, color: "rgba(212,165,116,0.7)", margin: 0, letterSpacing: 1, fontFamily: "sans-serif" }}>
          powered by laurie ai
        </p>
      </div>
    </AbsoluteFill>
  );
};
