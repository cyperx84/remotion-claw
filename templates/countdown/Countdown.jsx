import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { ThemeLayer } from "../shared/ThemeLayer.jsx";

export const Countdown = ({
  title = "",
  items = [],
  _effects = {},
  _colors = {},
  _transition = "fade",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const accent = _colors.accent || "#f59e0b";
  const bg = _colors.background || "#111111";

  const itemCount = items.length;
  const framesPerItem = Math.floor((durationInFrames - fps * 1.5) / itemCount); // reserve 1.5s for title/outro
  const titleEnd = Math.floor(fps * 1.5);

  // Title animation
  const titleOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Determine which item is active
  const activeIndex = Math.min(
    Math.max(-1, Math.floor((frame - titleEnd) / framesPerItem)),
    itemCount - 1
  );

  const renderItem = (item, index) => {
    const start = titleEnd + index * framesPerItem;
    const end = start + framesPerItem;
    const isActive = index === activeIndex;
    const isPast = index < activeIndex;

    // Number animation
    const numScale = interpolate(frame, [start, start + 15], [1.5, 1], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back),
    });
    const numOpacity = interpolate(frame, [start, start + 10], [0, 1], {
      extrapolateRight: "clamp",
    });

    // Text slide in
    const textY = interpolate(frame, [start + 8, start + 25], [40, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const textOpacity = interpolate(frame, [start + 8, start + 25], [0, 1], {
      extrapolateRight: "clamp",
    });

    // Fade out past items
    const fadeOut = isPast
      ? interpolate(frame, [end - 10, end], [1, 0], {
          extrapolateRight: "clamp",
        })
      : 1;

    return (
      <div
        key={index}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
          opacity: (isActive || isPast ? fadeOut : 0),
          pointerEvents: isActive ? "auto" : "none",
        }}
      >
        {/* Big number */}
        <div
          style={{
            fontSize: 200,
            fontWeight: 900,
            color: accent,
            lineHeight: 1,
            transform: `scale(${isActive ? numScale : 0.8})`,
            opacity: numOpacity * (isActive ? 1 : 0.3),
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {item.number}
        </div>

        {/* Title */}
        <h2
          style={{
            color: "#ffffff",
            fontSize: 52,
            fontWeight: 700,
            marginTop: 30,
            marginBottom: 16,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
          }}
        >
          {item.title}
        </h2>

        {/* Description */}
        <p
          style={{
            color: "#999",
            fontSize: 28,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
            textAlign: "center",
          }}
        >
          {item.description}
        </p>
      </div>
    );
  };

  return (
    <ThemeLayer effects={_effects} colors={_colors} transition={_transition}>
      <AbsoluteFill style={{ background: bg }}>
        {/* Title */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: titleOpacity,
          }}
        >
          <h1
            style={{
              color: "#ffffff",
              fontSize: 44,
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Items */}
        {items.map(renderItem)}

        {/* Progress dots */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 12,
          }}
        >
          {items.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === activeIndex ? 32 : 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: i === activeIndex ? accent : "#333",
                transition: "width 0.3s",
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </ThemeLayer>
  );
};
