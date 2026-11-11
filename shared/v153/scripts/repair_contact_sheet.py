#!/usr/bin/env python3
import argparse
import json
from pathlib import Path

import cv2
from PIL import Image, ImageDraw, ImageFont

CHAPTER_ORDER = ["prologue", "chapter1", "chapter2", "chapter3", "chapter4", "epilogue"]
EXPECTED_SCENES = [f"S{i:03d}" for i in range(1, 89)]
THUMB_W, THUMB_H, LABEL_H = 320, 180, 26
COLS, ROWS = 11, 8


def load_scenes(segments_dir: Path):
    reports = {}
    for chapter in CHAPTER_ORDER:
        path = segments_dir / f"voice-report-{chapter}.json"
        if not path.is_file():
            raise FileNotFoundError(f"Missing chapter voice report: {path}")
        report = json.loads(path.read_text(encoding="utf-8"))
        if report.get("chapter") != chapter:
            raise ValueError(f"Voice report chapter mismatch: {path}")
        reports[chapter] = report

    scenes = []
    for chapter in CHAPTER_ORDER:
        scenes.extend(reports[chapter].get("scenes", []))
    ids = [s.get("scene") for s in scenes]
    if ids != EXPECTED_SCENES:
        raise ValueError(f"Scene order/count mismatch: expected S001-S088, got {len(ids)} scenes")
    if any(float(s.get("duration", 0)) <= 0 for s in scenes):
        raise ValueError("A scene has a missing or non-positive narration duration")
    return scenes


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--segments-dir", required=True)
    ap.add_argument("--output", required=True)
    ap.add_argument("--qa", required=True)
    ap.add_argument("--production-report", required=True)
    ap.add_argument("--audit", required=True)
    args = ap.parse_args()

    video = Path(args.video)
    segments_dir = Path(args.segments_dir)
    output = Path(args.output)
    qa_path = Path(args.qa)
    production_path = Path(args.production_report)
    audit_path = Path(args.audit)
    for p in [video, qa_path, production_path]:
        if not p.is_file():
            raise FileNotFoundError(p)

    scenes = load_scenes(segments_dir)
    cap = cv2.VideoCapture(str(video))
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open final video: {video}")
    fps = float(cap.get(cv2.CAP_PROP_FPS))
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if fps <= 0 or frame_count <= 0:
        raise RuntimeError("Final video has invalid frame-rate/frame-count metadata")
    video_duration = frame_count / fps
    narration_duration = sum(float(s["duration"]) for s in scenes)
    duration_delta = abs(video_duration - narration_duration)
    if duration_delta > 0.30:
        raise RuntimeError(
            f"Voice reports do not align with final video duration: "
            f"video={video_duration:.3f}s narration={narration_duration:.3f}s"
        )

    sheet = Image.new(
        "RGB",
        (COLS * THUMB_W, ROWS * (THUMB_H + LABEL_H)),
        (16, 16, 16),
    )
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default()
    elapsed = 0.0
    audit_scenes = []

    for i, scene in enumerate(scenes):
        duration = float(scene["duration"])
        midpoint = elapsed + duration / 2.0
        cap.set(cv2.CAP_PROP_POS_MSEC, midpoint * 1000.0)
        ok, frame = cap.read()
        if not ok or frame is None:
            cap.release()
            raise RuntimeError(f"Could not sample final video at {scene['scene']} ({midpoint:.3f}s)")
        height, width = frame.shape[:2]
        if (width, height) != (1920, 1080):
            cap.release()
            raise RuntimeError(f"Unexpected frame size at {scene['scene']}: {width}x{height}")

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        thumb = Image.fromarray(rgb).resize((THUMB_W, THUMB_H), Image.Resampling.LANCZOS)
        x = (i % COLS) * THUMB_W
        y = (i // COLS) * (THUMB_H + LABEL_H)
        sheet.paste(thumb, (x, y))
        draw.text(
            (x + 6, y + THUMB_H + 5),
            f"{scene['scene']}  {midpoint:7.1f}s",
            font=font,
            fill=(245, 245, 245),
        )
        audit_scenes.append({
            "scene": scene["scene"],
            "chapter_midpoint_seconds": round(midpoint, 3),
            "source_voice_duration_seconds": round(duration, 4),
        })
        elapsed += duration

    cap.release()
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, format="JPEG", quality=90, optimize=True)

    qa = json.loads(qa_path.read_text(encoding="utf-8"))
    checks = qa.setdefault("checks", {})
    checks["contact_sheet_88_scene_midpoints"] = True
    checks["contact_sheet_scene_order_matches_S001_S088"] = True
    checks["contact_sheet_duration_alignment"] = duration_delta <= 0.30
    qa["contact_sheet"] = {
        "file": str(output),
        "frames": 88,
        "layout": "11x8",
        "sampling": "one frame at the narration-duration midpoint of each scene",
        "scene_order": "S001-S088",
        "video_duration_seconds": round(video_duration, 3),
        "voice_report_duration_seconds": round(narration_duration, 3),
        "duration_delta_seconds": round(duration_delta, 3),
        "dimensions": list(sheet.size),
    }
    qa["passed"] = all(bool(v) for v in checks.values())
    if not qa["passed"]:
        raise RuntimeError("Final QA report did not pass after contact-sheet repair")

    qa_path.write_text(json.dumps(qa, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    production_path.write_text(json.dumps(qa, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    audit = {
        "passed": True,
        "method": "sample final master at the midpoint of each scene using the chapter VOICEVOX timing reports",
        "scene_count": len(audit_scenes),
        "scene_order": [x["scene"] for x in audit_scenes],
        "video_duration_seconds": round(video_duration, 3),
        "voice_report_duration_seconds": round(narration_duration, 3),
        "duration_delta_seconds": round(duration_delta, 3),
        "contact_sheet": str(output),
        "scenes": audit_scenes,
    }
    audit_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "passed": True,
        "scene_count": len(audit_scenes),
        "contact_sheet": str(output),
        "duration_delta_seconds": round(duration_delta, 3),
        "dimensions": list(sheet.size),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
