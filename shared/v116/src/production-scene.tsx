import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {
  all,
  createRef,
  easeInOutCubic,
  easeOutCubic,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {C, FONT, MOTION} from './theme';

export type Beat = {
  id: string;
  kind: string;
  headline: string;
  labels: string[];
  narration: string;
};

export type Chapter = {
  slug: string;
  title: string;
  beats: Beat[];
};

function subtitleChunks(text: string): string[] {
  const raw = text
    .split(/(?<=[。！？])/)
    .map(x => x.trim())
    .filter(Boolean);
  const out: string[] = [];
  for (const sentence of raw) {
    if (sentence.length <= 42) {
      out.push(sentence);
      continue;
    }
    const parts = sentence.split(/(?<=[、，])/).map(x => x.trim()).filter(Boolean);
    let buf = '';
    for (const part of parts) {
      if ((buf + part).length > 42 && buf) {
        out.push(buf);
        buf = part;
      } else {
        buf += part;
      }
    }
    if (buf) out.push(buf);
  }
  return out.length ? out : [text];
}

function Person({
  ref,
  x,
  y,
  shirt = C.blue,
  scale = 1,
  label = '',
}: {
  ref?: any;
  x: number;
  y: number;
  shirt?: string;
  scale?: number;
  label?: string;
}) {
  return (
    <Node ref={ref} x={x} y={y} scale={scale}>
      <Circle width={74} height={74} y={-82} fill={'#d4b194'} />
      <Rect width={110} height={138} radius={24} fill={shirt} />
      <Line
        points={[[-16, -38], [0, 8], [16, -38]]}
        stroke={C.red}
        lineWidth={11}
        closed
      />
      <Rect width={28} height={94} x={-34} y={112} radius={12} fill={'#35434b'} />
      <Rect width={28} height={94} x={34} y={112} radius={12} fill={'#35434b'} />
      {label ? (
        <Txt
          y={185}
          text={label}
          fontFamily={FONT}
          fontWeight={700}
          fontSize={30}
          fill={C.paper}
        />
      ) : null}
    </Node>
  );
}

function Chip({text, x, y, accent = C.teal, width = 300}: {text:string;x:number;y:number;accent?:string;width?:number}) {
  return (
    <Rect x={x} y={y} width={width} height={76} radius={22} fill={C.surface2} stroke={accent} lineWidth={4}>
      <Txt text={text} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.paper} />
    </Rect>
  );
}

