import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

export const SocialClip = ({
  title = "Your Title",
  subtitle = "Your subtitle",
  background = "#1a1a2e",
  accentColor = "#e94560",
  textColor = "#ffffff",
  items = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Title animation
  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Subtitle slides in
  const subtitleY = interpolate(frame, [20, 45], [60, 0], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });

  // Accent bar animation
  const barWidth = interpolate(frame, [10, 40], [0, 200], { extrapolateRight: "clamp" });

  // Fade out near end
  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
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
      {/* Background gradient overlay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${accentColor}33 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "0 60px",
          zIndex: 1,
        }}
      >
        {/* Accent bar */}
        <div
          style={{
            width: barWidth,
            height: 4,
            backgroundColor: accentColor,
            marginBottom: 40,
            borderRadius: 2,
          }}
        />

        {/* Title */}
        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: textColor,
            textAlign: "center",
            lineHeight: 1.1,
            margin: 0,
            transform: `scale(${titleScale})`,
            opacity: titleOpacity,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 36,
            color: `${textColor}cc`,
            textAlign: "center",
            marginTop: 30,
            transform: `translateY(${subtitleY}px)`,
            opacity: subtitleOpacity,
            fontFamily: "Inter, system-ui, sans-serif",
            fontWeight: 400,
          }}
        >
          {subtitle}
        </p>

        {/* Optional items list */}
        {items.length > 0 && (
          <Sequence from={60}>
            <div style={{ marginTop: 50 }}>
              {items.map((item, i) => {
                const itemOpacity = interpolate(
                  frame - 60,
                  [i * 15, i * 15 + 15],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                return (
                  <div
                    key={i}
                    style={{
                      fontSize: 28,
                      color: textColor,
                      opacity: itemOpacity,
                      marginBottom: 16,
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    → {item}
                  </div>
                );
              })}
            </div>
          </Sequence>
        )}
      </div>
    </AbsoluteFill>
  );
};
