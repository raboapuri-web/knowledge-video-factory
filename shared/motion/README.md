# Continuous 30fps motion — permanent factory module

This implementation is the standard for all future knowledge-video-factory videos, not just V154. The V154 re-render introduced it after the 2026-11-14 user decision.

Use `shared/motion/continuous_motion.py:motion_filter(entry, frames)` in each video renderer. Feed it **1920×1080 input frames at 30fps**. The FFmpeg filter uses `perspective=eval=frame` and the FFmpeg `on` counter to compute subpixel positions for **each actual output frame**. It uses bilinear image resampling and does **not** quantize camera coordinates to whole source pixels.

Motion rules: zoom_in 1.00→1.20, zoom_out 1.20→1.00, pan at fixed 1.20 across the full source travel range, static unchanged. No three identical motions in a row. The subtitle layer stays fixed.

**Prohibited:** using `zoompan=d=1`, 10fps camera rendering with 30fps frame duplication, a fixed-step/rounded crop position, or synthesizing held frames with `fps=30`.

QA: `shared/motion/continuous_motion_qa.py` audits consecutive decoded video frames in three separate windows of every moving scene, excluding the stationary subtitle band; it fails when adjacent frame differences show repeated holds. The final video's QA result must be published with the Release.

Referenced authoritative specification: `shared/v154/content/format_v2_spec.md` §2, updated 2026-11-14.
