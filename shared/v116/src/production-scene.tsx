import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, easeInOutCubic, easeOutCubic, sequence, waitFor} from '@motion-canvas/core';
import {C, FONT, MOTION} from './theme';

export type Beat={id:string;kind:string;headline:string;labels:string[];narration:string};
export type Chapter={slug:string;title:string;beats:Beat[]};

function subtitleChunks(text:string){
  const s=text.split(/(?<=[。！？])/).map(x=>x.trim()).filter(Boolean);
  const out:string[]=[];
  for(const sentence of s){
    if(sentence.length<=38){out.push(sentence);continue;}
    const parts=sentence.split(/(?<=[、，])/).map(x=>x.trim()).filter(Boolean);
    let buf='';
    for(const part of parts){
      if((buf+part).length>38&&buf){out.push(buf);buf=part;} else buf+=part;
    }
    if(buf) out.push(buf);
  }
  return out.length?out:[text];
}

function Person({x=0,y=0,shirt=C.teal,scale=1,label='',ref}:{x?:number;y?:number;shirt?:string;scale?:number;label?:string;ref?:any}){
  return <Node ref={ref} x={x} y={y} scale={scale}>
    <Circle y={-84} width={72} height={72} fill={'#d3ad8f'}/>
    <Rect width={112} height={142} radius={28} fill={shirt}/>
    <Line points={[[0,-35],[0,26]]} stroke={C.paper} lineWidth={8}/>
    <Rect x={-34} y={112} width={28} height={94} radius={12} fill={'#34464e'}/>
    <Rect x={34} y={112} width={28} height={94} radius={12} fill={'#34464e'}/>
    {label?<Txt y={186} text={label} fontFamily={FONT} fontWeight={700} fontSize={26} fill={C.paper}/>:null}
  </Node>;
}

function Tag({ref,x,y,text,stroke=C.line,w=260}:{ref?:any;x:number;y:number;text:string;stroke?:string;w?:number}){
  return <Rect ref={ref} x={x} y={y} width={w} height={72} radius={20} fill={C.surface2} stroke={stroke} lineWidth={4}>
    <Txt text={text} width={w-28} textAlign={'center'} textWrap fontFamily={FONT} fontWeight={700} fontSize={24} fill={C.paper}/>
  </Rect>;
}

function Bubble({ref,x,y,text,accent=C.paper,w=350}:{ref?:any;x:number;y:number;text:string;accent?:string;w?:number}){
  return <Rect ref={ref} x={x} y={y} width={w} height={90} radius={34} fill={'#ebe7df'} stroke={accent} lineWidth={3}>
    <Txt text={text} width={w-34} textAlign={'center'} textWrap fontFamily={FONT} fontWeight={700} fontSize={25} fill={C.ink}/>
  </Rect>;
}

function title(group:Node,beat:Beat){
  group.add(<Txt y={-350} text={beat.headline} width={1540} textAlign={'center'} textWrap fontFamily={FONT} fontWeight={700} fontSize={54} fill={C.paper}/>);
}

