#!/usr/bin/env python3
"""Validate V153 format-v2 motion assignments against S001-S088."""
import json, sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
MAP = HERE / "config" / "scene_motion_map.json"
ALLOWED = {"zoom_in", "zoom_out", "pan_right", "pan_left", "pan_up", "pan_down", "static"}
data = json.loads(MAP.read_text(encoding="utf-8"))
entries = data.get("entries", [])
expected = [f"S{i:03d}" for i in range(1, 89)]
actual = [x.get("scene_id") for x in entries]
errors = []
if actual != expected:
    errors.append("scene IDs must be exactly S001-S088 in order")
for x in entries:
    if x.get("motion") not in ALLOWED:
        errors.append(f"{x.get('scene_id')}: unsupported motion {x.get('motion')}")
    if not (0.0 < float(x.get("scale_from", 0)) <= 2.0 and 0.0 < float(x.get("scale_to", 0)) <= 2.0):
        errors.append(f"{x.get('scene_id')}: invalid scale")
for i in range(2, len(entries)):
    a,b,c = entries[i-2:i+1]
    if a.get("motion") == b.get("motion") == c.get("motion"):
        errors.append(f"three consecutive {c['motion']} at {a['scene_id']}-{c['scene_id']}")
if errors:
    print("MOTION_MAP_INVALID")
    print("\n".join(errors))
    raise SystemExit(1)
print("MOTION_MAP_OK", len(entries), "scenes")
