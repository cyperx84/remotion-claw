#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$REPO_ROOT/skills/openclaw/remotion/SKILL.md"
DEST_DIR="$HOME/.openclaw/skills/remotion"
DEST="$DEST_DIR/SKILL.md"

mkdir -p "$DEST_DIR"
cp "$SRC" "$DEST"

echo "Installed OpenClaw remotion skill: $DEST"
