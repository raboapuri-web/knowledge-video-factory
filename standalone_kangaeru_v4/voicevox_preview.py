#!/usr/bin/env python3
"""Generate a verified, authentication-free Japanese VOICEVOX TTS sample.
This can succeed without an icon atlas, but cannot certify a full E2E MP4.
"""
import argparse, json, os, subprocess, hashlib, wave
from pathlib import Path
import core
import render
from engine import subtitles_srt

def main():
 p=argparse.ArgumentParser()
 p.add_argument("--script",type=Path,required=True)
 p.add_argument("--output",type=Path,required=True)
 p.add_argument("--voicevox-url",default=os.getenv("VOICEVOX_URL","http://127.0.0.1:50021"))
 args=p.parse_args()
 out=args.output.resolve();out.mkdir(parents=True,exist_ok=True)
 source=json.loads(args.script.read_text(encoding="utf8"))
 board=core.make_storyboard(source)
 # Independent end-to-end TTS timing for the SAME ten narration lines.
 timeline=core.make_timeline(board,out,args.voicevox_url)
 (out/"timeline.json").write_text(json.dumps(timeline,ensure_ascii=False,indent=2),encoding="utf8")
 (out/"captions.srt").write_text(subtitles_srt(timeline),encoding="utf8")
 wav=render.audio_mix(timeline,out)
 audio=out/"voicevox_japanese_sample.mp3"
 subprocess.run(["ffmpeg","-y","-loglevel","error","-i",str(wav),"-codec:a","libmp3lame","-qscale:a","3",str(audio)],check=True)
 speaker=core.resolve_voicevox_speaker(args.voicevox_url.rstrip("/"),os.getenv("VOICEVOX_SPEAKER_NAME","青山龍星"),os.getenv("VOICEVOX_STYLE","ノーマル"))
 with wave.open(str(wav),"rb") as w:
  audio_duration=w.getnframes()/w.getframerate()
 checks={
  "provider_is_voicevox":bool(speaker>=0),
  "all_ten_segments":len(timeline)==len(board["scenes"])==10,
  "time_from_real_wav":all((s["wav_duration"]>0.3) for s in timeline),
  "timeline_matches_audio":abs(audio_duration-timeline[-1]["end"])<0.15,
  "output_exists":audio.is_file() and audio.stat().st_size>40000,
  "centered_subtitle_spec":board["art_direction"]["subtitle_alignment"]=="center",
 }
 result={
   "passed":all(checks.values()),"checks":checks,
   "audio_only":True,"full_video_complete":False,
   "provider":"VOICEVOX Engine (local, unauthenticated)",
   "speaker":os.getenv("VOICEVOX_SPEAKER_NAME","青山龍星"),"style":os.getenv("VOICEVOX_STYLE","ノーマル"),"speaker_style_id":speaker,
   "required_credit":"VOICEVOX:"+os.getenv("VOICEVOX_SPEAKER_NAME","青山龍星"),
   "audio_duration":audio_duration,
   "voice_file":str(audio),
   "source_script_sha256":hashlib.sha256(args.script.read_bytes()).hexdigest(),
   "original_atlas_in_repo":core.ORIGINAL_ATLAS.is_file(),
   "notice":"Acoustic QA validates that a WAV was produced, not pronunciation quality. Confirm by listening."
 }
 (out/"voice_qa.json").write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf8")
 print(json.dumps(result,ensure_ascii=False,indent=2))
 if not result["passed"]: raise SystemExit("VOICEVOX TTS QA FAILED")

if __name__=="__main__":main()
