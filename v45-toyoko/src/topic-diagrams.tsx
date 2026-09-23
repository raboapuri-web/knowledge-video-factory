import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';

type DiagramId=
 |'community'|'network'|'safe_icons'|'safe_vs_belonging'|'japan_canada'
 |'survey38'|'survey49'|'survey138'|'survey80'|'survey37'|'odds59'
 |'rule_icons'|'choice_path'|'trust_gap'|'autonomy'|'belonging'
 |'network_risk'|'adult_compare'|'dependency'|'resource_trap'
 |'clock21'|'rules_tradeoff'|'research_process';

const FONT='Noto Sans JP, sans-serif';
const ink='#e9eae4',soft='#b5c6c8',gold='#e4c58f',rose='#cf858c',blue='#83b8bf';
const text=(x:number,y:number,value:string,size=46,fill=ink,weight=700)=>
 <text x={x} y={y} fill={fill} fontSize={size} fontWeight={weight} fontFamily={FONT}
 textAnchor='middle' dominantBaseline='middle'>{value}</text>;
const path=(d:string,color=soft,w=6)=><path d={d} stroke={color} strokeWidth={w}
 strokeLinecap='round' strokeLinejoin='round' fill='none'/>;
const node=(x:number,y:number,label:string,p=1,color=soft,r=70)=>
 <g opacity={p}><circle cx={x} cy={y} r={r} fill='#263947' stroke={color} strokeWidth={5}/>
 {text(x,y,label,Math.min(37,180/Math.max(2,label.length)),ink)}</g>;
const person=(x:number,y:number,c=soft,scale=1)=>
 <g transform={'translate('+x+' '+y+') scale('+scale+')'} fill={c}>
  <circle cx={0} cy={-30} r={16}/><path d='M-27 -7 Q0 -23 27 -7 L35 45 H-35Z'/></g>;
const card=(x:number,y:number,w:number,h:number,color=soft)=>
 <rect x={x} y={y} width={w} height={h} rx={22}
 fill='#162331' stroke={color} strokeWidth={3}/>;
const Ring=({cx,cy,r,color,progress}:{cx:number;cy:number;r:number;color:string;progress:number})=>
 <circle cx={cx} cy={cy} r={r} fill='none' stroke={color} strokeWidth={8}
 opacity={.35+.6*progress} strokeDasharray={2*Math.PI*r} strokeDashoffset={2*Math.PI*r*(1-progress)}
 transform={'rotate(-90 '+cx+' '+cy+')'}/>;

const Survey=({count,p}:{count:number;p:number})=>{
 const col=count>=100?17:count>=70?13:count>=40?9:8;
 const dx=count>=100?70:count>=70?87:count>=40?112:122;
 const dy=count>=100?73:count>=70?92:count>=40?115:122;
 return <g>
  {text(940,170,'調査対象',46,soft)}
  {text(940,255,count+'人',94,gold)}
  {Array.from({length:count},(_,i)=> <g key={i} opacity={i/count<=p?1:.16}>
   {person(320+(i%col)*dx,355+Math.floor(i/col)*dy, i%3===0?gold:blue,count>=100?.46:count>=70?.53:.69)}
  </g>)}
 </g>;
};

const Social=({p,risk=false}:{p:number;risk?:boolean})=>{
 const dots=[[350,380],[670,230],[655,615],[995,360],[1240,235],[1285,565],[1560,375]];
 const links=[[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,6],[5,6]];
 return <g>
  {links.map(([a,b],i)=><g key={i} opacity={Math.max(.09,Math.min(1,p*1.5-i*.085))}>
   {path('M'+dots[a][0]+' '+dots[a][1]+' L'+dots[b][0]+' '+dots[b][1],
     risk&&i>4?rose:blue,5)}
  </g>)}
  {dots.map(([x,y],i)=><g key={i} opacity={.18+Math.min(1,p*1.5-i*.06)*.82}>
   <circle cx={x} cy={y} r={42} fill='#2b4552' stroke={risk&&i===6?rose:blue} strokeWidth={5}/>
   {person(x,y+14,risk&&i===6?rose:gold,.51)}
  </g>)}
  {risk&&<g opacity={p}>{text(1265,725,'助けになるつながり',42,blue)}
    {text(1265,795,'危険も伝わる経路',42,rose)}</g>}
 </g>;
};

