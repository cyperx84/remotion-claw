import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

/**
 * Word-by-word kinetic text reveal.
 * Each word animates in independently with spring physics.
 */
export const KineticText = ({
  text = "",
  style = {},
  staggerFrames = 4,
  startFrame = 0,
  direction = "up", // "up" | "down" | "left" | "right" | "scale"
  fontFamily = "Inter, system-ui, sans-serif",
  fontSize = 72,
  fontWeight = 800,
  color = "#ffffff",
  lineHeight = 1.1,
  textAlign = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(/\s+/).filter(Boolean);

  const getTransform = (progress, dir) => {
    const inv = 1 - progress;
    switch (dir) {
      case "up": return `translateY(${inv * 60}px)`;
      case "down": return `translateY(${-inv * 60}px)`;
      case "left": return `translateX(${inv * 80}px)`;
      case "right": return `translateX(${-inv * 80}px)`;
      case "scale": return `scale(${0.3 + progress * 0.7})`;
      default: return `translateY(${inv * 60}px)`;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: textAlign === "center" ? "center" : "flex-start",
        gap: "0 16px",
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordFrame = startFrame + i * staggerFrames;
        const progress = spring({
          frame: Math.max(0, frame - wordFrame),
          fps,
          config: { damping: 14, stiffness: 120 },
        });
        const opacity = interpolate(
          frame - wordFrame,
          [0, 8],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily,
              fontSize,
              fontWeight,
              color,
              lineHeight,
              transform: getTransform(progress, direction),
              opacity,
              whiteSpace: "pre",
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
