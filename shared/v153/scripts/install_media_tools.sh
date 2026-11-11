#!/usr/bin/env bash
set -euo pipefail

# Pinned, prebuilt static FFmpeg. This avoids apt mirrors and their dependency downloads.
TOOLS_TMP="${RUNNER_TEMP:-/tmp}/v153-media-tools"
BIN_DIR="${HOME}/.local/bin"
FONT_DIR="${HOME}/.local/share/fonts"
ARCHIVE="${TOOLS_TMP}/ffmpeg-linux64-gpl.tar.xz"
FFMPEG_URL="https://github.com/FFmpeg-Builds/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz"
FFMPEG_SHA256="f6f8a35568815b7a99e0c513d7c6593262422986047068db190980c4bc186865"
FONT_URL="https://raw.githubusercontent.com/notofonts/noto-cjk/f8d157532fbfaeda587e826d4cd5b21a49186f7c/Sans/OTF/Japanese/NotoSansCJKjp-Regular.otf"
FONT_GIT_BLOB_SHA1="f56224957fb13a81b4c14bac34f2f058a017f9fb"

mkdir -p "$TOOLS_TMP/extract" "$BIN_DIR" "$FONT_DIR"
echo "Downloading pinned FFmpeg static build from FFmpeg-Builds..."
curl --fail --location --silent --show-error \
  --retry 5 --retry-all-errors --retry-delay 3 \
  --connect-timeout 30 --max-time 900 \
  "$FFMPEG_URL" -o "$ARCHIVE"
echo "${FFMPEG_SHA256}  ${ARCHIVE}" | sha256sum --check --status
echo "FFmpeg archive SHA-256 verified."

tar -xJf "$ARCHIVE" -C "$TOOLS_TMP/extract"
FFMPEG_SOURCE="$(find "$TOOLS_TMP/extract" -type f -name ffmpeg -perm /111 -print -quit)"
FFPROBE_SOURCE="$(find "$TOOLS_TMP/extract" -type f -name ffprobe -perm /111 -print -quit)"
test -n "$FFMPEG_SOURCE"
test -n "$FFPROBE_SOURCE"
install -m 0755 "$FFMPEG_SOURCE" "$BIN_DIR/ffmpeg"
install -m 0755 "$FFPROBE_SOURCE" "$BIN_DIR/ffprobe"

echo "Downloading the pinned Noto Sans CJK JP font..."
curl --fail --location --silent --show-error \
  --retry 5 --retry-all-errors --retry-delay 3 \
  --connect-timeout 30 --max-time 300 \
  "$FONT_URL" -o "$FONT_DIR/NotoSansCJKjp-Regular.otf"
FONT_ACTUAL_SHA1="$(python - "$FONT_DIR/NotoSansCJKjp-Regular.otf" <<'PY'
import hashlib, pathlib, sys
p=pathlib.Path(sys.argv[1])
data=p.read_bytes()
print(hashlib.sha1(b"blob "+str(len(data)).encode()+b"\0"+data).hexdigest())
PY
)"
if [ "$FONT_ACTUAL_SHA1" != "$FONT_GIT_BLOB_SHA1" ]; then
  echo "Noto Sans CJK JP font integrity check failed." >&2
  exit 1
fi
echo "Noto Sans CJK JP Git blob SHA-1 verified."

# Make the binaries and font directory available to all following workflow steps.
echo "$BIN_DIR" >> "$GITHUB_PATH"
echo "V153_FONTS_DIR=$FONT_DIR" >> "$GITHUB_ENV"
export PATH="$BIN_DIR:$PATH"

if command -v fc-cache >/dev/null 2>&1; then
  fc-cache -f "$FONT_DIR" || true
fi

ffmpeg -version | head -n 1
ffprobe -version | head -n 1
ffmpeg -hide_banner -filters 2>&1 | grep -Eq '[[:space:]]ass[[:space:]]'
ffmpeg -hide_banner -encoders 2>&1 | grep -q 'libx264'
test -s "$FONT_DIR/NotoSansCJKjp-Regular.otf"
echo "V153_MEDIA_TOOLS_READY"
rm -rf "$TOOLS_TMP"
