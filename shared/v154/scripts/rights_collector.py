#!/usr/bin/env python3
"""
Rights-gated image collector for Kangaeru Yoru (new photo-slide pipeline).

Design rule (fail-closed):
  An image is downloaded ONLY after its source metadata passes the rights gate.
  Unknown / ambiguous licence = rejected, never downloaded.
  The manifest is the source of truth; all counts in the summary are computed
  from the manifest data structures, never summarised from memory.

Sources (structured licence metadata only):
  - Wikimedia Commons API (extmetadata: LicenceShortName, LicenceUrl, Artist)
  - Openverse API (license, license_url, creator, foreign_landing_url)

Suitability gates:
  - Basic (always): raster image only (no PDF/SVG/document), minimum size,
    real dimensions re-verified with PIL after download, sha256 duplicate check.
  - Vision (optional, --vision): OpenAI API checks subject match, burned-in
    text/logo/watermark, and document/book-page contamination. Requires
    OPENAI_API_KEY in the environment. Without it, screens are reported as
    rights_ok_vision_pending, NOT as fully cleared.

Usage:
  python3 collector.py --screens screens.json --out out_dir [--vision]
                       [--min-width 1920] [--min-height 1080]
 [--per-screen-candidates 20] [--resume]

screens.json format:
  [{"id": "S032", "query": "giant isopod", "subject": "a giant isopod on the deep sea floor"},
   ...]
"""

import argparse
import base64
import hashlib
import html
import io
import json
import os
import re
import sys
import time

import requests
from PIL import Image, ImageDraw

USER_AGENT = "KangaeruYoruRightsCollector/3.0 (rights-gated research use)"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
OPENVERSE_API = "https://api.openverse.org/v1/images/"

# HTTP behaviour (set from CLI in main). v1 lesson (run 42960388082):
# no pacing/retry -> Commons 429s killed the run at 0/40. v2 lesson
# (run 42963127300, cancelled by the user after 2h17m): retries were
# effectively unbounded in wall-clock terms (Retry-After up to 120s per
# retry, several requests per screen), so the run could not finish in a
# reasonable time and, because outputs were written only at the end, a
# kill would have lost everything. v3 therefore: caps every retry delay,
# gives each screen and the whole run a hard deadline, and persists
# manifest/audit after EVERY screen.
HTTP_CFG = {"pace": 0.6, "retries": 2, "retry_base": 3.0, "retry_cap": 20.0}
_last_request_at = [0.0]


def http_get(url, params=None, timeout=60):
    """GET with pacing + tightly bounded retry on 429/503."""
    attempt = 0
    while True:
        wait = HTTP_CFG["pace"] - (time.monotonic() - _last_request_at[0])
        if wait > 0:
            time.sleep(wait)
        try:
            resp = requests.get(url, params=params,
                                headers={"User-Agent": USER_AGENT}, timeout=timeout)
        finally:
            _last_request_at[0] = time.monotonic()
        if resp.status_code in (429, 503) and attempt < HTTP_CFG["retries"]:
            retry_after = resp.headers.get("Retry-After", "")
            if retry_after.isdigit():
                delay = min(float(retry_after), 30.0)
            else:
                delay = min(HTTP_CFG["retry_base"] * (3 ** attempt),
                            HTTP_CFG["retry_cap"])
            time.sleep(delay)
            attempt += 1
            continue
        return resp

# ---------------------------------------------------------------- rights gate

