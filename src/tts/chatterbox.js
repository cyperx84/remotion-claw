import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync } from 'fs';
import { dirname, join } from 'path';
import { homedir } from 'os';

/**
 * Generate TTS using Chatterbox (Resemble AI) — local voice cloning.
 * Runs in the dedicated Python 3.12 venv at ~/.venvs/chatterbox.
 *
 * @param {string} text - Text to speak
 * @param {string} output - Output WAV path
 * @param {object} options
 * @param {string} [options.voicePrompt] - Path to voice reference audio
 * @param {number} [options.exaggeration] - Expressiveness 0-1 (default 0.5)
 * @param {number} [options.cfgWeight] - Adherence to voice prompt 0-1 (default 0.5)
 * @returns {string} Path to generated audio
 */
export async function generateChatterbox(text, output, options = {}) {
  const outDir = dirname(output);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  // Default voice prompt: pick best sample from voice corpus
  const voicePrompt = options.voicePrompt || findBestVoiceSample();
  if (!voicePrompt || !existsSync(voicePrompt)) {
    throw new Error(
      `Voice prompt not found: ${voicePrompt || '(none)'}. ` +
      `Set RCLAW_VOICE_PROMPT or place samples in ~/.openclaw/workspace/voice-corpus/`
    );
  }

  const exaggeration = options.exaggeration ?? 0.5;
  const cfgWeight = options.cfgWeight ?? 0.5;

  // Ensure output has .wav extension (Chatterbox outputs WAV)
  const wavOutput = output.replace(/\.[^.]+$/, '.wav');

  const pythonScript = `
import sys, os
os.environ['PYTORCH_ENABLE_MPS_FALLBACK'] = '1'
import torchaudio as ta
from chatterbox.tts import ChatterboxTTS

model = ChatterboxTTS.from_pretrained(device="mps")
wav = model.generate(
    sys.argv[1],
    audio_prompt_path=sys.argv[2],
    exaggeration=float(sys.argv[3]),
    cfg_weight=float(sys.argv[4]),
)
ta.save(sys.argv[5], wav, model.sr)
dur = wav.shape[1] / model.sr
print(f"chatterbox_ok duration={dur:.2f}")
`;

  const venvPython = join(homedir(), '.venvs', 'chatterbox', 'bin', 'python3');
  if (!existsSync(venvPython)) {
    throw new Error(
      `Chatterbox venv not found at ~/.venvs/chatterbox. ` +
      `Run: python3.12 -m venv ~/.venvs/chatterbox && source ~/.venvs/chatterbox/bin/activate && uv pip install chatterbox-tts`
    );
  }

  console.log(`   🎤 Voice prompt: ${voicePrompt}`);
  console.log(`   🧠 Model: Chatterbox (MPS local)`);
  console.log(`   ⚙️  Exaggeration: ${exaggeration}, CFG: ${cfgWeight}`);

  try {
    const result = execFileSync(venvPython, [
      '-c', pythonScript,
      text,
      voicePrompt,
      String(exaggeration),
      String(cfgWeight),
      wavOutput,
    ], {
      timeout: 300_000, // 5 min max
      maxBuffer: 10 * 1024 * 1024,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const stdout = result.toString();
    const match = stdout.match(/chatterbox_ok duration=([\d.]+)/);
    if (match) {
      console.log(`   ⏱️  Generated ${parseFloat(match[1]).toFixed(1)}s audio`);
    }

    return wavOutput;
  } catch (err) {
    const stderr = err.stderr?.toString() || '';
    throw new Error(`Chatterbox generation failed: ${stderr.slice(-500)}`);
  }
}

/**
 * Find the best voice sample from the corpus.
 * Prefers: RCLAW_VOICE_PROMPT env > config file > longest WAV in corpus dir.
 */
function findBestVoiceSample() {
  // 1. Env var override
  if (process.env.RCLAW_VOICE_PROMPT) {
    return process.env.RCLAW_VOICE_PROMPT;
  }

  // 2. Config file
  const configPath = join(homedir(), '.config', 'rclaw', 'config.json');
  if (existsSync(configPath)) {
    try {
      const config = JSON.parse(readFileSync(configPath, 'utf8'));
      if (config.voicePrompt) return config.voicePrompt;
    } catch {}
  }

  // 3. Auto-detect: pick longest WAV from voice corpus
  const corpusDir = join(homedir(), '.openclaw', 'workspace', 'voice-corpus');
  if (!existsSync(corpusDir)) return null;

  const wavFiles = readdirSync(corpusDir).filter(f => f.endsWith('.wav'));
  if (wavFiles.length === 0) return null;

  // Pick largest file (proxy for longest audio)
  let best = { path: '', size: 0 };
  for (const f of wavFiles) {
    const fp = join(corpusDir, f);
    const size = statSync(fp).size;
    if (size > best.size) best = { path: fp, size };
  }

  return best.path;
}
