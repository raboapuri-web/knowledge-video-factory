#!/usr/bin/env python3
from pathlib import Path
import json,sys
R=Path(__file__).resolve().parents[1];slug=sys.argv[1]
p=R/'content/scenes.json';data=json.loads(p.read_text());measured=json.loads((R/'content'/f'measured-{slug}.json').read_text())
lookup={x['id']:x for x in measured}
assert len(lookup)==sum(s['chapter']==slug for s in data)
updated=[lookup.get(s['id'],s) for s in data]
assert all(s['durationSource']=='VOICEVOX_MEASURED' for s in updated if s['chapter']==slug)
p.write_text(json.dumps(updated,ensure_ascii=False,indent=2))
print('TIMINGS_MERGED',slug)