function build(group:Node,beat:Beat){
  const k=beat.kind; const r:any={kind:k,items:[],lines:[]};
  title(group,beat);

  if(k==='v2_derby_press'){
    r.journalist=createRef<Node>(); r.horses=[0,1,2].map(()=>createRef<Circle>()); r.note=createRef<Rect>();
    group.add(<Node y={65}>
      <Rect y={135} width={1550} height={240} radius={30} fill={'#18313b'} stroke={C.line} lineWidth={5}/>
      <Line points={[[ -760,80],[760,80]]} stroke={C.gold} lineWidth={8}/>
      {r.horses.map((h:any,i:number)=><Circle key={String(i)} ref={h} x={-650-i*100} y={50+i*30} width={34} height={34} fill={i===0?C.gold:C.paper}/>)}
      <Rect x={-520} y={-55} width={470} height={210} radius={22} fill={'#12242c'} stroke={C.line} lineWidth={4}/>
      <Txt x={-520} y={-128} text={'PRESS'} fontFamily={FONT} fontWeight={700} fontSize={28} fill={C.muted}/>
      <Node ref={r.journalist}>{Person({x:-520,y:-10,shirt:C.blue,scale:0.72,label:'記者'})}</Node>
      <Rect ref={r.note} x={-300} y={-25} width={180} height={130} fill={'#eee9df'} rotation={-7} opacity={0}>
        <Line points={[[ -65,-30],[65,-30]]} stroke={'#9b978f'} lineWidth={4}/>
        <Line points={[[ -65,0],[45,0]]} stroke={'#9b978f'} lineWidth={4}/>
        <Line points={[[ -65,30],[58,30]]} stroke={'#9b978f'} lineWidth={4}/>
      </Rect>
      <Txt x={530} y={-120} text={'1970 / LOUISVILLE'} fontFamily={FONT} fontWeight={700} fontSize={42} fill={C.gold}/>
      <Txt x={530} y={-25} text={'観客の歓声\\n酒の匂い\\n競馬場の熱気'} fontFamily={FONT} fontSize={30} lineHeight={48} fill={C.paper} textAlign={'center'}/>
    </Node>);
  } else if(k==='v2_gonzo_page'){
    r.page=createRef<Rect>(); r.person=createRef<Node>(); r.scribbles=[0,1,2,3].map(()=>createRef<Line>());
    group.add(<Node y={55}>
      <Rect x={-520} width={470} height={410} radius={24} fill={'#15262f'} stroke={C.line} lineWidth={5}>
        <Txt y={-130} text={'従来の記者'} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.muted}/>
        <Circle y={20} width={120} height={120} fill={C.surface2}/>
        <Line points={[[0,95],[0,160]]} stroke={C.line} lineWidth={10}/>
      </Rect>
      <Rect ref={r.page} x={260} width={850} height={470} radius={18} fill={'#eee9df'} rotation={-2}>
        <Txt y={-160} text={'GONZO'} fontFamily={FONT} fontWeight={700} fontSize={54} fill={C.ink}/>
      </Rect>
      <Node ref={r.person}>{Person({x:80,y:35,shirt:C.red,scale:0.78,label:'記者自身'})}</Node>
      {r.scribbles.map((l:any,i:number)=><Line key={String(i)} ref={l} points={[[40,-80+i*55],[470+(i%2)*70,-120+i*75]]} stroke={i%2?C.red:C.ink} lineWidth={6} end={0}/>)}
    </Node>);
  } else if(k==='v2_persona_billboard'){
    r.person=createRef<Node>(); r.bill=createRef<Rect>(); r.flash=[0,1,2,3].map(()=>createRef<Circle>());
    group.add(<Node y={55}>
      <Rect ref={r.bill} y={-10} width={1050} height={470} radius={30} fill={'#18262d'} stroke={C.red} lineWidth={7} scale={0.45} opacity={0.35}>
        <Txt y={-115} text={'PUBLIC PERSONA'} fontFamily={FONT} fontWeight={700} fontSize={42} fill={C.red}/>
        <Txt y={10} text={'サングラス　帽子　酒　反抗'} fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.paper}/>
        <Txt y={115} text={'「もっと本人らしく」'} fontFamily={FONT} fontWeight={700} fontSize={36} fill={C.gold}/>
      </Rect>
      <Node ref={r.person}>{Person({x:0,y:90,shirt:C.teal,scale:0.82,label:'本人'})}</Node>
      {[[-590,-140],[600,-110],[-540,200],[560,190]].map((p,i)=><Circle key={String(i)} ref={r.flash[i]} x={p[0]} y={p[1]} width={80} height={80} fill={C.paper} opacity={0}/>)}
    </Node>);
  } else if(k==='v2_identity_mirror'||k==='v2_self_mirror_story'){
    r.person=createRef<Node>(); r.mirror=createRef<Rect>(); r.tags=beat.labels.slice(0,5).map(()=>createRef<Rect>());
    group.add(<Node y={60}>
      <Rect ref={r.mirror} x={320} width={620} height={510} radius={34} fill={'#17343e'} stroke={C.blue} lineWidth={7}/>
      <Node ref={r.person}>{Person({x:-330,y:50,shirt:C.teal,scale:0.9,label:'私'})}</Node>
      <Node opacity={0.45}>{Person({x:320,y:50,shirt:C.blue,scale:0.9,label:'自己像'})}</Node>
      {r.tags.map((t:any,i:number)=>Tag({ref:t,x:80+(i%2)*480,y:-135+Math.floor(i/2)*120,text:beat.labels[i],stroke:i%2?C.gold:C.red,w:300}))}
    </Node>);
    r.tags.forEach((x:any)=>x().opacity(0));
  } else if(k==='v2_dependency_web'||k==='v2_human_dependency_system'){
    r.person=createRef<Node>(); r.nodes=beat.labels.slice(0,6).map(()=>createRef<Rect>()); r.links=[];
    const pts=[[-600,-120],[-560,190],[-220,280],[220,280],[560,190],[600,-120]];
    group.add(<Node y={45}>
      <Node ref={r.person}>{Person({x:0,y:10,shirt:C.teal,scale:0.82,label:k==='v2_human_dependency_system'?'過去の自分':'自分らしさ'})}</Node>
      {r.nodes.map((n:any,i:number)=>{const l=createRef<Line>();r.links.push(l);return <Node key={String(i)}>
        <Line ref={l} points={[[0,10],[pts[i][0],pts[i][1]]]} stroke={C.red} lineWidth={6} end={0}/>
        {Tag({ref:n,x:pts[i][0],y:pts[i][1],text:beat.labels[i],stroke:i%2?C.gold:C.blue,w:245})}
      </Node>;})}
    </Node>);
    r.nodes.forEach((x:any)=>x().opacity(0));
  } else if(k==='v2_cta_prism'){
    r.beam=createRef<Line>(); r.rays=beat.labels.slice(0,5).map(()=>createRef<Line>()); r.words=beat.labels.slice(0,5).map(()=>createRef<Txt>());
    const ys=[-150,-75,0,75,150];
    group.add(<Node y={55}>
      <Circle x={-600} width={130} height={130} fill={C.paper} opacity={0.12}/>
      <Line ref={r.beam} points={[[ -620,0],[-80,0]]} stroke={C.paper} lineWidth={10} end={0}/>
      <Rect width={160} height={160} rotation={45} fill={'#17323b'} stroke={C.paper} lineWidth={5}/>
      {r.rays.map((l:any,i:number)=><Line key={String(i)} ref={l} points={[[80,0],[620,ys[i]]]} stroke={[C.red,C.gold,C.teal,C.blue,C.paper][i]} lineWidth={6} end={0}/>)}
      {r.words.map((w:any,i:number)=><Txt key={String(i)} ref={w} x={660} y={ys[i]} text={beat.labels[i]} fontFamily={FONT} fontWeight={700} fontSize={26} fill={C.paper} opacity={0}/>)}
    </Node>);
  } else if(k==='v2_crowd_compression'){
    r.people=[0,1,2,3,4].map(()=>createRef<Node>()); r.tags=beat.labels.slice(0,5).map(()=>createRef<Rect>()); r.file=createRef<Rect>();
    group.add(<Node y={55}>
      {r.people.map((p:any,i:number)=><Node key={String(i)} ref={p}>{Person({x:-620+i*260,y:40+(i%2)*45,shirt:[C.teal,C.blue,C.gold,C.red,C.paper][i],scale:0.62,label:''})}</Node>)}
      <Rect ref={r.file} x={480} y={35} width={500} height={430} radius={28} fill={'#162c35'} stroke={C.line} lineWidth={5} opacity={0}>
        <Txt y={-150} text={'他人の記憶'} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.muted}/>
      </Rect>
      {r.tags.map((t:any,i:number)=>Tag({ref:t,x:480,y:-80+i*72,text:beat.labels[i],stroke:i%2?C.gold:C.teal,w:350}))}
    </Node>);
    r.tags.forEach((x:any)=>x().opacity(0));
  } else if(k==='v2_life_scrapbook'){
    r.cards=[0,1,2,3].map(()=>createRef<Rect>()); r.future=createRef<Rect>(); r.line=createRef<Line>();
    group.add(<Node y={65}>
      <Line ref={r.line} points={[[ -650,120],[650,120]]} stroke={C.gold} lineWidth={7} end={0}/>
      {r.cards.map((c:any,i:number)=><Rect key={String(i)} ref={c} x={-540+i*350} y={-40+(i%2)*35} width={280} height={310} radius={22} fill={'#eee9df'} rotation={i%2?3:-3} opacity={0}>
        <Txt y={-95} text={i===0?'過去':i===1?'転機':i===2?'現在':'意味づけ'} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.ink}/>
        <Line points={[[ -90,0],[90,0]]} stroke={'#aaa59e'} lineWidth={5}/>
        <Line points={[[ -90,45],[55,45]]} stroke={'#aaa59e'} lineWidth={5}/>
      </Rect>)}
      <Rect ref={r.future} x={650} y={-20} width={250} height={310} radius={22} fill={'#17323b'} stroke={C.teal} lineWidth={5} opacity={0}>
        <Txt text={'未来？'} fontFamily={FONT} fontWeight={700} fontSize={44} fill={C.teal}/>
      </Rect>
    </Node>);
  } else if(k==='v2_script_rulebook'){
    r.book=createRef<Rect>(); r.rules=beat.labels.slice(0,4).map(()=>createRef<Rect>()); r.folder=createRef<Rect>(); r.lock=createRef<Circle>();
    group.add(<Node y={55}>
      <Rect ref={r.book} x={-250} width={760} height={460} radius={28} fill={'#eee9df'} stroke={C.line} lineWidth={5}>
        <Txt y={-150} text={'「私はこういう人」'} fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.ink}/>
      </Rect>
      {r.rules.map((x:any,i:number)=>Tag({ref:x,x:-250,y:-60+i*85,text:beat.labels[i],stroke:C.red,w:520}))}
      <Rect ref={r.folder} x={500} y={40} width={390} height={250} radius={22} fill={C.red} opacity={0}>
        <Txt text={'追加の仕事'} fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.paper}/>
      </Rect>
      <Circle ref={r.lock} x={0} y={220} width={120} height={120} fill={C.red} opacity={0}>
        <Txt text={'LOCK'} fontFamily={FONT} fontWeight={700} fontSize={24} fill={C.paper}/>
      </Circle>
    </Node>);
    r.rules.forEach((x:any)=>x().opacity(0));
  } else if(k==='v2_office_identity_loop'){
    r.person=createRef<Node>(); r.tasks=[0,1,2,3,4].map(()=>createRef<Rect>()); r.arrow=createRef<Line>(); r.label=createRef<Rect>();
    group.add(<Node y={70}>
      <Rect y={170} width={1300} height={30} radius={10} fill={'#705c4d'}/>
      <Node ref={r.person}>{Person({x:-350,y:50,shirt:C.teal,scale:0.8,label:'真面目な人'})}</Node>
      {r.tasks.map((t:any,i:number)=><Rect key={String(i)} ref={t} x={80+i*125} y={100-i*25} width={110} height={145} radius={12} fill={'#eee9df'} stroke={i>2?C.red:C.line} lineWidth={4} opacity={i<2?1:0}/>)}
      <Line ref={r.arrow} points={[[ -210,-20],[250,-170],[570,-25],[250,245],[-210,100]]} stroke={C.gold} lineWidth={7} end={0} closed/>
      <Rect ref={r.label} x={250} y={-165} width={420} height={84} radius={24} fill={C.surface2} stroke={C.gold} lineWidth={5} opacity={0}>
        <Txt text={'断らない → さらに「真面目」'} fontFamily={FONT} fontWeight={700} fontSize={27} fill={C.paper}/>
      </Rect>
    </Node>);
  } else if(k==='v2_office_label_spread'){
    r.subject=createRef<Node>();r.others=[0,1,2].map(()=>createRef<Node>());r.bubbles=[0,1,2].map(()=>createRef<Rect>());r.folder=createRef<Rect>();
    group.add(<Node y={65}>
      <Node ref={r.subject}>{Person({x:0,y:80,shirt:C.teal,scale:0.8,label:'佐藤'})}</Node>
      {[-560,-330,430].map((x,i)=><Node key={String(i)} ref={r.others[i]}>{Person({x,y:70,shirt:i===2?C.gold:C.blue,scale:0.68,label:''})}</Node>)}
      {['怒らない人','冷静な人','任せても大丈夫'].map((s,i)=>Bubble({ref:r.bubbles[i],x:-440+i*440,y:-140+(i%2)*55,text:s,accent:i===2?C.gold:C.paper,w:330}))}
      <Rect ref={r.folder} x={0} y={230} width={330} height={110} radius={20} fill={C.red} opacity={0}>
        <Txt text={'揉め事の調整'} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.paper}/>
      </Rect>
    </Node>);
    r.bubbles.forEach((x:any)=>x().opacity(0));
  } else if(k==='v2_social_experiment'){
    r.person=createRef<Node>(); r.door=createRef<Line>(); r.a=createRef<Rect>(); r.b=createRef<Rect>(); r.people=[0,1,2].map(()=>createRef<Circle>());
    group.add(<Node y={55}>
      <Rect ref={r.a} x={-430} width={620} height={440} radius={28} fill={'#172a33'} stroke={C.blue} lineWidth={5}>
        <Txt y={-160} text={'ROOM A'} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.blue}/>
        <Txt y={120} text={'「私は社交的です」'} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.paper}/>
      </Rect>
      <Rect ref={r.b} x={430} width={620} height={440} radius={28} fill={'#182f35'} stroke={C.teal} lineWidth={5}>
        <Txt y={-160} text={'ROOM B'} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.teal}/>
      </Rect>
      <Node ref={r.person}>{Person({x:-430,y:30,shirt:C.teal,scale:0.72,label:'被験者'})}</Node>
      <Line ref={r.door} points={[[0,-220],[0,220]]} stroke={C.gold} lineWidth={10}/>
      {r.people.map((p:any,i:number)=><Circle key={String(i)} ref={p} x={320+i*110} y={40+(i%2)*80} width={70} height={70} fill={C.paper} opacity={0}/>)}
    </Node>);
  } else if(k==='v2_creator_feed'){
    r.tiles=[0,1,2,3].map(()=>createRef<Rect>()); r.hero=createRef<Rect>(); r.comments=[0,1,2].map(()=>createRef<Rect>());
    group.add(<Node y={55}>
      {r.tiles.map((t:any,i:number)=><Rect key={String(i)} ref={t} x={-500+(i%2)*360} y={-110+Math.floor(i/2)*210} width={320} height={180} radius={18} fill={i===2?C.red:C.surface2} stroke={i===2?C.gold:C.line} lineWidth={4}>
        <Txt text={['歴史','旅行','会社員の闇','ゲーム'][i]} fontFamily={FONT} fontWeight={700} fontSize={28} fill={C.paper}/>
      </Rect>)}
      <Rect ref={r.hero} x={430} width={620} height={390} radius={26} fill={'#172a33'} stroke={C.red} lineWidth={6} opacity={0}>
        <Txt y={-100} text={'100万回再生'} fontFamily={FONT} fontWeight={700} fontSize={52} fill={C.gold}/>
        <Txt y={30} text={'「この路線が一番いい」'} fontFamily={FONT} fontWeight={700} fontSize={32} fill={C.paper}/>
      </Rect>
      {r.comments.map((x:any,i:number)=>Bubble({ref:x,x:420,y:160+i*75,text:['次もこれ','この路線待ってた','これが強み'][i],w:430}))}
    </Node>);
    r.comments.forEach((x:any)=>x().opacity(0));
  } else if(k==='v2_human_compression'){
    r.rooms=[0,1,2,3].map(()=>createRef<Rect>()); r.file=createRef<Rect>(); r.lines=[];
    const pts=[[-470,-120],[470,-120],[-470,180],[470,180]];
    group.add(<Node y={50}>
      {r.rooms.map((x:any,i:number)=><Rect key={String(i)} ref={x} x={pts[i][0]} y={pts[i][1]} width={460} height={210} radius={24} fill={C.surface2} stroke={[C.gold,C.blue,C.teal,C.red][i]} lineWidth={5}>
        <Txt text={['料理が好き','美術館へ行く','家族と過ごす','仕事をする'][i]} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.paper}/>
      </Rect>)}
      <Rect ref={r.file} width={500} height={330} radius={30} fill={'#eee9df'} stroke={C.red} lineWidth={6} opacity={0} scale={0.4}>
        <Txt y={-65} text={'社会の記憶'} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.ink}/>
        <Txt y={45} text={'「○○の人」'} fontFamily={FONT} fontWeight={700} fontSize={52} fill={C.red}/>
      </Rect>
    </Node>);
  } else if(k==='v2_stage_demand'){
    r.person=createRef<Node>();r.shadow=createRef<Rect>();r.audience=[0,1,2,3,4,5].map(()=>createRef<Circle>());r.demands=[0,1,2].map(()=>createRef<Rect>());
    group.add(<Node y={70}>
      <Rect y={170} width={1200} height={45} radius={15} fill={'#5f4740'}/>
      <Rect ref={r.shadow} y={-10} width={300} height={360} radius={90} fill={'rgba(184,87,84,0.25)'} scale={0.5}/>
      <Node ref={r.person}>{Person({x:0,y:40,shirt:C.red,scale:0.82,label:'本人'})}</Node>
      {r.audience.map((a:any,i:number)=><Circle key={String(i)} ref={a} x={-600+i*240} y={270+(i%2)*40} width={76} height={76} fill={C.paper} opacity={0.55}/>)}
      {['もっと過激に','もっと面白く','もっと本人らしく'].map((s,i)=>Bubble({ref:r.demands[i],x:-450+i*450,y:-170+(i%2)*40,text:s,accent:C.red,w:330}))}
    </Node>);
    r.demands.forEach((x:any)=>x().opacity(0));
  } else if(k==='v2_reliable_office'){
    r.worker=createRef<Node>(); r.folders=[0,1,2,3,4,5].map(()=>createRef<Rect>()); r.senders=[0,1,2].map(()=>createRef<Node>());
    group.add(<Node y={70}>
      <Rect y={170} width={1480} height={30} radius={10} fill={'#705c4d'}/>
      <Node ref={r.worker}>{Person({x:0,y:70,shirt:C.teal,scale:0.78,label:'頼れる人'})}</Node>
      {[-560,-350,460].map((x,i)=><Node key={String(i)} ref={r.senders[i]}>{Person({x,y:60,shirt:i===2?C.gold:C.blue,scale:0.58,label:''})}</Node>)}
      {r.folders.map((f:any,i:number)=><Rect key={String(i)} ref={f} x={-520+(i%3)*520} y={-150+Math.floor(i/3)*115} width={190} height={90} radius={16} fill={i>2?C.red:C.gold} opacity={0}>
        <Txt text={'仕事'} fontFamily={FONT} fontWeight={700} fontSize={26} fill={C.paper}/>
      </Rect>)}
    </Node>);
  } else if(k==='v2_role_expectation_panels'){
    r.panels=[0,1,2,3].map(()=>createRef<Rect>()); r.checks=[0,1,2,3].map(()=>createRef<Txt>());
    const pts=[[-420,-110],[420,-110],[-420,175],[420,175]];
    group.add(<Node y={55}>
      {r.panels.map((p:any,i:number)=><Rect key={String(i)} ref={p} x={pts[i][0]} y={pts[i][1]} width={700} height={230} radius={24} fill={C.surface2} stroke={[C.gold,C.red,C.teal,C.blue][i]} lineWidth={5} opacity={0}>
        <Txt x={-180} text={['面白い人','強い人','優しい人','反抗的な人'][i]} fontFamily={FONT} fontWeight={700} fontSize={31} fill={C.paper}/>
        <Txt ref={r.checks[i]} x={200} text={['今日も笑わせる','今日も弱音を吐かない','今日も断らない','今日も噛みつく'][i]} fontFamily={FONT} fontSize={25} fill={C.muted} opacity={0}/>
      </Rect>)}
    </Node>);
  } else if(k==='v2_audience_cage'){
    r.person=createRef<Node>();r.crowd=[0,1,2,3,4,5].map(()=>createRef<Circle>());r.ropes=[];r.bars=[0,1,2,3].map(()=>createRef<Line>());
    const pts=[[-620,-120],[-600,180],[-280,285],[280,285],[600,180],[620,-120]];
    group.add(<Node y={40}>
      <Node ref={r.person}>{Person({x:0,y:30,shirt:C.teal,scale:0.82,label:'成功した自己像'})}</Node>
      {r.crowd.map((c:any,i:number)=>{const l=createRef<Line>();r.ropes.push(l);return <Node key={String(i)}><Circle ref={c} x={pts[i][0]} y={pts[i][1]} width={80} height={80} fill={C.paper}/><Line ref={l} points={[[pts[i][0],pts[i][1]],[0,20]]} stroke={C.red} lineWidth={5} end={0}/></Node>;})}
      {[-220,-70,70,220].map((x,i)=><Line key={String(i)} ref={r.bars[i]} points={[[x,-220],[x,270]]} stroke={C.red} lineWidth={12} end={0}/>)}
    </Node>);
  } else if(k==='v2_legacy_desktop'){
    r.apps=[0,1,2,3,4].map(()=>createRef<Rect>()); r.kernel=createRef<Rect>(); r.update=createRef<Rect>(); r.links=[];
    const pts=[[-520,-110],[-250,120],[0,-130],[290,120],[540,-90]];
    group.add(<Node y={55}>
      <Rect width={1500} height={520} radius={26} fill={'#0d2028'} stroke={C.line} lineWidth={5}>
        <Rect y={-225} width={1500} height={70} radius={20} fill={'#162d35'}/>
        <Txt x={-600} y={-225} text={'LEGACY OS'} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.red}/>
      </Rect>
      <Rect ref={r.kernel} y={35} width={300} height={140} radius={24} fill={C.red}>
        <Txt text={'旧仕様'} fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.paper}/>
      </Rect>
      {r.apps.map((a:any,i:number)=>{const l=createRef<Line>();r.links.push(l);return <Node key={String(i)}><Line ref={l} points={[[0,35],[pts[i][0],pts[i][1]]]} stroke={C.red} lineWidth={5} end={0}/>{Tag({ref:a,x:pts[i][0],y:pts[i][1],text:beat.labels[i]??['企業システム','昔のソフト','保存データ','周辺機器','ユーザー'][i],stroke:C.line,w:230})}</Node>;})}
      <Rect ref={r.update} x={560} y={220} width={300} height={90} radius={22} fill={C.teal} opacity={0}>
        <Txt text={'UPDATE →'} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.ink}/>
      </Rect>
    </Node>);
    r.apps.forEach((x:any)=>x().opacity(0));
  } else if(k==='v2_compatibility_error'){
    r.progress=createRef<Rect>();r.dialogs=[0,1,2].map(()=>createRef<Rect>());
    group.add(<Node y={50}>
      <Rect width={1250} height={470} radius={28} fill={'#10252e'} stroke={C.teal} lineWidth={5}>
        <Txt y={-150} text={'SELF / SYSTEM UPDATE'} fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.paper}/>
        <Rect y={-50} width={900} height={40} radius={20} fill={'#0b171d'}>
          <Rect ref={r.progress} x={-450} width={1} height={40} radius={20} fill={C.teal} offsetX={-1}/>
        </Rect>
      </Rect>
      {[[-330,80],[120,145],[400,-5]].map((p,i)=><Rect key={String(i)} ref={r.dialogs[i]} x={p[0]} y={p[1]} width={520} height={145} radius={22} fill={'#2b1d20'} stroke={C.red} lineWidth={5} opacity={0}>
        <Txt text={['互換性エラー','旧仕様に依存しています','昔のものは、まだ動くのか？'][i]} width={450} textAlign={'center'} textWrap fontFamily={FONT} fontWeight={700} fontSize={28} fill={C.paper}/>
      </Rect>)}
    </Node>);
  } else if(k==='v2_human_versions'){
    r.person=createRef<Node>();r.line=createRef<Line>();r.years=[0,1,2].map(()=>createRef<Rect>());r.ghost=createRef<Rect>();
    group.add(<Node y={65}>
      <Line ref={r.line} points={[[ -600,170],[600,170]]} stroke={C.gold} lineWidth={8} end={0}/>
      {[[-520,'20歳','会社員にはならない'],[0,'30歳','起業家として成功'],[520,'45歳','静かに暮らしたい']].map((v,i)=><Rect key={String(i)} ref={r.years[i]} x={v[0] as number} y={0} width={390} height={300} radius={26} fill={C.surface2} stroke={i===2?C.teal:(i===0?C.red:C.gold)} lineWidth={5} opacity={0}>
        <Txt y={-85} text={v[1] as string} fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.paper}/>
        <Txt y={35} text={v[2] as string} width={330} textAlign={'center'} textWrap fontFamily={FONT} fontWeight={700} fontSize={28} fill={i===2?C.teal:C.muted}/>
      </Rect>)}
      <Node ref={r.person}>{Person({x:-520,y:165,shirt:C.teal,scale:0.55,label:''})}</Node>
      <Rect ref={r.ghost} x={400} y={-210} width={500} height={90} radius={24} fill={'#2b1d20'} stroke={C.red} lineWidth={4} opacity={0}>
        <Txt text={'「挑戦こそ人生だ」'} fontFamily={FONT} fontWeight={700} fontSize={28} fill={C.paper}/>
      </Rect>
    </Node>);
  } else if(k==='v2_definition_morph'){
    r.left=[0,1,2,3].map(()=>createRef<Rect>());r.right=[0,1,2,3].map(()=>createRef<Rect>());r.lines=[0,1,2,3].map(()=>createRef<Line>());r.term=createRef<Rect>();
    const ys=[-150,-50,50,150];
    group.add(<Node y={45}>
      <Txt x={-520} y={-245} text={'ソフトウェア'} fontFamily={FONT} fontWeight={700} fontSize={32} fill={C.muted}/>
      <Txt x={520} y={-245} text={'人間'} fontFamily={FONT} fontWeight={700} fontSize={32} fill={C.muted}/>
      {ys.map((y,i)=><Node key={String(i)}>
        {Tag({ref:r.left[i],x:-520,y,text:['旧仕様','アプリ','データ','ユーザー'][i],stroke:C.red,w:260})}
        <Line ref={r.lines[i]} points={[[ -365,y],[365,y]]} stroke={C.gold} lineWidth={5} end={0}/>
        {Tag({ref:r.right[i],x:520,y,text:['過去の自己像','仕事','関係','評価'][i],stroke:C.teal,w:280})}
      </Node>)}
      <Rect ref={r.term} y={260} width={760} height={110} radius={28} fill={'#2b1d20'} stroke={C.red} lineWidth={6} opacity={0}>
        <Txt text={'人格の後方互換性'} fontFamily={FONT} fontWeight={700} fontSize={46} fill={C.paper}/>
      </Rect>
    </Node>);
    [...r.left,...r.right].forEach((x:any)=>x().opacity(0));
  } else if(k==='v2_theater_mask'){
    r.stage=createRef<Rect>();r.person=createRef<Node>();r.mask=createRef<Circle>();r.applause=[0,1,2,3].map(()=>createRef<Txt>());r.back=createRef<Rect>();
    group.add(<Node y={55}>
      <Rect ref={r.stage} x={-300} y={30} width={850} height={460} radius={26} fill={'#201c24'} stroke={C.gold} lineWidth={5}>
        <Txt y={-175} text={'STAGE'} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.gold}/>
      </Rect>
      <Node ref={r.person}>{Person({x:-300,y:80,shirt:C.red,scale:0.78,label:'昔の自分'})}</Node>
      <Circle ref={r.mask} x={-300} y={-3} width={90} height={90} fill={C.paper}>
        <Txt text={'☺'} fontFamily={FONT} fontSize={55} fill={C.ink}/>
      </Circle>
      <Rect ref={r.back} x={520} y={40} width={480} height={430} radius={26} fill={'#0c1a20'} stroke={C.line} lineWidth={5} opacity={0}>
        <Txt y={-140} text={'BACKSTAGE'} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.muted}/>
        <Txt y={80} text={'「本当は、もう違う」'} width={380} textAlign={'center'} textWrap fontFamily={FONT} fontWeight={700} fontSize={32} fill={C.paper}/>
      </Rect>
      {['拍手','期待','やっぱりあなた','もっと'].map((s,i)=><Txt key={String(i)} ref={r.applause[i]} x={-650+i*220} y={275+(i%2)*35} text={s} fontFamily={FONT} fontWeight={700} fontSize={25} fill={C.gold} opacity={0}/>)}
    </Node>);
  } else if(k==='v2_change_reactions'){
    r.person=createRef<Node>();r.door=createRef<Rect>();r.people=[0,1,2].map(()=>createRef<Node>());r.bubbles=[0,1,2].map(()=>createRef<Rect>());
    group.add(<Node y={55}>
      <Rect y={170} width={1500} height={40} radius={10} fill={'#41535a'}/>
      <Rect ref={r.door} x={560} y={0} width={300} height={430} radius={20} fill={'#17323b'} stroke={C.teal} lineWidth={6}>
        <Txt text={'次の仕事'} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.teal}/>
      </Rect>
      <Node ref={r.person}>{Person({x:-560,y:75,shirt:C.teal,scale:0.76,label:'本人'})}</Node>
      {[-300,20,320].map((x,i)=><Node key={String(i)} ref={r.people[i]}>{Person({x,y:90,shirt:C.blue,scale:0.55,label:''})}</Node>)}
      {['変わったね','昔の方がよかった','あなたらしくない'].map((s,i)=>Bubble({ref:r.bubbles[i],x:-250+i*330,y:-145+(i%2)*45,text:s,accent:i===2?C.red:C.paper,w:300}))}
    </Node>);
    r.bubbles.forEach((x:any)=>x().opacity(0));
  } else if(k==='v2_echo_room'){
    r.person=createRef<Node>();r.outer=[0,1,2,3].map(()=>createRef<Rect>());r.inner=createRef<Rect>();
    const pts=[[-540,-120],[540,-120],[-500,180],[500,180]];
    group.add(<Node y={55}>
      <Rect width={1500} height={520} radius={28} fill={'#08161c'} stroke={'#22343c'} lineWidth={5}/>
      <Node ref={r.person}>{Person({x:0,y:60,shirt:C.blue,scale:0.8,label:'一人になったあと'})}</Node>
      {['本当にこれでいい？','これは逃げ？','昔の自分なら？','自分を失った？'].map((s,i)=>Bubble({ref:r.outer[i],x:pts[i][0],y:pts[i][1],text:s,accent:C.red,w:330}))}
      <Rect ref={r.inner} x={0} y={-150} width={520} height={95} radius={28} fill={'#2b1d20'} stroke={C.red} lineWidth={5} opacity={0}>
        <Txt text={'他人の声 → 自分の声'} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.paper}/>
      </Rect>
    </Node>);
  } else if(k==='v2_double_trap'){
    r.left=createRef<Rect>();r.right=createRef<Rect>();r.person=createRef<Node>();r.floor=createRef<Rect>();
    group.add(<Node y={55}>
      <Rect ref={r.left} x={-650} width={480} height={520} fill={'#281a1d'} stroke={C.red} lineWidth={6}>
        <Txt text={'昔の自分を守る'} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.paper}/>
      </Rect>
      <Rect ref={r.right} x={650} width={480} height={520} fill={'#162b31'} stroke={C.teal} lineWidth={6}>
        <Txt text={'変わる'} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.paper}/>
      </Rect>
      <Node ref={r.person}>{Person({x:0,y:80,shirt:C.gold,scale:0.82,label:'どちらも苦しい'})}</Node>
      <Rect ref={r.floor} y={275} width={850} height={35} radius={10} fill={C.line}/>
    </Node>);
  } else if(k==='v2_excavate_self'){
    r.person=createRef<Node>();r.layers=[0,1,2,3].map(()=>createRef<Rect>());r.box=createRef<Rect>();
    group.add(<Node y={45}>
      <Rect y={125} width={1500} height={340} radius={30} fill={'#4d4036'} opacity={0.7}/>
      {r.layers.map((l:any,i:number)=><Rect key={String(i)} ref={l} y={-10+i*75} width={1250-i*150} height={58} radius={18} fill={['#3c332c','#51443a','#625246','#756052'][i]} opacity={0}/>)}
      <Node ref={r.person}>{Person({x:-580,y:-70,shirt:C.gold,scale:0.62,label:'探す人'})}</Node>
      <Rect ref={r.box} x={300} y={120} width={420} height={190} radius={24} fill={C.surface2} stroke={C.red} lineWidth={5} opacity={0}>
        <Txt text={'完成品の「本当の自分」？'} width={350} textAlign={'center'} textWrap fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.paper}/>
      </Rect>
    </Node>);
  } else if(k==='v2_age_corridor'){
    r.person=createRef<Node>();r.doors=[0,1,2,3].map(()=>createRef<Rect>());r.path=createRef<Line>();
    group.add(<Node y={55}>
      <Line ref={r.path} points={[[ -650,180],[650,180]]} stroke={C.gold} lineWidth={8} end={0}/>
      {[-540,-180,180,540].map((x,i)=><Rect key={String(i)} ref={r.doors[i]} x={x} y={-20} width={260} height={400} radius={18} fill={C.surface2} stroke={[C.blue,C.teal,C.gold,C.red][i]} lineWidth={5} opacity={0}>
        <Txt y={-135} text={beat.labels[i]??['17歳','25歳','35歳','50歳'][i]} fontFamily={FONT} fontWeight={700} fontSize={36} fill={C.paper}/>
        <Txt y={40} text={['学校','仕事','家族','これから'][i]} fontFamily={FONT} fontSize={26} fill={C.muted}/>
      </Rect>)}
      <Node ref={r.person}>{Person({x:-650,y:180,shirt:C.teal,scale:0.5,label:''})}</Node>
    </Node>);
  } else if(k==='v2_possible_paths'){
    r.person=createRef<Node>();r.paths=[0,1,2].map(()=>createRef<Line>());r.future=[0,1,2].map(()=>createRef<Node>());
    const ends=[[-540,-120],[0,-210],[540,-120]];
    group.add(<Node y={95}>
      <Node ref={r.person}>{Person({x:0,y:130,shirt:C.teal,scale:0.72,label:'現在の自分'})}</Node>
      {ends.map((p,i)=><Node key={String(i)}>
        <Line ref={r.paths[i]} points={[[0,80],[p[0],p[1]]]} stroke={[C.gold,C.teal,C.red][i]} lineWidth={8} end={0}/>
        <Node ref={r.future[i]} opacity={0}>{Person({x:p[0],y:p[1],shirt:[C.gold,C.teal,C.red][i],scale:0.55,label:beat.labels[i]??['なりたい','なりうる','なりたくない'][i]})}</Node>
      </Node>)}
    </Node>);
  } else if(k==='v2_rewrite_and_flex'){
    r.page=createRef<Rect>();r.old=createRef<Txt>();r.new=createRef<Txt>();r.fixed=createRef<Rect>();r.flex=createRef<Line>();r.block=createRef<Rect>();
    group.add(<Node y={55}>
      <Rect ref={r.page} x={-470} width={610} height={430} radius={24} fill={'#eee9df'} rotation={-2}>
        <Txt y={-150} text={'人生の物語'} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.ink}/>
        <Txt ref={r.old} y={-30} text={'「私はずっとこういう人」'} fontFamily={FONT} fontWeight={700} fontSize={28} fill={C.red}/>
        <Txt ref={r.new} y={70} text={'「次の章を書いていい」'} fontFamily={FONT} fontWeight={700} fontSize={28} fill={C.teal} opacity={0}/>
      </Rect>
      <Rect ref={r.fixed} x={350} y={0} width={130} height={360} radius={18} fill={'#d9e3e6'} stroke={C.blue} lineWidth={5}/>
      <Line ref={r.flex} points={[[610,160],[610,40],[570,-70],[620,-170]]} stroke={C.teal} lineWidth={28}/>
      <Rect ref={r.block} x={520} y={-210} width={350} height={90} radius={20} fill={C.red} opacity={0}>
        <Txt text={'アイデンティティ葛藤'} fontFamily={FONT} fontWeight={700} fontSize={25} fill={C.paper}/>
      </Rect>
    </Node>);
  } else if(k==='v2_human_changelog'){
    r.line=createRef<Line>();r.versions=[0,1,2,3].map(()=>createRef<Rect>());r.person=createRef<Node>();
    group.add(<Node y={55}>
      <Line ref={r.line} points={[[ -600,120],[600,120]]} stroke={C.teal} lineWidth={8} end={0}/>
      {[-520,-170,180,530].map((x,i)=><Rect key={String(i)} ref={r.versions[i]} x={x} y={-35+(i%2)*40} width={300} height={270} radius={24} fill={C.surface2} stroke={[C.blue,C.gold,C.red,C.teal][i]} lineWidth={5} opacity={0}>
        <Txt y={-80} text={'v'+(i+1)} fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.paper}/>
        <Txt y={30} text={beat.labels[i]??['真面目','強い','断れる','頼れる'][i]} width={250} textAlign={'center'} textWrap fontFamily={FONT} fontWeight={700} fontSize={27} fill={C.muted}/>
      </Rect>)}
      <Node ref={r.person}>{Person({x:-650,y:190,shirt:C.teal,scale:0.46,label:''})}</Node>
    </Node>);
  } else if(k==='v2_permission_montage'){
    r.panels=[0,1,2].map(()=>createRef<Rect>());r.people=[0,1,2].map(()=>createRef<Node>());r.actions=[0,1,2].map(()=>createRef<Rect>());
    const xs=[-500,0,500];
    group.add(<Node y={55}>
      {xs.map((x,i)=><Rect key={String(i)} ref={r.panels[i]} x={x} width={440} height={470} radius={28} fill={C.surface2} stroke={[C.red,C.blue,C.teal][i]} lineWidth={5} opacity={0}>
        <Node ref={r.people[i]}>{Person({x,y:-20,shirt:[C.red,C.blue,C.teal][i],scale:0.5,label:''})}</Node>
        <Rect ref={r.actions[i]} x={x} y={145} width={330} height={90} radius={20} fill={'#10222a'}>
          <Txt text={['仕事を断る','弱音を吐く','辞めると決める'][i]} fontFamily={FONT} fontWeight={700} fontSize={26} fill={C.paper}/>
        </Rect>
      </Rect>)}
    </Node>);
  } else if(k==='v2_migration_bridge'){
    r.old=createRef<Rect>();r.next=createRef<Rect>();r.bridge=createRef<Line>();r.person=createRef<Node>();r.cables=[0,1,2,3].map(()=>createRef<Line>());r.nodes=[0,1,2,3].map(()=>createRef<Rect>());
    group.add(<Node y={55}>
      <Rect ref={r.old} x={-520} y={80} width={560} height={250} radius={26} fill={'#281a1d'} stroke={C.red} lineWidth={6}>
        <Txt text={'過去との互換性'} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.paper}/>
      </Rect>
      <Rect ref={r.next} x={520} y={80} width={560} height={250} radius={26} fill={'#163038'} stroke={C.teal} lineWidth={6}>
        <Txt text={'次の自分'} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.paper}/>
      </Rect>
      <Line ref={r.bridge} points={[[ -260,100],[260,100]]} stroke={C.gold} lineWidth={18}/>
      <Node ref={r.person}>{Person({x:-460,y:40,shirt:C.teal,scale:0.52,label:''})}</Node>
      {[-170,-55,55,170].map((y,i)=><Node key={String(i)}>
        <Line ref={r.cables[i]} points={[[ -420,50],[ -650,y]]} stroke={C.red} lineWidth={5}/>
        {Tag({ref:r.nodes[i],x:-710,y,text:beat.labels[i]??['昔の発言','昔の友人','昔の期待','顧客'][i],stroke:C.red,w:230})}
      </Node>)}
    </Node>);
  } else if(k==='v2_open_cage'){
    r.person=createRef<Node>();r.bars=[0,1,2,3,4].map(()=>createRef<Line>());r.labels=beat.labels.slice(0,3).map(()=>createRef<Rect>());
    group.add(<Node y={55}>
      <Node ref={r.person}>{Person({x:0,y:70,shirt:C.teal,scale:0.78,label:'更新する自分'})}</Node>
      {[-240,-120,0,120,240].map((x,i)=><Line key={String(i)} ref={r.bars[i]} points={[[x,-220],[x,270]]} stroke={C.red} lineWidth={12}/>)}
      {r.labels.map((x:any,i:number)=>Tag({ref:x,x:-440+i*440,y:270,text:beat.labels[i],stroke:i===2?C.teal:C.red,w:350}))}
    </Node>);
  } else if(k==='v2_kitchen_job'){
    r.person=createRef<Node>();r.paper=createRef<Rect>();r.clock=createRef<Circle>();r.photos=[0,1].map(()=>createRef<Rect>());
    group.add(<Node y={60}>
      <Rect y={170} width={1250} height={34} radius={12} fill={'#6e5a4b'}/>
      <Rect x={560} y={-80} width={220} height={420} radius={20} fill={'#0c1d24'} stroke={C.blue} lineWidth={5}>
        <Txt y={-110} text={'夜'} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.blue}/>
      </Rect>
      <Node ref={r.person}>{Person({x:-300,y:70,shirt:C.blue,scale:0.75,label:'20年勤めた会社員'})}</Node>
      <Rect ref={r.paper} x={180} y={80} width={460} height={300} radius={18} fill={'#eee9df'} rotation={-3}>
        <Txt y={-90} text={'求人票'} fontFamily={FONT} fontWeight={700} fontSize={36} fill={C.ink}/>
        <Txt y={30} text={'今とは違う仕事\\n年収は少し下がる'} fontFamily={FONT} fontSize={27} lineHeight={45} fill={C.ink} textAlign={'center'}/>
      </Rect>
      <Circle ref={r.clock} x={-600} y={-145} width={150} height={150} fill={C.surface2} stroke={C.line} lineWidth={5}>
        <Txt text={'23:40'} fontFamily={FONT} fontWeight={700} fontSize={28} fill={C.paper}/>
      </Circle>
      {[-520,-390].map((x,i)=><Rect key={String(i)} ref={r.photos[i]} x={x} y={220} width={110} height={90} fill={'#ddd6ca'} rotation={i?5:-4} opacity={0}/>)}
    </Node>);
  } else if(k==='v2_office_window'){
    r.a=createRef<Node>();r.b=createRef<Node>();r.bubble=createRef<Rect>();r.window=createRef<Rect>();r.city=[0,1,2,3,4].map(()=>createRef<Rect>());
    group.add(<Node y={55}>
      <Rect ref={r.window} x={420} width={700} height={500} radius={24} fill={'#0a202c'} stroke={C.blue} lineWidth={6}/>
      {r.city.map((x:any,i:number)=><Rect key={String(i)} ref={x} x={180+i*115} y={120-i*35} width={90} height={180+i*55} fill={'#172d38'} opacity={0.8}/>)}
      <Node ref={r.a}>{Person({x:-500,y:100,shirt:C.teal,scale:0.72,label:'本人'})}</Node>
      <Node ref={r.b}>{Person({x:-150,y:100,shirt:C.blue,scale:0.72,label:'同僚'})}</Node>
      {Bubble({ref:r.bubble,x:-220,y:-150,text:'「それ、あなたらしくないね」',accent:C.red,w:560})}
    </Node>);
    r.bubble().opacity(0);
  } else if(k==='v2_story_cage_break'){
    r.book=createRef<Rect>();r.person=createRef<Node>();r.bars=[0,1,2,3].map(()=>createRef<Line>());r.door=createRef<Rect>();
    group.add(<Node y={55}>
      <Rect ref={r.book} x={-430} width={650} height={460} radius={28} fill={'#eee9df'} rotation={-4}>
        <Txt y={-140} text={'昨日までの物語'} fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.ink}/>
        <Txt y={20} text={'「自分ならこうする」'} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.red}/>
      </Rect>
      <Node ref={r.person}>{Person({x:300,y:80,shirt:C.teal,scale:0.72,label:'今日の自分'})}</Node>
      {[-10,100,210,320].map((x,i)=><Line key={String(i)} ref={r.bars[i]} points={[[x,-210],[x,270]]} stroke={C.red} lineWidth={11}/>)}
      <Rect ref={r.door} x={630} y={20} width={260} height={430} radius={18} fill={'#17323b'} stroke={C.teal} lineWidth={6} opacity={0}>
        <Txt text={'次の章'} fontFamily={FONT} fontWeight={700} fontSize={36} fill={C.teal}/>
      </Rect>
    </Node>);
  } else if(k==='v2_final_door'){
    r.person=createRef<Node>();r.door=createRef<Rect>();r.labels=beat.labels.slice(0,3).map(()=>createRef<Rect>());r.light=createRef<Rect>();
    group.add(<Node y={45}>
      <Rect width={1500} height={520} radius={30} fill={'#08151b'}/>
      <Rect ref={r.door} x={420} y={0} width={380} height={500} radius={18} fill={'#102b32'} stroke={C.teal} lineWidth={7}/>
      <Rect ref={r.light} x={450} y={0} width={1} height={470} radius={16} fill={'#ece3c9'} opacity={0.8}/>
      <Node ref={r.person}>{Person({x:-420,y:90,shirt:C.teal,scale:0.76,label:'今の自分'})}</Node>
      {r.labels.map((x:any,i:number)=>Tag({ref:x,x:-500+i*300,y:-170+(i%2)*80,text:beat.labels[i],stroke:i===2?C.teal:C.red,w:300}))}
      <Txt y={285} text={'「自分らしくなくなる自由」'} fontFamily={FONT} fontWeight={700} fontSize={46} fill={C.paper}/>
    </Node>);
  } else {
    r.fallback=createRef<Rect>();
    group.add(<Rect ref={r.fallback} y={20} width={1100} height={420} radius={30} fill={C.surface2} stroke={C.line} lineWidth={5}>
      <Txt text={beat.labels.join('　')} width={950} textAlign={'center'} textWrap fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.paper}/>
    </Rect>);
  }
  return r;
}

