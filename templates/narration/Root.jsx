import { Composition } from "remotion";
import { Narration } from "./Narration.jsx";

export const NarrationRoot = () => (
  <Composition
    id="Narration"
    component={Narration}
    durationInFrames={900}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{
      scenes: [
        {
          type: "title",
          text: "Remotion Claw",
          subtitle: "Text in, video out.",
          durationSec: 5,
        },
        {
          type: "terminal",
          command: 'rclaw create "product overview" --tts "Welcome to our product"',
          output: "✅ Rendered out/video.mp4 (30s, 1920x1080)",
          durationSec: 7,
        },
        {
          type: "feature-grid",
          title: "Templates",
          items: [
            { icon: "📱", label: "Social Clip", desc: "Vertical short-form" },
            { icon: "📊", label: "Data Viz", desc: "Animated charts" },
            { icon: "📢", label: "Announcement", desc: "Text cards" },
            { icon: "🎬", label: "Product Demo", desc: "Walkthroughs" },
          ],
          durationSec: 8,
        },
      ],
      background: "#0a0a1a",
      accentColor: "#7c3aed",
      textColor: "#ffffff",
      audioSrc: null,
      audioVolume: 1,
    }}
    calculateMetadata={async ({ props }) => {
      // Auto-calculate duration from scene durations
      if (props.scenes && props.scenes.length > 0) {
        const totalSec = props.scenes.reduce((sum, s) => sum + (s.durationSec || 5), 0);
        return { durationInFrames: Math.ceil(totalSec * 30) };
      }
      if (props.durationInFrames) {
        return { durationInFrames: props.durationInFrames };
      }
      return {};
    }}
  />
);
