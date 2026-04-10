import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/CrimsonText";

const { fontFamily } = loadFont("normal", { weights: ["400", "600"], subsets: ["latin"] });

const BURGUNDY = "#33000D";
const GOLD = "#D4A574";

export const OutroScene = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const taglineOpacity = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BURGUNDY, fontFamily, alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity }}>
        <h1 style={{ color: "#FAF5F5", fontSize: 64, fontWeight: 600, letterSpacing: 6, margin: 0 }}>
          heartlines
        </h1>
        <div style={{ width: 80, height: 2, backgroundColor: GOLD, opacity: 0.5 }} />
        <p style={{
          color: "rgba(250,245,245,0.5)",
          fontSize: 24,
          margin: 0,
          opacity: taglineOpacity,
          letterSpacing: 2,
        }}>
          say what you actually mean
        </p>
      </div>
    </AbsoluteFill>
  );
};
