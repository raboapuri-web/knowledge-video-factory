#!/usr/bin/env python3
"""V123 physical-motion anti-repetition validation."""
from pathlib import Path
from collections import Counter
import json,sys,re
R=Path(__file__).resolve().parents[1]
plan=json.loads((R/'content/physical-performances-v3.json').read_text(encoding='utf8'))
boards=json.loads((R/'content/storyboard-v2.json').read_text(encoding='utf8'))
rows=plan['shots']
expected=['PTABCDFE'[i]+f'{j:02d}' for i,c in enumerate(boards['chapters']) for j,_ in enumerate(c['shots'])]
errors=[]
if len(rows)!=86 or sorted(x['id'] for x in rows)!=sorted(expected):errors.append('86 storyboard IDs do not match')
signatures=[(x['set'],','.join(x['actors']),','.join(x['events']),x['lens']) for x in rows]
if len(set(signatures))!=len(rows):errors.append('duplicate physical performance')
movement=[','.join(x['events']) for x in rows]
if len(set(movement))!=len(rows):errors.append('duplicate complete animation sequence')
actor_kinds=set(y for x in rows for y in x['actors'])
sets=set(x['set'] for x in rows)
if len(actor_kinds)<40:errors.append('few unique physical props')
if len(sets)<20:errors.append('few distinct physical locations')
for x in rows:
 if len(x['actors'])!=3 or len(x['events'])!=4:errors.append(x['id']+' bad storyboard act count')
 for a in x['events']:
  m=re.fullmatch(r'([012])\.([a-z-]+)',a)
  if not m:errors.append(x['id']+' malformed physical event '+a)
 if not x.get('direction'):errors.append(x['id']+' missing director-written scene action')
txt=(R/'src/lib/meaningScene.tsx').read_text()
director=(R/'src/lib/physicalDirector.tsx').read_text()
if 'yield* playPhysicalScene(view,scene);' not in txt:errors.append('render still uses previous generic movement')
for field in ('physicalPerformance','function* act','function backdrop','function makePuppet','const caption=label(subtitleLayer','view.add(worldLayer);view.add(titleLayer);view.add(backLayer);view.add(subtitleLayer)'):
 if field not in director:errors.append('missing functional director detail: '+field)
report={'passed':not errors,'total_scenes':len(rows),'actor_types':len(actor_kinds),'different_environments':len(sets),'unique_action_sequences':len(set(movement)),'errors':errors}
(R/'qa').mkdir(exist_ok=True)
(R/'qa/physical_qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
if errors:sys.exit(2)
