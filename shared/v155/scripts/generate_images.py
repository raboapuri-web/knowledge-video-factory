#!/usr/bin/env python3
"""V155: generate the 83 generated scenes with the OpenAI Images API.

Reads board.json (image_description / design_axis per scene) and
final_asset_map.json (which overrides board.json asset_type: the 5 photos
S015/S033/S047/S048/S063 stay photos, S009/S021/S029/S072/S078 switch to
generated). Generates ONE image per scene, sequentially, in scene order,
saves shared/v155/assets/final/Sxxx.jpg and commits progress back to the
branch every 10 images so a failed run loses nothing.

The image model is picked from the API key's own model list (GET /v1/models),
preference: gpt-image-1, gpt-image-1.5, gpt-image-1-mini, dall-e-3.
Set V155_IMAGE_MODEL to force a model. A scene that still fails after
3 attempts stops the run immediately (fail fast) instead of grinding
through the remaining scenes with the same systematic error.
"""
import argparse
import base64
import io
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOARD = ROOT / "content" / "board.json"
FINAL_MAP = ROOT / "final_asset_map.json"
MANIFEST = ROOT / "assets" / "generated_manifest.json"
OUT_DIR = ROOT / "assets" / "final"
LOG = ROOT / "assets" / "generation_log.json"
PREFERRED_MODELS = ["gpt-image-1", "gpt-image-1.5", "gpt-image-1-mini", "dall-e-3"]


def pick_model(api_key):
    forced = os.environ.get("V155_IMAGE_MODEL", "")
    if forced:
        return forced
    req = urllib.request.Request(
        "https://api.openai.com/v1/models",
        headers={"Authorization": f"Bearer {api_key}"}, method="GET")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode())
    except Exception as e:
        print(f"WARNING model list lookup failed ({e}); defaulting to gpt-image-1", flush=True)
        return "gpt-image-1"
    available = {m.get("id") for m in data.get("data", [])}
    image_models = sorted(m for m in available if "image" in m or m.startswith("dall-e"))
    print(f"image models available to this key: {image_models}", flush=True)
    for cand in PREFERRED_MODELS:
        if cand in available:
            return cand
    raise RuntimeError(f"No supported image model for this key. Available image models: {image_models}")


def image_params(model):
    if model == "dall-e-3":
        return {"size": "1792x1024", "quality": "standard", "response_format": "b64_json"}
    return {"size": "1536x1024", "quality": "medium"}


def load_targets():
    board = json.loads(BOARD.read_text(encoding="utf-8"))
    scenes = {s["id"]: s for s in board["scenes"]}
    fmap = json.loads(FINAL_MAP.read_text(encoding="utf-8")) if FINAL_MAP.exists() else {}
    photos = set(fmap.get("photos", []))
    switched = list(fmap.get("switched_to_generated", {}).keys())
    generated = [sid for sid, s in scenes.items() if s.get("asset_type") == "generated"]
    for sid in switched:
        if sid in scenes and sid not in generated:
            generated.append(sid)
    generated = sorted(generated)
    if MANIFEST.exists():
        manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
        ids = manifest.get("scene_ids", manifest) if isinstance(manifest, dict) else manifest
        if set(ids) != set(generated):
            print(f"WARNING manifest {len(ids)} != computed {len(generated)}; using computed list", flush=True)
    return [scenes[sid] for sid in generated if sid not in photos]


def build_prompt(scene):
    axis = scene.get("design_axis") or ""
    desc = scene.get("image_description") or ""
    return (
        f"Single full-frame wide 16:9 image for a Japanese educational documentary video. "
        f"Scene {scene['id']}: {desc} Style: {axis}. "
        "One scene, one image only. No collage, no multi-panel layout, no split screen, "
        "no text, no labels, no letters, no numbers, no watermark, no logo, no subtitle bar. "
        "Keep the composition calm at the bottom for subtitles."
    )


