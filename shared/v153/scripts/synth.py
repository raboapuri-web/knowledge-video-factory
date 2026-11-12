#!/usr/bin/env python3
"""VOICEVOX Aoyama Ryusei narration and subtitle timing, one original scene block at a time."""
import json, os, re, wave
from pathlib import Path
import requests

ROOT=Path(__file__).resolve().parents[1]
BOARD=json.loads((ROOT/"content/board.json").read_text(encoding="utf-8"))
BASE=os.getenv("VOICEVOX_URL","http://127.0.0.1:50021").rstrip("/")
SPEAKER=int(os.getenv("VOICEVOX_SPEAKER_ID","13"))
SPEED=float(os.getenv("VOICEVOX_SPEED","1.10"))
INTONATION=float(os.getenv("VOICEVOX_INTONATION","1.0"))
OUT=ROOT/"media"; OUT.mkdir(exist_ok=True)

CHAPTER_HEADING_RE=re.compile(r"^\s*##\s*(?:プロローグ|第[0-9０-９]+章|エピローグ)(?:\s*[｜|：:]\s*|\s+).+$")

def clean_markup(s):
    kept=[]; removed=[]
    for line in s.splitlines():
        if CHAPTER_HEADING_RE.match(line):
            removed.append(line.strip())
        else:
            kept.append(line)
    s="\n".join(kept)
    s=re.sub(r"(?m)^##\s*","",s)
    s=s.replace("**","")
    return s.strip(), removed

def split_cues(text):
    out=[]
    for raw in text.splitlines():
        line=raw.strip()
        if not line: continue
        parts=re.split(r"(?<=[。！？!?])",line)
        for part in parts:
            part=part.strip()
            if not part: continue
            while len(part)>44:
                cut=0
                for sep in ("、","，",","," "):
                    pos=part.rfind(sep,0,39)
                    if pos>12: cut=pos+1; break
                if not cut: cut=38
                out.append(part[:cut]); part=part[cut:]
            if part: out.append(part)
    return out or [text]

def wrap_caption(s,limit=21):
    lines=[]
    while len(s)>limit:
        cut=limit
        for sep in ("、","，",","," "):
            p=s.rfind(sep,0,limit+1)
            if p>8: cut=p+1; break
        lines.append(s[:cut]); s=s[cut:]
    if s: lines.append(s)
    if len(lines)>2: lines=[lines[0],"".join(lines[1:])]
    return r"\N".join(lines)

def ass_time(sec):
    cs=max(0,int(round(sec*100)))
    h=cs//360000; cs%=360000; m=cs//6000; cs%=6000; s=cs//100; cs%=100
    return f"{h}:{m:02d}:{s:02d}.{cs:02d}"

def mora_durations(query):
    out=[]
    for phrase in query.get("accent_phrases",[]):
        for mora in phrase.get("moras",[]):
            d=float(mora.get("consonant_length") or 0)+float(mora.get("vowel_length") or 0)
            out.append(max(0.0,d))
        pause=phrase.get("pause_mora")
        if pause:
            d=float(pause.get("consonant_length") or 0)+float(pause.get("vowel_length") or 0)
            out.append(max(0.0,d))
    return out

def make_cue_times(text,cues,query,wav_seconds):
    normalized=re.sub(r"\s+","",text); cue_norm=[re.sub(r"\s+","",c) for c in cues]
    if "".join(cue_norm)!=normalized: raise ValueError("Caption cues do not preserve exact source text")
    durations=mora_durations(query)
    if not durations or sum(durations)<=0:
        total_chars=max(1,len(normalized)); points=[wav_seconds*sum(len(x) for x in cue_norm[:i])/total_chars for i in range(len(cues)+1)]
    else:
        total=sum(durations); cumulative=[0.0]
        for d in durations: cumulative.append(cumulative[-1]+d)
        char_pos=0; boundaries=[0]
        for c in cue_norm[:-1]:
            char_pos+=len(c); boundaries.append(min(len(durations),max(0,round(char_pos/max(1,len(normalized))*len(durations)))))
        boundaries.append(len(durations)); points=[cumulative[k]/total*wav_seconds for k in boundaries]
        if any(points[i+1]-points[i]<0.035 for i in range(len(points)-1)):
            total_chars=max(1,len(normalized)); points=[wav_seconds*sum(len(x) for x in cue_norm[:i])/total_chars for i in range(len(cues)+1)]
    points[0]=0.0; points[-1]=wav_seconds
    return [{"text":c,"start":round(points[i],4),"end":round(points[i+1],4)} for i,c in enumerate(cues)]

