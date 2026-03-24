import React from "react";
import { Composition } from "remotion";
import { Comparison } from "./Comparison.jsx";

const DEFAULT_PROPS = {
  title: "Plan A vs Plan B",
  labelLeft: "Before",
  labelRight: "After",
  left: {
    title: "Manual Process",
    description: "Slow and error-prone",
    items: ["5 hours per task", "30% error rate", "Team of 4"],
  },
  right: {
    title: "Automated Pipeline",
    description: "Fast and reliable",
    items: ["15 minutes per task", "0.1% error rate", "Team of 1"],
  },
  _effects: {},
  _colors: { accent: "#22d3ee", secondary: "#a78bfa", background: "#0a0a0a" },
  _transition: "fade",
};

export const ComparisonRoot = () => {
  return (
    <Composition
      id="Comparison"
      component={Comparison}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={DEFAULT_PROPS}
    />
  );
};
