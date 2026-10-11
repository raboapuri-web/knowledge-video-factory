#!/usr/bin/env python3
"""Independent authored-scene and verbatim manuscript integrity gate."""
from pathlib import Path
import json,sys,re
R=Path(__file__).resolve().parents[1];C=R/'content'
board=json.loads((C/'storyboard.json').read_text());ss=json.loads((C/'scenes.json').read_text())
errors=[]
if len(board['chapters'])!=8:errors.append('Expected 8 complete chapters including CTA')
if len(ss)!=65:errors.append('Expected 65 spoken semantic scenes (CTA camera cue excluded)')
if len({s['id'] for s in ss})!=len(ss):errors.append('Scene IDs not unique')
if len({s['world'] for s in ss})!=len(ss):errors.append('Same scenic background reused')
for ch in board['chapters']:
 slug=ch['slug']
 ps=[p.strip() for p in re.split(r'\n\s*\n',(C/'revised'/f'{slug}.txt').read_text()) if p.strip()]
 rows=[s for s in ss if s['chapter']==slug]
 if len(rows)!=len(ps):errors.append('Chapter shot count mismatch '+slug)
 if ''.join(s['narration'] for s in rows)!=''.join(ps):errors.append('Narration mismatch '+slug)
 if not (R/'src/projects'/f'{slug}.ts').exists():errors.append('No project '+slug)
 for s in rows:
  if not (R/'src/scenes'/f"{s['id']}.tsx").exists():errors.append('Missing shot '+s['id'])
  if ''.join(c['text'] for c in s['cues'])!=''.join(s['narration'].split()):errors.append('Cue transcription mismatch '+s['id'])
  if len(s['events'])<3 or len(s['events'])!=len(set(s['events'])):errors.append('Repeated/missing authored actions '+s['id'])
  for c in s['cues']:
   if '\\n' in c['display']:errors.append('Escaped newline literal '+s['id'])
   if len(c['display'].split('\n'))>2 or any(len(x)>18 for x in c['display'].split('\n')):errors.append('Subtitle overflow '+s['id'])
  if s['durationSource']=='VOICEVOX_MEASURED':
   if abs(s['duration']-sum(c['end']-c['start'] for c in s['cues']))>.03:errors.append('Cue audio drift '+s['id'])
content=(R/'src/lib/director.tsx').read_text()
if 'view.add(content);view.add(actors);view.add(HUD);view.add(backing);view.add(subtitle);' not in content:errors.append('Classic scene subtitle layer not last')
if 'stageFor(content,s.world,index)' not in content:errors.append('Missing individual scenic locations')
if 'VOICEVOX_MEASURED' not in content:errors.append('Measured sound gate missing')
hybrid=(R/'src/lib/hybridDirector.tsx').read_text()
if 'view.add(under);view.add(main);view.add(header);view.add(footer);view.add(caption);' not in hybrid:errors.append('Hybrid subtitles must be the final overlay')
if 'playDiegetic' not in hybrid:errors.append('Diegetic scenes lost')
modes=[s.get('mode') for s in ss]
if modes.count('scene')>10:errors.append('Too many forced illustrative vignettes')
if len(set(modes))<20:errors.append('Insufficient visual expression variety')
if any(modes[i]==modes[i+1]==modes[i+2] for i in range(len(modes)-2)):errors.append('Three consecutive equal visual modes')
for s in ss:
 if not s.get('headline') or len(s.get('labels',[]))<1:errors.append('Missing narration-grounded visual script '+s['id'])
 for q in ['cap-chapter1-09','cap-chapter3-02','cap-chapter3-03','cap-chapter5-02']:
  if s['id']==q and not s.get('source'):errors.append('Quantitative graphic must state source '+q)
if '【CTA映像】' in ''.join(s['narration'] for s in ss):errors.append('Spoken stage direction escaped filtering')
if '主人公が深夜の書斎で一冊の本を開く。' in ''.join(s['narration'] for s in ss):errors.append('CTA visual directions read as audio')
original=(C/'manuscript.txt').read_text()
if '中国' in original and '中国' in ''.join(s['narration'] for s in ss):errors.append('Banned China segment in narrator')
if '資本主義への批判はすべて嘘' not in original:errors.append('Wrong user manuscript')
count=sum(len(s['narration']) for s in ss)
if count<7500:errors.append('Unexpectedly short narration')
status={'status':'PASS' if not errors else 'FAIL','scenes':len(ss),'uniqueWorlds':len({s['world'] for s in ss}),'visualModes':len(set(modes)),'scenicScenes':modes.count('scene'),'characters':count,'cues':sum(len(s['cues']) for s in ss),'errors':errors}
(R/'qa').mkdir(exist_ok=True)
(R/'qa/static_qa.json').write_text(json.dumps(status,ensure_ascii=False,indent=2))
print(json.dumps(status,ensure_ascii=False,indent=2));sys.exit(bool(errors))
