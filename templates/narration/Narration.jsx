import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";
import { AudioOverlay } from "../shared/AudioOverlay.jsx";

/**
 * Narration template — scene-by-scene visuals synced to voiceover.
 *
 * Props:
 *   scenes: Array of scene objects, each with:
 *     - type: "title" | "terminal" | "code" | "feature-grid" | "diagram" |
 *             "text-highlight" | "split" | "stats" | "cta"
 *     - durationSec: duration of this scene in seconds
 *     - ...type-specific props (see scene components below)
 *   background, accentColor, textColor: global theme
 *   audioSrc, audioVolume: voiceover
 */
export const Narration = ({
  scenes = [],
  background = "#0a0a1a",
  accentColor = "#7c3aed",
  textColor = "#ffffff",
  audioSrc = null,
  audioVolume = 1,
}) => {
  const { fps } = useVideoConfig();
  const theme = { background, accentColor, textColor, fps };

  // Calculate frame offsets for each scene
  let frameOffset = 0;
  const sceneEntries = scenes.map((scene, i) => {
    const durationFrames = Math.ceil((scene.durationSec || 5) * fps);
    const entry = { scene, from: frameOffset, durationInFrames: durationFrames, index: i };
    frameOffset += durationFrames;
    return entry;
  });

  return (
    <AbsoluteFill style={{ background }}>
      <AudioOverlay audioSrc={audioSrc} volume={audioVolume} />
      {/* Gradient background */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${accentColor}15 0%, transparent 70%)`,
        }}
      />
      {sceneEntries.map(({ scene, from, durationInFrames, index }) => (
        <Sequence key={index} from={from} durationInFrames={durationInFrames}>
          <SceneRenderer scene={scene} theme={theme} duration={durationInFrames} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** Route scene type to the right component */
const SceneRenderer = ({ scene, theme, duration }) => {
  const props = { ...scene, theme, duration };
  switch (scene.type) {
    case "title":
      return <TitleScene {...props} />;
    case "terminal":
      return <TerminalScene {...props} />;
    case "code":
      return <CodeScene {...props} />;
    case "feature-grid":
      return <FeatureGridScene {...props} />;
    case "diagram":
      return <DiagramScene {...props} />;
    case "text-highlight":
      return <TextHighlightScene {...props} />;
    case "split":
      return <SplitScene {...props} />;
    case "stats":
      return <StatsScene {...props} />;
    case "cta":
      return <CTAScene {...props} />;
    default:
      return <TextHighlightScene {...props} text={scene.text || scene.type} />;
  }
};

/* ─────────────────────────────────────────────
   Shared transition helpers
   ───────────────────────────────────────────── */

const TRANSITION_FRAMES = 15;

function useTransition(duration) {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, TRANSITION_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(
    frame,
    [duration - TRANSITION_FRAMES, duration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return { frame, opacity: enter * exit, enter, exit };
}

/* ─────────────────────────────────────────────
   Scene: Title
   Props: text, subtitle
   ───────────────────────────────────────────── */

const TitleScene = ({ text, subtitle, theme, duration }) => {
  const { frame, opacity } = useTransition(duration);
  const { fps, accentColor, textColor } = { ...theme };
  const scale = spring({ frame, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <h1
        style={{
          fontSize: 96,
          fontWeight: 900,
          color: textColor,
          fontFamily: "'Inter', system-ui, sans-serif",
          transform: `scale(${scale})`,
          textAlign: "center",
          margin: 0,
        }}
      >
        {text}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: 36,
            color: accentColor,
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 500,
            marginTop: 20,
            opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {subtitle}
        </p>
      )}
    </AbsoluteFill>
  );
};

/* ─────────────────────────────────────────────
   Scene: Terminal
   Props: command, output, title (optional window title)
   ───────────────────────────────────────────── */

const TerminalScene = ({ command = "", output = "", title = "Terminal", theme, duration }) => {
  const { frame, opacity } = useTransition(duration);
  const { fps, accentColor, textColor } = { ...theme };

  // Type out command character by character
  const charsPerFrame = 1.5;
  const typedChars = Math.min(Math.floor(frame * charsPerFrame), command.length);
  const typedCommand = command.slice(0, typedChars);
  const cursorVisible = frame % 30 < 20;
  const showCursor = typedChars < command.length;

  // Output appears after command is typed
  const commandDoneFrame = Math.ceil(command.length / charsPerFrame) + 10;
  const outputOpacity = interpolate(frame, [commandDoneFrame, commandDoneFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const windowY = interpolate(frame, [0, 20], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        transform: `translateY(${windowY}px)`,
      }}
    >
      <div
        style={{
          width: 1400,
          minHeight: 400,
          backgroundColor: "#1a1a2e",
          borderRadius: 16,
          border: `1px solid ${accentColor}44`,
          overflow: "hidden",
          boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            height: 44,
            backgroundColor: "#0d0d1a",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#ff5f57" }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#febc2e" }} />
          <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#28c840" }} />
          <span style={{ marginLeft: 16, color: "#666", fontSize: 14, fontFamily: "monospace" }}>
            {title}
          </span>
        </div>
        {/* Terminal body */}
        <div style={{ padding: "30px 40px", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
          <div style={{ display: "flex", fontSize: 22, lineHeight: 1.6 }}>
            <span style={{ color: "#28c840", marginRight: 12 }}>❯</span>
            <span style={{ color: "#e2e8f0" }}>{typedCommand}</span>
            {showCursor && cursorVisible && (
              <span
                style={{
                  display: "inline-block",
                  width: 12,
                  height: 26,
                  backgroundColor: accentColor,
                  marginLeft: 2,
                }}
              />
            )}
          </div>
          {output && (
            <div
              style={{
                marginTop: 20,
                opacity: outputOpacity,
                fontSize: 20,
                lineHeight: 1.8,
                color: "#a0aec0",
                whiteSpace: "pre-wrap",
              }}
            >
              {output}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────────────────────────────────────
   Scene: Code
   Props: code, language, filename, highlights (array of line numbers)
   ───────────────────────────────────────────── */

const CodeScene = ({
  code = "",
  language = "javascript",
  filename = "",
  highlights = [],
  theme,
  duration,
}) => {
  const { frame, opacity } = useTransition(duration);
  const { accentColor, textColor } = theme;
  const lines = code.split("\n");

  // Reveal lines progressively
  const linesPerSecond = 3;
  const visibleLines = Math.min(
    Math.floor((frame / 30) * linesPerSecond) + 1,
    lines.length
  );

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div
        style={{
          width: 1400,
          backgroundColor: "#1e1e2e",
          borderRadius: 16,
          border: `1px solid ${accentColor}33`,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* File tab */}
        <div
          style={{
            height: 44,
            backgroundColor: "#181825",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <span style={{ color: accentColor, fontSize: 14, fontFamily: "monospace" }}>
            {filename || `code.${language}`}
          </span>
        </div>
        {/* Code body */}
        <div style={{ padding: "20px 0", maxHeight: 600, overflow: "hidden" }}>
          {lines.slice(0, visibleLines).map((line, i) => {
            const isHighlighted = highlights.includes(i + 1);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  padding: "2px 24px",
                  backgroundColor: isHighlighted ? `${accentColor}22` : "transparent",
                  borderLeft: isHighlighted ? `3px solid ${accentColor}` : "3px solid transparent",
                }}
              >
                <span
                  style={{
                    color: "#585b70",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 18,
                    width: 50,
                    textAlign: "right",
                    marginRight: 20,
                    userSelect: "none",
                  }}
                >
                  {i + 1}
                </span>
                <span
                  style={{
                    color: isHighlighted ? "#e2e8f0" : "#cdd6f4",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 18,
                    whiteSpace: "pre",
                  }}
                >
                  {line}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────────────────────────────────────
   Scene: Feature Grid
   Props: title, items: [{ icon, label, desc }]
   ───────────────────────────────────────────── */

const FeatureGridScene = ({ title = "", items = [], theme, duration }) => {
  const { frame, opacity } = useTransition(duration);
  const { fps, accentColor, textColor } = theme;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      {title && (
        <h2
          style={{
            position: "absolute",
            top: 180,
            fontSize: 48,
            fontWeight: 700,
            color: textColor,
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {title}
        </h2>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 40,
          justifyContent: "center",
          maxWidth: 1400,
          marginTop: title ? 60 : 0,
        }}
      >
        {items.map((item, i) => {
          const itemScale = spring({
            frame: frame - 15 - i * 8,
            fps,
            config: { damping: 10, stiffness: 120 },
          });
          return (
            <div
              key={i}
              style={{
                width: 280,
                padding: "32px 24px",
                backgroundColor: `${accentColor}11`,
                border: `1px solid ${accentColor}33`,
                borderRadius: 16,
                textAlign: "center",
                transform: `scale(${itemScale})`,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>{item.icon}</div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: textColor,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  marginBottom: 8,
                }}
              >
                {item.label}
              </div>
              {item.desc && (
                <div
                  style={{
                    fontSize: 16,
                    color: `${textColor}99`,
                    fontFamily: "'Inter', system-ui, sans-serif",
                  }}
                >
                  {item.desc}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────────────────────────────────────
   Scene: Diagram (flow/pipeline visualization)
   Props: title, steps: [{ label, icon }], direction ("horizontal"|"vertical")
   ───────────────────────────────────────────── */

const DiagramScene = ({
  title = "",
  steps = [],
  direction = "horizontal",
  theme,
  duration,
}) => {
  const { frame, opacity } = useTransition(duration);
  const { fps, accentColor, textColor } = theme;
  const isHorizontal = direction === "horizontal";

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      {title && (
        <h2
          style={{
            position: "absolute",
            top: 180,
            fontSize: 42,
            fontWeight: 700,
            color: textColor,
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {title}
        </h2>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: isHorizontal ? "row" : "column",
          alignItems: "center",
          gap: 0,
          marginTop: title ? 40 : 0,
        }}
      >
        {steps.map((step, i) => {
          const reveal = spring({
            frame: frame - 20 - i * 15,
            fps,
            config: { damping: 12 },
          });
          const showArrow = i < steps.length - 1;
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  transform: `scale(${reveal})`,
                  opacity: reveal,
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 24,
                    backgroundColor: `${accentColor}22`,
                    border: `2px solid ${accentColor}`,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: 48,
                  }}
                >
                  {step.icon || "•"}
                </div>
                <span
                  style={{
                    marginTop: 16,
                    fontSize: 20,
                    fontWeight: 600,
                    color: textColor,
                    fontFamily: "'Inter', system-ui, sans-serif",
                    textAlign: "center",
                    maxWidth: 140,
                  }}
                >
                  {step.label}
                </span>
              </div>
              {showArrow && (
                <div
                  style={{
                    color: accentColor,
                    fontSize: 36,
                    margin: isHorizontal ? "0 20px" : "12px 0",
                    opacity: reveal,
                  }}
                >
                  {isHorizontal ? "→" : "↓"}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────────────────────────────────────
   Scene: Text Highlight (big statement + optional subtext)
   Props: text, subtext
   ───────────────────────────────────────────── */

const TextHighlightScene = ({ text = "", subtext = "", theme, duration }) => {
  const { frame, opacity } = useTransition(duration);
  const { fps, accentColor, textColor } = theme;
  const scale = spring({ frame, fps, config: { damping: 14, stiffness: 80 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
        padding: "0 120px",
      }}
    >
      <h2
        style={{
          fontSize: 64,
          fontWeight: 800,
          color: textColor,
          fontFamily: "'Inter', system-ui, sans-serif",
          textAlign: "center",
          lineHeight: 1.2,
          transform: `scale(${scale})`,
        }}
      >
        {text}
      </h2>
      {subtext && (
        <p
          style={{
            fontSize: 28,
            color: `${textColor}88`,
            fontFamily: "'Inter', system-ui, sans-serif",
            textAlign: "center",
            marginTop: 24,
            opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          {subtext}
        </p>
      )}
    </AbsoluteFill>
  );
};

/* ─────────────────────────────────────────────
   Scene: Split (left text + right visual)
   Props: text, subtext, rightType ("terminal"|"code"|"image"), rightProps
   ───────────────────────────────────────────── */

const SplitScene = ({
  text = "",
  subtext = "",
  rightType = "terminal",
  rightProps = {},
  theme,
  duration,
}) => {
  const { frame, opacity } = useTransition(duration);
  const { fps, accentColor, textColor } = theme;

  const leftSlide = interpolate(frame, [0, 20], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightSlide = interpolate(frame, [5, 25], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "row", opacity }}>
      {/* Left: text */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 80px",
          transform: `translateX(${leftSlide}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: textColor,
            fontFamily: "'Inter', system-ui, sans-serif",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {text}
        </h2>
        {subtext && (
          <p
            style={{
              fontSize: 22,
              color: `${textColor}88`,
              fontFamily: "'Inter', system-ui, sans-serif",
              marginTop: 16,
              lineHeight: 1.5,
            }}
          >
            {subtext}
          </p>
        )}
      </div>
      {/* Right: visual */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `translateX(${rightSlide}px)`,
          padding: "40px",
        }}
      >
        <MiniVisual type={rightType} props={rightProps} theme={theme} />
      </div>
    </AbsoluteFill>
  );
};

