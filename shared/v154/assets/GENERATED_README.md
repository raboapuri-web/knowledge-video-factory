# v154 generated illustration delivery

- `assets/generated/S###.svg`: **36 independently authored SVG image files**, each one complete scene.
- SVG canvas: 1920×1080, 16:9, one continuous image per file; no panel split, image grids, text labels, watermarks, or logos.
- The artwork is drawn only through code from each scene's canonical `board.json.generation_prompt`.
- `assets/generated_manifest.json`: records all 36 scene IDs and original generation prompts, as well as the chat-only S012/S015 photo substitute status.
- `assets/asset_manifest.json`: existing Muse image-collection fields are untouched, plus an added `generated_assets` record.
- For a rendering pipeline that needs PNG, run `python shared/v154/scripts/rasterize_generated_svgs.py` after installing CairoSVG/Pillow. This **only converts still-image assets** and does not start chapter/finalize.

Two existing photoreal source-photo substitutes were preserved as original PNGs and delivered via chat attachments:
- S012.png (pond floor sediment, fallen leaves)
- S015.png (sunlit clear pond with aquatic plants)

These two PNG files are **not** in GitHub yet; the remote manifest marks them as chat attachments rather than falsely reporting them uploaded.

S010 and S024 were excluded from this task because the user already obtained their free-source photos.

**Production gate: unchanged and blocked. No chapter/finalize has been executed in this task.**
