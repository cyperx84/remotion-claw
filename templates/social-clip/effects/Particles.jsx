import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

/**
 * Floating particle system — configurable count, colors, speed, size.
 * Pure CSS/inline-style — no canvas, works in Remotion render.
 */
export const Particles = ({
  count = 40,
  colors = ["#e94560", "#00FFFF", "#FF00FF", "#ffffff"],
  minSize = 2,
  maxSize = 6,
  speed = 1,
  glow = true,
  opacity = 0.6,
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo(() => {
    const seed = 42;
    return Array.from({ length: count }, (_, i) => {
      const r = ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280;
      const r2 = ((seed * (i + 7) * 7393 + 13297) % 233280) / 233280;
      const r3 = ((seed * (i + 13) * 4219 + 73939) % 233280) / 233280;
      return {
        x: r * 100,
        y: r2 * 100,
        size: minSize + r3 * (maxSize - minSize),
        color: colors[i % colors.length],
        speedMul: 0.5 + r * 1.5,
        phase: r2 * Math.PI * 2,
      };
    });
  }, [count, colors, minSize, maxSize]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {particles.map((p, i) => {
        const t = frame * 0.02 * speed * p.speedMul;
        const x = p.x + Math.sin(t + p.phase) * 8;
        const y = ((p.y + frame * 0.15 * speed * p.speedMul) % 120) - 10;
        const pulse = 0.7 + Math.sin(frame * 0.08 + p.phase) * 0.3;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              opacity: opacity * pulse,
              boxShadow: glow ? `0 0 ${p.size * 3}px ${p.color}` : "none",
              transform: `scale(${pulse})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