const Venn=({p,view}:{p:number;view:number})=><g>
 <circle cx={740} cy={465} r={250} fill={blue} opacity={.16+.07*p} stroke={blue} strokeWidth={7}/>
 <circle cx={1120} cy={465} r={250} fill={gold} opacity={.14+.10*p} stroke={gold} strokeWidth={7}/>
 {text(605,465,'安全',68,blue)}
 {text(1260,465,'居場所',68,gold)}
 <g opacity={p}>{text(929,455,'両立',53,ink)}{text(929,525,'できる支援',30,ink)}</g>
 {view%2===1&&<Ring cx={930} cy={465} r={132} color={rose} progress={p}/>}
 {text(930,795,'安全だけでも、仲間だけでもない',38,soft)}
 </g>;

const RuleIcons=({p}:{p:number})=><g>
 {[
  [445,382,'規則'],[930,382,'門限'],[1415,382,'プライバシー']
 ].map(([x,y,label],i)=><g key={i} opacity={Math.max(.15,Math.min(1,p*2-i*.32))}>
  <rect x={Number(x)-153} y={Number(y)-125} width={306} height={250} rx={26} fill='#24313e' stroke={i===1?rose:blue} strokeWidth={5}/>
  {i===0?<g>{path('M'+(Number(x)-58)+' '+(Number(y)-45)+' h116',gold,7)}{path('M'+(Number(x)-58)+' '+(Number(y)-5)+' h116',gold,7)}</g>:
   i===1?<g><circle cx={Number(x)} cy={Number(y)-13} r={52} fill='none' stroke={gold} strokeWidth={7}/>
      {path('M'+x+' '+(Number(y)-13)+' v-30 m0 30 l30 20',gold,7)}</g>:
   <g><rect x={Number(x)-49} y={Number(y)-51} width={98} height={75} rx={14} fill='none' stroke={gold} strokeWidth={7}/>
    <circle cx={Number(x)} cy={Number(y)-14} r={12} fill={gold}/></g>}
  {text(Number(x),Number(y)+67,String(label),40)}
 </g>)}
 {text(930,730,'守るための条件が、利用の負担にもなる',40,soft)}
 </g>;

const Flow=({p,mode}:{p:number;mode:string})=>{
 const labels=mode==='choice_path'?['街の仲間','施設・支援','安心と関係の両立']:
 mode==='resource_trap'?['食事・寝床','ひとりに依存','断りにくさ']:
 mode==='dependency'?['助けを受ける','資源が集中','離れにくい']:
 mode==='autonomy'?['自分の意思','対話で選ぶ','生活を立て直す']:
 mode==='rules_tradeoff'?['安全を守る','利用の条件','支援へのアクセス']:
 mode==='trust_gap'?['初めての相談','重なる質問','信頼の積み重ね']:
 ['支援','つながり','選択肢'];
 return <g>
 {labels.map((label,i)=>{
  const x=365+i*565,c=i===2?gold:i===1?rose:blue;
  return <g key={label} opacity={Math.min(1,Math.max(.15,p*2-i*.35))}>
   {card(x-175,305,350,240,c)}
   {text(x,408,label,label.length>7?40:49)}
   <circle cx={x} cy={575} r={18} fill={c}/>
   {i<2&&<g>{path('M'+(x+200)+' 428 H'+(x+344),soft,6)}
     {path('M'+(x+328)+' 409 l22 19 l-22 19',soft,6)}</g>}
  </g>;
 })}
 {mode==='resource_trap'&&<g opacity={p}>{path('M1495 660 Q930 825 365 660',rose,5)}{text(930,802,'戻る道が見つからない',42,rose)}</g>}
 {mode==='autonomy'&&text(935,785,'本人も意思決定に加わる',45,gold)}
 </g>;
};

