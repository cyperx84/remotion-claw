import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { AudioOverlay } from "../shared/AudioOverlay.jsx";

export const DataViz = ({
  title = "Data Overview",
  data = [40, 65, 80, 55, 90],
  labels = ["Mon", "Tue", "Wed", "Thu", "Fri"],
  barColor = "#4ecdc4",
  background = "#0f0f23",
  textColor = "#ffffff",
  subtitle = "",
  audioSrc = null,
  audioVolume = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const maxVal = Math.max(...data);
  const maxBarHeight = 400;

  // Title animation
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [-30, 0], { extrapolateRight: "clamp" });

  // Fade out
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background,
        justifyContent: "center",
        alignItems: "center",
        opacity: fadeOut,
        padding: 80,
      }}
    >
      <AudioOverlay audioSrc={audioSrc} volume={audioVolume} />
      {/* Title */}
      <h1
        style={{
          position: "absolute",
          top: 80,
          fontSize: 56,
          fontWeight: 700,
          color: textColor,
          fontFamily: "Inter, system-ui, sans-serif",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            position: "absolute",
            top: 155,
            fontSize: 28,
            color: `${textColor}99`,
            fontFamily: "Inter, system-ui, sans-serif",
            opacity: titleOpacity,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Bar chart */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 40,
          marginTop: 60,
        }}
      >
        {data.map((val, i) => {
          const barHeight = (val / maxVal) * maxBarHeight;
          const animatedHeight = spring({
            frame: frame - 30 - i * 8,
            fps,
            config: { damping: 12, stiffness: 80 },
          }) * barHeight;

          const labelOpacity = interpolate(
            frame,
            [40 + i * 8, 55 + i * 8],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Value label */}
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: barColor,
                  fontFamily: "Inter, system-ui, sans-serif",
                  opacity: labelOpacity,
                }}
              >
                {val}
              </span>

              {/* Bar */}
              <div
                style={{
                  width: 80,
                  height: animatedHeight,
                  backgroundColor: barColor,
                  borderRadius: "8px 8px 0 0",
                  minHeight: 2,
                }}
              />

              {/* Label */}
              <span
                style={{
                  fontSize: 20,
                  color: `${textColor}aa`,
                  fontFamily: "Inter, system-ui, sans-serif",
                  opacity: labelOpacity,
                }}
              >
                {labels[i] || ""}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
