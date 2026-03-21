#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join, resolve } from 'path';

const repoRoot = resolve(import.meta.dirname, '..');
const outDir = join(repoRoot, 'out');

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: repoRoot });
}

const output = 'out/smoke-render.mp4';
run('node bin/rclaw.js list');
run(`node bin/rclaw.js create "smoke render announcement" --template announcement --duration 3 --props '{"title":"Smoke Render","body":"Rendering works without TTS."}' -o ${output}`);
run(`ffprobe -v error -show_entries stream=codec_type -of csv=p=0 ${output}`);

console.log('\n✅ Render smoke test passed.');
