#!/usr/bin/env python3
"""Validate chapter title headings are excluded while all body narration is preserved."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BOARD = json.loads((ROOT / "content/board.json").read_text(encoding="utf-8"))
CHAPTER_HEADING_RE = re.compile(
    r"^\s*##\s*(?:プロローグ|第[0-9０-９]+章|エピローグ)(?:\s*[｜|：:]\s*|\s+).+$"
)


def expected_narration(source):
    kept = []
    removed = []
    for line in source.splitlines():
        if CHAPTER_HEADING_RE.match(line):
            removed.append(line.strip())
        else:
            kept.append(line)
    text = "\n".join(kept)
    text = re.sub(r"(?m)^##\s*", "", text)
    text = text.replace("**", "")
    return text.strip(), removed


def normalized(text):
    return re.sub(r"\s+", "", text)


def main(chapter):
    spec = next((x for x in BOARD["chapters"] if x["id"] == chapter), None)
    if not spec:
        raise SystemExit("unknown chapter: " + chapter)

    board_scenes = [
        s for s in BOARD["scenes"]
        if spec["start"] <= int(s["id"][1:]) <= spec["end"]
    ]
    report_path = ROOT / "media" / f"voice-report-{chapter}.json"
    if not report_path.is_file():
        raise FileNotFoundError(report_path)
    voice_report = json.loads(report_path.read_text(encoding="utf-8"))
    voice_scenes = voice_report.get("scenes", [])
    errors = []
    if [x["id"] for x in board_scenes] != [x.get("scene") for x in voice_scenes]:
        errors.append("voice report scene order/count differs from board")

    removed_all = []
    first_caption = ""
    first_scene_id = ""
    body_preserved = True
    all_headings_absent = True

    for index, (source_scene, voice_scene) in enumerate(zip(board_scenes, voice_scenes)):
        expected_text, expected_removed = expected_narration(source_scene["script"])
        actual_text = voice_scene.get("narration_text", "")
        actual_removed = voice_scene.get("removed_chapter_headings", [])
        if actual_text != expected_text:
            body_preserved = False
            errors.append(f"{source_scene['id']}: narration differs from board body after heading-only removal")
        if actual_removed != expected_removed:
            errors.append(f"{source_scene['id']}: removed heading audit does not match board")
        removed_all.extend(expected_removed)

        for heading in expected_removed:
            title_text = re.sub(r"^##\s*", "", heading).strip()
            if title_text and title_text in actual_text:
                all_headings_absent = False
                errors.append(f"{source_scene['id']}: chapter heading remains in narration text")
            if title_text and any(title_text in cue.get("text", "") for cue in voice_scene.get("captions", [])):
                all_headings_absent = False
                errors.append(f"{source_scene['id']}: chapter heading remains in subtitle cues")

        cues = voice_scene.get("captions", [])
        if normalized("".join(c.get("text", "") for c in cues)) != normalized(actual_text):
            errors.append(f"{source_scene['id']}: subtitle cues do not preserve narration text")
        if index == 0:
            first_scene_id = voice_scene.get("scene", "")
            first_caption = cues[0].get("text", "") if cues else ""
            if not first_caption:
                errors.append("first scene has no first subtitle")
            elif CHAPTER_HEADING_RE.match(first_caption):
                errors.append("first subtitle is still a chapter heading")
            elif not actual_text.startswith(first_caption):
                errors.append("first subtitle is not the beginning of the body narration")

    if len(removed_all) != 1:
        errors.append(f"expected exactly one chapter heading line in {chapter}, found {len(removed_all)}")

    result = {
        "chapter": chapter,
        "passed": not errors,
        "scene_count": len(voice_scenes),
        "removed_heading_count": len(removed_all),
        "removed_heading_lines": removed_all,
        "first_scene": first_scene_id,
        "first_subtitle": first_caption,
        "first_subtitle_is_body": bool(first_caption) and not CHAPTER_HEADING_RE.match(first_caption),
        "body_text_preserved": body_preserved,
        "title_lines_absent_from_voice_and_subtitles": all_headings_absent,
        "errors": errors,
    }
    out = ROOT / "media" / f"narration-qa-{chapter}.json"
    out.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if errors:
        raise SystemExit("chapter narration QA failed")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("usage: validate_chapter_narration.py <chapter>")
    main(sys.argv[1])
