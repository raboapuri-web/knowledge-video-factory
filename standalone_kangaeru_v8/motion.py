"""v8 scene-independent motion catalogue and deterministic, subtitle-safe SVG keyframes.

Text, symbols, numbers and transition animations are composed from existing v7
storyboard data; no LLM or external API. All timing values are local to the
start of each scene and capped to protect subtitle reading.
"""
from __future__ import annotations
import copy,html,json,math,re,sys
from pathlib import Path
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parent
V7=ROOT.parent/"standalone_kangaeru_v7"
sys.path.insert(0,str(V7))
import brand,icons,render_full
import pictograms
# Override the v7 brand's global icon backend without changing the v7 branch.
icons.geometry=pictograms.quality_svg

CATALOGUE={
 "text":{
  "fade_up":(.62,"cubic_out","headline fade 0→1, y+24→0"),
  "type_on":(.78,"linear","grapheme-by-grapheme reveal, fixed anchored headline"),
  "slide_in":(.55,"cubic_out","headline x+38→0 with clipping"),
  "soft_scale":(.60,"quint_out","headline scale .93→1 about fixed origin"),
  "mask_wipe":(.68,"cubic_in_out","fixed-size horizontal mask reveal"),
  "none":(0,"linear","static headline")
 },
 "diagram":{
  "pop":(.65,"back_out","icon/diagram .70→1 scale with slight overshoot"),
  "stagger":(.86,"cubic_out","diagram items appear sequentially, alpha+24px rise"),
  "draw_on":(.83,"cubic_in_out","linework progressively revealed by left-to-right clip"),
  "float_in":(.72,"cubic_out","whole icon/diagram x+12,y+40→0 and fade"),
  "radial":(.68,"quint_out","icon/diagram scale .82→1 from geometry center"),
  "none":(0,"linear","diagram visible immediately")
 },
 "data":{
  "bar_grow":(.95,"cubic_out","bars expand horizontally to factual values"),
  "count_up":(1.05,"cubic_out","numeric labels count from 0 to source value"),
  "bar_and_count":(1.10,"quint_out","both bar growth and numeric count-up"),
  "grid_wipe":(.80,"cubic_in_out","all graph geometry uncovered horizontally"),
  "pulse_focus":(.88,"cubic_out","filled bars receive a restrained gold pulse"),
  "none":(0,"linear","chart immediately at factual values")
 },
 "transition":{
  "crossfade":(.42,"cubic_in_out","old and new scenes dissolved together"),
  "dip_black":(.48,"cubic_in_out","fade previous to black, reveal new"),
  "wipe_left":(.46,"cubic_in_out","new scene overtakes prior from left"),
  "push_left":(.52,"cubic_in_out","both shots slide left to reveal next"),
  "gold_flash":(.34,"cubic_out","brief restrained warm-gold overlay"),
  "cut":(0,"linear","hard editorial cut")
 }
}
DEFAULTS={
 "hero_question":{"text":"fade_up","diagram":"float_in","data":"none"},
 "split_choice":{"text":"slide_in","diagram":"stagger","data":"none"},
 "causal_flow":{"text":"mask_wipe","diagram":"draw_on","data":"none"},
 "data_bars":{"text":"soft_scale","diagram":"stagger","data":"bar_and_count"},
 "single_symbol":{"text":"type_on","diagram":"pop","data":"none"}
}
TRANSITIONS=("crossfade","wipe_left","cut","dip_black","push_left","gold_flash")

def easing(x,name):
 x=max(0,min(1,float(x)))
 if name=="linear":return x
 if name=="cubic_out":return 1-(1-x)**3
 if name=="quint_out":return 1-(1-x)**5
 if name=="cubic_in_out":return 4*x**3 if x<.5 else 1-(-2*x+2)**3/2
 if name=="back_out":
  c1=1.70158;c3=c1+1
  return 1+c3*(x-1)**3+c1*(x-1)**2
 raise ValueError("Unsupported easing "+name)

