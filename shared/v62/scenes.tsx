import React from 'react';
import data from './scene-data.json';
type M={id:string;phase:string;variant:number;narration:string;bgGroup:string;bgSeed:number;shotKind:string;visual:string};
const beats=data as M[];
const W=1920,H=1080;
const c={night:'#0c1420',navy:'#172839',silver:'#c8d3d4',gold:'#dab77e',red:'#cf6971',teal:'#6db5b8',paper:'#e8e7e0',dim:'#344654',green:'#85a996'};
const has=(t:string,re:RegExp)=>re.test(t);
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(p:number)=>{p=clamp(p);return p*p*(3-2*p)};
const mix=(a:number,b:number,p:number)=>a+(b-a)*ease(p);
const rnd=(n:number,k:number)=>((n*10939+k*7877)%104729)/104729;
const R=({x,y,w,h,fill=c.dim,r=8,opacity=1}:{x:number;y:number;w:number;h:number;fill?:string;r?:number;opacity?:number})=><rect x={x} y={y} width={w} height={h} rx={r} fill={fill} opacity={opacity}/>;
const L=({x,y,x2,y2,color=c.paper,sw=5,opacity=1}:{x:number;y:number;x2:number;y2:number;color?:string;sw?:number;opacity?:number})=><line x1={x} y1={y} x2={x2} y2={y2} stroke={color} strokeWidth={sw} opacity={opacity} strokeLinecap="round"/>;
const line=(x:number,y:number,X:number,Y:number,color=c.paper,sw=5,p=1)=><L x={x} y={y} x2={mix(x,X,p)} y2={mix(y,Y,p)} color={color} sw={sw}/>;
const Person=({x,y=600,s=1,coat=c.silver,head=true,stress=false}:{x:number;y?:number;s?:number;coat?:string;head?:boolean;stress?:boolean})=><g transform={'translate('+x+' '+y+') scale('+s+')'}>{head&&<><ellipse cx="0" cy="0" rx="64" ry="78" fill="#ccb49e"/><path d="M-63 -7 C-90 -108 78 -130 69 -8 L37 -46 L-58 -27Z" fill="#253443"/><circle cx="-22" cy="-1" r="6" fill="#2b3035"/><circle cx="23" cy="-1" r="6" fill="#2b3035"/><path d={stress?'M-21 41 Q0 17 22 41':'M-21 34 Q0 42 22 34'} fill="none" stroke="#594d4b" strokeWidth="5"/></>}{R({x:-73,y:79,w:146,h:216,fill:coat,r:36})}{line(-53,130,-112,296,coat,24)}{line(53,130,113,296,coat,24)}{line(-35,274,-48,440,'#667784',27)}{line(35,274,48,440,'#667784',27)}</g>;
const Screen=({x,y,w=390,h=650,p=0,mode='feed'}:{x:number;y:number;w?:number;h?:number;p?:number;mode?:string})=><g>{R({x,y,w,h,fill:'#2a3944',r:30})}{R({x:x+12,y:y+14,w:w-24,h:h-30,fill:'#0c1621',r:19})}{mode==='bank'?<g>{R({x:x+52,y:y+105,w:w-104,h:118,fill:'#253747',r:12})}{Array.from({length:5},(_,i)=>R({x:x+45,y:y+278+i*58,w:w-90,h:16,fill:i>2?c.red:c.silver,r:3,opacity:.33+.08*i}))}{R({x:x+56,y:y+140,w:mix(215,42,p),h:18,fill:c.red,r:3})}</g>:mode==='feed'?<g>{Array.from({length:3},(_,i)=><g key={i} transform={'translate(0 '+(-180*p)+')'}>{R({x:x+45,y:y+60+i*198,w:w-90,h:155,fill:[c.gold,c.teal,'#8f7383'][i],r:18,opacity:.62})}<circle cx={x+105} cy={y+112+i*198} r="34" fill="#ede0c7" opacity=".63"/>{R({x:x+168,y:y+91+i*198,w:w-234,h:15,fill:c.paper,r:5,opacity:.5})}</g>)}</g>:<g>{R({x:x+50,y:y+112,w:w-100,h:260,fill:'#202732',r:8})}<Person x={x+w*.52} y={y+220} s={.33} coat="#9c9fa8"/>{R({x:x+65,y:y+410,w:w-130,h:18,fill:c.red,r:5})}{R({x:x+65,y:y+450,w:w-150,h:13,fill:c.paper,r:5,opacity:.5})}</g>}<circle cx={x+w/2} cy={y+h-22} r="8" fill="#778b93"/></g>;
const Paper=({x,y,s=1,a=0,stamp=false}:{x:number;y:number;s?:number;a?:number;stamp?:boolean})=><g transform={'translate('+x+' '+y+') rotate('+a+') scale('+s+')'}>{R({x:0,y:0,w:190,h:245,fill:'#e9e4d8',r:2})}{Array.from({length:6},(_,i)=>R({x:25,y:33+i*28,w:122+(i%3)*11,h:7,fill:'#526777',r:1,opacity:.48}))}{stamp&&<circle cx="144" cy="171" r="27" fill="none" stroke={c.red} strokeWidth="7"/>}</g>;
const Graph=({x,y,p=1,shape='u'}:{x:number;y:number;p?:number;shape?:string})=><g>{line(x,y+420,x+710,y+420,c.silver,5)}{line(x,y+420,x,y,c.silver,5)}{shape==='u'?<path d={'M'+x+' '+(y+90)+' Q'+(x+355)+' '+(y+720)+' '+(x+710)+' '+(y+90)} fill="none" stroke={c.teal} strokeWidth="16" strokeDasharray={900} strokeDashoffset={900*(1-p)}/>:Array.from({length:5},(_,i)=>R({x:x+35+i*136,y:y+420-mix(20,80+i*67,p),w:90,h:mix(20,80+i*67,p),fill:i===4?c.red:c.teal,r:7}))}</g>;
const Hook=({x,y,p=1}:{x:number;y:number;p?:number})=><path d={'M'+x+' '+y+' l'+(85*p)+' 0 l'+(-18*p)+' -17 m'+(18*p)+' 17 l'+(-18*p)+' 17'} stroke={c.gold} strokeWidth="9" fill="none" strokeLinecap="round"/>;
const SceneBack=({m}:{m:M})=>{
 const seed=m.bgSeed,k=m.phase,contrast=rnd(seed,2);
 const night=['bank_night','social_feed','video_hook','conspiracy_room','anxiety_loop','trust','final_return'].includes(k);
 const hue=['inequality_lab','relative_deprivation','wealth_u','causal_map'].includes(k)?'#12252d':night?'#0e1623':'#16252d';
 const x=150+Math.floor(rnd(seed,3)*550), y=120+Math.floor(rnd(seed,4)*220);
 const x2=960+Math.floor(rnd(seed,5)*620);
 const window=night||['precarity','control_room','two_workers'].includes(k);
 return <g data-static-background={m.bgGroup}>
 <rect width={W} height={H} fill={hue}/><path d={'M0 0 L'+(800+contrast*850)+' 0 L'+(1020+contrast*350)+' 1080 L0 1080Z'} fill={night?'#111e2d':'#1b3540'} opacity=".56"/>
 {window&&<g>{R({x,y:150,w:480,h:405,fill:'#344b58',r:3})}{R({x:x+18,y:168,w:444,h:370,fill:night?'#0c2139':'#426473',r:1})}{Array.from({length:8},(_,i)=>R({x:x+25+i*53,y:275+(i%4)*50,w:33,h:250-(i%4)*30,fill:night?'#122335':'#243c46',r:2}))}{line(x+230,158,x+230,558,'#73878d',10)}{line(x,354,x+480,354,'#73878d',10)}</g>}
 {['bank_night','social_feed','video_hook','trust','final_return','two_workers'].includes(k)&&<g><path d="M0 785 L1920 765 L1920 1080 L0 1080Z" fill="#1b2733"/>{R({x:810,y:750,w:980,h:28,fill:'#53626d',r:4})}{R({x:900,y:776,w:22,h:225,fill:'#43515e',r:2})}</g>}
 {['inequality_lab','relative_deprivation','wealth_u','causal_map','suspicion_chain','needs'].includes(k)&&<g>{Array.from({length:9},(_,i)=>line(95,120+i*95,1800,120+i*95,'#5b6871',2,.35))}{Array.from({length:11},(_,i)=>line(100+i*170,120,100+i*170,905,'#5b6871',2,.24))}</g>}
 {['conspiracy_room','anxiety_loop'].includes(k)&&<g>{Array.from({length:7},(_,i)=>{const bx=110+i*260,by=300+(i%3)*120;return <g key={i}>{R({x:bx,y:by,w:195,h:245,fill:'#1e303c',r:4})}{line(bx+30,by+40,bx+170,by+40,'#485460',5)}</g>})}</g>}
 {['rigged_game','verification'].includes(k)&&<g>{R({x:90,y:135,w:1740,h:755,fill:'#0c1822',r:20})}{R({x:125,y:170,w:1670,h:670,fill:'#172d3a',r:10})}{line(140,880,1790,880,c.dim,15)}</g>}
 {['precarity','control_room'].includes(k)&&<g>{R({x:90,y:165,w:470,h:585,fill:'#1c2d38',r:10})}{Array.from({length:7},(_,i)=>R({x:125,y:210+i*75,w:390,h:13,fill:'#516471',r:2,opacity:.65}))}</g>}
 {Array.from({length:9},(_,i)=>{const a=(seed+i*17)%360*Math.PI/180;return <circle key={i} cx={x2+Math.cos(a)*(250+i*35)} cy={y+250+Math.sin(a)*(120+i*20)} r={2+i%3} fill={c.gold} opacity=".15"/>})}
 <rect width={W} height={H} fill="none" stroke="#030609" strokeWidth="36" opacity=".33"/>
 </g>;
};
const Night=({m,p,final=false}:{m:M;p:number;final?:boolean})=>{const t=m.narration,v=m.variant;return <g>
 <Person x={350+((m.bgSeed%2)*95)} y={550} s={.78} stress={has(t,/苦し|残高|余裕|請求|給料|変わらない/)}/><Screen x={1000} y={285} w={360} h={480} p={p} mode={has(t,/動画|黒幕/)?'video':has(t,/SNS|投稿|同世代/)?'feed':'bank'}/>
 {has(t,/家賃|電気|料金|請求|食費|カード|制度|勤務|家計/)&&Array.from({length:5},(_,i)=><g key={i} transform={'translate('+((i%3)*125)+ ' '+(Math.floor(i/3)*88)+')'}><Paper x={1000+i*31} y={760+((i%2)*25)} s={.43} a={i*3-8} stamp={i<=Math.floor(p*5)}/></g>)}
 {has(t,/夜|午前|出勤|電車|会社|窓/)&&<circle cx={m.bgSeed%2?820:660} cy="290" r={58} fill={c.gold} opacity=".30"/>}
 {has(t,/証拠|検証|資料|独立/)&&<g>{Paper({x:1430,y:275,s:.88,stamp:p>.6})}{line(1380,690,1600,650,c.teal,10,p)}</g>}
 {has(t,/複雑|偶然|制度|コントロール|全体/)&&Array.from({length:7},(_,i)=>line(1030+i*37,400,1520+i*24,180+(i%5)*110,c.teal,3,p*.72))}
 {final&&<g>{R({x:1520,y:390,w:280,h:180,fill:'#273747',r:16,opacity:.75})}{Person({x:1665,y:515,s:.38,coat:c.dim,head:false})}</g>}
 </g>};
