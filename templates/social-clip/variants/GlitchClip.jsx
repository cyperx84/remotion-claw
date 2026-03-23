import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
} from "remotion";
import { AudioOverlay } from "../../shared/AudioOverlay.jsx";
import { Particles } from "../effects/Particles.jsx";
import { GlitchText } from "../effects/GlitchText.jsx";
import { Scanlines } from "../effects/Scanlines.jsx";
import { KineticText } from "../effects/KineticText.jsx";

/**
 * GLITCH CLIP — Cyberpunk / CyperX chaos aesthetic.
 * Chromatic aberration, scanlines, floating particles, kinetic text.
 */
export const GlitchClip = ({
  title = "Your Title",
  subtitle = "Your subtitle",
  background = "#050505",
  accentColor = "#00FFFF",
  secondaryColor = "#FF003C",
  textColor = "#ffffff",
  items = [],
  audioSrc = null,
  audioVolume = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Background pulse
  const bgPulse = interpolate(Math.sin(frame * 0.03), [-1, 1], [0.95, 1.02]);

  // Screen shake on glitch frames
  const noise = Math.sin(frame * 7.3) * Math.cos(frame * 3.1);
  const isGlitching = Math.abs(noise) > 0.8;
  const shakeX = isGlitching ? noise * 4 : 0;
  const shakeY = isGlitching ? Math.cos(frame * 11) * 3 : 0;

  // Fade out
  const fadeOut = interpolate(frame, [durationInFrames - 25, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtitle entrance
  const subOpacity = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: "clamp" });
  const subY = interpolate(frame, [40, 60], [30, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background,
        opacity: fadeOut,
        transform: `translate(${shakeX}px, ${shakeY}px) scale(${bgPulse})`,
      }}
    >
      <AudioOverlay audioSrc={audioSrc} volume={audioVolume} />

      {/* Background radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${accentColor}20 0%, transparent 60%),
                        radial-gradient(ellipse at 80% 80%, ${secondaryColor}15 0%, transparent 50%)`,
        }}
      />

      {/* Particles */}
      <Particles
        count={50}
        colors={[accentColor, secondaryColor, "#FF00FF", "#ffffff"]}
        speed={1.2}
        glow={true}
        opacity={0.5}
      />

      {/* Scanlines */}
      <Scanlines color={accentColor} lineOpacity={0.06} noiseOpacity={0.03} />

      {/* Content */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: "0 50px",
          zIndex: 10,
        }}
      >
        {/* Accent bar with glitch */}
        <div
          style={{
            width: interpolate(frame, [5, 30], [0, 180], { extrapolateRight: "clamp" }),
            height: 4,
            backgroundColor: accentColor,
            marginBottom: 40,
            boxShadow: `0 0 20px ${accentColor}`,
            transform: isGlitching ? `scaleX(${1 + noise * 0.3})` : "none",
          }}
        />

        {/* Title — kinetic word-by-word */}
        <GlitchText intensity={1.5}>
          <KineticText
            text={title}
            fontSize={68}
            fontWeight={800}
            color={textColor}
            direction="up"
            staggerFrames={3}
            startFrame={5}
          />
        </GlitchText>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 34,
            color: `${textColor}bb`,
            textAlign: "center",
            marginTop: 30,
            fontFamily: "monospace",
            fontWeight: 400,
            transform: `translateY(${subY}px)`,
            opacity: subOpacity,
            textShadow: `0 0 10px ${accentColor}40`,
          }}
        >
          {subtitle}
        </p>

        {/* Items with stagger */}
        {items.length > 0 && (
          <Sequence from={70}>
            <div style={{ marginTop: 50 }}>
              {items.map((item, i) => {
                const iOpacity = interpolate(
                  frame - 70,
                  [i * 12, i * 12 + 12],
                  [0, 1],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                const iX = interpolate(
                  frame - 70,
                  [i * 12, i * 12 + 12],
                  [-40, 0],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                );
                return (
                  <div
                    key={i}
                    style={{
                      fontSize: 26,
                      color: accentColor,
                      opacity: iOpacity,
                      marginBottom: 14,
                      fontFamily: "monospace",
                      transform: `translateX(${iX}px)`,
                    }}
                  >
                    {">"} {item}
                  </div>
                );
              })}
            </div>
          </Sequence>
        )}
      </AbsoluteFill>

      {/* Corner decorations */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 40,
          color: `${accentColor}60`,
          fontFamily: "monospace",
          fontSize: 12,
          zIndex: 20,
        }}
      >
        [SYS:RENDER] FRM:{String(frame).padStart(4, "0")}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 40,
          color: `${secondaryColor}60`,
          fontFamily: "monospace",
          fontSize: 12,
          zIndex: 20,
        }}
      >
        {accentColor} // GLITCH_MODE
      </div>
    </AbsoluteFill>
  );
};
