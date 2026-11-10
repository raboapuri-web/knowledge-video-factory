#!/usr/bin/env python3
"""Acquire real stills from the screen-design sources; never fabricate replacement animal photos."""
import json, os, re, subprocess, hashlib, tempfile, time
from pathlib import Path
from urllib.parse import urlparse, unquote, urljoin
import requests
from bs4 import BeautifulSoup
from PIL import Image, ImageOps, ImageFilter, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
BOARD=json.loads((ROOT/"content/board.json").read_text(encoding="utf-8"))
ASSET_DIR=ROOT/"assets/collected"; RAW=ROOT/"assets/raw"
ASSET_DIR.mkdir(parents=True,exist_ok=True); RAW.mkdir(parents=True,exist_ok=True)
API="https://commons.wikimedia.org/w/api.php"
HEADERS={"User-Agent":"KnowledgeVideoFactory/1.0 (educational documentary production; contact: production team)"}
SESSION=requests.Session(); SESSION.headers.update(HEADERS)
W,H=1920,1080
used_media=set()
media_usage={}
PAGE_CACHE={}
COMMONS_CACHE={}
report={"collected":[],"missing":[],"composition_warnings":[],"rights_skipped":[]}
def norm(s): return re.sub(r"[^a-z0-9]+"," ",str(s).lower())
def tokens(s): return {x for x in norm(s).split() if len(x)>2 and x not in {"the","and","for","with","from","photo","video","image","deep","sea","ocean","noaa","commons"}}
def score(text,query):
    a=tokens(text); b=tokens(query)
    return len(a&b) / max(1,len(b))
def ext(url): return Path(urlparse(url).path).suffix.lower()
def allowed_commons(meta):
    lic=str(meta.get("LicenseShortName",{}).get("value","")).strip().lower()
    url=str(meta.get("LicenseUrl",{}).get("value","")).lower()
    ok=("public domain" in lic or lic in {"pd","cc0"} or lic.startswith("cc0")
        or lic.startswith("cc by ") or lic.startswith("cc by-sa ")
        or "creativecommons.org/licenses/by/" in url or "creativecommons.org/licenses/by-sa/" in url
        or "creativecommons.org/publicdomain/zero" in url)
    return ok, lic or "unverified", url
def commons_candidates(source_url, query):
    parsed=urlparse(source_url)
    cache_key=("category",source_url) if "Category:" in source_url else ("search",source_url,query)
    if cache_key in COMMONS_CACHE:
        cached=[dict(x) for x in COMMONS_CACHE[cache_key]]
        for item in cached: item["rank"]=score(item.get("title","")+" "+item.get("source_page",""),query)
        return cached
    cat=None
    if "Category:" in source_url:
        cat=unquote(source_url.split("Category:",1)[1].split("#",1)[0]).replace("_"," ")
    params={"action":"query","format":"json","prop":"imageinfo","iiprop":"url|extmetadata","iiurlwidth":2200}
    if cat:
        params.update({"generator":"categorymembers","gcmtitle":"Category:"+cat,"gcmtype":"file","gcmnamespace":6,"gcmlimit":60})
    else:
        q=query or unquote(parsed.path.split("/")[-1])
        params.update({"generator":"search","gsrsearch":q,"gsrnamespace":6,"gsrlimit":30})
    try:
        data=SESSION.get(API,params=params,timeout=45).json()
    except Exception:
        COMMONS_CACHE[cache_key]=[]
        return []
    out=[]
    for page in (data.get("query",{}).get("pages",{}) or {}).values():
        info=(page.get("imageinfo") or [{}])[0]
        meta=info.get("extmetadata",{})
        ok,lic,licurl=allowed_commons(meta)
        if not ok: continue
        title=page.get("title","")
        media=info.get("thumburl") or info.get("url")
        if not media or ext(media) not in {".jpg",".jpeg",".png",".webp"}: continue
        author=meta.get("Artist",{}).get("value","")
        desc=meta.get("ImageDescription",{}).get("value","")
        out.append({"media_url":media,"source_page":"https://commons.wikimedia.org/wiki/"+title.replace(" ","_"),
                    "title":title,"credit":re.sub("<[^>]+>","",str(author)),"license":lic,
                    "license_url":licurl,"kind":"image","rank":score(title+" "+str(desc),query)})
    out.sort(key=lambda x:x["rank"],reverse=True)
    COMMONS_CACHE[cache_key]=[dict(x) for x in out]
    return out

