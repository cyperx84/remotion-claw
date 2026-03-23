import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Sequence,
} from "remotion";
import { AudioOverlay } from "../shared/AudioOverlay.jsx";
import { ThemeLayer } from "../shared/ThemeLayer.jsx";
import { KineticText } from "./effects/KineticText.jsx";
import { GlitchText } from "./effects/GlitchText.jsx";

/**
 * SocialClip — upgraded with theme support.
 * Pass --theme glitch/neon/terminal/minimal/fire/ice to change look.
 */
export const SocialClip = ({
  title = "Your Title",
  subtitle = "Your subtitle",
  background = "#1a1a2e",
  accentColor = "#e94560",
  textColor = "#ffffff",
  items = [],
  audioSrc = null,
  audioVolume = 1,
  // Theme props
  _theme = "default",
  _effects = {},
  _fonts = {},
  _transition = "fade",
  _extras = {},
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const headingFont = _fonts.heading || "Inter, system-ui, sans-serif";
  const bodyFont = _fonts.body || "Inter, system-ui, sans-serif";
  const useGlitch = _effects.glitch || _theme === "glitch";

  // Accent bar animation
  const barWidth = interpolate(frame, [10, 40], [0, 200], { extrapolateRight: "clamp" });

  // Subtitle entrance
  const subtitleY = interpolate(frame, [30, 55], [50, 0], { extrapolateRight: "clamp" });
  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });

  const TitleWrapper = useGlitch ? GlitchText : React.Fragment;
  const titleWrapperProps = useGlitch ? { intensity: _effects.glitch?.intensity || 1.5 } : {};

  return (
    <AbsoluteFill style={{ background }}>
      <AudioOverlay audioSrc={audioSrc} volume={audioVolume} />
      <ThemeLayer
        effects={_effects}
        colors={{ accent: accentColor, background }}
        transition={_transition}
      >
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 60px",
          }}
        >
          {/* Accent bar */}
          <div
            style={{
              width: barWidth,
              height: 4,
              backgroundColor: accentColor,
              marginBottom: 40,
              borderRadius: 2,
              boxShadow: _effects.glow ? `0 0 15px ${accentColor}` : "none",
            }}
          />

          {/* Title — kinetic + optional glitch */}
          <TitleWrapper {...titleWrapperProps}>
            <KineticText
              text={title}
              fontSize={72}
              fontWeight={800}
              color={textColor}
              fontFamily={headingFont}
              direction="up"
              staggerFrames={3}
              startFrame={5}
            />
          </TitleWrapper>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 36,
              color: `${textColor}cc`,
              textAlign: "center",
              marginTop: 30,
              transform: `translateY(${subtitleY}px)`,
              opacity: subtitleOpacity,
              fontFamily: bodyFont,
              fontWeight: 400,
              textShadow: _effects.glow ? `0 0 10px ${accentColor}30` : "none",
            }}
          >
            {subtitle}
          </p>

          {/* Items */}
          {items.length > 0 && (
            <Sequence from={60}>
              <div style={{ marginTop: 50 }}>
                {items.map((item, i) => {
                  const itemOpacity = interpolate(
                    frame - 60,
                    [i * 15, i * 15 + 15],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  );
                  const itemX = interpolate(
                    frame - 60,
                    [i * 15, i * 15 + 15],
                    [useGlitch ? -30 : 0, 0],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
                  );
                  return (
                    <div
                      key={i}
                      style={{
                        fontSize: 28,
                        color: useGlitch ? accentColor : textColor,
                        opacity: itemOpacity,
                        marginBottom: 16,
                        fontFamily: bodyFont,
                        transform: `translateX(${itemX}px)`,
                      }}
                    >
                      {useGlitch ? "> " : "→ "}{item}
                    </div>
                  );
                })}
              </div>
            </Sequence>
          )}
        </AbsoluteFill>

        {/* Corner decorations (glitch/terminal themes) */}
        {_extras.cornerInfo && (
          <>
            <div style={{ position: "absolute", top: 40, left: 40, fontFamily: "monospace", fontSize: 12, color: `${accentColor}60`, zIndex: 20 }}>
              [SYS:RENDER] FRM:{String(frame).padStart(4, "0")}
            </div>
            <div style={{ position: "absolute", bottom: 40, right: 40, fontFamily: "monospace", fontSize: 12, color: `${accentColor}60`, zIndex: 20 }}>
              {accentColor} // RCLAW
            </div>
          </>
        )}
      </ThemeLayer>
    </AbsoluteFill>
  );
};
