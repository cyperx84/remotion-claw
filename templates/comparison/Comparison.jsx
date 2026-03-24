import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { ThemeLayer } from "../shared/ThemeLayer.jsx";

export const Comparison = ({
  title = "",
  labelLeft = "Before",
  labelRight = "After",
  left = {},
  right = {},
  _effects = {},
  _colors = {},
  _transition = "fade",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const accent = _colors.accent || "#22d3ee";
  const secondary = _colors.secondary || "#a78bfa";
  const bg = _colors.background || "#0a0a0a";

  // Title animation
  const titleOpacity = interpolate(frame, [5, 25], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Divider slide in
  const dividerY = interpolate(frame, [15, 40], [-540, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Panels slide in
  const leftX = interpolate(frame, [20, 50], [-100, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const rightX = interpolate(frame, [20, 50], [100, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Items stagger
  const itemDelay = (i) => 55 + i * 12;

  const renderItemColumn = (data, label, color, xOffset) => (
    <div
      style={{
        flex: 1,
        padding: "40px 50px",
        transform: `translateX(${xOffset}px)`,
        opacity: xOffset === 0 ? 1 : undefined,
      }}
    >
      {/* Label pill */}
      <div
        style={{
          display: "inline-block",
          padding: "6px 20px",
          borderRadius: 20,
          backgroundColor: `${color}20`,
          border: `1px solid ${color}40`,
          marginBottom: 20,
        }}
      >
        <span style={{ color, fontSize: 16, fontWeight: 600 }}>{label}</span>
      </div>

      {/* Title */}
      {data.title && (
        <h2
          style={{
            color: "#ffffff",
            fontSize: 36,
            fontWeight: 700,
            margin: "0 0 10px",
          }}
        >
          {data.title}
        </h2>
      )}

      {/* Description */}
      {data.description && (
        <p style={{ color: "#888", fontSize: 20, margin: "0 0 30px" }}>
          {data.description}
        </p>
      )}

      {/* Items */}
      {data.items?.map((item, i) => {
        const opacity = interpolate(frame, [itemDelay(i), itemDelay(i) + 15], [0, 1], {
          extrapolateRight: "clamp",
        });
        const y = interpolate(frame, [itemDelay(i), itemDelay(i) + 15], [15, 0], {
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 16,
              opacity,
              transform: `translateY(${y}px)`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: color,
                flexShrink: 0,
              }}
            />
            <span style={{ color: "#ddd", fontSize: 22 }}>{item}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <ThemeLayer effects={_effects} colors={_colors} transition={_transition}>
      <AbsoluteFill
        style={{
          background: bg,
          flexDirection: "column",
        }}
      >
        {/* Title bar */}
        <div
          style={{
            padding: "40px 60px 20px",
            opacity: titleOpacity,
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 700, margin: 0 }}>
            {title}
          </h1>
        </div>

        {/* Split view */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            position: "relative",
          }}
        >
          {/* Left panel */}
          {renderItemColumn(left, labelLeft, accent, leftX)}

          {/* Divider */}
          <div
            style={{
              width: 2,
              backgroundColor: `${accent}40`,
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              transform: `translateY(${dividerY}px)`,
            }}
          />

          {/* Right panel */}
          {renderItemColumn(right, labelRight, secondary, rightX)}
        </div>
      </AbsoluteFill>
    </ThemeLayer>
  );
};
