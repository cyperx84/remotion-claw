import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import { AudioOverlay } from "../../shared/AudioOverlay.jsx";
import { KineticText } from "../effects/KineticText.jsx";

/**
 * MINIMAL CLIP — Clean, modern, high-contrast.
 * Big bold typography, geometric accents, smooth spring animations.
 * Think Apple keynote meets editorial design.
 */
export const MinimalClip = ({
  title = "Your Title",
  subtitle = "Your subtitle",
  background = "#fafafa",
  accentColor = "#000000",
  textColor = "#111111",
  items = [],
  audioSrc = null,
  audioVolume = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Circle reveal — expands from center
  const circleSize = interpolate(frame, [0, 40], [0, 3000], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
  });

  // Content stagger
  const titleIn = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 18 } });
  const subIn = spring({ frame: Math.max(0, frame - 35), fps, config: { damping: 16 } });

  // Accent line grows
  const lineW = interpolate(frame, [10, 45], [0, 120], { extrapolateRight: "clamp" });

  // Geometric accent rotation
  const geoRotate = interpolate(frame, [0, durationInFrames], [0, 90]);

  // Fade out
  const fadeOut = interpolate(frame, [durationInFrames - 25, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#111", opacity: fadeOut }}>
      <AudioOverlay audioSrc={audioSrc} volume={audioVolume} />

      {/* Circle reveal mask */}
      <AbsoluteFill
        style={{
          background,
          clipPath: `circle(${circleSize}px at 50% 50%)`,
        }}
      >
        {/* Geometric accent — rotating square */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "10%",
            width: 120,
            height: 120,
            border: `3px solid ${accentColor}15`,
            transform: `rotate(${geoRotate}deg)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            left: "8%",
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `2px solid ${accentColor}10`,
            transform: `rotate(${-geoRotate}deg)`,
          }}
        />

        {/* Content */}
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 70px",
          }}
        >
          {/* Accent line */}
          <div
            style={{
              width: lineW,
              height: 4,
              backgroundColor: accentColor,
              marginBottom: 50,
            }}
          />

          {/* Title — kinetic */}
          <div style={{ opacity: titleIn, transform: `translateY(${(1 - titleIn) * 20}px)` }}>
            <KineticText
              text={title}
              fontSize={72}
              fontWeight={900}
              color={textColor}
              direction="up"
              staggerFrames={4}
              startFrame={15}
              fontFamily="'Inter', 'Helvetica Neue', sans-serif"
              lineHeight={1.05}
            />
          </div>

          {/* Subtitle */}
          <Sequence from={30}>
            <p
              style={{
                fontSize: 30,
                color: `${textColor}99`,
                textAlign: "center",
                marginTop: 30,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                letterSpacing: 1,
                opacity: subIn,
                transform: `translateY(${(1 - subIn) * 15}px)`,
              }}
            >
              {subtitle}
            </p>
          </Sequence>

          {/* Items */}
          {items.length > 0 && (
            <Sequence from={60}>
              <div style={{ marginTop: 50, width: "100%" }}>
                {items.map((item, i) => {
                  const iProgress = spring({
                    frame: Math.max(0, frame - 60 - i * 8),
                    fps,
                    config: { damping: 16 },
                  });
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginBottom: 16,
                        opacity: iProgress,
                        transform: `translateX(${(1 - iProgress) * 40}px)`,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          backgroundColor: accentColor,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 26,
                          color: textColor,
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 400,
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Sequence>
          )}
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