function* animate(beat:Beat,r:any,duration:number){
  const t=Math.min(0.65,Math.max(0.28,duration*0.09));
  const q=Math.min(0.22,Math.max(0.10,duration*0.025));
  const k=beat.kind;

  if(k==='v2_derby_press'){
    yield* all(r.journalist().x(-470,t),r.note().opacity(1,t));
    yield* all(...r.horses.map((h:any,i:number)=>h().x(620-i*70,t*3,easeInOutCubic)));
  } else if(k==='v2_gonzo_page'){
    yield* all(r.page().rotation(0,t),r.person().x(260,t*1.5,easeOutCubic));
    yield* sequence(q,...r.scribbles.map((l:any)=>l().end(1,t)));
  } else if(k==='v2_persona_billboard'){
    yield* all(r.bill().opacity(1,t),r.bill().scale(1.05,t*2,easeOutCubic),r.person().scale(0.72,t*2));
    yield* sequence(q,...r.flash.map((f:any)=>f().opacity(0.8,q).to(0,q)));
  } else if(k==='v2_identity_mirror'||k==='v2_self_mirror_story'){
    yield* r.mirror().scale(1.03,t).to(1,t);
    yield* sequence(q,...r.tags.map((x:any)=>x().opacity(1,t)));
  } else if(k==='v2_dependency_web'||k==='v2_human_dependency_system'){
    yield* all(...r.links.map((l:any)=>l().end(1,t*1.7)));
    yield* sequence(q,...r.nodes.map((x:any)=>x().opacity(1,t)));
    yield* r.person().scale(0.72,t).to(0.82,t);
  } else if(k==='v2_cta_prism'){
    yield* r.beam().end(1,t);
    yield* all(...r.rays.map((x:any)=>x().end(1,t*1.4)));
    yield* sequence(q,...r.words.map((x:any)=>x().opacity(1,t)));
  } else if(k==='v2_crowd_compression'){
    yield* all(...r.people.map((x:any,i:number)=>x().x(-650+i*150,t)));
    yield* r.file().opacity(1,t);
    yield* sequence(q,...r.tags.map((x:any)=>x().opacity(1,t)));
  } else if(k==='v2_life_scrapbook'){
    yield* r.line().end(1,t*1.3);
    yield* sequence(q,...r.cards.map((x:any)=>x().opacity(1,t)));
    yield* r.future().opacity(1,t);
  } else if(k==='v2_script_rulebook'){
    yield* sequence(q,...r.rules.map((x:any)=>x().opacity(1,t)));
    yield* all(r.folder().opacity(1,t),r.folder().x(420,t));
    yield* r.lock().opacity(1,t);
  } else if(k==='v2_office_identity_loop'){
    yield* sequence(q,...r.tasks.slice(2).map((x:any)=>x().opacity(1,t)));
    yield* r.arrow().end(1,t*1.5);
    yield* r.label().opacity(1,t);
  } else if(k==='v2_office_label_spread'){
    yield* sequence(q,...r.bubbles.map((x:any)=>x().opacity(1,t)));
    yield* r.folder().opacity(1,t).to(1,t);
  } else if(k==='v2_social_experiment'){
    yield* r.person().x(430,t*2,easeInOutCubic);
    yield* sequence(q,...r.people.map((x:any)=>x().opacity(1,t)));
  } else if(k==='v2_creator_feed'){
    yield* r.hero().opacity(1,t);
    yield* all(r.tiles[0]().opacity(0.35,t),r.tiles[1]().opacity(0.35,t),r.tiles[3]().opacity(0.35,t));
    yield* sequence(q,...r.comments.map((x:any)=>x().opacity(1,t)));
  } else if(k==='v2_human_compression'){
    yield* all(...r.rooms.map((x:any)=>x().scale(0.25,t*1.5)));
    yield* all(...r.rooms.map((x:any)=>x().opacity(0,t)),r.file().opacity(1,t),r.file().scale(1,t));
  } else if(k==='v2_stage_demand'){
    yield* sequence(q,...r.demands.map((x:any)=>x().opacity(1,t)));
    yield* r.shadow().scale(1.8,t*2,easeOutCubic);
    yield* r.person().scale(0.68,t);
  } else if(k==='v2_reliable_office'){
    yield* sequence(q,...r.folders.map((x:any)=>x().opacity(1,t)));
    yield* all(...r.folders.map((x:any,i:number)=>x().position([(-140+(i%3)*110),80-Math.floor(i/3)*45],t*1.2)));
  } else if(k==='v2_role_expectation_panels'){
    yield* sequence(q,...r.panels.map((x:any)=>x().opacity(1,t)));
    yield* sequence(q,...r.checks.map((x:any)=>x().opacity(1,t)));
  } else if(k==='v2_audience_cage'){
    yield* all(...r.ropes.map((x:any)=>x().end(1,t)));
    yield* sequence(q,...r.bars.map((x:any)=>x().end(1,t)));
    yield* r.person().scale(0.7,t);
  } else if(k==='v2_legacy_desktop'){
    yield* all(...r.links.map((x:any)=>x().end(1,t*1.3)));
    yield* sequence(q,...r.apps.map((x:any)=>x().opacity(1,t)));
    yield* r.update().opacity(1,t);
  } else if(k==='v2_compatibility_error'){
    yield* r.progress().width(900,t*2,easeInOutCubic);
    yield* sequence(q,...r.dialogs.map((x:any)=>x().opacity(1,t)));
  } else if(k==='v2_human_versions'){
    yield* r.line().end(1,t*1.2);
    yield* sequence(q,...r.years.map((x:any)=>x().opacity(1,t)));
    yield* r.person().x(520,t*2.4,easeInOutCubic);
    yield* r.ghost().opacity(1,t);
  } else if(k==='v2_definition_morph'){
    yield* sequence(q,...r.left.map((x:any)=>x().opacity(1,t)));
    yield* all(...r.lines.map((x:any)=>x().end(1,t)));
    yield* sequence(q,...r.right.map((x:any)=>x().opacity(1,t)));
    yield* r.term().opacity(1,t);
  } else if(k==='v2_theater_mask'){
    yield* sequence(q,...r.applause.map((x:any)=>x().opacity(1,t)));
    yield* all(r.person().x(500,t*2),r.mask().x(500,t*2),r.back().opacity(1,t*1.5));
    yield* r.mask().opacity(0.15,t);
  } else if(k==='v2_change_reactions'){
    yield* sequence(q,...r.bubbles.map((x:any)=>x().opacity(1,t)));
    yield* r.person().x(500,t*2,easeInOutCubic);
  } else if(k==='v2_echo_room'){
    yield* sequence(q,...r.outer.map((x:any)=>x().scale(1.05,t).to(0.75,t)));
    yield* all(...r.outer.map((x:any)=>x().position([0,-110],t*1.5)));
    yield* all(...r.outer.map((x:any)=>x().opacity(0,t)),r.inner().opacity(1,t));
  } else if(k==='v2_double_trap'){
    yield* all(r.left().x(-300,t*2,easeInOutCubic),r.right().x(300,t*2,easeInOutCubic),r.person().scale(0.68,t*2));
  } else if(k==='v2_excavate_self'){
    yield* sequence(q,...r.layers.map((x:any)=>x().opacity(1,t)));
    yield* r.box().opacity(1,t);
  } else if(k==='v2_age_corridor'){
    yield* r.path().end(1,t);
    yield* sequence(q,...r.doors.map((x:any)=>x().opacity(1,t)));
    yield* r.person().x(540,t*2.7,easeInOutCubic);
  } else if(k==='v2_possible_paths'){
    yield* all(...r.paths.map((x:any)=>x().end(1,t*1.4)));
    yield* sequence(q,...r.future.map((x:any)=>x().opacity(1,t)));
  } else if(k==='v2_rewrite_and_flex'){
    yield* all(r.old().opacity(0,t),r.new().opacity(1,t),r.block().opacity(1,t));
    yield* all(r.fixed().rotation(8,t).to(-8,t).to(0,t),r.flex().rotation(18,t).to(-12,t).to(0,t));
  } else if(k==='v2_human_changelog'){
    yield* r.line().end(1,t);
    yield* sequence(q,...r.versions.map((x:any)=>x().opacity(1,t)));
    yield* r.person().x(530,t*2.5,easeInOutCubic);
  } else if(k==='v2_permission_montage'){
    yield* sequence(q,...r.panels.map((x:any)=>x().opacity(1,t)));
    yield* sequence(q,...r.actions.map((x:any)=>x().scale(1.08,t).to(1,t)));
  } else if(k==='v2_migration_bridge'){
    yield* sequence(q,...r.cables.map((x:any)=>x().opacity(0,t)));
    yield* r.person().x(500,t*2.4,easeInOutCubic);
    yield* all(r.old().opacity(0.35,t),r.next().scale(1.05,t).to(1,t));
  } else if(k==='v2_open_cage'){
    yield* all(r.bars[0]().x(-350,t),r.bars[1]().x(-260,t),r.bars[3]().x(260,t),r.bars[4]().x(350,t));
    yield* r.person().y(-10,t*1.6);
  } else if(k==='v2_kitchen_job'){
    yield* sequence(q,...r.photos.map((x:any)=>x().opacity(1,t)));
    yield* r.paper().rotation(0,t);
    yield* r.person().x(-180,t*1.2);
  } else if(k==='v2_office_window'){
    yield* r.bubble().opacity(1,t);
    yield* waitFor(Math.min(1,duration*0.12));
    yield* r.a().x(180,t*1.7,easeInOutCubic);
    yield* r.bubble().opacity(0.35,t);
  } else if(k==='v2_story_cage_break'){
    yield* r.door().opacity(1,t);
    yield* sequence(q,...r.bars.map((x:any,i:number)=>x().x(i<2?-300:650,t*1.4)));
    yield* r.person().x(620,t*1.8,easeOutCubic);
  } else if(k==='v2_final_door'){
    yield* all(r.light().width(380,t*1.4),r.door().opacity(0.25,t*1.4));
    yield* r.person().x(420,t*2,easeInOutCubic);
    yield* sequence(q,...r.labels.map((x:any)=>x().opacity(0.25,t)));
  } else {
    yield* r.fallback().scale(1.04,t).to(1,t);
  }
  const used=Math.min(duration*0.55,t*5+q*6);
  yield* waitFor(Math.max(0.05,duration-used));
}

