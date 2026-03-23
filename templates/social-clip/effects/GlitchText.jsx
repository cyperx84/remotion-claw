import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

/**
 * Text with chromatic aberration glitch effect.
 * Renders red/cyan offset copies behind the main text.
 */
export const GlitchText = ({
  children,
  style = {},
  intensity = 1,
  flickerSpeed = 0.15,
}) => {
  const frame = useCurrentFrame();

  // Pseudo-random glitch trigger based on frame
  const noise = Math.sin(frame * 7.3) * Math.cos(frame * 3.1);
  const isGlitching = Math.abs(noise) > 0.7;
  const glitchOffset = isGlitching ? intensity * 3 : 0;
  const skew = isGlitching ? noise * 2 : 0;

  // Subtle constant chromatic shift
  const baseShift = Math.sin(frame * flickerSpeed) * intensity;

  return (
    <div style={{ position: "relative", ...style }}>
      {/* Red channel */}
      <div
        style={{
          ...style,
          position: "absolute",
          top: 0,
          left: 0,
          color: "#FF003C",
          opacity: 0.7,
          transform: `translate(${-2 * intensity + glitchOffset}px, ${-1 + baseShift}px) skewX(${skew}deg)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      >
        {children}
      </div>
      {/* Cyan channel */}
      <div
        style={{
          ...style,
          position: "absolute",
          top: 0,
          left: 0,
          color: "#00FFFF",
          opacity: 0.7,
          transform: `translate(${2 * intensity - glitchOffset}px, ${1 - baseShift}px) skewX(${-skew}deg)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      >
        {children}
      </div>
      {/* Main text */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
};
