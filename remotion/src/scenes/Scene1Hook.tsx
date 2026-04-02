import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/InstrumentSans";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });

const BURGUNDY = "#33000D";
const TEXT_DARK = "#281419";

export const Scene1Hook = () => {
  const frame = useCurrentFrame();

  const line1Opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const line2Opacity = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });
  const line1Y = interpolate(frame, [0, 20], [30, 0], { extrapolateRight: "clamp" });
  const line2Y = interpolate(frame, [15, 35], [30, 0], { extrapolateRight: "clamp" });

  // Cursor blink
  const cursorOpacity = Math.sin(frame * 0.15) > 0 ? 1 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: "#F5F0EB", fontFamily, justifyContent: "center", padding: "0 80px" }}>
      <div style={{ opacity: line1Opacity, transform: `translateY(${line1Y}px)` }}>
        <p style={{ fontSize: 52, color: TEXT_DARK, margin: 0, letterSpacing: 1, lineHeight: 1.3 }}>
          it's 1:47am.
        </p>
      </div>
      <div style={{ opacity: line2Opacity, transform: `translateY(${line2Y}px)`, marginTop: 20 }}>
        <p style={{ fontSize: 52, color: TEXT_DARK, margin: 0, letterSpacing: 1, lineHeight: 1.3 }}>
          you're staring at a text.
          <span style={{ opacity: cursorOpacity, color: "#E8735A", marginLeft: 4 }}>|</span>
        </p>
      </div>
    </AbsoluteFill>
  );
};
