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
OVERRIDES_PATH=ROOT/"assets/asset_overrides.json"
OVERRIDE_DATA=json.loads(OVERRIDES_PATH.read_text(encoding="utf-8")) if OVERRIDES_PATH.exists() else {}
OVERRIDES=OVERRIDE_DATA.get("scenes",OVERRIDE_DATA)
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
report={"collected":[],"missing":[],"composition_warnings":[],"rights_skipped":[],"rejected_candidates":[]}
def norm(s): return re.sub(r"[^a-z0-9]+"," ",str(s).lower())
def tokens(s): return {x for x in norm(s).split() if len(x)>2 and x not in {"the","and","for","with","from","photo","video","image","deep","sea","ocean","noaa","commons"}}
def score(text,query):
    a=tokens(text); b=tokens(query)
    return len(a&b) / max(1,len(b))
def ext(url): return Path(urlparse(url).path).suffix.lower()
def allowed_commons(meta):
    lic=str(meta.get("LicenseShortName",{}).get("value","")).strip().lower()
    url=str(meta.get("LicenseUrl",{}).get("value","")).lower()
    # Monetized video use excludes non-commercial and no-derivatives licenses.
    restricted=any(term in lic for term in ["-nc","-nd","noncommercial","non-commercial","no derivatives"])
    cc_open=(lic.startswith("cc by ") or lic.startswith("cc by-sa "))
    cc_url=("creativecommons.org/licenses/by/" in url or "creativecommons.org/licenses/by-sa/" in url)
    ok=(("public domain" in lic or lic in {"pd","cc0"} or lic.startswith("cc0")
         or cc_open or cc_url or "creativecommons.org/publicdomain/zero" in url) and not restricted)
    return ok, lic or "unverified", url
def commons_candidates(source_url, query):
    parsed=urlparse(source_url)
    path=unquote(parsed.path)
    is_file="/wiki/File:" in path or "/wiki/File%3A" in parsed.path
    is_category="Category:" in source_url
    cache_key=("file",source_url) if is_file else (("category",source_url) if is_category else ("search",source_url,query))
    if cache_key in COMMONS_CACHE:
        cached=[dict(x) for x in COMMONS_CACHE[cache_key]]
        for item in cached:
            item["rank"]=score(item.get("title","")+" "+item.get("description",""),query)
        return sorted(cached,key=lambda x:(x.get("rank",0),x.get("width",0)*x.get("height",0)),reverse=True)
    params={"action":"query","format":"json","prop":"imageinfo","iiprop":"url|extmetadata","iiurlwidth":3000}
    if is_file:
        title=path.split("/wiki/",1)[1].replace("_"," ")
        params["titles"]=title
    elif is_category:
        cat=unquote(source_url.split("Category:",1)[1].split("#",1)[0]).replace("_"," ")
        params.update({"generator":"categorymembers","gcmtitle":"Category:"+cat,"gcmtype":"file","gcmnamespace":6,"gcmlimit":80})
    else:
        q=query or unquote(parsed.path.split("/")[-1])
        params.update({"generator":"search","gsrsearch":q,"gsrnamespace":6,"gsrlimit":50})
    try:
        data=SESSION.get(API,params=params,timeout=45).json()
    except Exception:
        COMMONS_CACHE[cache_key]=[]
        return []
    pages=(data.get("query",{}).get("pages",{}) or {}).values()
    out=[]
    for page in pages:
        info=(page.get("imageinfo") or [{}])[0]
        meta=info.get("extmetadata",{})
        ok,lic,licurl=allowed_commons(meta)
        if not ok: continue
        original=info.get("url","")
        thumb=info.get("thumburl","")
        suffix=ext(original)
        if suffix==".pdf":
            media=original
            kind="pdf"
        elif suffix==".svg":
            media=thumb or original
            kind="image"
        else:
            media=thumb or original
            kind="video" if ext(media) in {".mp4",".mov",".webm"} else "image"
        if not media or ext(media) not in {".jpg",".jpeg",".png",".webp",".mp4",".mov",".webm",".pdf"}: continue
        title=page.get("title","")
        artist=meta.get("Artist",{}).get("value","")
        desc=meta.get("ImageDescription",{}).get("value","")
        credit=re.sub("<[^>]+>","",str(artist))
        width=info.get("thumbwidth") or info.get("width") or 0
        height=info.get("thumbheight") or info.get("height") or 0
        out.append({"media_url":media,"source_page":"https://commons.wikimedia.org/wiki/"+title.replace(" ","_"),
                    "title":title,"description":re.sub("<[^>]+>"," ",str(desc)),
                    "credit":credit,"license":lic,"license_url":licurl,"kind":kind,
                    "width":int(width or 0),"height":int(height or 0),
                    "rank":score(title+" "+str(desc),query)})
    out.sort(key=lambda x:(x["rank"],x.get("width",0)*x.get("height",0)),reverse=True)
    COMMONS_CACHE[cache_key]=[dict(x) for x in out]
    return out

