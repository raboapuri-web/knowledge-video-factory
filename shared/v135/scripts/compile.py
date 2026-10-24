#!/usr/bin/env python3
"""V135 Tesca. Compiles the APPROVED source essay, without rewriting narration.
Scenes are meaning beats; every note is traceable to the exact paragraph span.
All typography uses the 1920x1080 safe grid; actual audio time is measured after VOICEVOX.
"""
from pathlib import Path
from collections import Counter
import hashlib,json,re
R=Path(__file__).resolve().parents[1]; C=R/'content'
S=R/'src'/'scenes'; P=R/'src'/'projects'
for d in [C,S,P]:d.mkdir(parents=True,exist_ok=True)
ORDER=['prologue','chapter1','chapter2','chapter3','chapter4','epilogue']
LABELS={'prologue':'神々は死んでいなかった','chapter1':'コシモの少年時代',
'chapter2':'二人の父親','chapter3':'古代宗教とキリスト教',
'chapter4':'暴力は終わるのか','epilogue':'煙を吐く鏡'}
FAMILIES=[
 'cosmos','serpent','supply','map','child','house','fracture',
 'addiction','craft','stigma','mentors','lineage','solar','debt',
 'conquest','syncretism','market','eclipse','friend','scripture',
 'confront','mirror','ethics','ending'
]
POOLS={
 'prologue':['cosmos','serpent','supply','map','conquest','child','mirror'],
 'chapter1':['child','house','addiction','fracture','craft','stigma','ethics'],
 'chapter2':['mentors','craft','lineage','solar','debt','market','ethics'],
 'chapter3':['conquest','syncretism','solar','debt','market','friend','eclipse','scripture','confront','mirror'],
 'chapter4':['mirror','ethics','market','conquest','fracture','friend','ending'],
 'epilogue':['mirror','ending','cosmos','ethics']
}
KEYS=[
 ('scripture','福音書|聖書|憐れみ|いけにえでは'),
 ('eclipse','日食|煙を吐く鏡|黒い太陽'),
 ('craft','小鳥|彫刻|小刀|刃物|ものを作|創造'),
 ('map','メキシコから|ジャカルタ|インドネシア|川崎へ'),
 ('conquest','十六世紀|一五二一年|スペイン|征服|植民地'),
 ('sun','太陽|命の借金|神々は自ら命'),
 ('friend','順太|友人'),
 ('market','コラソン|臓器|市場|心臓を売|金銭|富裕層'),
 ('mentors','パブロ|バルミロ|二人の父親'),
 ('addiction','覚醒剤|コカイン|麻薬|薬物'),
 ('fracture','殺し|殺人|衝突|両親|暴力'),
 ('stigma','教育|社会|少年院|倫理|免罪符'),
 ('lineage','祖母|リベルタ|継承|宗教を教|信仰を教'),
 ('debt','借金|贄|供犠|犠牲を要求'),
 ('syncretism','信仰は姿を変|混ざり合|生き残'),
 ('cosmos','地底|神々は死|五百年|神々が'),
 ('mirror','鏡|鏡合わせ|我々|あなた自身'),
 ('ending','復活など|一度も死ん|古代の祭壇'),
 ('confront','敵対|対立|拒む|否定|改宗'),
 ('house','父親|母親|ルシア|土方'),
 ('ethics','正義|幸福|憐れ|救済|選ばなければ'),
]
def pick(section,text,prev):
    cand=[]
    for j,(name,regex) in enumerate(KEYS):
        if re.search(regex,text):
            name='solar' if name=='sun' else name
            cand.append((0 if name in POOLS[section] else 2,j,name))
    for i,name in enumerate(POOLS[section]):cand.append((4,i,name))
    # V99 principle: avoid consecutive visual grammar repetition; all alternatives chapter-specific.
    cand.sort(key=lambda k:(k[0]+(5 if prev and prev[-1]==k[2] else 0)
        +(2 if k[2] in prev[-4:] else 0),k[1]))
    return cand[0][2]
def cues(text,limit=29):
    tokens=[]
    sentences=re.findall(r'[^。！？!?]*[。！？!?]|[^。！？!?]+$',text)
    assert ''.join(sentences)==text
    for q in sentences:
        while q:
            if len(q)<=limit:tokens.append(q);break
            breaks=[i+1 for i,c in enumerate(q[:limit]) if c in '、，。！？「」『』' and i>=11]
            if not breaks:breaks=[i+1 for i,c in enumerate(q[:limit]) if c in 'でをにとがはも' and i>=19]
            k=max(breaks) if breaks else limit
            tokens.append(q[:k]);q=q[k:]
    assert ''.join(tokens)==text
    return [{'text':t,'speech':t.replace('ICE','アイス').replace('1521','せんごひゃくにじゅういち'),
             'display':t[:16]+('\n'+t[16:] if len(t)>16 else ''),
             'start':round(i*1.0,3),'end':round((i+1)*1.0,3)}
             for i,t in enumerate(tokens)]
