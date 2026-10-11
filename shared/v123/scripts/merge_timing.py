#!/usr/bin/env python3
import json,sys
from pathlib import Path
R=Path(__file__).resolve().parents[1]
chap=sys.argv[1]
p=R/'content/scenes.json'
scenes=json.loads(p.read_text());m=json.loads((R/'content'/f'measured-{chap}.json').read_text())
by_id={s['id']:s for s in m}
assert len(by_id)==sum(s['chapter']==chap for s in scenes)
scenes=[by_id.get(s['id'],s) for s in scenes]
assert all(s['durationSource']=='VOICEVOX_MEASURED' for s in scenes if s['chapter']==chap)
p.write_text(json.dumps(scenes,ensure_ascii=False,indent=2))
print('MERGED_TIMINGS',chap,sum(x['duration'] for x in m))
