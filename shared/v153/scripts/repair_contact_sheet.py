#!/usr/bin/env python3
"""Build final-master contact sheets with chapter-card offsets included."""
import argparse
import json
import math
from pathlib import Path

import cv2
from PIL import Image, ImageDraw, ImageFont

CHAPTER_ORDER = ["prologue", "chapter1", "chapter2", "chapter3", "chapter4", "epilogue"]
EXPECTED_SCENES = [f"S{i:03d}" for i in range(1, 89)]
THUMB_W, THUMB_H, LABEL_H = 320, 180, 26
SCENE_COLS, SCENE_ROWS = 11, 8
CARD_W, CARD_H, CARD_LABEL_H = 640, 360, 42


def load_reports(segments_dir: Path):
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
    return reports, scenes


def load_card_spec(root: Path):
    path = root / "format_v2" / "config" / "chapter_card_spec.json"
    spec = json.loads(path.read_text(encoding="utf-8"))
    fps = int(spec["resolution"]["fps"])
    policy = spec["duration_policy"]
    typing = spec["typing"]
    cps = float(typing["characters_per_second"])
    cards = {}
    for card in spec["cards"]:
        raw = (
            float(policy["start_delay_sec"])
            + len(card["label"]) / cps
            + float(policy["interline_delay_sec"])
            + len(card["title"]) / cps
            + float(typing["cursor_blink_duration_sec"])
            + float(policy["final_hold_sec"])
        )
        duration = max(float(policy["minimum_duration_sec"]), raw)
        duration = math.ceil(duration * fps - 1e-9) / fps
        cards[card["chapter"]] = {
            "label": card["label"],
            "title": card["title"],
            "duration": duration,
        }
    if list(cards) != CHAPTER_ORDER:
        raise ValueError("Chapter-card specification does not contain the six chapters in order")
    return cards


