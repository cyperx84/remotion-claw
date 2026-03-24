import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { ThemeLayer } from "../shared/ThemeLayer.jsx";

export const Quote = ({
  quote = "",
  author = "",
  authorTitle = "",
  _effects = {},
  _colors = {},
  _transition = "fade",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const accent = _colors.accent || "#6366f1";
  const bg = _colors.background || "#0f0f0f";

  // Staggered animations
  const quoteOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const quoteY = interpolate(frame, [10, 30], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const authorOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const authorY = interpolate(frame, [40, 60], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Quote mark pulse
  const markScale = interpolate(frame, [0, 20], [0.8, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back),
  });

  return (
    <ThemeLayer effects={_effects} colors={_colors} transition={_transition}>
      <AbsoluteFill
        style={{
          background: bg,
          justifyContent: "center",
          alignItems: "center",
          padding: 80,
        }}
      >
        {/* Opening quote mark */}
        <div
          style={{
            position: "absolute",
            top: 80,
            left: 80,
            fontSize: 180,
            lineHeight: 1,
            color: accent,
            opacity: 0.3,
            fontFamily: "Georgia, serif",
            transform: `scale(${markScale})`,
          }}
        >
          &ldquo;
        </div>

        {/* Quote text */}
        <div
          style={{
            maxWidth: 800,
            opacity: quoteOpacity,
            transform: `translateY(${quoteY}px)`,
          }}
        >
          <p
            style={{
              fontSize: 48,
              lineHeight: 1.5,
              color: "#ffffff",
              fontFamily: "Georgia, serif",
              fontStyle: "italic",
              margin: 0,
              textAlign: "center",
            }}
          >
            {quote}
          </p>
        </div>

        {/* Author */}
        {author && (
          <div
            style={{
              marginTop: 50,
              textAlign: "center",
              opacity: authorOpacity,
              transform: `translateY(${authorY}px)`,
            }}
          >
            <p
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: accent,
                margin: 0,
              }}
            >
              — {author}
            </p>
            {authorTitle && (
              <p
                style={{
                  fontSize: 20,
                  color: "#888888",
                  marginTop: 8,
                  margin: "8px 0 0",
                }}
              >
                {authorTitle}
              </p>
            )}
          </div>
        )}

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            width: interpolate(frame, [20, 60], [0, 120], {
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            }),
            height: 3,
            backgroundColor: accent,
            borderRadius: 2,
          }}
        />
      </AbsoluteFill>
    </ThemeLayer>
  );
};
