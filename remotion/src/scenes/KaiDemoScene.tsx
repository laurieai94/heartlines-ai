import { AbsoluteFill, useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/CrimsonText";

const { fontFamily } = loadFont("normal", { weights: ["400", "600"], subsets: ["latin"] });

const BURGUNDY = "#33000D";
const BURGUNDY_800 = "#4A0A1A";
const BURGUNDY_900 = "#2D0008";
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
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", opacity }}>
      {/* Kai avatar */}
      <div style={{
        width: 24, height: 24, borderRadius: 12, flexShrink: 0,
        background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ color: "white", fontSize: 10 }}>♥</span>
      </div>
      <div style={{
        backgroundColor: "rgba(139,92,246,0.9)",
        borderRadius: 16,
        padding: "12px 18px",
        border: "1px solid rgba(139,92,246,0.3)",
        display: "flex",
        gap: 5,
      }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: "rgba(255,255,255,0.6)",
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
  const slideY = interpolate(localFrame, [0, 12], [15, 0], { extrapolateRight: "clamp" });

  const isUser = message.sender === "maya";

  // Kai bubble: bg-white/10, border-2 border-white/30
  // Maya bubble: coral-pink gradient, border-2 border-coral-400/40
  const bubbleStyle = isUser
    ? {
        background: "linear-gradient(135deg, rgba(232,115,90,0.2), rgba(236,72,153,0.3))",
        border: "2px solid rgba(232,115,90,0.4)",
      }
    : {
        backgroundColor: "rgba(255,255,255,0.1)",
        border: "2px solid rgba(255,255,255,0.3)",
      };

  return (
    <div style={{
      display: "flex",
      gap: 8,
      alignItems: "flex-end",
      justifyContent: isUser ? "flex-end" : "flex-start",
      opacity,
      transform: `translateY(${slideY}px)`,
    }}>
      {/* Kai avatar (left) */}
      {!isUser && (
        <div style={{
          width: 24, height: 24, borderRadius: 12, flexShrink: 0,
          background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "white", fontSize: 10 }}>♥</span>
        </div>
      )}
      <div style={{
        maxWidth: "82%",
        borderRadius: 16,
        padding: "10px 16px",
        ...bubbleStyle,
      }}>
        <p style={{ color: "#FAF5F5", fontSize: 16, margin: 0, lineHeight: 1.5, fontFamily }}>
          {message.text}
        </p>
      </div>
      {/* Maya avatar (right) */}
      {isUser && (
        <div style={{
          width: 24, height: 24, borderRadius: 12, flexShrink: 0,
          background: "linear-gradient(135deg, #E8735A, #EC4899)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "white", fontSize: 11, fontWeight: 600, fontFamily }}>M</span>
        </div>
      )}
    </div>
  );
};

export const KaiDemoScene = () => {
  const frame = useCurrentFrame();

  // Phone slide up
  const phoneY = interpolate(frame, [0, 30], [400, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const phoneOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Auto-scroll
  const lastVisibleMsg = MESSAGES.filter(m => frame >= m.appearFrame).length;
  const scrollTarget = lastVisibleMsg > 3 ? (lastVisibleMsg - 3) * 90 : 0;
  const scrollY = interpolate(frame, [0, 690], [0, scrollTarget], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: BURGUNDY, fontFamily, alignItems: "center", justifyContent: "center" }}>
      <div style={{
        opacity: phoneOpacity,
        transform: `translateY(${phoneY}px)`,
        position: "relative",
        width: 540,
        height: 1080,
      }}>
        {/* Outer phone frame — matches site: bg-gray-900, rounded-[3rem], border-8 border-white/15 */}
        <div style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#111827",
          borderRadius: 48,
          border: "8px solid rgba(255,255,255,0.15)",
          boxShadow: "0 25px 80px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.08)",
          overflow: "hidden",
          position: "relative",
        }}>
          {/* Inner gradient bg — from-burgundy-900 via-burgundy-800 to-coral-900 */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${BURGUNDY_900} 0%, ${BURGUNDY_800} 50%, rgba(180,60,40,0.6) 100%)`,
          }} />

          {/* Decorative glow effects */}
          <div style={{
            position: "absolute", top: 80, left: 20,
            width: 200, height: 200, borderRadius: "50%",
            backgroundColor: "rgba(107,45,61,0.2)",
            filter: "blur(60px)",
          }} />
          <div style={{
            position: "absolute", bottom: 80, right: 20,
            width: 160, height: 160, borderRadius: "50%",
            backgroundColor: "rgba(232,115,90,0.2)",
            filter: "blur(50px)",
          }} />

          {/* Phone notch bar */}
          <div style={{
            position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
            width: 100, height: 6, backgroundColor: "#4B5563", borderRadius: 3, zIndex: 20,
          }} />
          <div style={{
            position: "absolute", top: 20, right: 24,
            width: 8, height: 8, backgroundColor: "#374151", borderRadius: 4, zIndex: 20,
          }} />

          {/* Chat Header — matches site */}
          <div style={{
            position: "relative", zIndex: 10,
            padding: "32px 20px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            backgroundColor: "rgba(74,10,26,0.35)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Avatar with green dot */}
                <div style={{ position: "relative" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 20,
                    background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: "white", fontSize: 18 }}>♥</span>
                  </div>
                  <div style={{
                    position: "absolute", bottom: -2, right: -2,
                    width: 12, height: 12, backgroundColor: "#22C55E",
                    border: "2px solid white", borderRadius: 6,
                  }} />
                </div>
                <div>
                  <div style={{ color: "white", fontSize: 16, fontWeight: 600 }}>kai</div>
                  <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>communication</div>
                </div>
              </div>
              {/* Info icon */}
              <div style={{ width: 20, height: 20, color: "rgba(255,255,255,0.5)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                </svg>
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div style={{
            position: "relative", zIndex: 10,
            padding: "16px 16px 0",
            height: 820,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              transform: `translateY(-${scrollY}px)`,
            }}>
              {MESSAGES.map((msg, i) => {
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

          {/* Input bar — matches site */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "16px 16px 24px",
            background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent)",
            zIndex: 10,
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{
                flex: 1,
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: 999,
                padding: "10px 16px",
                border: "1px solid rgba(255,255,255,0.2)",
              }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily }}>chat with kai</span>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: 20,
                background: "linear-gradient(to right, #E8735A, #EC4899)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(232,115,90,0.3)",
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
