import { generateTTS } from '../tts/generate.js';

export async function ttsCommand(text, options) {
  const provider = options.provider;
  const isChatterbox = provider === 'chatterbox';

  console.log(`\n🔊 Generating TTS audio...`);
  console.log(`   Provider: ${provider}${isChatterbox ? ' (local voice clone)' : ''}`);
  if (!isChatterbox) console.log(`   Voice: ${options.voice}`);
  console.log(`   Text: "${text.substring(0, 80)}${text.length > 80 ? '...' : ''}"`);

  try {
    const outPath = await generateTTS(text, {
      output: options.output,
      provider: options.provider,
      voice: options.voice,
      voicePrompt: options.voicePrompt,
      exaggeration: options.exaggeration ? parseFloat(options.exaggeration) : undefined,
      cfgWeight: options.cfgWeight ? parseFloat(options.cfgWeight) : undefined,
      seed: options.seed ? parseInt(options.seed, 10) : undefined,
    });
    console.log(`\n✅ Audio saved: ${outPath}`);
  } catch (err) {
    console.error(`\n❌ TTS failed: ${err.message}`);
    process.exit(1);
  }
}
