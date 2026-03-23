#!/bin/bash
set -e
cd ~/github/remotion-claw/podcast-ep2

echo "=== Step 1: Convert Alex MP3s to WAV (44100Hz mono) ==="
for f in a*.mp3; do
  base="${f%.mp3}"
  ffmpeg -y -i "$f" -ar 44100 -ac 1 "${base}.wav" 2>/dev/null
  echo "✓ ${base}.wav"
done

echo ""
echo "=== Step 2: Generate silence ==="
ffmpeg -y -f lavfi -i anullsrc=r=44100:cl=mono -t 0.3 -q:a 0 silence.wav 2>/dev/null
echo "✓ silence.wav (0.3s)"

echo ""
echo "=== Step 3: Build concat list ==="
# Dialogue order (reconstructed from scripts)
ORDER=(
  c1 a1 c2 a2
  c3a c3b a3
  c4a c4b a4
  c5 a5 c6 a6 c7 a7
  c8a c8b a8
  c9a c9b a9
  c10a c10b a10
  c11 a11
  c12a c12b a12
  c13a c13b a13
  c14 a14
  c15a c15b a15
  c16 a16
  c17a c17b a17
  c18a c18b a18
  c19 a19 c20 a20
  c21 a21 c22 a22
  a23 c24a c24b a24
  c25 a25
  c26a c26b a26
  c27 a27 c28 a28 c29
)

rm -f concat.txt
for i in "${!ORDER[@]}"; do
  chunk="${ORDER[$i]}"
  echo "file '${chunk}.wav'" >> concat.txt
  # Add silence between chunks (not after last)
  if [ $i -lt $((${#ORDER[@]} - 1)) ]; then
    echo "file 'silence.wav'" >> concat.txt
  fi
done

echo "✓ concat.txt (${#ORDER[@]} chunks)"

echo ""
echo "=== Step 4: Concatenate all audio ==="
ffmpeg -y -f concat -safe 0 -i concat.txt -c copy ep2-merged.wav 2>/dev/null
DURATION=$(ffprobe -i ep2-merged.wav -show_entries format=duration -v quiet -of csv="p=0")
echo "✓ ep2-merged.wav (${DURATION}s)"

echo ""
echo "=== Step 5: Get duration info ==="
echo "DURATION=${DURATION}"
FRAMES=$(python3 -c "import math; print(math.ceil(float('${DURATION}') * 30))")
echo "FRAMES=${FRAMES}"
echo "Duration: ${DURATION}s, Frames at 30fps: ${FRAMES}"

echo ""
echo "=== ASSEMBLY COMPLETE ==="
echo "Audio: ep2-merged.wav"
echo "Duration: ${DURATION}s"
echo "Frames: ${FRAMES}"
