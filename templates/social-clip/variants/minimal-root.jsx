import { Composition } from "remotion";
import { MinimalClip } from "./MinimalClip.jsx";
export const minimalRoot = () => (
  <Composition id="MinimalClip" component={MinimalClip} durationInFrames={900} fps={30} width={1080} height={1920}
    defaultProps={{ title: "Your Title", subtitle: "Clean and modern", background: "#fafafa", accentColor: "#000000", textColor: "#111111" }}
    calculateMetadata={async ({ props }) => props.durationInFrames ? { durationInFrames: props.durationInFrames } : {}} />
);