function addGenericVisual(group: Node, beat: Beat) {
  const kind = beat.kind;
  const refs: Record<string, any> = {};

  group.add(
    <Txt
      y={-320}
      text={beat.headline}
      fontFamily={FONT}
      fontWeight={700}
      fontSize={58}
      fill={C.paper}
      width={1540}
      textAlign={'center'}
      textWrap
    />,
  );

  const PERSONA_KINDS=['derby','gonzo','persona','persona_growth','mirror_labels','social_label','creator','role_pressure','mask','inner_voice','night_table','speech'];
  const NETWORK_KINDS=['dependency','software_dependencies','human_dependencies','migration','possible_selves'];
  const SOFTWARE_KINDS=['software','version_conflict','human_version','definition','version_history','breaking_change'];
  const STORY_KINDS=['classify','self_story','rulebook','character_badge','compression','treasure_self','permission','old_story_cage','breakthrough','final','cta'];
  const RESEARCH_KINDS=['research_story','research_social','flexible_self'];
  const DUAL_KINDS=['fork','fork_change','ages','story_rewrite','doublebind'];
  const LOOP_KINDS=['identity_loop','cage','open_cage'];

  if (PERSONA_KINDS.includes(kind)) {
    refs.mode='v116-persona';
    refs.person=createRef<Node>();
    refs.aura=createRef<Circle>();
    refs.tags=beat.labels.slice(0,5).map(()=>createRef<Rect>());
    const pts=[[-520,-120],[500,-110],[-480,170],[480,175],[0,260]];
    group.add(
      <Node y={55}>
        <Circle ref={refs.aura} width={380} height={380} fill={'rgba(184,87,84,0.10)'} stroke={C.red} lineWidth={7} scale={0.55}/>
        <Node ref={refs.person}>{Person({x:0,y:20,shirt:kind==='night_table'?C.blue:C.teal,scale:0.92,label:kind==='persona_growth'?'本人':'自分'})}</Node>
        {refs.tags.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={pts[i][0]} y={pts[i][1]} width={330} height={86} radius={24} fill={C.surface2} stroke={i%2?C.gold:C.red} lineWidth={5} opacity={0} scale={0.78}>
            <Txt text={beat.labels[i]} fontFamily={FONT} fontWeight={700} fontSize={27} fill={C.paper} width={290} textAlign={'center'} textWrap/>
          </Rect>
        ))}
        {kind==='night_table'?<Rect y={245} width={840} height={28} radius={10} fill={'#6f5b4c'}/>:null}
      </Node>,
    );
  } else if (NETWORK_KINDS.includes(kind)) {
    refs.mode='v116-network';
    refs.center=createRef<Node>(); refs.lines=[]; refs.nodes=[];
    const pts=[[-570,-120],[-390,205],[0,275],[390,205],[570,-120], [0,-210]];
    group.add(
      <Node y={55}>
        <Node ref={refs.center}>{Person({x:0,y:25,shirt:C.teal,scale:0.82,label:'現在の自分'})}</Node>
        {beat.labels.slice(0,6).map((label:string,i:number)=>{
          const lr=createRef<Line>(); const nr=createRef<Rect>(); refs.lines.push(lr); refs.nodes.push(nr);
          return <Node key={String(i)}>
            <Line ref={lr} points={[[0,20],[pts[i][0],pts[i][1]]]} stroke={kind==='human_dependencies'||kind==='software_dependencies'?C.red:(i%2?C.gold:C.blue)} lineWidth={6} end={0}/>
            <Rect ref={nr} x={pts[i][0]} y={pts[i][1]} width={250} height={78} radius={22} fill={C.surface2} stroke={kind==='human_dependencies'||kind==='software_dependencies'?C.red:(i%2?C.gold:C.blue)} lineWidth={4} opacity={0}>
              <Txt text={label} fontFamily={FONT} fontWeight={700} fontSize={25} fill={C.paper} width={220} textAlign={'center'} textWrap/>
            </Rect>
          </Node>;
        })}
      </Node>,
    );
  } else if (SOFTWARE_KINDS.includes(kind)) {
    refs.mode='v116-software';
    refs.old=createRef<Rect>(); refs.fresh=createRef<Rect>(); refs.bridge=createRef<Line>(); refs.apps=beat.labels.slice(0,5).map(()=>createRef<Rect>()); refs.error=createRef<Txt>();
    group.add(
      <Node y={50}>
        <Rect ref={refs.old} x={-430} width={560} height={390} radius={28} fill={'#17242c'} stroke={C.red} lineWidth={6}>
          <Rect y={-145} width={560} height={70} radius={[28,28,0,0]} fill={'#2a343a'}/>
          <Circle x={-235} y={-145} width={18} height={18} fill={C.red}/>
          <Circle x={-195} y={-145} width={18} height={18} fill={C.gold}/>
          <Txt y={-35} text={kind==='human_version'?'SELF v1':'LEGACY v1'} fontFamily={FONT} fontWeight={700} fontSize={46} fill={C.paper}/>
          <Txt y={80} text={beat.labels[0]??'旧仕様'} fontFamily={FONT} fontWeight={700} fontSize={29} fill={C.muted} width={460} textAlign={'center'} textWrap/>
        </Rect>
        <Line ref={refs.bridge} points={[[-110,0],[110,0]]} stroke={C.gold} lineWidth={10} end={0}/>
        <Rect ref={refs.fresh} x={430} width={560} height={390} radius={28} fill={'#163039'} stroke={C.teal} lineWidth={6} opacity={0.35}>
          <Rect y={-145} width={560} height={70} radius={[28,28,0,0]} fill={'#24454c'}/>
          <Txt y={-35} text={kind==='human_version'?'SELF v2':'UPDATE v2'} fontFamily={FONT} fontWeight={700} fontSize={46} fill={C.paper}/>
          <Txt y={80} text={beat.labels[1]??'新仕様'} fontFamily={FONT} fontWeight={700} fontSize={29} fill={C.teal} width={460} textAlign={'center'} textWrap/>
        </Rect>
        {refs.apps.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={-500+i*250} y={255} width={220} height={74} radius={18} fill={C.surface2} stroke={i<2?C.red:C.line} lineWidth={4} opacity={0}>
            <Txt text={beat.labels[i]??'依存'} fontFamily={FONT} fontWeight={700} fontSize={23} fill={C.paper} width={190} textAlign={'center'} textWrap/>
          </Rect>
        ))}
        <Txt ref={refs.error} y={170} text={kind==='breaking_change'?'BREAK COMPATIBILITY':'互換性？'} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.red} opacity={0}/>
      </Node>,
    );
  } else if (STORY_KINDS.includes(kind)) {
    refs.mode='v116-story'; refs.book=createRef<Rect>(); refs.pages=beat.labels.slice(0,5).map(()=>createRef<Rect>()); refs.arrow=createRef<Line>();
    group.add(
      <Node y={55}>
        <Rect ref={refs.book} width={820} height={390} radius={30} fill={'#172b35'} stroke={kind==='old_story_cage'?C.red:C.teal} lineWidth={6}>
          <Line points={[[0,-180],[0,180]]} stroke={C.line} lineWidth={4}/>
          <Txt x={-205} y={-75} text={'過去'} fontFamily={FONT} fontWeight={700} fontSize={44} fill={C.muted}/>
          <Txt x={205} y={-75} text={kind==='breakthrough'?'次の章':'現在'} fontFamily={FONT} fontWeight={700} fontSize={44} fill={kind==='breakthrough'?C.gold:C.paper}/>
          <Line ref={refs.arrow} points={[[-220,80],[220,80]]} stroke={kind==='old_story_cage'?C.red:C.gold} lineWidth={8} end={0}/>
        </Rect>
        {refs.pages.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={-520+i*260} y={260} width={235} height={76} radius={18} fill={C.surface2} stroke={i%2?C.gold:C.blue} lineWidth={4} opacity={0}>
            <Txt text={beat.labels[i]} fontFamily={FONT} fontWeight={700} fontSize={22} fill={C.paper} width={205} textAlign={'center'} textWrap/>
          </Rect>
        ))}
      </Node>,
    );
  } else if (RESEARCH_KINDS.includes(kind)) {
    refs.mode='v116-research'; refs.paper=createRef<Rect>(); refs.flow=beat.labels.slice(0,4).map(()=>createRef<Rect>());
    group.add(
      <Node y={55}>
        <Rect ref={refs.paper} x={-430} width={630} height={430} radius={28} fill={'#ede9e0'} rotation={-4}>
          <Txt y={-125} text={beat.labels[0]??'Research'} fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.ink} width={530} textAlign={'center'} textWrap/>
          <Line points={[[-230,-50],[230,-50]]} stroke={'#aaa59e'} lineWidth={5}/>
          <Line points={[[-230,5],[175,5]]} stroke={'#aaa59e'} lineWidth={5}/>
          <Line points={[[-230,60],[215,60]]} stroke={'#aaa59e'} lineWidth={5}/>
        </Rect>
        <Node x={390}>
          {refs.flow.map((r:any,i:number)=>(
            <Rect key={String(i)} ref={r} y={-150+i*105} width={500} height={82} radius={22} fill={C.surface2} stroke={i===refs.flow.length-1?C.gold:C.teal} lineWidth={5} opacity={0}>
              <Txt text={beat.labels[i]??'結果'} fontFamily={FONT} fontWeight={700} fontSize={26} fill={C.paper} width={440} textAlign={'center'} textWrap/>
            </Rect>
          ))}
        </Node>
      </Node>,
    );
  } else if (DUAL_KINDS.includes(kind)) {
    refs.mode='v116-dual'; refs.left=createRef<Rect>(); refs.right=createRef<Rect>(); refs.divider=createRef<Line>();
    group.add(
      <Node y={55}>
        <Rect ref={refs.left} x={-430} width={650} height={430} radius={30} fill={C.surface2} stroke={C.red} lineWidth={6}>
          <Txt y={-85} text={beat.labels[0]??'A'} fontFamily={FONT} fontWeight={700} fontSize={42} fill={C.paper} width={560} textAlign={'center'} textWrap/>
          <Txt y={75} text={kind==='fork'?'守る':kind==='fork_change'?'変わる':kind==='ages'?'過去':'固定'} fontFamily={FONT} fontWeight={700} fontSize={64} fill={C.red}/>
        </Rect>
        <Line ref={refs.divider} points={[[0,-210],[0,210]]} stroke={C.line} lineWidth={5} end={0}/>
        <Rect ref={refs.right} x={430} width={650} height={430} radius={30} fill={C.surface2} stroke={C.teal} lineWidth={6} opacity={0.45}>
          <Txt y={-85} text={beat.labels[1]??'B'} fontFamily={FONT} fontWeight={700} fontSize={42} fill={C.paper} width={560} textAlign={'center'} textWrap/>
          <Txt y={75} text={kind==='ages'?'未来':kind==='story_rewrite'?'更新':'変化'} fontFamily={FONT} fontWeight={700} fontSize={64} fill={C.teal}/>
        </Rect>
      </Node>,
    );
  } else if (LOOP_KINDS.includes(kind)) {
    refs.mode='v116-loop'; refs.nodes=beat.labels.slice(0,5).map(()=>createRef<Rect>()); refs.lines=[];
    const pts=[[0,-185],[470,-25],[285,250],[-285,250],[-470,-25]];
    group.add(
      <Node y={40}>
        {refs.nodes.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={pts[i][0]} y={pts[i][1]} width={300} height={88} radius={22} fill={C.surface2} stroke={kind==='cage'?C.red:C.teal} lineWidth={5} opacity={0.35}>
            <Txt text={beat.labels[i]??['自己像','行動','評価','期待','自己像'][i]} fontFamily={FONT} fontWeight={700} fontSize={24} fill={C.paper} width={260} textAlign={'center'} textWrap/>
          </Rect>
        ))}
        {pts.map((p,i)=>{const to=pts[(i+1)%pts.length]; const lr=createRef<Line>(); refs.lines.push(lr); return <Line key={String(i)} ref={lr} points={[[p[0],p[1]],[to[0],to[1]]]} stroke={kind==='cage'?C.red:C.gold} lineWidth={6} end={0}/>;})}
      </Node>,
    );
  } else if (kind === 'scoreboard') {
    refs.bars = [0,1,2].map(() => createRef<Rect>());
    refs.focus = createRef<Rect>();
    group.add(
      <Node y={80}>
        <Rect ref={refs.focus} x={-440} y={40} width={350} height={420} radius={26} fill={'#122b35'} stroke={C.gold} lineWidth={7} opacity={0.2} />
        {refs.bars.map((r:any,i:number)=>(
          <Node key={String(i)} x={-420+i*420} y={40}>
            <Rect ref={r} y={150} width={170} height={1} radius={20} fill={i===0?C.gold:i===1?C.blue:C.teal} />
            <Txt y={-90} text={beat.labels[i] ?? ['田中','佐々木','平均'][i]} fontFamily={FONT} fontWeight={700} fontSize={34} fill={C.paper}/>
          </Node>
        ))}
      </Node>,
    );
  } else if (kind === 'office' || kind === 'finaloffice') {
    refs.people=[0,1,2].map(()=>createRef<Node>());
    refs.file=createRef<Rect>();
    refs.screen=createRef<Rect>();
    group.add(
      <Node y={100}>
        <Rect ref={refs.screen} x={-10} y={-60} width={1540} height={300} radius={28} fill={kind==='finaloffice'?'#0b1b23':'#17343f'} opacity={0.9} />
        {[-510,-80,350].map((x,i)=>(
          <Node key={String(x)} x={x} y={120}>
            <Rect y={80} width={330} height={24} fill={'#6f5b4c'} radius={8}/>
            <Rect y={8} width={170} height={96} fill={'#19252c'} stroke={C.line} lineWidth={4} radius={10}/>
            <Node ref={refs.people[i]}>{Person({x:0,y:-65,shirt:i===1?C.paper:C.blue,scale:0.82,label:i===1?'田中':''})}</Node>
          </Node>
        ))}
        <Rect ref={refs.file} x={500} y={50} width={230} height={140} fill={C.red} radius={18} opacity={0}/>
      </Node>,
    );
  } else if (kind === 'network') {
    refs.center=createRef<Node>(); refs.lines=[]; refs.nodes=[];
    const pts=[[-560,-70],[-390,240],[0,300],[400,230],[560,-80]];
    group.add(
      <Node y={80}>
        <Node ref={refs.center}>{Person({x:0,y:40,shirt:C.teal,scale:0.95,label:beat.labels[0]??'中心人物'})}</Node>
        {pts.map((p,i)=>{
          const lr=createRef<Line>(); const nr=createRef<Circle>();
          refs.lines.push(lr); refs.nodes.push(nr);
          return <Node key={String(i)}>
            <Line ref={lr} points={[[0,20],[p[0],p[1]]]} stroke={i%2?C.blue:C.gold} lineWidth={6} end={0}/>
            <Circle ref={nr} x={p[0]} y={p[1]} width={96} height={96} fill={C.surface2} stroke={i%2?C.blue:C.gold} lineWidth={5}/>
            <Txt x={p[0]} y={p[1]+86} text={beat.labels[(i+1)%beat.labels.length]??'関係'} fontFamily={FONT} fontWeight={700} fontSize={25} fill={C.muted}/>
          </Node>;
        })}
      </Node>,
    );
  } else if (kind === 'committee') {
    refs.left=createRef<Rect>(); refs.right=createRef<Rect>(); refs.chips=[0,1,2].map(()=>createRef<Rect>());
    group.add(
      <Node y={80}>
        <Rect ref={refs.left} x={-420} width={520} height={420} radius={30} fill={C.surface2} stroke={C.blue} lineWidth={5}>
          <Txt y={-125} text={'田中'} fontFamily={FONT} fontWeight={700} fontSize={58} fill={C.paper}/>
          <Txt y={15} text={beat.labels[0]??'数字は最上位'} fontFamily={FONT} fontWeight={700} fontSize={32} fill={C.blue} width={420} textAlign={'center'} textWrap/>
        </Rect>
        <Rect ref={refs.right} x={420} width={520} height={420} radius={30} fill={C.surface2} stroke={C.gold} lineWidth={5}>
          <Txt y={-125} text={'佐々木'} fontFamily={FONT} fontWeight={700} fontSize={58} fill={C.paper}/>
          <Txt y={15} text={beat.labels[1]??'相談しやすい'} fontFamily={FONT} fontWeight={700} fontSize={32} fill={C.gold} width={420} textAlign={'center'} textWrap/>
        </Rect>
        {refs.chips.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={-250+i*250} y={250} width={230} height={72} radius={20} fill={C.bg} stroke={C.red} lineWidth={4} opacity={0}>
            <Txt text={beat.labels[i]??'評判'} fontFamily={FONT} fontWeight={700} fontSize={25} fill={C.paper}/>
          </Rect>
        ))}
      </Node>,
    );
  } else if (kind === 'choice' || kind === 'split' || kind === 'visibility' || kind === 'perspective') {
    refs.left=createRef<Node>(); refs.right=createRef<Node>(); refs.divider=createRef<Line>();
    group.add(
      <Node y={80}>
        <Line ref={refs.divider} points={[[0,-190],[0,260]]} stroke={C.line} lineWidth={5} end={0}/>
        <Node ref={refs.left} x={-430}>
          {Person({x:0,y:30,shirt:C.blue,scale:0.9,label:beat.labels[0]??'A'})}
          <Rect y={220} width={520} height={90} radius={22} fill={C.surface2}>
            <Txt text={beat.labels[0]??'成果'} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.paper}/>
          </Rect>
        </Node>
        <Node ref={refs.right} x={430}>
          {Person({x:0,y:30,shirt:C.gold,scale:0.9,label:beat.labels[1]??'B'})}
          <Rect y={220} width={520} height={90} radius={22} fill={C.surface2}>
            <Txt text={beat.labels[1]??'印象'} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.paper}/>
          </Rect>
        </Node>
      </Node>,
    );
  } else if (kind === 'equation' || kind === 'finalformula') {
    refs.tokens=beat.labels.slice(0,5).map(()=>createRef<Rect>());
    refs.result=createRef<Rect>();
    group.add(
      <Node y={70}>
        {refs.tokens.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={-600+i*300} y={-40} width={250} height={110} radius={26} fill={C.surface2} stroke={i%2?C.gold:C.teal} lineWidth={5} opacity={0}>
            <Txt text={beat.labels[i]} fontFamily={FONT} fontWeight={700} fontSize={30} fill={C.paper} width={220} textAlign={'center'} textWrap/>
          </Rect>
        ))}
        <Txt y={100} text={kind==='finalformula'?'×':'→'} fontFamily={FONT} fontWeight={700} fontSize={72} fill={C.red}/>
        <Rect ref={refs.result} y={225} width={1180} height={150} radius={30} fill={'#1a2b30'} stroke={C.red} lineWidth={7} opacity={0}>
          <Txt text={kind==='finalformula'?'成果 × 価値へ変換する力 ＝ 評価':'成果データ ＋ 人間の解釈 ＝ 評価'} fontFamily={FONT} fontWeight={700} fontSize={54} fill={C.paper}/>
        </Rect>
      </Node>,
    );
  } else if (kind === 'race') {
    refs.runners=[0,1].map(()=>createRef<Circle>()); refs.finish=createRef<Line>();
    group.add(
      <Node y={85}>
        {[0,1].map(i=>(
          <Node key={String(i)} y={-80+i*190}>
            <Line points={[[-650,0],[650,0]]} stroke={C.line} lineWidth={8}/>
            <Circle ref={refs.runners[i]} x={-610} width={76} height={76} fill={i===0?C.gold:C.blue}/>
            <Txt x={-700} text={beat.labels[i]??(i===0?'A 11秒':'B 12秒')} fontFamily={FONT} fontWeight={700} fontSize={32} fill={C.paper}/>
          </Node>
        ))}
        <Line ref={refs.finish} points={[[520,-180],[520,230]]} stroke={C.red} lineWidth={10} end={0}/>
      </Node>,
    );
  } else if (kind === 'ambiguity') {
    refs.blocks=beat.labels.slice(0,4).map(()=>createRef<Rect>()); refs.q=createRef<Txt>();
    const pos=[[-430,-70],[430,-70],[-430,190],[430,190]];
    group.add(
      <Node y={80}>
        {refs.blocks.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={pos[i][0]} y={pos[i][1]} width={440} height={120} radius={24} fill={C.surface2} stroke={i%2?C.blue:C.teal} lineWidth={5} opacity={0}>
            <Txt text={beat.labels[i]} fontFamily={FONT} fontWeight={700} fontSize={31} fill={C.paper}/>
          </Rect>
        ))}
        <Txt ref={refs.q} text={'?'} fontFamily={FONT} fontWeight={700} fontSize={170} fill={C.red} scale={0.4}/>
      </Node>,
    );
  } else if (kind === 'conflict') {
    refs.left=createRef<Rect>();refs.right=createRef<Rect>();refs.middle=createRef<Rect>();refs.l1=createRef<Line>();refs.l2=createRef<Line>();
    group.add(
      <Node y={80}>
        <Rect ref={refs.left} x={-500} width={430} height={210} radius={30} fill={C.surface2} stroke={C.red} lineWidth={6}>
          <Txt text={beat.labels[0]??'営業'} fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.paper} width={360} textAlign={'center'} textWrap/>
        </Rect>
        <Rect ref={refs.right} x={500} width={430} height={210} radius={30} fill={C.surface2} stroke={C.blue} lineWidth={6}>
          <Txt text={beat.labels[1]??'開発'} fontFamily={FONT} fontWeight={700} fontSize={38} fill={C.paper} width={360} textAlign={'center'} textWrap/>
        </Rect>
        <Line ref={refs.l1} points={[[-280,0],[-70,0]]} stroke={C.gold} lineWidth={9} end={0}/>
        <Line ref={refs.l2} points={[[280,0],[70,0]]} stroke={C.gold} lineWidth={9} end={0}/>
        <Rect ref={refs.middle} width={360} height={170} radius={28} fill={C.gold} opacity={0}>
          <Txt text={beat.labels[2]??'妥協点'} fontFamily={FONT} fontWeight={700} fontSize={35} fill={C.ink} width={310} textAlign={'center'} textWrap/>
        </Rect>
      </Node>,
    );
  } else if (kind === 'research') {
    refs.paper=createRef<Rect>(); refs.bars=[0,1,2].map(()=>createRef<Rect>());
    group.add(
      <Node y={80}>
        <Rect ref={refs.paper} x={-430} width={620} height={420} radius={26} fill={'#ece8df'} rotation={-3}>
          <Txt y={-125} text={beat.labels[0]??'Research'} fontFamily={FONT} fontWeight={700} fontSize={36} fill={C.ink} width={520} textAlign={'center'} textWrap/>
          <Line points={[[-220,-55],[220,-55]]} stroke={'#a4a09a'} lineWidth={6}/>
          <Line points={[[-220,0],[180,0]]} stroke={'#a4a09a'} lineWidth={6}/>
          <Line points={[[-220,55],[210,55]]} stroke={'#a4a09a'} lineWidth={6}/>
        </Rect>
        <Node x={420} y={40}>
          {refs.bars.map((r:any,i:number)=>(
            <Node key={String(i)} x={-190+i*190}>
              <Rect ref={r} y={130} width={105} height={1} radius={16} fill={i===0?C.red:i===1?C.gold:C.teal}/>
              <Txt y={245} text={beat.labels[i+1]??['Sample','Bias','Career'][i]} fontFamily={FONT} fontWeight={700} fontSize={25} fill={C.muted}/>
            </Node>
          ))}
        </Node>
      </Node>,
    );
  } else if (kind === 'halo') {
    refs.center=createRef<Node>(); refs.traits=beat.labels.slice(0,4).map(()=>createRef<Rect>());
    const pos=[[-520,-80],[520,-80],[-420,210],[420,210]];
    group.add(
      <Node y={80}>
        <Node ref={refs.center}>{Person({x:0,y:25,shirt:C.gold,scale:0.9,label:'印象'})}</Node>
        {refs.traits.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={pos[i][0]} y={pos[i][1]} width={390} height={100} radius={24} fill={C.surface2} stroke={i===0?C.gold:C.blue} lineWidth={5} opacity={0} scale={0.75}>
            <Txt text={beat.labels[i]} fontFamily={FONT} fontWeight={700} fontSize={29} fill={C.paper} width={340} textAlign={'center'} textWrap/>
          </Rect>
        ))}
      </Node>,
    );
  } else if (kind === 'forecast') {
    refs.left=createRef<Rect>(); refs.arrow=createRef<Line>(); refs.right=createRef<Rect>();
    group.add(
      <Node y={85}>
        <Rect ref={refs.left} x={-430} width={520} height={360} radius={28} fill={C.surface2} stroke={C.teal} lineWidth={5}>
          <Txt y={-115} text={'過去'} fontFamily={FONT} fontWeight={700} fontSize={45} fill={C.teal}/>
          <Txt y={20} text={beat.labels[0]??'成果'} fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.paper}/>
        </Rect>
        <Line ref={refs.arrow} points={[[-120,0],[120,0]]} stroke={C.gold} lineWidth={10} end={0}/>
        <Rect ref={refs.right} x={430} width={520} height={360} radius={28} fill={'#221f26'} stroke={C.red} lineWidth={5} opacity={0.4}>
          <Txt y={-115} text={'未来'} fontFamily={FONT} fontWeight={700} fontSize={45} fill={C.red}/>
          <Txt y={20} text={beat.labels[1]??'役割予測'} fontFamily={FONT} fontWeight={700} fontSize={40} fill={C.paper}/>
        </Rect>
      </Node>,
    );
  } else if (kind === 'trust' || kind === 'resourceflow') {
    refs.manager=createRef<Node>(); refs.worker=createRef<Node>(); refs.items=beat.labels.slice(0,4).map(()=>createRef<Rect>()); refs.link=createRef<Line>();
    group.add(
      <Node y={85}>
        <Node ref={refs.manager}>{Person({x:-500,y:20,shirt:C.gold,scale:0.85,label:'上司'})}</Node>
        <Node ref={refs.worker}>{Person({x:500,y:20,shirt:C.teal,scale:0.85,label:'部下'})}</Node>
        <Line ref={refs.link} points={[[-350,20],[350,20]]} stroke={C.gold} lineWidth={10} end={0}/>
        {refs.items.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={-260+i*170} y={230} width={155} height={76} radius={18} fill={C.surface2} stroke={i%2?C.blue:C.teal} lineWidth={4} opacity={0}>
            <Txt text={beat.labels[i]} fontFamily={FONT} fontWeight={700} fontSize={22} fill={C.paper} width={135} textAlign={'center'} textWrap/>
          </Rect>
        ))}
      </Node>,
    );
  } else if (kind === 'elevator') {
    refs.car=createRef<Rect>(); refs.p1=createRef<Node>(); refs.p2=createRef<Node>(); refs.floor=createRef<Txt>();
    group.add(
      <Node y={70}>
        <Rect width={760} height={520} radius={30} fill={'#12232b'} stroke={C.line} lineWidth={7}/>
        <Line points={[[0,-250],[0,250]]} stroke={C.line} lineWidth={5}/>
        <Rect ref={refs.car} width={680} height={420} radius={20} fill={C.surface2}>
          <Node ref={refs.p1}>{Person({x:-170,y:35,shirt:C.gold,scale:0.82,label:'役員'})}</Node>
          <Node ref={refs.p2}>{Person({x:170,y:35,shirt:C.teal,scale:0.82,label:'佐々木'})}</Node>
        </Rect>
        <Txt ref={refs.floor} x={520} text={'12F'} fontFamily={FONT} fontWeight={700} fontSize={80} fill={C.gold}/>
      </Node>,
    );
  } else if (kind === 'market') {
    refs.items=beat.labels.slice(0,6).map(()=>createRef<Rect>()); refs.center=createRef<Node>();
    const pos=[[-560,-130],[-200,-180],[200,-180],[560,-130],[-350,190],[350,190]];
    group.add(
      <Node y={80}>
        <Node ref={refs.center}>{Person({x:0,y:50,shirt:C.paper,scale:0.8,label:'社内'})}</Node>
        {refs.items.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={pos[i][0]} y={pos[i][1]} width={290} height={86} radius={20} fill={C.surface2} stroke={i%2?C.gold:C.blue} lineWidth={4} opacity={0}>
            <Txt text={beat.labels[i]} fontFamily={FONT} fontWeight={700} fontSize={27} fill={C.paper}/>
          </Rect>
        ))}
      </Node>,
    );
  } else if (kind === 'ingratiation') {
    refs.person=createRef<Node>(); refs.boss=createRef<Node>(); refs.bubbles=beat.labels.slice(0,3).map(()=>createRef<Rect>());
    group.add(
      <Node y={80}>
        <Node ref={refs.person}>{Person({x:-430,y:60,shirt:C.teal,scale:0.86,label:'社員'})}</Node>
        <Node ref={refs.boss}>{Person({x:430,y:60,shirt:C.gold,scale:0.86,label:'上司'})}</Node>
        {refs.bubbles.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={-140+i*140} y={-70+i*45} width={330} height={88} radius={34} fill={'#f2eee6'} opacity={0}>
            <Txt text={beat.labels[i]} fontFamily={FONT} fontWeight={700} fontSize={27} fill={C.ink}/>
          </Rect>
        ))}
      </Node>,
    );
  } else if (kind === 'ladder') {
    refs.steps=[0,1,2].map(()=>createRef<Rect>()); refs.person=createRef<Node>();
    group.add(
      <Node y={110}>
        {refs.steps.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={-410+i*410} y={170-i*110} width={380} height={120+i*80} radius={18} fill={i===0?C.surface2:i===1?'#21404b':'#2b4d55'} opacity={0.45}>
            <Txt y={-(40+i*30)} text={beat.labels[i]??String(i+1)+'年目'} fontFamily={FONT} fontWeight={700} fontSize={29} fill={C.paper} width={330} textAlign={'center'} textWrap/>
          </Rect>
        ))}
        <Node ref={refs.person}>{Person({x:-510,y:80,shirt:C.teal,scale:0.7,label:''})}</Node>
      </Node>,
    );
  } else if (kind === 'loop' || kind === 'loop_reverse') {
    refs.nodes=beat.labels.slice(0,5).map(()=>createRef<Rect>()); refs.lines=[];
    const pts=[[0,-190],[470,-40],[290,250],[-290,250],[-470,-40]];
    group.add(
      <Node y={70}>
        {refs.nodes.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={pts[i][0]} y={pts[i][1]} width={300} height={90} radius={24} fill={C.surface2} stroke={kind==='loop'?C.teal:C.red} lineWidth={5} opacity={0.45}>
            <Txt text={beat.labels[i]} fontFamily={FONT} fontWeight={700} fontSize={27} fill={C.paper}/>
          </Rect>
        ))}
        {pts.map((p,i)=>{
          const to=pts[(i+1)%pts.length]; const lr=createRef<Line>(); refs.lines.push(lr);
          return <Line key={String(i)} ref={lr} points={[[p[0],p[1]],[to[0],to[1]]]} stroke={kind==='loop'?C.gold:C.red} lineWidth={6} end={0} opacity={0.7}/>;
        })}
      </Node>,
    );
  } else if (kind === 'test') {
    refs.cards=beat.labels.slice(0,5).map(()=>createRef<Rect>()); refs.smile=createRef<Circle>();
    group.add(
      <Node y={80}>
        <Circle ref={refs.smile} x={-570} width={190} height={190} fill={C.gold}>
          <Txt text={'☺'} fontFamily={FONT} fontWeight={700} fontSize={100} fill={C.ink}/>
        </Circle>
        {refs.cards.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={-250+(i%3)*330} y={-90+Math.floor(i/3)*180} width={290} height={120} radius={24} fill={C.surface2} stroke={i%2?C.blue:C.teal} lineWidth={5} opacity={0}>
            <Txt text={beat.labels[i]} fontFamily={FONT} fontWeight={700} fontSize={29} fill={C.paper}/>
          </Rect>
        ))}
      </Node>,
    );
  } else if (kind === 'manager') {
    refs.seller=createRef<Node>(); refs.arrow=createRef<Line>(); refs.manager=createRef<Node>(); refs.tasks=beat.labels.slice(0,5).map(()=>createRef<Rect>());
    group.add(
      <Node y={80}>
        <Node ref={refs.seller} x={-520}>{Person({x:0,y:20,shirt:C.teal,scale:0.82,label:'トップ営業'})}</Node>
        <Line ref={refs.arrow} points={[[-310,0],[250,0]]} stroke={C.gold} lineWidth={10} end={0}/>
        <Node ref={refs.manager} x={390}>{Person({x:0,y:20,shirt:C.gold,scale:0.82,label:'課長'})}</Node>
        {refs.tasks.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={120+(i%3)*260} y={-160+Math.floor(i/3)*330} width={225} height={82} radius={20} fill={C.surface2} stroke={C.red} lineWidth={4} opacity={0}>
            <Txt text={beat.labels[i]} fontFamily={FONT} fontWeight={700} fontSize={25} fill={C.paper}/>
          </Rect>
        ))}
      </Node>,
    );
  } else if (kind === 'twojobs') {
    refs.left=createRef<Rect>(); refs.right=createRef<Rect>(); refs.merge=createRef<Line>();
    group.add(
      <Node y={80}>
        <Rect ref={refs.left} x={-430} width={600} height={360} radius={30} fill={C.surface2} stroke={C.teal} lineWidth={6}>
          <Txt y={-80} text={'仕事①'} fontFamily={FONT} fontWeight={700} fontSize={36} fill={C.teal}/>
          <Txt y={40} text={beat.labels[0]??'価値を作る'} fontFamily={FONT} fontWeight={700} fontSize={48} fill={C.paper}/>
        </Rect>
        <Rect ref={refs.right} x={430} width={600} height={360} radius={30} fill={C.surface2} stroke={C.gold} lineWidth={6}>
          <Txt y={-80} text={'仕事②'} fontFamily={FONT} fontWeight={700} fontSize={36} fill={C.gold}/>
          <Txt y={40} text={beat.labels[1]??'価値を理解させる'} fontFamily={FONT} fontWeight={700} fontSize={44} fill={C.paper} width={520} textAlign={'center'} textWrap/>
        </Rect>
        <Line ref={refs.merge} points={[[-100,250],[100,250]]} stroke={C.red} lineWidth={10} end={0}/>
      </Node>,
    );
  } else {
    refs.cards=beat.labels.slice(0,6).map(()=>createRef<Rect>());
    group.add(
      <Node y={80}>
        {refs.cards.map((r:any,i:number)=>(
          <Rect key={String(i)} ref={r} x={-500+(i%3)*500} y={-100+Math.floor(i/3)*220} width={420} height={140} radius={26} fill={C.surface2} stroke={i%2?C.gold:C.teal} lineWidth={5} opacity={0}>
            <Txt text={beat.labels[i]} fontFamily={FONT} fontWeight={700} fontSize={31} fill={C.paper} width={360} textAlign={'center'} textWrap/>
          </Rect>
        ))}
      </Node>,
    );
  }

  return refs;
}

