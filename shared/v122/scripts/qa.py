#!/usr/bin/env python3
import json,re,pathlib,sys,collections
R=pathlib.Path(__file__).resolve().parents[1]
ss=json.loads((R/'content/scenes.json').read_text())
vp=json.loads((R/'content/visual_plan.json').read_text())
errors=[];warn=[];ids=set();chapters=collections.defaultdict(list)
for s in ss:
 if s['id'] in ids:errors.append('duplicated scene '+s['id'])
 ids.add(s['id']);chapters[s['chapter']].append(s)
 if s['motif'] not in vp:errors.append('missing visual plan '+s['id'])
 if not (s['cues'] and s['duration']>5):errors.append('missing cues/duration '+s['id'])
 if any(c['end']<=c['start'] for c in s['cues']):errors.append('bad cue duration '+s['id'])
 if abs(s['cues'][-1]['end']-s['duration'])>0.06:errors.append('audio mismatch '+s['id'])
 for c in s['cues']:
  lines=c['display'].split('\n')
  if len(lines)>2 or any(len(z)>19 for z in lines):errors.append('subtitle overflow '+s['id'])
  if '\\n' in c['display']:errors.append('literal escaped newline '+s['id'])
 if s['durationSource']!='VOICEVOX_MEASURED':warn.append(s['id']+' uses estimated durations')
 if not (R/'src/scenes'/f"{s['id']}.tsx").exists():errors.append('missing scene source '+s['id'])
if len(ss)!=45:errors.append('expected 45 meaning scenes, got '+str(len(ss)))
if len(chapters)!=9:errors.append('expected 9 render units, got '+str(len(chapters)))
expected={'prologue','chapter1','chapter2','chapter3','chapter4','chapter5','chapter6','chapter7','epilogue'}
if set(chapters)!=expected:errors.append('unexpected chapter set '+str(sorted(chapters)))
if len(vp)!=45:errors.append('expected 45 visual plans, got '+str(len(vp)))
motifs=[s['motif'] for s in ss]
if len(set(motifs))!=45:errors.append('motifs must be unique')
for m in motifs:
 p=vp.get(m,{})
 if len(p.get('labels',[]))!=8:errors.append('visual plan must contain 8 semantic states '+m)
 if not p.get('kind') or not p.get('motion'):errors.append('missing kind/motion '+m)
for a,b in zip(ss,ss[1:]):
 if a['motif']==b['motif']:errors.append('adjacent repeated motif '+b['id'])
source=(R/'src/lib/meaningScene.tsx').read_text()
if 'const contentLayer' not in source or 'const subtitleTextLayer' not in source:errors.append('missing subtitle separation')
if source.find('contentLayer')>source.find('subtitleTextLayer'):errors.append('unexpected z-order declarations')
if len(re.findall(r'view\.add\(',source))!=4:errors.append('unexpected root view.add usage')
if 'for(let i=0;i<8;i++)' not in source:errors.append('V122 requires 8 visual states per meaning scene')
if "hash(scene.motif" not in source:errors.append('V122 requires motif-seeded variation')
report={'status':'BLOCKED' if errors else ('MEASURED_PENDING' if warn else 'READY_FOR_SMOKE_QA'),
 'scene_count':len(ss),'chapter_count':len(chapters),'visual_beats':len(ss)*8,
 'subtitle_cues':sum(len(s['cues']) for s in ss),'seconds':round(sum(s['duration'] for s in ss),2),
 'errors':errors,'timing_blockers':warn[:5]+(['...'] if len(warn)>5 else [])}
(R/'qa').mkdir(parents=True,exist_ok=True)
(R/'qa/static_qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(2 if errors else 0)
