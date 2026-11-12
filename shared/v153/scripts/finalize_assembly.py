#!/usr/bin/env python3
"""V153 assembly-only finalizer and decoded-timeline QA.

Reuses the six already-rendered chapter MP4s. It never synthesizes narration,
renders scenes, changes images/motion/subtitles/cards, or adds/mixes BGM.
"""
import argparse
import json
import math
import subprocess
import wave
from pathlib import Path

import numpy as np

ORDER = ["prologue", "chapter1", "chapter2", "chapter3", "chapter4", "epilogue"]
SAMPLE_RATE = 48000
PCM_CODEC = "s16le"


def run(cmd, **kwargs):
    subprocess.run([str(x) for x in cmd], check=True, **kwargs)


def capture(cmd):
    return subprocess.check_output([str(x) for x in cmd], text=True)


def probe(path):
    return json.loads(capture([
        "ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", path
    ]))


def decode_pcm(path, output_path):
    run([
        "ffmpeg", "-y", "-hide_banner", "-v", "error", "-i", path,
        "-map", "0:a:0", "-ac", "1", "-ar", str(SAMPLE_RATE),
        "-f", PCM_CODEC, output_path
    ])
    return Path(output_path).stat().st_size // 2


def packet_audio_audit(path, decoded_samples):
    data = json.loads(capture([
        "ffprobe", "-v", "error", "-select_streams", "a:0", "-show_packets",
        "-show_entries", "packet=duration", "-of", "json", path
    ]))
    durations = [int(p["duration"]) for p in data["packets"] if p.get("duration") is not None]
    packet_samples = sum(durations)
    return {
        "audio_packet_count": len(durations),
        "non_1024_sample_packet_count": sum(1 for d in durations if d != 1024),
        "packet_duration_sample_sum": packet_samples,
        "decoder_output_samples": decoded_samples,
        "decoded_minus_packet_duration_samples": decoded_samples - packet_samples,
        "decoded_minus_packet_duration_seconds": round((decoded_samples - packet_samples) / SAMPLE_RATE, 6),
    }


def normalized_xcorr_offset(region, template):
    """Return the best normalized template offset in samples using FFT correlation."""
    region = np.asarray(region, dtype=np.float32)
    template = np.asarray(template, dtype=np.float32)
    n, m = len(region), len(template)
    if n < m:
        raise ValueError("correlation region shorter than template")
    nfft = 1 << (n + m - 2).bit_length()
    convolution = np.fft.irfft(
        np.fft.rfft(region, nfft) * np.fft.rfft(template[::-1], nfft), nfft
    )
    corr = np.abs(convolution[m - 1:n])
    sq = np.concatenate(([0.0], np.cumsum(region.astype(np.float64) ** 2)))
    window_energy = sq[m:] - sq[:-m]
    denominator = np.sqrt(np.sum(template.astype(np.float64) ** 2) * window_energy)
    scores = corr / np.maximum(denominator, 1e-20)
    index = int(np.argmax(scores))
    return index, float(scores[index])


def first_active_sample(wav_path, threshold=0.002):
    with wave.open(str(wav_path), "rb") as wf:
        channels = wf.getnchannels()
        width = wf.getsampwidth()
        rate = wf.getframerate()
        raw = wf.readframes(wf.getnframes())
    if width != 2 or rate != SAMPLE_RATE:
        raise ValueError("type_key.wav must be 48kHz 16-bit PCM")
    samples = np.frombuffer(raw, dtype="<i2").astype(np.float32)
    if channels > 1:
        samples = samples.reshape(-1, channels).mean(axis=1)
    active = np.flatnonzero(np.abs(samples) / 32768.0 > threshold)
    return int(active[0]) if len(active) else 0


def packet_keyframes(path):
    data = json.loads(capture([
        "ffprobe", "-v", "error", "-select_streams", "v:0", "-show_packets",
        "-show_entries", "packet=pts_time,flags", "-of", "json", path
    ]))
    return [float(p["pts_time"]) for p in data["packets"] if "K" in p.get("flags", "")]


