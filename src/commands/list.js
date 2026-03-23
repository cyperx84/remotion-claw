import { TEMPLATES } from '../utils/templates.js';
import { listThemes } from '../../templates/shared/themes.js';

export async function listCommand() {
  console.log('\n📹 Available rclaw templates:\n');
  for (const [key, t] of Object.entries(TEMPLATES)) {
    console.log(`  ${key}`);
    console.log(`    ${t.description}`);
    console.log(`    ${t.width}x${t.height} @ ${t.fps}fps, ${t.durationInFrames / t.fps}s default`);
    console.log(`    Composition: ${t.compositionId}`);
    if (t.variants) {
      console.log(`    Variants: ${t.variants.join(', ')}`);
    }
    console.log('');
  }

  console.log('🎨 Available themes (use with --theme):\n');
  const themes = listThemes();
  for (const t of themes) {
    const fx = t.effects.length > 0 ? t.effects.join(', ') : 'none';
    console.log(`  ${t.id.padEnd(12)} ${t.name.padEnd(10)} accent:${t.accent}  effects:[${fx}]  transition:${t.transition}`);
  }
  console.log('\n  Example: rclaw create "my video" --theme glitch');
  console.log('  Themes apply to ANY template — colors, effects, and typography change.\n');
}
