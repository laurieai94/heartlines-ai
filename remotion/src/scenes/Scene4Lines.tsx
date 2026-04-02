import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/InstrumentSans";

const { fontFamily } = loadFont("normal", { weights: ["400"], subsets: ["latin"] });

const TEXT_DARK = "#281419";
const CORAL = "#E8735A";

const lines = [
  "advice that knows the lore.",
  "turn 'did i overreact?' into 'here's my next move.'",
  "figure out love while you're still feeling it.",
];

export const Scene4Lines = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: "#F5F0EB", fontFamily, justifyContent: "center", padding: "0 80px" }}>
      {lines.map((line, i) => {
        const enterStart = i * 22;
        const opacity = interpolate(frame, [enterStart, enterStart + 15], [0, 1], { extrapolateRight: "clamp" });
        const x = interpolate(frame, [enterStart, enterStart + 15], [-40, 0], { extrapolateRight: "clamp" });

        return (
          <div key={i} style={{ opacity, transform: `translateX(${x}px)`, marginBottom: 40 }}>
            <p style={{ fontSize: 38, color: TEXT_DARK, margin: 0, lineHeight: 1.4, letterSpacing: 0.5 }}>
              {line}
            </p>
            {i < lines.length - 1 && (
              <div style={{ width: 40, height: 1, backgroundColor: CORAL, marginTop: 20, opacity: 0.6 }} />
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
