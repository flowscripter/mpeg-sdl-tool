#!/bin/sh

set -e  # Exit on error

# Define the download URL
URL="https://github.com/flowscripter/mpeg-sdl-tool/releases/latest/download/mpeg-sdl-tool_Linux_x86_64.zip"

# Create a temporary directory
TMP_DIR=$(mktemp -d)
cd "$TMP_DIR"

# Download and extract
echo "Downloading mpeg-sdl-tool..."
curl -fsSL "$URL" -o executable.zip
unzip executable.zip

# Install
chmod +x mpeg-sdl-tool
sudo mv mpeg-sdl-tool /usr/local/bin/

# Clean up
cd -
rm -rf "$TMP_DIR"

echo "✅ Installation complete! Run 'mpeg-sdl-tool' to get started."
