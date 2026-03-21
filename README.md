# remotion-claw

Remotion video generation CLI for AI agents — templates, TTS, batch rendering.

Part of the [OpenClaw](https://openclaw.com) ecosystem.

## Install

```bash
npm install -g remotion-claw
```

Or use directly:

```bash
npx remotion-claw create "30-second product demo"
```

## Quick Start

```bash
# List available templates
rclaw list

# Create a video from a description (auto-selects template)
rclaw create "product launch announcement"

# Create a social clip (9:16 vertical)
rclaw create "top 3 features" --template social-clip

# Create with custom props
rclaw create "weekly stats" --template data-viz --props '{"data":[10,25,40,35,50],"labels":["W1","W2","W3","W4","W5"]}'

# Create with TTS voiceover
rclaw create "product overview" --tts "Welcome to our product demo. Let me show you what we've built."

# Render a specific composition
rclaw render SocialClip -o out/clip.mp4 --width 1080 --height 1920

# Generate TTS audio only
rclaw tts "Hello world" -o voiceover.mp3

# Initialize a new project with all templates
rclaw init my-video-project
```

## Templates

| Template | Aspect | Resolution | Use Case |
|----------|--------|------------|----------|
| `social-clip` | 9:16 | 1080×1920 | TikTok, Reels, Shorts |
| `data-viz` | 16:9 | 1920×1080 | Charts, graphs, data stories |
| `announcement` | 1:1 | 1080×1080 | Quote cards, announcements |
| `product-demo` | 16:9 | 1920×1080 | App demos, feature highlights |

## Props

All templates accept props as inline JSON (`--props '{...}'`) or from a file (`--props-file data.json`).

### Social Clip Props
```json
{
  "title": "Your Title",
  "subtitle": "Your subtitle",
  "background": "#1a1a2e",
  "accentColor": "#e94560",
  "textColor": "#ffffff",
  "items": ["Point 1", "Point 2", "Point 3"]
}
```

### Data Viz Props
```json
{
  "title": "Weekly Performance",
  "data": [40, 65, 80, 55, 90],
  "labels": ["Mon", "Tue", "Wed", "Thu", "Fri"],
  "barColor": "#4ecdc4",
  "background": "#0f0f23"
}
```

### Announcement Props
```json
{
  "title": "Big News!",
  "body": "We just shipped something amazing.",
  "accent": "#e94560",
  "author": "— The Team"
}
```

### Product Demo Props
```json
{
  "title": "Product Name",
  "tagline": "Built for builders.",
  "features": ["Fast", "Simple", "Powerful"],
  "screenshotUrl": "https://example.com/screenshot.png"
}
```

## TTS

Generate voiceover audio with OpenAI or ElevenLabs:

```bash
# OpenAI TTS (requires OPENAI_API_KEY)
rclaw tts "Your script here" --provider openai --voice alloy

# ElevenLabs (requires ELEVENLABS_API_KEY)
rclaw tts "Your script here" --provider elevenlabs --voice <voice-id>

# Create video with inline TTS
rclaw create "demo" --tts "Welcome to our product walkthrough"
```

## Programmatic Usage

```javascript
import { renderVideo, generateTTS, TEMPLATES } from 'remotion-claw';

// Render a video
await renderVideo({
  composition: 'Announcement',
  output: 'out/announce.mp4',
  props: { title: 'Hello!', body: 'World' },
});

// Generate TTS
await generateTTS('Hello world', { output: 'voice.mp3' });
```

## OpenClaw Integration

This tool has a corresponding OpenClaw skill at `~/.openclaw/skills/remotion/SKILL.md`.

Works with:
- **summarize** — transcript → voiceover → video
- **content-breakdown** — research notes → video
- **xurl** — render → post to X
- **bluebubbles/imsg** — render → send via iMessage
- **gog** — render → upload to Google Drive

## Development

```bash
git clone https://github.com/cyperx84/remotion-claw.git
cd remotion-claw
npm install
node bin/rclaw.js list
```

## License

MIT
