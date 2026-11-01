#!/usr/bin/env python3
"""100 anchors / original script / measured cues / final master checks."""
from pathlib import Path
import json,subprocess,re,sys
R=Path(__file__).resolve().parents[1]
def pre():
    slides=json.loads((R/'content/slide-spec.json').read_text(encoding='utf-8'))['specs']
    assert len(slides)==100 and len(set(x['id'] for x in slides))==100
    assert len(set(x['layout'] for x in slides))>=30
    assert len(set(x['effect'] for x in slides))>=25
    assert all(x['headline'] and x['labels'] for x in slides)
    direction=(R/'src/lib/director.tsx').read_text()
    assert 'slide-spec.json' in direction and 'No generic scenic fallback' in direction

    from importlib.machinery import SourceFileLoader
    comp=SourceFileLoader('comp',str(R/'scripts/compile.py')).load_module()
    a=json.loads((R/'content/scenes.json').read_text())
    src=(R/'content/manuscript.md').read_text()
    assert len(a)==100 and ''.join(s['narration'] for s in a)==comp.strip_markdown(src)
    assert sum(len(s['cues']) for s in a)>100
    assert all(s['narration'] and ''.join(c['text'] for c in s['cues'])==s['narration'] for s in a)
    assert [s['id'] for s in a]==[f'S{i:03}' for i in range(1,101)]
    assert all(s['visualInstruction'] and s['motionInstruction'] for s in a)
    for s in a:
      for c in s['cues']:
        assert len(c['display'].split('\n'))<=2
        assert max(len(z) for z in c['display'].split('\n'))<=16
    print('V141_PREFLIGHT_PASS',len(a),'shots',sum(len(s['cues']) for s in a),'cues')
    (R/'qa').mkdir(exist_ok=True)
    (R/'qa/preflight.json').write_text(json.dumps({'status':'PASS','sceneCount':100,'sourcePreserved':True},ensure_ascii=False))
def final(p):
    path=Path(p);assert path.stat().st_size>2000000
    d=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries',
    'format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate','-of','json',str(path)]))
    v=next(x for x in d['streams'] if x['codec_type']=='video')
    a=next(x for x in d['streams'] if x['codec_type']=='audio')
    assert (v['width'],v['height'])==(1920,1080),(v['width'],v['height'])
    assert v['codec_name']=='h264' and a['codec_name']=='aac'
    report={'status':'TECHNICAL_PASS','seconds':float(d['format']['duration']),'bytes':path.stat().st_size,'resolution':'1920×1080','video':'h264','audio':'aac','humanArtReview':'REQUIRED'}
    (R/'qa/final.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    print(json.dumps(report,ensure_ascii=False))
if __name__=='__main__':
    if len(sys.argv)>1 and sys.argv[1]=='final':final(sys.argv[2])
    else:pre()
