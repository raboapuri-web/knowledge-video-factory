import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';

/** One-off, claim-specific explanatory SVGs. No timed insertion, reused Venn,
 * generic flow template, fictional percentages or implied causal effects. */
const WHITE='#e8edeb',MUTED='#a6bec3',TEAL='#84c7c4',GOLD='#e4c88b',RED='#cf8d92',BG='#0c1624';
const text=(x:number,y:number,s:string,size=48,color=WHITE,anchor:'middle'|'start'='middle')=>
 <text x={x} y={y} fill={color} fontSize={size} fontWeight={700}
  textAnchor={anchor} dominantBaseline='middle' fontFamily='Noto Sans JP,sans-serif'>{s}</text>;
const line=(x1:number,y1:number,x2:number,y2:number,c=TEAL,w=5,dash=false)=>
 <path d={'M'+x1+' '+y1+' L'+x2+' '+y2} stroke={c} strokeWidth={w}
  strokeDasharray={dash?'13 14':undefined} fill='none' strokeLinecap='round'/>;
const dot=(x:number,y:number,r=25,c=TEAL)=><circle cx={x} cy={y} r={r} fill={c}/>;
const human=(x:number,y:number,s=1,c=TEAL)=><g transform={'translate('+x+' '+y+') scale('+s+')'} fill={c}>
 <circle cx={0} cy={-40} r={19}/><path d='M-32 -9 Q0 -30 32 -9 L38 61 H-38Z'/></g>;
const box=(x:number,y:number,w:number,h:number,c=TEAL)=>
 <rect x={x} y={y} width={w} height={h} rx={26} fill='#192a39'
 stroke={c} strokeWidth={4}/>;
const shelter=(x:number,y:number,s=1,c=TEAL)=>
 <g transform={'translate('+x+' '+y+') scale('+s+')'} fill='none' stroke={c} strokeWidth={7}
 strokeLinejoin='round' strokeLinecap='round'>
 <path d='M-93 -20 L0 -105 L93 -20 M-70 -20 V91 H70 V-20'/>
 <path d='M-22 90 V8 H28 V90 M-70 -18 H70'/></g>;
const moon=(x:number,y:number,s=1)=><g transform={'translate('+x+' '+y+') scale('+s+')'}>
 <circle r={43} fill={GOLD}/><circle cx={21} cy={-16} r={43} fill={BG}/></g>;