const Social=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g>
 <Person x={250} y={535} s={.75} stress/><Screen x={810} y={130} w={475} h={750} p={p} mode={has(t,/残高|口座/)?'bank':'feed'}/>
 {has(t,/ホテル|高級車|レストラン|マンション|SNS|投稿/)&&[0,1,2].map((_,i)=><g key={i} opacity={mix(.2,1,p)}>{R({x:1310+i*132,y:225+i*105,w:118,h:145,fill:[c.gold,c.teal,'#aa858a'][i],r:9})}{Person({x:1350+i*130,y:340+i*105,s:.15,coat:c.silver})}</g>)}
 {has(t,/おかしい|努力|なぜ|違う/)&&<g><circle cx={620} cy={230} r={90+45*p} stroke={c.red} strokeWidth="12" fill="none"/></g>}
 {has(t,/残高|口座/)&&<Screen x={1440} y={415} w={265} h={370} p={p} mode="bank"/>}
 </g>};
const Video=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g><Screen x={590} y={160} w={755} h={730} p={p} mode="video"/>
 <Person x={958} y={415} s={.54} coat="#59616d"/><Person x={310} y={705} s={.40} stress/>
 {has(t,/安心|説明|理由|物語|名前/)&&<g><circle cx="950" cy="380" r={mix(100,240,p)} stroke={c.gold} strokeWidth="10" fill="none" opacity=".5"/>{[0,1,2].map((_,i)=><g key={i}>{line(1550,250+i*150,1250,400+i*30,c.red,8,p)}</g>)}</g>}
 {has(t,/疑|証拠|断定|無縁|修正/)&&<g>{Paper({x:1510,y:350,s:.88,stamp:p>.4})}<circle cx="1545" cy="580" r={80+10*p} stroke={c.teal} strokeWidth="14" fill="none"/></g>}
 </g>};
