import { AbsoluteFill, Series } from "remotion";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Phone } from "./scenes/Scene2Phone";
import { Scene3Bridge } from "./scenes/Scene3Bridge";
import { Scene4Lines } from "./scenes/Scene4Lines";
import { Scene5CTA } from "./scenes/Scene5CTA";

const BURGUNDY = "#33000D";

export const MainVideo = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BURGUNDY }}>
      <Series>
        <Series.Sequence durationInFrames={90}><Scene1Hook /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><Scene2Phone /></Series.Sequence>
        <Series.Sequence durationInFrames={120}><Scene3Bridge /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Scene4Lines /></Series.Sequence>
        <Series.Sequence durationInFrames={90}><Scene5CTA /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
