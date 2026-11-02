#!/usr/bin/env python3
from pathlib import Path
import json,re,hashlib,collections
R=Path(__file__).resolve().parents[1]; C=R/'content';S=R/'src/scenes';P=R/'src/projects'
for p in (C,S,P):p.mkdir(parents=True,exist_ok=True)
ORDER=['prologue','chapter1','chapter2','chapter3','chapter4','chapter5','epilogue']
HEAD=['プロローグ','第1章','第2章','第3章','第4章','第5章','エピローグ']
LABELS=['なぜ命を懸けるのか','死地に志願する男たち','名誉の報酬体系','勇気というシグナル','国家より近い仲間','勇気を作る社会','勇気は誰のものか']
# Each item: layout | slide heading | up to four short, sourced labels
PLANS={
'prologue':[
'divider|最初に死地へ行く者|FORLORN HOPE',
'duel|彼らを動かしたもの|昇進と名誉|生命の危険|それだけか？',
'metric2|1813年の志願|枠は2つ|志願は6人|抽選で決定',
'quote|20ポンドでも譲らない|危険な役割を奪い合う',
'dilemma|常識の矛盾|死を恐れる|それでも志願|なぜ？',
'network|三つの視点|歴史学|進化生物学|社会心理学|勇気',
'hypothesis|本当の謎|誰が勇気の価値を決めるのか',
],
'chapter1':[
'divider|第1章　死地に立つ|ナポレオン戦争の先遣隊',
'timeline|19世紀初頭|ナポレオン戦争|攻囲戦|先頭突撃',
'headline|フォーローン・ホープ|絶望的な任務|最前列の兵士',
'mechanism|城壁を攻める手順|砲撃で破壊|突破口|先遣突撃|後続部隊',
'locator|突破口は逃げ場がない|狭い入口|守備側の集中砲火|位置関係の模式図',
'dilemma|死が確定ではない|生還する者|極めて危険|任務の実態',
'study|エドワード・コステロ|1852年の回想録|英国軍兵士|一次証言',
'timeline|1812年の突撃|シウダー・ロドリーゴ|志願|戦闘前夜',
'quote|彼らは恐怖を知らない？|死を恐れる普通の人間',
'duel|二つの感情|生還の不安|戦利品への期待|同時に抱く',
'contrast|美談の裏側|純粋な愛国心だけ|恐怖も利益もある|二面性',
'thesis|問いはむしろ深まる|普通の人間|自ら志願|何が変えた？',
],
'chapter2':[
'divider|第2章　名誉の報酬|生命のリスクはどう値付けされたか',
'matrix|突撃の報酬|昇進の可能性|名誉|上官の評価|特別な記章',
'study|英国国立陸軍博物館|フォーローン・ホープ|昇進と名誉|歴史資料',
'timeline|記章の歴史|1812年の攻囲戦|第52歩兵連隊|1820年のメダル',
'thesis|危険が価値に変わる|命を懸ける|名誉の証明|軍隊の評価',
'study|コステロの記録|トーマス・プランケット|連隊の表彰|兵士の反応',
'method|兵士を奮い立たせる|整列させる|功績を称える|報酬を与える|全員が見る',
'cycle|勇気の再生産|危険に挑む|評価される|周囲も望む|志願が増える',
'duel|報酬は利益か|命の危険|昇進と名誉|合理性は？',
'inversion|再び1813年へ|サン・セバスティアン|2つの枠|6人が志願',
'bar2|競争になる突撃|2枠|6人|抽選',
'difference|20ポンドの逸話|交代の申し出|それでも断る|金銭だけではない',
'dilemma|生還しなければ|昇進を享受できる|命を失えば終わる|評価の矛盾',
'quote|彼らが求めたもの|「勇敢な人間」と認められる',
'hypothesis|危険が能力を証明する？|名誉そのものが報酬になる',
'analogy|意外な生物学へ|戦場の兵士|クジャク|コストのシグナル',
],
'chapter3':[
'divider|第3章　勇気のシグナル|生物学と社会的評価',
'layer|クジャクの尾羽|大きい|維持コスト|異性へのアピール',
'study|コストのかかるシグナル|進化生物学|負担|能力の手掛かり',
'difference|負担は自動的に価値？|大変なだけ|意味ある情報|別物',
'duel|勇敢さの伝え方|「勇敢だ」と宣言|他人を危険から救う|説得力の差',
'causal|何が信頼を生む|実際のリスク|他人の利益|勇敢さの評価',
'study|Farthing 2005|危険を冒す目的|人物評価|恋愛相手の魅力',
'contrast|英雄と無謀|人助けの危険|無目的な危険|評価は変わる',
'xray|Farthing 2007|危険の程度|行為の目的|追加検証',
'scale|同じ危険、違う意味|勇気|無謀|社会的文脈',
'matrix|兵士の観察可能な姿|訓練の成績|戦場の行動|自発的志願|仲間の目',
'network|名誉を生む視線|本人|仲間|上官|組織',
'quote|勇気を見せる|危険な行動が自分の能力を語る',
'thesis|それでも説明できない|評判|命|釣り合うのか',
'hypothesis|自分とは何か|仲間の利益が自己利益になる？',
],
'chapter4':[
'divider|第4章　国家より近い仲間|命を懸ける対象を考える',
'duel|二つの忠誠|祖国のため|戦友のため|同じではない',
'study|Shils & Janowitz 1948|第二次大戦のドイツ軍|部隊の結束|戦争社会学',
'network|一次集団の力|同僚|戦友|同じ部隊|日常の信頼',
'difference|巨大な国家と小集団|抽象的な政治理念|毎日隣にいる仲間|距離が違う',
'method|戦友が生まれるまで|共同生活|訓練|危機の共有|相互扶助',
'dilemma|自分だけ後ろに残る|危険から離れる|仲間を見送る|簡単な選択か',
'thesis|損得勘定の限界|自分の利益|仲間の利益|分けられるか',
'study|2014年　リビア内戦|179人を調査|前線42人|集団心理',
'quote|アイデンティティ融合|自分と集団の境界が薄れる',
'analogy|家族と戦友|血縁のある家族|血縁のない部隊|心理的な重なり',
'metric2|前線の戦闘員|約半数|家族より強い結びつき|調査対象の回答',
'gradient|集団が自分になる|個人|戦友|部隊|一体感',
'contrast|利益の境界が変わる|自分を守る|仲間を守る|別ではなくなる',
'hypothesis|自由な志願とは？|集団への愛情|集団からの圧力',
'quote|次の問い|「勇気」は本人が選んだのか',
],
'chapter5':[
'divider|第5章　誰が勇気を作るのか|アリストテレスから現代へ',
'study|アリストテレス|『ニコマコス倫理学』|市民的勇気|名誉と不名誉',
'duel|二つの行動原理|勇敢だと称賛されたい|臆病だと非難されたくない',
'difference|市民的勇気と強制|名誉を求める|処罰を恐れる|哲学の区別',
'dilemma|志願しなかったら|合理的な危険回避|臆病者というレッテル|どう評価？',
'study|再びコステロの記録|療養していた軍曹|上官の叱責|歴史の証言',
'causal|軍曹への圧力|医師の判断|戦闘への不参加|階級返上|軍紀',
'quote|戦わなかった代償|病気でも批判される社会',
'contrast|勇気の両面|志願すれば名誉|拒めば不名誉|構造を考える',
'inversion|自発的なのに自由ではない？|本人の意思|組織の価値観|評価が選択を動かす',
'path|コステロの変化|1812年 志願|1813年 ビトリア|戦利品の獲得',
'metric2|失うものが変わる|以前は前へ|財産を得た後は慎重|同一人物の変化',
'difference|勇気は固定の性格か|死を恐れない人格|条件で変わる判断|同じ人でも変化',
'matrix|何が危険の価値を決める|失うもの|守るもの|仲間の評価|将来の利益',
'network|評価するのは誰か|社会|組織|仲間|自分',
'analogy|職場にもある構造|危険な突撃|困難な仕事|評価と負担',
'cycle|称賛が義務に変わる|引き受ける|称賛される|断りづらくなる|暗黙の義務',
'dilemma|勇気と社会的圧力|責任感をほめる|断る人を責める|表と裏',
'quote|美しい言葉の裏側|「勇気」は誰を動かす？',
'thesis|勇気の社会的な正体|個人の美徳|社会の評価基準|両方である',
'outro|勇気は誰のものか|誰が危険を負い|誰が称賛するのか',
],
'epilogue':[
'divider|エピローグ|その勇気は誰のものだったのか',
'matrix|志願の複数の動機|昇進|名誉|仲間|不名誉への恐れ',
'duel|単純な英雄像を壊す|命知らず|普通の人間|利益も恐怖もある',
'network|価値を決める社会|組織|仲間|自分|評判',
'cascade|価値観が選択になる|称賛される|価値を学ぶ|行動を選ぶ|危険を引き受ける',
'difference|勇気の光と影|人を称賛する|人を追い詰める|同じ仕組み',
'quote|その行動は誰が選んだ？|本当に自分の意思なのか',
'hypothesis|誰かの評価のために|勇敢だと認められたい|選ばされていないか',
'outro|また余計なことを考えてしまった。|考える夜',
],
}
def normalized(text):return re.sub(r'\n[ \t]*','',text.replace('**','').replace('---','').strip())
def segments(text):
    out=[s for s in re.findall(r'[^。！？!?]*[。！？!?]?',text) if s]
    assert ''.join(out)==text
    return out