def sample_frame(cap, seconds, label):
    cap.set(cv2.CAP_PROP_POS_MSEC, max(0.0, seconds) * 1000.0)
    ok, frame = cap.read()
    if not ok or frame is None:
        raise RuntimeError(f"Could not sample final video at {label} ({seconds:.3f}s)")
    height, width = frame.shape[:2]
    if (width, height) != (1920, 1080):
        raise RuntimeError(f"Unexpected frame size at {label}: {width}x{height}")
    return frame


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--segments-dir", required=True)
    ap.add_argument("--output", required=True)
    ap.add_argument("--chapter-cards-output", required=True)
    ap.add_argument("--qa", required=True)
    ap.add_argument("--production-report", required=True)
    ap.add_argument("--audit", required=True)
    args = ap.parse_args()

    root = Path(__file__).resolve().parents[1]
    video = Path(args.video)
    segments_dir = Path(args.segments_dir)
    output = Path(args.output)
    cards_output = Path(args.chapter_cards_output)
    qa_path = Path(args.qa)
    production_path = Path(args.production_report)
    audit_path = Path(args.audit)
    for path in [video, qa_path, production_path]:
        if not path.is_file():
            raise FileNotFoundError(path)

    reports, scenes = load_reports(segments_dir)
    cards = load_card_spec(root)

    motion_path = root / "format_v2" / "config" / "scene_motion_map.json"
    motion_data = json.loads(motion_path.read_text(encoding="utf-8"))
    motion_entries = motion_data.get("entries", [])
    motion_ids = [x.get("scene_id") for x in motion_entries]
    if motion_ids != EXPECTED_SCENES:
        raise ValueError("Motion map does not contain S001-S088 in exact order")
    motions = {x["scene_id"]: x["motion"] for x in motion_entries}
    no_three_repeats = not any(
        motion_entries[i]["motion"] == motion_entries[i + 1]["motion"] == motion_entries[i + 2]["motion"]
        for i in range(len(motion_entries) - 2)
    )

    cap = cv2.VideoCapture(str(video))
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open final video: {video}")
    fps = float(cap.get(cv2.CAP_PROP_FPS))
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if fps <= 0 or frame_count <= 0:
        raise RuntimeError("Final video has invalid frame-rate/frame-count metadata")
    video_duration = frame_count / fps
    narration_duration = sum(float(s["duration"]) for s in scenes)
    card_duration_total = sum(float(cards[ch]["duration"]) for ch in CHAPTER_ORDER)
    expected_duration = narration_duration + card_duration_total
    duration_delta = abs(video_duration - expected_duration)
    if duration_delta > 0.30:
        raise RuntimeError(
            "Final video duration does not align with scene narration plus chapter cards: "
            f"video={video_duration:.3f}s expected={expected_duration:.3f}s"
        )

    scene_sheet = Image.new(
        "RGB",
        (SCENE_COLS * THUMB_W, SCENE_ROWS * (THUMB_H + LABEL_H)),
        (16, 16, 16),
    )
    scene_draw = ImageDraw.Draw(scene_sheet)
    card_sheet = Image.new(
        "RGB",
        (3 * CARD_W, 2 * (CARD_H + CARD_LABEL_H)),
        (16, 16, 16),
    )
    card_draw = ImageDraw.Draw(card_sheet)
    font = ImageFont.load_default()

    elapsed = 0.0
    audit_scenes = []
    audit_cards = []
    band_black_ratios = []
    scene_index = 0

    for chapter_index, chapter in enumerate(CHAPTER_ORDER):
        card_duration = float(cards[chapter]["duration"])
        card_sample_time = elapsed + card_duration - 0.4
        card_frame = sample_frame(cap, card_sample_time, f"{chapter} chapter card")
        card_thumb = Image.fromarray(cv2.cvtColor(card_frame, cv2.COLOR_BGR2RGB)).resize(
            (CARD_W, CARD_H), Image.Resampling.LANCZOS
        )
        card_x = (chapter_index % 3) * CARD_W
        card_y = (chapter_index // 3) * (CARD_H + CARD_LABEL_H)
        card_sheet.paste(card_thumb, (card_x, card_y + CARD_LABEL_H))
        card_draw.text(
            (card_x + 8, card_y + 8),
            f"{chapter} card | {card_sample_time:.2f}s",
            font=font,
            fill=(245, 245, 245),
        )
        audit_cards.append({
            "chapter": chapter,
            "label": cards[chapter]["label"],
            "title": cards[chapter]["title"],
            "duration_seconds": round(card_duration, 4),
            "sample_seconds": round(card_sample_time, 3),
        })
        elapsed += card_duration

        for scene in reports[chapter]["scenes"]:
            duration = float(scene["duration"])
            midpoint = elapsed + duration / 2.0
            frame = sample_frame(cap, midpoint, scene["scene"])
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            thumb = Image.fromarray(rgb).resize(
                (THUMB_W, THUMB_H), Image.Resampling.LANCZOS
            )
            x = (scene_index % SCENE_COLS) * THUMB_W
            y = (scene_index // SCENE_COLS) * (THUMB_H + LABEL_H)
            scene_sheet.paste(thumb, (x, y))
            scene_draw.text(
                (x + 6, y + THUMB_H + 5),
                f"{scene['scene']}  {midpoint:7.1f}s",
                font=font,
                fill=(245, 245, 245),
            )

            band = frame[950:1080, :, :]
            gray = cv2.cvtColor(band, cv2.COLOR_BGR2GRAY)
            black_ratio = float((gray < 25).mean())
            band_black_ratios.append(black_ratio)
            audit_scenes.append({
                "scene": scene["scene"],
                "chapter": chapter,
                "chapter_midpoint_seconds": round(midpoint, 3),
                "source_voice_duration_seconds": round(duration, 4),
                "motion": motions[scene["scene"]],
                "subtitle_band_black_ratio": round(black_ratio, 4),
            })
            elapsed += duration
            scene_index += 1

    cap.release()
    if scene_index != 88 or len(audit_cards) != 6:
        raise RuntimeError(f"Unexpected contact-sheet counts: scenes={scene_index}, cards={len(audit_cards)}")

    output.parent.mkdir(parents=True, exist_ok=True)
    cards_output.parent.mkdir(parents=True, exist_ok=True)
    audit_path.parent.mkdir(parents=True, exist_ok=True)
    scene_sheet.save(output, format="JPEG", quality=90, optimize=True)
    card_sheet.save(cards_output, format="JPEG", quality=90, optimize=True)

    band_min = min(band_black_ratios)
    qa = json.loads(qa_path.read_text(encoding="utf-8"))
    checks = qa.setdefault("checks", {})
    checks["contact_sheet_88_scene_midpoints"] = True
    checks["contact_sheet_scene_order_matches_S001_S088"] = True
    checks["contact_sheet_duration_alignment_includes_six_cards"] = duration_delta <= 0.30
    checks["chapter_card_contact_sheet_6_cards"] = len(audit_cards) == 6
    checks["subtitle_band_black_coverage_at_scene_midpoints"] = band_min >= 0.85
    checks["motion_map_88_scenes"] = motion_ids == EXPECTED_SCENES
    checks["motion_map_no_three_consecutive_repeats"] = no_three_repeats
    qa["passed"] = all(bool(value) for value in checks.values())
    if not qa["passed"]:
        raise RuntimeError("Final QA report did not pass after contact-sheet repair")

    qa["contact_sheet"] = {
        "file": str(output),
        "frames": 88,
        "layout": "11x8",
        "sampling": "one final-master frame at each scene narration midpoint; six chapter-card durations included in offsets",
        "scene_order": "S001-S088",
        "video_duration_seconds": round(video_duration, 3),
        "expected_duration_seconds": round(expected_duration, 3),
        "duration_delta_seconds": round(duration_delta, 3),
        "dimensions": list(scene_sheet.size),
        "subtitle_band_black_ratio_min": round(band_min, 4),
        "subtitle_band_black_ratio_average": round(sum(band_black_ratios) / len(band_black_ratios), 4),
    }
    qa["chapter_cards_contact_sheet"] = {
        "file": str(cards_output),
        "frames": 6,
        "layout": "3x2",
        "sampling": "one final-master frame 0.4 seconds before each chapter card ends",
        "dimensions": list(card_sheet.size),
    }

    qa_path.write_text(json.dumps(qa, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    production_path.write_text(json.dumps(qa, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    audit = {
        "passed": True,
        "method": "sample final master at each scene midpoint and at the end of each chapter-card sequence",
        "scene_count": len(audit_scenes),
        "scene_order": [x["scene"] for x in audit_scenes],
        "chapter_card_count": len(audit_cards),
        "chapter_cards": audit_cards,
        "video_duration_seconds": round(video_duration, 3),
        "voice_report_duration_seconds": round(narration_duration, 3),
        "chapter_card_duration_seconds": round(card_duration_total, 3),
        "expected_duration_seconds": round(expected_duration, 3),
        "duration_delta_seconds": round(duration_delta, 3),
        "subtitle_band_black_ratio_min": round(band_min, 4),
        "subtitle_band_black_ratio_average": round(sum(band_black_ratios) / len(band_black_ratios), 4),
        "motion_map_no_three_consecutive_repeats": no_three_repeats,
        "scene_contact_sheet": str(output),
        "chapter_cards_contact_sheet": str(cards_output),
        "scenes": audit_scenes,
    }
    audit_path.write_text(json.dumps(audit, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "passed": True,
        "scene_count": len(audit_scenes),
        "chapter_card_count": len(audit_cards),
        "duration_delta_seconds": round(duration_delta, 3),
        "subtitle_band_black_ratio_min": round(band_min, 4),
        "scene_contact_sheet": str(output),
        "chapter_cards_contact_sheet": str(cards_output),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
