import { Composition } from "remotion";
import { ProductDemo } from "./ProductDemo.jsx";

export const ProductDemoRoot = () => (
  <Composition
    id="ProductDemo"
    component={ProductDemo}
    durationInFrames={900}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{
      title: "Product Name",
      tagline: "Built for builders.",
      features: ["Fast", "Simple", "Powerful"],
      background: "#0a0a1a",
      accentColor: "#7c3aed",
      textColor: "#ffffff",
    }}
  />
);
