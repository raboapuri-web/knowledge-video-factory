#!/usr/bin/env python3
"""V138 source coverage, storyboard diversity, cue integrity, layout and final MP4 checks."""
from pathlib import Path
import json,re,sys,subprocess
R=Path(__file__).resolve().parents[1]
ORDER=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue']
def preflight():
 src=(R/'content/manuscript.md').read_text(encoding='utf-8')
 scenes=json.loads((R/'content/scenes.json').read_text(encoding='utf-8'))
 audit=json.loads((R/'content/audit.json').read_text(encoding='utf-8'))
 expected=re.sub(r'(?m)^# .*?(\n|$)','',src)
 expected=re.sub(r'\s+','',expected)
 actual=re.sub(r'\s+','',''.join(x['narration'] for x in scenes))
 assert expected==actual,'Narration is not source-faithful'
 assert len(scenes)>=82,len(scenes)
 assert len({x['id'] for x in scenes})==len(scenes)
 assert all(x['chapter'] in ORDER for x in scenes)
 assert len({x['visual'] for x in scenes})>=27,len({x['visual'] for x in scenes})
 assert all(any(x['chapter']==ch for x in scenes) for ch in ORDER)
 assert audit['narrationCoverage']==1.0
 actions=[];identical_neighbors=0
 for i,s in enumerate(scenes):
  assert ''.join(c['text'] for c in s['cues'])==s['narration'],s['id']
  assert s['duration']>0 and len(s['narration'])<=95,s['id']
  if i and scenes[i-1]['visual']==s['visual']:identical_neighbors+=1
  for c in s['cues']:
   assert c['id'].startswith(s['id'])
   assert len(c['display'].split('\n'))<=2
   assert max(map(len,c['display'].split('\n')))<=15
   assert '\\n' not in c['display']
   assert c['end']>c['start']
   assert not re.search('[A-Za-z0-9]',c['speech']),c['speech']
   assert c['action'] in ('reach','swap','reveal','trace','count','split','rotate','sort','pulse','fold','route','assemble')
   actions.append(c['action'])
 assert len(set(actions))>=11
 director=(R/'src/lib/director.tsx').read_text(encoding='utf-8')
 assert 'VOICEVOX_MEASURED' in director
 assert director.index('view.add(content)')<director.index('view.add(subtitle)')
 assert 'const sub=txt(subtitle' in director
 assert '1920,1080' in director
 for v in {x['visual'] for x in scenes}:
  assert ("v==='"+v+"'") in director,('Missing specialized renderer',v)
 assert identical_neighbors <= max(5,len(scenes)//8),identical_neighbors
 report={'status':'PASS','narrationCoverage':1,'sourceCharacters':len(expected),
 'sceneCount':len(scenes),'uniqueVisualTreatments':len(set(x['visual'] for x in scenes)),
 'repeatedAdjacentVisuals':identical_neighbors,'subtitleCues':sum(len(x['cues']) for x in scenes),
 'microActionTypes':len(set(actions)), 'chapters':{c:sum(x['chapter']==c for x in scenes) for c in ORDER},
 'limitations':['Automated checks cannot certify semantic/editorial quality','Human visual review required']}
 (R/'qa').mkdir(exist_ok=True)
 (R/'qa/preflight.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
 print('V138_PREFLIGHT',report)
def final(path):
 p=Path(path)
 assert p.is_file() and p.stat().st_size>2000000
 meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries',
 'format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate','-of','json',str(p)]))
 dur=float(meta['format']['duration'])
 v=next(x for x in meta['streams'] if x['codec_type']=='video')
 a=next(x for x in meta['streams'] if x['codec_type']=='audio')
 assert dur>=600,('unexpectedly short',dur)
 assert (v['width'],v['height'])==(1920,1080)
 assert v['codec_name']=='h264' and v['r_frame_rate']=='30/1'
 assert a['codec_name']=='aac'
 report={'status':'PASS','seconds':dur,'resolution':'1920x1080','fps':30,
  'videoCodec':'h264','audioCodec':'aac','bytes':p.stat().st_size,
  'visualEditorialReview':'REQUIRES_HUMAN_REVIEW'}
 (R/'qa').mkdir(exist_ok=True)
 (R/'qa/final.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
 print('V138_FINAL_QA',report)
if __name__=='__main__':
 if len(sys.argv)>1 and sys.argv[1]=='final':final(sys.argv[2])
 else:preflight()