const Workers=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g>
 {R({x:925,y:150,w:8,h:670,fill:c.dim,r:0})}
 <Person x={360} y={500} s={.76} coat={c.teal}/><Person x={1400} y={500} s={.76} coat={c.silver} stress/>
 <Paper x={290} y={740} s={.60} a={-5}/><Paper x={1340} y={740} s={.6} a={9}/>
 {has(t,/25万|同じ|二人|月収/)&&<g><circle cx={490} cy="220" r={67} fill={c.gold} opacity=".65"/><circle cx={1390} cy="220" r={67} fill={c.gold} opacity=".65"/></g>}
 {has(t,/同期|昇進|後輩|転職|高級|取り残/)&&<g><Screen x={1475} y={125} w={250} h={385} mode="feed" p={p}/>{[0,1,2].map((_,i)=><circle key={i} cx={160+i*130} cy={250} r="28" fill={i<=Math.round(p*3)?c.red:c.dim}/>)}</g>}
 {has(t,/旅行|夕食|見通し|落ち着い/)&&<g><path d="M135 785 Q380 650 620 785" stroke={c.gold} strokeWidth="20" fill="none"/>{R({x:600,y:600,w:200,h:110,fill:'#60766e',r:11,opacity:.6})}</g>}
 </g>};
const Relative=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g>
 <Person x={270} y={470} s={.73}/><Person x={1430} y={470} s={.73} coat={c.teal}/>
 {line(365,670,1650,670,c.silver,12)}{line(990,620,990,855,c.silver,12)}
 {R({x:870,y:815,w:245,h:26,fill:c.dim,r:9})}
 {Array.from({length:7},(_,i)=><g key={i} opacity={i<Math.ceil(p*7)?1:.15}><circle cx={650+i*97} cy={460-(i%2)*60} r={16+i%3*9} fill={i%3?c.gold:c.red}/>{line(650+i*97,495-(i%2)*60,560+i*128,670,c.gold,2)}</g>)}
 {has(t,/奪|不当|怒|黒幕/)&&<g><path d="M940 180 Q1110 90 1310 210" stroke={c.red} strokeWidth="16" fill="none"/><circle cx={1310} cy={210} r="32" fill={c.red}/></g>}
 {has(t,/公平|同じ|別|証拠/)&&<g><Paper x={1470} y={670} s={.47} stamp={p>.55}/><Paper x={310} y={670} s={.47}/></g>}
 </g>};
