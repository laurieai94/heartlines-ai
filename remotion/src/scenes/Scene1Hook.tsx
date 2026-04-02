import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/PlayfairDisplay";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });

const BURGUNDY = "#33000D";
const CREAM = "#FAF5F5";
const CORAL = "#E8735A";

export const Scene1Hook = () => {
  const frame = useCurrentFrame();

  const line1Opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const line2Opacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });
  const line1Y = interpolate(frame, [0, 20], [30, 0], { extrapolateRight: "clamp" });
  const line2Y = interpolate(frame, [15, 35], [30, 0], { extrapolateRight: "clamp" });

  const cursorOpacity = Math.sin(frame * 0.15) > 0 ? 1 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: BURGUNDY, fontFamily, justifyContent: "center", padding: "0 80px" }}>
      <div style={{ opacity: line1Opacity, transform: `translateY(${line1Y}px)` }}>
        <p style={{ fontSize: 52, color: CREAM, margin: 0, letterSpacing: 1, lineHeight: 1.3 }}>
          it's 1:47am.
        </p>
      </div>
      <div style={{ opacity: line2Opacity, transform: `translateY(${line2Y}px)`, marginTop: 20 }}>
        <p style={{ fontSize: 52, color: CREAM, margin: 0, letterSpacing: 1, lineHeight: 1.3 }}>
          you're staring at a text.
          <span style={{ opacity: cursorOpacity, color: CORAL, marginLeft: 4 }}>|</span>
        </p>
      </div>
    </AbsoluteFill>
  );
};
