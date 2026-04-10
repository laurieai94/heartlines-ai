import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/CrimsonText";

const { fontFamily } = loadFont("normal", { weights: ["400", "600"], subsets: ["latin"] });

const BURGUNDY = "#33000D";
const CORAL = "#E8735A";

interface Message {
  sender: "maya" | "kai";
  text: string;
  appearFrame: number;
}

const MESSAGES: Message[] = [
  { sender: "maya", text: "he hasn't texted me all day. we usually talk by like 11 and it's almost 6 now", appearFrame: 15 },
  { sender: "kai", text: "you're going straight to \"something's wrong.\" what was the first thought that hit you?", appearFrame: 70 },
  { sender: "maya", text: "that he's not into me anymore. or i said something weird last night", appearFrame: 140 },
  { sender: "kai", text: "last time this happened, your mind went here too. quick reality check, how did last night actually feel?", appearFrame: 195 },
  { sender: "maya", text: "honestly really good. we were laughing the whole time. he kissed me goodnight", appearFrame: 275 },
  { sender: "kai", text: "so the pattern is your brain filling the gap fast, even when the connection was solid", appearFrame: 335 },
  { sender: "maya", text: "yeah that sounds right", appearFrame: 400 },
  { sender: "kai", text: "you don't have to figure it all out right now. it's okay to just set a steady tone — \"hey, hope your day's not too crazy 😊\"", appearFrame: 445 },
  { sender: "maya", text: "i just don't want to seem desperate", appearFrame: 530 },
  { sender: "kai", text: "that makes sense. this isn't chasing — it's you showing up calm and grounded instead of guessing", appearFrame: 575 },
];

const TypingIndicator = ({ frame, startFrame }: { frame: number; startFrame: number }) => {
  const localFrame = frame - startFrame;
  if (localFrame < 0 || localFrame > 25) return null;
  const opacity = interpolate(localFrame, [0, 5, 20, 25], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ alignSelf: "flex-start", maxWidth: "85%", opacity }}>
      <div style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 20, padding: "14px 24px", display: "flex", gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(250,245,245,0.4)",
              opacity: interpolate(Math.sin((localFrame + i * 4) * 0.3), [-1, 1], [0.3, 1]),
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ChatBubble = ({ message, frame }: { message: Message; frame: number }) => {
  const localFrame = frame - message.appearFrame;
  if (localFrame < 0) return null;

  const opacity = interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const slideY = interpolate(localFrame, [0, 12], [20, 0], { extrapolateRight: "clamp" });

  const isMaya = message.sender === "maya";

  return (
    <div style={{
      alignSelf: isMaya ? "flex-end" : "flex-start",
      maxWidth: "82%",
      opacity,
      transform: `translateY(${slideY}px)`,
    }}>
      <div style={{
        backgroundColor: isMaya ? "rgba(232,115,90,0.18)" : "rgba(255,255,255,0.06)",
        borderRadius: 20,
        padding: "14px 20px",
      }}>
        <p style={{ color: "#FAF5F5", fontSize: 19, margin: 0, lineHeight: 1.5 }}>
          {message.text}
        </p>
      </div>
    </div>
  );
};

export const KaiDemoScene = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone slide up
  const phoneY = interpolate(frame, [0, 30], [300, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phoneOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Auto-scroll: shift messages up as conversation grows
  const lastVisibleMsg = MESSAGES.filter(m => frame >= m.appearFrame).length;
  const scrollTarget = lastVisibleMsg > 4 ? (lastVisibleMsg - 4) * 80 : 0;
  const scrollY = interpolate(frame, [0, 690], [0, scrollTarget], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BURGUNDY, fontFamily, alignItems: "center", justifyContent: "center" }}>
      <div style={{
        opacity: phoneOpacity,
        transform: `translateY(${phoneY}px)`,
        width: 680,
        height: 1200,
        backgroundColor: "#1A0007",
        borderRadius: 44,
        padding: "24px 28px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 40px 100px rgba(51,0,13,0.6)",
        border: "1px solid rgba(212,165,116,0.12)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 20, borderBottom: "1px solid rgba(250,245,245,0.06)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: CORAL, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: 18, fontWeight: 600 }}>k</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ color: "#FAF5F5", fontSize: 20, fontWeight: 600 }}>kai</span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: "#4ADE80" }} />
              <span style={{ color: "rgba(250,245,245,0.4)", fontSize: 13 }}>online</span>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          gap: 12,
          marginTop: 16,
          overflow: "hidden",
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            transform: `translateY(-${scrollY}px)`,
          }}>
            {MESSAGES.map((msg, i) => {
              // Show typing indicator before kai messages
              const typingStart = msg.sender === "kai" ? msg.appearFrame - 25 : -999;
              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {msg.sender === "kai" && <TypingIndicator frame={frame} startFrame={typingStart} />}
                  <ChatBubble message={msg} frame={frame} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
