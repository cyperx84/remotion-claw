import { Composition } from "remotion";
import { SocialClip } from "./SocialClip.jsx";

export const SocialClipRoot = () => (
  <Composition
    id="SocialClip"
    component={SocialClip}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      title: "Your Title Here",
      subtitle: "Add your subtitle",
      background: "#1a1a2e",
      accentColor: "#e94560",
      textColor: "#ffffff",
    }}
  />
);
