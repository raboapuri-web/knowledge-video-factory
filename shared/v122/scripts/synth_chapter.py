#!/usr/bin/env python3
from pathlib import Path
import concurrent.futures,io,json,os,sys,urllib.parse,urllib.request,wave
R=Path(__file__).resolve().parents[1];chapter=sys.argv[1] if len(sys.argv)>1 else None
VALID=['prologue','chapter1','chapter2','chapter3','chapter4','chapter5','chapter6','epilogue']
if chapter not in VALID:raise SystemExit('Invalid chapter')
BASE=os.getenv('VOICEVOX_URL','http://127.0.0.1:50021');SP=int(os.getenv('VOICEVOX_SPEAKER_ID','13'));SPEED=float(os.getenv('VOICEVOX_SPEED','1.15'));FPS=30;PRE=.055;POST=.085
PRONUNCIATION_MAP={'TANF':'タンフ','SSI':'エスエスアイ','deservingness':'ディザービングネス','CARIN':'カリン','Control':'コントロール','Attitude':'アティチュード','Reciprocity':'レシプロシティ','Identity':'アイデンティティ','Need':'ニード','ポール・オング':'ポール・オング','ニコラス・クライン':'ニコラス・クライン','加藤穂高':'かとうほだか','デシュパンデ':'デシュパンデ','ミューラー＝スミス':'ミューラー・スミス'}
def spoken_text(text):
    for a,b in PRONUNCIATION_MAP.items():text=text.replace(a,b)
    return text
def post(url,payload=b''):
    req=urllib.request.Request(url,data=payload,method='POST',headers={'Content-Type':'application/json'})
    with urllib.request.urlopen(req,timeout=140) as response:return response.read()
def synth_one(task):
    scene,ix,cue=task;q=urllib.parse.urlencode({'speaker':SP,'text':spoken_text(cue['text'])})
    data=json.loads(post(BASE+'/audio_query?'+q));data.update(speedScale=SPEED,prePhonemeLength=PRE,postPhonemeLength=POST)
    raw=post(BASE+'/synthesis?speaker='+str(SP),json.dumps(data,ensure_ascii=False).encode())
    with wave.open(io.BytesIO(raw)) as wav:
        fmt=(wav.getnchannels(),wav.getsampwidth(),wav.getframerate());frames=wav.readframes(wav.getnframes())
    return scene['id'],ix,fmt,frames,len(frames)/(fmt[0]*fmt[1]*fmt[2])
with urllib.request.urlopen(BASE+'/version',timeout=20) as resp:print('VOICEVOX',resp.read().decode())
scenes=[s for s in json.loads((R/'content/scenes.json').read_text()) if s['chapter']==chapter];tasks=[(s,i,c) for s in scenes for i,c in enumerate(s['cues'])]
with concurrent.futures.ThreadPoolExecutor(max_workers=int(os.getenv('VOICEVOX_PARALLEL','4'))) as pool:results=list(pool.map(synth_one,tasks))
data={(sid,i):(fmt,frames,duration) for sid,i,fmt,frames,duration in results};frames=[];spec=None
raw_scenes=[];audio_cursor=0.0
for s in scenes:
    s=json.loads(json.dumps(s,ensure_ascii=False));cue_times=[];scene_audio_start=audio_cursor
    for i,c in enumerate(s['cues']):
        fmt,chunk,duration=data[(s['id'],i)];spec=spec or fmt
        if fmt!=spec:raise RuntimeError('VOICE format mismatch')
        chunk_start=audio_cursor
        speech_start=chunk_start+PRE
        speech_end=chunk_start+max(PRE,duration-POST)
        cue_times.append((speech_start,speech_end))
        frames.append(chunk);audio_cursor+=duration
    raw_scenes.append((s,scene_audio_start,audio_cursor,cue_times))
total=audio_cursor
boundaries=[0.0]
for _,_,scene_audio_end,_ in raw_scenes[:-1]:
    boundaries.append(int(scene_audio_end*FPS+1e-9)/FPS)
boundaries.append((int(total*FPS+0.999999))/FPS)
measured=[]
for idx,(s,scene_audio_start,scene_audio_end,cue_times) in enumerate(raw_scenes):
    visual_start=boundaries[idx];visual_end=boundaries[idx+1]
    if visual_end<=visual_start:raise RuntimeError('Non-positive frame-locked scene duration')
    for c,(speech_start,speech_end) in zip(s['cues'],cue_times):
        c['start']=round(max(0.0,speech_start-visual_start),6)
        c['end']=round(min(visual_end-visual_start,speech_end-visual_start),6)
        if c['end']<=c['start']:raise RuntimeError('Invalid frame-locked subtitle timing '+s['id'])
    s['duration']=round(visual_end-visual_start,6)
    s['durationSource']='VOICEVOX_MEASURED_FRAME_LOCKED'
    s['audioSceneStart']=round(scene_audio_start,6);s['audioSceneEnd']=round(scene_audio_end,6)
    s['visualSceneStart']=round(visual_start,6);s['visualSceneEnd']=round(visual_end,6)
    measured.append(s)
out=R/'media'/chapter/'narration.wav';out.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(out),'wb') as wf:wf.setnchannels(spec[0]);wf.setsampwidth(spec[1]);wf.setframerate(spec[2]);wf.writeframes(b''.join(frames))
(R/'content'/f'measured-{chapter}.json').write_text(json.dumps(measured,ensure_ascii=False,indent=2))
(R/f'voice-report-{chapter}.json').write_text(json.dumps({'chapter':chapter,'voice':'青山龍星 ノーマル','speaker':SP,'speedScale':SPEED,'audioSeconds':round(total,6),'visualSeconds':round(boundaries[-1],6),'fps':FPS,'prePhonemeLength':PRE,'postPhonemeLength':POST,'scenes':len(scenes),'cues':len(tasks),'pronunciationMap':PRONUNCIATION_MAP},ensure_ascii=False,indent=2))
print('VOICE_OK',chapter,'audio',round(total,6),'visual',round(boundaries[-1],6),'cues',len(tasks))