def normalize_entry(group,entry,default_name):
 name=entry if isinstance(entry,str) else entry.get("name",default_name) if isinstance(entry,dict) else default_name
 if name not in CATALOGUE[group]:name=default_name
 base_duration,ease,_=CATALOGUE[group][name]
 rawduration=entry.get("duration",base_duration) if isinstance(entry,dict) else base_duration
 try:duration=float(rawduration)
 except (ValueError,TypeError):duration=base_duration
 duration=min(1.35,max(.18,duration)) if name!="none" and name!="cut" else 0.
 user_ease=entry.get("easing",ease) if isinstance(entry,dict) else ease
 if user_ease not in ("linear","cubic_out","quint_out","cubic_in_out","back_out"):user_ease=ease
 return {"name":name,"duration":duration,"easing":user_ease}

def spec_for(scene,index):
 family=scene.get("composition","hero_question")
 defaults=DEFAULTS.get(family,DEFAULTS["hero_question"])
 raw=scene.get("motion",{})
 if not isinstance(raw,dict):raw={}
 spec={}
 for group in ("text","diagram","data","transition"):
  default_name=defaults[group] if group!="transition" else TRANSITIONS[index%len(TRANSITIONS)]
  spec[group]=normalize_entry(group,raw.get(group),default_name)
 if family!="data_bars":
  # Chart-only effects cannot be used on non-chart scenes; no crash on any script.
  spec["data"]=normalize_entry("data","none","none")
 if scene.get("primary_visual")=="photo":
  spec["diagram"]=normalize_entry("diagram","float_in","float_in")
 return spec

def progress(local,setting):
 duration=setting["duration"]
 if duration<=0:return 1.
 return easing(local/duration,setting["easing"])

def tag_header_transition(fragment,title,local,setting):
 if ">"+brand.esc(title)+"</text>" not in fragment:return fragment
 name=setting["name"];p=progress(local,setting)
 if name=="type_on":
  count=max(0,min(len(title),int(len(title)*p+.00001)))
  return fragment.replace(">"+brand.esc(title)+"</text>",">"+brand.esc(title[:count])+"</text>")
 if name=="none":return fragment
 if name=="fade_up":
  attr=f'opacity="{min(1,p):.4f}" transform="translate(0 {(1-min(1,p))*24:.2f})"'
 elif name=="slide_in":
  attr=f'opacity="{min(1,p):.4f}" transform="translate({(1-min(1,p))*38:.2f} 0)"'
 elif name=="soft_scale":
  val=.93+.07*min(1,p)
  attr=f'opacity="{min(1,p):.4f}" transform="translate({102*(1-val):.2f} {260*(1-val):.2f}) scale({val:.4f})"'
 elif name=="mask_wipe":
  end=int(1280*min(1,p))
  attr=f'clip-path="url(#v8_title_clip)" opacity="{min(1,p):.4f}"'
  fragment='<defs><clipPath id="v8_title_clip"><rect x="0" y="85" width="'+str(end)+'" height="480"/></clipPath></defs>'+fragment
 else:return fragment
 return f'<g {attr}>{fragment}</g>'

def dynamic_chart(fragment,setting,local,values):
 if setting["name"]=="none":return fragment
 name=setting["name"];p=min(1,progress(local,setting))
 if name in ("bar_grow","bar_and_count","pulse_focus"):
  if '<rect x="342"' in fragment and 'fill="'+brand.GOLD+'"' in fragment:
   def width_replace(match):
    full=float(match.group(1))
    scale=p if name!="pulse_focus" else .92+.08*p+.022*math.sin(min(1,local/max(.001,setting["duration"]))*math.pi)
    return 'width="'+f"{full*scale:.2f}"+'"'
   fragment=re.sub(r'width="(\d+(?:\.\d+)?)"',width_replace,fragment,count=1)
 if name in ("count_up","bar_and_count"):
  def num_replace(match):
   full=float(match.group(1))
   vv=full*p
   digits=1 if "." in match.group(1) else 0
   return ">"+f"{vv:.{digits}f}"+"%</text>"
  fragment=re.sub(r'>(\d+(?:\.\d+)?)%</text>',num_replace,fragment)
 if name=="grid_wipe":
  end=342+int((1020-342)*p)
  fragment=f'<defs><clipPath id="v8_chart_clip"><rect x="0" y="175" width="{end}" height="370"/></clipPath></defs><g clip-path="url(#v8_chart_clip)">{fragment}</g>'
 return fragment

