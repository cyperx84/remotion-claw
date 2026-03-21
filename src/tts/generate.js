import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';

/**
 * Generate TTS audio from text.
 * Supports OpenAI and ElevenLabs providers.
 *
 * Requires env vars:
 *   OPENAI_API_KEY — for OpenAI TTS
 *   ELEVENLABS_API_KEY — for ElevenLabs TTS
 */
export async function generateTTS(text, options = {}) {
  const { output = 'out/voiceover.mp3', provider = 'openai', voice = 'alloy' } = options;

  const outDir = dirname(output);
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  if (provider === 'openai') {
    return await generateOpenAI(text, output, voice);
  } else if (provider === 'elevenlabs') {
    return await generateElevenLabs(text, output, voice);
  } else {
    throw new Error(`Unknown TTS provider: ${provider}. Use 'openai' or 'elevenlabs'.`);
  }
}

async function generateOpenAI(text, output, voice) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: voice,
      response_format: 'mp3',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI TTS failed (${res.status}): ${err}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(output, buffer);
  return output;
}

async function generateElevenLabs(text, output, voice) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY not set');

  // Default to a common voice ID if a name is given
  // Users should pass the actual voice ID for best results
  const voiceId = voice;

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs TTS failed (${res.status}): ${err}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(output, buffer);
  return output;
}