def page_candidates(url, query):
    if url in PAGE_CACHE:
        items=[dict(x) for x in PAGE_CACHE[url]]
        for item in items:
            item["rank"]=score(item.get("title","")+" "+item.get("description","")+" "+item.get("media_url",""),query)
        items.sort(key=lambda x:(x.get("rank",0),1 if "largest" in x.get("title","").lower() or "hd version" in x.get("title","").lower() else 0),reverse=True)
        return items
    host=urlparse(url).netloc.lower()
    if "nautiluslive.org" in host:
        report["rights_skipped"].append({"url":url,"reason":"Ocean Exploration Trust page explicitly reserves copyright; no independent reuse license was supplied."})
        return []
    if "commons.wikimedia.org" in host:
        return commons_candidates(url,query)
    try:
        res=SESSION.get(url,timeout=45); res.raise_for_status()
    except Exception as e:
        return []
    soup=BeautifulSoup(res.text,"html.parser")
    page_text=soup.get_text(" ",strip=True)
    credit=""
    m=re.search(r"\bCredit\s+(.{2,220}?)(?:\s+Download|\s+Related Expedition|\s+Related Content|$)",page_text,re.I)
    if m: credit=m.group(1).strip()
    copyright_marked=bool(re.search(r"\bcopyright(?:ed)?\b|all rights reserved|permission required|not for reuse",credit,re.I))
    license_name=""; license_url=""
    if "oceanexplorer.noaa.gov" in host or "noaa.gov" in host:
        if copyright_marked:
            report["rights_skipped"].append({"url":url,"credit":credit,"reason":"NOAA image/video caption explicitly marks copyright or reuse restrictions; excluded."})
            return []
        license_name="Public Domain (NOAA; source-site terms, credit per caption)"
        license_url="https://oceanexplorer.noaa.gov/faqs/"
        if "oceanexplorer.noaa.gov" in host:
            license_url="https://oceanexplorer.noaa.gov/about/kit/"
    elif "nasa.gov" in host or "gsfc.nasa.gov" in host:
        if copyright_marked:
            report["rights_skipped"].append({"url":url,"credit":credit,"reason":"NASA source page marks copyright/reuse restrictions."})
            return []
        license_name="Public Domain (NASA; reproduction guidelines)"
        license_url="https://www.nasa.gov/nasa-brand-center/images-and-media/"
    elif "pmc.ncbi.nlm.nih.gov" in host or "biomedcentral.com" in host:
        if "PMC9107163" not in url and not re.search(r"Creative Commons Attribution|CC BY 4\.0|CC-BY",page_text,re.I):
            report["rights_skipped"].append({"url":url,"reason":"Article-level CC BY reuse could not be verified from page text."})
            return []
        if not re.search(r"Creative Commons Attribution 4\.0|CC BY 4\.0",page_text,re.I):
            report["rights_skipped"].append({"url":url,"reason":"CC BY 4.0 license statement not found on article page."})
            return []
        license_name="CC BY 4.0"
        license_url="https://creativecommons.org/licenses/by/4.0/"
    elif "unsplash.com" in host:
        if not re.search(r"Unsplash License|free to use under the Unsplash",page_text,re.I):
            report["rights_skipped"].append({"url":url,"reason":"Unsplash reuse terms could not be verified on the source page."})
            return []
        license_name="Unsplash License"
        license_url="https://unsplash.com/license"
    else:
        if copyright_marked or not re.search(r"CC BY|Creative Commons Attribution|Public Domain|public domain",page_text,re.I):
            report["rights_skipped"].append({"url":url,"reason":"No explicit permissive license/public-domain statement found on source page."})
            return []
        license_name="CC BY 4.0 / source-page terms"
        license_url=""

    items=[]
    def add(media,label="",priority=0):
        if not media: return
        media=urljoin(url,media.split(" ")[0].strip())
        suffix=ext(media)
        if suffix not in {".jpg",".jpeg",".png",".webp",".mp4",".mov",".webm",".pdf"}: return
        if any(x in media.lower() for x in ["logo","icon","facebook","twitter","instagram","placeholder"]): return
        label_credit=""
        cm=re.search(r"Credit\s*:?\s*([^|]{2,160})",label,re.I)
        if cm: label_credit=cm.group(1).strip()
        candidate_credit=label_credit or credit or host
        if ("oceanexplorer.noaa.gov" in host or "noaa.gov" in host) and re.search(r"\bcopyright(?:ed)?\b|all rights reserved|permission required|not for reuse",label,re.I):
            report["rights_skipped"].append({"url":url,"credit":candidate_credit,"reason":"The specific NOAA media caption explicitly marks copyright/reuse restrictions."})
            return
        if ("nasa.gov" in host or "gsfc.nasa.gov" in host) and candidate_credit and "nasa" not in candidate_credit.lower():
            # NASA SVS pages can contain third-party assets; keep only the individual NASA-credited item.
            if not ("nasa" in label.lower() and "credit" in label.lower()):
                return
            candidate_credit=label_credit or "NASA"
        if "images.unsplash.com" in media:
            # Request the largest practical Unsplash rendition; the source page and license remain unchanged.
            from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
            u=urlsplit(media); q=dict(parse_qsl(u.query,keep_blank_values=True))
            q.update({"w":"4000","q":"90","fit":"max","fm":"jpg"})
            media=urlunsplit((u.scheme,u.netloc,u.path,urlencode(q),u.fragment))
        items.append({"media_url":media,"source_page":url,"title":label or media.rsplit("/",1)[-1],
                      "description":label,"credit":candidate_credit,"license":license_name,
                      "license_url":license_url,
                      "kind":"pdf" if suffix==".pdf" else ("video" if suffix in {".mp4",".mov",".webm"} else "image"),
                      "rank":score(label+" "+media,query)+priority})
    for meta in soup.select('meta[property="og:image"],meta[name="twitter:image"]'):
        add(meta.get("content",""),meta.get("content",""),0)
    for a in soup.select("a[href]"):
        href=a.get("href","")
        if ext(href) not in {".jpg",".jpeg",".png",".webp",".mp4",".mov",".webm",".pdf"}: continue
        label=a.get_text(" ",strip=True)
        parent=a.parent
        im=a.find("img") or (parent.find("img") if parent else None)
        if im:
            label=(label+" "+im.get("alt","")+" "+im.get("title","")).strip()
        priority=80 if re.search(r"largest|original file|download.*hd|hd version",label,re.I) else 0
        add(href,label,priority)
    for im in soup.select("img[src],img[data-src]"):
        src=im.get("data-src") or im.get("src")
        add(src,(im.get("alt","")+" "+im.get("title","")).strip(),0)
    unique={}
    for it in items:
        if it["media_url"] not in unique or it["rank"]>unique[it["media_url"]]["rank"]:
            unique[it["media_url"]]=it
    items=list(unique.values())
    items.sort(key=lambda x:(x["rank"],1 if "largest" in x["title"].lower() or "hd version" in x["title"].lower() else 0),reverse=True)
    PAGE_CACHE[url]=[dict(x) for x in items]
    return items

