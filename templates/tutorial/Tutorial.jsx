import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { ThemeLayer } from "../shared/ThemeLayer.jsx";

export const Tutorial = ({
  title = "",
  steps = [],
  _effects = {},
  _colors = {},
  _transition = "fade",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const accent = _colors.accent || "#10b981";
  const bg = _colors.background || "#0d1117";

  const stepCount = steps.length;
  const titleFrames = Math.floor(fps * 1.5);
  const outroFrames = Math.floor(fps * 1);
  const framesPerStep = Math.floor(
    (durationInFrames - titleFrames - outroFrames) / stepCount
  );

  // Title animation
  const titleOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const titleY = interpolate(frame, [5, 20], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Which step is active
  const activeStep = Math.min(
    Math.max(-1, Math.floor((frame - titleFrames) / framesPerStep)),
    stepCount - 1
  );

  const renderStep = (step, index) => {
    const start = titleFrames + index * framesPerStep;
    const isActive = index === activeStep;
    const isPast = index < activeStep;

    // Step number
    const numOpacity = interpolate(frame, [start, start + 12], [0, 1], {
      extrapolateRight: "clamp",
    });
    const numScale = interpolate(frame, [start, start + 15], [0.5, 1], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.back),
    });

    // Content slide
    const slideX = interpolate(frame, [start + 5, start + 25], [60, 0], {
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    });
    const contentOpacity = interpolate(frame, [start + 5, start + 25], [0, 1], {
      extrapolateRight: "clamp",
    });

    // Code block
    const codeOpacity = step.code
      ? interpolate(frame, [start + 15, start + 30], [0, 1], {
          extrapolateRight: "clamp",
        })
      : 0;

    const fadeOut = isPast
      ? interpolate(frame, [start + framesPerStep - 10, start + framesPerStep], [1, 0], {
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
          padding: "60px 120px",
          opacity: (isActive || isPast ? fadeOut : 0),
        }}
      >
        <div style={{ display: "flex", gap: 40, alignItems: "flex-start" }}>
          {/* Step number circle */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: `${accent}20`,
              border: `2px solid ${accent}`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 36,
              fontWeight: 800,
              color: accent,
              flexShrink: 0,
              opacity: numOpacity,
              transform: `scale(${numScale})`,
            }}
          >
            {index + 1}
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              opacity: contentOpacity,
              transform: `translateX(${slideX}px)`,
            }}
          >
            <h2
              style={{
                color: "#ffffff",
                fontSize: 44,
                fontWeight: 700,
                margin: "0 0 12px",
              }}
            >
              {step.title}
            </h2>
            <p
              style={{
                color: "#888",
                fontSize: 24,
                margin: "0 0 20px",
                maxWidth: 700,
              }}
            >
              {step.description}
            </p>

            {/* Code block */}
            {step.code && (
              <div
                style={{
                  opacity: codeOpacity,
                  backgroundColor: "#161b22",
                  border: `1px solid ${accent}30`,
                  borderRadius: 12,
                  padding: "20px 28px",
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                  fontSize: 22,
                  color: accent,
                  whiteSpace: "pre-wrap",
                  maxWidth: 700,
                }}
              >
                {step.code}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Outro
  const outroStart = titleFrames + stepCount * framesPerStep;
  const outroOpacity = interpolate(
    frame,
    [outroStart, outroStart + 20],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <ThemeLayer effects={_effects} colors={_colors} transition={_transition}>
      <AbsoluteFill style={{ background: bg }}>
        {/* Title bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "30px 60px",
            borderBottom: `1px solid ${accent}20`,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              color: "#ffffff",
              fontSize: 32,
              fontWeight: 700,
              margin: 0,
            }}
          >
            {title}
          </h1>
          <span
            style={{
              color: accent,
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {stepCount} steps
          </span>
        </div>

        {/* Steps */}
        {steps.map(renderStep)}

        {/* Outro */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: outroOpacity,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h2 style={{ color: "#fff", fontSize: 48, fontWeight: 700, margin: "0 0 16px" }}>
              You&apos;re all set! 🚀
            </h2>
            <p style={{ color: "#888", fontSize: 24 }}>That&apos;s it. Now go build something.</p>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: 4,
            backgroundColor: accent,
            width: `${interpolate(frame, [0, durationInFrames], [0, 100])}%`,
          }}
        />
      </AbsoluteFill>
    </ThemeLayer>
  );
};