# Normalised licence -> allowed or not. Anything not matched here is rejected
# as unknown (fail-closed).
def classify_license(raw):
    """Strict allowlist: Public Domain, CC0, and CC BY only."""
    if not raw:
        return ("", False, "missing_license")
    text = re.sub(r"<[^>]+>", " ", str(raw))
    text = html.unescape(text).strip().lower()
    text = re.sub(r"\s+", " ", text)

    if "noncommercial" in text or "non-commercial" in text or re.search(r"\bnc\b", text) or "-nc" in text:
        return (text, False, "license_nc_excluded")
    if "no derivatives" in text or "noderivs" in text or re.search(r"\bnd\b", text) or "-nd" in text:
        return (text, False, "license_nd_excluded")
    if "share alike" in text or "share-alike" in text or "cc by-sa" in text or "-sa" in text:
        return (text, False, "license_sa_excluded")
    if "all rights reserved" in text or "copyrighted" in text or text.startswith("©") or "fair use" in text:
        return (text, False, "copyright_or_fair_use_excluded")

    if text in ("cc0", "cc zero") or text.startswith("cc0 ") or "publicdomain/zero" in text or "creative commons zero" in text:
        return ("CC0", True, "")
    if text in ("public domain", "pd") or text.startswith("public domain ") or text.startswith("pd-") or text.startswith("pdm"):
        return ("Public Domain", True, "")
    if re.fullmatch(r"cc by(?:\s+\d\.\d)?(?:\s+international)?", text):
        version = re.search(r"\d\.\d", text)
        return ("CC BY" + (" " + version.group(0) if version else ""), True, "")
    return (text, False, "license_not_whitelisted")

def rights_gate(candidate):
    """Fail-closed rights check. No SA override is supported for V154."""
    reasons = []
    canonical, allowed, reason = classify_license(candidate.get("license", ""))
    candidate["license_canonical"] = canonical
    if not allowed:
        reasons.append(reason or "license_not_whitelisted")
    if not candidate.get("source_page"):
        reasons.append("missing_source_page")
    if canonical.startswith("CC") and not candidate.get("license_url"):
        reasons.append("missing_license_url")
    author = str(candidate.get("author") or "").strip()
    if not author or author.lower() in ("unknown", "unknown author", "not stated", "anonymous"):
        reasons.append("missing_author")
    return (len(reasons) == 0, reasons)

# ------------------------------------------------------------------- sources

def strip_html(raw):
    if not raw:
        return ""
    text = re.sub(r"<[^>]+>", " ", str(raw))
    return re.sub(r"\s+", " ", html.unescape(text)).strip()


def search_commons(query, limit):
    params = {
        "action": "query",
        "format": "json",
        "generator": "search",
        "gsrsearch": f"filetype:bitmap {query}",
        "gsrnamespace": 6,
        "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|size|mime|extmetadata",
    }
    r = http_get(COMMONS_API, params=params, timeout=60)
    r.raise_for_status()
    pages = (r.json().get("query") or {}).get("pages") or {}
    out = []
    for page in pages.values():
        infos = page.get("imageinfo") or []
        if not infos:
            continue
        info = infos[0]
        meta = {k.lower(): (v or {}).get("value", "")
                for k, v in (info.get("extmetadata") or {}).items()}
        out.append({
            "source": "wikimedia_commons",
            "title": page.get("title", ""),
            "image_url": info.get("url", ""),
            "source_page": info.get("descriptionurl", ""),
            "license": strip_html(meta.get("licenseshortname", "")),
            "license_url": meta.get("licenseurl", ""),
            "author": strip_html(meta.get("artist", "")),
            "width": info.get("width", 0),
            "height": info.get("height", 0),
            "mime": info.get("mime", ""),
        })
    return out


def search_openverse(query, limit):
    # Anonymous Openverse requests are capped at page_size 20 (401 above that).
    # Pre-filter at the source to licences that can pass the rights gate;
    # the per-item gate still verifies every candidate before download.
    params = {"q": query, "page_size": min(limit, 20), "filter_dead": "false",
              "license": "by,cc0,pdm"}
    r = http_get(OPENVERSE_API, params=params, timeout=60)
    r.raise_for_status()
    out = []
    for item in r.json().get("results") or []:
        lic = (item.get("license") or "").upper()
        version = item.get("license_version") or ""
        out.append({
            "source": "openverse",
            "title": item.get("title") or "",
            "image_url": item.get("url", ""),
            "source_page": item.get("foreign_landing_url", ""),
            "license": f"CC {lic} {version}".strip() if lic else "",
            "license_url": item.get("license_url", ""),
            "author": item.get("creator") or "",
            "width": item.get("width") or 0,
            "height": item.get("height") or 0,
            "mime": "",
        })
    return out