def partition(text,n):
    parts=segments(text); out=[]; i=0
    assert len(parts)>=n, (len(parts),n)
    for step in range(n):
        slots=n-step;limit=len(parts)-(slots-1);want=sum(len(x) for x in parts[i:])/slots
        acc=''
        while i<limit and (len(acc)<want*.84 or not acc):
            acc+=parts[i];i+=1
        out.append(acc)
    assert i==len(parts) and ''.join(out)==text
    return out
def voice(text):
    d={'Adventures of a Soldier':'アドベンチャーズ オブ ア ソルジャー','1812':'せんはっぴゃくじゅうに','1813':'せんはっぴゃくじゅうさん','1820':'せんはっぴゃくにじゅう','1852':'せんはっぴゃくごじゅうに','1948':'せんきゅうひゃくよんじゅうはち','2005':'にせんご','2007':'にせんなな','2011':'にせんじゅういち','2014':'にせんじゅうよん','179':'ひゃくななじゅうきゅう','42':'よんじゅうに','52':'ごじゅうに','20':'にじゅう','19':'じゅうきゅう','2':'に','6':'ろく','YouTuber':'ユーチューバー','YouTube':'ユーチューブ','Instagram':'インスタグラム','ABEMA TIMES':'アベマタイムズ','Baxter':'バクスター','Czarnecka':'チャルネツカ','Clark':'クラーク','Jno-Charles':'ジョノチャールズ','SNS':'エスエヌエス','2026':'にせんにじゅうろく','2025':'にせんにじゅうご','2024':'にせんにじゅうよん','2020':'にせんにじゅう','1938':'せんきゅうひゃくさんじゅうはち','1921':'せんきゅうひゃくにじゅういち','1989':'せんきゅうひゃくはちじゅうきゅう','2,200':'にせんにひゃく','5,253':'ごせんにひゃくごじゅうさん','46.4':'よんじゅうろくてんよん','75':'ななじゅうご'}
    for a,b in sorted(d.items(),key=lambda x:-len(x[0])):text=text.replace(a,b)
    return text.replace('％','パーセント')
