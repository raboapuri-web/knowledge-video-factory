# V82 production contract

Working title: 転売をなくす方法はあるのか？【行動経済学×市場経済×ゲーム理論×メカニズムデザイン】

Use the original 13-act historical/economic story, narrated by VOICEVOX 青山龍星. Every beat is a contiguous Japanese sentence from the saved V82 script, with measured timing from generated voice audio. Never pad the output by repeating an illustration or changing speech content to hit a nominal runtime.

Worlds: Tokyo bedroom with notebook and ticket queue; nineteenth-century New York theatre exterior; limited-quantity shop; capacity-limited concert hall; contemporary cafe price comparison; postwar Japanese market (historical illustrative only); rock concert and transaction research; official resale office; game shop and allocated stock; first-come queue and lottery; identity-verification counter; used bookstore; Tokyo final night official resale. Each phase has a custom vector set and props. Within each 1–2-beat continuity group, a stable background with animated foreground; on the next group, adjust camera, architectural set dressing and staging. Do not reuse nonconsecutive background group IDs.

Do not claim 13 phases are 13 individually animated backgrounds; more than 85 continuity groups each have a deterministic unique dressing/camera framing. Target 170–380 micro-scenes without generic unillustrated placeholders.

Pipeline: Preflight source, scene count and phase presence -> TS typecheck -> 13+ preview frames (each story world at least once) -> VOICEVOX generated exactly once -> check each audio beat and total duration -> 8 H.264 render segments -> stitch with measured VO, understated BGM and subtitle overlay -> ffprobe integrity and video/audio durations -> contact sheet -> publish release. Fail fast on missing scenes, missing voice or short/long audio mismatch. Mark full-film QA as automated, not human-reviewed.

Resolution: 1920x1080, 30fps. Speaker VOICEVOX 青山龍星 normal, 1.13 speed. Release only following successful automated QA.