const AdultCompare=({p}:{p:number})=><g>
 {card(235,205,670,550,blue)}{card(1015,205,670,550,rose)}
 {text(560,290,'支援する大人',50,blue)}
 {text(1345,290,'近づいてくる大人',45,rose)}
 {person(545,405,blue,2)}{person(1310,405,rose,2)}
 {text(560,625,'事情の確認・手続き',38,ink)}
 {text(1345,625,'目先の親切・提供',38,ink)}
 {text(955,831,'最初の印象だけでは見分けにくい',39,soft)}
 </g>;

const Clock=({p}:{p:number})=><g>
 <circle cx={945} cy={435} r={265} fill='#1f2f3c' stroke={gold} strokeWidth={13}/>
 {[0,1,2,3,4,5,6,7,8,9,10,11].map(i=><line key={i}
 x1={945+Math.sin(i*Math.PI/6)*225} y1={435-Math.cos(i*Math.PI/6)*225}
 x2={945+Math.sin(i*Math.PI/6)*244} y2={435-Math.cos(i*Math.PI/6)*244}
 stroke={ink} strokeWidth={i%3===0?8:4}/>)}
 {path('M945 435 L'+(945+Math.sin(Math.PI*1.5*p)*125)+' '+(435-Math.cos(Math.PI*1.5*p)*125),blue,13)}
 {path('M945 435 L1077 303',gold,10)}
 <circle cx={945} cy={435} r={12} fill={ink}/>
 {text(945,781,'相談窓口の開所時間 15:00〜21:00',46,ink)}
 </g>;

const JapanCanada=({p}:{p:number})=><g>
 {card(230,250,550,430,blue)}{card(1110,250,550,430,gold)}
 {text(505,445,'日本',80,blue)}{text(1385,445,'カナダ',78,gold)}
 {path('M805 445 Q945 '+(195-70*p)+' 1080 445',ink,7)}
 {path('M1047 414 L1083 445 L1047 476',ink,8)}
 {text(940,760,'研究の舞台を移す',46,ink)}
 </g>;
export const TopicDiagram=({diagramId,overlay=false,variant=0}:{
 diagramId:string;overlay?:boolean;variant?:number
})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const p=Math.min(1,(f%Math.max(1,Math.round(fps*8)))/(fps*4));
 const n=diagramId.match(/^survey(38|49|138|80|37)$/);
 const body=n?<Survey count={Number(n[1])} p={p}/>:
 diagramId==='safe_vs_belonging'?<Venn p={p} view={variant}/>:
 diagramId==='network'||diagramId==='belonging'||diagramId==='community'?<Social p={p}/>:
 diagramId==='network_risk'?<Social p={p} risk/>:
 diagramId==='rule_icons'||diagramId==='safe_icons'?<RuleIcons p={p}/>:
 diagramId==='adult_compare'?<AdultCompare p={p}/>:
 diagramId==='japan_canada'?<JapanCanada p={p}/>:
 diagramId==='clock21'?<Clock p={p}/>:
 diagramId==='odds59'?<g>{text(950,240,'施設利用との関連',52,soft)}
   {text(950,475,'約5.9倍',130,gold)}
   {text(950,650,'オッズの比（調査時）',47,ink)}
   {text(950,748,'関連であり、因果関係を示す数値ではない',32,soft)}</g>:
 <Flow p={p} mode={diagramId}/>;
 return <div style={overlay?{position:'absolute',right:35,top:95,width:790,height:560,
   zIndex:15,background:'rgba(10,17,28,.84)',border:'2px solid #566a71',borderRadius:23,
   boxShadow:'0 10px 35px rgba(0,0,0,.45)',overflow:'hidden'}:{
   position:'absolute',inset:0,background:'#0a1220',overflow:'hidden'}}>
  <svg viewBox='0 0 1920 1080' preserveAspectRatio='xMidYMid meet'
   style={{width:'100%',height:'100%',display:'block'}}>
    <rect x={0} y={0} width={1920} height={1080} fill='#0b1420'/>
    <g opacity={.07} stroke={soft} strokeWidth={1}>
    {Array.from({length:18},(_,i)=><line key={i} x1={i*120} y1={0} x2={i*120} y2={1080}/>)}
    </g>
    {body}
   </svg>
 </div>;
};
