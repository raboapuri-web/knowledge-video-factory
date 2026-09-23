import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';

/** Chapter 4: 27 content-specific illustrations, one occurrence each.
 * Illustrations are conceptual rather than fake measurements. No repeated Venn,
 * no made-up success rates, and labels are above the original narration subtitles. */
const C={bg:'#0b1622',panel:'#1a2b38',white:'#e9eeeb',soft:'#b1c5c5',
 teal:'#82c9c2',gold:'#e6ca91',red:'#d58e93',blue:'#8ba4d9'};
const T=(x:number,y:number,label:string,size=48,color=C.white)=>
 <text x={x} y={y} textAnchor='middle' dominantBaseline='middle'
 fontWeight={700} fontSize={size} fontFamily='Noto Sans JP,sans-serif' fill={color}>{label}</text>;
const L=(a:number,b:number,x:number,y:number,c=C.teal,w=6,d=false)=>
 <path d={'M'+a+' '+b+' L'+x+' '+y} stroke={c} strokeWidth={w}
 strokeDasharray={d?'14 15':undefined} strokeLinecap='round' fill='none'/>;
const A=(a:number,b:number,x:number,y:number,c=C.teal)=><g>
 {L(a,b,x,y,c,7)}<path d={'M'+(x-24)+' '+(y-16)+' L'+x+' '+y+' L'+(x-24)+' '+(y+16)}
 stroke={c} strokeWidth={7} fill='none' strokeLinecap='round' strokeLinejoin='round'/></g>;
const B=(x:number,y:number,w:number,h:number,c=C.teal)=>
 <rect x={x} y={y} width={w} height={h} rx={25} fill={C.panel} stroke={c} strokeWidth={4}/>;
const D=(x:number,y:number,r=28,c=C.teal)=><circle cx={x} cy={y} r={r} fill={c}/>;
const P=(x:number,y:number,c=C.gold,s=1)=><g transform={'translate('+x+' '+y+') scale('+s+')'} fill={c}>
 <circle cx={0} cy={-43} r={20}/><path d='M-33 -10 Q0 -38 33 -10 L37 60 H-37Z'/></g>;
const H=(x:number,y:number,c=C.teal,s=1)=><g transform={'translate('+x+' '+y+') scale('+s+')'}
 stroke={c} strokeWidth={8} strokeLinecap='round' strokeLinejoin='round' fill='none'>
 <path d='M-100 -15 L0 -105 L100 -15 M-75 -15 V92 H75 V-15 M-24 92 V0 H26 V92'/></g>;
const K=(x:number,y:number,c=C.gold,r=90)=><g>
 <circle cx={x} cy={y} r={r} fill='none' stroke={c} strokeWidth={11}/>
 {L(x,y,x,y-r*.63,c,9)}{L(x,y,x+r*.4,y+r*.22,c,9)}</g>;
const card=(x:number,y:number,label:string,c=C.teal,w=500)=><g>
 {B(x-w/2,y-105,w,210,c)}{T(x,y,label,Math.min(48,label.length>10?37:48),c)}</g>;
const personRow=(x:number,y:number,n:number,c=C.teal,s=.65)=>Array.from({length:n},(_,i)=>
 <g key={i}>{P(x+i*70,y,c,s)}</g>);
