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
import { Particles } from "../effects/Particles.jsx";
import { KineticText } from "../effects/KineticText.jsx";

/**
 * NEON CLIP — Clean neon glow aesthetic.
 * Glowing borders, neon text shadows, smooth particle drift, pulsing backgrounds.
 */
export const NeonClip = ({
  title = "Your Title",
  subtitle = "Your subtitle",
  background = "#0a0015",
  accentColor = "#ff6ec7",
  secondaryColor = "#7b68ee",
  textColor = "#ffffff",
  items = [],
  audioSrc = null,
  audioVolume = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Breathing glow
  const breathe = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.6, 1]);

  // Title entrance
  const titleProgress = spring({ frame, fps, config: { damping: 16, stiffness: 80 } });

  // Fade out
  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Neon border animation
  const borderGlow = interpolate(Math.sin(frame * 0.06), [-1, 1], [0.4, 1]);

  return (
    <AbsoluteFill style={{ background, opacity: fadeOut }}>
      <AudioOverlay audioSrc={audioSrc} volume={audioVolume} />

      {/* Gradient orbs */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
          top: "10%",
          left: "-10%",
          filter: "blur(80px)",
          opacity: breathe,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${secondaryColor}25 0%, transparent 70%)`,
          bottom: "5%",
          right: "-15%",
          filter: "blur(60px)",
          opacity: breathe * 0.8,
        }}
      />

      {/* Particles — slow, dreamy */}
      <Particles
        count={25}
        colors={[accentColor, secondaryColor, "#ffffff"]}
        speed={0.4}
        glow={true}
        opacity={0.4}
        minSize={2}
        maxSize={5}
      />

      {/* Neon bordered content card */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 60px",
          zIndex: 10,
        }}
      >
        <div
          style={{
            border: `2px solid ${accentColor}`,
            borderRadius: 0,
            padding: "60px 50px",
            maxWidth: 900,
            boxShadow: `0 0 ${30 * borderGlow}px ${accentColor}50,
                         inset 0 0 ${20 * borderGlow}px ${accentColor}10`,
            background: `${background}cc`,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Title */}
          <div style={{ transform: `scale(${titleProgress})`, opacity: titleProgress }}>
            <KineticText
              text={title}
              fontSize={64}
              fontWeight={700}
              color={textColor}
              direction="scale"
              staggerFrames={5}
              startFrame={8}
            />
          </div>

          {/* Neon divider */}
          <div
            style={{
              width: interpolate(frame, [20, 50], [0, 200], { extrapolateRight: "clamp" }),
              height: 2,
              background: `linear-gradient(90deg, transparent, ${accentColor}, ${secondaryColor}, transparent)`,
              margin: "30px auto",
              boxShadow: `0 0 15px ${accentColor}`,
            }}
          />

          {/* Subtitle */}
          <Sequence from={25}>
            <p
              style={{
                fontSize: 32,
                color: `${textColor}cc`,
                textAlign: "center",
                fontFamily: "Inter, system-ui, sans-serif",
                fontWeight: 300,
                letterSpacing: 2,
                textShadow: `0 0 20px ${secondaryColor}40`,
              }}
            >
              {subtitle}
            </p>
          </Sequence>

          {/* Items */}
          {items.length > 0 && (
            <Sequence from={65}>
              <div style={{ marginTop: 40 }}>
                {items.map((item, i) => {
                  const iProgress = spring({
                    frame: Math.max(0, frame - 65 - i * 10),
                    fps,
                    config: { damping: 14 },
                  });
                  return (
                    <div
                      key={i}
                      style={{
                        fontSize: 24,
                        color: textColor,
                        opacity: iProgress,
                        marginBottom: 12,
                        fontFamily: "Inter, system-ui, sans-serif",
                        fontWeight: 300,
                        paddingLeft: 20,
                        borderLeft: `2px solid ${accentColor}`,
                        transform: `translateX(${(1 - iProgress) * 30}px)`,
                      }}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </Sequence>
          )}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
