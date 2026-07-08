#!/usr/bin/env bash
# ---------------------------------------------------------------
# Focus — one-shot release helper
# Cleans, builds, re-signs (the valid-signature fix), zips, and
# prints the SHA256 you paste into the Homebrew cask.
# Run from the repo root:  ./release.sh 1.1.0
# ---------------------------------------------------------------
set -euo pipefail

VERSION="${1:?Usage: ./release.sh <version>   e.g. ./release.sh 1.1.0}"
APP="Focus.app"
BUNDLE="src-tauri/target/release/bundle/macos"
ZIP="Focus-${VERSION}-mac.zip"

echo "▸ Loading Rust env"
[ -f "$HOME/.cargo/env" ] && . "$HOME/.cargo/env"

echo "▸ Cleaning stale bundle (prevents the 'has no resources' signing bug)"
rm -rf src-tauri/target/release/bundle src-tauri/target/release/focus

echo "▸ Building"
cargo tauri build

echo "▸ Re-signing with a fresh ad-hoc signature"
codesign --force --deep --sign - "$BUNDLE/$APP"

echo "▸ Verifying signature"
codesign --verify --strict --verbose=4 "$BUNDLE/$APP"

echo "▸ Zipping (ditto preserves the signature)"
( cd "$BUNDLE" && rm -f "$ZIP" && ditto -c -k --keepParent "$APP" "$ZIP" )

echo "▸ Round-trip check (zip must stay valid)"
TMP="$(mktemp -d)"
ditto -x -k "$BUNDLE/$ZIP" "$TMP"
codesign --verify --strict "$TMP/$APP" && echo "  zip is valid ✓"
rm -rf "$TMP"

SHA="$(shasum -a 256 "$BUNDLE/$ZIP" | awk '{print $1}')"

echo
echo "════════════════════════════════════════════════════════════"
echo " DONE. Artifact:"
echo "   $BUNDLE/$ZIP"
echo
echo " SHA256 (paste into the Homebrew cask 'sha256' field):"
echo "   $SHA"
echo
echo " Next:"
echo "   1. Create GitHub release tag v${VERSION} and upload the zip:"
echo "      gh release create v${VERSION} \"$BUNDLE/$ZIP\" \\"
echo "         --title \"Focus ${VERSION}\" --notes \"See README for install.\""
echo "   2. Update Casks/focus.rb in your homebrew-tap repo with the version + sha above."
echo "════════════════════════════════════════════════════════════"
