import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/**
 * CRT scanline overlay + optional noise grain.
 */
export const Scanlines = ({
  lineSpacing = 4,
  lineOpacity = 0.08,
  noiseOpacity = 0.04,
  scanSpeed = 0.5,
  color = "#00FFFF",
}) => {
  const frame = useCurrentFrame();
  const scanY = (frame * scanSpeed * 3) % 100;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 50 }}>
      {/* Static scanlines */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent ${lineSpacing - 1}px,
            rgba(0,0,0,${lineOpacity}) ${lineSpacing - 1}px,
            rgba(0,0,0,${lineOpacity}) ${lineSpacing}px
          )`,
        }}
      />
      {/* Moving scan bar */}
      <div
        style={{
          position: "absolute",
          top: `${scanY}%`,
          left: 0,
          width: "100%",
          height: 100,
          background: `linear-gradient(to bottom, transparent, ${color}15, transparent)`,
          pointerEvents: "none",
        }}
      />
      {/* Noise grain layer */}
      {noiseOpacity > 0 && (
        <AbsoluteFill
          style={{
            opacity: noiseOpacity,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
            transform: `translate(${Math.sin(frame * 0.7) * 10}px, ${Math.cos(frame * 0.5) * 10}px)`,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
