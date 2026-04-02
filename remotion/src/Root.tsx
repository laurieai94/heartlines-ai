import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

// 17 seconds at 30fps = 510 frames
export const RemotionRoot = () => (
  <Composition
    id="main"
    component={MainVideo}
    durationInFrames={510}
    fps={30}
    width={1080}
    height={1920}
  />
);
