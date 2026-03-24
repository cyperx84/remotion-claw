import React from "react";
import { Composition } from "remotion";
import { Tutorial } from "./Tutorial.jsx";

const DEFAULT_PROPS = {
  title: "How to Set Up a Dev Environment",
  steps: [
    { title: "Install Node.js", description: "Download from nodejs.org", code: "brew install node" },
    { title: "Create your project", description: "Initialize a new repository", code: "mkdir my-project && cd my-project\nnpm init -y" },
    { title: "Add dependencies", description: "Install the packages you need", code: "npm install express" },
    { title: "Start coding", description: "Open your editor and build!" },
  ],
  _effects: {},
  _colors: { accent: "#10b981", background: "#0d1117" },
  _transition: "fade",
};

export const TutorialRoot = () => {
  return (
    <Composition
      id="Tutorial"
      component={Tutorial}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={DEFAULT_PROPS}
    />
  );
};
