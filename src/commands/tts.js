import { generateTTS } from '../tts/generate.js';

export async function ttsCommand(text, options) {
  console.log(`\n🔊 Generating TTS audio...`);
  console.log(`   Provider: ${options.provider}`);
  console.log(`   Voice: ${options.voice}`);
  console.log(`   Text: "${text.substring(0, 80)}${text.length > 80 ? '...' : ''}"`);

  try {
    const outPath = await generateTTS(text, {
      output: options.output,
      provider: options.provider,
      voice: options.voice,
    });
    console.log(`\n✅ Audio saved: ${outPath}`);
  } catch (err) {
    console.error(`\n❌ TTS failed: ${err.message}`);
    process.exit(1);
  }
}