const Lab=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g>
 {R({x:125,y:155,w:760,h:680,fill:'#213541',r:14})}{R({x:1035,y:155,w:760,h:680,fill:'#213541',r:14})}
 {Array.from({length:7},(_,i)=>R({x:182+i*95,y:715-mix(85,(i===3?440:100+i*17),p),w:58,h:mix(85,(i===3?440:100+i*17),p),fill:c.gold,r:3}))}
 {Array.from({length:7},(_,i)=>R({x:1095+i*95,y:715-mix(65,190+i%2*25,p),w:58,h:mix(65,190+i%2*25,p),fill:c.teal,r:3}))}
 {has(t,/研究|参加者|想像|実験|条件/)&&<g><Person x={872} y={405} s={.4} coat="#788d9b"/>{R({x:760,y:770,w:390,h:22,fill:c.silver,r:4})}</g>}
 {has(t,/ルール|秩序|アノミー|機能|違う/)&&Array.from({length:4},(_,i)=><g key={i}>{line(200+i*170,380,390+i*170,500,c.red,5,p)}</g>)}
 </g>};
const Suspicion=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g>
 <circle cx="960" cy="490" r={125+Math.floor(m.variant%4)*12} fill="#1a212b" stroke={c.red} strokeWidth="10" opacity=".88"/>
 <Person x={960} y={465} s={.57} coat={c.dim} head={false}/>
 {Array.from({length:8},(_,i)=>{const a=i*Math.PI/4+.17;const x=960+Math.cos(a)*550,y=490+Math.sin(a)*340;return <g key={i}>{R({x:x-95,y:y-65,w:190,h:130,fill:'#334551',r:12,opacity:.75})}<Paper x={x-33} y={y-39} s={.33} stamp={i%2===0}/>{line(x,y,960,490,c.red,5,i/8<p?1:0)}</g>})}
 {has(t,/証拠|検証|距離|事実|別の主張/)&&<g><circle cx={1450} cy={780} r="78" stroke={c.teal} strokeWidth="14" fill="none"/>{line(1510,844,1580,920,c.teal,15)}</g>}
 </g>};
