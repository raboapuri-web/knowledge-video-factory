#!/usr/bin/env python3
"""Build measured VOICEVOX audio/timings for one V118 chapter. Strictly no fake timings."""
from pathlib import Path
import concurrent.futures,io,json,os,sys,urllib.parse,urllib.request,wave
R=Path(__file__).resolve().parents[1]; chapter=sys.argv[1] if len(sys.argv)>1 else None
if chapter not in ['prologue']+[f'chapter{i}' for i in range(1,7)]+['epilogue']:raise SystemExit('Invalid chapter')
BASE=os.getenv('VOICEVOX_URL','http://127.0.0.1:50021');SP=int(os.getenv('VOICEVOX_SPEAKER_ID','13'));SPEED=float(os.getenv('VOICEVOX_SPEED','1.15'))
def post(url,payload=b''):
 req=urllib.request.Request(url,data=payload,method='POST',headers={'Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=140) as response:return response.read()
def synth(task):
 scene,ix,cue=task
 q=urllib.parse.urlencode({'speaker':SP,'text':cue['text']})
 data=json.loads(post(BASE+'/audio_query?'+q))
 data.update(speedScale=SPEED,prePhonemeLength=0.055,postPhonemeLength=0.085)
 raw=post(BASE+'/synthesis?speaker='+str(SP),json.dumps(data,ensure_ascii=False).encode())
 with wave.open(io.BytesIO(raw)) as wav:
  fmt=(wav.getnchannels(),wav.getsampwidth(),wav.getframerate());frames=wav.readframes(wav.getnframes())
 return scene['id'],ix,fmt,frames,len(frames)/(fmt[0]*fmt[1]*fmt[2])
with urllib.request.urlopen(BASE+'/version',timeout=20) as resp:print('VOICEVOX version',resp.read().decode())
scenes=[s for s in json.loads((R/'content/scenes.json').read_text()) if s['chapter']==chapter]
assert scenes,'no scenes'
tasks=[(s,i,c) for s in scenes for i,c in enumerate(s['cues'])]
with concurrent.futures.ThreadPoolExecutor(max_workers=int(os.getenv('VOICEVOX_PARALLEL','4'))) as pool: results=list(pool.map(synth,tasks))
data={(sid,i):(fmt,frames,duration) for sid,i,fmt,frames,duration in results}
frames=[];spec=None;t=0;measured=[]
for s in scenes:
 s=json.loads(json.dumps(s,ensure_ascii=False));t_scene=0
 for i,c in enumerate(s['cues']):
  fmt,chunk,duration=data[(s['id'],i)];spec=spec or fmt
  if fmt!=spec:raise RuntimeError('Incompatible VOICEVOX formats')
  c['start']=round(t_scene,6);t_scene+=duration;c['end']=round(t_scene,6);frames.append(chunk)
 s['duration']=round(t_scene,6);s['durationSource']='VOICEVOX_MEASURED';measured.append(s);t+=t_scene
out=R/'media'/chapter/'narration.wav';out.parent.mkdir(parents=True,exist_ok=True)
with wave.open(str(out),'wb') as wf:
 wf.setnchannels(spec[0]);wf.setsampwidth(spec[1]);wf.setframerate(spec[2]);wf.writeframes(b''.join(frames))
(R/'content'/f'measured-{chapter}.json').write_text(json.dumps(measured,ensure_ascii=False,indent=2))
(R/f'voice-report-{chapter}.json').write_text(json.dumps({'chapter':chapter,'voice':'青山龍星 ノーマル','speaker':SP,'speedScale':SPEED,'totalSeconds':round(t,3),'scenes':len(scenes),'cues':len(tasks)},ensure_ascii=False,indent=2))
print('VOICE_OK',chapter,'seconds',round(t,3),'cues',len(tasks))
