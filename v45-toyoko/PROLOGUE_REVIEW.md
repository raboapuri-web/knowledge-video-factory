# v45-toyoko | プロローグ映像プレビュー

- Source of truth: src/toyoko_scene_plan.json (60 scenes / 160 shots).
- This milestone implements ONLY the prologue: P01–P06 / 18 individual story-specific cuts.
- This is a silent picture-lock review, not a completed chapter or the final video. The original approved complete narration script is NOT in this repository. NarrationCue is only a summary and must never be used as a substitute for the final script.
- All 18 preview cut times are the provisional 120 seconds in the storyboard, NOT VOICEVOX-measured timings.
- No subtitles, narration or BGM are fabricated for this silent preview. The definitive VOICEVOX reading, subtitle text and durations cannot be generated until the exact approved narration is stored in src/script-data.json and bound to every shot. Do not claim final audio sync.
- Chapter-by-chapter method: check storyboard IDs and material mappings; animate that chapter; render video and per-cut review frames; inspect and repair; finally compose all six chapters on one Remotion timeline and render once.
- Current storyboard P03-03 transitions from train to town, P05-02/P06-01 animate React door, P06-03 shifts the boy before girl sits. Faceless OTHER_YOUTH uses hideFaceFeatures in the shared hoodie rigs.
- For this preliminary review only, the shared RESEARCHER_MAN is styled in muted street clothes as PASSERBY per user mapping. A street-appropriate design still requires visual confirmation.
- Visual check before accepting: background floor and characters align; camera never crops the action; handoffs are legible; entrance overlay matches architectural door; all P01–P06 continuity and the 18 independent images are checked. Files in CI being generated does not mean these visual checks passed.
- If the entrance door overlay clashes with the background, alter the scene-specific door position/appearance or make a separate doorway plate; do not silently omit the opening action.
- Do not add decorative on-screen words. Approved narration subtitles must be a separate independent topmost layer after audio timing is known.
