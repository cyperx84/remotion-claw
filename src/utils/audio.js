import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';

/**
 * Get duration of an audio file in seconds using ffprobe.
 * Falls back to a rough WAV header calculation if ffprobe isn't available.
 *
 * @param {string} audioPath - Path to audio file
 * @returns {number} Duration in seconds
 */
export function getAudioDuration(audioPath) {
  if (!existsSync(audioPath)) {
    throw new Error(`Audio file not found: ${audioPath}`);
  }

  try {
    // Try ffprobe first (most accurate)
    const result = execSync(
      `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${audioPath}"`,
      { encoding: 'utf8', timeout: 10000 }
    ).trim();
    const duration = parseFloat(result);
    if (!isNaN(duration) && duration > 0) return duration;
  } catch {
    // ffprobe not available, try soxi
    try {
      const result = execSync(`soxi -D "${audioPath}"`, {
        encoding: 'utf8',
        timeout: 10000,
      }).trim();
      const duration = parseFloat(result);
      if (!isNaN(duration) && duration > 0) return duration;
    } catch {
      // Fall back to WAV header parsing
      if (audioPath.endsWith('.wav')) {
        return getWavDuration(audioPath);
      }
    }
  }

  // Default: assume 10 seconds
  console.warn('⚠️  Could not detect audio duration, defaulting to 10s');
  return 10;
}

/**
 * Parse WAV header for duration.
 */
function getWavDuration(wavPath) {
  const buf = readFileSync(wavPath);

  // WAV header: bytes 24-27 = sample rate, bytes 28-31 = byte rate
  if (buf.length < 44) return 10;

  const sampleRate = buf.readUInt32LE(24);
  const byteRate = buf.readUInt32LE(28);

  if (byteRate === 0) return 10;

  // Data size = file size - 44 (header)
  const dataSize = buf.length - 44;
  return dataSize / byteRate;
}
