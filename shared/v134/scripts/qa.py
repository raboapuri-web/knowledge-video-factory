#!/usr/bin/env python3
from pathlib import Path
import json,sys,subprocess
R=Path(__file__).resolve().parents[1]
def pre():
    source=json.loads((R/'content/board.json').read_text(encoding='utf-8'))
    data=json.loads((R/'content/scenes.json').read_text(encoding='utf-8'))
    assert len(data)==len(source['rows'])>=65
    assert len({s['id'] for s in data})==len(data)
    assert [s['id'] for s in data]==[s['id'] for s in source['rows']]
    assert ''.join(s['narration'] for s in data)==''.join(s['narration'] for s in source['rows'])
    assert len({s['visual'] for s in data})>=15
    for s in data:
        assert s['cues'] and s['duration']>0
        assert ''.join(c['text'] for c in s['cues'])==s['narration']
        for c in s['cues']:
            assert len(c['display'].split('\n'))<=2
            assert max(map(len,c['display'].split('\n')))<=18
            assert '\\n' not in c['display']  # real newline only
            assert c['end']>c['start']
    direct=(R/'src/lib/director.tsx').read_text(encoding='utf-8')
    assert "VOICEVOX_MEASURED" in direct
    assert "view.add(content)" in direct and "view.add(subtitle)" in direct
    assert direct.index("view.add(content)")<direct.index("view.add(subtitle)")
    out=R/'qa';out.mkdir(exist_ok=True)
    report={'status':'PASS','scenes':len(data),'cues':sum(len(s['cues']) for s in data),
      'uniqueVisualIds':len({s['visual'] for s in data}),
      'sourceCoverage':1.0,'narrationCharacters':sum(len(s['narration']) for s in data)}
    (out/'preflight.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print('PREFLIGHT',report)
def final(path):
    p=Path(path);assert p.is_file() and p.stat().st_size>2000000
    obj=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries',
      'format=duration,size:stream=codec_type,codec_name,width,height,r_frame_rate','-of','json',str(p)]))
    d=float(obj['format']['duration']);assert 550<=d<4200,d
    streams=obj['streams'];v=next(x for x in streams if x.get('codec_type')=='video')
    a=next(x for x in streams if x.get('codec_type')=='audio')
    assert (v['width'],v['height'])==(1920,1080)
    assert v['codec_name']=='h264' and a['codec_name']=='aac'
    assert v['r_frame_rate']=='30/1'
    report={'status':'PASS','durationSeconds':d,'bytes':p.stat().st_size,
      'videoCodec':'H.264','audioCodec':'AAC','resolution':'1920x1080','fps':30,
      'editorialReview':'PENDING; automated checks do not certify visual quality'}
    (R/'qa').mkdir(exist_ok=True)
    (R/'qa/final.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    print('FINAL_QA',report)
if __name__=='__main__':
    if len(sys.argv)>1 and sys.argv[1]=='final':final(sys.argv[2])
    else:pre()
