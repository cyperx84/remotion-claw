import { Composition } from "remotion";
import { TerminalClip } from "./TerminalClip.jsx";
export const terminalRoot = () => (
  <Composition id="TerminalClip" component={TerminalClip} durationInFrames={900} fps={30} width={1080} height={1920}
    defaultProps={{ title: "Your Title", subtitle: "System online", background: "#0a0a0a", accentColor: "#33ff33", textColor: "#33ff33", prompt: "root@claw:~$" }}
    calculateMetadata={async ({ props }) => props.durationInFrames ? { durationInFrames: props.durationInFrames } : {}} />
);