def write_ass(cues,path):
    head="""[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Noto Sans CJK JP,46,&H00FFFFFF,&H000000FF,&H00101010,&H00000000,0,0,0,0,100,100,0,0,1,3,1,2,110,110,24,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    rows=[]
    for c in cues:
        t=wrap_caption(c["text"]).replace("{",r"\{").replace("}",r"\}")
        rows.append(f"Dialogue: 0,{ass_time(c['start'])},{ass_time(c['end'])},Default,,0,0,0,,{t}")
    path.write_text(head+"\n".join(rows)+"\n",encoding="utf-8")

def wav_duration(path):
    with wave.open(str(path),"rb") as w: return w.getnframes()/float(w.getframerate())

def synth_scene(scene):
    text, removed_headings=clean_markup(scene["script"])
    qres=requests.post(BASE+"/audio_query",params={"text":text,"speaker":SPEAKER},timeout=120); qres.raise_for_status(); query=qres.json()
    query.update({"speedScale":SPEED,"intonationScale":INTONATION,"prePhonemeLength":0.08,"postPhonemeLength":0.18})
    res=requests.post(BASE+"/synthesis",params={"speaker":SPEAKER},json=query,timeout=240); res.raise_for_status()
    if not res.content.startswith(b"RIFF") or b"WAVE" not in res.content[:16]: raise RuntimeError("VOICEVOX returned invalid WAV for "+scene["id"])
    speech=OUT/"speech"; captions=OUT/"captions"; speech.mkdir(exist_ok=True); captions.mkdir(exist_ok=True)
    wav=speech/(scene["id"]+".wav"); wav.write_bytes(res.content); duration=wav_duration(wav)
    if not 0.25<duration<150: raise ValueError("Abnormal narration duration for "+scene["id"])
    cues=split_cues(text); timing=make_cue_times(text,cues,query,duration); write_ass(timing,captions/(scene["id"]+".ass"))
    return {"scene":scene["id"],"wav":str(wav.relative_to(ROOT)),"duration":round(duration,4),"cue_count":len(timing),
            "captions":timing,"speaker":"VOICEVOX:青山龍星","speaker_id":SPEAKER,"speed":SPEED,"intonation":INTONATION,
            "timing_method":"VOICEVOX audio_query mora durations mapped approximately by source character positions and rescaled to WAV",
            "narration_text":text,"removed_chapter_headings":removed_headings}

def main():
    import sys
    if len(sys.argv)!=2: raise SystemExit("usage: synth.py <chapter>")
    chapter=sys.argv[1]; spec=next((x for x in BOARD["chapters"] if x["id"]==chapter),None)
    if not spec: raise SystemExit("unknown chapter "+chapter)
    scenes=[s for s in BOARD["scenes"] if spec["start"]<=int(s["id"][1:])<=spec["end"]]
    version=requests.get(BASE+"/version",timeout=15).text.strip()
    print("VOICEVOX_VERSION",version,"SPEAKER",SPEAKER,"SPEED",SPEED,flush=True)
    report=[]
    for i,s in enumerate(scenes,1):
        report.append(synth_scene(s))
        if i%5==0: print(json.dumps({"chapter":chapter,"voice_scenes":i,"total":len(scenes)},ensure_ascii=False),flush=True)
    dest=OUT/f"voice-report-{chapter}.json"
    dest.write_text(json.dumps({"chapter":chapter,"scene_count":len(report),"voice":"VOICEVOX:青山龍星","speaker_id":SPEAKER,
        "speed":SPEED,"intonation":INTONATION,"scenes":report},ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps({"chapter":chapter,"scene_count":len(report),"total_audio_seconds":round(sum(x["duration"] for x in report),2),
                      "voice":"VOICEVOX:青山龍星","report":str(dest.relative_to(ROOT))},ensure_ascii=False),flush=True)
if __name__=="__main__": main()
