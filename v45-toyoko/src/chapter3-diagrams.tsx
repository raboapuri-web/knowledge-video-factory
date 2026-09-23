import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';

/** Chapter 3: editorial one-off SVG graphics tied to the narrated claims.
 * Illustrations are schematic, NOT fabricated measurements or study footage. */
const C={bg:'#0a1421',panel:'#1b2b3a',white:'#edf0eb',gray:'#a9bcc2',
 teal:'#87c8c4',gold:'#e7c995',red:'#d9979e',blue:'#819dd0'};
const txt=(x:number,y:number,s:string,size=47,color=C.white)=>
 <text x={x} y={y} textAnchor='middle' dominantBaseline='middle'
 fontFamily='Noto Sans JP,sans-serif' fontWeight={700} fontSize={size} fill={color}>{s}</text>;
const ln=(x1:number,y1:number,x2:number,y2:number,color=C.teal,w=6,dash=false)=>
 <path d={'M'+x1+' '+y1+' L'+x2+' '+y2} fill='none' stroke={color} strokeWidth={w}
 strokeLinecap='round' strokeDasharray={dash?'12 16':undefined}/>;
const bx=(x:number,y:number,w:number,h:number,color=C.teal)=>
 <rect x={x} y={y} width={w} height={h} rx={28} fill={C.panel} stroke={color} strokeWidth={4}/>;
const dot=(x:number,y:number,c=C.teal,r=27)=><circle cx={x} cy={y} r={r} fill={c}/>;
const who=(x:number,y:number,c=C.gold,s=1)=>
 <g transform={'translate('+x+' '+y+') scale('+s+')'} fill={c}>
  <circle cx={0} cy={-48} r={20}/><path d='M-33 -10 Q0 -36 33 -10 L39 66 H-39Z'/></g>;
const house=(x:number,y:number,c=C.teal,s=1)=><g transform={'translate('+x+' '+y+') scale('+s+')'}
 stroke={c} strokeWidth={8} strokeLinejoin='round' fill='none'>
 <path d='M-100 -15 L0 -103 L100 -15 M-78 -15 V95 H78 V-15 M-18 94 V3 H30 V94'/></g>;
const clock=(x:number,y:number,c=C.gold,s=1)=><g transform={'translate('+x+' '+y+') scale('+s+')'}>
 <circle r={88} fill='none' stroke={c} strokeWidth={10}/><path d='M0 -57 V0 L43 27'
 stroke={c} strokeWidth={10} fill='none' strokeLinecap='round'/></g>;
const money=(x:number,y:number,c=C.gold)=><g><rect x={x-85} y={y-48} width={170} height={96}
 rx={15} fill='none' stroke={c} strokeWidth={8}/>{txt(x,y,'¥',56,c)}</g>;
const meal=(x:number,y:number,c=C.gold)=><g><ellipse cx={x} cy={y} rx={91} ry={46}
 fill='none' stroke={c} strokeWidth={8}/><ellipse cx={x} cy={y} rx={55} ry={21}
 fill={c} opacity={.45}/></g>;
const phone=(x:number,y:number,c=C.teal)=><g><rect x={x-49} y={y-82} width={98}
 height={165} rx={12} fill='none' stroke={c} strokeWidth={8}/>{dot(x,y+60,c,7)}</g>;
const arr=(x1:number,y1:number,x2:number,y2:number,c=C.teal,w=6,dash=false)=>
 <g>{ln(x1,y1,x2,y2,c,w,dash)}
 <path d={'M'+(x2-23)+' '+(y2-17)+' L'+x2+' '+y2+' L'+(x2-23)+' '+(y2+17)}
 fill='none' stroke={c} strokeWidth={w} strokeLinecap='round' strokeLinejoin='round'
 transform={x2===x1?'rotate(90 '+x2+' '+y2+')':undefined}/></g>;
