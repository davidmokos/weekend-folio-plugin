#!/usr/bin/env bash
# Draws the pictures of this repository from assets/brand.html with headless
# Chrome. Run it from any folder: scripts/render-assets.sh
#
# It needs Google Chrome (or set CHROME to another Chromium binary) and a
# network connection, for the fonts and the example covers.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
chrome="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
page="file://$root/assets/brand.html"

render() { # id, width, height, scale, output file
  "$chrome" --headless=new --disable-gpu --hide-scrollbars \
    --window-size="$2,$3" --force-device-scale-factor="$4" \
    --virtual-time-budget=10000 \
    --screenshot="$root/$5" "$page#$1" >/dev/null 2>&1
  echo "$5"
}

render banner 1280 640 2 assets/banner.png
render logo 512 512 1 plugins/weekend-folio/assets/logo.png
render logo-dark 512 512 1 plugins/weekend-folio/assets/logo-dark.png
