import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = join(__dirname, '..', '..', 'templates');

export const TEMPLATES = {
  'social-clip': {
    name: 'Social Clip',
    description: 'TikTok/Reels/Shorts format (9:16) — text overlays, backgrounds, transitions',
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 900, // 30s
    compositionId: 'SocialClip',
    entryPoint: join(TEMPLATES_DIR, 'social-clip', 'index.jsx'),
    variants: ['default', 'glitch', 'neon', 'terminal', 'minimal'],
  },
  'social-glitch': {
    name: 'Social Clip — Glitch',
    description: 'Cyberpunk glitch aesthetic (9:16) — chromatic aberration, scanlines, particles, kinetic text',
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 900,
    compositionId: 'GlitchClip',
    entryPoint: join(TEMPLATES_DIR, 'social-clip', 'variants', 'glitch-index.jsx'),
  },
  'social-neon': {
    name: 'Social Clip — Neon',
    description: 'Neon glow aesthetic (9:16) — glowing borders, dreamy particles, gradient orbs',
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 900,
    compositionId: 'NeonClip',
    entryPoint: join(TEMPLATES_DIR, 'social-clip', 'variants', 'neon-index.jsx'),
  },
  'social-terminal': {
    name: 'Social Clip — Terminal',
    description: 'Green-on-black CRT terminal (9:16) — typewriter text, blinking cursor, boot sequence',
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 900,
    compositionId: 'TerminalClip',
    entryPoint: join(TEMPLATES_DIR, 'social-clip', 'variants', 'terminal-index.jsx'),
  },
  'social-minimal': {
    name: 'Social Clip — Minimal',
    description: 'Clean modern aesthetic (9:16) — bold typography, circle reveal, geometric accents',
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 900,
    compositionId: 'MinimalClip',
    entryPoint: join(TEMPLATES_DIR, 'social-clip', 'variants', 'minimal-index.jsx'),
  },
  'data-viz': {
    name: 'Data Visualization',
    description: 'Animated charts, graphs, and data stories (16:9)',
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 300, // 10s
    compositionId: 'DataViz',
    entryPoint: join(TEMPLATES_DIR, 'data-viz', 'index.jsx'),
  },
  'announcement': {
    name: 'Announcement / Quote Card',
    description: 'Text-focused announcement or quote card video (1:1 or 16:9)',
    width: 1080,
    height: 1080,
    fps: 30,
    durationInFrames: 150, // 5s
    compositionId: 'Announcement',
    entryPoint: join(TEMPLATES_DIR, 'announcement', 'index.jsx'),
  },
  'product-demo': {
    name: 'Product Demo',
    description: 'App screenshots, feature highlights, product walkthrough (16:9)',
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 900, // 30s
    compositionId: 'ProductDemo',
    entryPoint: join(TEMPLATES_DIR, 'product-demo', 'index.jsx'),
  },
  'quote': {
    name: 'Quote / Testimonial',
    description: 'Bold quote or testimonial card (1:1) — centered quote, author attribution, accent styling',
    width: 1080,
    height: 1080,
    fps: 30,
    durationInFrames: 150, // 5s
    compositionId: 'Quote',
    entryPoint: join(TEMPLATES_DIR, 'quote', 'index.jsx'),
  },
  'comparison': {
    name: 'Comparison',
    description: 'Before/after or A vs B split view (16:9) — animated divider, staggered items',
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 300, // 10s
    compositionId: 'Comparison',
    entryPoint: join(TEMPLATES_DIR, 'comparison', 'index.jsx'),
  },
  'countdown': {
    name: 'Countdown / Listicle',
    description: 'Numbered listicle with big number reveals (9:16) — progress dots, per-item transitions',
    width: 1080,
    height: 1920,
    fps: 30,
    durationInFrames: 450, // 15s
    compositionId: 'Countdown',
    entryPoint: join(TEMPLATES_DIR, 'countdown', 'index.jsx'),
  },
  'tutorial': {
    name: 'Tutorial / Step-by-Step',
    description: 'Step-by-step walkthrough (16:9) — numbered steps, optional code blocks, progress bar',
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 600, // 20s
    compositionId: 'Tutorial',
    entryPoint: join(TEMPLATES_DIR, 'tutorial', 'index.jsx'),
  },
  'narration': {
    name: 'Narration',
    description: 'Scene-by-scene visuals synced to voiceover — terminal, code, diagrams, feature grids, stats, text highlights',
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 900, // overridden by scene durations
    compositionId: 'Narration',
    entryPoint: join(TEMPLATES_DIR, 'narration', 'index.jsx'),
  },
};

export function getTemplate(name) {
  const t = TEMPLATES[name];
  if (!t) {
    const available = Object.keys(TEMPLATES).join(', ');
    throw new Error(`Unknown template "${name}". Available: ${available}`);
  }
  return t;
}

export function resolveTemplatesDir() {
  return TEMPLATES_DIR;
}
