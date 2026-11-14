#!/usr/bin/env python3
"""Finalize V155: assemble 7 chapters, append 20s endcard, decode, inspect motion and verify final narration."""
import argparse, json, os, re, subprocess, tempfile, wave, math, unicodedata
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
import sys
sys.path.insert(0,str(ROOT.parent))
from motion.continuous_motion_qa import audit_30fps_motion
CHAPTERS=["prologue","chapter1","chapter2","chapter3","chapter4","chapter5","epilogue"]
EXPECTED_SCENES=[f"S{i:03d}" for i in range(1,89)]
ENDCARD_SECONDS=20.0
FINAL_PHRASE="今夜も、当たり前がひとつ減りました。"

def run(cmd):
    subprocess.run(cmd,check=True)

def clock(sec):
    sec=int(round(sec)); h=sec//3600; m=(sec%3600)//60; s=sec%60
    return f"{h:02d}:{m:02d}:{s:02d}"

def probe(path):
    return json.loads(subprocess.check_output(["ffprobe","-v","error","-show_entries",
        "format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate,sample_rate,channels",
        "-of","json",str(path)],text=True))

def sample(cap,seconds,label):
    cap.set(cv2.CAP_PROP_POS_MSEC,max(0.0,seconds)*1000)
    ok,frame=cap.read()
    if not ok: raise RuntimeError(f"Cannot sample final MP4 at {seconds:.3f}s ({label})")
    return cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)

def normalize_japanese(s):
    s=unicodedata.normalize("NFKC",s)
    replacements={"今夜":"こんや","当たり前":"あたりまえ","一つ":"ひとつ","減りました":"へりました"}
    for a,b in replacements.items(): s=s.replace(a,b)
    return re.sub(r"[^ぁ-んァ-ヶー]","",s)

