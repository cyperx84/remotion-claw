import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
} from "remotion";
import { AudioOverlay } from "../../shared/AudioOverlay.jsx";
import { Scanlines } from "../effects/Scanlines.jsx";

/**
 * TERMINAL CLIP — Green-on-black CRT terminal aesthetic.
 * Typewriter text reveal, blinking cursor, scan lines, phosphor glow.
 */
export const TerminalClip = ({
  title = "Your Title",
  subtitle = "Your subtitle",
  background = "#0a0a0a",
  accentColor = "#33ff33",
  textColor = "#33ff33",
  prompt = "root@claw:~$",
  items = [],
  audioSrc = null,
  audioVolume = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Typewriter effect helper
  const typewrite = (text, startFrame, charsPerFrame = 0.8) => {
    const elapsed = Math.max(0, frame - startFrame);
    const chars = Math.floor(elapsed * charsPerFrame);
    return text.slice(0, Math.min(chars, text.length));
  };

  // Blinking cursor
  const cursorVisible = Math.floor(frame / 15) % 2 === 0;

  // Boot sequence
  const bootDone = frame > 30;

  // Fade out
  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CRT vignette
  const vignette = `radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.6) 100%)`;

  return (
    <AbsoluteFill style={{ background, opacity: fadeOut }}>
      <AudioOverlay audioSrc={audioSrc} volume={audioVolume} />

      {/* CRT vignette */}
      <AbsoluteFill style={{ background: vignette, zIndex: 40, pointerEvents: "none" }} />

      {/* Scanlines */}
      <Scanlines
        color={accentColor}
        lineOpacity={0.1}
        noiseOpacity={0.02}
        scanSpeed={0.3}
        lineSpacing={3}
      />

      {/* Phosphor glow background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${accentColor}08 0%, transparent 70%)`,
        }}
      />

      {/* Terminal content */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 50,
          right: 50,
          bottom: 80,
          fontFamily: "'Courier New', monospace",
          fontSize: 28,
          color: accentColor,
          lineHeight: 1.8,
          zIndex: 10,
          textShadow: `0 0 8px ${accentColor}60`,
        }}
      >
        {/* Terminal chrome */}
        <div
          style={{
            borderBottom: `2px solid ${accentColor}40`,
            paddingBottom: 12,
            marginBottom: 20,
            fontSize: 16,
            opacity: 0.5,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>tty1 — 80×24</span>
          <span>rclaw v0.1</span>
        </div>

        {/* Boot sequence */}
        <Sequence from={0} durationInFrames={30}>
          <div style={{ fontSize: 22, opacity: 0.6 }}>
            <p>{typewrite("[OK] Loading kernel modules...", 0, 1.5)}</p>
            <p>{typewrite("[OK] Initializing display...", 10, 1.5)}</p>
            <p>{typewrite("[OK] System ready.", 20, 1.5)}</p>
          </div>
        </Sequence>

        {/* Main content */}
        {bootDone && (
          <>
            <div style={{ marginTop: frame > 30 ? 20 : 0 }}>
              <span style={{ color: `${accentColor}aa`, fontSize: 22 }}>{prompt} </span>
              <span style={{ fontSize: 22 }}>{typewrite(`cat ${title.toLowerCase().replace(/\s+/g, "_")}.md`, 32, 0.8)}</span>
            </div>

            <Sequence from={55}>
              <div style={{ marginTop: 30 }}>
                <h1
                  style={{
                    fontSize: 56,
                    fontWeight: 700,
                    color: textColor,
                    fontFamily: "'Courier New', monospace",
                    textShadow: `0 0 20px ${accentColor}80`,
                    margin: 0,
                  }}
                >
                  # {typewrite(title, 55, 0.6)}
                </h1>
              </div>
            </Sequence>

            <Sequence from={90}>
              <p
                style={{
                  fontSize: 26,
                  color: `${textColor}cc`,
                  marginTop: 20,
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {typewrite(subtitle, 90, 0.5)}
              </p>
            </Sequence>

            {items.length > 0 && (
              <Sequence from={130}>
                <div style={{ marginTop: 30 }}>
                  {items.map((item, i) => {
                    const itemStart = 130 + i * 25;
                    return (
                      <p key={i} style={{ fontSize: 24, marginBottom: 8 }}>
                        <span style={{ color: `${accentColor}80` }}>→ </span>
                        {typewrite(item, itemStart, 0.6)}
                      </p>
                    );
                  })}
                </div>
              </Sequence>
            )}

            {/* Blinking cursor at bottom */}
            <div
              style={{
                marginTop: 40,
                fontSize: 22,
              }}
            >
              <span style={{ color: `${accentColor}aa` }}>{prompt} </span>
              <span
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 28,
                  backgroundColor: cursorVisible ? accentColor : "transparent",
                  verticalAlign: "middle",
                  boxShadow: cursorVisible ? `0 0 10px ${accentColor}` : "none",
                }}
              />
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
