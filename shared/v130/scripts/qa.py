#!/usr/bin/env python3
"""V130 source coverage, subtitle, storyboard, and real output preflight."""
from pathlib import Path
import json,re,subprocess,sys
R=Path(__file__).resolve().parents[1]
def preflight():
    data=json.loads((R/'content/scenes.json').read_text(encoding='utf-8'))
    assert len(data)==69,(len(data),'unexpected number of authored semantic spaces')
    assert len({v['id'] for v in data})==len(data)
    assert len({v['visual'] for v in data})>=28
    raw=(R/'content/manuscript.txt').read_text(encoding='utf-8')
    parts=re.split(r'(?m)^## (PROLOGUE|CHAPTER[1-6]|EPILOGUE)\s*$',raw)
    texts={parts[i]:parts[i+1] for i in range(1,len(parts)-1,2)}
    chapters=['prologue']+[f'chapter{i}' for i in range(1,7)]+['epilogue']
    for ch in chapters:
        section=ch.upper()
        expected=''.join(re.sub(r'\s+','',x) for x in re.split(r'\n\s*\n',texts[section].strip()) if x.strip())
        actual=''.join(x['narration'] for x in data if x['chapter']==ch)
        assert actual==expected,(ch,'manuscript omitted or reordered')
    for x in data:
        assert ''.join(c['text'] for c in x['cues'])==x['narration'],x['id']
        assert len(x['cues'])>=2,x['id']
        for c in x['cues']:
            assert '\\n' not in c['display'],x['id']
            assert c['display'].count('\n')<=1,x['id']
            assert max(len(y) for y in c['display'].split('\n'))<=18,x['id']
            assert c['end']>c['start']
    director=(R/'src/lib/director.tsx').read_text(encoding='utf-8')
    assert director.count('view.add(')==4,'subtitle layer order must never change'
    assert 'VOICEVOX_MEASURED' in director
    assert 'rotation(' not in director,'no angled/slanted charts'
    result={'status':'PASS','scenes':len(data),'cues':sum(len(x['cues']) for x in data),
            'visualGrammars':len({x['visual'] for x in data}),
            'narrationCharacters':sum(len(x['narration']) for x in data),'sourceCoverage':1.0}
    (R/'qa').mkdir(exist_ok=True);(R/'qa/preflight.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print('STORYBOARD_PREFLIGHT',json.dumps(result,ensure_ascii=False))
def final(path):
    path=Path(path)
    assert path.is_file() and path.stat().st_size>2_000_000
    probe=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration,size:stream=codec_type,codec_name,width,height',
     '-of','json',str(path)],capture_output=True,text=True,check=True)
    d=json.loads(probe.stdout)
    duration=float(d['format']['duration'])
    assert 600<duration<4500,('unreasonable film length',duration)
    video=next((x for x in d['streams'] if x.get('codec_type')=='video'),None)
    audio=next((x for x in d['streams'] if x.get('codec_type')=='audio'),None)
    assert video and audio,'missing audio/video stream'
    assert (video['width'],video['height'])==(1920,1080)
    assert video['codec_name']=='h264'
    assert audio['codec_name']=='aac'
    result={'status':'PASS','durationSeconds':duration,'bytes':path.stat().st_size,'frameSize':'1920x1080',
            'videoCodec':video['codec_name'],'audioCodec':audio['codec_name'],'note':'mechanical checks only; editorial review remains necessary'}
    out=R/'qa/final.json';out.parent.mkdir(exist_ok=True);out.write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
    print('FINAL_QA',json.dumps(result,ensure_ascii=False))
if __name__=='__main__':
    if len(sys.argv)>1 and sys.argv[1]=='final':final(sys.argv[2])
    else:preflight()
