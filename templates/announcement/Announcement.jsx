import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";

export const Announcement = ({
  title = "Big News!",
  body = "We just shipped something amazing.",
  accent = "#e94560",
  background = "#16213e",
  textColor = "#ffffff",
  author = "",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Background pulse
  const pulse = interpolate(
    Math.sin(frame * 0.05),
    [-1, 1],
    [0.95, 1.05]
  );

  // Title entrance
  const titleProgress = spring({ frame, fps, config: { damping: 14 } });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Body entrance
  const bodyOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const bodyY = interpolate(frame, [20, 40], [40, 0], { extrapolateRight: "clamp" });

  // Accent line
  const lineWidth = interpolate(frame, [5, 35], [0, 120], { extrapolateRight: "clamp" });

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
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `${accent}15`,
          transform: `scale(${pulse})`,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 80px",
          zIndex: 1,
          maxWidth: 900,
        }}
      >
        {/* Accent line */}
        <div
          style={{
            width: lineWidth,
            height: 4,
            backgroundColor: accent,
            marginBottom: 40,
            borderRadius: 2,
          }}
        />

        {/* Title */}
        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: textColor,
            textAlign: "center",
            lineHeight: 1.15,
            margin: 0,
            transform: `scale(${titleProgress})`,
            opacity: titleOpacity,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {title}
        </h1>

        {/* Body */}
        <p
          style={{
            fontSize: 32,
            color: `${textColor}cc`,
            textAlign: "center",
            marginTop: 30,
            lineHeight: 1.5,
            transform: `translateY(${bodyY}px)`,
            opacity: bodyOpacity,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 400,
          }}
        >
          {body}
        </p>

        {/* Author attribution */}
        {author && (
          <p
            style={{
              fontSize: 22,
              color: accent,
              marginTop: 40,
              opacity: bodyOpacity,
              fontFamily: "Inter, system-ui, sans-serif",
              fontWeight: 500,
            }}
          >
            — {author}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
