#!/usr/bin/env python3
"""Deterministic, API-key-free storyboard from a structured full Japanese narration.

Preserves all original body paragraphs; source headings become chapter metadata.
Decisions use explainable topical lexicons; this is NOT an LLM and does not
independently verify the research claims in the supplied narration.
"""
from __future__ import annotations
import argparse, json, re
from pathlib import Path

STYLES={"title","chapter","photo","stat","comparison","diagram","icon","statement","question","process","contrast","quote","outro"}
# Reusable conceptual categories. We never claim that keyword detection is general semantic AI.
TOPICS={
 "football": (("ゴールキーパー","サッカー","キッカー","ペナルティ","PK","ゴール","シュート"),"association football goalkeeper penalty kick", "soccer"),
 "medical": (("医師","病院","手術","患者","医療","診断","治療","薬"),"hospital doctor medical healthcare", "hospital"),
 "work": (("会社","上司","部下","職場","会議","仕事","企業","経営","社員"),"office workplace people meeting", "office"),
 "crowd": (("傍観","観衆","観客","群衆","群れ","周囲","大勢","集団"),"people crowd audience", "people"),
 "rescue": (("救助","消防","救急","災害","事故","火災","救命"),"emergency rescue workers firefighters", "rescue"),
 "history": (("戦争","兵士","歴史","古代","中世","帝国","戦場"),"historical soldiers history", "history"),
 "nature": (("森","森林","植物","動物","葉","光合成","気候","魚","昆虫"),"nature science plant forest", "nature"),
 "economy": (("経済","賃金","株","金融","貨幣","消費","市場"),"economy finance currency", "economy"),
 "science": (("実験","研究者","科学","大学","論文","統計"),"scientist research laboratory", "science"),
 "technology": (("コンピューター","AI","人工知能","技術","ソフトウェア","データ"),"computer laboratory technology", "technology"),
 "city": (("道路","交通","渋滞","都市","鉄道","駅"),"city roads transport", "city"),
}
STYLE_INTENT={
 "title":"問いを一つの大きな見出しとして提示する",
 "chapter":"章の論点を提示し、意味の転換を示す",
 "photo":"主張の具体的な現場を実在写真で見せる",
 "stat":"原稿で明示された数値を強調する（新たな数値は加えない）",
 "comparison":"原稿内の対立する選択・結果を比較する",
 "diagram":"因果・構造を抽象図で説明する",
 "icon":"概念を登録済み原画アイコンで象徴する",
 "statement":"論点を余白と文字組みで明確にする",
 "question":"問いそのものを画面に残す",
 "process":"行為と結果の順序を示す",
 "contrast":"常識と反例の対比を示す",
 "quote":"問いかけや引用文を視覚化する",
 "outro":"結論の余韻を残す"
}
MARK=re.compile(r'(?:\d+(?:[.,]\d+)?\s*(?:％|%|人|本|年|倍|回|件|秒|分|円))')
SPEECH_QUOTE=re.compile(r'[「『][^」』]{5,70}[」』]')
QUESTION=re.compile(r'[？?]|なぜ|どうして|だろうか')
COMPARE=re.compile(r'一方|しかし|ところが|比べ|比較|対して|反対|逆に|動かない|何もしない')
PROCESS=re.compile(r'その後|まず|次に|結果として|だから|すると|そして|こうして')
CONCEPT=re.compile(r'心理|理論|責任|評価|判断|構造|バイアス|動機|合理|社会|制度|予測|選択')

def normalize_source(data):
 if isinstance(data,str):
  lines=data.splitlines()
  return {"title":lines[0].strip() if lines else "無題",
          "paragraphs":[{"text":x.strip(),"style":"NORMAL_TEXT"} for x in lines[1:] if x.strip()]}
 if isinstance(data,dict) and isinstance(data.get("paragraphs"),list):
  return data
 raise ValueError("Input must be structured Google Doc JSON or raw text")

def classify_topic(text,chapter=""):
 text=text+"\n"+chapter
 scores={k:sum(1 for w in p[0] if w in text) for k,p in TOPICS.items()}
 best=max(scores,key=lambda k:scores[k])
 return (best, TOPICS[best][1]) if scores[best]>0 else (None,None)

def one_scene_visual(text,chapter,index,is_first,is_last):
 """Classify scene semantics with a small explainer, not a fixed scene number script."""
 if is_first:return "title"
 if is_last:return "outro"
 if re.search(r"^第[一二三四五六七八九十\d]+章|^エピローグ",chapter) and index==0:return "chapter"
 if MARK.search(text):return "stat"
 if COMPARE.search(text):return "comparison"
 if SPEECH_QUOTE.search(text):return "quote"
 if QUESTION.search(text):return "question"
 if PROCESS.search(text):return "process"
 topic,_=classify_topic(text,chapter)
 if topic and index%4==0:return "photo"
 if CONCEPT.search(text):return ("diagram" if index%3 else "contrast")
 return ("statement","icon","diagram")[index%3]

def hero(text,style,chapter):
 if style=="chapter" and chapter:return chapter
 if style=="stat":
  m=MARK.search(text)
  if m:return m.group(0).strip()
 if style=="quote":
  m=SPEECH_QUOTE.search(text)
  if m:return m.group(0)
 # Display only source text, never create an unsupported quote.
 phrases=re.split(r"(?<=[。！？?])",text)
 part=next((x.strip() for x in phrases if x.strip()),text.strip())
 return part

