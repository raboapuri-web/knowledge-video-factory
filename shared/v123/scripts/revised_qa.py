#!/usr/bin/env python3
"""Check full-script coverage, uniquely directed scenes and subtitle-over-video layout."""
from pathlib import Path
import json,re,sys
R=Path(__file__).resolve().parents[1];C=R/'content'
plan=json.loads((C/'storyboard-v2.json').read_text());scenes=json.loads((C/'scenes.json').read_text())
pro='--production' in sys.argv;errors=[];chapters=[c['slug'] for c in plan['chapters']]
if chapters!=['prologue','cta','chapter1','chapter2','chapter3','chapter4','chapter5','epilogue']:errors.append('eight chapter order wrong')
if len(scenes)!=86:errors.append('expected 86 meaning scenes')
if len(set(s['id'] for s in scenes))!=len(scenes):errors.append('duplicate IDs')
if len(set(s['direction'] for s in scenes))!=len(scenes):errors.append('direction descriptions repeated')
for chapter in chapters:
 source=(C/'revised'/f'{chapter}.txt').read_text()
 paragraphs=[x.strip() for x in re.split(r'\n\s*\n',source) if x.strip()]
 narr=''.join(s['narration'] for s in scenes if s['chapter']==chapter)
 if narr!=''.join(paragraphs):errors.append(chapter+' altered or missing narration')
 scene_subset=[s for s in scenes if s['chapter']==chapter]
 if not scene_subset:errors.append(chapter+' has no scenes')
 for s in scene_subset:
  if not s['cues'] or s['duration']<=0:errors.append(s['id']+' empty timing')
  if ''.join(c['text'] for c in s['cues'])!=s['narration'].replace(' ',''): # Spaces around punctuation ignored in cues
   norm=lambda t:re.sub(r'\s+','',t)
   if norm(''.join(c['text'] for c in s['cues']))!=norm(s['narration']):errors.append(s['id']+' omitted original characters')
  if pro and s['durationSource']!='VOICEVOX_MEASURED':errors.append(s['id']+' not voiced')
  if not (R/'src/scenes'/f"{s['id']}.tsx").exists():errors.append(s['id']+' missing scene file')
  for c in s['cues']:
   ls=c['display'].split('\n')
   if len(ls)>2 or max(map(len,ls))>19:errors.append(s['id']+' subtitle outside safe width')
   if c['end']<=c['start']:errors.append(s['id']+' invalid cue timing')
   if '\\n' in c['display']:errors.append(s['id']+' literal newline displayed')
  if abs(s['cues'][-1]['end']-s['duration'])>0.03:errors.append(s['id']+' scene/audio drift')
src=(R/'src/lib/meaningScene.tsx').read_text()
for token in ['subtitleTextLayer','const contentLayer','decorateUniqueSet','directedMotion']:
 if token not in src:errors.append('missing video feature '+token)
out={'passed':not errors,'production':pro,'chapters':len(chapters),'scenes':len(scenes),'errors':errors}
(R/'qa').mkdir(exist_ok=True)
(R/'qa'/'revised_qa.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
print(json.dumps(out,ensure_ascii=False,indent=2))
if errors:sys.exit(2)