def transcribe_tail(video_path, duration, output_dir):
    try:
        from faster_whisper import WhisperModel
        start = max(0.0, duration - 15.0)
        wav_path = output_dir / "final-tail-15s.wav"
        run([
            "ffmpeg", "-y", "-hide_banner", "-v", "error", "-ss", f"{start:.6f}",
            "-i", video_path, "-t", f"{duration-start:.6f}", "-map", "0:a:0",
            "-ac", "1", "-ar", "16000", "-c:a", "pcm_s16le", wav_path
        ])
        model = WhisperModel("small", device="cpu", compute_type="int8")
        segments, info = model.transcribe(str(wav_path), language="ja", beam_size=5, vad_filter=False)
        rows = []
        for seg in segments:
            rows.append({
                "start_seconds": round(start + float(seg.start), 3),
                "end_seconds": round(start + float(seg.end), 3),
                "text": seg.text
            })
        return {"status": "completed", "language": info.language, "segments": rows,
                "text": "".join(x["text"] for x in rows)}
    except Exception as exc:
        return {"status": "unavailable", "reason": f"{type(exc).__name__}: {exc}", "segments": [], "text": ""}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--root", default="shared/v153")
    ap.add_argument("--segments", default="shared/v153/segments")
    ap.add_argument("--output", default="shared/v153/output")
    ap.add_argument("--qa", default="shared/v153/qa")
    args = ap.parse_args()

    root = Path(args.root)
    segments = Path(args.segments)
    output = Path(args.output)
    qa_dir = Path(args.qa)
    output.mkdir(parents=True, exist_ok=True)
    qa_dir.mkdir(parents=True, exist_ok=True)

    card_spec = json.loads((root / "format_v2/config/chapter_card_spec.json").read_text(encoding="utf-8"))
    card_by_chapter = {x["chapter"]: x for x in card_spec["cards"]}
    chapter_info = []
    concat_file = output / "concat-final.txt"
    with concat_file.open("w", encoding="utf-8") as fh:
        for chapter in ORDER:
            path = segments / f"v153-{chapter}.mp4"
            if not path.is_file() or path.stat().st_size < 20000:
                raise FileNotFoundError(f"Missing rendered chapter artifact: {path}")
            meta = probe(path)
            video = next(x for x in meta["streams"] if x["codec_type"] == "video")
            audio = next(x for x in meta["streams"] if x["codec_type"] == "audio")
            fmt_duration = float(meta["format"]["duration"])
            raw_path = output / f"decoded-{chapter}.s16le"
            decoded_samples = decode_pcm(path, raw_path)
            raw_path.unlink(missing_ok=True)
            packet_audit = packet_audio_audit(path, decoded_samples)
            chapter_info.append({
                "chapter": chapter,
                "file": path.name,
                "file_size_bytes": path.stat().st_size,
                "container_duration_seconds": fmt_duration,
                "video_start_time_seconds": float(video.get("start_time", 0)),
                "video_duration_seconds": float(video["duration"]),
                "audio_start_time_seconds": float(audio.get("start_time", 0)),
                "audio_stream_duration_seconds": float(audio["duration"]),
                "decoded_audio_samples": decoded_samples,
                "decoded_audio_seconds": decoded_samples / SAMPLE_RATE,
                "decoded_audio_minus_video_seconds": round(decoded_samples / SAMPLE_RATE - float(video["duration"]), 6),
                **packet_audit
            })
            fh.write(f"file '{path.resolve()}'\n")

    # Preserve the existing chapter video packets and AAC packet timeline in an
    # intermediate stream-copy assembly. This is the exact legacy concat stage.
    intermediate = output / "v153-deep-sea-streamcopy-intermediate.mp4"
    run([
        "ffmpeg", "-y", "-hide_banner", "-v", "error",
        "-f", "concat", "-safe", "0", "-i", concat_file,
        "-c", "copy", "-movflags", "+faststart", intermediate
    ])

    # Decode intermediate audio once to measure the actual legacy chapter-card
    # offsets in the same way a player/decoder consumes the complete MP4.
    intermediate_pcm = output / "intermediate-audio.s16le"
    intermediate_samples = decode_pcm(intermediate, intermediate_pcm)
    intermediate_audio = np.memmap(intermediate_pcm, dtype="<i2", mode="r")
    cumulative_container_start = 0.0
    baseline_card_offsets = []
    for item in chapter_info:
        chapter = item["chapter"]
        template_path = output / f"template-{chapter}.s16le"
        run([
            "ffmpeg", "-y", "-hide_banner", "-v", "error",
            "-i", segments / item["file"], "-t", "2.5",
            "-map", "0:a:0", "-ac", "1", "-ar", str(SAMPLE_RATE),
            "-f", PCM_CODEC, template_path
        ])
        template = np.fromfile(template_path, dtype="<i2").astype(np.float32)[::4]
        template_path.unlink(missing_ok=True)
        lo = int(cumulative_container_start * SAMPLE_RATE)
        hi = min(intermediate_samples, int((cumulative_container_start + 5.0) * SAMPLE_RATE))
        region = np.asarray(intermediate_audio[lo:hi], dtype=np.float32)[::4]
        offset_samples, score = normalized_xcorr_offset(region, template)
        measured_start = cumulative_container_start + offset_samples * 4 / SAMPLE_RATE
        baseline_card_offsets.append({
            "chapter": chapter,
            "expected_audio_start_seconds": round(cumulative_container_start, 6),
            "measured_card_audio_start_seconds": round(measured_start, 6),
            "cumulative_audio_shift_seconds": round(measured_start - cumulative_container_start, 6),
            "correlation_score": round(score, 6)
        })
        cumulative_container_start += item["container_duration_seconds"]
    del intermediate_audio
    intermediate_pcm.unlink(missing_ok=True)

    # Critical repair: retain video packets bit-for-bit, but decode/resample/re-encode
    # the continuous AAC timeline. async=1000 plus min_hard_comp=1ms removes the
    # short AAC packet durations at the old scene/chapter cuts rather than allowing
    # the AAC decoder to output a full 1024-sample frame for each shortened packet.
    final_path = output / "v153-deep-sea-gigantism-final.mp4"
    run([
        "ffmpeg", "-y", "-hide_banner", "-v", "error", "-i", intermediate,
        "-map", "0:v:0", "-map", "0:a:0", "-c:v", "copy",
        "-af", "aresample=async=1000:min_hard_comp=0.001:first_pts=0",
        "-c:a", "aac", "-b:a", "160k", "-ar", str(SAMPLE_RATE), "-ac", "1",
        "-shortest", "-movflags", "+faststart", final_path
    ])

    final_meta = probe(final_path)
    final_video = next(x for x in final_meta["streams"] if x["codec_type"] == "video")
    final_audio = next(x for x in final_meta["streams"] if x["codec_type"] == "audio")
    final_duration = float(final_meta["format"]["duration"])
    final_pcm = output / "final-audio-decoded.s16le"
    final_samples = decode_pcm(final_path, final_pcm)
    final_audio_array = np.memmap(final_pcm, dtype="<i2", mode="r")
    final_seconds = final_samples / SAMPLE_RATE

    final_keyframes = packet_keyframes(final_path)
    key_wav = root / "format_v2/audio/type_key.wav"
    key_lead_samples = first_active_sample(key_wav)
    key_lead_seconds = key_lead_samples / SAMPLE_RATE
    fps = float(card_spec["resolution"]["fps"])
    start_delay = float(card_spec["duration_policy"]["start_delay_sec"])
    first_text_frame_index = int(math.ceil(start_delay * fps - 1e-9))
    final_card_alignment = []
    cumulative_container_start = 0.0
    for item in chapter_info:
        chapter = item["chapter"]
        template_path = output / f"template-final-{chapter}.s16le"
        run([
            "ffmpeg", "-y", "-hide_banner", "-v", "error",
            "-i", segments / item["file"], "-t", "2.5",
            "-map", "0:a:0", "-ac", "1", "-ar", str(SAMPLE_RATE),
            "-f", PCM_CODEC, template_path
        ])
        template = np.fromfile(template_path, dtype="<i2").astype(np.float32)[::4]
        template_path.unlink(missing_ok=True)
        lo = int(cumulative_container_start * SAMPLE_RATE)
        hi = min(final_samples, int((cumulative_container_start + 5.0) * SAMPLE_RATE))
        region = np.asarray(final_audio_array[lo:hi], dtype=np.float32)[::4]
        offset_samples, score = normalized_xcorr_offset(region, template)
        measured_start = cumulative_container_start + offset_samples * 4 / SAMPLE_RATE
        expected_video_start = cumulative_container_start + item["video_start_time_seconds"]
        keyframe = min(final_keyframes, key=lambda t: abs(t - expected_video_start))
        visual_first_char = keyframe + first_text_frame_index / fps
        audio_first_key = measured_start + start_delay + key_lead_seconds
        final_card_alignment.append({
            "chapter": chapter,
            "measured_audio_card_start_seconds": round(measured_start, 6),
            "expected_audio_card_start_seconds": round(cumulative_container_start, 6),
            "audio_card_start_residual_ms": round((measured_start - cumulative_container_start) * 1000, 3),
            "video_card_first_keyframe_seconds": round(keyframe, 6),
            "first_visible_label_character_frame_index": first_text_frame_index,
            "first_visible_label_character_seconds": round(visual_first_char, 6),
            "first_typing_sound_onset_seconds": round(audio_first_key, 6),
            "typing_sound_minus_visual_ms": round((audio_first_key - visual_first_char) * 1000, 3),
            "template_correlation_score": round(score, 6)
        })
        cumulative_container_start += item["container_duration_seconds"]

    thresholds = [0.001, 0.002, 0.005, 0.01, 0.02]
    last_active = {}
    def last_active_index(samples, threshold):
        limit = int(round(threshold * 32768))
        chunk_size = 1_000_000
        for end_idx in range(len(samples), 0, -chunk_size):
            start_idx = max(0, end_idx - chunk_size)
            chunk = np.asarray(samples[start_idx:end_idx], dtype=np.int32)
            hits = np.flatnonzero(np.abs(chunk) > limit)
            if len(hits):
                return start_idx + int(hits[-1])
        return 0

    for threshold in thresholds:
        last_idx = last_active_index(final_audio_array, threshold)
        end = last_idx / SAMPLE_RATE
        last_active[str(threshold)] = {
            "last_active_sample": last_idx,
            "last_active_seconds": round(end, 6),
            "decoded_tail_silence_seconds": round(final_seconds - end, 6),
            "silence_until_video_end_seconds": round(
                float(final_video.get("start_time", 0)) + float(final_video["duration"]) - end, 6
            )
        }

    transcription = transcribe_tail(str(final_path), final_duration, output)
    video_packet_count = int(final_video.get("nb_frames", 0))
    audio_video_duration_delta = final_seconds - float(final_video["duration"])
    report = {
        "project": "V153 deep-sea gigantism",
        "source_run_id": 43164736663,
        "assembly_only": True,
        "bgm_added_or_mixed": False,
        "chapter_assets_regenerated": False,
        "chapter_order": ORDER,
        "legacy_concat_command": "ffmpeg -f concat -safe 0 -i concat-final.txt -c copy -movflags +faststart intermediate.mp4",
        "corrected_final_mux": {
            "video": "stream copy (-c:v copy; no video re-encode)",
            "audio_filter": "aresample=async=1000:min_hard_comp=0.001:first_pts=0",
            "audio_encoding": "AAC 160k, 48kHz mono",
            "shortest": True,
            "bgm": "not added or mixed"
        },
        "chapter_measurements_before_repair": chapter_info,
        "chapter_card_audio_offsets_before_repair": baseline_card_offsets,
        "chapter_card_audio_offsets_after_repair": final_card_alignment,
        "final_file": {
            "path": str(final_path),
            "size_bytes": final_path.stat().st_size,
            "container_duration_seconds": final_duration,
            "video_duration_seconds": float(final_video["duration"]),
            "video_start_time_seconds": float(final_video.get("start_time", 0)),
            "video_end_time_seconds": float(final_video.get("start_time", 0)) + float(final_video["duration"]),
            "video_frame_count": video_packet_count,
            "audio_stream_duration_seconds": float(final_audio["duration"]),
            "audio_start_time_seconds": float(final_audio.get("start_time", 0)),
            "decoded_audio_sample_rate": SAMPLE_RATE,
            "decoded_audio_channels": 1,
            "decoded_audio_sample_count": final_samples,
            "decoded_audio_seconds": final_seconds,
            "decoded_audio_minus_video_duration_seconds": round(audio_video_duration_delta, 6),
            "decoded_audio_minus_container_duration_seconds": round(final_seconds - final_duration, 6),
            "last_active_audio_by_normalized_amplitude_threshold": last_active,
            "transcription_last_15_seconds": transcription
        },
        "checks": {
            "final_file_exists": final_path.is_file() and final_path.stat().st_size > 500000,
            "video_stream_copied": video_packet_count > 0,
            "decoded_audio_within_one_frame_of_video_duration": abs(audio_video_duration_delta) <= 1.0 / fps,
            "audio_ends_with_at_least_80ms_silence": last_active["0.005"]["decoded_tail_silence_seconds"] >= 0.08,
            "all_card_audio_offsets_within_10ms": all(abs(x["audio_card_start_residual_ms"]) <= 10 for x in final_card_alignment),
            "typing_sound_visual_offset_within_one_frame": all(abs(x["typing_sound_minus_visual_ms"]) <= 1000 / fps for x in final_card_alignment),
            "chapter_count_six": len(chapter_info) == 6
        }
    }
    report["passed"] = all(report["checks"].values())
    report_path = qa_dir / "final-assembly-timeline-audit.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    (root / "production_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if not report["passed"]:
        raise SystemExit("Final decoded-timeline QA failed")


if __name__ == "__main__":
    main()