def compile_source():
    src=(C/'manuscript.md').read_text(encoding='utf-8').replace('\r','')
    parts=re.split(r'(?m)^# (.+)\n',src)
    assert len(parts)==11,('Expected 5 sections',len(parts))
    sections=[(parts[i],parts[i+1]) for i in range(1,len(parts),2)]
    raws=[]
    for idx,(head,body) in enumerate(sections):
        key=ORDER[idx]
        paragraphs=[p.strip() for p in re.split(r'\n\s*\n',body.strip()) if p.strip()]
        # Meaning beat packing: combine very short adjacent paragraphs but do not reword.
        beats=[];acc=''
        for paragraph in paragraphs:
            if acc and len(acc)+len(paragraph)>91:
                beats.append(acc);acc=''
            acc+=paragraph
            if len(acc)>=67:
                beats.append(acc);acc=''
        if acc:beats.append(acc)
        # split any extended paragraph on natural full stops so every scene is voice-safe.
        final=[]
        for beat in beats:
            while len(beat)>150:
                lim=beat[:115];k=max(lim.rfind('。'),lim.rfind('、'))
                k=k+1 if k>39 else 100
                final.append(beat[:k]);beat=beat[k:]
            if beat:final.append(beat)
        for text in final:raws.append((key,text))
        assert ''.join(x for ch,x in raws if ch==key)==''.join(paragraphs)
    # The final paragraphs are the epilogue even though the essay has no epilogue heading.
    ending_marker='そして私は、この物語の題名に立ち返りたくなる。'
    idx=next(i for i,(ch,t) in enumerate(raws) if ch=='chapter4' and ending_marker in t)
    for i in range(idx,len(raws)):raws[i]=('epilogue',raws[i][1])
    assert all(any(r[0]==ch for r in raws) for ch in ORDER)
    return src,raws
def main():
    src,raws=compile_source()
    scenes=[];recent=[]
    for idx,(chapter,narration) in enumerate(raws):
        visual=pick(chapter,narration,recent)
        recent.append(visual)
        section=LABELS[chapter]
        i=sum(x['chapter']==chapter for x in scenes)+1
        sid=chapter.upper()+'_'+str(i).zfill(3)
        row={'id':sid,'chapter':chapter,'section':section,'visual':visual,
           'title':section,'note':narration[:22].replace('「','').replace('」',''),
           'narration':narration,'focus':visual,'sceneIndex':i-1,
           'cues':cues(narration),'duration':len(cues(narration))*1.0,
           'durationSource':'PREVIEW_ONLY'}
        scenes.append(row)
        (S/f'{sid}.tsx').write_text(
          "import {makeScene2D} from '@motion-canvas/2d';\n"
          "import {playScene} from '../lib/director';\n"
          "import scenes from '../../content/scenes.json';\n"
          f"const s=scenes.find(x=>x.id==='{sid}')!;\n"
          "export default makeScene2D(function* (v){yield* playScene(v,s);});\n",encoding='utf-8')
    meta={'version':1,'shared':{'background':'rgb(8,13,20)','range':[0,None],
          'size':{'x':1920,'y':1080},'audioOffset':0},
      'preview':{'fps':30,'resolutionScale':.5},
      'rendering':{'fps':30,'resolutionScale':1,'colorSpace':'srgb',
         'exporter':{'name':'@motion-canvas/ffmpeg',
            'options':{'fastStart':True,'includeAudio':True}},'fileType':'image/png','quality':1}}
    for chapter in ORDER:
        names=[x['id'] for x in scenes if x['chapter']==chapter]
        imports='\n'.join(f"import s{i} from '../scenes/{name}?scene';" for i,name in enumerate(names))
        (P/f'{chapter}.ts').write_text(
          "import {makeProject} from '@motion-canvas/core';\n"+imports+"\n"+
          f"export default makeProject({{name:'v135-{chapter}',scenes:["+
          ','.join('s'+str(i) for i in range(len(names)))+
          f"],audio:'/media/{chapter}/narration.wav'}});\n",encoding='utf-8')
        (P/f'{chapter}.meta').write_text(json.dumps(meta),encoding='utf-8')
    (C/'scenes.json').write_text(json.dumps(scenes,ensure_ascii=False,indent=2),encoding='utf-8')
    audit={'approvedSource':'content/manuscript.md','sourceSHA256':hashlib.sha256(src.encode()).hexdigest(),
       'narrationCoverage':1.0,'scenes':len(scenes),'narrationCharacters':sum(len(s['narration']) for s in scenes),
       'subtitleCues':sum(len(x['cues']) for x in scenes),
       'visualFamilies':dict(Counter(x['visual'] for x in scenes)),
       'chapters':dict(Counter(x['chapter'] for x in scenes))}
    (C/'audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8')
    assert len(scenes)>=70 and len(audit['visualFamilies'])>=15,audit
    print('V135_COMPILED',len(scenes),'scenes',audit['narrationCharacters'],'characters',audit['subtitleCues'],'cues')
if __name__=='__main__':main()