const Precarity=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g>
 <Person x={920} y={515} s={.78} stress/><Screen x={1370} y={175} w={260} h={430} p={p} mode="bank"/>
 {Array.from({length:7},(_,i)=>{const bx=180+(i%4)*170,by=255+Math.floor(i/4)*200;return <g key={i} opacity={i<=Math.floor(p*7)?1:.23}>{R({x:bx,y:by,w:135,h:150,fill:i%3===0?c.red:c.dim,r:12})}{R({x:bx+20,y:by+18,w:95,h:14,fill:c.paper,r:3,opacity:.34})}</g>})}
 {has(t,/将来|来月|いつ|明日|不安|住居/)&&<g>{[0,1,2].map((_,i)=><g key={i}><Paper x={1180+i*113} y={755-i*25} s={.55} a={i*6-9} stamp={i===2&&p>.65}/></g>)}</g>}
 {has(t,/調査|研究|信頼|関連/)&&<Graph x={240} y={430} p={p} shape="bars"/>}
 </g>};
const Control=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g>
 <Person x={270} y={535} s={.74} stress/>
 {Array.from({length:5},(_,i)=>{const bx=760+i*203;return <g key={i}>{R({x:bx,y:390,w:170,h:360,fill:'#1c3442',r:18})}{line(bx+85,450,bx+85,600,c.silver,14)}<circle cx={bx+85} cy={mix(500,565,i%2?p:1-p)} r="35" fill={i%2?c.red:c.teal}/></g>})}
 {has(t,/シフト|勤務|変更|予定/)&&<g><Paper x={1120} y={155} s={.85} stamp={p>.5}/><Paper x={1260} y={180} s={.85} a={mix(0,18,p)}/></g>}
 {has(t,/見えない|秘密|操作|説明/)&&<g><circle cx="1640" cy="205" r={mix(40,105,p)} fill="#090c13" stroke={c.red} strokeWidth="8"/></g>}
 </g>};