/** Inline mini-visual for split scenes */
const MiniVisual = ({ type, props = {}, theme }) => {
  const { accentColor } = theme;

  if (type === "terminal") {
    return (
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          backgroundColor: "#1a1a2e",
          borderRadius: 12,
          border: `1px solid ${accentColor}44`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: 36,
            backgroundColor: "#0d0d1a",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            gap: 6,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#ff5f57" }} />
          <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#febc2e" }} />
          <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#28c840" }} />
        </div>
        <div style={{ padding: "20px 24px", fontFamily: "monospace", fontSize: 16, color: "#e2e8f0" }}>
          {props.command && (
            <div>
              <span style={{ color: "#28c840" }}>❯ </span>
              {props.command}
            </div>
          )}
          {props.output && (
            <div style={{ color: "#a0aec0", marginTop: 10, whiteSpace: "pre-wrap" }}>
              {props.output}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (type === "image" && props.src) {
    return (
      <img
        src={props.src}
        style={{ maxWidth: "100%", maxHeight: 500, borderRadius: 12 }}
      />
    );
  }

  return null;
};

/* ─────────────────────────────────────────────
   Scene: Stats (big number callouts)
   Props: title, stats: [{ value, label }]
   ───────────────────────────────────────────── */

const StatsScene = ({ title = "", stats = [], theme, duration }) => {
  const { frame, opacity } = useTransition(duration);
  const { fps, accentColor, textColor } = theme;

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      {title && (
        <h2
          style={{
            position: "absolute",
            top: 200,
            fontSize: 42,
            fontWeight: 700,
            color: textColor,
            fontFamily: "'Inter', system-ui, sans-serif",
          }}
        >
          {title}
        </h2>
      )}
      <div style={{ display: "flex", gap: 80, marginTop: title ? 40 : 0 }}>
        {stats.map((stat, i) => {
          const scale = spring({
            frame: frame - 10 - i * 10,
            fps,
            config: { damping: 10 },
          });
          return (
            <div key={i} style={{ textAlign: "center", transform: `scale(${scale})` }}>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: accentColor,
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: `${textColor}88`,
                  fontFamily: "'Inter', system-ui, sans-serif",
                  marginTop: 8,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ─────────────────────────────────────────────
   Scene: CTA (call to action)
   Props: text, subtitle, buttonText, buttonUrl
   ───────────────────────────────────────────── */

const CTAScene = ({ text = "", subtitle = "", buttonText = "", theme, duration }) => {
  const { frame, opacity } = useTransition(duration);
  const { fps, accentColor, textColor } = theme;
  const scale = spring({ frame: frame - 5, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity }}>
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <h2
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: textColor,
            fontFamily: "'Inter', system-ui, sans-serif",
            margin: 0,
          }}
        >
          {text}
        </h2>
        {subtitle && (
          <p
            style={{
              fontSize: 32,
              color: accentColor,
              fontFamily: "'Inter', system-ui, sans-serif",
              marginTop: 20,
            }}
          >
            {subtitle}
          </p>
        )}
        {buttonText && (
          <div
            style={{
              marginTop: 40,
              padding: "16px 48px",
              backgroundColor: accentColor,
              borderRadius: 12,
              display: "inline-block",
            }}
          >
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: textColor,
                fontFamily: "'Inter', system-ui, sans-serif",
              }}
            >
              {buttonText}
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
