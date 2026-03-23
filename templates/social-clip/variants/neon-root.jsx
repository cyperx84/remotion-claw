import { Composition } from "remotion";
import { NeonClip } from "./NeonClip.jsx";
export const neonRoot = () => (
  <Composition id="NeonClip" component={NeonClip} durationInFrames={900} fps={30} width={1080} height={1920}
    defaultProps={{ title: "Your Title", subtitle: "Neon dreams", background: "#0a0015", accentColor: "#ff6ec7", secondaryColor: "#7b68ee", textColor: "#ffffff" }}
    calculateMetadata={async ({ props }) => props.durationInFrames ? { durationInFrames: props.durationInFrames } : {}} />
);