def page_candidates(url, query):
    if url in PAGE_CACHE:
        items=[dict(x) for x in PAGE_CACHE[url]]
        for item in items: item["rank"]=score(item.get("title","")+" "+item.get("media_url",""),query)
        items.sort(key=lambda x:x.get("rank",0),reverse=True)
        return items
    host=urlparse(url).netloc.lower()
    if "nautiluslive.org" in host:
        report["rights_skipped"].append({"url":url,"reason":"Ocean Exploration Trust page is copyright-protected; no reuse permission supplied."})
        return []
    try:
        res=SESSION.get(url,timeout=45); res.raise_for_status()
    except Exception as e:
        return []
    soup=BeautifulSoup(res.text,"html.parser")
    page_text=soup.get_text(" ",strip=True)
    credit=""
    m=re.search(r"\bCredit\s+(.{2,180}?)(?:\s+Download|\s+Related Expedition|\s+Related Content|$)",page_text,re.I)
    if m: credit=m.group(1).strip()
    # Conservatively reject media explicitly credited to third parties unless the file itself has a permissive Commons license.
    if "noaa.gov" in host:
        third=["edie widder","nathan robinson","oceaneering","ocean exploration trust","oet","uaf","university of alaska"]
        if any(x in credit.lower() for x in third) or "oet/noaa" in page_text.lower() or "photo: oet/noaa" in page_text.lower():
            report["rights_skipped"].append({"url":url,"credit":credit,"reason":"NOAA page identifies third-party media credit; separate reuse permission is not established."})
            return []
        if credit and "noaa" not in credit.lower():
            report["rights_skipped"].append({"url":url,"credit":credit,"reason":"NOAA-hosted page has no NOAA public-domain credit."})
            return []
    elif "nasa.gov" in host or "gsfc.nasa.gov" in host:
        if credit and "nasa" not in credit.lower():
            report["rights_skipped"].append({"url":url,"credit":credit,"reason":"NASA-hosted page has a non-NASA media credit."})
            return []
    elif "pmc.ncbi.nlm.nih.gov" in host or "biomedcentral.com" in host:
        # PMC9107163, the 2022 Bathynomus jamesi genome article, is verified CC BY 4.0.
        if "PMC9107163" not in url and not re.search(r"Creative Commons Attribution|CC BY 4\.0|CC-BY",page_text,re.I):
            report["rights_skipped"].append({"url":url,"reason":"Article-level CC BY reuse could not be verified from page text."})
            return []
    elif "unsplash.com" in host:
        pass
    elif "commons.wikimedia.org" in host:
        return commons_candidates(url,query)
    elif "noaa.gov" not in host:
        # Non-NOAA/non-Commons pages need an explicit open license in the page itself.
        if not re.search(r"CC BY|Creative Commons Attribution|Public Domain|public domain",page_text,re.I):
            report["rights_skipped"].append({"url":url,"reason":"No explicit permissive license/public-domain statement found."})
            return []
    items=[]
    def add(media, label=""):
        if not media: return
        media=urljoin(url,media.split(" ")[0].strip())
        if ext(media) not in {".jpg",".jpeg",".png",".webp",".mp4",".mov",".webm"}: return
        if any(x in media.lower() for x in ["logo","icon","facebook","twitter","instagram","placeholder"]): return
        if "PMC9107163" in url:
            lic="CC BY 4.0"; lic_url="https://creativecommons.org/licenses/by/4.0/"
        elif "noaa.gov" in host:
            lic="Public Domain (NOAA)"; lic_url="https://oceanexplorer.noaa.gov/about/kit-specs/"
        elif "nasa.gov" in host:
            lic="NASA public-domain candidate"; lic_url=""
        elif "unsplash.com" in host:
            lic="Unsplash License"; lic_url="https://unsplash.com/license"
        else:
            lic="CC BY 4.0 / site terms"; lic_url=""
        items.append({"media_url":media,"source_page":url,"title":label or media.rsplit("/",1)[-1],
                      "credit":credit or host,"license":lic,"license_url":lic_url,
                      "kind":"video" if ext(media) in {".mp4",".mov",".webm"} else "image",
                      "rank":score(label+" "+media,query)})
    for meta in soup.select('meta[property="og:image"],meta[name="twitter:image"]'):
        add(meta.get("content",""),meta.get("content",""))
    for node in soup.select("video,source"):
        add(node.get("src",""),node.get("title",""))
    for a in soup.select("a[href]"):
        href=a.get("href",""); label=a.get_text(" ",strip=True)
        if ext(href) in {".jpg",".jpeg",".png",".webp",".mp4",".mov",".webm"}: add(href,label)
    for im in soup.select("img[src],img[data-src]"):
        src=im.get("data-src") or im.get("src")
        add(src,im.get("alt",""))
    # deduplicate and rank by semantic match; prefer direct downloads over thumbnails when scores tie
    unique={}
    for it in items:
        unique[it["media_url"]]=it
    items=list(unique.values())
    items.sort(key=lambda x:(x["rank"], 1 if "hires" in x["media_url"].lower() else 0),reverse=True)
    PAGE_CACHE[url]=[dict(x) for x in items]
    return items

