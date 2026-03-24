import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { resolveProps } from '../utils/resolve-props.js';
import { acquireRenderLock, clampConcurrency, getChromeFlags, preflight } from '../utils/guards.js';

/**
 * Render a Remotion composition to video.
 */
export async function renderCommand(composition, options) {
  const force = options.force || false;

  // ── Pre-flight safety checks ────────────────────
  let unlock;
  try {
    unlock = preflight({ force });
  } catch (err) {
    console.error(`\n🛑 ${err.message}`);
    process.exit(1);
  }

  try {
    const output = options.output || 'out/video.mp4';
    const outDir = dirname(output);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    const props = resolveProps(options);
    const args = ['npx', 'remotion', 'render', composition, output];

    if (Object.keys(props).length > 0) {
      const propsFile = `${outDir}/.rclaw-props.json`;
      writeFileSync(propsFile, JSON.stringify(props));
      args.push('--props', propsFile);
    }

    if (options.codec) args.push('--codec', options.codec);
    if (options.width) args.push('--width', options.width);
    if (options.height) args.push('--height', options.height);
    if (options.fps) args.push('--fps', options.fps);
    if (options.crf) args.push('--crf', options.crf);

    // 4. Concurrency cap
    const concurrency = clampConcurrency(options.concurrency);
    args.push('--concurrency', concurrency);

    // 2. Chrome memory limits
    const chromeFlags = getChromeFlags();
    args.push('--browser-executable-args', chromeFlags.join(' '));

    const cmd = args.join(' ');
    console.log(`🎬 Rendering: ${cmd}`);

    execSync(cmd, { stdio: 'inherit', maxBuffer: 50 * 1024 * 1024 });
    console.log(`\n✅ Rendered: ${output}`);
  } catch (err) {
    console.error(`\n❌ Render failed: ${err.message}`);
    process.exit(1);
  } finally {
    unlock();
  }
}

/**
 * Programmatic render — same as CLI but returns the output path.
 */
export async function renderVideo({ composition, output, props, codec, width, height, fps, concurrency }) {
  await renderCommand(composition, {
    output,
    props: props ? JSON.stringify(props) : undefined,
    codec,
    width: width?.toString(),
    height: height?.toString(),
    fps: fps?.toString(),
    concurrency: concurrency?.toString(),
  });
  return output;
}