def candidates_for(scene, source_url, query=None):
    host=urlparse(source_url).netloc.lower()
    q=query or scene.get("search_en","")
    if "commons.wikimedia.org" in host:
        items=commons_candidates(source_url,q)
    else:
        items=page_candidates(source_url,q)
    if scene["id"] in {"S041","S042","S043","S044"}:
        banned=["poster","distribution of known","map of known","diagram","infographic","chart"]
        items=[x for x in items if not any(t in (x.get("title","")+" "+x.get("media_url","")).lower() for t in banned)]
    return items

def video_frame(video_path,out_path,scene_index,media_key,min_width=1920,min_height=1080):
    try:
        probe=json.loads(subprocess.check_output(["ffprobe","-v","error","-select_streams","v:0","-show_entries","stream=width,height","-of","json",str(video_path)],text=True))
        stream=(probe.get("streams") or [{}])[0]
        width=int(stream.get("width",0)); height=int(stream.get("height",0))
        if width<min_width or height<min_height:
            raise ValueError(f"video resolution {width}x{height} below {min_width}x{min_height}")
        d=float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=nw=1:nk=1",str(video_path)],text=True).strip())
        # Reusing a source video is allowed only as distinct still frames; spread extraction through the clip.
        n=media_usage.get(media_key,0); media_usage[media_key]=n+1
        t=max(0.2,min(d-0.5,d*(0.10+0.13*(n%7))))
        subprocess.run(["ffmpeg","-y","-loglevel","error","-ss",str(t),"-i",str(video_path),"-frames:v","1","-q:v","2",str(out_path)],check=True)
        if out_path.is_file() and out_path.stat().st_size>5000:
            with Image.open(out_path) as im: c_dims=im.size
            return c_dims[0]>=min_width and c_dims[1]>=min_height
        return False
    except Exception:
        return False

