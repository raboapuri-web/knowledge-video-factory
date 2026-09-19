# Production Preflight Policy

This repository uses a staged production flow for new knowledge videos.

## Mandatory flow

1. Build or edit a video on a `work/vNN-*` branch. Do not develop a new production directly on `main`.
2. When the video package is internally complete, create a `production/vNN-*` branch from that exact tested commit.
3. The reusable `Production Preflight` workflow must pass before the change is merged to `main`.
4. Only a preflight-passed commit may be merged to `main`, where the expensive full production workflow can start.
5. Never make a failing workflow green by weakening scene-count, duration, pronunciation, uniqueness, contact-sheet, or no-fallback quality gates.

## Preflight requirements

The preflight gate materializes the generated video package and checks:

- npm dependency installation
- TypeScript/TSX compilation
- preproduction-plan generation
- Production QA (pre)
- shared pronunciation regression
- required generated file paths
- no stale version-specific BGM timing path
- script-data / scene-data length agreement
- unique visual keys
- no non-consecutive background-group reuse

## Version isolation rules

- A new video may reuse shared infrastructure, but generated scripts must resolve paths relative to their own materialized video directory.
- Do not copy a prior video's hard-coded target directory into BGM, VOICEVOX, sync, QA, release, or render scripts.
- Version-specific composition IDs, video IDs, release tags, output names, and working directories must all agree.
- A background group may remain static across a short continuous shot, but must not be reintroduced later as recycled footage.

## Quality preservation

Preflight is a failure-prevention layer, not a shortcut. It must not reduce:

- narration density or academic content
- number or specificity of scene visuals
- motion complexity
- measured VOICEVOX timing
- subtitle synchronization
- pronunciation checks
- final scene-complete contact-sheet QA
- final Release asset checks

If a duration gate fails, first correct narration pace or script structure while preserving the argument. Do not relax the gate merely to publish.