function* animateVisual(kind: string, refs: Record<string, any>, duration: number) {
  const t = Math.max(0.18, Math.min(MOTION.beat, duration * 0.08));
  const q = Math.max(0.14, Math.min(MOTION.fast, duration * 0.05));

  if (refs.mode==='v116-persona') {
    yield* all(refs.aura().scale(kind==='persona_growth'?1.55:1.15,t*2,easeOutCubic),refs.person().scale(kind==='persona_growth'?0.84:1.06,t).to(1,t));
    yield* sequence(q,...refs.tags.map((r:any)=>all(r().opacity(1,t),r().scale(1,t))));
  } else if (refs.mode==='v116-network') {
    yield* all(...refs.lines.map((r:any)=>r().end(1,t*2,easeInOutCubic)));
    yield* sequence(q,...refs.nodes.map((r:any)=>r().opacity(1,t)));
  } else if (refs.mode==='v116-software') {
    yield* refs.bridge().end(1,t*1.5);
    yield* all(refs.fresh().opacity(1,t*1.4),refs.fresh().scale(1.03,t).to(1,t));
    yield* sequence(q,...refs.apps.map((r:any)=>r().opacity(1,t)));
    yield* refs.error().opacity(1,t);
    if(kind==='breaking_change') yield* refs.bridge().stroke(C.red,t);
  } else if (refs.mode==='v116-story') {
    yield* refs.arrow().end(1,t*1.5);
    yield* sequence(q,...refs.pages.map((r:any)=>r().opacity(1,t)));
    if(kind==='old_story_cage') yield* refs.book().stroke(C.red,t);
  } else if (refs.mode==='v116-research') {
    yield* refs.paper().rotation(0,t);
    yield* sequence(q,...refs.flow.map((r:any)=>r().opacity(1,t)));
  } else if (refs.mode==='v116-dual') {
    yield* refs.divider().end(1,t);
    yield* all(refs.left().x(-460,t,easeOutCubic),refs.right().x(460,t,easeOutCubic),refs.right().opacity(1,t));
  } else if (refs.mode==='v116-loop') {
    yield* sequence(q,...refs.nodes.map((r:any)=>r().opacity(1,t)));
    yield* sequence(q,...refs.lines.map((r:any)=>r().end(1,t)));
  } else if (kind === 'scoreboard') {
    yield* all(
      refs.bars[0]().height(360,t*2,easeOutCubic),
      refs.bars[1]().height(230,t*2,easeOutCubic),
      refs.bars[2]().height(170,t*2,easeOutCubic),
      refs.focus().opacity(0.9,t),
    );
  } else if (kind === 'office' || kind === 'finaloffice') {
    if (kind === 'office') {
      yield* sequence(q, refs.people[0]().x(-190,t), refs.people[2]().x(190,t));
      yield* all(refs.file().opacity(1,t), refs.file().x(360,t,easeOutCubic));
    } else {
      yield* all(refs.screen().opacity(0.25,t*2), refs.people[0]().opacity(0.15,t), refs.people[2]().opacity(0.15,t));
    }
  } else if (kind === 'network') {
    yield* all(...refs.lines.map((r:any)=>r().end(1,t*2,easeInOutCubic)));
    yield* sequence(q,...refs.nodes.map((r:any)=>r().scale(1.18,t).to(1,t)));
  } else if (kind === 'committee') {
    yield* all(refs.left().y(-20,t), refs.right().y(20,t));
    yield* sequence(q,...refs.chips.map((r:any)=>r().opacity(1,t)));
    yield* refs.right().stroke(C.gold,t);
  } else if (['choice','split','visibility','perspective'].includes(kind)) {
    yield* refs.divider().end(1,t);
    yield* all(refs.left().x(-470,t,easeOutCubic), refs.right().x(470,t,easeOutCubic));
    yield* refs.right().scale(1.06,t).to(1,t);
  } else if (kind === 'equation' || kind === 'finalformula') {
    yield* sequence(q,...refs.tokens.map((r:any)=>r().opacity(1,t).to(0.92,q)));
    yield* all(refs.result().opacity(1,t), refs.result().scale(1.03,t).to(1,t));
  } else if (kind === 'race') {
    yield* refs.finish().end(1,t);
    yield* all(refs.runners[0]().x(540,t*2,easeOutCubic), refs.runners[1]().x(450,t*2.2,easeOutCubic));
  } else if (kind === 'ambiguity') {
    yield* sequence(q,...refs.blocks.map((r:any)=>r().opacity(1,t)));
    yield* refs.q().scale(1,t,easeOutCubic);
  } else if (kind === 'conflict') {
    yield* all(refs.left().x(-420,t),refs.right().x(420,t));
    yield* all(refs.l1().end(1,t),refs.l2().end(1,t));
    yield* all(refs.middle().opacity(1,t),refs.middle().scale(1.06,t).to(1,t));
  } else if (kind === 'research') {
    yield* refs.paper().rotation(0,t);
    yield* all(
      refs.bars[0]().height(210,t*2),
      refs.bars[1]().height(310,t*2),
      refs.bars[2]().height(250,t*2),
    );
  } else if (kind === 'halo') {
    yield* refs.center().scale(1.1,t).to(1,t);
    yield* sequence(q,...refs.traits.map((r:any)=>all(r().opacity(1,t),r().scale(1,t))));
  } else if (kind === 'forecast') {
    yield* refs.arrow().end(1,t*1.5);
    yield* all(refs.left().scale(0.98,t),refs.right().opacity(1,t*1.5));
  } else if (kind === 'trust' || kind === 'resourceflow') {
    yield* refs.link().end(1,t*1.5);
    yield* sequence(q,...refs.items.map((r:any)=>r().opacity(1,t)));
    yield* refs.worker().scale(1.08,t).to(1,t);
  } else if (kind === 'elevator') {
    yield* refs.car().y(-80,t*2,easeInOutCubic);
    refs.floor().text('18F');
    yield* refs.floor().fill(C.red,t);
  } else if (kind === 'market') {
    yield* sequence(q,...refs.items.map((r:any)=>r().opacity(1,t)));
    yield* refs.center().scale(1.08,t).to(1,t);
  } else if (kind === 'ingratiation') {
    yield* sequence(q,...refs.bubbles.map((r:any)=>r().opacity(1,t)));
    yield* refs.boss().scale(1.06,t).to(1,t);
  } else if (kind === 'ladder') {
    yield* sequence(q,...refs.steps.map((r:any)=>r().opacity(1,t)));
    yield* refs.person().x(-100,t*1.2,easeOutCubic);
    yield* refs.person().x(310,t*1.2,easeOutCubic);
  } else if (kind === 'loop' || kind === 'loop_reverse') {
    yield* sequence(q,...refs.nodes.map((r:any)=>r().opacity(1,t)));
    yield* sequence(q,...refs.lines.map((r:any)=>r().end(1,t)));
  } else if (kind === 'test') {
    yield* sequence(q,...refs.cards.map((r:any)=>r().opacity(1,t)));
    yield* refs.smile().opacity(0.18,t*1.5);
  } else if (kind === 'manager') {
    yield* refs.arrow().end(1,t*1.5);
    yield* refs.seller().opacity(0.35,t);
    yield* sequence(q,...refs.tasks.map((r:any)=>r().opacity(1,t)));
  } else if (kind === 'twojobs') {
    yield* all(refs.left().scale(1.03,t).to(1,t),refs.right().scale(1.03,t).to(1,t));
    yield* refs.merge().end(1,t);
  } else if (refs.cards) {
    yield* sequence(q,...refs.cards.map((r:any)=>r().opacity(1,t)));
  }

  const used = Math.min(duration * 0.45, t * 5 + q * 4);
  yield* waitFor(Math.max(0.05, duration - used));
}

