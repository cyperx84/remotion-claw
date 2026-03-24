import React from "react";
import { Composition } from "remotion";
import { Countdown } from "./Countdown.jsx";

const DEFAULT_PROPS = {
  title: "Top 5 Productivity Hacks",
  items: [
    { number: 5, title: "Time Blocking", description: "Schedule deep work sessions" },
    { number: 4, title: "Inbox Zero", description: "Process email in batches" },
    { number: 3, title: "Keyboard Shortcuts", description: "Never touch the mouse" },
    { number: 2, title: "Automate Repetition", description: "Script everything twice" },
    { number: 1, title: "Sleep Well", description: "8 hours is non-negotiable" },
  ],
  _effects: {},
  _colors: { accent: "#f59e0b", background: "#111111" },
  _transition: "fade",
};

export const CountdownRoot = () => {
  return (
    <Composition
      id="Countdown"
      component={Countdown}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={DEFAULT_PROPS}
    />
  );
};
