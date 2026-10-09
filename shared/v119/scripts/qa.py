#!/usr/bin/env python3
import json, re, pathlib, subprocess, sys, math, collections
R=pathlib.Path(__file__).resolve().parents[1]
ss=json.loads((R/'content/scenes.json').read_text());errors=[];warn=[]
ids=set(); chapters=collections.defaultdict(list)
for s in ss:
 if s['id'] in ids:errors.append('duplicated scene '+s['id'])
 ids.add(s['id']);chapters[s['chapter']].append(s)
 if not (s['cues'] and s['duration']>5):errors.append('missing cues/duration '+s['id'])
 if any(c['end']<=c['start'] for c in s['cues']):errors.append('bad cue duration '+s['id'])
 if max(abs(s['cues'][-1]['end']-s['duration']),0)>0.06:errors.append('audio mismatch '+s['id'])
 for c in s['cues']:
  lines=c['display'].split('\n')
  if len(lines)>2 or any(len(z)>19 for z in lines):errors.append('subtitle >2 lines/19 glyphs '+s['id'])
  if '\\n' in c['display']:errors.append('literal escaped newline '+s['id'])
 if s['durationSource']!='VOICEVOX_MEASURED':warn.append(s['id']+' uses estimated durations; production render BLOCKED')
 if not (R/'src/scenes'/f"{s['id']}.tsx").exists():errors.append('missing MC source '+s['id'])
if len(ss)!=38:errors.append('expected 38 meaning scenes, got '+str(len(ss)))
if len(chapters)!=8:errors.append('not eight chapters')
if len({s['motif'] for s in ss})!=len(ss):errors.append('motifs must be unique per meaning scene')
source=(R/'src/lib/meaningScene.tsx').read_text()
if 'const contentLayer' not in source or 'const subtitleTextLayer' not in source:errors.append('missing subtitle separation')
if source.find('contentLayer')>source.find('subtitleTextLayer'):errors.append('unexpected z order declarations')
if len(re.findall(r'view\.add\(',source))!=4:errors.append('unexpected root view.add usage')
report={'status':'BLOCKED' if errors or warn else 'READY_FOR_SMOKE_QA','scene_count':len(ss),'chapter_count':len(chapters),'subtitle_cues':sum(len(s['cues']) for s in ss),'estimated_seconds':round(sum(s['duration'] for s in ss),2),'errors':errors,'blockers':warn[:5]+(['...plus '+str(len(warn)-5)] if len(warn)>5 else [])}
(R/'qa').mkdir(parents=True,exist_ok=True)
(R/'qa/static_qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
if errors:return_code=2
else:return_code=0
sys.exit(return_code)
