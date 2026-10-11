#!/usr/bin/env python3
"""Convert the ENTIRE approved capitalism manuscript to chapter slides and verbatim measured-voice cues."""
from pathlib import Path
import json,re
R=Path(__file__).resolve().parents[1]; C=R/'content'; S=R/'src/scenes'; P=R/'src/projects'
S.mkdir(parents=True,exist_ok=True);P.mkdir(parents=True,exist_ok=True)
CHAPTERS=['prologue','chapter1','chapter2','chapter3','chapter4','chapter5','epilogue']
HEADLINES={
 'prologue':['嫌われる成功者','資本主義への告発','15億人の逆説','何と比較するのか？','5つの告発を検証','考える夜へようこそ'],
 'chapter1':['比較対象は理想郷か？','産業革命以前の生活','幸福と物質的条件','生産性という転換点','世界の貧困削減','単一の原因ではない','富は増やすことができる','格差と貧困を区別する'],
 'chapter2':['コーヒー一杯の裏側','見知らぬ人の協力','交換がつくる利益','市場には条件がある','中央で管理できるか？','価格が伝える情報','利己心が協力に変わる'],
 'chapter3':['安い賃金は搾取か？','仕事がなければ？','ケニアの実証研究','37％の正しい意味','南アフリカの雇用','海外委託の不安定さ','労働条件と選択肢','職場の競争が賃金を変える','評価すべき指標'],
 'chapter4':['起業家が生む価値','富の来源を区別する','巨大企業と独占','競争と技術革新','中国の改革開放','勝者が交代する制度'],
 'chapter5':['負の外部性','成長と環境の両立','米国のGDPと大気汚染','冷蔵庫とオゾン層','革新が環境を改善する','規制と市場の役割','共通の目標を設定する','豊かさと幸福の距離','所得と幸福の研究','幸福を選べる条件'],
 'epilogue':['5つの批判を振り返る','どの比較が正しいか','市場と社会的安全網','実際の制度と比較する','完璧でなくても','視聴者への問い'],
}
KINDS={
 'prologue':['title','triptych','metric','question','compare','closing'],
 'chapter1':['compare','timeline','contrast','process','metric','triptych','growth','closing'],
 'chapter2':['process','network','compare','triptych','contrast','growth','closing'],
 'chapter3':['compare','question','metric','caveat','growth','contrast','triptych','process','closing'],
 'chapter4':['process','triptych','compare','curve','timeline','closing'],
 'chapter5':['triptych','process','environment','metric','process','compare','triptych','contrast','research','closing'],
 'epilogue':['triptych','compare','network','question','closing','closing'],
}
ELEMENTS={
 'prologue':[
 ['仕事','物流','銀行'],['格差','搾取','環境破壊'],['1990年','2022年','世界銀行'],
 ['現実の市場','理想の社会','比較の基準'],['貧困','労働','環境'],['歴史','研究','再解釈']
 ],
 'chapter1':[
 ['理想郷と比較','実際の歴史と比較'],['不作','運送不足','感染症'],
 ['社会的幸福','物質的条件'],['工場','鉄道','冷蔵技術','公共制度'],
 ['国際貧困ライン','約15億人','1990→2022'],
 ['市場','公衆衛生','社会政策'],['100個','300個'],['相対格差','絶対的生活水準']
 ],
 'chapter2':[
 ['農園','海上輸送','焙煎','台所'],['自分の利益','他人の必要','交換'],
 ['パンを売る','食事を得る'],['契約','競争','責任'],
 ['世界の需要','中央の計画'],['豆が不足','価格が上昇','行動が変わる'],['強欲','分業','協力']
 ],
 'chapter3':[
 ['先進国の賃金','現地の雇用'],
 ['仕事がある世界','仕事がない世界'],['比較群','研修＋紹介群','月収＋37%'],
 ['GAFA単独の効果 ×','研修＋紹介の効果 ○'],
 ['2019年','2024年','約6.5万人→約15万人'],['雇用の創出','契約終了','失職リスク'],
 ['安全','尊厳','交渉力'],['技能','雇用者の競争','賃金'],
 ['所得','選択肢','労働条件'],
 ],
 'chapter4':[
 ['資金','挑戦','商品','雇用'],['革新','相続','独占利潤'],
 ['成長する企業','新規参入の障壁'],['競争が弱い','適度な競争','競争が強すぎる'],
 ['改革開放','貿易','貧困削減'],['新規参入','技術革新','勝者の交代'],
 ],
 'chapter5':[
 ['利益','環境負荷','社会的費用'],['効率化','新技術','環境対策'],
 ['実質GDP','主要大気汚染物質','1970〜2024年'],
 ['旧冷媒','国際規制','代替技術'],['企業の研究開発','社会への普及','環境改善'],
 ['市場の革新','法律・条約'],['社会の合意','技術','競争'],
 ['高い所得','疲労と比較'],['所得','満足度','個人差'],
 ['医療','食事','人生の選択肢'],
 ],
 'epilogue':[
 ['貧困','搾取','環境'],['理想の世界','現実の代替案'],
 ['市場','法律','社会保障'],['欠陥の列挙','代替案の検証'],
 ['新しい価値','協力','改善'],['資本主義を超える制度？','あなたの意見']
 ],
}
SPECIAL={
 ('prologue',2):{'metric':'15億人','source':'世界銀行：1990〜2022年。制度の単独効果ではない'},
 ('chapter1',4):{'metric':'約15億人','source':'世界銀行：国際貧困ライン改定（2025年）'},
 ('chapter3',2):{'metric':'+37%','source':'J-PAL：研修＋就職紹介／比較群との差'},
 ('chapter3',4):{'metric':'15万人','source':'南アフリカBPO雇用推計（2024年）、売上高≠GDP'},
 ('chapter5',2):{'metric':'+338% / −79%','source':'米国EPA、1970〜2024年。主要大気汚染物質でありCO₂ではない'},
 ('chapter5',3):{'metric':'約99%','source':'UNEP：規制対象のオゾン層破壊物質の段階的廃止'},
}
def cues_for(paragraph):
 # Preserve every source character, including punctuation; only split, never rewrite.
 out=[]; p=0
 while p<len(paragraph):
  rem=paragraph[p:]
  if len(rem)<=34: end=len(rem)
  else:
   options=[m.end() for m in re.finditer('[。、！？!?、]',rem[:35]) if m.end()>=18]
   end=max(options) if options else 34
  chunk=rem[:end];p+=end
  if len(chunk)>36:raise AssertionError('cue length')
  if len(chunk)<=18:display=chunk
  else:
   opts=[m.end() for m in re.finditer('、|，|,',chunk[:19]) if m.end()>=9]
   cut=max(opts) if opts else 18
   display=chunk[:cut]+'\n'+chunk[cut:]
  assert all(len(l)<=20 for l in display.split('\n'))
  out.append({'text':chunk,'speech':chunk,'display':display,'start':0.,'end':0.})
 assert ''.join(c['text'] for c in out)==paragraph
 return out
