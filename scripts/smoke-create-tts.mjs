#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join, resolve } from 'path';

const repoRoot = resolve(import.meta.dirname, '..');
const outDir = join(repoRoot, 'out');
const chatterboxPython = join(homedir(), '.venvs', 'chatterbox', 'bin', 'python');

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: repoRoot });
}

run('node bin/rclaw.js list');

if (!existsSync(chatterboxPython)) {
  console.log('\n⚠️  Skipping TTS smoke render: ~/.venvs/chatterbox is not installed on this machine.');
  process.exit(0);
}

const output = 'out/smoke-tts.mp4';
run(`node bin/rclaw.js create "smoke test announcement" --tts "OpenClaw smoke test. Audio rendering is working." -o ${output}`);
run(`ffprobe -v error -show_entries stream=codec_type -of csv=p=0 ${output}`);

console.log('\n✅ TTS smoke test passed.');
