#!/usr/bin/env python3
"""V139 strict source, cue, art, renderer and final MP4 quality checks."""
from pathlib import Path
import json,re,subprocess,sys
R=Path(__file__).resolve().parents[1]
ORDER=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue']
def pre():
    source=(R/'content/manuscript.md').read_text(encoding='utf-8')
    scenes=json.loads((R/'content/scenes.json').read_text(encoding='utf-8'))
    expected=re.sub(r'(?m)^# [^\n]+\n','',source)
    expected=re.sub(r'\s+','',expected)
    actual=re.sub(r'\s+','',''.join(s['narration'] for s in scenes))
    assert expected==actual,(len(expected),len(actual))
    assert len(scenes)>=80
    assert len(set(s['id'] for s in scenes))==len(scenes)
    families=set(s['visual'] for s in scenes);assert len(families)>=24
    director=(R/'src/lib/director.tsx').read_text(encoding='utf-8')
    assert 'VOICEVOX_MEASURED' in director
    assert director.index('view.add(content)')<director.index('view.add(subtitle)')
    for v in families:assert "v==='"+v+"'" in director,('unhandled visual',v)
    repeat=sum(a['visual']==b['visual'] for a,b in zip(scenes,scenes[1:]))
    assert repeat==0,repeat
    for s in scenes:
        assert s['chapter'] in ORDER and s['cues']
        assert ''.join(c['text'] for c in s['cues'])==s['narration']
        assert len(s['narration'])<=94 and len(s['note'])<=20
        for c in s['cues']:
            assert len(c['display'].split('\n'))<=2
            assert max(map(len,c['display'].split('\n')))<=15
            assert '\\n' not in c['display']
    assert all(any(s['chapter']==ch for s in scenes) for ch in ORDER)
    result={'status':'PASS','scenes':len(scenes),'meaningVisuals':len(families),
       'narrationCoverage':1.0,'consecutiveSameVisual':repeat,
       'totalCues':sum(len(s['cues']) for s in scenes),
       'chapters':{ch:sum(s['chapter']==ch for s in scenes) for ch in ORDER},
       'limitations':['Automated preflight does not replace review of image quality or factual claims']}
    (R/'qa').mkdir(exist_ok=True)
    (R/'qa/preflight.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
    print('V139_PREFLIGHT',result)
def final(path):
    p=Path(path);assert p.is_file() and p.stat().st_size>2000000
    info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries',
     'format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate','-of','json',str(p)]))
    sec=float(info['format']['duration'])
    v=next(x for x in info['streams'] if x.get('codec_type')=='video')
    a=next(x for x in info['streams'] if x.get('codec_type')=='audio')
    assert sec>=480,sec
    assert (v['width'],v['height'])==(1920,1080)
    assert v['codec_name']=='h264' and v['r_frame_rate']=='30/1'
    assert a['codec_name']=='aac'
    report={'status':'PASS','durationSeconds':sec,'resolution':'1920x1080','fps':30,
       'videoCodec':'h264','audioCodec':'aac','bytes':p.stat().st_size,
       'editorialReview':'NOT_YET_CERTIFIED'}
    (R/'qa/final.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print('V139_FINAL_QA',report)
if __name__=='__main__':
    if len(sys.argv)>1 and sys.argv[1]=='final':final(sys.argv[2])
    else:pre()
