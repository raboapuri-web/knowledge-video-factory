"""Numerically audit consecutive decoded frames in every moving scene.

This checks actual final MP4 frames, not the source still or the nominal fps.
For each non-static scene it probes three separate 0.8-second windows; a 10fps
animation held for 3 frames is detected as repeated near-zero adjacent diffs.
"""
from __future__ import annotations

import cv2
import numpy as np

FPS = 30
MOVING_MOTIONS = {
    "zoom_in", "zoom_out", "pan_left", "pan_right", "pan_up", "pan_down"
}


def _sample_window(cap, start_sec: float, count: int = 26) -> dict:
    cap.set(cv2.CAP_PROP_POS_MSEC, start_sec * 1000.0)
    differences = []
    previous = None
    for _ in range(count):
        ok, bgr = cap.read()
        if not ok:
            raise RuntimeError(f"Could not decode {count} consecutive frames at {start_sec:.3f}s")
        # Exclude the fixed black subtitle band: only measure the moving image.
        image = bgr[190:850, 250:1670]
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        if previous is not None:
            differences.append(float(cv2.mean(cv2.absdiff(gray, previous))[0]))
        previous = gray
    data = np.asarray(differences, dtype=np.float64)
    q25, q50, q75, q90 = [float(np.percentile(data, q)) for q in (25, 50, 75, 90)]
    threshold = max(0.003, 0.10 * q75)
    low = int(np.sum(data < threshold))
    # Relative threshold avoids false positives on dark / low-contrast sources.
    # Accept a single near-zero transition due to codec/texture; reject
    # frame-hold patterns (e.g. two of every three frames unchanged).
    passed = (low <= 1 and q50 >= 0.012 and
              q90 / max(q25, 1e-5) <= 6.0)
    return {
        "start_seconds": round(start_sec, 3),
        "adjacent_pairs": len(differences),
        "mean_absolute_luma_difference": round(float(data.mean()), 5),
        "median_difference": round(q50, 5),
        "minimum_difference": round(float(data.min()), 5),
        "q25": round(q25, 5), "q75": round(q75, 5), "q90": round(q90, 5),
        "near_held_pairs": low, "hold_threshold": round(threshold, 5),
        "passed": bool(passed)
    }


def audit_30fps_motion(master_path, timeline: list[dict]) -> dict:
    cap = cv2.VideoCapture(str(master_path))
    if not cap.isOpened():
        raise RuntimeError(f"Cannot open final MP4 for 30fps motion QA: {master_path}")
    records = []
    failures = []
    try:
        for item in timeline:
            if item.get("kind") != "scene" or item.get("motion") not in MOVING_MOTIONS:
                continue
            duration = float(item["end"] - item["start"])
            if duration < 2.0:
                failures.append({"scene": item["scene"], "reason": "scene too short to audit"})
                continue
            window_seconds = 26.0 / FPS
            # Three non-overlapping windows distributed across the scene.
            # Moving scenes use every original 30fps frame within each window.
            starts = [
                float(item["start"]) + max(0.15, duration * p - window_seconds / 2)
                for p in (0.20, 0.50, 0.80)
            ]
            last_start = float(item["end"]) - window_seconds - 0.15
            starts = sorted(set(round(min(x, last_start), 4) for x in starts))
            windows = []
            for start in starts:
                try:
                    windows.append(_sample_window(cap, start))
                except Exception as exc:
                    windows.append({"start_seconds": round(start, 3), "passed": False,
                                    "error": str(exc)})
            passed = bool(windows and all(w.get("passed") for w in windows))
            rec = {
                "scene_id": item["scene"], "motion": item["motion"],
                "duration_seconds": round(duration, 3),
                "windows": windows, "passed": passed
            }
            records.append(rec)
            if not passed:
                failures.append(rec)
    finally:
        cap.release()
    return {
        "method": "three separate 26-frame windows per non-static scene; adjacent decoded frame luma differences, excluding subtitle band",
        "fps": FPS, "moving_scenes_audited": len(records),
        "windows_audited": sum(len(r["windows"]) for r in records),
        "adjacent_frame_pairs_audited": sum(w.get("adjacent_pairs", 0) for r in records for w in r["windows"]),
        "passed": bool(records and not failures),
        "failure_count": len(failures), "failures": failures,
        "scenes": records
    }
