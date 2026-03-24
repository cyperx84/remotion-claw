import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, copyFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { getTemplate, TEMPLATES } from '../utils/templates.js';
import { resolveProps } from '../utils/resolve-props.js';
import { buildCreateProps } from '../utils/create-default-props.js';
import { generateTTS } from '../tts/generate.js';
import { getAudioDuration } from '../utils/audio.js';
import { getTheme, applyTheme } from '../../templates/shared/themes.js';
import { acquireRenderLock, checkDuration, clampConcurrency, getChromeFlags, preflight } from '../utils/guards.js';

/**
 * Infer template from natural language description.
 */
function inferTemplate(description) {
  const d = description.toLowerCase();

  // Style-specific social clip variants
  if (d.includes('glitch') || d.includes('cyber') || d.includes('chaos')) {
    return 'social-glitch';
  }
  if (d.includes('neon') || d.includes('glow') || d.includes('dreamy')) {
    return 'social-neon';
  }
  if (d.includes('terminal') || d.includes('crt') || d.includes('hacker') || d.includes('cli')) {
    return 'social-terminal';
  }
  if (d.includes('minimal') || d.includes('clean') || d.includes('modern') || d.includes('apple')) {
    return 'social-minimal';
  }
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
  if (d.includes('narrat') || d.includes('scene') || d.includes('explainer') || d.includes('overview') || d.includes('walkthrough video') || d.includes('voiceover')) {
    return 'narration';
  }
  return 'announcement';
}

/**
 * Infer theme from description keywords.
 */
function inferTheme(description) {
  const d = description.toLowerCase();
  if (d.includes('glitch') || d.includes('cyber') || d.includes('chaos') || d.includes('hack')) return 'glitch';
  if (d.includes('neon') || d.includes('glow') || d.includes('dream') || d.includes('vaporwave')) return 'neon';
  if (d.includes('terminal') || d.includes('crt') || d.includes('hacker') || d.includes('cli') || d.includes('matrix')) return 'terminal';
  if (d.includes('minimal') || d.includes('clean') || d.includes('modern') || d.includes('simple') || d.includes('apple')) return 'minimal';
  if (d.includes('fire') || d.includes('flame') || d.includes('hot') || d.includes('ember')) return 'fire';
  if (d.includes('ice') || d.includes('frost') || d.includes('cold') || d.includes('frozen') || d.includes('snow')) return 'ice';
  return null; // no theme detected — use default
}

export async function createCommand(description, options) {
  const force = options.force || false;

  // ── Pre-flight safety checks ────────────────────
  let unlock;
  try {
    unlock = preflight({ force, duration: options.duration ? parseInt(options.duration, 10) : undefined });
  } catch (err) {
    console.error(`\n🛑 ${err.message}`);
    process.exit(1);
  }

  try {
  const templateName = options.template || inferTemplate(description);
  const template = getTemplate(templateName);

  // Resolve theme: explicit --theme > inferred from description > default
  const themeName = options.theme || inferTheme(description) || 'default';
  const theme = getTheme(themeName);

  console.log(`\n🎬 Creating video: "${description}"`);
  console.log(`📐 Template: ${template.name} (${template.width}x${template.height})`);
  if (themeName !== 'default') {
    console.log(`🎨 Theme: ${theme.name}`);
  }

  // Resolve props from CLI and apply template-specific defaults
  let props = resolveProps(options);
  props = buildCreateProps(templateName, description, props, options);

  // Apply theme — theme colors/effects become defaults, explicit props override
  props = applyTheme(theme, props);

  const fps = parseInt(options.fps || template.fps.toString(), 10);

  // ── TTS Pipeline ──────────────────────────────────
  let audioPath = null;
  let audioDurationSec = 0;

  if (options.tts) {
    const ttsProvider = options.ttsProvider || 'chatterbox';
    const ext = ttsProvider === 'chatterbox' ? '.wav' : '.mp3';
    const output = options.output || 'out/video.mp4';

    console.log(`\n🔊 Generating TTS voiceover...`);
    audioPath = resolve(dirname(output), `voiceover${ext}`);

    await generateTTS(options.tts, {
      output: audioPath,
      provider: ttsProvider,
      voice: options.voice || 'auto',
      voicePrompt: options.voicePrompt,
      exaggeration: options.exaggeration ? parseFloat(options.exaggeration) : undefined,
      cfgWeight: options.cfgWeight ? parseFloat(options.cfgWeight) : undefined,
      seed: options.seed ? parseInt(options.seed, 10) : undefined,
    });

    // Detect audio duration and auto-size video
    audioDurationSec = getAudioDuration(audioPath);
    console.log(`✅ TTS saved: ${audioPath} (${audioDurationSec.toFixed(1)}s)`);

    // Copy audio to public/ so Remotion can serve it via staticFile()
    const publicDir = resolve(dirname(template.entryPoint), '..', '..', 'public');
    if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });
    const audioFilename = `voiceover-${Date.now()}${audioPath.match(/\.[^.]+$/)?.[0] || '.wav'}`;
    copyFileSync(audioPath, resolve(publicDir, audioFilename));
    props.audioSrc = audioFilename;
    console.log(`📁 Audio staged: public/${audioFilename}`);
  }

  // ── Duration Calculation ──────────────────────────
  // Priority: explicit --duration > audio duration + padding > template default
  let durationSec;
  if (options.duration) {
    durationSec = parseInt(options.duration, 10);
  } else if (audioDurationSec > 0) {
    // Add 2s padding (1s lead-in + 1s fade-out)
    durationSec = Math.ceil(audioDurationSec) + 2;
    console.log(`⏱️  Auto-duration: ${durationSec}s (audio ${audioDurationSec.toFixed(1)}s + 2s padding)`);
  } else {
    durationSec = Math.ceil(template.durationInFrames / fps);
  }

  const durationInFrames = durationSec * fps;

  // ── Output Setup ──────────────────────────────────
  const output = options.output || 'out/video.mp4';
  const outDir = dirname(output);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  // Pass duration to Remotion template via props
  props.durationInFrames = durationInFrames;

  // Write props file for Remotion
  const propsFile = resolve(outDir, '.rclaw-props.json');
  writeFileSync(propsFile, JSON.stringify(props, null, 2));

  // ── Render ────────────────────────────────────────
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

  // 4. Concurrency cap
  const concurrency = clampConcurrency(options.concurrency);
  args.push('--concurrency', concurrency);

  // 2. Chrome memory limits
  const chromeFlags = getChromeFlags();
  args.push('--browser-executable-args', chromeFlags.join(' '));

  const cmd = args.join(' ');
  console.log(`\n🎥 Rendering ${durationSec}s video (${durationInFrames} frames @ ${fps}fps)...`);
  console.log(`   Concurrency: ${concurrency} (max ${concurrency} parallel frames)`);
  console.log(`   Command: ${cmd}\n`);

  try {
    execSync(cmd, { stdio: 'inherit', maxBuffer: 50 * 1024 * 1024 });
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
  } finally {
    unlock();
  }
}
