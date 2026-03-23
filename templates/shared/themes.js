/**
 * Theme definitions for rclaw.
 * Each theme provides: colors, typography, effects config, and transition style.
 * Templates read theme props and apply them — themes are composable with any template.
 */

export const THEMES = {
  default: {
    name: "Default",
    colors: {
      background: "#1a1a2e",
      accent: "#e94560",
      secondary: "#533483",
      text: "#ffffff",
      muted: "#ffffff99",
    },
    font: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
      mono: "monospace",
    },
    effects: {
      particles: false,
      scanlines: false,
      glitch: false,
      noise: false,
      glow: false,
    },
    transition: "fade", // fade | glitch-cut | wipe | dissolve
  },

  glitch: {
    name: "Glitch",
    colors: {
      background: "#050505",
      accent: "#00FFFF",
      secondary: "#FF003C",
      text: "#ffffff",
      muted: "#ffffffbb",
    },
    font: {
      heading: "monospace",
      body: "monospace",
      mono: "monospace",
    },
    effects: {
      particles: { count: 50, colors: ["#00FFFF", "#FF003C", "#FF00FF", "#ffffff"], speed: 1.2, glow: true, opacity: 0.5 },
      scanlines: { lineOpacity: 0.06, noiseOpacity: 0.03, scanSpeed: 0.5 },
      glitch: { intensity: 1.5, flickerSpeed: 0.15 },
      noise: true,
      glow: true,
      screenShake: true,
    },
    transition: "glitch-cut",
    extras: {
      cornerInfo: true,    // frame counter, hex codes
      chromaticText: true,  // chromatic aberration on headings
    },
  },

  neon: {
    name: "Neon",
    colors: {
      background: "#0a0015",
      accent: "#ff6ec7",
      secondary: "#7b68ee",
      text: "#ffffff",
      muted: "#ffffffcc",
    },
    font: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
      mono: "monospace",
    },
    effects: {
      particles: { count: 25, colors: ["#ff6ec7", "#7b68ee", "#ffffff"], speed: 0.4, glow: true, opacity: 0.4, minSize: 2, maxSize: 5 },
      scanlines: false,
      glitch: false,
      noise: false,
      glow: true,
      gradientOrbs: true,
      borderGlow: true,
    },
    transition: "dissolve",
  },

  terminal: {
    name: "Terminal",
    colors: {
      background: "#0a0a0a",
      accent: "#33ff33",
      secondary: "#33ff33",
      text: "#33ff33",
      muted: "#33ff3399",
    },
    font: {
      heading: "'Courier New', monospace",
      body: "'Courier New', monospace",
      mono: "'Courier New', monospace",
    },
    effects: {
      particles: false,
      scanlines: { lineOpacity: 0.1, noiseOpacity: 0.02, scanSpeed: 0.3, lineSpacing: 3 },
      glitch: false,
      noise: false,
      glow: true,
      crtVignette: true,
      typewriter: true,
      bootSequence: true,
    },
    transition: "fade",
    extras: {
      prompt: "root@claw:~$",
      terminalChrome: true,
    },
  },

  minimal: {
    name: "Minimal",
    colors: {
      background: "#fafafa",
      accent: "#000000",
      secondary: "#666666",
      text: "#111111",
      muted: "#11111199",
    },
    font: {
      heading: "'Inter', 'Helvetica Neue', sans-serif",
      body: "'Inter', sans-serif",
      mono: "monospace",
    },
    effects: {
      particles: false,
      scanlines: false,
      glitch: false,
      noise: false,
      glow: false,
      circleReveal: true,
      geometricAccents: true,
    },
    transition: "wipe",
  },

  fire: {
    name: "Fire",
    colors: {
      background: "#0d0000",
      accent: "#ff4500",
      secondary: "#ff8c00",
      text: "#ffffff",
      muted: "#ffffffcc",
    },
    font: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
      mono: "monospace",
    },
    effects: {
      particles: { count: 60, colors: ["#ff4500", "#ff8c00", "#ffcc00", "#ff003c"], speed: 1.5, glow: true, opacity: 0.6, minSize: 2, maxSize: 8 },
      scanlines: false,
      glitch: false,
      noise: false,
      glow: true,
      ember: true,
    },
    transition: "fade",
  },

  ice: {
    name: "Ice",
    colors: {
      background: "#040820",
      accent: "#88ccff",
      secondary: "#4488cc",
      text: "#e8f4ff",
      muted: "#e8f4ffaa",
    },
    font: {
      heading: "Inter, system-ui, sans-serif",
      body: "Inter, system-ui, sans-serif",
      mono: "monospace",
    },
    effects: {
      particles: { count: 35, colors: ["#88ccff", "#ffffff", "#aaddff", "#4488cc"], speed: 0.3, glow: true, opacity: 0.5, minSize: 1, maxSize: 4 },
      scanlines: false,
      glitch: false,
      noise: false,
      glow: true,
      frost: true,
    },
    transition: "dissolve",
  },
};

/**
 * Resolve a theme by name. Falls back to "default".
 */
export function getTheme(name) {
  if (!name || name === "default") return THEMES.default;
  const theme = THEMES[name.toLowerCase()];
  if (!theme) {
    console.warn(`⚠️  Unknown theme "${name}", falling back to default. Available: ${Object.keys(THEMES).join(", ")}`);
    return THEMES.default;
  }
  return theme;
}

/**
 * Merge theme props into template inputProps.
 * Theme values become defaults; explicit props override.
 */
export function applyTheme(theme, props) {
  return {
    // Theme color defaults
    background: props.background || theme.colors.background,
    accentColor: props.accentColor || theme.colors.accent,
    secondaryColor: props.secondaryColor || theme.colors.secondary,
    textColor: props.textColor || theme.colors.text,
    // Theme metadata (templates can read these)
    _theme: theme.name.toLowerCase(),
    _effects: theme.effects,
    _fonts: theme.font,
    _transition: theme.transition,
    _extras: theme.extras || {},
    // Pass through all other props
    ...props,
  };
}

/**
 * List available themes (for CLI help).
 */
export function listThemes() {
  return Object.entries(THEMES).map(([id, t]) => ({
    id,
    name: t.name,
    accent: t.colors.accent,
    effects: Object.entries(t.effects)
      .filter(([, v]) => v)
      .map(([k]) => k),
    transition: t.transition,
  }));
}