raw=(C/'manuscript.txt').read_text()
sections=re.split(r'(?=^【(?:プロローグ|第[1-5]章|エピローグ))',raw,flags=re.M)
sections=[s for s in sections if s.strip() and s.startswith('【')]
if len(sections)!=len(CHAPTERS):raise AssertionError('Expected 7 manuscript chapters, found '+str(len(sections)))
allshots=[];allparagraphs=[]
for slug,section in zip(CHAPTERS,sections):
 paragraphs=[p.strip() for p in re.split(r'\n\s*\n',section) if p.strip()]
 narration=[p for p in paragraphs if not p.startswith('【') and not p.startswith('タイトル') and not p.startswith('参考書籍')]
 if len(narration)!=len(HEADLINES[slug]):raise AssertionError((slug,len(narration),len(HEADLINES[slug])))
 for i,paragraph in enumerate(narration):
  paragraph=paragraph.replace('\n','')
  shot={'id':f'{slug}-{i:02d}','chapter':slug,'index':i,'title':HEADLINES[slug][i],
        'kind':KINDS[slug][i],'labels':ELEMENTS[slug][i], 'narration':paragraph,
        'cues':cues_for(paragraph),'duration':0,'durationSource':'PREVIEW_ONLY',
        **SPECIAL.get((slug,i),{})}
  allshots.append(shot);allparagraphs.append(paragraph)
 if sum(len(s['narration']) for s in allshots if s['chapter']==slug)<300:raise AssertionError(slug)
 # Each chapter is rendered once, with multiple evolving meaning-spaces.
 (S/f'{slug}.tsx').write_text("import {makeScene2D} from '@motion-canvas/2d';\nimport {playChapter} from '../lib/slideDirector';\nimport allData from '../../content/scenes.json';\nconst shots=allData.filter(s=>s.chapter==='"+slug+"');\nexport default makeScene2D(function* (view){yield* playChapter(view,shots);});\n")
 (P/f'{slug}.ts').write_text("import {makeProject} from '@motion-canvas/core';\nimport '@fontsource/noto-sans-jp/400.css';\nimport '@fontsource/noto-sans-jp/700.css';\nimport main from '../scenes/"+slug+"?scene';\nexport default makeProject({name:'capitalism-"+slug+"',scenes:[main],audio:'/media/"+slug+"/narration.wav'});\n")
 meta={"version":1,"shared":{"background":"rgb(9,14,25)","range":[0,None],"size":{"x":1920,"y":1080},"audioOffset":0},
       "preview":{"fps":30,"resolutionScale":.5},
       "rendering":{"fps":30,"resolutionScale":1,"colorSpace":"srgb",
       "exporter":{"name":"@motion-canvas/ffmpeg","options":{"fastStart":True,"includeAudio":True}},"fileType":"image/png","quality":1}}
 (P/f'{slug}.meta').write_text(json.dumps(meta))
# Explicitly ensure no narration was dropped, reordered, or rewritten.
source_concat=''.join(p.replace('\n','') for sec in sections for p in re.split(r'\n\s*\n',sec) if p.strip() and not p.strip().startswith('【') and not p.strip().startswith('タイトル') and not p.strip().startswith('参考書籍'))
assert ''.join(allparagraphs)==source_concat
assert len(allshots)==52
assert all(''.join(c['text'] for c in s['cues'])==s['narration'] for s in allshots)
(C/'scenes.json').write_text(json.dumps(allshots,ensure_ascii=False,indent=2))
print(json.dumps({'chapters':len(CHAPTERS),'slides':len(allshots),'narrationCharacters':len(source_concat),'subtitleCues':sum(len(s['cues']) for s in allshots)},ensure_ascii=False))