const Causal=({m,p}:{m:M;p:number})=>{const t=m.narration;const simple=has(t,/全て|一人|犯人|黒幕|一つ|物語/);return <g>
 {Array.from({length:12},(_,i)=>{const a=i*Math.PI/6+.14;const x=960+Math.cos(a)*(365+(i%3)*85),y=505+Math.sin(a)*(265+(i%3)*45);return <g key={i}>{R({x:x-67,y:y-48,w:134,h:96,fill:i%4?c.dim:c.teal,r:11,opacity:.85})}{Paper({x:x-27,y:y-30,s:.25,stamp:i%4===0})}{line(x,y,simple?960:870+Math.cos(a+.4)*115,simple?490:510+Math.sin(a+.4)*110,simple?c.red:c.gold,4,simple?p:Math.max(.3,p))}</g>})}
 {simple?<g><circle cx="960" cy="490" r={75+65*p} fill="#11161e" stroke={c.red} strokeWidth="12"/><Person x={960} y={450} s={.4} coat={c.dim} head={false}/></g>:<g><circle cx="960" cy="490" r="80" fill="#193645" stroke={c.teal} strokeWidth="8"/></g>}
 {has(t,/証拠|間違い|検証/)&&<circle cx="960" cy="490" r={100+20*p} fill="none" stroke={c.gold} strokeWidth="8"/>}
 </g>};
const Needs=({m,p}:{m:M;p:number})=>{const t=m.narration,v=m.variant;return <g>
 <Person x={950} y={405} s={.72}/>
 {[0,1,2].map((_,i)=>{const x=320+i*565;return <g key={i} opacity={i<=Math.floor(p*3)?1:.30}>{R({x,y:260,w:390,h:410,fill:'#213a46',r:22})}<circle cx={x+195} cy="410" r="86" fill={[c.teal,c.gold,c.red][i]} opacity=".65"/>{i===0?<path d={'M'+(x+144)+' 415 Q'+(x+195)+' 335 '+(x+246)+' 415'} stroke={c.paper} strokeWidth="10" fill="none"/>:i===1?<path d={'M'+(x+137)+' 430 l52 58 l80 -118'} stroke={c.paper} strokeWidth="12" fill="none"/>:<circle cx={x+195} cy={410} r="47" fill="none" stroke={c.paper} strokeWidth="12"/>}</g>})}
 {has(t,/研究|分析|平均|違い|必ず/)&&<Graph x={400} y={650} p={p} shape="u"/>}
 </g>};
const Game=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g>
 {R({x:430,y:170,w:1050,h:665,fill:'#0c131e',r:25})}{R({x:475,y:225,w:960,h:470,fill:'#25384d',r:12})}
 <circle cx={mix(580,1300,p)} cy={mix(600,325,p)} r="51" fill={c.gold}/>{Array.from({length:8},(_,i)=>R({x:520+i*110,y:670,w:72,h:14,fill:i%2?c.red:c.teal,r:3}))}
 <Person x={190} y={510} s={.75} stress={has(t,/負け|勝てない|敗北/)}/><Person x={1595} y={490} s={.65} coat="#65778a"/>
 {has(t,/仕組|気づ|不正|囁|勝者/)&&<g><path d="M1470 320 Q1700 140 1830 300" fill="none" stroke={c.red} strokeWidth="13"/>{Array.from({length:4},(_,i)=>line(800+i*130,225,1430,140,c.red,4,p))}</g>}
 {has(t,/証拠|毎回|説明|慰め/)&&<Paper x={1280} y={735} s={.5} stamp={p>.5}/>}
 </g>};
const Anxiety=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g>
 <Person x={845} y={550} s={.83} stress/><Screen x={1250} y={405} w={315} h={455} mode="video" p={p}/>
 {Array.from({length:10},(_,i)=>{const a=(i*3.3+1)*.46;const x=960+Math.cos(a)*(240+i*67),y=490+Math.sin(a)*(170+i*43);return <g key={i} opacity={has(t,/不安|信じ|恐ろ|支配|全て|何も/)?(.25+.72*p):.22}>{line(x,y,940,505,c.red,4,p)}<circle cx={x} cy={y} r={13+i%3*5} fill={c.red}/></g>})}
 {has(t,/安心|理解|無力感|コントロール/)&&<g><circle cx="940" cy="490" r={150+130*p} fill="none" stroke={c.gold} strokeWidth="8" opacity=".32"/></g>}
 </g>};
