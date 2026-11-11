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
                       [--allow-sa] [--per-screen-candidates 20] [--resume]

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

USER_AGENT = "KangaeruYoruRightsCollector/1.0 (rights-gated research use)"
COMMONS_API = "https://commons.wikimedia.org/w/api.php"
OPENVERSE_API = "https://api.openverse.org/v1/images/"

# ---------------------------------------------------------------- rights gate

# Normalised licence -> allowed or not. Anything not matched here is rejected
# as unknown (fail-closed).
def classify_license(raw):
    """Return (canonical, allowed, reason)."""
    if not raw:
        return ("", False, "missing_license")
    text = re.sub(r"<[^>]+>", " ", str(raw))
    text = html.unescape(text).strip().lower()
    text = re.sub(r"\s+", " ", text)

    if "noncommercial" in text or "non-commercial" in text or re.search(r"\bnc\b", text) \
            or "-nc" in text or " cc by-nc" in text:
        return (text, False, "license_nc_excluded")
    if "no derivatives" in text or "noderivs" in text or "-nd" in text or re.search(r"\bnd\b", text):
        return (text, False, "license_nd_excluded")
    if "all rights reserved" in text or "copyrighted" in text or text.startswith("©"):
        return (text, False, "all_rights_reserved")
    if "fair use" in text:
        return (text, False, "fair_use_excluded")

    if text in ("cc0", "cc zero") or text.startswith("cc0 ") or "publicdomain/zero" in text \
            or "creative commons zero" in text:
        return ("CC0", True, "")
    if "public domain" in text or text == "pd" or text.startswith("pd-") \
            or text.startswith("pdm") or "public domain mark" in text:
        return ("Public Domain", True, "")
    # CC BY (any version), SA handled separately so it can be toggled.
    m = re.match(r"cc by(-sa)?( \d\.\d)?$", text)
    if m:
        if m.group(1):
            return ("CC BY-SA" + (m.group(2) or ""), "SA", "license_sa")
        return ("CC BY" + (m.group(2) or ""), True, "")
    if text.startswith("cc by-sa"):
        return (text, "SA", "license_sa")
    if text.startswith("cc by"):
        return (text.upper(), True, "")
    return (text, False, "license_not_whitelisted")


