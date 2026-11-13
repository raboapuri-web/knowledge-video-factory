#!/usr/bin/env python3
"""Finalize V154 chapter renders, inspect the master, and write timing/QA reports."""
import argparse, json, os, subprocess
from pathlib import Path
import cv2
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
import sys
sys.path.insert(0,str(ROOT.parent))
from motion.continuous_motion_qa import audit_30fps_motion
CHAPTERS=["prologue","chapter1","chapter2","chapter3","chapter4","chapter5","chapter6","epilogue"]
EXPECTED_SCENES=[f"S{i:03d}" for i in range(1,91)]

def run(cmd):
    subprocess.run(cmd,check=True)

def clock(sec):
    sec=int(round(sec))
    h=sec//3600; m=(sec%3600)//60; s=sec%60
    return f"{h:02d}:{m:02d}:{s:02d}"

def sample(cap,seconds,label):
    cap.set(cv2.CAP_PROP_POS_MSEC,max(0.0,seconds)*1000)
    ok,frame=cap.read()
    if not ok:
        raise RuntimeError(f"Cannot sample final master at {seconds:.3f}s ({label})")
    return cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--segments-dir",default="segments")
    args=ap.parse_args()
    segdir=Path(args.segments_dir)
    out=ROOT/"output"; out.mkdir(parents=True,exist_ok=True)
    timeline=[]; chapter_rows=[]; all_scenes=[]; motion_seq=[]; scene_layouts={}; elapsed=0.0
    concat=out/"concat-final.txt"; concat_lines=[]
    for chapter in CHAPTERS:
        video=segdir/f"v154-{chapter}.mp4"
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
            timeline.append({"kind":"scene","chapter":chapter,"scene":r["scene"],"start":elapsed,"end":elapsed+d,"duration":d,"motion":r["motion"]})
            all_scenes.append(r["scene"]); scene_layouts[r["scene"]]=r.get("layout"); motion_seq.append(r["motion"]); elapsed+=d
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
    if all_scenes!=EXPECTED_SCENES: raise RuntimeError(f"Expected S001-S090 exactly once; got {len(all_scenes)} scenes")
    expected_blur={"S018","S028","S032","S057"}
    actual_blur={sid for sid,layout in scene_layouts.items() if layout=="blurred_background_plus_centered_sharp_image"}
    if actual_blur!=expected_blur: raise RuntimeError(f"Blur-layout targets mismatch: expected {sorted(expected_blur)}, got {sorted(actual_blur)}")
    if scene_layouts.get("S090")!="single_image_full_frame": raise RuntimeError(f"S090 must use single_image_full_frame, got {scene_layouts.get(chr(83)+chr(48)+chr(57)+chr(48))}")
    board=json.loads((ROOT/"content"/"board.json").read_text(encoding="utf-8"))
    expected_s090=next(x["script"] for x in board["scenes"] if x["id"]=="S090")
    last_voice=voice["scenes"][-1]
    last_caption_end=float(last_voice["captions"][-1]["end"]) if last_voice.get("captions") else -1.0
    last_audio_duration=float(last_voice["duration"])
    last_scene_complete=(last_voice.get("scene")=="S090" and last_voice.get("narration_text")==expected_s090 and abs(last_caption_end-last_audio_duration)<=0.02)
    if not last_scene_complete: raise RuntimeError("S090 final narration/caption completion check failed")
    if any(motion_seq[i]==motion_seq[i-1]==motion_seq[i-2] for i in range(2,len(motion_seq))):
        raise RuntimeError("Three consecutive scenes use the same motion")
    concat.write_text("\n".join(concat_lines)+"\n",encoding="utf-8")
    final=out/"v154-pond-recovery-final.mp4"
    run(["ffmpeg","-y","-loglevel","error","-f","concat","-safe","0","-i",str(concat),"-c","copy","-movflags","+faststart",str(final)])
    probe=json.loads(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration,size:stream=codec_name,codec_type,width,height,r_frame_rate,sample_rate,channels","-of","json",str(final)],text=True))
    streams=probe.get("streams",[])
    video_stream=next((x for x in streams if x.get("codec_type")=="video"),{})
    audio_stream=next((x for x in streams if x.get("codec_type")=="audio"),{})
    duration=float(probe["format"]["duration"])
    expected=elapsed
    delta=abs(duration-expected)
    checks={
        "scene_count_90":len(all_scenes)==90,
        "chapter_card_count_8":sum(1 for x in timeline if x["kind"]=="chapter_card")==8,
        "scene_order_S001_to_S090":all_scenes==EXPECTED_SCENES,
        "no_three_consecutive_motion_repeats":True,
        "final_scene_S090_complete":last_scene_complete,
        "blur_layout_targets_exactly_four":actual_blur==expected_blur,
        "S090_full_frame_single_image":scene_layouts.get("S090")=="single_image_full_frame",
        "video_1920x1080":video_stream.get("width")==1920 and video_stream.get("height")==1080,
        "video_30fps":video_stream.get("r_frame_rate")=="30/1",
        "video_h264":video_stream.get("codec_name")=="h264",
        "audio_aac":audio_stream.get("codec_name")=="aac",
        "audio_48khz_mono":audio_stream.get("sample_rate")=="48000" and audio_stream.get("channels")==1,
        "duration_matches_scene_and_card_timeline":delta<=0.5
    }
    if not all(checks.values()):
        raise RuntimeError("Final technical QA failed: "+json.dumps(checks,ensure_ascii=False))
    cap=cv2.VideoCapture(str(final))
    if not cap.isOpened(): raise RuntimeError("Cannot open final master for frame QA")
    thumbs=[]; card_thumbs=[]; black_ratios=[]
    for item in timeline:
        if item["kind"]=="chapter_card":
            frame=sample(cap,item["end"]-0.35,item["chapter"]+" card")
            card_thumbs.append((item,Image.fromarray(frame).resize((480,270),Image.Resampling.LANCZOS)))
        else:
            frame=sample(cap,(item["start"]+item["end"])/2,item["scene"])
            gray=cv2.cvtColor(frame[950:1080,:,:],cv2.COLOR_RGB2GRAY)
            black_ratios.append(float((gray<25).mean()))
            thumbs.append((item,Image.fromarray(frame).resize((192,108),Image.Resampling.LANCZOS)))
    cap.release()
    band_min=min(black_ratios) if black_ratios else 0
    checks["subtitle_band_black_coverage_all_scene_midpoints"]=band_min>=0.85
    if not checks["subtitle_band_black_coverage_all_scene_midpoints"]:
        raise RuntimeError(f"Subtitle band coverage too low: {band_min:.4f}")
    scene_sheet=Image.new("RGB",(1920,9*132),(16,16,16)); draw=ImageDraw.Draw(scene_sheet); font=ImageFont.load_default()
    for i,(item,im) in enumerate(thumbs):
        x=(i%10)*192; y=(i//10)*132
        scene_sheet.paste(im,(x,y)); draw.text((x+5,y+110),f"{item['scene']}  {clock(item['start'])}",font=font,fill=(245,245,245))
    scene_sheet_path=out/"v154-contact-sheet.jpg"; scene_sheet.save(scene_sheet_path,quality=90,optimize=True)
    card_sheet=Image.new("RGB",(1920,2*298),(16,16,16)); cdraw=ImageDraw.Draw(card_sheet)
    for i,(item,im) in enumerate(card_thumbs):
        x=(i%4)*480; y=(i//4)*298
        card_sheet.paste(im,(x,y)); cdraw.text((x+8,y+274),f"{item['chapter']}  {clock(item['start'])}",font=font,fill=(245,245,245))
    card_sheet_path=out/"v154-chapter-cards-contact-sheet.jpg"; card_sheet.save(card_sheet_path,quality=90,optimize=True)
    # Verify decoded 30fps frame-to-frame motion across three windows of EVERY
    # zoom/pan scene; fail if the source image is effectively held at 10fps.
    continuous_motion_qa=audit_30fps_motion(final,timeline)
    (out/"motion_30fps_qa.json").write_text(json.dumps(continuous_motion_qa,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    checks["motion_all_moving_scenes_change_every_sampled_frame"]=continuous_motion_qa["passed"]
    if not continuous_motion_qa["passed"]:
        failure_examples=continuous_motion_qa["failures"][:3]
        raise RuntimeError("30fps motion continuity QA failed: "+json.dumps(failure_examples,ensure_ascii=False)[:2400])
    checks["scene_contact_sheet_90_frames"]=len(thumbs)==90
    checks["chapter_card_contact_sheet_8_frames"]=len(card_thumbs)==8
    if not checks["scene_contact_sheet_90_frames"] or not checks["chapter_card_contact_sheet_8_frames"]:
        raise RuntimeError("Contact-sheet frame count mismatch")
    report={
        "video_id":"v154","title":"池の水をぜんぶ抜いた。その後、池はどうなったのか？",
        "release_tag":os.getenv("RELEASE_TAG",""),
        "video_file":str(final.relative_to(ROOT)),
        "duration_seconds":round(duration,3),"duration_hms":clock(duration),
        "expected_timeline_seconds":round(expected,3),"duration_delta_seconds":round(delta,3),
        "resolution":"1920x1080","fps":"30/1","video_codec":video_stream.get("codec_name"),
        "audio_codec":audio_stream.get("codec_name"),"audio_sample_rate":audio_stream.get("sample_rate"),
        "audio_channels":audio_stream.get("channels"),"bgm":"none (explicitly omitted per user instruction)",
        "image_source":"assets/final/S001.jpg-S090.jpg only",
        "special_blur_background_scenes":["S018","S028","S032","S057"],
        "S090_layout":scene_layouts.get("S090"),
        "chapter_start_times":chapter_rows,
        "scene_count":len(all_scenes),"chapter_card_count":len(card_thumbs),
        "contact_sheet":str(scene_sheet_path.relative_to(ROOT)),
        "chapter_cards_contact_sheet":str(card_sheet_path.relative_to(ROOT)),
        "subtitle_band_black_ratio_min":round(band_min,4),
        "motion_30fps_qa_file":"output/motion_30fps_qa.json",
        "motion_moving_scenes_audited":continuous_motion_qa["moving_scenes_audited"],
        "motion_adjacent_frame_pairs_audited":continuous_motion_qa["adjacent_frame_pairs_audited"],
        "final_scene_audio_duration_seconds":round(last_audio_duration,4),
        "final_scene_caption_end_seconds":round(last_caption_end,4),
        "checks":checks
    }
    (out/"production_report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    qa={"passed":all(checks.values()),"checks":checks,"video_duration_seconds":round(duration,3),
        "expected_timeline_seconds":round(expected,3),"duration_delta_seconds":round(delta,3),
        "subtitle_band_black_ratio_min":round(band_min,4),"scene_count":len(all_scenes),
        "chapter_card_count":len(card_thumbs),"motion_sequence":motion_seq,"timeline":timeline,
        "motion_continuity":{"passed":continuous_motion_qa["passed"],"moving_scenes_audited":continuous_motion_qa["moving_scenes_audited"],"adjacent_frame_pairs_audited":continuous_motion_qa["adjacent_frame_pairs_audited"],"details":"motion_30fps_qa.json"}}
    (out/"final_qa.json").write_text(json.dumps(qa,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    manifest=(ROOT/"assets"/"final"/"ASSET_MANIFEST.md").read_text(encoding="utf-8")
    credits=manifest+"\n\n## Audio / production\n- Narration: VOICEVOX:青山龍星\n- Chapter-card typing sound: original type_key.wav from the V153 format-v2 package\n- BGM: none (omitted as requested)\n"
    (out/"CREDITS.txt").write_text(credits,encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False,indent=2))

if __name__=="__main__": main()
