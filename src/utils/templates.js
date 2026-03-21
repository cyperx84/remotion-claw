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
