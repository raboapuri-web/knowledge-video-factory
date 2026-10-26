#!/usr/bin/env python3
"""V138 scene compiler: complete chapter narration -> original scene and cue action plan."""
from pathlib import Path
from collections import Counter
import hashlib,json,re
R=Path(__file__).resolve().parents[1]
C=R/'content';S=R/'src'/'scenes';P=R/'src'/'projects'
for d in (C,S,P):d.mkdir(parents=True,exist_ok=True)
ORDER=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue']
LABELS={'prologue':'好きになった夜','chapter1':'発見の設計','chapter2':'一方通行の親密さ',
'chapter3':'集団と自分','chapter4':'熱狂の経済学','epilogue':'選び直す自由'}
# The 45 families have individually authored interactive visual mechanisms.
POOLS={
'prologue':['bedroom','phone','feed','backstage','calendar','ticket','venue','tears','choice'],
'chapter1':['laboratory','glyphs','broadcast','algorithm','filter','bookshelf','unseen','options','loop','fork'],
'chapter2':['studio','radio','portrait','daily','livestream','practice','story','intimacy','distance'],
'chapter3':['identity','stadium','victory','crowd','belong','criticism','argument','ranking','scorecard','solidarity'],
'chapter4':['church','ritual','novel','producer','funnel','discord','experiment','investment','receipt','campaign','ladder','economy','boundary'],
'epilogue':['theories','library','mirror','balance','exit','question','ending']}
RULES=[
('bedroom',r'ベッド|帰宅|夜。'),('phone',r'スマートフォン|画面'),
('feed',r'ショート動画|動画が流れ'),('backstage',r'舞台裏|楽屋|挫折'),
('calendar',r'一週間|二週間|半年後'),('ticket',r'チケット|遠方'),
('venue',r'ペンライト|会場'),('tears',r'涙|希望'),
('choice',r'選んだ|選ばれ'),
('laboratory',r'一九六八|ザイアンス|単純接触'),('glyphs',r'文字や見慣れない|記号'),
('broadcast',r'テレビ局|ラジオ局|編集者'),
('algorithm',r'推薦|アルゴリズム'),('filter',r'動画が混ざ|半分'),
('bookshelf',r'書店|小説'),('unseen',r'表示されなかった|画面の外'),
('options',r'選択肢'),('loop',r'好きだから見る|ますます見る'),('fork',r'自由とは|自由だと思'),
('studio',r'一九五六|ホートン|ウォール'),('radio',r'テレビの司会者|視聴者'),
('portrait',r'口癖|名前すら|非対称'),('daily',r'朝食|移動中|眠れ'),
('livestream',r'ライブ配信|コメント'),
('practice',r'努力を続け|練習|苦労'),('story',r'物語を編集|舞台裏|人生そのもの'),
('intimacy',r'親密さ|心のつながり|支え'),
('distance',r'隔たり|境界|参加している'),
('identity',r'何者|自己認識|アイデンティティ'),
('stadium',r'サッカーチーム|優勝'),('victory',r'ランキングの一位|デビューした'),
('crowd',r'ペンライト|ライブ会場|何千本'),('belong',r'居場所|所属'),
('criticism',r'評論家|歌唱力を批判'),
('argument',r'努力を知ら|否定され'),
('ranking',r'ファン同士|誰が長く|競争'),
('scorecard',r'グッズの数|投票の回数|成績表'),
('solidarity',r'仲間|共同体'),
('church',r'チャーチマーケティング|巨大教会'),
('ritual',r'決まった日に集ま|共通の歌'),
('novel',r'朝井リョウ|イン・ザ・メガチャーチ'),
('producer',r'仕掛ける側|運営が|マーケティングの側'),
('funnel',r'共感が生まれ|参加したく|届け'),
('discord',r'認知的不協和|行動と信念'),
('experiment',r'一九五九|アロンソン|ミルズ'),
('investment',r'負担を感じ|費やした|いまさら'),
('receipt',r'商品を買え|特典が|支出'),
('campaign',r'投票を|順位が変わ|次の目標'),
('ladder',r'もっと大き|もっと高い|達成され'),
('economy',r'企業にとって|売上|利益'),
('boundary',r'どこに境界線|本人が幸せ|責任は消える'),
('theories',r'心理|研究領域'),('library',r'小説は書店|好きな音楽'),
('mirror',r'自分自身に問い|自分の言葉'),
('balance',r'幸福と、企業|自分が望む幸福'),
('exit',r'やめられない|選び直'),
('question',r'選んだのか|選ばされたのか'),
('ending',r'必ずしも矛盾しない')
]
MOTIONS=['reach','swap','reveal','trace','count','split','rotate','sort','pulse','fold','route','assemble']
def pick(ch,text,prev):
 pool=POOLS[ch]; scores=[]
 for j,v in enumerate(pool):
  hit=any(k==v and re.search(rx,text) for k,rx in RULES)
  score=(0 if hit else 3)+j*.035+(11 if prev and prev[-1]==v else 0)+(3 if v in prev[-3:] else 0)
  scores.append((score,v))
 return min(scores)[1]
def chunks(p,limit=88):
 out=[]
 while len(p)>limit:
  k=max((m.end() for m in re.finditer('[。！？]',p[:limit]) if m.end()>=48),default=0)
  if not k:k=max((m.end() for m in re.finditer('[、，,』」]',p[:limit]) if m.end()>=55),default=limit)
  out.append(p[:k]);p=p[k:]
 if p:out.append(p)
 return out