# -------------------------------------------------------------- vision gate

def vision_check(image_path, subject, model):
    """OpenAI vision suitability check. Returns dict or None on API failure."""
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        return None
    img = Image.open(image_path).convert("RGB")
    img.thumbnail((768, 768))
    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=80)
    b64 = base64.b64encode(buf.getvalue()).decode()
    prompt = (
        "You inspect one still image for a narration video.\n"
        f"Expected subject: {subject}\n"
        "Return JSON only with: is_match (bool), has_burned_in_text (bool), "
        "has_logo (bool), has_watermark (bool), is_document_page (bool), "
        "actual_subject (str), reason (str), confidence (0..1).\n"
        "Reject any visible or burned-in words, captions, labels, logos, "
        "watermarks, signatures, UI overlays, or screenshots of text. "
        "Do not infer a location or species from a caption; judge the visible image."
    )

    body = {
        "model": model,
        "messages": [{"role": "user", "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
        ]}],
        "max_tokens": 400,
    }
    r = requests.post("https://api.openai.com/v1/chat/completions", json=body,
                      headers={"Authorization": f"Bearer {key}"}, timeout=120)
    r.raise_for_status()
    content = r.json()["choices"][0]["message"]["content"]
    content = re.sub(r"^```(json)?|```$", "", content.strip(), flags=re.M)
    return json.loads(content)


# -------------------------------------------------------------- contact sheet

