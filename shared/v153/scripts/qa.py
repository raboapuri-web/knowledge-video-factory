#!/usr/bin/env python3
import json, subprocess, sys, os
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
BOARD=json.loads((ROOT/"content/board.json").read_text(encoding="utf-8"))
ASSETS=json.loads((ROOT/"assets/asset_manifest.json").read_text(encoding="utf-8"))
def probe(path):
    return json.loads(subprocess.check_output(["ffprobe","-v","error","-show_streams","-show_format","-of","json",str(path)],text=True))

CHAPTER_ORDER=["prologue","chapter1","chapter2","chapter3","chapter4","epilogue"]
SINGLE_IMAGE_TARGETS=["S001","S002","S003","S009","S011","S014","S015","S024","S033","S034","S035","S057","S058","S062","S077","S078","S081","S082","S085","S086","S087"]

def load_chapter_narration_qa():
    chapters=[]; errors=[]
    for chapter in CHAPTER_ORDER:
        path=ROOT/"segments"/f"narration-qa-{chapter}.json"
        if not path.is_file():
            errors.append(f"missing {path.name}")
            continue
        item=json.loads(path.read_text(encoding="utf-8"))
        chapters.append(item)
        if item.get("chapter")!=chapter or item.get("passed") is not True:
            errors.append(f"{chapter}: chapter narration QA did not pass")
        if item.get("removed_heading_count")!=1:
            errors.append(f"{chapter}: expected exactly one removed heading")
        for key in ("first_subtitle_is_body","body_text_preserved","title_lines_absent_from_voice_and_subtitles"):
            if item.get(key) is not True:
                errors.append(f"{chapter}: {key} did not pass")
    summary={
        "passed":not errors and len(chapters)==len(CHAPTER_ORDER),
        "removed_heading_count":sum(int(x.get("removed_heading_count",0)) for x in chapters),
        "chapters":[{
            "chapter":x.get("chapter"),
            "first_scene":x.get("first_scene"),
            "first_subtitle":x.get("first_subtitle"),
            "first_subtitle_is_body":x.get("first_subtitle_is_body"),
            "removed_heading_lines":x.get("removed_heading_lines",[]),
            "body_text_preserved":x.get("body_text_preserved"),
            "title_lines_absent_from_voice_and_subtitles":x.get("title_lines_absent_from_voice_and_subtitles")
        } for x in chapters],
        "errors":errors
    }
    return summary

def main(final=None):
    collected=len(ASSETS.get("collected",[]))
    generated=sum(1 for s in BOARD["scenes"] if s["mode"]=="生成" and (ROOT/"assets/generated"/(s["id"]+".png")).is_file())
    report={"scene_count":len(BOARD["scenes"]),"collected_screens":collected,"generated_screens":generated,
            "voice":"VOICEVOX:青山龍星","voicevox_speaker_id":13,"resolution":[1920,1080],"fps":30,
            "asset_rights_skipped":len(ASSETS.get("rights_skipped",[])),
            "asset_composition_warnings":len(ASSETS.get("composition_warnings",[]))}
    if final:
        path=Path(final); path=path if path.is_absolute() else ROOT/path
        meta=probe(path); streams=meta["streams"]
        v=next(x for x in streams if x.get("codec_type")=="video")
        a=next(x for x in streams if x.get("codec_type")=="audio")
        duration=float(meta["format"]["duration"])
        chapter_narration=load_chapter_narration_qa()
        report["chapter_narration"]=chapter_narration
        collected_by_scene={x["scene"]:x for x in ASSETS.get("collected",[])}
        single_image_targets=[]
        single_image_target_failures=[]
        for sid in SINGLE_IMAGE_TARGETS:
            rec=collected_by_scene.get(sid)
            if not rec:
                single_image_target_failures.append({"scene":sid,"reason":"missing manifest record"})
                continue
            rel=rec.get("file") or f"assets/collected/{sid}.jpg"
            exists=(ROOT/rel).is_file()
            item={"scene":sid,"asset_count":rec.get("asset_count"),"required_panels":rec.get("required_panels"),"file":rel,"exists":exists}
            single_image_targets.append(item)
            if rec.get("asset_count")!=1 or rec.get("required_panels")!=1 or not exists:
                single_image_target_failures.append({"scene":sid,"reason":"single-image asset validation failed","file":rel})
        remaining_multi_panel_scenes=[x.get("scene") for x in ASSETS.get("collected",[]) if x.get("asset_count")!=1 or x.get("required_panels")!=1]
        report["single_image_targets"]=single_image_targets
        report["single_image_target_failures"]=single_image_target_failures
        report["remaining_multi_panel_scenes"]=remaining_multi_panel_scenes
        checks={"video_exists":path.is_file() and path.stat().st_size>500000,
                "video_1920x1080":v.get("width")==1920 and v.get("height")==1080,
                "video_30fps":v.get("r_frame_rate")=="30/1",
                "video_h264":v.get("codec_name")=="h264",
                "audio_aac":a.get("codec_name")=="aac",
                "collected_78":collected==78,"generated_10":generated==10,"scene_count_88":report["scene_count"]==88,
                "chapter_headings_excluded_from_voice_and_subtitles":chapter_narration["passed"] and chapter_narration["removed_heading_count"]==6,
                "chapter_first_subtitles_are_body":chapter_narration["passed"] and all(x.get("first_subtitle_is_body") is True for x in chapter_narration["chapters"]),
                "no_missing_assets":not ASSETS.get("missing"),
                "no_unresolved_compositions":not ASSETS.get("composition_warnings"),
                "single_image_targets_21":len(single_image_targets)==len(SINGLE_IMAGE_TARGETS) and not single_image_target_failures,
                "no_remaining_multi_panel_assets":not remaining_multi_panel_scenes}
        report.update({"duration_seconds":duration,"duration_minutes":round(duration/60,2),
                       "file_size_bytes":path.stat().st_size,"format":"MP4 H.264/AAC","checks":checks,"passed":all(checks.values())})
        report["cost_estimate"]={"openai_api_usd":0,"voicevox_api_usd":0,"asset_download_api_usd":0,
            "note":"VOICEVOX runs locally in the GitHub Actions CPU container. NOAA/Commons media downloads use public URLs. GitHub Actions runner charges, if any, depend on the repository plan and remaining included minutes."}
        (ROOT/"qa").mkdir(exist_ok=True)
        (ROOT/"qa/final.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
        (ROOT/"production_report.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
        print(json.dumps(report,ensure_ascii=False,indent=2))
        if not report["passed"]: raise SystemExit("Final QA failed")
    else:
        print(json.dumps(report,ensure_ascii=False,indent=2))
if __name__=="__main__":
    main(sys.argv[1] if len(sys.argv)>1 else None)
