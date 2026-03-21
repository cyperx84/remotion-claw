import React from "react";
import { Audio, staticFile } from "remotion";

/**
 * Shared audio overlay component.
 * Audio files must be in the public/ folder or passed as staticFile names.
 *
 * Props:
 *   audioSrc — filename in public/ folder (e.g., "voiceover.wav")
 *   volume — 0-1 (default 1)
 */
export const AudioOverlay = ({ audioSrc, volume = 1 }) => {
  if (!audioSrc) return null;

  // Use staticFile for public/ folder files
  const src = staticFile(audioSrc);

  return <Audio src={src} volume={volume} />;
};
