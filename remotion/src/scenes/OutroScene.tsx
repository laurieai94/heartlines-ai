import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Shrikhand";
import { loadFont as loadCrimson } from "@remotion/google-fonts/CrimsonText";

const { fontFamily: brandFont } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });
const { fontFamily: bodyFont } = loadCrimson("normal", { weights: ["400"], subsets: ["latin"] });

const BURGUNDY = "#33000D";

export const OutroScene = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [15, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BURGUNDY, alignItems: "center", justifyContent: "center" }}>
      {/* Decorative glow */}
      <div style={{
        position: "absolute",
        width: 500,
        height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,115,90,0.12) 0%, transparent 70%)",
        filter: "blur(80px)",
      }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity }}>
        <h1 style={{
          fontFamily: brandFont,
          fontSize: 72,
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
          fontSize: 16,
          color: "rgba(250,245,245,0.4)",
          margin: 0,
          opacity: taglineOpacity,
          letterSpacing: 3,
        }}>
          powered by laurie ai
        </p>
        <div style={{ width: 60, height: 1, backgroundColor: "rgba(212,165,116,0.3)", marginTop: 8 }} />
        <p style={{
          fontFamily: bodyFont,
          fontSize: 26,
          color: "rgba(250,245,245,0.55)",
          margin: 0,
          opacity: subtitleOpacity,
          letterSpacing: 1,
          fontStyle: "italic",
        }}>
          say what you actually mean
        </p>
      </div>
    </AbsoluteFill>
  );
};
