import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { getTemplate, TEMPLATES } from '../utils/templates.js';
import { resolveProps } from '../utils/resolve-props.js';
import { generateTTS } from '../tts/generate.js';

/**
 * Infer template from natural language description.
 */
function inferTemplate(description) {
  const d = description.toLowerCase();
  if (d.includes('tiktok') || d.includes('reel') || d.includes('short') || d.includes('social') || d.includes('9:16') || d.includes('vertical')) {
    return 'social-clip';
  }
  if (d.includes('chart') || d.includes('graph') || d.includes('data') || d.includes('viz') || d.includes('stats') || d.includes('metric')) {
    return 'data-viz';
  }
  if (d.includes('announce') || d.includes('quote') || d.includes('card') || d.includes('text')) {
    return 'announcement';
  }
  if (d.includes('product') || d.includes('demo') || d.includes('app') || d.includes('feature') || d.includes('walkthrough')) {
    return 'product-demo';
  }
  // Default to announcement for simple text-based videos
  return 'announcement';
}

export async function createCommand(description, options) {
  // Determine template
  const templateName = options.template || inferTemplate(description);
  const template = getTemplate(templateName);

  console.log(`\n🎬 Creating video: "${description}"`);
  console.log(`📐 Template: ${template.name} (${template.width}x${template.height})`);

  // Resolve props
  let props = resolveProps(options);
  props = {
    ...props,
    title: props.title || description,
    description: props.description || description,
  };

  // Calculate duration
  const durationSec = parseInt(options.duration || '30', 10);
  const fps = parseInt(options.fps || template.fps.toString(), 10);
  const durationInFrames = durationSec * fps;

  // Handle TTS
  let audioPath = null;
  if (options.tts) {
    const ttsProvider = options.ttsProvider || 'chatterbox';
    const ext = ttsProvider === 'chatterbox' ? '.wav' : '.mp3';
    console.log(`🔊 Generating TTS voiceover...`);
    audioPath = resolve(dirname(options.output), `voiceover${ext}`);
    await generateTTS(options.tts, {
      output: audioPath,
      provider: ttsProvider,
      voice: options.voice || 'auto',
      voicePrompt: options.voicePrompt,
      exaggeration: options.exaggeration ? parseFloat(options.exaggeration) : undefined,
      cfgWeight: options.cfgWeight ? parseFloat(options.cfgWeight) : undefined,
    });
    props.audioSrc = audioPath;
    console.log(`✅ TTS saved: ${audioPath}`);
  }

  // Set up output
  const output = options.output || 'out/video.mp4';
  const outDir = dirname(output);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  // Write props file
  const propsFile = resolve(outDir, '.rclaw-props.json');
  writeFileSync(propsFile, JSON.stringify(props, null, 2));

  // Build render command
  const width = options.width || template.width;
  const height = options.height || template.height;

  const args = [
    'npx', 'remotion', 'render',
    template.entryPoint,
    template.compositionId,
    output,
    '--props', propsFile,
    '--width', width,
    '--height', height,
    '--fps', fps,
  ];

  const cmd = args.join(' ');
  console.log(`\n🎥 Render command: ${cmd}\n`);

  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`\n✅ Video created: ${output}`);
    console.log(`   Template: ${templateName}`);
    console.log(`   Size: ${width}x${height}`);
    console.log(`   Duration: ${durationSec}s @ ${fps}fps`);
    if (audioPath) console.log(`   Audio: ${audioPath}`);
  } catch (err) {
    console.error(`\n❌ Render failed: ${err.message}`);
    console.error('\nTroubleshooting:');
    console.error('  1. Ensure Remotion deps are installed: npm install');
    console.error('  2. Check template exists: rclaw list');
    console.error('  3. Try rendering directly: npx remotion render <entry> <comp> out.mp4');
    process.exit(1);
  }
}
