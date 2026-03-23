import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { AudioOverlay } from "../shared/AudioOverlay.jsx";
import { ThemeLayer } from "../shared/ThemeLayer.jsx";
import { KineticText } from "../social-clip/effects/KineticText.jsx";
import { GlitchText } from "../social-clip/effects/GlitchText.jsx";

export const Announcement = ({
  title = "Big News!",
  body = "We just shipped something amazing.",
  accent,
  accentColor,
  background,
  textColor = "#ffffff",
  author = "",
  audioSrc = null,
  audioVolume = 1,
  // Theme props (injected by theme system)
  _theme = "default",
  _effects = {},
  _fonts = {},
  _transition = "fade",
  _extras = {},
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const accentFinal = accentColor || accent || "#e94560";
  const bgFinal = background || "#16213e";
  const headingFont = _fonts.heading || "Inter, system-ui, sans-serif";
  const bodyFont = _fonts.body || "Inter, system-ui, sans-serif";
  const useGlitch = _effects.glitch || _theme === "glitch";

  // Title entrance
  const titleProgress = spring({ frame, fps, config: { damping: 14 } });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Body entrance
  const bodyOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const bodyY = interpolate(frame, [20, 40], [40, 0], { extrapolateRight: "clamp" });

  // Accent line
  const lineWidth = interpolate(frame, [5, 35], [0, 120], { extrapolateRight: "clamp" });

  const TitleWrapper = useGlitch ? GlitchText : React.Fragment;
  const titleWrapperProps = useGlitch ? { intensity: _effects.glitch?.intensity || 1.5 } : {};

  return (
    <AbsoluteFill style={{ background: bgFinal }}>
      <AudioOverlay audioSrc={audioSrc} volume={audioVolume} />
      <ThemeLayer
        effects={_effects}
        colors={{ accent: accentFinal, background: bgFinal }}
        transition={_transition}
      >
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 80px",
          }}
        >
          {/* Accent line */}
          <div
            style={{
              width: lineWidth,
              height: 4,
              backgroundColor: accentFinal,
              marginBottom: 40,
              borderRadius: 2,
              boxShadow: _effects.glow ? `0 0 15px ${accentFinal}` : "none",
            }}
          />

          {/* Title — kinetic + optional glitch */}
          <TitleWrapper {...titleWrapperProps}>
            <KineticText
              text={title}
              fontSize={64}
              fontWeight={800}
              color={textColor}
              fontFamily={headingFont}
              direction="up"
              staggerFrames={4}
              startFrame={5}
            />
          </TitleWrapper>

          {/* Body */}
          <p
            style={{
              fontSize: 32,
              color: `${textColor}cc`,
              textAlign: "center",
              marginTop: 30,
              lineHeight: 1.5,
              transform: `translateY(${bodyY}px)`,
              opacity: bodyOpacity,
              fontFamily: bodyFont,
              fontWeight: 400,
              textShadow: _effects.glow ? `0 0 10px ${accentFinal}30` : "none",
            }}
          >
            {body}
          </p>

          {/* Author */}
          {author && (
            <p
              style={{
                fontSize: 22,
                color: accentFinal,
                marginTop: 40,
                opacity: bodyOpacity,
                fontFamily: bodyFont,
                fontWeight: 500,
              }}
            >
              — {author}
            </p>
          )}
        </AbsoluteFill>

        {/* Corner info (glitch theme) */}
        {_extras.cornerInfo && (
          <>
            <div style={{ position: "absolute", top: 30, left: 30, fontFamily: "monospace", fontSize: 11, color: `${accentFinal}60`, zIndex: 20 }}>
              [SYS:ANNOUNCE] FRM:{String(frame).padStart(4, "0")}
            </div>
            <div style={{ position: "absolute", bottom: 30, right: 30, fontFamily: "monospace", fontSize: 11, color: `${_effects.glitch ? "#FF003C" : accentFinal}60`, zIndex: 20 }}>
              {accentFinal} // RCLAW
            </div>
          </>
        )}
      </ThemeLayer>
    </AbsoluteFill>
  );
};