const Wealth=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g><Graph x={550} y={245} p={p}/>
 <Person x={285} y={560} s={.55} coat="#62798c"/><Person x={1545} y={550} s={.60} coat="#d3c1a5"/>
 {has(t,/裕福|富裕|米国|調査|学歴|日本|U字/)&&<g><circle cx="660" cy="415" r="67" fill={c.red} opacity=".45"/><circle cx="1390" cy="415" r="67" fill={c.red} opacity=".45"/>{Array.from({length:6},(_,i)=>R({x:280+i*220,y:815-i%3*22,w:120,h:20,fill:i<3?c.red:c.gold,r:5,opacity:.6}))}</g>}
 {has(t,/奪われ|脅威|同じ|別の/)&&<g>{line(350,315,650,315,c.red,9,p)}{line(1560,315,1330,315,c.red,9,p)}</g>}
 </g>};
const Trust=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g>
 <Person x={460} y={515} s={.85} stress/>
 {[0,1,2].map((_,i)=><g key={i} opacity={has(t,/信用|信じ|ニュース|専門家|企業/)?Math.max(.12,1-p*.95):.43}><Screen x={930+i*225} y={230+i*70} w={210} h={315} mode={i===2?'video':'feed'} p={p}/></g>)}
 {has(t,/味方|苦し|語り|理解|経験/)&&<g><Screen x={1270} y={125} w={340} h={500} mode="video" p={p}/>{line(1450,660,650,610,c.gold,14,p)}</g>}
 {has(t,/資料|根拠|証拠|検証|統計/)&&<Paper x={1360} y={700} s={.5} stamp={p>.5}/>}
 </g>};
const Verification=({m,p}:{m:M;p:number})=>{const t=m.narration;return <g>
 {R({x:290,y:690,w:1380,h:32,fill:'#52636d',r:4})}<Paper x={440} y={350} s={1.12} stamp={has(t,/反対|断定|刺激|投稿/)}/><Paper x={1150} y={320} s={1.12} stamp={has(t,/資料|独立|数字|証拠|調べ/)}/>
 <circle cx={mix(530,1260,p)} cy={mix(620,545,p)} r="118" fill="none" stroke={c.teal} strokeWidth="20"/>{line(mix(610,1340,p),mix(710,635,p),mix(700,1425,p),mix(800,735,p),c.teal,19)}
 {has(t,/反証|修正|事実|検証|証明/)&&<g>{line(1050,260,1200,160,c.gold,12,p)}{line(1200,160,1360,260,c.gold,12,p)}</g>}
 </g>};
const renderMap:Record<string,React.FC<{m:M;p:number}>>={
 bank_night:Night,social_feed:Social,video_hook:Video,scope:Video,two_workers:Workers,relative_deprivation:Relative,
 inequality_lab:Lab,suspicion_chain:Suspicion,precarity:Precarity,control_room:Control,causal_map:Causal,
 conspiracy_room:Suspicion,needs:Needs,rigged_game:Game,anxiety_loop:Anxiety,wealth_u:Wealth,trust:Trust,
 verification:Verification,final_return:({m,p})=><Night m={m} p={p} final/>
};
export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const m=beats[n-1]||beats[0],p=clamp(progress);
 const Visual=renderMap[m.phase];
 if(!Visual)throw new Error('Unimplemented V62 story world: '+m.phase);
 const zoom=m.shotKind==='detail'?1.025:m.shotKind==='macro'?1.04:1;
 // Static environmental plate for adjacent continuity scenes; animate foreground alone.
 return <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position:'absolute',inset:0,overflow:'hidden'}}>
  <SceneBack m={m}/><g data-animated-foreground={m.visual} transform={'translate('+((1-zoom)*960)+' '+((1-zoom)*540)+') scale('+zoom+')'}><Visual m={m} p={p}/></g>
 </svg>;
};