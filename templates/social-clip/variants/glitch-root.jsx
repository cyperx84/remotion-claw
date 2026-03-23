import { Composition } from "remotion";
import { GlitchClip } from "./GlitchClip.jsx";
export const glitchRoot = () => (
  <Composition id="GlitchClip" component={GlitchClip} durationInFrames={900} fps={30} width={1080} height={1920}
    defaultProps={{ title: "Your Title", subtitle: "Glitch mode activated", background: "#050505", accentColor: "#00FFFF", secondaryColor: "#FF003C", textColor: "#ffffff" }}
    calculateMetadata={async ({ props }) => props.durationInFrames ? { durationInFrames: props.durationInFrames } : {}} />
);