def make_contact_sheet(entries, out_path, cols=4, thumb_w=480):
    rows = (len(entries) + cols - 1) // cols
    thumb_h = int(thumb_w * 9 / 16)
    label_h = 28
    sheet = Image.new("RGB", (cols * thumb_w, rows * (thumb_h + label_h)), "black")
    draw = ImageDraw.Draw(sheet)
    for i, e in enumerate(entries):
        x = (i % cols) * thumb_w
        y = (i // cols) * (thumb_h + label_h)
        status = e.get("status", "missing")
        if e.get("file") and os.path.exists(e["file"]):
            try:
                im = Image.open(e["file"]).convert("RGB")
                im.thumbnail((thumb_w, thumb_h))
                sheet.paste(im, (x, y))
            except Exception:
                pass
        draw.rectangle([x, y + thumb_h, x + thumb_w, y + thumb_h + label_h], fill=(30, 30, 30))
        draw.text((x + 6, y + thumb_h + 7), f"{e['id']}  {status}", fill=(255, 255, 0))
    sheet.save(out_path, quality=88)


# --------------------------------------------------------------------- main

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--screens", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--min-width", type=int, default=0)
    ap.add_argument("--min-height", type=int, default=0)
    ap.add_argument("--per-screen-candidates", type=int, default=20)
    ap.add_argument("--vision", action="store_true")
    ap.add_argument("--vision-model", default=os.environ.get("OPENAI_VISION_MODEL", "gpt-4o-mini"))
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--sources", default="commons,openverse",
                    help="comma list: commons,openverse")
    ap.add_argument("--max-download-attempts", type=int, default=5,
                    help="per-screen cap so a failing host is not hammered")
    ap.add_argument("--pace", type=float, default=0.6,
                    help="minimum seconds between HTTP requests")
    ap.add_argument("--retries", type=int, default=2,
                    help="retries per request on HTTP 429/503")
    ap.add_argument("--retry-base", type=float, default=3.0,
                    help="base seconds for exponential backoff on 429/503")
    ap.add_argument("--retry-cap", type=float, default=20.0,
                    help="maximum seconds for any single retry delay")
    ap.add_argument("--screen-deadline", type=float, default=150.0,
                    help="seconds after which a screen is given up as missing")
    ap.add_argument("--run-deadline", type=float, default=2700.0,
                    help="seconds after which remaining screens are marked missing")
    args = ap.parse_args()
    HTTP_CFG.update({"pace": args.pace, "retries": args.retries,
                     "retry_base": args.retry_base, "retry_cap": args.retry_cap})
    try:
        sys.stdout.reconfigure(line_buffering=True)
    except Exception:
        pass
    use_sources = [s.strip() for s in args.sources.split(",") if s.strip()]
    run_started = time.monotonic()

    with open(args.screens, encoding="utf-8") as f:
        screens = json.load(f)
    os.makedirs(args.out, exist_ok=True)
    img_dir = os.path.join(args.out, "images")
    os.makedirs(img_dir, exist_ok=True)

    previous = {}
    manifest_path = os.path.join(args.out, "manifest.json")
    if args.resume and os.path.exists(manifest_path):
        with open(manifest_path, encoding="utf-8") as f:
            for e in json.load(f).get("screens", []):
                if e.get("file") and os.path.exists(e["file"]):
                    previous[e["id"]] = e

    entries, audit, seen_hashes = [], [], set()

    def write_outputs(complete=False):
        """Persist manifest/audit/credits/contact sheet from current state.
        Called after every screen so a killed run keeps finished work."""
        counts = {}
        for e in entries:
            counts[e["status"]] = counts.get(e["status"], 0) + 1
        manifest = {
            "version": "rights-collector-3.0",
            "license_rule": "fail-closed: PD/CC0/CC BY (credit) only; NC/ND/SA/unknown rejected before download",
            "min_size": [args.min_width, args.min_height],
            "vision_enabled": bool(args.vision),
            "complete": complete,
            "total_screens": len(entries),
            "counts": counts,
            "screens": entries,
        }
        with open(manifest_path, "w", encoding="utf-8") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)
        with open(os.path.join(args.out, "audit.json"), "w", encoding="utf-8") as f:
            json.dump(audit, f, ensure_ascii=False, indent=2)
        with open(os.path.join(args.out, "credits.txt"), "w", encoding="utf-8") as f:
            for e in entries:
                if e.get("credit"):
                    f.write(f"{e['id']}: {e['credit']}\n")
        try:
            make_contact_sheet(entries, os.path.join(args.out, "contact_sheet.jpg"))
        except Exception:
            pass
        return counts

    for idx, screen in enumerate(screens):
        sid = screen["id"]
        if time.monotonic() - run_started > args.run_deadline:
            for rest in screens[idx:]:
                entries.append({"id": rest["id"], "query": rest["query"],
                                "subject": rest.get("subject", rest["query"]),
                                "status": "missing", "file": "",
                                "rights_checked": False,
                                "deadline_reason": "run_deadline_exceeded"})
                print(f"{rest['id']}: missing (run deadline)", flush=True)
            break
        if sid in previous:
            entries.append(previous[sid])
            seen_hashes.add(previous[sid].get("sha256", ""))
            print(f"{sid}: resume, already collected", flush=True)
            write_outputs()
            continue
        screen_started = time.monotonic()
        print(f"{sid}: start ({idx + 1}/{len(screens)})", flush=True)

        query = screen["query"]
        subject = screen.get("subject", query)
        # Progressive query relaxation: the curated queries are long AND-ed
        # keyword strings that often return zero results. Fall back to the
        # first 4, then first 2 terms per source, and record every search
        # outcome so "no candidates" is distinguishable from "search failed".
        terms = query.split()
        variants = [query]
        if len(terms) > 4:
            variants.append(" ".join(terms[:4]))
        if len(terms) > 2:
            variants.append(" ".join(terms[:2]))
        candidates = []
        seen_urls = set()
        source_fns = {"commons": search_commons, "openverse": search_openverse}
        for name in use_sources:
            fn = source_fns.get(name)
            if fn is None:
                continue
            for variant in variants:
                if time.monotonic() - screen_started > args.screen_deadline:
                    audit.append({"screen": sid, "stage": "deadline",
                                  "reasons": ["screen_deadline_exceeded"]})
                    break
                try:
                    found = fn(variant, args.per_screen_candidates)
                except Exception as exc:  # source outage must not kill the run
                    audit.append({"screen": sid, "source": name, "stage": "search",
                                  "query_used": variant, "error": str(exc)[:300]})
                    found = None
                if found is None:
                    continue
                audit.append({"screen": sid, "source": name, "stage": "search",
                              "query_used": variant, "found": len(found)})
                for cand in found:
                    url = cand.get("image_url", "")
                    if url and url not in seen_urls:
                        seen_urls.add(url)
                        candidates.append(cand)
                if found:
                    break

        chosen = None
        download_attempts = 0
        screen_reasons = {}

        def note_reason(rec):
            for r in rec.get("reasons", []):
                key = re.sub(r"_\d+x\d+$", "", r)
                screen_reasons[key] = screen_reasons.get(key, 0) + 1

        for cand in candidates:
            if time.monotonic() - screen_started > args.screen_deadline:
                audit.append({"screen": sid, "stage": "deadline",
                              "reasons": ["screen_deadline_exceeded"]})
                screen_reasons["screen_deadline_exceeded"] = \
                    screen_reasons.get("screen_deadline_exceeded", 0) + 1
                break
            rec = {"screen": sid, **{k: cand.get(k, "") for k in
                     ("source", "title", "source_page", "license", "license_url", "author")}}
            ok, reasons = rights_gate(cand)
            rec["license_canonical"] = cand.get("license_canonical", "")
            if not ok:
                rec["result"] = "rejected_rights"
                rec["reasons"] = reasons
                audit.append(rec)
                note_reason(rec)
                continue
            if cand.get("mime") and cand["mime"] not in ("image/jpeg", "image/png", "image/webp"):
                rec["result"] = "rejected_basic"
                rec["reasons"] = [f"mime_{cand['mime']}"]
                audit.append(rec)
                note_reason(rec)
                continue
            if cand.get("width", 0) and (cand["width"] < args.min_width or cand["height"] < args.min_height):
                rec["result"] = "rejected_basic"
                rec["reasons"] = [f"too_small_{cand['width']}x{cand['height']}"]
                audit.append(rec)
                note_reason(rec)
                continue

            # Rights gate passed -> only now is downloading allowed.
            if download_attempts >= args.max_download_attempts:
                rec["result"] = "skipped_attempt_cap"
                rec["reasons"] = ["max_download_attempts_reached"]
                audit.append(rec)
                note_reason(rec)
                break
            download_attempts += 1
            try:
                clean_url = cand["image_url"].split("?")[0]
                resp = http_get(clean_url, timeout=120)
                if resp.status_code == 429:
                    # http_get already retried with backoff; a still-429 here
                    # rejects this candidate only, never the whole host/run.
                    rec["result"] = "rejected_download"
                    rec["reasons"] = ["http_429_after_retries"]
                    audit.append(rec)
                    note_reason(rec)
                    continue
                resp.raise_for_status()
                data = resp.content
                im = Image.open(io.BytesIO(data))
                if im.format not in ("JPEG", "PNG", "WEBP"):
                    raise ValueError(f"format_{im.format}")
                w, h = im.size
                if w < args.min_width or h < args.min_height:
                    rec["result"] = "rejected_basic"
                    rec["reasons"] = [f"actual_too_small_{w}x{h}"]
                    audit.append(rec)
                    note_reason(rec)
                    continue
            except Exception as exc:
                rec["result"] = "rejected_download"
                rec["reasons"] = [str(exc)[:200]]
                audit.append(rec)
                note_reason(rec)
                continue

            sha = hashlib.sha256(data).hexdigest()
            if sha in seen_hashes:
                rec["result"] = "rejected_basic"
                rec["reasons"] = ["duplicate_image"]
                audit.append(rec)
                note_reason(rec)
                continue

            ext = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}[im.format]
            path = os.path.join(img_dir, f"{sid}{ext}")
            with open(path, "wb") as f:
                f.write(data)
            seen_hashes.add(sha)
            rec["result"] = "downloaded"
            audit.append(rec)
            chosen = {
                "id": sid,
                "query": query,
                "subject": subject,
                "status": "rights_ok_vision_pending",
                "file": path,
                "sha256": sha,
                "width": w,
                "height": h,
                "title": cand["title"],
                "source": cand["source"],
                "source_page": cand["source_page"],
                "author": cand["author"],
                "license": cand["license_canonical"],
                "license_url": cand.get("license_url", ""),
                "credit": f"{cand['title']} by {cand['author']}, {cand['license_canonical']}, via {cand['source_page']}",
                "rights_checked": True,
                "rights_evidence": {
                    "license_as_listed": cand["license"],
                    "license_url": cand.get("license_url", ""),
                    "source_page": cand["source_page"],
                },
                "visual_verification": {"status": "not_checked_basic_only"},
            }
            if args.vision:
                vision_error = ""
                if time.monotonic() - screen_started > args.screen_deadline:
                    v = None
                    vision_error = "screen_deadline_exceeded_before_vision"
                else:
                    try:
                        v = vision_check(path, subject, args.vision_model)
                    except Exception as exc:
                        v = None
                        vision_error = str(exc)[:200]
                if v is None:
                    chosen["visual_verification"] = {"status": "api_error_or_deadline", "error": vision_error}
                    if os.path.exists(path):
                        os.remove(path)
                    seen_hashes.discard(sha)
                    rec["result"] = "rejected_vision"
                    rec["reasons"] = ["vision_not_completed"]
                    screen_reasons["vision_not_completed"] = screen_reasons.get("vision_not_completed", 0) + 1
                    chosen = None
                    continue
                chosen["visual_verification"] = {"status": "checked", "model": args.vision_model, **v}
                confidence = float(v.get("confidence", 0) or 0)
                visual_ok = (
                    v.get("is_match") is True
                    and not v.get("has_burned_in_text", False)
                    and not v.get("has_logo", False)
                    and not v.get("has_watermark", False)
                    and not v.get("is_document_page", False)
                    and confidence >= 0.75
                )
                if visual_ok:
                    chosen["status"] = "cleared"
                    break
                if os.path.exists(path):
                    os.remove(path)
                seen_hashes.discard(sha)
                rec["result"] = "rejected_vision"
                rec["reasons"] = [v.get("reason", "vision_mismatch_or_text_logo_watermark")]
                screen_reasons["vision_rejected"] = screen_reasons.get("vision_rejected", 0) + 1
                chosen = None
                continue
            else:
                chosen["status"] = "rights_ok_vision_pending"
            break

        if chosen is None:
            entries.append({"id": sid, "query": query, "subject": subject,
                            "status": "missing", "file": "", "rights_checked": False})
            top = ", ".join(f"{k}:{v}" for k, v in
                            sorted(screen_reasons.items(), key=lambda kv: -kv[1])[:4])
            print(f"{sid}: missing (candidates={len(candidates)}, reasons: {top or 'none'})")
        else:
            entries.append(chosen)
            print(f"{sid}: {chosen['status']} <- {chosen['license']} / {chosen['source']}", flush=True)
        write_outputs()

    counts = write_outputs(complete=True)
    total = len(entries)
    assert sum(counts.values()) == total, "count mismatch"
    print(json.dumps({"total": total, "counts": counts}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())