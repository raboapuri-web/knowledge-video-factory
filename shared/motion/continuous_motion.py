"""Permanent 30fps subpixel camera motion for every knowledge-video-factory production.

The old zoompan implementation rounded camera coordinates to source pixel positions,
creating held frames despite a nominal 30fps stream. FFmpeg's perspective filter
performs bilinear resampling at fractional source pixel positions per input frame.
Never restore zoompan d=1 or fps-convert a 10fps camera animation to 30fps.
"""
from __future__ import annotations

MOTION_FPS = 30
MOTION_TYPES = frozenset({
    "zoom_in", "zoom_out", "pan_left", "pan_right", "pan_up", "pan_down", "static"
})


def motion_filter(entry: dict, frames: int, fps: int = MOTION_FPS) -> str:
    """Return one filter for a continuously animated, pre-scaled 16:9 image.

    Input must already be scaled and cropped to 1920x1080 and arrive at 30fps.
    The zoom/pan is evaluated for EACH decoded frame (FFmpeg perspective:on).
    Pixel positions are floating-point; resampling is not restricted to integers.
    """
    if fps != 30:
        raise ValueError(f"Continuous camera motion must use 30fps; got {fps}")
    if frames <= 0:
        raise ValueError(f"Frame count must be positive; got {frames}")
    motion = entry["motion"]
    if motion not in MOTION_TYPES:
        raise ValueError(f"Unknown motion {motion}")
    if motion == "static":
        return "format=yuv420p"
    z0 = float(entry["scale_from"])
    z1 = float(entry["scale_to"])
    if z0 < 1.0 or z1 < 1.0:
        raise ValueError("Zoom cannot go below 1.0 (would expose image edges)")
    span = max(1, frames - 1)
    progress = f"(on/{span})"
    if motion in {"zoom_in", "zoom_out"}:
        z = f"({z0:.9f}+({z1-z0:.9f})*{progress})"
        px, py = "0.5", "0.5"
    else:
        if abs(z0 - 1.20) > 1e-6 or abs(z1 - 1.20) > 1e-6:
            raise ValueError("Pan must be at fixed 1.20 zoom")
        z = "1.2"
        if motion == "pan_right":
            px, py = progress, "0.5"
        elif motion == "pan_left":
            px, py = f"(1-{progress})", "0.5"
        elif motion == "pan_up":
            px, py = "0.5", f"(1-{progress})"
        else:
            px, py = "0.5", progress
    left = f"((W-W/{z})*({px}))"
    top = f"((H-H/{z})*({py}))"
    right = f"(W-({left}))"
    bottom = f"(H-({top}))"
    corners = [
        ("x0", left), ("y0", top),
        ("x1", right), ("y1", top),
        ("x2", left), ("y2", bottom),
        ("x3", right), ("y3", bottom),
    ]
    args = ":".join(f"{key}='{value}'" for key, value in corners)
    return ("format=yuv420p,"
            "perspective=eval=frame:sense=source:interpolation=linear:" + args)
