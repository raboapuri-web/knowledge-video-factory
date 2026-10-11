#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
R=Path(__file__).resolve().parents[1]
plan=json.loads((R/'content/storyboard.json').read_text());ss=json.loads((R/'content/scenes.json').read_text())
errors=[]
if len(ss)!=48:errors.append('Scene count must be 48')
if len({s['id'] for s in ss})!=len(ss):errors.append('Duplicate scene IDs')
for chapter in plan['chapters']:
 slug=chapter['slug'];src=''.join(x.strip() for x in re.split(r'\n\s*\n',(R/'content/revised'/f'{slug}.txt').read_text()) if x.strip())
 joined=''.join(s['narration'] for s in ss if s['chapter']==slug)
 if src!=joined:errors.append('Narration coverage mismatch '+slug)
 for s in [x for x in ss if x['chapter']==slug]:
  if ''.join(c['text'] for c in s['cues'])!=s['narration']:
   # segment() preserves character order but strips whitespace outside sentence punctuation;
   # only Japanese fullstop punctuation delimiters are legal and no raw newlines exist.
   errors.append('Cue/source mismatch '+s['id'])
  if len(s['events'])<3:errors.append('Missing semantic action '+s['id'])
  if len(s['events'])!=len(set(s['events'])):errors.append('Repeated motion within shot '+s['id'])
  for c in s['cues']:
   if len(c['display'].split('\n'))>2 or any(len(x)>18 for x in c['display'].split('\n')):errors.append('Subtitle overflow '+s['id'])
   if '\\n' in c['display']:errors.append('Literal backslash-n '+s['id'])
  if not (R/'src/scenes'/f"{s['id']}.tsx").exists():errors.append('Scene file absent '+s['id'])
source=(R/'src/lib/director.tsx').read_text()
if source.count('view.add(')!=4:errors.append('One-time layer initialization violated')
if 'view.add(contentLayer);view.add(chapterUI);view.add(subtitleBacking);view.add(subtitleLayer);' not in source:errors.append('Wrong subtitle z-order')
if 'durationSource' not in source or 'VOICEVOX_MEASURED' not in source:errors.append('Measured timing guard absent')
if not any('zoo_study_page' in e for x in ss for e in x['events']):errors.append('Research reenactment missing')
if not any('new_questions' in e for x in ss for e in x['events']):errors.append('Closing semantic reversal missing')
status={'status':'PASS' if not errors else 'FAIL','scenes':len(ss),'cues':sum(len(s['cues']) for s in ss),'semantic_events':sum(len(s['events']) for s in ss),'previewOnlySeconds':sum(s['duration'] for s in ss),'errors':errors}
(R/'qa').mkdir(exist_ok=True);(R/'qa/static_qa.json').write_text(json.dumps(status,ensure_ascii=False,indent=2))
print(json.dumps(status,ensure_ascii=False,indent=2));sys.exit(bool(errors))
