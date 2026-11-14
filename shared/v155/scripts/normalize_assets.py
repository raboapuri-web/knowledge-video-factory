#!/usr/bin/env python3
"""V155: normalize assets in the runner workspace before preflight/render.

1. Applies shared/v155/final_asset_map.json to board.json IN THE RUNNER ONLY
   (the committed board.json keeps asset_type as originally authored; the map
   is authoritative: 5 photos, 83 generated, with S009/S021/S029/S072/S078
   switched from photo to generated).
2. Upscales any final JPG smaller than 1280x720 to 1920px wide with Lanczos
   (S048, the granted zebra-foal photo, is only 1024x724 at its source).
   The committed photo file is untouched; only the rendered copy is upscaled.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOARD = ROOT / "content" / "board.json"
FINAL_MAP = ROOT / "final_asset_map.json"
FINAL = ROOT / "assets" / "final"


def main():
    fmap = json.loads(FINAL_MAP.read_text(encoding="utf-8"))
    board = json.loads(BOARD.read_text(encoding="utf-8"))
    photos = set(fmap.get("photos", []))
    switched = set(fmap.get("switched_to_generated", {}).keys())
    for scene in board["scenes"]:
        if scene["id"] in photos:
            scene["asset_type"] = "photo"
        elif scene["id"] in switched:
            scene["asset_type"] = "generated"
    BOARD.write_text(json.dumps(board, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"board asset_type applied: photos={sorted(photos)} switched={sorted(switched)}", flush=True)
    from PIL import Image
    for path in sorted(FINAL.glob("*.jpg")):
        with Image.open(path) as im:
            width, height = im.size
            if width >= 1280 and height >= 720:
                continue
            new_width = 1920
            new_height = round(height * new_width / width)
            print(f"upscale {path.name}: {width}x{height} -> {new_width}x{new_height}", flush=True)
            im.convert("RGB").resize((new_width, new_height), Image.LANCZOS).save(path, "JPEG", quality=92)
    print("normalize done", flush=True)


if __name__ == "__main__":
    main()