def cues(narration):
 seg=[]
 for sent in re.findall(r'[^。！？!?]*[。！？!?]|[^。！？!?]+$',narration):
  while sent:
   if len(sent)<=28:seg.append(sent);break
   cuts=[m.end() for m in re.finditer('[、，,」』]',sent[:28]) if m.end()>=12]
   k=max(cuts) if cuts else 28
   seg.append(sent[:k]);sent=sent[k:]
 assert ''.join(seg)==narration
 return seg
def pronunciation(s):
 words={'SNS':'エスエヌエス','AI':'エーアイ','SNSの':'エスエヌエスの'}
 for x,y in sorted(words.items(),key=lambda z:-len(z[0])):s=s.replace(x,y)
 if re.search('[A-Za-z0-9]',s):raise ValueError('Unresolved voice pronunciation '+s)
 return s
def main():
 src=(C/'manuscript.md').read_text(encoding='utf-8').replace('\r','')
 sections=re.split(r'(?m)^# [^\n]+\n',src)
 assert len(sections)==7,len(sections)
 raw=[];entire={}
 for i,ch in enumerate(ORDER):
  paragraphs=[x.strip() for x in re.split(r'\n\s*\n',sections[i+1].strip()) if x.strip()]
  entire[ch]=''.join(paragraphs)
  for p in paragraphs:
   for c in chunks(p):raw.append((ch,c))
 assert all(''.join(t for c,t in raw if c==ch)==entire[ch] for ch in ORDER)
 scenes=[];prev=[]
 for ch,narration in raw:
  family=pick(ch,narration,prev);prev.append(family)
  n=sum(x['chapter']==ch for x in scenes)+1
  sid=ch.upper()+str(n).zfill(3)
  segs=cues(narration);t=0;entries=[]
  for i,seg in enumerate(segs):
   dt=max(.6,len(seg)/7.2+.14)
   motion=MOTIONS[(n*3+i*7+ORDER.index(ch))%len(MOTIONS)]
   spoken=pronunciation(seg)
   display=seg if len(seg)<=15 else seg[:15]+'\n'+seg[15:]
   assert len(display.split('\n'))<=2 and all(len(x)<=15 for x in display.split('\n'))
   entries.append({'id':sid+'C'+str(i+1).zfill(2),'text':seg,'speech':spoken,
      'display':display,'start':round(t,3),'end':round(t+dt,3),
      'action':motion,'phase':i,'focus':re.sub('[「」『』、。！？]','',seg)[:14]})
   t+=dt
  scene={'id':sid,'chapter':ch,'section':LABELS[ch],'title':LABELS[ch],
     'narration':narration,'visual':family,'focus':family,'note':re.sub('[「」『』、。！？]','',narration)[:20],
     'sceneIndex':n-1,'cues':entries,'duration':round(t,3),'durationSource':'PREVIEW_ONLY',
     'context':ch,'paletteVariant':n%5}
  scenes.append(scene)
  (S/(sid+'.tsx')).write_text(
    "import {makeScene2D} from '@motion-canvas/2d';\n"
    "import {playScene} from '../lib/director';\n"
    "import scenes from '../../content/scenes.json';\n"
    f"const shot=scenes.find(x=>x.id==='{sid}')!;\n"
    "export default makeScene2D(function* (view){yield* playScene(view,shot);});\n",encoding='utf-8')
 assert len(scenes)>=82,('Too few scenes',len(scenes))
 assert len(set(x['visual'] for x in scenes))>=27,len(set(x['visual'] for x in scenes))
 meta={'version':1,'shared':{'background':'rgb(8,12,20)','range':[0,None],
       'size':{'x':1920,'y':1080},'audioOffset':0},'preview':{'fps':30,'resolutionScale':.5},
       'rendering':{'fps':30,'resolutionScale':1,'colorSpace':'srgb',
         'exporter':{'name':'@motion-canvas/ffmpeg',
         'options':{'fastStart':True,'includeAudio':True}},'fileType':'image/png','quality':1}}
 for ch in ORDER:
  ids=[s['id'] for s in scenes if s['chapter']==ch]
  imports='\n'.join(f"import s{i} from '../scenes/{sid}?scene';" for i,sid in enumerate(ids))
  (P/(ch+'.ts')).write_text("import {makeProject} from '@motion-canvas/core';\n"+imports+"\n"+
    f"export default makeProject({{name:'v138-{ch}',scenes:["+
    ','.join('s'+str(i) for i in range(len(ids)))+
    f"],audio:'/media/{ch}/narration.wav'}});\n",encoding='utf-8')
  (P/(ch+'.meta')).write_text(json.dumps(meta),encoding='utf-8')
 (C/'scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2),encoding='utf-8')
 audit={'sourceSHA256':hashlib.sha256(src.encode()).hexdigest(),'sourceCharacters':len(src),
   'narrationCoverage':1.0,'scenes':len(scenes),'subtitleCues':sum(len(x['cues']) for x in scenes),
   'visualFamilies':dict(Counter(x['visual'] for x in scenes)),
   'chapters':dict(Counter(x['chapter'] for x in scenes))}
 (C/'audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8')
 print('V138_COMPILED',len(scenes),len(set(x['visual'] for x in scenes)),audit['subtitleCues'])
if __name__=='__main__':main()
