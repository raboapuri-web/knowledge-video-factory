# V154 production handoff

The user explicitly approved the visual/material gate on 2026-11-13 and instructed production to proceed.

- Source images: assets/final/S001.jpg through S090.jpg only.
- Do not use assets/collected or assets/generated (including prior SVG illustrations).
- Special blurred-background layout: S018, S028, S032, S057, S090.
- S001: retain board narration/subtitle text exactly; TTS input alone replaces 少し with すこし.
- Chapter title cards: eight, silent except for original typing SFX; title strings excluded from narration and subtitles.
- VOICEVOX: 青山龍星, speaker ID 13.
- Video: 1920x1080, 30fps, H.264/AAC.
- Subtitle band: fixed opaque black band at bottom, y=950, height=130; subtitles composited after image motion.
- BGM: none, per explicit user instruction.
- The pre-existing rights-collector asset_gate.json is historical and remains unchanged. The production preflight independently verifies the user-approved final directory and writes render_gate.json.
- Chapter rendering runs only after the preflight job passes. Finalization and GitHub Release publication run only after all eight chapter jobs succeed and final QA passes.