function* subtitleFlow(ref: any, text: string, duration: number) {
  const chunks = subtitleChunks(text);
  const totalChars = Math.max(1, chunks.reduce((s,c)=>s+c.length,0));
  for (const chunk of chunks) {
    ref().text(chunk);
    const share = Math.max(0.35, duration * (chunk.length / totalChars));
    yield* waitFor(share);
  }
}

export function makeProductionScene(chapter: Chapter, timings: readonly number[]) {
  return makeScene2D(function* (view) {
    view.fill(C.bg);

    const contentLayer = createRef<Node>();
    const subtitleLayer = createRef<Node>();
    const chapterTitle = createRef<Txt>();
    const subtitle = createRef<Txt>();
    const progress = createRef<Rect>();

    view.add(
      <>
        <Rect width={1810} height={930} radius={40} fill={C.surface} />

        {/* All semantic visuals live here. Nothing in this layer may render above subtitles. */}
        <Node ref={contentLayer} />

        {/* Persistent UI is drawn after content. */}
        <Txt
          ref={chapterTitle}
          x={-760}
          y={-470}
          width={1400}
          textAlign={'left'}
          text={chapter.title}
          fontFamily={FONT}
          fontWeight={700}
          fontSize={30}
          fill={C.muted}
        />
        <Rect x={0} y={503} width={1810} height={16} fill={'#0a1b23'} radius={8}>
          <Rect ref={progress} x={-905} width={1} height={16} fill={C.red} radius={8} offsetX={-1}/>
        </Rect>

        {/* Subtitle UI is ALWAYS the final/topmost layer. */}
        <Node ref={subtitleLayer}>
          <Rect
            y={425}
            width={1740}
            height={132}
            radius={22}
            fill={'rgba(0,0,0,0.90)'}
          >
            <Txt
              ref={subtitle}
              width={1580}
              text={''}
              textAlign={'center'}
              textWrap
              fontFamily={FONT}
              fontWeight={700}
              fontSize={38}
              lineHeight={54}
              fill={C.paper}
            />
          </Rect>
        </Node>
      </>,
    );

    const total = Math.max(1, chapter.beats.length);
    for (let i=0;i<chapter.beats.length;i++) {
      const beat = chapter.beats[i];
      const duration = Math.max(1.2, Number(timings[i] ?? 6));
      const group = createRef<Node>();

      contentLayer().add(<Node ref={group} opacity={0} scale={0.985} y={-20}/>);
      const refs = addGenericVisual(group(), beat);

      yield* all(
        group().opacity(1,MOTION.beat,easeOutCubic),
        group().scale(1,MOTION.beat,easeOutCubic),
      );

      const visualDuration = Math.max(0.8, duration - MOTION.exit);
      yield* all(
        animateVisual(beat.kind, refs, visualDuration),
        subtitleFlow(subtitle, beat.narration, visualDuration),
        progress().width(1810*((i+1)/total), visualDuration, easeInOutCubic),
      );

      yield* group().opacity(0,MOTION.exit);
    }

    subtitle().text('');
    yield* waitFor(0.2);
  });
}
