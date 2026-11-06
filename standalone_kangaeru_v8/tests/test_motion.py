import copy,json,sys,tempfile,unittest
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
import motion,studio,pictograms

def base_scene(kind="hero_question"):
 s={"id":"s001","composition":kind,"narration_text":"ゴールキーパーが動くか動かないかを判断した。",
    "subtitle_cues":[{"text":"ゴールキーパーが動く","timing":"pending"}],
    "display_text":{"headline":"動くという選択","labels":[]},"visual_intent":"PKの意思決定を可視化する",
    "primary_visual":"diagram","icon_spec":None,"values":[]}
 if kind=="data_bars":
  s["display_text"]={"headline":"セーブ率の比較","labels":["飛ぶ","残る"]};s["values"]=[13.4,33.3]
 if kind=="split_choice":s["display_text"]["labels"]=["飛ぶ","残る"]
 if kind=="causal_flow":s["display_text"]["labels"]=["選択","行動","結果"]
 return s
def icon_spec(concept):
 return {"concept":concept,"meaning":"GKが飛び込む動きを具体的な運動場面で説明する造形",
 "paths":[[[10,20],[80,20]],[[20,20],[20,80]]],"circles":[[50,50,9]]}

class MotionCatalogueTests(unittest.TestCase):
 def test_full_catalogue(self):
  self.assertTrue(motion.validate_catalogue())
  self.assertEqual(set(motion.CATALOGUE),{"text","diagram","data","transition"})
  self.assertEqual(sum(len(v) for v in motion.CATALOGUE.values()),24)
 def test_every_text_template_produces_safe_svg(self):
  s=base_scene()
  for name in motion.CATALOGUE["text"]:
   with self.subTest(name=name):
    s["motion"]={"text":name,"diagram":"none","transition":"cut"}
    sp=motion.spec_for(s,0)
    a=motion.animated_svg(s,"動かない方がいい。",{"photos":[]},0,sp)
    z=motion.animated_svg(s,"動かない方がいい。",{"photos":[]},2,sp)
    self.assertIn('y="586"',z)
    self.assertIn("動くという選択",z)
    if name!="none":self.assertNotEqual(a,z)
 def test_every_diagram_template_and_caption_not_moved(self):
  s=base_scene("single_symbol");s["icon_spec"]=icon_spec("GKとゴールの守備")
  for name in motion.CATALOGUE["diagram"]:
   with self.subTest(name=name):
    s["motion"]={"text":"none","diagram":name,"transition":"cut"}
    sp=motion.spec_for(s,0)
    a=motion.animated_svg(s,"動きのある図解",{"photos":[]},0,sp)
    b=motion.animated_svg(s,"動きのある図解",{"photos":[]},2,sp)
    self.assertIn("動きのある図解",a)
    self.assertIn("動きのある図解",b)
    self.assertIn("<g ",b)
    if name!="none":self.assertNotEqual(a,b)
 def test_split_choice_contains_filled_semantic_figures_not_v7_stick_people(self):
  s=base_scene("split_choice")
  sp=motion.spec_for(s,1)
  rendered=motion.animated_svg(s,"二つの判断",{"photos":[]},2,sp)
  self.assertIn("CHOICE  /  01",rendered)
  self.assertIn("fill=",rendered)
  self.assertNotIn('cx="924" cy="444"',rendered)
  self.assertIn('fill="#c6a56e"',rendered)  # solid-filled limbs, not disjoint 1px strokes
 def test_every_graph_template(self):
  s=base_scene("data_bars")
  for name in motion.CATALOGUE["data"]:
   with self.subTest(name=name):
    s["motion"]={"data":name,"text":"none","diagram":"none","transition":"cut"}
    sp=motion.spec_for(s,0)
    a=motion.animated_svg(s,"統計の説明",{"photos":[]},0,sp)
    b=motion.animated_svg(s,"統計の説明",{"photos":[]},2,sp)
    self.assertIn("33.3%",b)
    self.assertIn("13.4%",b)
    if name!="none":self.assertNotEqual(a,b)
 def test_every_scene_transition(self):
  prev=Image.new("RGB",(80,45),(14,13,12))
  current=Image.new("RGB",(80,45),(240,232,218))
  for name in motion.CATALOGUE["transition"]:
   spec=motion.normalize_entry("transition",name,name)
   frame=motion.composite_transition(current,prev,.1,spec)
   self.assertEqual(frame.size,(80,45))
   self.assertEqual(frame.mode,"RGB")
 def test_invalid_overrides_safe_defaults(self):
  s=base_scene("data_bars")
  s["motion"]={"text":{"name":"unknown","duration":-99},"diagram":{"name":"pop","duration":999},
                "data":"count_up","transition":"impossible"}
  sp=motion.spec_for(s,0)
  self.assertEqual(sp["text"]["name"],"soft_scale")
  self.assertLessEqual(sp["diagram"]["duration"],1.35)
  self.assertIn(sp["transition"]["name"],motion.CATALOGUE["transition"])
 def test_icon_pictograms_have_visible_solid_forms(self):
  for concept in ["GKとゴールの守備","医師の診察","群衆の心理","会社員","判断の分岐","統計の棒グラフ"]:
   spec=icon_spec(concept)
   text="".join(pictograms.quality_svg(spec,300,290))
   self.assertIn("fill=",text)
   self.assertTrue(pictograms.validate_visual_quality(spec))
   self.assertIn("stroke",text)
 def test_all_11_real_gk_source_icon_concepts_have_semantic_motifs(self):
  concepts=[
   "PKゴール前で横へ飛ぶゴールキーパー",
   "PKで左へ跳ぶGKと右へ飛ぶボール",
   "サッカーゴール前のキーパー",
   "PKで飛ぶゴールキーパー",
   "医師と防御の盾",
   "ダイビングするゴールキーパー",
   "倒れた人と通行人",
   "苦痛を訴える学生の声",
   "PKゴールを守るゴールキーパー",
   "PKで飛ぶゴールキーパー",
   "PKで中央に留まるゴールキーパー"
  ]
  for item in concepts:
   motif=pictograms.kind(icon_spec(item))
   self.assertNotEqual(motif,"abstract",item)
   svg="".join(pictograms.quality_svg(icon_spec(item),250,250))
   self.assertIn("<g",svg)
 def test_motion_spec_can_be_recorded_in_storyboard(self):
  b={"scenes":[base_scene("hero_question"),base_scene("split_choice")]}
  b["scenes"][1]["id"]="s002"
  studio.add_motion(b)
  self.assertIn("text",b["scenes"][0]["motion"])
  self.assertIn("diagram",b["scenes"][0]["motion"])
  self.assertIn("transition",b["scenes"][1]["motion"])
if __name__=="__main__":unittest.main()
