#!/usr/bin/env python3
"""V136 strict scene source, timing, safe-area and deliverable audit."""
from pathlib import Path
import json,re,sys,subprocess,statistics
R=Path(__file__).resolve().parents[1]
ORDER=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue']
def pre():
  src=(R/'content/manuscript.md').read_text(encoding='utf-8')
  scenes=json.loads((R/'content/scenes.json').read_text(encoding='utf-8'))
  assert len(scenes)>=78,len(scenes)
  assert len(set(s['id'] for s in scenes))==len(scenes)
  assert len(set(s['visual'] for s in scenes))>=21
  # All narrated paragraphs exactly equal the authored manuscript (headings omitted).
  expected=re.sub(r'(?m)^# .*(\n|$)','',src)
  expected=re.sub(r'\s+','',expected)
  actual=re.sub(r'\s+','',''.join(s['narration'] for s in scenes))
  assert actual==expected,(len(actual),len(expected))
  for s in scenes:
    assert s['chapter'] in ORDER and s['cues']
    assert ''.join(c['text'] for c in s['cues'])==s['narration']
    assert s['duration']>0
    assert len(s['narration'])<=150,s['id']
    assert s['note'] and len(s['note'])<=22
    for cue in s['cues']:
      assert '\\n' not in cue['display']
      assert len(cue['display'].split('\n'))<=2
      assert max(map(len,cue['display'].split('\n')))<=16
  source=(R/'src/lib/director.tsx').read_text(encoding='utf-8')
  assert 'VOICEVOX_MEASURED' in source
  assert source.index('view.add(content)')<source.index('view.add(subtitle)')
  # Meaning-specific visual requirements: all families have an authored renderer.
  for family in set(s['visual'] for s in scenes):
    assert f"v==='{family}'" in source,family
  assert all(any(s['chapter']==ch for s in scenes) for ch in ORDER)
  d={'status':'PASS','sourceCharacters':len(expected),'scenes':len(scenes),
     'narrationCoverage':1.0,'visualFamilies':len(set(s['visual'] for s in scenes)),
     'chapters':{ch:sum(s['chapter']==ch for s in scenes) for ch in ORDER},
     'subtitleCues':sum(len(s['cues']) for s in scenes),
     'productionWarnings':['Automated tests do not certify editorial quality or factual interpretations']}
  (R/'qa').mkdir(exist_ok=True)
  (R/'qa/preflight.json').write_text(json.dumps(d,ensure_ascii=False,indent=2),encoding='utf-8')
  print('V136_PREFLIGHT',d)
def final(path):
  p=Path(path);assert p.is_file() and p.stat().st_size>2000000
  d=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate','-of','json',str(p)]))
  secs=float(d['format']['duration'])
  v=next(x for x in d['streams'] if x.get('codec_type')=='video')
  a=next(x for x in d['streams'] if x.get('codec_type')=='audio')
  assert secs>=480,(secs,'too short')
  assert (v['width'],v['height'])==(1920,1080)
  assert v['codec_name']=='h264' and v['r_frame_rate']=='30/1'
  assert a['codec_name']=='aac'
  out={'status':'PASS','seconds':secs,'resolution':'1920x1080',
       'fps':30,'videoCodec':'h264','audioCodec':'aac','bytes':p.stat().st_size,
       'editorialReview':'NOT_CERTIFIED'}
  (R/'qa/final.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
  print('V136_FINAL_QA',out)
if __name__=='__main__':
  if len(sys.argv)>1 and sys.argv[1]=='final':final(sys.argv[2])
  else:pre()