def candidates_for(scene, source_url):
    host=urlparse(source_url).netloc.lower()
    if "commons.wikimedia.org" in host:
        items=commons_candidates(source_url,scene.get("search_en",""))
    else:
        items=page_candidates(source_url,scene.get("search_en",""))
    if scene["id"] in {"S041","S042","S043","S044"}:
        banned=["poster","distribution of known","map of known","diagram","infographic","chart"]
        items=[x for x in items if not any(t in (x.get("title","")+" "+x.get("media_url","")).lower() for t in banned)]
    return items

def video_frame(video_path,out_path,scene_index,media_key):
    try:
        d=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=nw=1:nk=1",str(video_path)],text=True).strip())
        # Spread repeated still extractions through the source video rather than using the same opening frame.
        n=media_usage.get(media_key,0); media_usage[media_key]=n+1
        t=max(0.2,min(d-0.5,d*(0.12+0.16*(n%5))))
        subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",str(t),"-i",str(video_path),"-frames:v","1","-q:v","2",str(out_path)],check=True)
        return out_path.is_file() and out_path.stat().st_size>5000
    except Exception:
        return False

def download_candidate(c,scene_id,slot):
    url=c["media_url"]; suffix=ext(url) or ".jpg"
    temp=RAW/f"{scene_id}_{slot}.source{suffix}"
    try:
        r=SESSION.get(url,timeout=90,stream=True); r.raise_for_status()
        with open(temp,"wb") as f:
            for chunk in r.iter_content(1024*256):
                if chunk: f.write(chunk)
        if temp.stat().st_size<5000: raise ValueError("media too small")
        out=RAW/f"{scene_id}_{slot}.jpg"
        if suffix in {".mp4",".mov",".webm"}:
            if not video_frame(temp,out,int(scene_id[1:]),url): raise ValueError("could not extract a still frame")
            temp.unlink(missing_ok=True)
        else:
            with Image.open(temp) as im:
                im.load()
                if min(im.size)<280: raise ValueError(f"low resolution {im.size}")
                im.convert("RGB").save(out,quality=94)
            temp.unlink(missing_ok=True)
        return out
    except Exception as e:
        temp.unlink(missing_ok=True)
        return None