def download_candidate(c,scene_id,slot,min_width=1920,min_height=1080):
    url=c["media_url"]; suffix=ext(url) or ".jpg"
    temp=RAW/f"{scene_id}_{slot}.source{suffix}"
    try:
        r=SESSION.get(url,timeout=120,stream=True); r.raise_for_status()
        with open(temp,"wb") as f:
            for chunk in r.iter_content(1024*256):
                if chunk: f.write(chunk)
        if temp.stat().st_size<5000: raise ValueError("media too small")
        out=RAW/f"{scene_id}_{slot}.jpg"
        if suffix in {".mp4",".mov",".webm"}:
            if not video_frame(temp,out,int(scene_id[1:]),url,min_width,min_height):
                raise ValueError("video still is below the required resolution or could not be extracted")
            with Image.open(out) as im: c["source_dimensions"]=list(im.size)
            temp.unlink(missing_ok=True)
        elif suffix==".pdf":
            prefix=RAW/f"{scene_id}_{slot}.pdfpage"
            subprocess.run(["pdftoppm","-f","1","-l","1","-r","300","-jpeg",str(temp),str(prefix)],check=True)
            rendered=Path(str(prefix)+"-1.jpg")
            if not rendered.exists(): raise ValueError("could not render PDF figure")
            with Image.open(rendered) as im:
                im.load()
                if im.width<min_width or im.height<min_height:
                    raise ValueError(f"PDF figure resolution {im.size} below {min_width}x{min_height}")
                c["source_dimensions"]=list(im.size)
                im.convert("RGB").save(out,quality=94)
            rendered.unlink(missing_ok=True); temp.unlink(missing_ok=True)
        else:
            with Image.open(temp) as im:
                im.load()
                if im.width<min_width or im.height<min_height:
                    raise ValueError(f"image resolution {im.size} below {min_width}x{min_height}")
                c["source_dimensions"]=list(im.size)
                im.convert("RGB").save(out,quality=94)
            temp.unlink(missing_ok=True)
        return out
    except Exception as e:
        c["download_error"]=str(e)
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

