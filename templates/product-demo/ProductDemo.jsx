import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

export const ProductDemo = ({
  title = "Product Name",
  tagline = "Built for builders.",
  features = ["Fast", "Simple", "Powerful"],
  background = "#0a0a1a",
  accentColor = "#7c3aed",
  textColor = "#ffffff",
  screenshotUrl = "",
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Scene 1: Title card (0-90 frames / 0-3s)
  // Scene 2: Features (90-300 frames / 3-10s)
  // Scene 3: Screenshot/demo (300-600 frames / 10-20s)
  // Scene 4: CTA (600-900 frames / 20-30s)

  const fadeOut = interpolate(frame, [durationInFrames - 30, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background, opacity: fadeOut }}>
      {/* Gradient background */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${background} 0%, ${accentColor}22 100%)`,
        }}
      />

      {/* Scene 1: Title card */}
      <Sequence from={0} durationInFrames={120}>
        <TitleScene
          title={title}
          tagline={tagline}
          accentColor={accentColor}
          textColor={textColor}
          fps={fps}
        />
      </Sequence>

      {/* Scene 2: Features */}
      <Sequence from={90} durationInFrames={240}>
        <FeaturesScene
          features={features}
          accentColor={accentColor}
          textColor={textColor}
          fps={fps}
        />
      </Sequence>

      {/* Scene 3: Main content area */}
      <Sequence from={300} durationInFrames={330}>
        <ContentScene
          title={title}
          screenshotUrl={screenshotUrl}
          accentColor={accentColor}
          textColor={textColor}
          fps={fps}
        />
      </Sequence>

      {/* Scene 4: CTA */}
      <Sequence from={630} durationInFrames={270}>
        <CTAScene
          title={title}
          tagline={tagline}
          accentColor={accentColor}
          textColor={textColor}
          fps={fps}
        />
      </Sequence>
    </AbsoluteFill>
  );
};

const TitleScene = ({ title, tagline, accentColor, textColor, fps }) => {
  const frame = useCurrentFrame();
  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const taglineOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [90, 120], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOpacity,
      }}
    >
      <h1
        style={{
          fontSize: 96,
          fontWeight: 900,
          color: textColor,
          transform: `scale(${titleScale})`,
          fontFamily: "Inter, system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontSize: 36,
          color: accentColor,
          opacity: taglineOpacity,
          marginTop: 20,
          fontFamily: "Inter, system-ui, sans-serif",
          fontWeight: 500,
        }}
      >
        {tagline}
      </p>
    </AbsoluteFill>
  );
};

const FeaturesScene = ({ features, accentColor, textColor, fps }) => {
  const frame = useCurrentFrame();
  const enterOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [200, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: enterOpacity * exitOpacity,
      }}
    >
      <div style={{ display: "flex", gap: 60 }}>
        {features.map((feature, i) => {
          const featureScale = spring({
            frame: frame - 30 - i * 20,
            fps,
            config: { damping: 10, stiffness: 100 },
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                transform: `scale(${featureScale})`,
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 20,
                  backgroundColor: `${accentColor}33`,
                  border: `2px solid ${accentColor}`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: 36,
                  marginBottom: 20,
                }}
              >
                {["⚡", "✨", "🚀", "🔧", "💡"][i % 5]}
              </div>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: textColor,
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                {feature}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const ContentScene = ({ title, screenshotUrl, accentColor, textColor, fps }) => {
  const frame = useCurrentFrame();
  const enterY = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: "clamp" });
  const enterOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const exitOpacity = interpolate(frame, [290, 330], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: enterOpacity * exitOpacity,
        transform: `translateY(${enterY}px)`,
      }}
    >
      {/* Mock app window */}
      <div
        style={{
          width: 1200,
          height: 700,
          backgroundColor: "#1a1a2e",
          borderRadius: 16,
          border: `1px solid ${accentColor}44`,
          overflow: "hidden",
          boxShadow: `0 20px 60px ${accentColor}22`,
        }}
      >
        {/* Window title bar */}
        <div
          style={{
            height: 40,
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
          <span
            style={{
              marginLeft: 16,
              color: "#666",
              fontSize: 14,
              fontFamily: "monospace",
            }}
          >
            {title}
          </span>
        </div>

        {/* Content area */}
        <div
          style={{
            padding: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100% - 40px)",
          }}
        >
          {screenshotUrl ? (
            <img
              src={screenshotUrl}
              style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 8 }}
            />
          ) : (
            <div
              style={{
                textAlign: "center",
                color: `${textColor}66`,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              <p style={{ fontSize: 32, marginBottom: 10 }}>
                {title}
              </p>
              <p style={{ fontSize: 18, color: `${textColor}44` }}>
                Add screenshotUrl prop to show your app
              </p>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const CTAScene = ({ title, tagline, accentColor, textColor, fps }) => {
  const frame = useCurrentFrame();
  const scale = spring({ frame: frame - 10, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity,
      }}
    >
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <h2
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: textColor,
            fontFamily: "Inter, system-ui, sans-serif",
            margin: 0,
          }}
        >
          Try {title}
        </h2>
        <p
          style={{
            fontSize: 32,
            color: accentColor,
            marginTop: 20,
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          {tagline}
        </p>
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
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Get Started →
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
