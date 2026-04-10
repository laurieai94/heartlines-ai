import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Shrikhand";
import { loadFont as loadCrimson } from "@remotion/google-fonts/CrimsonText";

const { fontFamily: brandFont } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadCrimson("normal", { weights: ["400"], subsets: ["latin"] });

const BURGUNDY = "#33000D";

export const IntroScene = () => {
  const frame = useCurrentFrame();

  const wordmarkOpacity = interpolate(frame, [10, 35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wordmarkY = interpolate(frame, [10, 35], [25, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BURGUNDY, alignItems: "center", justifyContent: "center" }}>
      {/* Decorative glow */}
      <div style={{
        position: "absolute",
        width: 400,
        height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,115,90,0.15) 0%, transparent 70%)",
        filter: "blur(60px)",
      }} />

      <div style={{
        opacity: wordmarkOpacity,
        transform: `translateY(${wordmarkY}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}>
        {/* Gradient text effect matching site */}
        <h1 style={{
          fontFamily: brandFont,
          fontSize: 80,
          fontWeight: 400,
          letterSpacing: 2,
          margin: 0,
          background: "linear-gradient(135deg, #F9D4E0 0%, #F0B88A 50%, #F9D4E0 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          heartlines
        </h1>
        <p style={{
          fontFamily: bodyFont,
          fontSize: 18,
          color: "rgba(250,245,245,0.45)",
          margin: 0,
          opacity: taglineOpacity,
          letterSpacing: 3,
          textTransform: "lowercase",
        }}>
          powered by laurie ai
        </p>
      </div>
    </AbsoluteFill>
  );
};