const subtitle=(s:string)=>txt(960,954,s,34,C.gray);
const pick=(id:string,p:number)=>{
 const show=(offset:number)=>Math.max(.10,Math.min(1,(p-offset)*3));
 if(id==='DG_SUPPORT_PROCESS')return <g>
  {['状況を聞く','制度を確認','支援につなぐ'].map((s,i)=>{const x=335+i*625;
    return <g key={i} opacity={show(i*.16)}>{bx(x-220,348,440,280,i===2?C.gold:C.teal)}
     {i===0?who(x,425,C.teal,1.05):i===1?clock(x,438,C.teal,.64):house(x,435,C.gold,.77)}
     {txt(x,566,s,51)}{i<2&&arr(x+234,484,x+394,484,C.gray,7)}</g>})}
  {subtitle('支援のために必要な確認と手続き')}
 </g>;
 if(id==='DG_ADULT_FIRST_VIEW')return <g>
  {bx(120,198,785,660,C.teal)}{bx(1015,198,785,660,C.gold)}
  {who(470,420,C.teal,1.7)}{who(1360,420,C.gold,1.7)}
  {txt(506,634,'生活状況を聞く',55,C.teal)}{txt(1410,634,'食事を差し出す',55,C.gold)}
  {txt(960,920,'少女から見える最初の行動',43)}
 </g>;
 if(id==='DG_CHANGE_ACCEPT')return <g>
  {bx(180,225,690,580,C.teal)}{bx(1050,225,690,580,C.gold)}
  {arr(435,475,740,475,C.teal,8)}{txt(523,611,'生活を変える',59,C.teal)}
  {who(1400,427,C.gold,1.3)}{txt(1400,611,'今を受け入れる',59,C.gold)}
  {subtitle('最初に感じる負担は、必ずしも意図の良し悪しと一致しない')}
 </g>;
 if(id==='DG_TRUST_ENTRY')return <g>
  {who(312,445,C.gold,1.4)}{meal(823,460,C.teal)}
  {arr(405,507,660,507,C.teal)}{arr(930,505,1180,505,C.gray,6,true)}
  {bx(1204,280,488,455,C.red)}{house(1452,430,C.red,.7)}
  {txt(1452,598,'依存の入口',54,C.red)}{txt(430,765,'最初の親切',52,C.gold)}
  {subtitle('親切が本物であっても、後の関係が安全とは限らない')}
 </g>;
 if(id==='DG_HELP_ACCESS')return <g>
  {bx(150,205,730,600,C.teal)}{bx(1030,205,730,600,C.red)}
  {txt(515,331,'支援者',59,C.teal)}{txt(1395,331,'悪質な大人の可能性',50,C.red)}
  {clock(515,480,C.teal,.88)}{meal(1395,480,C.gold)}
  {txt(515,650,'確認・手続き',51)}{txt(1395,650,'目先の親切',53)}
  {subtitle('目に見える負担と、その人の意図は別の問題')}
 </g>;
 if(id==='DG_FIRST_IMPRESSION')return <g>
  {who(590,415,C.teal,1.8)}{who(1315,415,C.gold,1.8)}
  {Array.from({length:6},(_,i)=><g key={i} opacity={i<2?.85:.16}>
    {bx(332+i*86,662,67,70,i<2?C.teal:C.gray)}
    {bx(1055+i*86,662,67,70,i<2?C.gold:C.gray)}</g>)}
  {txt(960,833,'最初の親切だけでは、相手の情報は足りない',53)}
 </g>;
 if(id==='DG_STUDY_80'||id==='DG_STUDY_40'){const count=id==='DG_STUDY_80'?80:40;
 const cols=count===80?16:10,dx=count===80?83:127,dy=count===80?98:120;
 return <g>
   {txt(960,150,id==='DG_STUDY_80'?'2009年の調査':'2006年の調査',53,C.gray)}
   {txt(960,255,count+'人',104,C.gold)}
   {id==='DG_STUDY_80'&&txt(960,337,'15〜23歳',47,C.teal)}
   {Array.from({length:count},(_,i)=>{const x=(count===80?333:390)+(i%cols)*dx,y=425+Math.floor(i/cols)*dy;
    return <g key={i} opacity={i/count<=p?1:.15}>
     {who(x,y,count===80?C.teal:C.gold,count===80?.53:.74)}</g>})}
   {subtitle('調査の対象者数。行動の割合や内訳を示したものではない')}
  </g>}
 if(id==='DG_STREET_RESOURCES')return <g>
  {who(340,430,C.gold,1.8)}
  {meal(864,285,C.teal)}{house(870,548,C.teal,.73)}{money(862,766,C.teal)}
  {[285,548,766].map((y,i)=>ln(434,476,718,y,C.teal,5,i>0))}
  {bx(1205,305,535,400,C.red)}
  {txt(1476,423,'不安定な',56,C.red)}{txt(1476,510,'生計手段',56,C.red)}
  {subtitle('必要な生活資源を確保しようとする経路')}
 </g>;
 if(id==='DG_EXIT_COST')return <g>
   {who(330,448,C.gold,1.7)}
   {arr(460,485,720,485,C.red)}
   {[meal(1050,353,C.red),house(1390,530,C.red,.7),phone(1020,728,C.red)].map((e,i)=>
     <g key={i} opacity={show(i*.13)}>{e}
     {i===0?txt(1050,447,'食事',36,C.red):i===1?txt(1400,686,'寝床',36,C.red):
      txt(1020,861,'連絡手段',36,C.red)}
     <path d={i===0?'M967 280 L1132 428':i===1?'M1280 426 L1500 610':'M955 655 L1085 812'}
      stroke={C.red} strokeWidth={7}/></g>)}
   {subtitle('離れる決断は、人間関係だけを終えるものではない')}
 </g>;
 if(id==='DG_FEW_OPTIONS')return <g>
   {who(960,230,C.gold,1.5)}
   {arr(928,375,455,660,C.gray,6,true)}{arr(992,375,1473,660,C.red,6,true)}
   {house(430,725,C.gray,.96)}{meal(1485,722,C.red)}
   {ln(288,570,560,837,C.red,13)}{ln(560,570,288,837,C.red,13)}
   {ln(1376,615,1570,835,C.red,13)}
   {txt(960,874,'代わりの道が乏しい',58)}
 </g>;
 if(id==='DG_COERCION')return <g>
   {bx(160,275,730,530,C.teal)}{bx(1030,275,730,530,C.red)}
   {who(530,405,C.teal,1.3)}{who(1410,405,C.gold,1.3)}
   {arr(370,560,665,560,C.teal)}{arr(1640,560,1270,560,C.red)}
   {txt(525,701,'本人の意向',54,C.teal)}{txt(1390,701,'他者からの圧力',54,C.red)}
   {subtitle('意向と強制・操作は区別して考える')}
 </g>;
 if(id==='DG_OPTION_NOT_FREE')return <g>
   {who(360,370,C.gold,1.55)}
   {[0,1,2].map(i=><g key={i}>{arr(500,490,790,300+i*190,i===0?C.teal:C.red,5,i>0)}
    {bx(785,247+i*185,748,110,i===0?C.teal:C.red)}
    {txt(1160,300+i*185,i===0?'自分で選べる安全な道':i===1?'寝場所がなくなる':'生活資源を失う',39)}</g>)}
   {subtitle('ほかの道が失われた状態を自由な選択と同一視しない')}
 </g>;
 if(id==='DG_LOSE_SHELTER')return <g>
   {house(635,455,C.teal,1.85)}{who(1395,462,C.gold,1.4)}
   {ln(870,494,1200,494,C.red,8,true)}
   {ln(930,405,1150,584,C.red,12)}
   {txt(960,830,'今夜の寝場所が途切れる',60,C.red)}
 </g>;
 if(id==='DG_NO_ROUTE')return <g>
   {who(290,500,C.gold,1.45)}{house(1625,500,C.teal,1.2)}
   {ln(420,543,680,543,C.gray,7,true)}
   {ln(1230,543,1470,543,C.gray,7,true)}
   {bx(760,380,380,270,C.red)}{txt(950,485,'安全な',60,C.red)}
   {txt(950,562,'接続先がない',49,C.red)}
   {subtitle('関係を断った後の暮らしが見えない')}
 </g>;
 if(id==='DG_GRATITUDE_BURDEN')return <g>
   {meal(312,430,C.gold)}{arr(420,500,640,500,C.teal)}
   {who(855,470,C.teal,1.32)}{arr(960,500,1160,500,C.red)}
   {bx(1200,327,496,333,C.red)}{txt(1448,440,'断りづらさ',56,C.red)}
   {txt(1448,521,'負担',65,C.red)}
   {txt(312,645,'感謝',53,C.gold)}{txt(855,645,'継続する関係',48)}
   {subtitle('時間とともに関係の意味が変わることがある。推移の測定値ではない')}
 </g>;
 if(id==='DG_DEPENDENCY_CYCLE')return <g>
   {[[450,330,'親切'],[1450,330,'依存'],[1450,760,'断りづらさ'],[450,760,'離脱困難']].map(([x,y,s],i)=>
     <g key={i} opacity={show(i*.12)}>{bx(Number(x)-240,Number(y)-91,480,180,i>1?C.red:C.teal)}
      {txt(Number(x),Number(y),String(s),54)}</g>)}
   {arr(715,330,1168,330,C.teal)}
   {arr(1450,450,1450,645,C.red)}
   {arr(1190,760,718,760,C.red)}
   {arr(450,640,450,447,C.gray,5,true)}
   {who(951,540,C.gold,1.1)}
 </g>;
 if(id==='DG_SURVIVAL_NEEDS')return <g>
   {[[430,385,'食事'],[960,385,'寝床'],[1490,385,'連絡手段']].map(([x,y,s],i)=>
     <g key={i} opacity={show(i*.13)}>{bx(Number(x)-207,275,414,365,i===0?C.gold:C.teal)}
      {i===0?meal(Number(x),418,C.gold):i===1?house(Number(x),423,C.teal,.65):phone(Number(x),425,C.teal)}
      {txt(Number(x),571,String(s),45)}</g>)}
   {subtitle('今日を過ごすために欠かせない資源')}
 </g>;
 if(id==='DG_LISTEN_AND_RESOURCES')return <g>
   {bx(260,260,660,505,C.teal)}{bx(1000,260,660,505,C.gold)}
   {who(525,427,C.teal,1.25)}{who(680,427,C.teal,1.25)}
   {meal(1325,425,C.gold)}{house(1325,532,C.gold,.62)}
   {txt(589,670,'話を聞く相手',55,C.teal)}{txt(1330,670,'暮らしを支える手段',47,C.gold)}
   {subtitle('関係性と生活資源のどちらも欠かせない')}
 </g>;
 if(id==='DG_ZERO_SUM')return <g>
   {house(440,425,C.teal,1.1)}{who(620,550,C.gray,.95)}
   {who(1270,490,C.gold,1.1)}{who(1480,490,C.teal,1.1)}
   {bx(162,716,750,152,C.teal)}{bx(998,716,755,152,C.red)}
   {txt(536,795,'安全 → 仲間と離れる',45)}{txt(1375,795,'仲間 → 危険も残る',45)}
   {subtitle('二つしか道がないように見える状況')}
 </g>;
 if(id==='DG_AGENCY')return <g>
   {who(960,305,C.gold,1.5)}
   {[0,1,2].map((i)=>{const x=520+i*440,c=i===2?C.red:C.teal;
    return <g key={i}>{ln(960,480,x,665,c,5,i===2)}{dot(x,685,c,43)}
     {txt(x,775,['自分で決める','相談する','断る'][i],44,i===2?C.red:C.white)}</g>})}
   {bx(1150,612,565,175,C.red)}{txt(1430,700,'選択の余地が狭まる',40,C.red)}
 </g>;
 if(id==='DG_SAFE_BACKUP')return <g>
   {who(960,465,C.gold,1.5)}
   {[[340,295,'相談先',C.teal],[1575,295,'食事の支援',C.gold],
     [385,753,'宿泊先',C.teal],[1565,753,'友人',C.gold]].map(([x,y,s,c],i)=>
     <g key={i} opacity={show(i*.14)}>{ln(960,500,Number(x),Number(y),String(c),5)}
       {dot(Number(x),Number(y),String(c),83)}{txt(Number(x),Number(y)+150,String(s),42)}</g>)}
   {subtitle('安全に頼れる相手と場所を一人に集中させない')}
 </g>;
 throw Error('No unique chapter 3 explanatory SVG for '+id);
};
export const ChapterThreeDiagram=({id}:{id:string})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),p=Math.min(1,Math.max(0,(f+1)/(fps*2.7)));
 return <AbsoluteFill style={{background:C.bg}}>
  <svg viewBox='0 0 1920 1080' style={{width:'100%',height:'100%',display:'block'}}>
   <rect width={1920} height={1080} fill={C.bg}/>
   <g stroke={C.gray} strokeWidth={1} opacity={.07}>
    {Array.from({length:17},(_,i)=><line key={i} x1={i*120} y1={0} x2={i*120} y2={1080}/>)}
   </g>
   {pick(id,p)}
  </svg>
 </AbsoluteFill>;
};