def body_enter(items,setting,local,scene):
 name=setting["name"];p=max(0,min(1,progress(local,setting)))
 if name=="none":return items
 if name=="stagger":
  # Child layout positions remain fixed; never calculate from headline glyph width.
  result=[]
  n=len(items)
  for i,part in enumerate(items):
   st=max(0,min(1,((local/max(.01,setting["duration"]))-.48*i/max(1,n-1))/.52))
   ep=max(0,min(1,easing(st,"cubic_out")))
   result.append(f'<g opacity="{ep:.4f}" transform="translate(0 {(1-ep)*19:.2f})">{part}</g>')
  return result
 body="\n".join(items)
 if name=="draw_on":
  return [f'<defs><clipPath id="v8_diagram_clip"><rect x="70" y="90" width="{1125*p:.2f}" height="480"/></clipPath></defs><g clip-path="url(#v8_diagram_clip)">{body}</g>']
 if name in ("pop","radial"):
  if name=="pop":
   # overshoot max 1.08 is bounded; no overlap with subtitle lane.
   pp=progress(local,setting)
   scale=.70+.30*pp; alpha=min(1,max(0,local/max(.01,setting["duration"])*2))
  else:scale=.82+.18*p;alpha=p
  x=640*(1-scale);y=338*(1-scale)
  return [f'<g opacity="{alpha:.4f}" transform="translate({x:.2f} {y:.2f}) scale({scale:.4f})">{body}</g>']
 if name=="float_in":
  return [f'<g opacity="{p:.4f}" transform="translate({(1-p)*12:.2f} {(1-p)*35:.2f})">{body}</g>']
 return items

def semantic_split(scene):
 """Replace v7's thin stick people and meaningless arrows with solid pictograms.
 This works for arbitrary paired labels; no subject-specific text is invented.
 """
 d=scene["display_text"];h=brand.reject(d["headline"]);labels=d.get("labels",[])
 if len(labels)!=2:raise ValueError("Split comparison needs exactly two labels")
 out=[
  brand.tag_text(96,152,h,44),
  brand.line(640,186,640,545,brand.HAIR,1.4),
  brand.tag_text(130,226,"CHOICE  /  01",22,brand.GOLD,family="sans"),
  brand.tag_text(713,226,"CHOICE  /  02",22,brand.GOLD,family="sans"),
  brand.tag_text(334,323,labels[0],44,brand.IVORY,"middle"),
  brand.tag_text(932,323,labels[1],44,brand.IVORY,"middle"),
  brand.line(125,353,534,353,brand.HAIR,2.1),
  brand.line(745,353,1153,353,brand.HAIR,2.1)]
 for x,label in ((334,labels[0]),(932,labels[1])):
  # All shapes are solid gold-and-ivory, never stick-figure strokes.
  if any(v in label for v in ("飛","跳","ダイブ","GK","キーパー")):
   pieces=pictograms.goalkeeper("dive")
  elif any(v in label for v in ("残","留","立","待","停止","中央")):
   pieces=pictograms.goalkeeper("stay")
  else:
   pieces=[pictograms.disc(50,50,32,pictograms.G),
     pictograms.strokepath("M33 51 L45 64 L68 35",5,stroke=pictograms.D)]
  scale=1.62
  transform=f'<g transform="translate({x-50*scale:.2f} {442-50*scale:.2f}) scale({scale:.3f})">'
  out.append(transform+"".join(pieces)+"</g>")
 return out

