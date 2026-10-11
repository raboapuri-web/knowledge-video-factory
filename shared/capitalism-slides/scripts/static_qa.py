#!/usr/bin/env python3
"""Reject omitted narration, caption overflow, unsafe layouts, or unmeasured production cues."""
from pathlib import Path
import sys,json,re
R=Path(__file__).resolve().parents[1]
ss=json.loads((R/'content/scenes.json').read_text());source=(R/'content/manuscript.txt').read_text()
errors=[];chapters=['prologue','chapter1','chapter2','chapter3','chapter4','chapter5','epilogue']
if len(ss)!=52:errors.append('Expected 52 semantic slides')
if len(set(s['id'] for s in ss))!=len(ss):errors.append('Duplicated slide ID')
if sorted(set(s['chapter'] for s in ss))!=sorted(chapters):errors.append('Chapter mismatch')
sections=[s for s in re.split(r'(?=^【(?:プロローグ|第[1-5]章|エピローグ))',source,flags=re.M) if s.strip() and s.startswith('【')]
all_narr=[]
for slug,section in zip(chapters,sections):
 p=[p.strip().replace('\n','') for p in re.split(r'\n\s*\n',section) if p.strip() and not p.strip().startswith('【')]
 rows=[s for s in ss if s['chapter']==slug]
 if len(rows)!=len(p):errors.append('Paragraph count mismatch '+slug)
 if ''.join(x['narration'] for x in rows)!=''.join(p):errors.append('Verbatim coverage mismatch '+slug)
 for s in rows:
  if ''.join(c['text'] for c in s['cues'])!=s['narration']:errors.append('Text cue mismatch '+s['id'])
  if not (2<=len(s['labels'])<=4):errors.append('No display content '+s['id'])
  if len(s['title'])>22:errors.append('Headline overflow '+s['id'])
  if s.get('metric') and len(s['metric'])>18:errors.append('Stat overflow '+s['id'])
  if not (R/'src/scenes'/f'{slug}.tsx').exists():errors.append('Missing chapter scene '+slug)
  for c in s['cues']:
   ls=c['display'].split('\n')
   if len(ls)>2 or any(len(line)>20 for line in ls):errors.append('Subtitle line too long '+s['id'])
   if '\\n' in c['display']:errors.append('Literal newline characters '+s['id'])
  if s['durationSource']=='VOICEVOX_MEASURED':
   dur=sum(c['end']-c['start'] for c in s['cues'])
   if abs(dur-s['duration'])>0.03:errors.append('Voice duration mismatch '+s['id'])
  all_narr.append(s['narration'])
if len(''.join(all_narr))<7000:errors.append('Manuscript too short')
D=(R/'src/lib/slideDirector.tsx').read_text()
required=['MAX_CONTENT_WIDTH=1580','CONTENT_CENTER_Y=-45','const subtitleLayer=new Node','view.add(slideLayer);view.add(headerLayer);view.add(subtitleBacking);view.add(subtitleLayer);','durationSource','VOICEVOX_MEASURED']
for st in required:
 if st not in D:errors.append('Missing layout/audio guard '+st)
report={'passed':not errors,'slides':len(ss),'narrationCharacters':len(''.join(all_narr)),'subtitleCues':sum(len(s['cues']) for s in ss),'errors':errors,'note':'Geometry and semantic layout static checks; final pixels are also reviewed on contact sheets'}
(R/'qa').mkdir(exist_ok=True)
(R/'qa/static_qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False));sys.exit(bool(errors))