def call_openai(prompt, api_key, model):
    params = {"model": model, "prompt": prompt, "n": 1}
    params.update(image_params(model))
    body = json.dumps(params).encode()
    req = urllib.request.Request(
        "https://api.openai.com/v1/images/generations", data=body,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=300) as resp:
            data = json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"OpenAI HTTP {e.code}: {e.read().decode(errors='replace')[:500]}")
    items = data.get("data") or []
    if not items:
        raise RuntimeError(f"OpenAI response without image data: {str(data)[:500]}")
    if items[0].get("b64_json"):
        return base64.b64decode(items[0]["b64_json"])
    if items[0].get("url"):
        with urllib.request.urlopen(items[0]["url"], timeout=120) as r:
            return r.read()
    raise RuntimeError(f"OpenAI response without image data: {str(data)[:500]}")


def valid_jpeg(path):
    try:
        from PIL import Image
        with Image.open(path) as im:
            return im.format == "JPEG" and im.width >= 1280 and im.height >= 720 and path.stat().st_size > 20000
    except Exception:
        return False


def save_jpeg(raw, path):
    from PIL import Image
    with Image.open(io.BytesIO(raw)) as im:
        im.convert("RGB").save(path, "JPEG", quality=90)
    return valid_jpeg(path)


def git_push(paths, message):
    try:
        subprocess.run(["git", "config", "user.name", "v155-image-bot"], check=False)
        subprocess.run(["git", "config", "user.email", "v155-image-bot@users.noreply.github.com"], check=False)
        subprocess.run(["git", "add", *paths], check=True)
        if subprocess.run(["git", "diff", "--cached", "--quiet"]).returncode == 0:
            return False
        subprocess.run(["git", "commit", "-m", message], check=True)
        subprocess.run(["git", "push"], check=True, timeout=300)
        return True
    except Exception as e:
        print(f"WARNING git push failed: {e}", flush=True)
        return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--only", default="")
    ap.add_argument("--push-every", type=int, default=10)
    args = ap.parse_args()
    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        print("ERROR: OPENAI_API_KEY is not set", file=sys.stderr)
        return 2
    try:
        model = pick_model(api_key)
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 2
    print(f"model={model} params={image_params(model)}", flush=True)
    scenes = load_targets()
    if args.only:
        wanted = {x.strip() for x in args.only.split(",") if x.strip()}
        scenes = [s for s in scenes if s["id"] in wanted]
    print(f"targets={len(scenes)}", flush=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    log = json.loads(LOG.read_text(encoding="utf-8")) if LOG.exists() else {"model": model, "size": image_params(model)["size"], "scenes": {}}
    log["model"] = model
    made, skipped, failed = [], [], []
    pending_push = []
    for scene in scenes:
        sid = scene["id"]
        out = OUT_DIR / f"{sid}.jpg"
        if valid_jpeg(out):
            skipped.append(sid)
            continue
        if args.limit and len(made) >= args.limit:
            break
        ok = False
        for attempt in range(1, 4):
            try:
                print(f"[{sid}] generating attempt {attempt} ...", flush=True)
                raw = call_openai(build_prompt(scene), api_key, model)
                if save_jpeg(raw, out):
                    ok = True
                    break
                print(f"[{sid}] saved file failed validation, retrying", flush=True)
            except Exception as e:
                print(f"[{sid}] attempt {attempt} failed: {e}", flush=True)
                time.sleep(10 * attempt)
        if ok:
            made.append(sid)
            log["scenes"][sid] = {"model": model, "size": image_params(model)["size"]}
            LOG.write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding="utf-8")
            pending_push += [str(out), str(LOG)]
            if args.push_every and len(made) % args.push_every == 0:
                git_push(pending_push, f"V155: generate images up to {sid} ({len(made)} new)")
                pending_push = []
        else:
            failed.append(sid)
            print(f"[{sid}] FAILED after 3 attempts; stopping run (fail fast).", flush=True)
            break
        time.sleep(2)
    if pending_push:
        git_push(pending_push, f"V155: generate images {made[0] if made else ''}..{made[-1] if made else ''} ({len(made)} new)")
    print(f"RESULT generated={len(made)} skipped_existing={len(skipped)} failed={failed}", flush=True)
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
