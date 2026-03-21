---
name: remotion
description: >
  Generate videos programmatically using the rclaw CLI and Remotion.
  Use when: creating social clips, data visualizations, announcements,
  product demos, or any video from templates with JSON props.
  Supports TTS voiceover (Chatterbox local voice clone, OpenAI, ElevenLabs),
  batch rendering, and interop with summarize, content-breakdown, xurl,
  bluebubbles, gog skills.
license: MIT
compatibility: >
  Requires Node.js 18+. rclaw CLI installed globally (npm i -g remotion-claw).
  TTS default: Chatterbox (local, free, no API key — needs ~/.venvs/chatterbox).
  Optional: OPENAI_API_KEY or ELEVENLABS_API_KEY for cloud TTS.
  Video rendering requires Chrome/Chromium (Remotion bundles it).
metadata:
  author: cyperx84
  version: "0.1.1"
  openclaw:
    requires:
      - node>=18
    install:
      - npm install -g remotion-claw
    repo: https://github.com/cyperx84/remotion-claw
---

# Remotion Video Generation

Generate videos programmatically from templates using the `rclaw` CLI.

## Quick Reference

```bash
# List templates
rclaw list

# Create video from description (auto-selects template)
rclaw create "30-second product demo"

# Create with explicit template
rclaw create "weekly stats" --template data-viz

# Create with props
rclaw create "announcement" --props '{"title":"v2.0 Released","body":"Major update with new features"}'

# Create with props file
rclaw create "data video" --props-file data.json --template data-viz

# Create with TTS voiceover (audio embedded into the MP4)
rclaw create "product overview" --tts "Welcome to our product. Let me walk you through the key features."

# Render specific composition
rclaw render Announcement -o out/announce.mp4

# Generate TTS audio only
rclaw tts "Script text" -o voiceover.mp3

# Initialize new project with templates
rclaw init my-project
```

## TTS Voiceover

### Chatterbox (Default — Local Voice Clone)

Default TTS provider. Uses your voice corpus for cloning. No API key needed.

```bash
# Generate in YOUR voice (default — auto-picks best corpus sample)
rclaw tts "OpenClaw just shipped version three. Time to build."

# Specify a voice reference audio
rclaw tts "Hello world" --voice-prompt ~/corpus/sample.wav

# Adjust expressiveness and voice adherence
rclaw tts "Exciting news!" --exaggeration 0.8 --cfg-weight 0.3

# Create video with your voice
rclaw create "product update" --tts "Here's what we shipped this week"
```

When `--tts` is set and `--duration` is omitted, `rclaw create` auto-sizes the video length to match the generated voiceover.

**Setup:** Python 3.12 venv at `~/.venvs/chatterbox` with `chatterbox-tts` installed.
Voice corpus at `~/.openclaw/workspace/voice-corpus/` (auto-detected).
Override with `RCLAW_VOICE_PROMPT` env or `~/.config/rclaw/config.json`.

## OpenClaw Skill Install

```bash
# Install/update the CLI
npm install -g remotion-claw

# Install/update the OpenClaw skill file from this repo
bash scripts/install-openclaw-skill.sh
```
