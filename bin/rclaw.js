#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { renderCommand } from '../src/commands/render.js';
import { listCommand } from '../src/commands/list.js';
import { createCommand } from '../src/commands/create.js';
import { initCommand } from '../src/commands/init.js';
import { ttsCommand } from '../src/commands/tts.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));

const program = new Command();

program
  .name('rclaw')
  .description('Remotion video generation CLI for AI agents')
  .version(pkg.version);

program
  .command('init [dir]')
  .description('Initialize a new Remotion project with rclaw templates')
  .option('--template <name>', 'Base template to use', 'all')
  .action(initCommand);

program
  .command('create <description>')
  .description('Create a video from a natural language description')
  .option('-t, --template <name>', 'Template: social-clip, data-viz, announcement, product-demo')
  .option('-o, --output <path>', 'Output file path', 'out/video.mp4')
  .option('--props <json>', 'JSON props to pass to the composition')
  .option('--props-file <path>', 'Path to JSON props file')
  .option('--duration <seconds>', 'Video duration in seconds', '30')
  .option('--tts <text>', 'Generate TTS voiceover from text')
  .option('--tts-provider <provider>', 'TTS provider: chatterbox (default), openai, elevenlabs', 'chatterbox')
  .option('--voice <voice>', 'TTS voice name (openai/elevenlabs)', 'auto')
  .option('--voice-prompt <path>', 'Voice reference audio (chatterbox)')
  .option('--exaggeration <n>', 'Expressiveness 0-1 (chatterbox)')
  .option('--cfg-weight <n>', 'Voice adherence 0-1 (chatterbox)')
  .option('--width <px>', 'Video width')
  .option('--height <px>', 'Video height')
  .option('--fps <n>', 'Frames per second', '30')
  .action(createCommand);

program
  .command('render <composition>')
  .description('Render a specific composition from the project')
  .option('-o, --output <path>', 'Output file path', 'out/video.mp4')
  .option('--props <json>', 'JSON props string')
  .option('--props-file <path>', 'Path to JSON props file')
  .option('--codec <codec>', 'Video codec', 'h264')
  .option('--width <px>', 'Video width')
  .option('--height <px>', 'Video height')
  .option('--fps <n>', 'Frames per second')
  .option('--crf <n>', 'Constant rate factor (quality)')
  .option('--concurrency <n>', 'Render concurrency')
  .action(renderCommand);

program
  .command('list')
  .description('List available templates and compositions')
  .action(listCommand);

program
  .command('tts <text>')
  .description('Generate TTS audio file (default: Chatterbox local voice clone)')
  .option('-o, --output <path>', 'Output audio path', 'out/voiceover.wav')
  .option('--provider <provider>', 'TTS provider: chatterbox (default), openai, elevenlabs', 'chatterbox')
  .option('--voice <voice>', 'Voice name (openai/elevenlabs)', 'auto')
  .option('--voice-prompt <path>', 'Path to voice reference audio (chatterbox)')
  .option('--exaggeration <n>', 'Expressiveness 0-1 (chatterbox, default 0.5)')
  .option('--cfg-weight <n>', 'Voice adherence 0-1 (chatterbox, default 0.5)')
  .action(ttsCommand);

program.parse();
