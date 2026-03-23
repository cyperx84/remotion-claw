#!/bin/bash
cd ~/github/remotion-claw/podcast-ep2

rclaw tts "They're making agent-to-agent communication the default." --output c18b.wav --seed 1337 && echo "✓ c18b"
rclaw tts "Exactly. Also the Plugin SDK had a breaking change. The HTTP handler API was redesigned completely." --output c19.wav --seed 1337 && echo "✓ c19"
rclaw tts "Ha. Yeah. But the new API is cleaner. Explicit route registration with path, auth, and match parameters." --output c20.wav --seed 1337 && echo "✓ c20"
rclaw tts "Using Gemini embedding two preview. You can point it at a folder of screenshots or voice memos and your agent can semantically search through them." --output c21.wav --seed 1337 && echo "✓ c21"
rclaw tts "Totally. Imagine asking your agent what did I screenshot last week about that API design. And it actually finds it." --output c22.wav --seed 1337 && echo "✓ c22"
rclaw tts "It lets an orchestrator agent end its turn immediately instead of waiting for all queued tool calls to finish." --output c24a.wav --seed 1337 && echo "✓ c24a"
rclaw tts "And it can pass a hidden payload to the next turn." --output c24b.wav --seed 1337 && echo "✓ c24b"
rclaw tts "Right. It's an efficiency primitive. Saves compute and makes agent handoffs cleaner." --output c25.wav --seed 1337 && echo "✓ c25"
rclaw tts "Local reasoning models were leaking their internal think blocks into user-visible replies." --output c26a.wav --seed 1337 && echo "✓ c26a"
rclaw tts "Like you'd see the model's internal monologue mixed into the actual response." --output c26b.wav --seed 1337 && echo "✓ c26b"
rclaw tts "Fixed now. The think tags are properly stripped before the response is delivered." --output c27.wav --seed 1337 && echo "✓ c27"
rclaw tts "If you're self-hosting OpenClaw, update to three dot thirteen. Seriously. Those security patches alone are worth it." --output c28.wav --seed 1337 && echo "✓ c28"
rclaw tts "See you next week." --output c29.wav --seed 1337 && echo "✓ c29"
echo "ALL CYPERX DONE"
