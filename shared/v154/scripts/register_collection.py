#!/usr/bin/env python3
"""Register only fully rights-cleared and Vision-approved V154 stills."""
import hashlib, json, shutil
from pathlib import Path
from PIL import Image

REPO = Path.cwd()
ROOT = REPO / "shared" / "v154"
ASSETS = ROOT / "assets"
OUT = ROOT / "collector_out"
SCREENS_PATH = ASSETS / "collector_screens.json"
TARGETS = json.loads(SCREENS_PATH.read_text(encoding="utf-8"))
TARGET_IDS = [x["id"] for x in TARGETS]
COLLECTED = ASSETS / "collected"
COLLECTED.mkdir(parents=True, exist_ok=True)

def sha256(path):
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def allowed_license(value):
    s = " ".join(str(value or "").strip().lower().split())
    if any(x in s for x in ("-sa", "share alike", "share-alike", "-nc", "-nd", "noncommercial", "non-commercial", "no derivatives")):
        return False
    if s in ("public domain", "pd", "public domain mark") or s.startswith(("public domain ", "pdm", "pd-")):
        return True
    if s in ("cc0", "cc zero") or s.startswith("cc0 "):
        return True
    if s == "cc by" or s.startswith("cc by "):
        return True
    return False

raw = {}
manifest_in = OUT / "manifest.json"
if manifest_in.exists():
    raw = json.loads(manifest_in.read_text(encoding="utf-8"))
raw_entries = {x.get("id"): x for x in raw.get("screens", []) if x.get("id")}
registered = []
credits = []
status_rows = []

for sid in TARGET_IDS:
    e = dict(raw_entries.get(sid) or {"id": sid, "status": "missing", "file": ""})
    status = e.get("status", "missing")
    reason = ""
    source_file = Path(e.get("file") or "")
    if not source_file.is_absolute():
        source_file = REPO / source_file
    v = e.get("visual_verification") or {}
    license_ok = allowed_license(e.get("license"))
    author = str(e.get("author") or "").strip()
    author_ok = bool(author) and "unknown" not in author.lower()
    vision_ok = (
        v.get("status") == "checked"
        and v.get("is_match") is True
        and not v.get("has_burned_in_text", False)
        and not v.get("has_logo", False)
        and not v.get("has_watermark", False)
        and not v.get("is_document_page", False)
        and float(v.get("confidence", 0) or 0) >= 0.75
    )
    rights_ok = (
        bool(e.get("rights_checked"))
        and bool(e.get("source_page"))
        and license_ok
        and author_ok
        and (not str(e.get("license", "")).startswith("CC") or bool(e.get("license_url")))
    )
    file_ok = source_file.is_file()
    if file_ok:
        try:
            with Image.open(source_file) as im:
                im.verify()
            file_ok = sha256(source_file) == e.get("sha256")
        except Exception:
            file_ok = False

    if status == "cleared" and rights_ok and vision_ok and file_ok:
        ext = source_file.suffix.lower()
        if ext not in (".jpg", ".jpeg", ".png", ".webp"):
            ext = ".jpg"
        dest = COLLECTED / f"{sid}{ext}"
        shutil.copy2(source_file, dest)
        e["file"] = f"assets/collected/{dest.name}"
        e["registered_sha256"] = sha256(dest)
        e["status"] = "cleared"
        registered.append(e)
        credits.append(
            f"{sid}: {e.get('title', 'Untitled')} — {author} — {e.get('license')}\n"
            f"  Source: {e.get('source_page')}\n"
            f"  License: {e.get('license_url') or e.get('license')}\n"
        )
    else:
        if status == "cleared":
            if not rights_ok:
                reason = "registration_rights_metadata_incomplete_or_not_whitelisted"
            elif not vision_ok:
                reason = "vision_check_missing_or_failed"
            elif not file_ok:
                reason = "image_file_missing_corrupt_or_hash_mismatch"
            e["status"] = "not_cleared"
        if not reason:
            reason = e.get("deadline_reason") or ", ".join(e.get("reasons") or []) or status
        e["registration_reason"] = reason

    status_rows.append({
        "id": sid,
        "status": e.get("status", "missing"),
        "reason": reason or e.get("registration_reason", ""),
        "file": e.get("file", "")
    })

cleared_ids = {x["id"] for x in registered}
for p in COLLECTED.iterdir():
    if p.is_file() and p.stem in TARGET_IDS and p.stem not in cleared_ids:
        p.unlink()

counts = {}
for row in status_rows:
    counts[row["status"]] = counts.get(row["status"], 0) + 1

asset_manifest = {
    "version": "v154-rights-collector-1.0",
    "license_rule": "Public Domain / CC0 / CC BY only. CC BY-SA, NC, ND, unknown, uncredited, watermark/text/logo images excluded.",
    "vision_model": "gpt-4o-mini",
    "total_screens": len(TARGET_IDS),
    "counts": counts,
    "cleared_count": len(registered),
    "not_cleared_ids": [x["id"] for x in status_rows if x["status"] != "cleared"],
    "screens": [
        next((x for x in registered if x["id"] == sid),
             raw_entries.get(sid, {"id": sid, "status": "missing"}))
        for sid in TARGET_IDS
    ],
}
(ASSETS / "asset_manifest.json").write_text(
    json.dumps(asset_manifest, ensure_ascii=False, indent=2), encoding="utf-8"
)
(ASSETS / "credits.txt").write_text("\n".join(credits), encoding="utf-8")
audit_in = OUT / "audit.json"
if audit_in.exists():
    shutil.copy2(audit_in, ASSETS / "audit.json")
else:
    (ASSETS / "audit.json").write_text("[]", encoding="utf-8")
contact = OUT / "contact_sheet.jpg"
if contact.exists():
    shutil.copy2(contact, ASSETS / "contact_sheet.jpg")

gate = {
    "passed": len(registered) == len(TARGET_IDS),
    "required_screens": len(TARGET_IDS),
    "cleared_screens": len(registered),
    "remaining_screens": [x for x in status_rows if x["status"] != "cleared"],
    "rights_policy": "PD / CC0 / CC BY only",
    "vision_required": True,
    "render_allowed": False,
    "render_block_reason": "User explicitly requested collection and registration only; chapter/finalize were not run."
}
(ASSETS / "asset_gate.json").write_text(
    json.dumps(gate, ensure_ascii=False, indent=2), encoding="utf-8"
)

lines = [
    "# V154 素材収集結果", "",
    f"- 対象: {len(TARGET_IDS)}画面",
    f"- cleared: {len(registered)}画面",
    f"- 未充足: {len(TARGET_IDS) - len(registered)}画面",
    "- 権利条件: Public Domain / CC0 / CC BY のみ",
    "- Vision: 被写体適合・焼き込み文字・ロゴ・ウォーターマークを確認",
    "- 画像サイズ制限: なし",
    "- chapter/finalize: 実行禁止（未実行）", "",
    "## 画面別ステータス", ""
]
for row in status_rows:
    detail = f" — {row['reason']}" if row["reason"] else ""
    lines.append(f"- {row['id']}: **{row['status']}**{detail}")
(ASSETS / "collection_status.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print(json.dumps({
    "total": len(TARGET_IDS),
    "cleared": len(registered),
    "counts": counts,
    "remaining": gate["remaining_screens"]
}, ensure_ascii=False, indent=2))