def rights_gate(candidate, allow_sa=False):
    """Check one candidate dict BEFORE any download. Returns (ok, reasons[])."""
    reasons = []
    canonical, allowed, reason = classify_license(candidate.get("license", ""))
    candidate["license_canonical"] = canonical
    if allowed == "SA":
        if allow_sa:
            allowed = True
        else:
            reasons.append("license_sa_excluded_by_default")
            allowed = False
    if not allowed:
        reasons.append(reason or "license_not_whitelisted")
    if not candidate.get("source_page"):
        reasons.append("missing_source_page")
    # CC licences need a licence URL for credit compliance. Public Domain in
    # Commons metadata often has an empty LicenceUrl (see past manifests);
    # that is recorded as-is instead of blocking a PD item.
    if canonical.startswith("CC") and not candidate.get("license_url"):
        reasons.append("missing_license_url")
    if not candidate.get("author"):
        # Record the fact instead of inventing a name; not a hard block for
        # PD/CC0 where Commons itself lists no artist, but it is flagged.
        candidate["author"] = "Unknown (not listed at source)"
        candidate["author_missing_at_source"] = True
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
    r = requests.get(COMMONS_API, params=params, headers={"User-Agent": USER_AGENT}, timeout=60)
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
    r = requests.get(OPENVERSE_API, params=params, headers={"User-Agent": USER_AGENT}, timeout=60)
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
        "You check one still image for a narration video.\n"
        f"Expected subject: {subject}\n"
        "Answer with JSON only: {\"is_match\": bool, \"has_text_or_logo\": bool, "
        "\"is_document_page\": bool, \"actual_subject\": str, \"reason\": str, "
        "\"confidence\": number between 0 and 1}\n"
        "is_document_page is true for paper/PDF/book pages or screenshots of text. "
        "has_text_or_logo is true for burned-in captions, logos or watermarks."
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
    ap.add_argument("--min-width", type=int, default=1920)
    ap.add_argument("--min-height", type=int, default=1080)
    ap.add_argument("--per-screen-candidates", type=int, default=20)
    ap.add_argument("--allow-sa", action="store_true")
    ap.add_argument("--vision", action="store_true")
    ap.add_argument("--vision-model", default=os.environ.get("OPENAI_VISION_MODEL", "gpt-4o-mini"))
    ap.add_argument("--resume", action="store_true")
    ap.add_argument("--sources", default="commons,openverse",
                    help="comma list: commons,openverse")
    ap.add_argument("--max-download-attempts", type=int, default=5,
                    help="per-screen cap so a failing host is not hammered")
    args = ap.parse_args()
    use_sources = [s.strip() for s in args.sources.split(",") if s.strip()]
    rate_limited_hosts = set()

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
    for screen in screens:
        sid = screen["id"]
        if sid in previous:
            entries.append(previous[sid])
            seen_hashes.add(previous[sid].get("sha256", ""))
            print(f"{sid}: resume, already collected")
            continue

        query = screen["query"]
        subject = screen.get("subject", query)
        candidates = []
        source_fns = {"commons": search_commons, "openverse": search_openverse}
        for name in use_sources:
            fn = source_fns.get(name)
            if fn is None:
                continue
            try:
                candidates.extend(fn(query, args.per_screen_candidates))
            except Exception as exc:  # source outage must not kill the run
                audit.append({"screen": sid, "source": name, "error": str(exc)})
            time.sleep(0.3)

        chosen = None
        download_attempts = 0
        for cand in candidates:
            from urllib.parse import urlparse
            host = urlparse(cand.get("image_url", "")).netloc
            if host in rate_limited_hosts:
                audit.append({"screen": sid, "source": cand.get("source", ""),
                              "title": cand.get("title", ""), "result": "skipped_rate_limited",
                              "reasons": [f"host_rate_limited_earlier_{host}"]})
                continue
            rec = {"screen": sid, **{k: cand.get(k, "") for k in
                     ("source", "title", "source_page", "license", "license_url", "author")}}
            ok, reasons = rights_gate(cand, allow_sa=args.allow_sa)
            rec["license_canonical"] = cand.get("license_canonical", "")
            if not ok:
                rec["result"] = "rejected_rights"
                rec["reasons"] = reasons
                audit.append(rec)
                continue
            if cand.get("mime") and cand["mime"] not in ("image/jpeg", "image/png", "image/webp"):
                rec["result"] = "rejected_basic"
                rec["reasons"] = [f"mime_{cand['mime']}"]
                audit.append(rec)
                continue
            if cand.get("width", 0) and (cand["width"] < args.min_width or cand["height"] < args.min_height):
                rec["result"] = "rejected_basic"
                rec["reasons"] = [f"too_small_{cand['width']}x{cand['height']}"]
                audit.append(rec)
                continue

            # Rights gate passed -> only now is downloading allowed.
            if download_attempts >= args.max_download_attempts:
                rec["result"] = "skipped_attempt_cap"
                rec["reasons"] = ["max_download_attempts_reached"]
                audit.append(rec)
                break
            download_attempts += 1
            try:
                clean_url = cand["image_url"].split("?")[0]
                resp = requests.get(clean_url, headers={"User-Agent": USER_AGENT}, timeout=120)
                if resp.status_code == 429:
                    # Respect the provider limit: stop using this host for the
                    # rest of the run instead of retrying through candidates.
                    from urllib.parse import urlparse as _up
                    rate_limited_hosts.add(_up(clean_url).netloc)
                    rec["result"] = "rejected_download"
                    rec["reasons"] = ["http_429_rate_limited_host_stopped_for_run"]
                    audit.append(rec)
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
                    continue
            except Exception as exc:
                rec["result"] = "rejected_download"
                rec["reasons"] = [str(exc)[:200]]
                audit.append(rec)
                continue

            sha = hashlib.sha256(data).hexdigest()
            if sha in seen_hashes:
                rec["result"] = "rejected_basic"
                rec["reasons"] = ["duplicate_image"]
                audit.append(rec)
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
                try:
                    v = vision_check(path, subject, args.vision_model)
                except Exception as exc:
                    v = None
                    chosen["visual_verification"] = {"status": "api_error", "error": str(exc)[:200]}
                if v is not None:
                    chosen["visual_verification"] = {"status": "checked", "model": args.vision_model, **v}
                    if v.get("is_match") and not v.get("has_text_or_logo") \
                            and not v.get("is_document_page") and float(v.get("confidence", 0)) >= 0.7:
                        chosen["status"] = "cleared"
                    else:
                        chosen["status"] = "vision_rejected"
                        os.remove(path)
                        seen_hashes.discard(sha)
                        rec["result"] = "rejected_vision"
                        rec["reasons"] = [v.get("reason", "vision_mismatch")]
                        chosen = None
            break

        if chosen is None:
            entries.append({"id": sid, "query": query, "subject": subject,
                            "status": "missing", "file": "", "rights_checked": False})
            print(f"{sid}: missing (no candidate passed the gates)")
        else:
            entries.append(chosen)
            print(f"{sid}: {chosen['status']} <- {chosen['license']} / {chosen['source']}")
        time.sleep(0.3)

    counts = {}
    for e in entries:
        counts[e["status"]] = counts.get(e["status"], 0) + 1
    total = len(entries)
    assert sum(counts.values()) == total, "count mismatch"

    manifest = {
        "version": "rights-collector-1.0",
        "license_rule": "fail-closed: PD/CC0/CC BY (credit) only; NC/ND/SA/unknown rejected before download",
        "min_size": [args.min_width, args.min_height],
        "vision_enabled": bool(args.vision),
        "total_screens": total,
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
    make_contact_sheet(entries, os.path.join(args.out, "contact_sheet.jpg"))

    print(json.dumps({"total": total, "counts": counts}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
