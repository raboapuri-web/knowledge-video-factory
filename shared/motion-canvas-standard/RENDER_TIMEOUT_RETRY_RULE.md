# Motion Canvas Render Timeout / Retry Standard

All production Motion Canvas chapter renders must be bounded.

## Rule

- Full chapter render timeout: **10 minutes** by default.
- If the render exceeds the limit, terminate the Node/Puppeteer/Chromium process tree.
- Remove or overwrite partial chapter output.
- Retry **once** in a fresh process.
- If the second attempt fails or hangs, stop the workflow and mark only that chapter for investigation.
- Never let one chapter occupy a GitHub runner until the job-level 45–60 minute timeout.

## Standard invocation

```bash
rm -f "output/vXXX-${SLUG}.mp4"
MAX_ATTEMPTS=2 ../motion-canvas-standard/render-with-retry.sh 10m \
  node scripts/render.mjs "$SLUG"
```

A chapter that normally renders in a few minutes should be considered anomalous if it reaches the 10-minute ceiling.

For recovery workflows, reuse already successful chapter artifacts. Do not regenerate voice or rerender successful chapters solely because one chapter hangs.