function* subtitleFlow(ref:any,text:string,duration:number){
  const chunks=subtitleChunks(text); const total=Math.max(1,chunks.reduce((s,c)=>s+c.length,0));
  for(const chunk of chunks){ref().text(chunk);yield* waitFor(Math.max(0.32,duration*(chunk.length/total)));}
}

export function makeProductionScene(chapter:Chapter,timings:readonly number[]){
  return makeScene2D(function*(view){
    view.fill(C.bg);
    const contentLayer=createRef<Node>();
    const subtitleLayer=createRef<Node>();
    const chapterTitle=createRef<Txt>();
    const subtitle=createRef<Txt>();
    const progress=createRef<Rect>();
    view.add(<>
      <Rect width={1810} height={930} radius={40} fill={C.surface}/>
      <Node ref={contentLayer}/>
      <Txt ref={chapterTitle} x={-760} y={-470} width={1400} textAlign={'left'} text={chapter.title} fontFamily={FONT} fontWeight={700} fontSize={28} fill={C.muted}/>
      <Rect y={503} width={1810} height={16} fill={'#0a1b23'} radius={8}>
        <Rect ref={progress} x={-905} width={1} height={16} fill={C.red} radius={8} offsetX={-1}/>
      </Rect>
      <Node ref={subtitleLayer}>
        <Rect y={425} width={1740} height={132} radius={22} fill={'rgba(0,0,0,0.90)'}>
          <Txt ref={subtitle} width={1580} text={''} textAlign={'center'} textWrap fontFamily={FONT} fontWeight={700} fontSize={38} lineHeight={54} fill={C.paper}/>
        </Rect>
      </Node>
    </>);
    const total=Math.max(1,chapter.beats.length);
    for(let i=0;i<chapter.beats.length;i++){
      const beat=chapter.beats[i]; const duration=Math.max(1.2,Number(timings[i]??7)); const group=createRef<Node>();
      contentLayer().add(<Node ref={group} opacity={0} scale={0.985} y={-18}/>);
      const refs=build(group(),beat);
      yield* all(group().opacity(1,MOTION.beat,easeOutCubic),group().scale(1,MOTION.beat,easeOutCubic));
      const visualDuration=Math.max(0.8,duration-MOTION.exit);
      yield* all(animate(beat,refs,visualDuration),subtitleFlow(subtitle,beat.narration,visualDuration),progress().width(1810*((i+1)/total),visualDuration,easeInOutCubic));
      yield* group().opacity(0,MOTION.exit);
    }
    subtitle().text(''); yield* waitFor(0.2);
  });
}
