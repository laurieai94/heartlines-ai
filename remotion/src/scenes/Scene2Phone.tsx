import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/InstrumentSans";

const { fontFamily } = loadFont("normal", { weights: ["400", "600"], subsets: ["latin"] });

const BURGUNDY = "#33000D";
const CORAL = "#E8735A";

export const Scene2Phone = () => {
  const frame = useCurrentFrame();

  const phoneY = interpolate(frame, [0, 30], [200, 0], { extrapolateRight: "clamp" });
  const phoneOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  // Typing animation
  const fullMsg = "i don't know how to say this without sounding needy";
  const charCount = Math.min(Math.floor(interpolate(frame, [40, 100], [0, fullMsg.length], { extrapolateRight: "clamp" })), fullMsg.length);
  const typedText = fullMsg.slice(0, charCount);
  const cursorOpacity = Math.sin(frame * 0.2) > 0 ? 1 : 0;

  // Kai response
  const kaiOpacity = interpolate(frame, [100, 115], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#F5F0EB", fontFamily, alignItems: "center", justifyContent: "center" }}>
      {/* Phone mockup */}
      <div style={{
        opacity: phoneOpacity,
        transform: `translateY(${phoneY}px)`,
        width: 720,
        height: 1280,
        backgroundColor: BURGUNDY,
        borderRadius: 40,
        padding: 30,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 40px 80px rgba(51,0,13,0.3)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 30, gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: CORAL, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: 18, fontWeight: 600 }}>k</span>
          </div>
          <span style={{ color: "#FAF5F5", fontSize: 22 }}>kai</span>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 16 }}>
          {/* User message */}
          <div style={{ alignSelf: "flex-end", maxWidth: "80%" }}>
            <div style={{ backgroundColor: "rgba(232,115,90,0.15)", borderRadius: 20, padding: "14px 20px" }}>
              <p style={{ color: "#FAF5F5", fontSize: 20, margin: 0, lineHeight: 1.4 }}>
                {typedText}
                <span style={{ opacity: cursorOpacity, color: CORAL }}>|</span>
              </p>
            </div>
          </div>

          {/* Kai response */}
          <div style={{ alignSelf: "flex-start", maxWidth: "85%", opacity: kaiOpacity }}>
            <div style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 20, padding: "14px 20px" }}>
              <p style={{ color: "#FAF5F5", fontSize: 20, margin: 0, lineHeight: 1.5 }}>
                that's not needy — that's honest. let's find the version of that sentence that feels like you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