def captions(text):
    out=[]
    for sentence in segments(text):
        while sentence:
            if len(sentence)<=30:part,sentence=sentence,''
            else:
                cuts=[j+1 for j,ch in enumerate(sentence[:29]) if ch in '、，」』' and j>=11]
                pos=cuts[-1] if cuts else 27
                part,sentence=sentence[:pos],sentence[pos:]
            cut=(len(part)+1)//2
            display=part if len(part)<=16 else part[:cut]+'\n'+part[cut:]
            assert max(len(x) for x in display.split('\n'))<=16
            out.append(dict(text=part,speech=voice(part),display=display,start=0,end=max(.55,len(part)/7.0)))
    assert ''.join(c['text'] for c in out)==text
    return out
def main():
    src=(C/'manuscript.md').read_text(encoding='utf-8')
    matches=re.findall(r'(?m)^## ([^\n]+)\n(.*?)(?=^## |\Z)',src,re.S|re.M)
    chunks={}
    for label,part in matches:
        for word,ch in zip(HEAD,ORDER):
            if label.startswith(word):chunks[ch]=normalized(part);break
    assert set(chunks)==set(ORDER),chunks.keys()
    scenes=[];slides=[];chapters={}
    for ch in ORDER:
        plan=[(a[0],a[1],a[2:]) for a in [x.split('|') for x in PLANS[ch]]]
        pieces=partition(chunks[ch],len(plan))
        chapters[ch]=len(plan)
        for j,((layout,headline,labels),text) in enumerate(zip(plan,pieces)):
            i=len(scenes)+1;id=f'S{i:03}';cu=captions(text)
            effect=(i*11+i//7*3)%29
            slides.append(dict(id=id,layout=layout,headline=headline,labels=labels,effect=effect))
            scenes.append(dict(id=id,chapter=ch,section=LABELS[ORDER.index(ch)],title=headline,visual=layout,
              visualInstruction='プレゼンの図解のみ。実写・芝居・情景描写なし。',
              motionInstruction=f'レイアウト固有のモーション＋意味に沿った強調 No.{effect}',
              narration=text,cues=cu,sceneIndex=i-1,duration=sum(x['end'] for x in cu),durationSource='PREVIEW_ONLY'))
    assert ''.join(s['narration'] for s in scenes)==''.join(chunks[k] for k in ORDER)
    assert len(set(s['layout'] for s in slides))>=26
    assert all(a['layout']!=b['layout'] for a,b in zip(slides,slides[1:]))
    assert all(a['effect']!=b['effect'] for a,b in zip(slides,slides[1:]))
    (C/'scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2))
    (C/'slide-spec.json').write_text(json.dumps({'version':'v143','style':'editorial slide documentary','specs':slides},ensure_ascii=False,indent=2))
    for ch in ORDER:
        arr=[s for s in scenes if s['chapter']==ch]
        for s in arr:
            (S/(s['id']+'.tsx')).write_text(
                "import {makeScene2D} from '@motion-canvas/2d';\n"
                "import {playScene} from '../lib/director';\n"
                "import scenes from '../../content/scenes.json';\n"
                "const shot=scenes.find(x=>x.id==='"+s['id']+"')!;\n"
                "export default makeScene2D(function* (view){yield* playScene(view,shot);});\n")
        imports='\n'.join(f"import shot{k} from '../scenes/{s['id']}?scene';" for k,s in enumerate(arr))
        (P/(ch+'.ts')).write_text("import {makeProject} from '@motion-canvas/core';\n"+imports+
          "\nexport default makeProject({name:'v143-"+ch+"',scenes:["+
          ','.join('shot'+str(i) for i in range(len(arr)))+"],audio:'/media/"+ch+"/narration.wav'});\n")
        meta={'version':1,'shared':{'background':'rgb(10,15,22)','range':[0,None],'size':{'x':1920,'y':1080},'audioOffset':0},
          'preview':{'fps':30,'resolutionScale':.5},'rendering':{'fps':30,'resolutionScale':1,'colorSpace':'srgb',
          'exporter':{'name':'@motion-canvas/ffmpeg','options':{'fastStart':True,'includeAudio':True}},'fileType':'image/png','quality':1}}
        (P/(ch+'.meta')).write_text(json.dumps(meta))
    audit={'status':'PASS','sceneCount':len(scenes),'chapterScenes':chapters,'subtitleCues':sum(len(s['cues']) for s in scenes),
       'layouts':len(set(s['layout'] for s in slides)),'motionVariants':len(set(s['effect'] for s in slides)),
       'narrationCoverage':1.0,'sourceSHA256':hashlib.sha256(src.encode()).hexdigest()}
    (C/'audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
    print('V143_COMPILE_PASS',json.dumps(audit,ensure_ascii=False))
if __name__=='__main__':main()