def animated_svg(scene,subtitle,ledger,local,spec=None):
 spec=spec or spec_for(scene,int(scene.get("id","s001")[1:])-1)
 local_scene=copy.deepcopy(scene)
 local_scene["subtitle_preview"]=subtitle
 # Preserve original photo and CC0/PD license verification, as in v7.
 if scene.get("primary_visual")=="photo":
  raw=render_full.picture_svg(scene,ledger,subtitle)
  title=scene["display_text"]["headline"]
  pat=r'(<text[^>]*>'+re.escape(brand.esc(title))+r'</text>)'
  raw=re.sub(pat,lambda m:tag_header_transition(m.group(1),title,local,spec["text"]),raw,count=1)
  if spec["diagram"]["name"]!="none":
   p=max(0,min(1,progress(local,spec["diagram"])))
   raw=raw.replace('<image x="0" y="100"',
     f'<image opacity="{p:.4f}" x="0" y="100"',1)
  return raw
 # Fidelity: reuse v7 diagram geometry and text layout, animate layers independently.
 if local_scene.get("composition")=="single_symbol" and not local_scene.get("icon_spec"):
  local_scene["composition"]="hero_question"
 if local_scene.get("composition")=="split_choice" and len(local_scene.get("display_text",{}).get("labels",[]))!=2:
  local_scene["composition"]="hero_question"
 if local_scene.get("composition")=="causal_flow" and len(local_scene.get("display_text",{}).get("labels",[]))!=3:
  local_scene["composition"]="hero_question"
 brand.validate(local_scene)
 bits=semantic_split(local_scene) if local_scene["composition"]=="split_choice" else brand.diagram(local_scene)
 title=local_scene["display_text"]["headline"]
 header=[];body=[]
 for fragment in bits:
  if ">"+brand.esc(title)+"</text>" in fragment:
   header.append(tag_header_transition(fragment,title,local,spec["text"]))
  else:
   if local_scene["composition"]=="data_bars":
    fragment=dynamic_chart(fragment,spec["data"],local,local_scene.get("values",[]))
   body.append(fragment)
 animated_body=body_enter(body,spec["diagram"],local,local_scene)
 out=['<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">',
       *brand.top(),*animated_body,*header,*brand.footer(local_scene),'</svg>']
 return "\n".join(out)

def composite_transition(current,previous,local,setting):
 """Apply deterministic frame transition; no overlapping screen text outside mask."""
 if previous is None:return current
 name=setting["name"];dur=setting["duration"]
 if name=="cut" or dur<=0 or local>=dur:return current
 p=max(0,min(1,progress(local,setting)))
 if name=="crossfade":return Image.blend(previous,current,p)
 if name=="dip_black":
  blank=Image.new("RGB",current.size,(9,9,9))
  return Image.blend(previous,blank,min(1,p*2)) if p<.5 else Image.blend(blank,current,max(0,2*p-1))
 if name=="gold_flash":
  gold=Image.new("RGB",current.size,(80,59,35))
  return Image.blend(current,gold,.28*(1-p))
 if name=="wipe_left":
  mask=Image.new("L",current.size,0);draw=ImageDraw.Draw(mask)
  boundary=int(current.width*p)
  if boundary>0:draw.rectangle((0,0,boundary,current.height),fill=255)
  result=Image.composite(current,previous,mask)
  if 0<boundary<current.width:
   ImageDraw.Draw(result).line((boundary,0,boundary,current.height),fill=(198,165,110),width=5)
  return result
 if name=="push_left":
  distance=int(current.width*p)
  output=Image.new("RGB",current.size,(14,13,12))
  output.paste(previous,(-distance,0))
  output.paste(current,(current.width-distance,0))
  return output
 return current

def validate_catalogue():
 assert all("none" in CATALOGUE[g] or "cut" in CATALOGUE[g] for g in CATALOGUE)
 assert len(CATALOGUE["text"])>=5
 assert len(CATALOGUE["diagram"])>=5
 assert len(CATALOGUE["data"])>=5
 assert len(CATALOGUE["transition"])>=6
 return True

def metadata():
 return {g:{name:{"duration_sec":v[0],"easing":v[1],"effect":v[2]}
            for name,v in choices.items()} for g,choices in CATALOGUE.items()}
