import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Particles } from "../social-clip/effects/Particles.jsx";
import { Scanlines } from "../social-clip/effects/Scanlines.jsx";

/**
 * ThemeLayer — wraps any template content with theme-driven visual effects.
 *
 * Drop this into any template:
 *   <ThemeLayer effects={props._effects} colors={{ accent, background }}>
 *     {your content}
 *   </ThemeLayer>
 *
 * It reads the _effects config from the theme system and renders matching overlays.
 */
export const ThemeLayer = ({
  children,
  effects = {},
  colors = {},
  transition = "fade",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Transition in/out
  let opacity = 1;
  if (transition === "fade") {
    opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" })
      * interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  } else if (transition === "glitch-cut") {
    // Hard cut with glitch flash
    const isStart = frame < 5;
    const isEnd = frame > durationInFrames - 8;
    const glitchFlash = isStart || isEnd ? 0.7 + Math.random() * 0.3 : 1;
    opacity = interpolate(frame, [durationInFrames - 3, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * glitchFlash;
  } else if (transition === "dissolve") {
    opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" })
      * interpolate(frame, [durationInFrames - 25, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  }

  // Screen shake (glitch theme)
  let shakeX = 0, shakeY = 0;
  if (effects.screenShake) {
    const noise = Math.sin(frame * 7.3) * Math.cos(frame * 3.1);
    if (Math.abs(noise) > 0.8) {
      shakeX = noise * 4;
      shakeY = Math.cos(frame * 11) * 3;
    }
  }

  // Background breathing
  const breathe = effects.glow
    ? interpolate(Math.sin(frame * 0.04), [-1, 1], [0.95, 1.02])
    : 1;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translate(${shakeX}px, ${shakeY}px) scale(${breathe})`,
      }}
    >
      {/* Background gradient glow */}
      {effects.glow && colors.accent && (
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 50% 40%, ${colors.accent}20 0%, transparent 60%)`,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Gradient orbs (neon theme) */}
      {effects.gradientOrbs && (
        <>
          <div
            style={{
              position: "absolute",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colors.accent || "#ff6ec7"}30 0%, transparent 70%)`,
              top: "10%",
              left: "-10%",
              filter: "blur(80px)",
              opacity: interpolate(Math.sin(frame * 0.04), [-1, 1], [0.5, 1]),
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colors.secondary || "#7b68ee"}25 0%, transparent 70%)`,
              bottom: "5%",
              right: "-15%",
              filter: "blur(60px)",
              opacity: interpolate(Math.sin(frame * 0.04), [-1, 1], [0.4, 0.8]),
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* CRT vignette (terminal theme) */}
      {effects.crtVignette && (
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)",
            pointerEvents: "none",
            zIndex: 40,
          }}
        />
      )}

      {/* Circle reveal (minimal theme) */}
      {effects.circleReveal && (
        <AbsoluteFill
          style={{
            background: "#111",
            clipPath: `circle(${interpolate(frame, [0, 40], [0, 3000], { extrapolateRight: "clamp" })}px at 50% 50%)`,
            zIndex: -1,
          }}
        />
      )}

      {/* Particles */}
      {effects.particles && typeof effects.particles === "object" && (
        <Particles {...effects.particles} />
      )}

      {/* Content */}
      <AbsoluteFill style={{ zIndex: 10 }}>
        {children}
      </AbsoluteFill>

      {/* Scanlines (on top of content) */}
      {effects.scanlines && typeof effects.scanlines === "object" && (
        <Scanlines
          color={colors.accent || "#00FFFF"}
          {...effects.scanlines}
        />
      )}
    </AbsoluteFill>
  );
};