def verify_final_audio(final_path,last_scene):
    # Extract only S088 from the final MP4; this audits the encoded master audio, not just source text.
    wav_path=ROOT/"output"/"final_scene_S088_for_asr.wav"
    run(["ffmpeg","-y","-loglevel","error","-ss",f"{last_scene['start']:.4f}","-t",f"{last_scene['duration']:.4f}",
         "-i",str(final_path),"-vn","-ac","1","-ar","16000","-c:a","pcm_s16le",str(wav_path)])
    if not wav_path.is_file() or wav_path.stat().st_size<10000: raise RuntimeError("Could not extract final narration audio")
    with wave.open(str(wav_path),"rb") as wf: audio_seconds=wf.getnframes()/wf.getframerate()
    if audio_seconds < float(last_scene["duration"])-0.08:
        raise RuntimeError(f"Final scene audio is truncated: {audio_seconds:.3f}s vs {last_scene['duration']:.3f}s")
    try:
        from faster_whisper import WhisperModel
    except Exception as exc:
        raise RuntimeError("faster-whisper is required for final spoken-phrase verification") from exc
    model=WhisperModel("small",device="cpu",compute_type="int8")
    segments,info=model.transcribe(str(wav_path),language="ja",beam_size=5,vad_filter=False)
    transcript="".join(x.text for x in segments).strip()
    got=normalize_japanese(transcript)
    want=normalize_japanese(FINAL_PHRASE)
    matched=want in got
    result={"passed":matched,"expected_phrase":FINAL_PHRASE,"recognized_transcript":transcript,
            "normalized_expected":want,"normalized_recognized":got,"audio_duration_seconds":round(audio_seconds,3),
            "model":"faster-whisper small / ja / CPU int8","source":"encoded final MP4 S088 audio"}
    (ROOT/"output"/"final_audio_qa.json").write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    if not matched: raise RuntimeError("Final spoken phrase was not recognized in encoded MP4 audio: "+transcript)
    return result

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--segments-dir",default="segments")
    args=ap.parse_args()
    segdir=Path(args.segments_dir)
    out=ROOT/"output"; out.mkdir(parents=True,exist_ok=True)
    timeline=[]; chapter_rows=[]; all_scenes=[]; motion_seq=[]; elapsed=0.0
    concat=out/"concat-main.txt"; concat_lines=[]
    last_voice=None; last_scene_row=None
    for chapter in CHAPTERS:
        video=segdir/f"v155-{chapter}.mp4"
        rr=segdir/f"render-{chapter}.json"
        vr=segdir/f"voice-report-{chapter}.json"
        nq=segdir/f"narration-qa-{chapter}.json"
        cr=segdir/f"chapter-card-{chapter}.json"
        for p in [video,rr,vr,nq,cr]:
            if not p.is_file() or p.stat().st_size==0: raise FileNotFoundError(p)
        render=json.loads(rr.read_text(encoding="utf-8"))
        voice=json.loads(vr.read_text(encoding="utf-8"))
        narration_qa=json.loads(nq.read_text(encoding="utf-8"))
        card=json.loads(cr.read_text(encoding="utf-8"))
        if narration_qa.get("passed") is not True: raise RuntimeError(f"{chapter}: narration QA failed")
        if render.get("chapter")!=chapter or card.get("chapter")!=chapter: raise RuntimeError(f"{chapter}: report chapter mismatch")
        card_d=float(card["duration_sec"])
        chapter_start=elapsed
        timeline.append({"kind":"chapter_card","chapter":chapter,"start":elapsed,"end":elapsed+card_d,"duration":card_d,"title":card["title"]})
        elapsed+=card_d
        scene_rows=render.get("scenes",[])
        if len(scene_rows)!=len(voice.get("scenes",[])): raise RuntimeError(f"{chapter}: render/voice scene count mismatch")
        for r,v in zip(scene_rows,voice["scenes"]):
            if r["scene"]!=v["scene"]: raise RuntimeError(f"{chapter}: scene order mismatch")
            d=float(r["duration"])
            item={"kind":"scene","chapter":chapter,"scene":r["scene"],"start":elapsed,"end":elapsed+d,"duration":d,"motion":r["motion"]}
            timeline.append(item); all_scenes.append(r["scene"]); motion_seq.append(r["motion"]); elapsed+=d
            last_voice=v; last_scene_row=item
        chapter_rows.append({
            "chapter":chapter,"title":card["title"],"label":card["label"],
            "start_seconds":round(chapter_start,3),"start_time":clock(chapter_start),
            "narration_start_seconds":round(chapter_start+card_d,3),"narration_start_time":clock(chapter_start+card_d),
            "chapter_card_duration_seconds":round(card_d,3),
            "narration_duration_seconds":round(sum(float(x["duration"]) for x in scene_rows),3),
            "chapter_duration_seconds":round(card_d+sum(float(x["duration"]) for x in scene_rows),3),
            "scene_count":len(scene_rows)
        })
        concat_lines.append("file '"+str(video.resolve())+"'")
    if all_scenes!=EXPECTED_SCENES: raise RuntimeError(f"Expected S001-S088 exactly once; got {len(all_scenes)} scenes")
    if len([x for x in timeline if x["kind"]=="chapter_card"])!=7: raise RuntimeError("Expected exactly seven chapter cards")
    if not last_voice or last_voice.get("scene")!="S088": raise RuntimeError("S088 is not the final narration scene")
    board=json.loads((ROOT/"content"/"board.json").read_text(encoding="utf-8"))
    expected_last=next(x["script"] for x in board["scenes"] if x["id"]=="S088")
    if last_voice.get("narration_text")!=expected_last: raise RuntimeError("S088 narration text differs from approved board")
    if FINAL_PHRASE not in last_voice.get("narration_text",""): raise RuntimeError("Approved final phrase is missing from S088 text")
    last_caption_end=float(last_voice["captions"][-1]["end"]) if last_voice.get("captions") else -1
    last_audio_duration=float(last_voice["duration"])
    if abs(last_caption_end-last_audio_duration)>0.02: raise RuntimeError("S088 final subtitle/audio timing does not reach the final audio sample")
    if any(motion_seq[i]==motion_seq[i-1]==motion_seq[i-2] for i in range(2,len(motion_seq))):
        raise RuntimeError("Three consecutive scenes use the same motion")
    concat.write_text("\n".join(concat_lines)+"\n",encoding="utf-8")
    main_mp4=out/"v155-main.mp4"
    run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(concat),"-c","copy","-movflags","+faststart",str(main_mp4)])
    # Build a 20-second static endcard segment with a genuinely silent AAC track for stream-compatible concatenation.
    endcard=ROOT/"assets"/"endcard_v1.png"
    endcard_mp4=out/"v155-endcard-20s.mp4"
    run(["ffmpeg","-y","-loglevel","error","-loop","1","-framerate","30","-i",str(endcard),
         "-f","lavfi","-i","anullsrc=r=48000:cl=mono","-t","20",
         "-vf","scale=1920:1080:flags=lanczos","-r","30","-fps_mode","cfr",
         "-c:v","libx264","-preset","veryfast","-crf","19","-pix_fmt","yuv420p",
         "-c:a","aac","-b:a","160k","-ar","48000","-ac","1","-shortest","-movflags","+faststart",str(endcard_mp4)])
    final_concat=out/"concat-final.txt"
    final_concat.write_text("file '"+str(main_mp4.resolve())+"'\nfile '"+str(endcard_mp4.resolve())+"'\n",encoding="utf-8")
    final=out/"v155-human-body-defects-final.mp4"
    run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(final_concat),"-c","copy","-movflags","+faststart",str(final)])
    endcard_start=elapsed
    timeline.append({"kind":"endcard","start":endcard_start,"end":endcard_start+ENDCARD_SECONDS,"duration":ENDCARD_SECONDS})
    expected=elapsed+ENDCARD_SECONDS
    # Decode every packet/frame to null; any corrupt packet is a hard failure.
    run(["ffmpeg","-v","error","-xerror","-i",str(final),"-f","null","-"])
    p=probe(final); streams=p.get("streams",[])
    vs=next((x for x in streams if x.get("codec_type")=="video"),{})
    aus=next((x for x in streams if x.get("codec_type")=="audio"),{})
    duration=float(p["format"]["duration"]); delta=abs(duration-expected)
    checks={
        "scene_count_88":len(all_scenes)==88,
        "chapter_card_count_7":sum(1 for x in timeline if x["kind"]=="chapter_card")==7,
        "scene_order_S001_to_S088":all_scenes==EXPECTED_SCENES,
        "no_three_consecutive_motion_repeats":True,
        "S088_final_script_and_caption_complete":abs(last_caption_end-last_audio_duration)<=0.02 and FINAL_PHRASE in last_voice["narration_text"],
        "endcard_present_20_seconds":abs((timeline[-1]["end"]-timeline[-1]["start"])-20.0)<0.01,
        "video_1920x1080":vs.get("width")==1920 and vs.get("height")==1080,
        "video_30fps":vs.get("r_frame_rate")=="30/1",
        "video_h264":vs.get("codec_name")=="h264",
        "audio_aac":aus.get("codec_name")=="aac",
        "audio_48khz_mono":aus.get("sample_rate")=="48000" and aus.get("channels")==1,
        "duration_matches_main_plus_20s_endcard":delta<=0.5
    }
    if not all(checks.values()): raise RuntimeError("Final technical QA failed: "+json.dumps(checks,ensure_ascii=False))
    cap=cv2.VideoCapture(str(final))
    if not cap.isOpened(): raise RuntimeError("Cannot open final master for frame QA")
    thumbs=[]; card_thumbs=[]; black_ratios=[]
    for item in timeline:
        if item["kind"]=="chapter_card":
            frame=sample(cap,item["end"]-0.35,item["chapter"]+" card")
            card_thumbs.append((item,Image.fromarray(frame).resize((480,270),Image.Resampling.LANCZOS)))
        elif item["kind"]=="scene":
            frame=sample(cap,(item["start"]+item["end"])/2,item["scene"])
            gray=cv2.cvtColor(frame[950:1080,:,:],cv2.COLOR_RGB2GRAY)
            black_ratios.append(float((gray<25).mean()))
            thumbs.append((item,Image.fromarray(frame).resize((192,108),Image.Resampling.LANCZOS)))
    # Confirm the endcard is static by comparing frames from the beginning and end of its segment.
    e1=sample(cap,endcard_start+1.0,"endcard start")
    e2=sample(cap,endcard_start+19.0,"endcard end")
    endcard_static_diff=float(cv2.mean(cv2.absdiff(cv2.cvtColor(e1,cv2.COLOR_RGB2GRAY),cv2.cvtColor(e2,cv2.COLOR_RGB2GRAY)))[0])
    cap.release()
    checks["endcard_static_image"]=endcard_static_diff<2.0
    if not checks["endcard_static_image"]: raise RuntimeError(f"Endcard is not static; frame diff {endcard_static_diff:.3f}")
    band_min=min(black_ratios) if black_ratios else 0
    checks["subtitle_band_black_coverage_all_scene_midpoints"]=band_min>=0.85
    if not checks["subtitle_band_black_coverage_all_scene_midpoints"]: raise RuntimeError(f"Subtitle band coverage too low: {band_min:.4f}")
    # Verify the endcard's 20-second audio segment is silent.
    silent_wav=out/"endcard_silence_check.wav"
    run(["ffmpeg","-y","-loglevel","error","-ss",f"{endcard_start:.3f}","-t","20","-i",str(final),"-vn","-ac","1","-ar","48000","-c:a","pcm_s16le",str(silent_wav)])
    with wave.open(str(silent_wav),"rb") as wf:
        samples=np.frombuffer(wf.readframes(wf.getnframes()),dtype=np.int16)
    silence_rms=float(np.sqrt(np.mean(samples.astype(np.float64)**2))) if samples.size else 999
    checks["endcard_audio_silent"]=silence_rms<3.0
    if not checks["endcard_audio_silent"]: raise RuntimeError(f"Endcard audio is not silent; RMS={silence_rms:.3f}")
    # Actual decoded-frame contact sheets.
    scene_sheet=Image.new("RGB",(1920,9*132),(16,16,16)); draw=ImageDraw.Draw(scene_sheet); font=ImageFont.load_default()
    for i,(item,im) in enumerate(thumbs):
        x=(i%10)*192; y=(i//10)*132
        scene_sheet.paste(im,(x,y)); draw.text((x+5,y+110),f"{item['scene']} {clock(item['start'])}",font=font,fill=(245,245,245))
    scene_sheet_path=out/"v155-contact-sheet.jpg"; scene_sheet.save(scene_sheet_path,quality=90,optimize=True)
    card_sheet=Image.new("RGB",(1920,2*298),(16,16,16)); cdraw=ImageDraw.Draw(card_sheet)
    for i,(item,im) in enumerate(card_thumbs):
        x=(i%4)*480; y=(i//4)*298
        card_sheet.paste(im,(x,y)); cdraw.text((x+8,y+274),f"{item['chapter']} {clock(item['start'])}",font=font,fill=(245,245,245))
    card_sheet_path=out/"v155-chapter-cards-contact-sheet.jpg"; card_sheet.save(card_sheet_path,quality=90,optimize=True)
    motion_qa=audit_30fps_motion(final,timeline)
    (out/"motion_30fps_qa.json").write_text(json.dumps(motion_qa,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    checks["motion_all_moving_scenes_change_every_sampled_frame"]=motion_qa["passed"]
    if not motion_qa["passed"]: raise RuntimeError("30fps motion QA failed: "+json.dumps(motion_qa["failures"][:3],ensure_ascii=False))
    checks["scene_contact_sheet_88_frames"]=len(thumbs)==88
    checks["chapter_card_contact_sheet_7_frames"]=len(card_thumbs)==7
    if not checks["scene_contact_sheet_88_frames"] or not checks["chapter_card_contact_sheet_7_frames"]:
        raise RuntimeError("Contact-sheet frame count mismatch")
    audio_qa=verify_final_audio(final,last_scene_row)
    checks["final_phrase_asr_confirmed"]=audio_qa["passed"]
    if not all(checks.values()): raise RuntimeError("Final QA failed: "+json.dumps(checks,ensure_ascii=False))
    report={
        "video_id":"V155","title":"あなたの知らない人体の欠陥5選","release_tag":os.getenv("RELEASE_TAG",""),
        "video_file":str(final.relative_to(ROOT)),"duration_seconds":round(duration,3),"duration_hms":clock(duration),
        "expected_timeline_seconds":round(expected,3),"duration_delta_seconds":round(delta,3),
        "resolution":"1920x1080","fps":"30/1","video_codec":vs.get("codec_name"),
        "audio_codec":aus.get("codec_name"),"audio_sample_rate":aus.get("sample_rate"),"audio_channels":aus.get("channels"),
        "chapter_start_times":chapter_rows,"scene_count":88,"chapter_card_count":7,"endcard_duration_seconds":20,
        "endcard_file":"assets/endcard_v1.png","endcard_static_frame_difference":round(endcard_static_diff,5),
        "endcard_silence_rms":round(silence_rms,4),"subtitle_band_black_ratio_min":round(band_min,4),
        "contact_sheet":str(scene_sheet_path.relative_to(ROOT)),"chapter_cards_contact_sheet":str(card_sheet_path.relative_to(ROOT)),
        "motion_30fps_qa_file":"output/motion_30fps_qa.json","motion_moving_scenes_audited":motion_qa["moving_scenes_audited"],
        "motion_adjacent_frame_pairs_audited":motion_qa["adjacent_frame_pairs_audited"],
        "final_scene_audio_duration_seconds":round(last_audio_duration,4),"final_scene_caption_end_seconds":round(last_caption_end,4),
        "final_audio_qa":audio_qa,"checks":checks}
    (out/"production_report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    qa={"passed":all(checks.values()),"checks":checks,"video_duration_seconds":round(duration,3),
        "expected_timeline_seconds":round(expected,3),"duration_delta_seconds":round(delta,3),
        "subtitle_band_black_ratio_min":round(band_min,4),"scene_count":88,"chapter_card_count":7,
        "motion_sequence":motion_seq,"timeline":timeline,"motion_continuity":motion_qa,"final_audio_qa":audio_qa}
    (out/"final_qa.json").write_text(json.dumps(qa,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    manifest=(ROOT/"assets"/"final"/"ASSET_MANIFEST.md").read_text(encoding="utf-8")
    credits=manifest+"\n\n## Audio / production\n- Narration: VOICEVOX:青山龍星\n- Chapter-card typing sound: original type_key.wav from the V153 format-v2 package\n- Endcard: endcard_v1.png, 20 seconds, silent\n- BGM: post-production by Muse according to the V2 format specification\n"
    (out/"CREDITS.txt").write_text(credits,encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=="__main__": main()