const small=(x:number,y:number,s:string)=>text(x,y,s,32,MUTED);
const Scene=({id,p}:{id:string;p:number})=>{
 const grow=(cut=0)=>Math.min(1,Math.max(.08,(p-cut)*2.7));
 if(id==='DG_SHARED_NIGHT')return <g>{moon(950,235,1.6)}
  {line(390,707,1530,707,GOLD,5)}
  {Array.from({length:5},(_,i)=><g key={i} opacity={grow(i*.1)}>
   {human(440+i*255,600,i===2?1.35:1.13,i===2?GOLD:TEAL)}</g>)}
  {small(960,825,'それぞれの事情を説明しなくても、一緒に過ごせる夜')}
 </g>;
 if(id==='DG_DOUBLE_EDGED')return <g>
  {human(960,355,1.48,GOLD)}{text(960,488,'仲間とのつながり',54)}
  {line(900,575,535,698,TEAL,8)}{line(1020,575,1380,698,RED,8)}
  {box(175,683,680,190,TEAL)}{box(1080,683,665,190,RED)}
  {human(310,764,.65,TEAL)}{text(565,765,'助け合い',56)}
  {shelter(1222,790,.55,RED)}{text(1510,765,'離れにくさ',52)}
  {small(960,977,'同じ関係に、二つの異なる側面')}
 </g>;
 if(id==='DG_STUDY_138')return <g>
  {text(960,173,'調査参加者',58,MUTED)}
  {text(960,266,'138人',102,GOLD)}
  {Array.from({length:138},(_,i)=>{const col=i%23,row=Math.floor(i/23);
   return <g key={i} opacity={i/138<=p?1:.21}>
    {human(252+col*62,401+row*82,.39,i%3===0?GOLD:TEAL)}</g>})}
  {small(960,940,'調査対象者数｜割合・内訳を示す図ではない')}
 </g>;
 if(id==='DG_SIX_MONTHS')return <g>
  {box(245,300,540,440,TEAL)}{box(1130,300,540,440,GOLD)}
  {[365,1249].map((x,i)=><g key={x}>
    <rect x={x} y={400} width={300} height={225} fill='none' stroke={i?GOLD:TEAL} strokeWidth={10} rx={13}/>
    <path d={'M'+x+' 460 H'+(x+300)} stroke={i?GOLD:TEAL} strokeWidth={9}/>
    {Array.from({length:12},(_,j)=>dot(x+41+(j%4)*72,495+Math.floor(j/4)*54,9,i?GOLD:TEAL))}
   </g>)}
  {text(512,660,'初回調査',47)}{text(1397,660,'追跡調査',47)}
  {line(804,518,1105,518,WHITE,7)}{text(953,447,'6か月後',48,GOLD)}
  {small(960,850,'二時点の調査｜途中の推移を測定したグラフではない')}
 </g>;
 if(id==='DG_ASSOCIATION')return <g>
   {box(205,254,720,515,TEAL)}{box(996,254,720,515,GOLD)}
   {text(563,350,'周囲に施設利用者がいる',42,TEAL)}
   {text(1357,350,'周囲に利用者がいない',41,GOLD)}
   {human(460,515,1.12,TEAL)}{human(655,515,1.12,TEAL)}
   {human(1250,515,1.12,GOLD)}{human(1450,515,1.12,MUTED)}
   {line(460,610,655,610,TEAL,6)}{line(1250,610,1450,610,MUTED,4,true)}
   {text(960,850,'本人の施設利用に関連',57,WHITE)}
   {small(960,926,'比較図は定性的表現。調査の利用割合を推定したものではない')}
 </g>;
 if(id==='DG_ODDS_59')return <g>
   {text(960,232,'周囲の施設利用者の有無と本人の施設利用',40,MUTED)}
   {text(960,380,'オッズ比',64,TEAL)}
   {text(960,563,'約 5.9 倍',156,GOLD)}
   {line(395,684,1525,684,GOLD,5)}
   {text(960,782,'観察された関連',49,WHITE)}
   {small(960,901,'利用確率が5.9倍という意味ではない・因果関係を示さない')}
 </g>;
 if(id==='DG_USAGE_CLUSTER')return <g>
   {[[470,440],[950,420],[1420,480]].map(([x,y],k)=><g key={x}>
    <circle cx={x} cy={y} r={199} fill='#192d3a' stroke={k===1?GOLD:TEAL} strokeWidth={4}/>
    {Array.from({length:6},(_,i)=>{const theta=2*Math.PI*i/6;
      const px=x+Math.cos(theta)*124,py=y+Math.sin(theta)*117,c=k===1?(i<4?GOLD:MUTED):i<2?TEAL:MUTED;
      return <g key={i}>{i>0&&line(x,y,px,py,c,3,true)}{dot(px,py,21,c)}</g>})}
    {dot(x,y,29,k===1?GOLD:TEAL)}</g>)}
   {text(960,790,'施設利用者が交友関係のなかでまとまる',47)}
   {small(960,870,'線は観察されたつながり。行動が伝染したという因果の矢印ではない')}
 </g>;
 if(id==='DG_SAME_BUILDING')return <g>
   {shelter(505,378,1.53,TEAL)}{shelter(1420,378,1.53,TEAL)}
   {human(425,666,.85,GOLD)}{human(1340,666,.85,GOLD)}{human(1500,666,.85,TEAL)}
   {line(1340,734,1500,734,TEAL,5)}
   {box(172,773,666,133,TEAL)}{box(1077,773,660,133,GOLD)}
   {text(502,840,'知人がいない',50)}{text(1400,840,'知っている友人がいる',48)}
   {small(960,965,'同じ建物でも、迎える人によって見え方が変わる')}
 </g>;
 if(id==='DG_GROUP_OR_ALONE')return <g>
   {human(960,245,1.1,GOLD)}
   {line(943,360,600,570,TEAL,8)}{line(980,360,1330,570,RED,8)}
   {shelter(565,641,1.04,TEAL)}{human(1355,580,.9,RED)}
   {human(1190,605,.82,GOLD)}{human(1500,605,.82,TEAL)}
   {box(200,810,740,135,TEAL)}{box(995,810,720,135,RED)}
   {text(564,875,'知らない場所へ一人で',42)}{text(1360,875,'危険でも仲間と一緒に',40)}
 </g>;
 if(id==='DG_TRUST_BRIDGE')return <g>
   {human(340,450,1.6,GOLD)}{human(950,405,1.66,TEAL)}{human(1570,450,1.6,RED)}
   {line(430,553,860,553,TEAL,8)}
   {line(1050,553,1465,553,RED,8,true)}
   {text(340,690,'少女',57,GOLD)}{text(950,690,'信頼する友人',57,TEAL)}
   {text(1570,690,'知らない大人',55,RED)}
   {text(950,850,'紹介が、新たな接点になる',51)}
 </g>;
 if(id==='DG_SOCIAL_NETWORK')return <g>
   {Array.from({length:3},(_,ring)=><circle key={ring} cx={960} cy={496}
      r={140+ring*157} fill='none' stroke={ring===2?MUTED:TEAL}
      strokeDasharray='10 20' strokeWidth={3} opacity={.3+ring*.2}/>)}
   {Array.from({length:16},(_,i)=>{const ring=i<5?1:2,n=i<5?5:11,j=i<5?i:i-5;
    const rad=ring===1?253:447,theta=j*2*Math.PI/n-.5;
    const x=960+Math.cos(theta)*rad,y=496+Math.sin(theta)*rad;
    return <g key={i} opacity={Math.max(.13,Math.min(1,(p-i/21)*4))}>
      {line(960,496,x,y,i%5===0?GOLD:TEAL,4)}
      {dot(x,y,24,i%5===0?GOLD:MUTED)}</g>})}
   {dot(960,496,65,GOLD)}{human(960,514,.68,BG)}
   {text(960,978,'人づてに接点が広がる',49)}
 </g>;
 if(id==='DG_NETWORK_TWO_ROUTES')return <g>
   {human(960,330,1.4,GOLD)}{text(960,464,'つながり',47)}
   {line(890,527,490,675,TEAL,8)}{line(1030,527,1410,675,RED,8)}
   {box(155,689,700,205,TEAL)}{box(1065,689,700,205,RED)}
   {shelter(333,796,.72,TEAL)}{text(590,791,'支援情報',53)}
   {human(1239,796,.82,RED)}{text(1505,791,'危険な誘い',52)}
   {small(960,972,'同じネットワークが、異なる種類の情報を運ぶ')}
 </g>;
 if(id==='DG_BELONGING_PARADOX')return <g>
   <circle cx={695} cy={512} r={250} fill='#1a3037' stroke={TEAL} strokeWidth={6}/>
   {human(600,450,.95,GOLD)}{human(775,450,.86,TEAL)}{human(690,621,.86,TEAL)}
   {text(695,805,'仲間から離れにくい',44)}
   {line(912,490,1270,490,RED,7,true)}
   {human(1410,475,1.35,RED)}{text(1431,682,'紹介された大人',48,RED)}
   {text(950,919,'帰属を守る関係が、別の危険にもつながる',46)}
 </g>;
 if(id==='DG_TRUST_CUES')return <g>
   {box(167,280,714,480,TEAL)}{box(1040,280,714,480,GOLD)}
   {human(525,430,1.55,TEAL)}{human(1395,430,1.55,GOLD)}
   {text(525,626,'友人からの紹介',54)}{text(1395,626,'目先の親切',57)}
   {text(960,887,'人は何を手掛かりに信頼するのか',52)}
 </g>;
 throw Error('No one-off diagram implementation for '+id);
};
export const ChapterTwoDiagram=({id}:{id:string})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const p=Math.min(1,Math.max(0,(f+1)/(fps*2.6)));
 return <AbsoluteFill style={{background:BG}}>
  <svg viewBox='0 0 1920 1080' style={{width:'100%',height:'100%',display:'block'}}>
   <rect width={1920} height={1080} fill={BG}/>
   <g opacity={.08} stroke={MUTED} strokeWidth={1}>
    {Array.from({length:18},(_,i)=><line key={i} x1={i*120} y1={0} x2={i*120} y2={1080}/>)}
   </g>
   <Scene id={id} p={p}/>
  </svg>
 </AbsoluteFill>;
};
