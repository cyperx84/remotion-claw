import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { resolveProps } from '../utils/resolve-props.js';

/**
 * Render a Remotion composition to video.
 */
export async function renderCommand(composition, options) {
  const output = options.output || 'out/video.mp4';
  const outDir = dirname(output);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const props = resolveProps(options);
  const args = ['npx', 'remotion', 'render', composition, output];

  if (Object.keys(props).length > 0) {
    // Write props to temp file to avoid shell escaping issues
    const propsFile = `${outDir}/.rclaw-props.json`;
    const { writeFileSync } = await import('fs');
    writeFileSync(propsFile, JSON.stringify(props));
    args.push('--props', propsFile);
  }

  if (options.codec) args.push('--codec', options.codec);
  if (options.width) args.push('--width', options.width);
  if (options.height) args.push('--height', options.height);
  if (options.fps) args.push('--fps', options.fps);
  if (options.crf) args.push('--crf', options.crf);
  if (options.concurrency) args.push('--concurrency', options.concurrency);

  const cmd = args.join(' ');
  console.log(`🎬 Rendering: ${cmd}`);

  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`\n✅ Rendered: ${output}`);
  } catch (err) {
    console.error(`\n❌ Render failed: ${err.message}`);
    process.exit(1);
  }
}

/**
 * Programmatic render — same as CLI but returns the output path.
 */
export async function renderVideo({ composition, output, props, codec, width, height, fps }) {
  await renderCommand(composition, {
    output,
    props: props ? JSON.stringify(props) : undefined,
    codec,
    width: width?.toString(),
    height: height?.toString(),
    fps: fps?.toString(),
  });
  return output;
}
