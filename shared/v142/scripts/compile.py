#!/usr/bin/env python3
from pathlib import Path
import json,re,hashlib,collections
R=Path(__file__).resolve().parents[1]; C=R/'content';S=R/'src/scenes';P=R/'src/projects'
for p in (C,S,P):p.mkdir(parents=True,exist_ok=True)
ORDER=['prologue','chapter1','chapter2','chapter3','chapter4','chapter5','epilogue']
HEAD=['プロローグ','第1章','第2章','第3章','第4章','第5章','エピローグ']
LABELS=['子どもで稼ぐことは悪いのか','子役と家族動画の法律','遊びが労働になる瞬間','その「はい」は自由か','子どものお金は誰のもの','過去を取り戻す権利','親は子の所有者なのか']
# Diagram, concise editorial headline, labels. Original video has no stock-photo or scenic cut.
PLANS={
'prologue':[
'headline|子どもが稼ぐ時代|2026年7月|家族系の収益化停止|報道：ABEMA TIMES',
'metric2|広告収益が消えた日|約62万人|約2,200本|当事者による説明',
'study|停止理由とは|未成年への注目|YouTubeの通知|停止≠法律違反',
'duel|同じ子どもの出演|テレビの子役|家族系YouTuber|何が違う？',
'matrix|子どもの商業活動|子役|ジュニアアイドル|家族動画|共通：収益',
'difference|親が持つ二つの顔|保護者|利益を得る事業者|両立できるのか',
'quote|本人の意思は？|やりたい！|同意だけで十分か',
'hypothesis|子どものため、とは|家族が豊かになる|本人の利益は？',
'thesis|本当の問い|保護者|経営者|利益相反'],
'chapter1':[
'divider|児童労働の境界|原則禁止と例外',
'headline|労働基準法 第56条|原則は使用禁止|一定条件で例外',
'timeline|年齢による規制|13歳未満|13歳以上|15歳後の年度末',
'method|子役の活動と保護|行政の許可|学業に支障なし|業務の条件|就業時間',
'duel|アイドルの法的地位|雇用される仕事|それ以外の活動|実態で判断',
'contrast|雇用契約と家族生活|撮影現場の子役|家庭内YouTube',
'matrix|家族チャンネルの役割|撮影する親|出演する子|編集する親|収益を受け取る親',
'difference|仕事の線引き|明確な雇用関係|親子の日常|一律には決まらない',
'framing|事業に変わる順番|日常|撮影|投稿|広告',
'hypothesis|家族旅行も労働か|楽しむ家族|広告収入が生まれる',
'quote|常識への疑問|遊びは仕事か|定義そのものを疑う'],
'chapter2':[
'divider|遊びの値札|日常が収益に変わる',
'duel|同じ100万再生|自由なおもちゃ遊び|再撮影させる親|どちらが労働？',
'difference|楽しさと労働|楽しいこと|労働であること|両立する',
'cycle|動画が収益に変わる|日常|撮影|投稿|広告',
'metric2|5,253件の投稿分析|5,253件|10人|英国の母親投稿',
'study|2025年の研究|Baxterら|Instagram投稿|対象は英国の10人',
'ratio|子どもと広告|広告あり 46.4|それ以外 53.6|子ども登場投稿の％',
'headline|子どもが映っても|いいね増とは限らない|研究の分析結果',
'layer|日常が商品になる|日常の記録|動画の編集|スポンサー商品',
'matrix|撮影できる私生活|朝起きる|ご飯を食べる|親子の会話|兄弟のけんか',
'contrast|家族と撮影現場|撮影終了がある|生活全体が撮影可能',
'method|ジュニアアイドル|練習する|歌やダンス|チケット販売|グッズ販売',
'quote|楽しい≠無償|楽しんでいても|それは仕事になる'],
'chapter3':[
'divider|「はい」と「いいえ」|子どもの同意を考える',
'quote|子どもの夢|やりたい！|それも尊重すべきだ',
'study|子どもの権利条約|第12条：意見|第13条：表現|第16条：私生活',
'dilemma|意思と期待のあいだ|親の期待に応える|自分で決める|意思が混ざり得る',
'causal|出演をやめたい日|家族の収入|親の仕事|子どもの意思|利害の衝突',
'cycle|期待が圧力に変わる|人気|収益|期待|出演',
'difference|自由意思の二つ|やりたいと言える|やめたいと言える|別の能力',
'analogy|断りにくさは大人も|会社の上司|家族の親|力関係がある',
'xray|外からは見えない|表面上の笑顔|家計への依存|勝手な断定はしない',
'study|子どもの商業利用|Clarkら|2025年の倫理研究|権利と利益',
'timeline|意思は変化する|5歳の自分|15歳の自分|大人の自分',
'difference|今と未来の同意|今は公開してよい|後から消したい|同じ意思ではない',
'hypothesis|誰が決定するか|親の判断|未来の子ども',
],
'chapter4':[
'divider|100年前のハリウッド|子役の稼いだお金',
'timeline|ジャッキー・クーガン|1921年『キッド』|1938年の訴訟|子役保護の契機',
'headline|子役の収入は消えた|親による管理|クーガン事件',
'contrast|稼ぐ人と管理する人|子どもが稼ぐ|親が管理する|同じではない',
'study|クーガン法とは|子役の権利|信託口座|収益の保護',
'thesis|利益相反の正体|他人の利益を守る|自分も利益を得る|判断を歪める条件',
'network|親が兼ねる四つの役|保護者|撮影者|経営者|収入管理者',
'dilemma|子の利益 vs 収益|今日は出たくない|動画は伸びるかも|誰が決める？',
'cycle|家族株式会社|子が出演|再生数が増える|収入が入る|続ける圧力',
'difference|愛情と利益は別物|子を愛している|事業から儲かる|利益相反は消えない',
'timeline|米国の保護制度|2024年成立|2025年施行|子の取り分を守る',
'method|収益保護の設計|出演割合の把握|収益の記録|信託口座|第三者の監督',
'study|日本の労基法 第59条|本人の賃金請求|親の代理受領を禁止|労働者の場合',
'quote|親のものではない|稼いだのは子ども|育てたこととは別'],
'chapter5':[
'divider|消せない子ども時代|お金だけでは解決しない',
'duel|二つの出演の仕方|役を演じる子役|生活を撮る家族|記録の性質が違う',
'layer|人生の商品化|学校での失敗|家族のけんか|泣いた姿|公開動画',
'difference|作品と人生|役の記録|本人の生活|消せない可能性',
'framing|アイドルが売るもの|歌とダンス|年齢|容姿|ファンとの関係',
'timeline|フランスの制度|2020年 商業利用|2024年 肖像権|親の保護責任',
'study|子どもの肖像権|本人の人格|親の保護義務|公開は無制限でない',
'headline|13歳から削除請求|ミネソタ州の法律|本人の意思を優先',
'dilemma|削除の限界|投稿者は消せる|転載は残り得る|公開前の判断が大事',
'matrix|認めるための条件|活動時間|学業と休息|報酬保護|拒否の権利',
'method|保護する仕組み|利益を分ける|公開を選ぶ|過去を見直す|独立した判断',
'inversion|問いを反転する|親が許可したか|子を誰が守るか|判断基準を変える',
'quote|問題の本質|商品価値ではない|誰が支配するか'],
'epilogue':[
'divider|親は所有者ではない|保護者とは何か',
'difference|知っている≠正しい|子をよく知っている|必ず子の利益になる|同じではない',
'network|親の複数の役割|保護|教育|経営|報酬',
'dilemma|善意でも起きる衝突|子どもを愛する|動画で稼ぐ|仕組みが必要',
'contrast|普通の仕事と比較|会社は辞められる|家族は辞められない',
'hypothesis|子どもが断ったら|もうやりたくない|事業を手放せるか',
'outro|今夜も、当たり前がひとつ減りました。|考える夜']
}
def normalized(text):return re.sub(r'\s+','',text.replace('**',''))
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
    d={'YouTuber':'ユーチューバー','YouTube':'ユーチューブ','Instagram':'インスタグラム','ABEMA TIMES':'アベマタイムズ','Baxter':'バクスター','Czarnecka':'チャルネツカ','Clark':'クラーク','Jno-Charles':'ジョノチャールズ','SNS':'エスエヌエス','2026':'にせんにじゅうろく','2025':'にせんにじゅうご','2024':'にせんにじゅうよん','2020':'にせんにじゅう','1938':'せんきゅうひゃくさんじゅうはち','1921':'せんきゅうひゃくにじゅういち','1989':'せんきゅうひゃくはちじゅうきゅう','2,200':'にせんにひゃく','5,253':'ごせんにひゃくごじゅうさん','46.4':'よんじゅうろくてんよん','75':'ななじゅうご'}
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
    (C/'slide-spec.json').write_text(json.dumps({'version':'v142','style':'editorial slide documentary','specs':slides},ensure_ascii=False,indent=2))
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
          "\nexport default makeProject({name:'v142-"+ch+"',scenes:["+
          ','.join('shot'+str(i) for i in range(len(arr)))+"],audio:'/media/"+ch+"/narration.wav'});\n")
        meta={'version':1,'shared':{'background':'rgb(10,15,22)','range':[0,None],'size':{'x':1920,'y':1080},'audioOffset':0},
          'preview':{'fps':30,'resolutionScale':.5},'rendering':{'fps':30,'resolutionScale':1,'colorSpace':'srgb',
          'exporter':{'name':'@motion-canvas/ffmpeg','options':{'fastStart':True,'includeAudio':True}},'fileType':'image/png','quality':1}}
        (P/(ch+'.meta')).write_text(json.dumps(meta))
    audit={'status':'PASS','sceneCount':len(scenes),'chapterScenes':chapters,'subtitleCues':sum(len(s['cues']) for s in scenes),
       'layouts':len(set(s['layout'] for s in slides)),'motionVariants':len(set(s['effect'] for s in slides)),
       'narrationCoverage':1.0,'sourceSHA256':hashlib.sha256(src.encode()).hexdigest()}
    (C/'audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2))
    print('V142_COMPILE_PASS',json.dumps(audit,ensure_ascii=False))
if __name__=='__main__':main()
