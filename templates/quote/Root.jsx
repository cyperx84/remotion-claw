import React from "react";
import { Composition } from "remotion";
import { Quote } from "./Quote.jsx";

const DEFAULT_PROPS = {
  quote: "The best way to predict the future is to invent it.",
  author: "Alan Kay",
  authorTitle: "Computer Scientist",
  _effects: {},
  _colors: { accent: "#6366f1", background: "#0f0f0f" },
  _transition: "fade",
};

export const QuoteRoot = () => {
  return (
    <Composition
      id="Quote"
      component={Quote}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={DEFAULT_PROPS}
    />
  );
};
