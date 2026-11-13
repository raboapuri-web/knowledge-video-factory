#!/usr/bin/env python3
"""Rasterize only v154 generated SVG scene assets to 1920x1080 PNG.

Asset preparation utility ONLY. Does not call chapter or finalize.
Requires: pip install cairosvg pillow
"""
import argparse
import json
from pathlib import Path
from PIL import Image
import cairosvg

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "assets" / "generated_manifest.json"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="assets/generated_png")
    args = ap.parse_args()
    doc = json.loads(MANIFEST.read_text(encoding="utf-8"))
    output = ROOT / args.out
    output.mkdir(parents=True, exist_ok=True)
    scenes = doc["scenes"]
    assert len(scenes) == 36, f"expected 36 generated diagrams, got {len(scenes)}"
    for row in scenes:
        sid = row["scene_id"]
        src = ROOT / row["file"]
        if not src.is_file():
            raise FileNotFoundError(src)
        png = output / f"{sid}.png"
        cairosvg.svg2png(url=str(src), write_to=str(png),
                         output_width=1920, output_height=1080)
        with Image.open(png) as im:
            assert im.size == (1920, 1080), (sid, im.size)
        print(f"OK {sid} => {png.relative_to(ROOT)}")
    print(f"Completed {len(scenes)} SVG-to-PNG conversions. No video jobs invoked.")

if __name__ == "__main__":
    main()
