import { TEMPLATES } from '../utils/templates.js';

export async function listCommand() {
  console.log('\n📹 Available rclaw templates:\n');
  for (const [key, t] of Object.entries(TEMPLATES)) {
    console.log(`  ${key}`);
    console.log(`    ${t.description}`);
    console.log(`    ${t.width}x${t.height} @ ${t.fps}fps, ${t.durationInFrames / t.fps}s default`);
    console.log(`    Composition: ${t.compositionId}`);
    console.log('');
  }
}