def split_source(data,max_chars=110,min_chars=25):
 """Group source paragraphs with the original ordering and exact text intact."""
 source=normalize_source(data)
 title=source.get("title") or "無題"
 chapters=[]
 chapter={"id":"c00","title":"本文","paragraphs":[]}
 for idx,p in enumerate(source["paragraphs"]):
  t=p.get("text","")
  if not t.strip():continue
  style=p.get("style","NORMAL_TEXT")
  if style=="HEADING_1":
   title=t.strip();continue
  if style.startswith("HEADING"):
   if chapter["paragraphs"]:chapters.append(chapter)
   chapter={"id":f"c{len(chapters)+1:02d}","title":t.strip(),"paragraphs":[]}
  else:chapter["paragraphs"].append((idx,t))
 if chapter["paragraphs"]:chapters.append(chapter)
 if not chapters:raise ValueError("No narrated paragraphs")
 scenes=[]
 for chapter in chapters:
  batches=[];cur=[];size=0
  for idx,t in chapter["paragraphs"]:
   # Long paragraphs remain intact: no silent source edits.
   if cur and size+len(t)>max_chars and size>=min_chars:
    batches.append(cur);cur=[];size=0
   cur.append((idx,t));size+=len(t)
   if size>=max_chars:
    batches.append(cur);cur=[];size=0
  if cur:
   if batches and sum(len(x[1]) for x in cur)<min_chars and sum(len(x[1]) for x in batches[-1])+sum(len(x[1]) for x in cur)<max_chars+65:
    batches[-1]+=cur
   else:batches.append(cur)
  for j,b in enumerate(batches):
   content="\n".join(t for _,t in b)
   allidx=len(scenes)
   kind=one_scene_visual(content,chapter["title"],j,allidx==0,False)
   topic,search=classify_topic(content,chapter["title"])
   # Don't force a irrelevant search result; candidate image can fail safely.
   scene={"id":f"s{allidx+1:03d}","chapter_id":chapter["id"],"chapter_title":chapter["title"],
    "source_paragraph_indices":[idx for idx,_ in b],"source_paragraphs":[t for _,t in b],
    "subtitle":content.replace("\n",""),"speech":content.replace("\n"," "),
    "visual_strategy":kind,"visual_intent":STYLE_INTENT[kind]+"。内容: "+hero(content,kind,chapter["title"]),
    "hero":hero(content,kind,chapter["title"]),"display_text":hero(content,kind,chapter["title"]),
    "numbers_from_script":MARK.findall(content),"topic":topic,"photo_query":search}
   scenes.append(scene)
 # Closing scene is the last narrative segment; never append unscripted TTS.
 if scenes and scenes[-1]["visual_strategy"] not in ("chapter",):
  scenes[-1]["visual_strategy"]="outro"
  scenes[-1]["visual_intent"]=STYLE_INTENT["outro"]+"。内容: "+scenes[-1]["hero"]
 # Ensure multiple conceptual views without requiring a fixed number of scenes.
 for i in range(2,len(scenes)):
  if all(scenes[k]["visual_strategy"]==scenes[i]["visual_strategy"] for k in (i-1,i-2)):
   scenes[i]["visual_strategy"]="diagram" if scenes[i]["visual_strategy"]!="diagram" else "statement"
   scenes[i]["visual_intent"]=STYLE_INTENT[scenes[i]["visual_strategy"]]+"。内容: "+scenes[i]["hero"]
 out={"version":"v6.0","title":title,"source_document_id":source.get("source_document_id"),
  "source_revision_id":source.get("source_revision_id"),
  "method":"deterministic chapter/paragraph + topical heuristics (no external AI API)",
  "chapters":[{"id":x["id"],"title":x["title"],"paragraph_count":len(x["paragraphs"])} for x in chapters],
  "scenes":scenes,
  "art_direction":{"style":"premium_black_gold","subtitle_alignment":"center",
   "subtitle_zone":[0,586,1280,134],"original_icon_atlas":"standalone_kangaeru_v4/brand/8015.png"}}
 verify(out,source)
 return out

def verify(board,source):
 body={i:p["text"] for i,p in enumerate(source["paragraphs"])
       if p.get("text","").strip() and not p.get("style","NORMAL_TEXT").startswith("HEADING")}
 used=[]
 for s in board["scenes"]:
  used+=list(zip(s["source_paragraph_indices"],s["source_paragraphs"]))
  assert s["visual_strategy"] in STYLES
  assert s["speech"].strip() and s["subtitle"].strip()
 assert [i for i,_ in used]==list(body), "Source paragraph order/loss"
 assert all(body[i]==t for i,t in used), "Original paragraphs modified"
 assert len(board["scenes"])>=3
 assert len({s["id"] for s in board["scenes"]})==len(board["scenes"])
 return {"passed":True,"chapters":len(board["chapters"]),"scenes":len(board["scenes"]),
         "narrated_paragraphs":len(body),"narrated_chars":sum(len(v) for v in body.values()),
         "unique_strategies":len({s["visual_strategy"] for s in board["scenes"]}),
         "source_content_preserved":True}

def main():
 ap=argparse.ArgumentParser()
 ap.add_argument("--input",required=True)
 ap.add_argument("--output",required=True)
 a=ap.parse_args()
 path=Path(a.input)
 source=json.loads(path.read_text(encoding="utf-8")) if path.suffix.lower()==".json" else path.read_text(encoding="utf-8")
 board=split_source(source)
 out=Path(a.output);out.parent.mkdir(parents=True,exist_ok=True)
 out.write_text(json.dumps(board,ensure_ascii=False,indent=2),encoding="utf-8")
 result=verify(board,normalize_source(source))
 (out.parent/"qa_storyboard.json").write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf-8")
 print(json.dumps(result,ensure_ascii=False))

if __name__=="__main__":main()