const pick=(id:string,p:number)=>{
 const show=(start:number)=>Math.max(.12,Math.min(1,(p-start)*3));
 if(id==='DG_OPEN_15')return <g>
  {H(605,480,C.teal,1.62)}{K(1335,460,C.gold,1.37)}
  {T(1335,690,'15:00',87,C.gold)}{T(605,722,'相談窓口',55)}
  {A(865,480,1100,480,C.teal)}
 </g>;
 if(id==='DG_TRUST_TO_SUPPORT')return <g>
  {[[360,'立ち寄る'],[950,'少しずつ話す'],[1540,'必要な支援']].map(([x,t],i)=>
   <g key={i} opacity={show(i*.19)}>{card(Number(x),438,String(t),i===2?C.gold:C.teal,480)}
    {i<2&&A(Number(x)+250,438,Number(x)+324,438,C.soft)}</g>)}
  {P(360,665,C.gold,.75)}{P(950,665,C.gold,.75)}{H(1540,688,C.gold,.6)}
 </g>;
 if(id==='DG_SAFETY_BOUNDARIES')return <g>
  {H(960,470,C.teal,1.52)}
  <path d='M430 282 H1490 V766 H430Z' stroke={C.teal} strokeWidth={10} fill='none' strokeDasharray='20 13'/>
  {P(670,573,C.gold,1)}{P(1190,573,C.gold,1)}
  {D(345,448,62,C.red)}{T(345,449,'!',73,C.bg)}
  {D(1580,448,62,C.red)}{T(1580,449,'!',73,C.bg)}
  {T(960,854,'全員が利用できる安全な境界',45)}
 </g>;
 if(id==='DG_PROTECTION_LIMIT')return <g>
  {B(135,222,760,565,C.teal)}{B(1020,222,760,565,C.gold)}
  {H(520,430,C.teal,1)}{P(1400,430,C.gold,1.38)}
  {T(515,649,'安全を守る条件',48)}{T(1395,649,'本人が利用できる',46)}
  {A(900,495,1010,495,C.soft)}
 </g>;
 if(id==='DG_OPEN_HOURS')return <g>
  {K(945,439,C.gold,2.2)}{T(945,744,'15:00 ─ 21:00',89,C.gold)}
  {T(945,847,'相談窓口の原則開所時間',45,C.soft)}
 </g>;
 if(id==='DG_NEW_RELATIONSHIP')return <g>
  {H(368,392,C.teal,1.1)}{H(1570,392,C.gold,1.1)}
  {P(960,415,C.gold,1.35)}
  {L(495,520,800,520,C.soft,5,true)}{L(1100,520,1435,520,C.soft,5,true)}
  {T(355,666,'知っている友人',41)}{T(1560,666,'初対面の人々',41)}
  {card(960,776,'人間関係を一から築く',C.gold,760)}
 </g>;
 if(id==='DG_DAY_NIGHT_LOOP')return <g>
  {H(440,402,C.teal,1.3)}{K(440,195,C.gold,.67)}{T(440,702,'昼の相談窓口',49)}
  {H(1490,402,C.red,1.2)}{D(1510,190,49,C.gold)}{D(1530,175,43,C.bg)}
  {T(1490,702,'夜の広場',49)}
  {A(650,420,1220,420,C.gold)}
  {L(1240,810,705,810,C.red,6,true)}
 </g>;
 if(id==='DG_BUILDING_VS_LIFE')return <g>
  {H(475,380,C.teal,1.35)}{T(475,666,'建物を開ける時間',45)}
  {K(1395,395,C.gold,1.38)}{T(1395,667,'その後も続く生活',43)}
  {L(300,824,1610,824,C.soft,5)}
  {Array.from({length:6},(_,i)=>D(370+i*229,824,13,i<2?C.teal:C.gold))}
 </g>;
 if(id==='DG_ACCESS_FRICTION')return <g>
  {P(347,520,C.gold,1.48)}{H(1513,506,C.teal,1.42)}
  {L(480,550,1210,550,C.soft,6,true)}
  {Array.from({length:3},(_,i)=><g key={i}>{B(720+i*143,402,43,310,C.red)}</g>)}
  {T(960,312,'規則が利用の負担になるとき',51)}
  {T(960,828,'利用できる道が狭まる',46,C.red)}
 </g>;
 if(id==='DG_SAFE_NOT_REACHED')return <g>
  {H(1510,438,C.teal,1.55)}{P(365,515,C.gold,1.4)}
  {L(460,577,1150,577,C.soft,8,true)}
  {L(1165,487,1165,676,C.red,17)}
  {T(850,390,'安全な場所は存在する',48,C.teal)}
  {T(890,819,'たどり着く経路が途切れる',47,C.red)}
 </g>;
 if(id==='DG_SAFETY_AND_ACCESS')return <g>
  {B(220,220,700,560,C.teal)}{B(1000,220,700,560,C.gold)}
  {H(565,438,C.teal,1.23)}{P(1345,462,C.gold,1.3)}
  {T(565,695,'施設側の安全',48)}{T(1345,695,'本人の利用しやすさ',46)}
  {T(960,875,'両方の観点が必要',54,C.white)}
 </g>;
 if(id==='DG_STUDY_11_37')return <g>
  {T(480,170,'11施設',73,C.teal)}{T(1415,170,'37人',78,C.gold)}
  {Array.from({length:11},(_,i)=><g key={i}>{H(240+(i%4)*148,343+Math.floor(i/4)*159,C.teal,.35)}</g>)}
  {Array.from({length:37},(_,i)=><g key={i}>
   {P(1105+(i%10)*69,310+Math.floor(i/10)*130,C.gold,.43)}</g>)}
  {T(960,855,'16〜21歳の若者への聞き取り',49,C.white)}
 </g>;
 if(id==='DG_STABLE_RULES')return <g>
  {B(140,205,780,580,C.teal)}{B(1000,205,780,580,C.red)}
  {H(525,423,C.teal,1.3)}{K(1393,426,C.red,.95)}
  {T(530,674,'安定した暮らし',52)}{T(1390,674,'厳しく感じる規則',49)}
 </g>;
 if(id==='DG_AGENCY_BESIDE_SAFETY')return <g>
  {H(620,433,C.teal,1.4)}{P(1270,440,C.gold,1.65)}
  {L(765,480,1110,480,C.soft,6)}
  {card(1263,708,'自分の生活を決めたい',C.gold,830)}
  {T(610,738,'安全な住まい',47,C.teal)}
 </g>;
 if(id==='DG_YOUTH_PARTICIPATION')return <g>
  {B(455,295,1010,440,C.teal)}{P(630,490,C.gold,1.25)}{P(960,490,C.teal,1.1)}
  {P(1285,490,C.gold,1.12)}
  {L(650,612,1260,612,C.soft,5)}
  {T(960,795,'若者も決まりごとの話し合いに参加',47)}
 </g>;
 if(id==='DG_CHOICE_BOARD')return <g>
  {P(950,260,C.gold,1.28)}
  {[[340,'住む場所'],[960,'学校'],[1570,'友人との連絡']].map(([x,s],i)=>
   <g key={i} opacity={show(i*.16)}>{L(950,390,Number(x),610,C.teal,5)}
    {card(Number(x),716,String(s),i===2?C.gold:C.teal,510)}</g>)}
 </g>;
 if(id==='DG_FRIEND_CONTACT')return <g>
  {P(960,335,C.gold,1.45)}{H(330,390,C.teal,1.1)}
  {P(1580,365,C.teal,1.25)}{P(1500,700,C.gold,.85)}
  {L(875,423,475,473,C.teal,6)}{L(1050,400,1455,441,C.gold,6)}
  {L(1045,510,1380,697,C.teal,5,true)}
  {T(490,748,'施設と支援者',43)}{T(1470,820,'安全な形で続く友人関係',40)}
 </g>;
 if(id==='DG_TRUST_TAKES_TIME')return <g>
  {L(230,700,1690,700,C.teal,8)}
  {Array.from({length:4},(_,i)=><g key={i} opacity={show(i*.12)}>
    {D(330+i*430,700,29,i===3?C.gold:C.teal)}
    {P(330+i*430,535,i===3?C.gold:C.teal,.8)}
    {T(330+i*430,798,['出会う','少し話す','再び会う','信頼を育てる'][i],36)}</g>)}
  {T(960,278,'関係は一度の面談で完成しない',52)}
 </g>;
 if(id==='DG_RETURN_PATH')return <g>
  {H(450,427,C.teal,1.35)}{P(1490,485,C.gold,1.1)}
  {A(650,505,1220,505,C.gold)}
  {L(1250,692,685,692,C.teal,7,true)}
  {T(960,305,'困ったら再び相談できる',51)}
  {T(960,850,'一度離れても、支援との関係は残る',46)}
 </g>;
 if(id==='DG_SYSTEM_VIEW')return <g>
  {H(390,470,C.teal,1.3)}{P(960,454,C.gold,1.35)}
  {H(1530,470,C.gold,1.3)}
  {L(525,572,810,545,C.teal,7)}{L(1095,545,1410,572,C.gold,7)}
  {T(960,730,'建物だけでなく、生活を支える関係',49)}
 </g>;
 if(id==='DG_REASON_TO_ENTER')return <g>
  {H(650,422,C.teal,1.42)}{P(1330,440,C.gold,1.45)}
  {L(820,510,1140,510,C.soft,7,true)}
  {card(960,750,'そこへ向かう理由が必要',C.gold,930)}
 </g>;
 if(id==='DG_ENTER_LOSS')return <g>
  {B(110,246,805,550,C.teal)}{B(1005,246,805,550,C.red)}
  {H(510,430,C.teal,1.2)}{P(1410,420,C.gold,1.2)}
  {T(511,658,'施設で得られる安全',48)}{T(1409,658,'離れることで失うかもしれないもの',37)}
 </g>;
 if(id==='DG_MANY_DECISIONS')return <g>
  {P(960,270,C.gold,1.3)}
  {[[330,'住む場所'],[960,'人間関係'],[1570,'生活習慣']].map(([x,s],i)=>
   <g key={i} opacity={show(i*.14)}>{L(960,375,Number(x),575,C.soft,6)}
    {card(Number(x),715,String(s),i===1?C.gold:C.teal,490)}</g>)}
 </g>;
 if(id==='DG_RELOCATION_VS_LIFE')return <g>
  {B(105,230,785,620,C.teal)}{B(1020,230,785,620,C.gold)}
  {H(375,441,C.teal,.93)}{A(500,476,717,476,C.teal)}{H(760,442,C.teal,.92)}
  {P(1240,432,C.gold,1.0)}{P(1545,432,C.gold,1)}
  {L(1240,560,1555,560,C.gold,5)}
  {T(493,732,'場所の移動',49)}{T(1417,732,'生活の再編',49)}
 </g>;
 if(id==='DG_FEAR_OF_LOSS')return <g>
  {P(960,294,C.gold,1.52)}
  {[[410,'友人'],[960,'暮らし'],[1530,'相談相手']].map(([x,s],i)=>
   <g key={i}>{L(960,430,Number(x),660,i===0?C.gold:C.teal,6)}
    {D(Number(x),705,87,i===0?C.gold:C.teal)}
    {T(Number(x),837,String(s),47,C.white)}</g>)}
 </g>;
 if(id==='DG_AFTER_EXIT')return <g>
  {H(350,443,C.teal,1.35)}{P(960,453,C.gold,1.29)}
  {H(1570,443,C.gold,1.35)}
  {A(530,540,792,540,C.teal)}{A(1105,540,1365,540,C.gold)}
  {T(960,748,'施設を離れた後も続く生活',48)}
 </g>;
 if(id==='DG_CONTINUITY')return <g>
  {H(340,380,C.teal,1.17)}{P(960,390,C.gold,1.47)}
  {P(1480,386,C.teal,1.14)}
  {L(476,515,828,503,C.teal,7)}{L(1092,503,1350,515,C.gold,7)}
  {card(440,741,'安全',C.teal,420)}{card(960,741,'暮らし',C.gold,420)}
  {card(1470,741,'人とのつながり',C.teal,650)}
 </g>;
 throw Error('Chapter four diagram is missing unique content: '+id);
};
export const ChapterFourDiagram=({id}:{id:string})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig();
 const p=Math.min(1,Math.max(0,(f+1)/(fps*2.3)));
 return <AbsoluteFill style={{background:C.bg}}>
  <svg viewBox='0 0 1920 1080' style={{width:'100%',height:'100%',display:'block'}}>
   <rect width={1920} height={1080} fill={C.bg}/>
   <g opacity={.065} stroke={C.soft} strokeWidth={1}>
    {Array.from({length:16},(_,i)=><line key={i} x1={i*128} y1={0} x2={i*128} y2={1080}/>)}
   </g>
   {pick(id,p)}
  </svg>
 </AbsoluteFill>;
};