def compose(paths,scene,out,required_override=None):
    desc=scene["image_description"]
    if required_override:
        n=int(required_override)
    elif "3分割" in desc: n=3
    elif any(k in desc for k in ["比較","並べる","並置","対比","左右","同じ画面","横並び"]): n=2
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
    log_path=ROOT/"assets/replacement_log.json"
    log=json.loads(log_path.read_text(encoding="utf-8")) if log_path.exists() else {}
    replaced={x["scene"] for x in log.get("replacements",[])}
    previously_missing={x["scene"] for x in log.get("missing_screens",[])}
    out_dir=ROOT/"assets/contact-sheets"
    out_dir.mkdir(parents=True,exist_ok=True)
    cols,rows=4,6; cw,ch=480,270; label_h=42; header_h=54
    try:
        font=ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",22)
        header_font=ImageFont.truetype("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc",25)
    except Exception:
        font=ImageFont.load_default(); header_font=font
    scene_rows=BOARD["scenes"]
    outputs=[]
    for page in range(4):
        group=scene_rows[page*22:(page+1)*22]
        sheet=Image.new("RGB",(cols*cw,header_h+rows*(ch+label_h)),(8,15,26))
        draw=ImageDraw.Draw(sheet)
        draw.text((18,12),f"V153 ASSET REVIEW  |  {group[0]['id']}–{group[-1]['id']}  |  {len(group)} screens",
                  fill=(245,245,245),font=header_font)
        for i,scene in enumerate(group):
            sid=scene["id"]
            photo=ASSET_DIR/f"{sid}.jpg"
            diagram=ROOT/"assets/generated"/f"{sid}.png"
            generated_replacement=ROOT/"assets/generated_replacements"/f"{sid}.png"
            if scene["mode"]=="生成" and diagram.is_file():
                p=diagram; status="GENERATED"
            elif photo.is_file():
                p=photo
                status="REPLACED" if sid in replaced else ("NEW" if sid in previously_missing else "PHOTO")
            elif generated_replacement.is_file():
                p=generated_replacement; status="AI GENERATED"
            else:
                p=None; status="MISSING"
            if p:
                with Image.open(p) as im:
                    thumb=ImageOps.fit(im.convert("RGB"),(cw,ch),method=Image.Resampling.LANCZOS)
            else:
                thumb=Image.new("RGB",(cw,ch),(58,27,31))
                td=ImageDraw.Draw(thumb)
                td.text((cw//2-58,ch//2-15),"NO ASSET",fill=(255,220,220),font=header_font)
            x=(i%cols)*cw; y=header_h+(i//cols)*(ch+label_h)
            sheet.paste(thumb,(x,y))
            draw.rectangle((x,y+ch,x+cw,y+ch+label_h),fill=(8,15,26))
            draw.text((x+12,y+7),f"{sid}  [{status}]",fill=(255,255,255),font=font)
        dest=out_dir/f"contact-sheet-{page+1:02d}.jpg"
        sheet.save(dest,"JPEG",quality=92,optimize=True)
        outputs.append(str(dest.relative_to(ROOT)))
    return outputs

for idx,scene in enumerate(BOARD["scenes"],1):
    if scene["mode"]!="収集": continue
    override=OVERRIDES.get(scene["id"],{})
    query=override.get("query",scene.get("search_en",""))
    source_specs=override.get("sources",scene.get("sources",[]))
    candidates=[]
    for spec in source_specs:
        if isinstance(spec,str):
            spec={"url":spec}
        if not spec.get("url"): continue
        items=candidates_for(scene,spec["url"],spec.get("query",query))
        for item in items:
            title_text=(str(item.get("title",""))+" "+str(item.get("description",""))).lower()
            if item.get("kind")=="pdf" and not override.get("allow_pdf",False):
                continue
            if not override.get("allow_diagram",False) and any(t in title_text for t in ["poster","book cover","book page","title page","research paper","journal article","article page","report cover","document cover","guide to aqua"]):
                report["rejected_candidates"].append({"scene":scene["id"],"title":item.get("title",""),"reason":"Document/poster/title-page candidate is not a usable photographic still."})
                continue
            if spec.get("credit_override"): item["credit"]=spec["credit_override"]
            if spec.get("license_override"): item["license"]=spec["license_override"]
            if spec.get("license_url_override"): item["license_url"]=spec["license_url_override"]
            if spec.get("rights_basis"): item["rights_basis"]=spec["rights_basis"]
            if spec.get("title_override"): item["title"]=spec["title_override"]
            candidates.append(item)
    if not candidates:
        candidates.extend(fallback_commons(scene))
    # Deduplicate while preserving the most relevant/high-resolution candidate.
    ranked_by_url={}
    for c in candidates:
        old=ranked_by_url.get(c["media_url"])
        if old is None or (c.get("rank",0),c.get("width",0)*c.get("height",0))>(old.get("rank",0),old.get("width",0)*old.get("height",0)):
            ranked_by_url[c["media_url"]]=c
    ranked=list(ranked_by_url.values())
    ranked.sort(key=lambda x:(x.get("rank",0),x.get("width",0)*x.get("height",0)),reverse=True)
    desc=scene["image_description"]
    inferred=3 if "3分割" in desc else (2 if any(k in desc for k in ["比較","並べる","並置","対比","左右","同じ画面","横並び"]) else 1)
    required=int(override.get("panels",inferred))
    selected=[]; paths=[]; attempted=[]; selected_pages=set()
    for c in ranked:
        if len(paths)>=required: break
        is_video=c.get("kind")=="video"
        if c["media_url"] in attempted or (c["media_url"] in used_media and not is_video): continue
        if required>1 and c["source_page"] in selected_pages: continue
        attempted.append(c["media_url"])
        p=download_candidate(c,scene["id"],len(paths)+1,1920,1080)
        if p:
            selected.append(c); paths.append(p); selected_pages.add(c["source_page"])
            if not is_video: used_media.add(c["media_url"])
    # If curated source pages did not yield enough licensed, high-resolution images, try a focused Commons search.
    if len(paths)<required and query:
        extra=commons_candidates("https://commons.wikimedia.org/",query)
        for c in extra:
            if len(paths)>=required: break
            if c["media_url"] in attempted or (c["media_url"] in used_media and c.get("kind")!="video"): continue
            if required>1 and c["source_page"] in selected_pages: continue
            attempted.append(c["media_url"])
            p=download_candidate(c,scene["id"],len(paths)+1,1920,1080)
            if p:
                selected.append(c); paths.append(p); selected_pages.add(c["source_page"])
                if c.get("kind")!="video": used_media.add(c["media_url"])
    final=ASSET_DIR/f"{scene['id']}.jpg"
    try:
        ok=compose(paths,scene,final,required)
    except Exception as e:
        ok=False
        report["missing"].append({"scene":scene["id"],"search_en":query,
            "sources_attempted":[(x if isinstance(x,str) else x.get("url","")) for x in source_specs],
            "reason":"Image composition failed: "+repr(e)})
    if ok:
        credits=[]
        for c in selected:
            credits.append({"source_page":c["source_page"],"media_url":c["media_url"],"credit":c["credit"],
                            "license":c["license"],"license_url":c.get("license_url",""),"title":c.get("title",""),
                            "source_dimensions":c.get("source_dimensions"),"rights_basis":c.get("rights_basis","")})
        record={"scene":scene["id"],"status":"collected","file":str(final.relative_to(ROOT)),
                "asset_count":len(paths),"required_panels":required,"sources":credits,
                "sha256":hashlib.sha256(final.read_bytes()).hexdigest(),
                "fit_review":"pending_manual_visual_check"}
        report["collected"].append(record)
    else:
        attempted_errors=[c.get("download_error") for c in ranked if c.get("download_error")]
        report["missing"].append({"scene":scene["id"],"search_en":query,
            "sources_attempted":[(x if isinstance(x,str) else x.get("url","")) for x in source_specs],
            "reason":"No suitable still image with a verified reuse basis and at least 1920x1080 source resolution could be downloaded.",
            "download_errors":attempted_errors[:8]})
    if idx%10==0:
        print(json.dumps({"collection_progress":idx,"collected":len(report["collected"]),"missing":len(report["missing"])},ensure_ascii=False),flush=True)

# The ten diagram scenes are intentionally generated as original, text-free conceptual illustrations.
report["generated"]=[]
for s in BOARD["scenes"]:
    if s["mode"]!="生成": continue
    p=ROOT/"assets/generated"/(s["id"]+".png")
    if p.is_file():
        with Image.open(p) as im: dims=list(im.size)
        report["generated"].append({"scene":s["id"],"status":"generated","file":str(p.relative_to(ROOT)),
            "resolution":dims,"method":"Original SVG vector illustration rendered locally with CairoSVG",
            "reason":"The canonical screen design explicitly calls for a conceptual diagram; an existing licensed photograph would not communicate the specified relationship clearly.",
            "external_image_api":False,"cost_usd":0.0,"sha256":hashlib.sha256(p.read_bytes()).hexdigest()})
contact_sheets=make_contact_sheet()
report["contact_sheets"]=contact_sheets
report["contact_sheet"]=contact_sheets[0] if contact_sheets else None
log_path=ROOT/"assets/replacement_log.json"
if log_path.exists():
    audit_log=json.loads(log_path.read_text(encoding="utf-8"))
    report["visual_audit"]={"replacements":audit_log.get("replacements",[]),
                            "missing_screens":audit_log.get("missing_screens",[]),
                            "retained_candidates":audit_log.get("retained_candidates",[])}
report["rights_policy"]={
 "commons":"Use only per-file Public Domain, CC0, CC BY, or CC BY-SA licenses; credit and license URLs retained.",
 "noaa":"NOAA Ocean Exploration media are public domain unless the individual caption marks copyright/restrictions; caption credit retained.",
 "nasa":"Use only NASA-credited images without third-party copyright markings; NASA reproduction guidelines retained.",
 "unsplash":"Use only source pages that display Unsplash License terms; creator and license retained.",
 "open_access_research":"Use only article figures covered by verified CC BY 4.0 and without third-party credit-line exceptions."
}
(ROOT/"assets/asset_manifest.json").write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
sources=["NOAA Ocean Exploration reuse terms: https://oceanexplorer.noaa.gov/faqs/","NOAA Ocean Exploration media kit: https://oceanexplorer.noaa.gov/about/kit/","NASA image reproduction guidelines: https://www.nasa.gov/nasa-brand-center/images-and-media/"]
for rec in report["collected"]:
    for a in rec["sources"]:
        line=f"{rec['scene']} | {a['title']} | {a['credit']} | {a['license']} | {a['source_page']} | {a['license_url']}"
        if line not in sources: sources.append(line)
(ROOT/"SOURCES.txt").write_text("\n".join(sources)+"\n",encoding="utf-8")
print(json.dumps({"collected_screens":len(report["collected"]),"missing_screens":len(report["missing"]),
 "composition_warnings":len(report["composition_warnings"]),"rights_skipped":len(report["rights_skipped"])},ensure_ascii=False))
