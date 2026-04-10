import { AbsoluteFill, Series } from "remotion";
import { IntroScene } from "./scenes/IntroScene";
import { KaiDemoScene } from "./scenes/KaiDemoScene";
import { OutroScene } from "./scenes/OutroScene";

const BURGUNDY = "#33000D";

export const MainVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BURGUNDY }}>
      <Series>
        <Series.Sequence durationInFrames={60}><IntroScene /></Series.Sequence>
        <Series.Sequence durationInFrames={690}><KaiDemoScene /></Series.Sequence>
        <Series.Sequence durationInFrames={150}><OutroScene /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