def fit_image(path,size):
    with Image.open(path) as im:
        im=im.convert("RGB")
        if im.width/im.height >= 1.70 and im.width/im.height <= 1.85:
            return ImageOps.fit(im,size,method=Image.Resampling.LANCZOS)
        # Preserve the complete source in front of a softened, full-bleed crop.
        bg=ImageOps.fit(im,size,method=Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(32))
        fg=ImageOps.contain(im,size,method=Image.Resampling.LANCZOS)
        bg.paste(fg,((size[0]-fg.width)//2,(size[1]-fg.height)//2))
        return bg

def compose(paths,scene,out):
    desc=scene["image_description"]
    if "3分割" in desc: n=3
    elif any(k in desc for k in ["比較","並べる","並置","対比","左右","同じ画面"]): n=2
    else: n=1
    chosen=paths[:n]
    if len(chosen)<n:
        report["composition_warnings"].append({"scene":scene["id"],"required_panels":n,"available_panels":len(chosen),
                                               "reason":"Source design calls for a comparison/collage but fewer independently licensed images were found."})
    if not chosen: return False
    canvas=Image.new("RGB",(W,H),(4,15,25))
    if len(chosen)==1:
        canvas=fit_image(chosen[0],(W,H))
    else:
        cell_w=W//len(chosen)
        for i,p in enumerate(chosen):
            cell=fit_image(p,(cell_w,H))
            canvas.paste(cell,(i*cell_w,0))
    canvas.save(out,"JPEG",quality=94,optimize=True)
    return True

def fallback_commons(scene):
    # These Commons categories are explicitly relevant alternatives for the whale-fall and general-life scenes.
    q=scene.get("search_en","")
    desc=scene.get("image_description","")
    if "whale" in q.lower() or "鯨骨" in desc:
        items=commons_candidates("https://commons.wikimedia.org/wiki/Category:Whale_fall",q)
        banned=["distribution of known","map of known","diagram","chart"]
        return [x for x in items if not any(t in (x.get("title","")+" "+x.get("media_url","")).lower() for t in banned)]
    if "pillbug" in q.lower() or "ダンゴムシ" in desc:
        return commons_candidates("https://commons.wikimedia.org/wiki/Category:Armadillidium_vulgare",q)
    return []

def make_contact_sheet():
    files=sorted(ASSET_DIR.glob("S[0-9][0-9][0-9].jpg"))
    if not files: return None
    cols=6; cw,ch=320,180; label_h=28
    rows=(len(files)+cols-1)//cols
    sheet=Image.new("RGB",(cols*cw,rows*(ch+label_h)),(5,15,25))
    draw=ImageDraw.Draw(sheet); font=ImageFont.load_default()
    for i,p in enumerate(files):
        with Image.open(p) as im:
            thumb=ImageOps.fit(im.convert("RGB"),(cw,ch),method=Image.Resampling.LANCZOS)
        x=(i%cols)*cw; y=(i//cols)*(ch+label_h)
        sheet.paste(thumb,(x,y))
        draw.rectangle((x,y+ch,x+cw,y+ch+label_h),fill=(5,15,25))
        draw.text((x+8,y+ch+6),p.stem,fill=(240,240,240),font=font)
    dest=ASSET_DIR/"collection-contact-sheet.jpg"
    sheet.save(dest,"JPEG",quality=90,optimize=True)
    return str(dest.relative_to(ROOT))

for idx,scene in enumerate(BOARD["scenes"],1):
    if scene["mode"]!="収集": continue
    candidates=[]
    if scene["id"]=="S001":
        for src in scene.get("sources",[]):
            label=src.get("label","").lower()
            if "isopod" in label:
                primary=page_candidates(src["url"],"giant isopod")
                candidates.extend(primary[:1] if primary else commons_candidates("https://commons.wikimedia.org/wiki/Category:Bathynomus_giganteus","giant isopod")[:1])
            elif "spidercrab" in label:
                candidates.extend(commons_candidates(src["url"],"giant Japanese spider crab")[:1])
            elif "squid" in label and "noaa" not in label:
                candidates.extend(commons_candidates(src["url"],"giant squid specimen")[:1])
    else:
        for src in scene.get("sources",[]):
            candidates.extend(candidates_for(scene,src["url"]))
    if not candidates:
        candidates.extend(fallback_commons(scene))
    # deduplicate while preserving ranked order
    seen=set(); ranked=[]
    for c in candidates:
        if c["media_url"] not in seen:
            seen.add(c["media_url"]); ranked.append(c)
    ranked.sort(key=lambda x:x.get("rank",0),reverse=True)
    # Collect up to three different images only when the screen design explicitly asks for a collage/comparison.
    desc=scene["image_description"]
    required=3 if "3分割" in desc else (2 if any(k in desc for k in ["比較","並べる","対比","左右","同じ画面"]) else 1)
    selected=[]; paths=[]; attempted=[]; selected_pages=set()
    for c in ranked:
        if len(paths)>=required: break
        if c["media_url"] in attempted or c["media_url"] in used_media: continue
        if required>1 and c["source_page"] in selected_pages: continue
        attempted.append(c["media_url"])
        p=download_candidate(c,scene["id"],len(paths)+1)
        if p:
            selected.append(c); paths.append(p); selected_pages.add(c["source_page"]); used_media.add(c["media_url"])
    # If first pass did not find any source, make a specific Commons search for the supplied English query.
    if len(paths)<required and scene.get("search_en"):
        extra=commons_candidates("https://commons.wikimedia.org/",scene["search_en"])
        for c in extra:
            if len(paths)>=required: break
            if c["media_url"] in attempted or c["media_url"] in used_media: continue
            if required>1 and c["source_page"] in selected_pages: continue
            attempted.append(c["media_url"])
            p=download_candidate(c,scene["id"],len(paths)+1)
            if p:
                selected.append(c); paths.append(p); selected_pages.add(c["source_page"]); used_media.add(c["media_url"])
    final=ASSET_DIR/f"{scene['id']}.jpg"
    try:
        ok=compose(paths,scene,final)
    except Exception as e:
        ok=False
        report["missing"].append({"scene":scene["id"],"search_en":scene.get("search_en"),
            "sources_attempted":[x["url"] for x in scene.get("sources",[])],
            "reason":"Image composition failed: "+repr(e)})
    if ok:
        credits=[]
        for c in selected:
            credits.append({"source_page":c["source_page"],"media_url":c["media_url"],"credit":c["credit"],
                            "license":c["license"],"license_url":c.get("license_url",""),"title":c.get("title","")})
        record={"scene":scene["id"],"status":"collected","file":str(final.relative_to(ROOT)),
                "asset_count":len(paths),"required_panels":required,"sources":credits,
                "sha256":hashlib.sha256(final.read_bytes()).hexdigest()}
        report["collected"].append(record)
    else:
        report["missing"].append({"scene":scene["id"],"search_en":scene.get("search_en"),
            "sources_attempted":[x["url"] for x in scene.get("sources",[])],
            "reason":"No suitable still image with a verified/acceptable reuse basis could be downloaded."})
    if idx%10==0:
        print(json.dumps({"collection_progress":idx,"collected":len(report["collected"]),"missing":len(report["missing"])},ensure_ascii=False),flush=True)

contact_sheet=make_contact_sheet()
report["contact_sheet"]=contact_sheet
(ROOT/"assets/asset_manifest.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
sources=["NOAA multimedia usage guidance: https://oceanexplorer.noaa.gov/about/kit-specs/"]
for rec in report["collected"]:
    for a in rec["sources"]:
        line=f"{rec['scene']} | {a['title']} | {a['credit']} | {a['license']} | {a['source_page']} | {a['license_url']}"
        if line not in sources: sources.append(line)
(ROOT/"SOURCES.txt").write_text("\n".join(sources)+"\n",encoding="utf-8")
print(json.dumps({"collected_screens":len(report["collected"]),"missing_screens":len(report["missing"]),
 "composition_warnings":len(report["composition_warnings"]),"rights_skipped":len(report["rights_skipped"])},ensure_ascii=False))
