import { Composition } from "remotion";
import { DataViz } from "./DataViz.jsx";

export const DataVizRoot = () => (
  <Composition
    id="DataViz"
    component={DataViz}
    durationInFrames={300}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{
      title: "Weekly Performance",
      data: [40, 65, 80, 55, 90],
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      barColor: "#4ecdc4",
      background: "#0f0f23",
      textColor: "#ffffff",
    }}
  />
);
