import React from 'react';
import {interpolate} from 'remotion';
import sceneData from './scene-data.json';

type M={id:string;phase:string;variant:number;shotKind:string;visual:string;bgGroup:string;bgSeed:number};
const scenes=sceneData as M[];
const font='Noto Sans JP, sans-serif';
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const show=(p:number,a=.08,b=.34)=>interpolate(p,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const hues:[string,string,string,string][]=[
 ['#0a1827','#1d4059','#b5d8dc','#eac98f'],['#12192a','#4b5e78','#e3e1ca','#c9b0a8'],
 ['#122626','#285957','#acd1b0','#dfbd77'],['#181b29','#4b4859','#bed0df','#d9a18c'],
 ['#19192d','#344b70','#c2d6e2','#d1bc96'],['#131e29','#335b68','#c7dedb','#e9b47d'],
 ['#211a23','#6a4450','#e4c9bc','#d4a36e'],['#131e1c','#52684c','#cad7b7','#e7c582']
];

const Caption=({x,y,t,size=42,w=1000,color='#f6f3eb',opacity=1,align='left'}:{x:number;y:number;t:string;size?:number;w?:number;color?:string;opacity?:number;align?:'left'|'center'|'right'})=><div style={{position:'absolute',left:x,top:y,width:w,fontSize:size,fontFamily:font,fontWeight:880,lineHeight:1.35,color,opacity,whiteSpace:'pre-line',textAlign:align,textShadow:'0px 6px 25px #020409e0'}}>{t}</div>;
const Chip=({x,y,t,w=430,h=120,opacity=1,accent='#d6b77d',size=31}:{x:number;y:number;t:string;w?:number;h?:number;opacity?:number;accent?:string;size?:number})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:20,borderRadius:24,background:'#080f19dc',border:'2px solid '+accent+'9a',boxShadow:'0px 18px 60px #0008',color:'#f5f1e9',fontFamily:font,fontSize:size,fontWeight:850,lineHeight:1.32,opacity,whiteSpace:'pre-line'}}>{t}</div>;

const Sky=({m,night=false,tropical=false}:{m:M;night?:boolean;tropical?:boolean})=>{
 const c=hues[m.bgSeed%hues.length];
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:tropical?'linear-gradient(#294752,#72908b 53%,#354c2f 54%,#122820)':night?'linear-gradient(#080d20,#1b2b40 70%,#101a27)':'linear-gradient('+c[1]+', '+c[2]+' 65%, '+c[0]+')'}}>
 <div style={{position:'absolute',left:(m.bgSeed*53)%1250+160,top:night?145:105,width:night?95:160,height:night?95:160,borderRadius:'50%',background:night?'#f1eccb':'#fff0c0',boxShadow:'0 0 100px #f6dba480'}}/>
 {Array.from({length:18}).map((_,i)=><div key={i} style={{position:'absolute',left:i*119-80+((m.bgSeed*19)%80),bottom:200+(i%3)*18,width:90+(i%3)*60,height:130+((i*17+m.bgSeed)%5)*45,background:tropical?'#243e33':night?'#111b2a':'#324e5a',opacity:tropical? .68:.8,clipPath:i%3===0?'polygon(50% 0,90% 100%,10% 100%)':undefined}}/>)}
 {Array.from({length:45}).map((_,i)=><div key={i} style={{position:'absolute',left:(i*151+m.bgSeed*19)%1870,top:220+(i*61)%370,width:4,height:6,background:night?'#ffe9aa':'#e8f2ef',opacity:night? .65:.25}}/>)}
 </div>;
};

const Stage=({m,tag,kind='interior',children}:{m:M;tag:string;kind?:'interior'|'city'|'night'|'tropical'|'black'|'warm';children:React.ReactNode})=>{
 const c=hues[m.bgSeed%hues.length],x=18+(m.bgSeed*17)%62,y=20+(m.bgSeed*31)%59;
 return <div style={{position:'absolute',inset:0,overflow:'hidden',fontFamily:font,background:kind==='black'?'radial-gradient(circle at '+x+'% '+y+'%,#28313f,#04070c 60%)':kind==='warm'?'radial-gradient(circle at '+x+'% '+y+'%,#775945,#1c1719 62%)':'radial-gradient(circle at '+x+'% '+y+'%,'+c[1]+','+c[0]+' 65%,#06070b)'}}>
 {(kind==='city'||kind==='night'||kind==='tropical')&&<Sky m={m} night={kind==='night'} tropical={kind==='tropical'}/>}
 {kind==='interior'&&<><div style={{position:'absolute',left:90,top:85,width:1740,height:800,border:'14px solid #e6dfd113',borderRadius:12,background:'linear-gradient(135deg,#ffffff0a,#00000000)'}}/><div style={{position:'absolute',left:110,top:875,width:1700,height:9,background:'#ead7b628'}}/></>}
 {kind==='warm'&&<div style={{position:'absolute',left:0,bottom:0,width:1920,height:260,background:'linear-gradient(transparent,#0e0b0c)'}}/>}
 <div style={{position:'absolute',left:42,top:34,padding:'8px 18px',borderRadius:40,background:'#03070bb0',border:'1px solid #e4eceb44',fontSize:21,color:'#f0efe4',fontWeight:770,letterSpacing:1}}>{tag}</div>
 {children}
 </div>;
};

const Figure=({x,y=850,z=1,coat='#c6d9d6',hair='#23262c',arm=0,walk=0,skin='#e0b99d',dress=false}:{x:number;y?:number;z?:number;coat?:string;hair?:string;arm?:number;walk?:number;skin?:string;dress?:boolean})=><svg viewBox='0 0 185 480' style={{position:'absolute',left:x,top:y-480*z,width:185*z,height:480*z,filter:'drop-shadow(0 10px 18px #0009)'}}>
 <path d='M54 32 Q88 -6 124 28 L127 68 L47 67 Z' fill={hair}/><ellipse cx='88' cy='50' rx='36' ry='42' fill={skin}/><path d='M54 80 Q88 68 125 80 L145 255 L39 255 Z' fill={coat}/>
 {dress&&<path d='M55 175 L125 175 L162 345 L18 345 Z' fill={coat}/>}
 <path d={'M49 105 L24 '+(260+arm)+' M130 105 L159 '+(250-arm)} stroke={coat} strokeWidth='25' strokeLinecap='round'/>
 <path d={'M65 250 L'+(54+walk)+' 459 M116 250 L'+(127-walk)+' 460'} stroke='#778c9e' strokeWidth='28' strokeLinecap='round'/>
 <ellipse cx='79' cy='50' rx='3' ry='3' fill='#473b3c'/><ellipse cx='104' cy='50' rx='3' ry='3' fill='#473b3c'/></svg>;

const Baby=({x,y,z=1,move=0,blanket='#d8a7a8'}:{x:number;y:number;z?:number;move?:number;blanket?:string})=><svg viewBox='0 0 420 260' style={{position:'absolute',left:x,top:y,width:420*z,height:260*z,transform:'translateY('+Math.sin(move*Math.PI*2)*5+'px)',filter:'drop-shadow(0 15px 12px #0005)'}}>
 <path d='M44 127 Q90 55 196 50 Q310 45 385 132 L329 236 Q178 257 51 181 Z' fill={blanket}/><ellipse cx='167' cy='105' rx='69' ry='59' fill='#e8c5a4'/><path d='M106 85 Q117 35 181 44 Q225 45 231 93 Q199 69 170 74 Q135 68 106 85 Z' fill='#3c3032'/><ellipse cx='146' cy='107' rx='4' ry='3' fill='#3d3839'/><ellipse cx='190' cy='107' rx='4' ry='3' fill='#3d3839'/><path d='M154 132 Q166 138 176 131' stroke='#a16e69' strokeWidth='3' fill='none'/><path d='M236 112 Q266 93 273 126' stroke='#e9c8b4' strokeWidth='18' fill='none' strokeLinecap='round'/>
</svg>;

const Hospital=({m,p,country}:{m:M;p:number;country:'FI'|'NL'|'CR'|'JP'})=>{
 const names:{[key:string]:string}={FI:'HELSINKI · 2026',NL:'NETHERLANDS · 2026',CR:'COSTA RICA · 2026',JP:'OSAKA · 2026'};
 const v=m.variant%4,trop=country==='CR',night=country==='JP'||country==='FI';
 return <Stage m={m} kind={night?'night':trop?'tropical':'city'} tag={names[country]}>
 <div style={{position:'absolute',left:135,top:148,width:650,height:560,border:'20px solid #d1d7d5',borderRadius:12,boxShadow:'0 20px 80px #0008',background:'linear-gradient(#a3bbc5aa,#27404d88)'}}/>
 <div style={{position:'absolute',left:810,top:0,width:1110,height:915,background:'linear-gradient(92deg,#c2cbc6f0,#d7d5cc 55%,#a9ada8f0)',clipPath:'polygon(0 0,100% 0,100% 100%,8% 100%)'}}/>
 <div style={{position:'absolute',left:940,top:500,width:850,height:300,borderRadius:40,background:'#c8d2d0',border:'15px solid #f4f2e8',boxShadow:'0px 40px 70px #0007'}}/>
 <div style={{position:'absolute',left:1090,top:468,width:430,height:80,borderRadius:36,background:'#f3f0e5'}}/>
 {v===0&&<><Figure x={1050} y={720} z={.7} coat='#9ca9b3' hair='#483439' arm={12*show(p)}/><Figure x={1510} y={750} z={.75} coat='#454f65' skin='#d4aa8b' arm={-20*show(p)}/></>}
 {v===1&&<><Figure x={1530} y={730} z={.72} coat='#f2eee6' arm={-20*show(p)} hair='#554641'/><div style={{position:'absolute',left:1230,top:420,width:155,height:55,background:'#f1eee6',borderRadius:25,transform:'rotate('+(-20+20*show(p))+'deg)'}}/></>}
 {v===2&&<><Figure x={1480} y={750} z={.72} coat='#f3e9dc' arm={25*show(p)}/><div style={{position:'absolute',left:1150,top:300,width:430,height:180,borderRadius:25,background:'#edeee7',border:'9px solid #e5e0d9'}}/><Caption x={1210} y={347} t={country==='JP'?'20:18':country==='FI'?'08:10':country==='CR'?'15:26':'10:14'} size={68} w={310} color='#556977' align='center'/></>}
 {v===3&&<><Figure x={1460} y={790} z={.75} coat='#d7b8a6' arm={-15*show(p)}/><div style={{position:'absolute',left:1100,top:540,width:600,height:5,background:'#aac4c5'}}/></>}
 <Baby x={1100+(v===1?120:0)} y={525-(v===1?40:0)} z={v===2?1.1:1.06} move={p} blanket={country==='FI'?'#e7b9bd':country==='NL'?'#e2d3b1':country==='CR'?'#d4c999':'#bacddc'}/>
 <div style={{position:'absolute',left:835,top:810,width:1020,height:115,background:'#293540be'}}/>
 </Stage>;
};

const Cafe=({m,p}:{m:M;p:number})=><Stage m={m} kind='night' tag='HELSINKI · 人生を振り返る'>
 <div style={{position:'absolute',left:155,top:178,width:720,height:620,border:'24px solid #8d8375',background:'#0b1927bb',boxShadow:'0px 30px 90px #0009'}}/>
 {Array.from({length:11}).map((_,i)=><div key={i} style={{position:'absolute',left:185+i*65,top:250+(i%4)*70,width:8,height:8,borderRadius:'50%',background:'#eadca2'}}/>)}
 <div style={{position:'absolute',left:920,top:665,width:740,height:46,borderRadius:18,background:'#70533e',boxShadow:'0 15px 20px #0008'}}/>
 <div style={{position:'absolute',left:960,top:705,width:28,height:180,background:'#6e503d'}}/><div style={{position:'absolute',left:1540,top:705,width:28,height:180,background:'#6e503d'}}/>
 <Figure x={1070+(m.variant%3)*65} y={680} z={.82} coat='#b9a999' arm={25*show(p)}/><Figure x={1500} y={690} z={.78} coat='#879b94' arm={-14*show(p,.3,.8)}/>
 <div style={{position:'absolute',left:1360,top:624,width:90,height:65,border:'8px solid #f0e7d3',borderRadius:'0 0 35px 35px',background:'#6d4939'}}/>
 {m.variant%3===1&&<Chip x={280} y={310} w={470} t='あなたの人生は何点？' opacity={show(p)} accent='#ecd39f'/>}
 {m.variant%3===2&&<Caption x={250} y={330} w={540} t='仕事・家族・友人・記憶\nすでに生きた時間の評価' size={40} opacity={show(p)}/>}
 </Stage>;

const Chart=({m,p,kind='adult'}:{m:M;p:number;kind?:'adult'|'child'|'inequality'})=>{
 const names=kind==='adult'?['フィンランド','アイスランド','デンマーク','コスタリカ']:kind==='child'?['精神的な幸福','身体的健康','学力・社会的技能']:['家庭の条件','機会へのアクセス','生活満足度'];
 const vals=kind==='adult'?[.97,.89,.87,.84]:kind==='child'?[.91,.8,.75]:[.8,.63,.72];
 return <Stage m={m} tag={kind==='adult'?'WORLD HAPPINESS REPORT 2026':kind==='child'?'UNICEF REPORT CARD 20 / 2026':'家庭の経済状況による違い'} kind='black'>
 <div style={{position:'absolute',left:260,top:175,width:1400,height:650,borderRadius:28,background:'#111d28ef',border:'3px solid #d6d7d727',boxShadow:'0 30px 100px #0009'}}/>
 {names.map((n,i)=><React.Fragment key={n}><Caption x={325} y={265+i*145} size={30} w={400} t={n} opacity={show(p,.03+i*.08,.19+i*.08)}/><div style={{position:'absolute',left:770,top:265+i*145,width:720*vals[i]*show(p,.09+i*.07,.65+i*.06),height:56,borderRadius:8,background:kind==='adult'?['#e0c69b','#a7c5d8','#90bbb5','#b8cfa3'][i]:['#8dc5ba','#b2c2d1','#e9bf8a'][i%3],boxShadow:'0 8px 18px #0006'}}/></React.Fragment>)}
 {kind==='adult'&&<Caption x={390} y={790} t='現在の居住者の人生評価 ≠ 2026年出生児の将来予測' size={30} w={1220} align='center'/>}
 </Stage>;
};

const Classroom=({m,p,alone=false}:{m:M;p:number;alone?:boolean})=><Stage m={m} tag={alone?'教室で孤独を感じる少年':'学校で得られるもの'} kind='interior'>
 <div style={{position:'absolute',left:125,top:140,width:605,height:440,background:'linear-gradient(#d8e1dc,#93b3ae)',border:'21px solid #e9ddcd'}}/>
 <div style={{position:'absolute',right:150,top:200,width:680,height:290,background:'#31534f',border:'22px solid #c9baa0',borderRadius:15}}/>
 <div style={{position:'absolute',left:90,top:780,width:1750,height:85,background:'#695541'}}/>
 {Array.from({length:5}).map((_,i)=><div key={i} style={{position:'absolute',left:220+i*330,top:625+(i%2)*70,width:260,height:130,background:'#aa8664',borderRadius:12,boxShadow:'0 16px 12px #0005'}}/>)}
 <Figure x={alone?330:285} y={750} z={.53} coat={alone?'#708a9a':'#d3ccb7'} hair='#302e34' arm={alone?4:Math.sin(p*5)*15}/>
 {!alone&&Array.from({length:4}).map((_,i)=><Figure key={i} x={650+i*280} y={740+(i%2)*30} z={.46} coat={['#b1b8c5','#d4ad98','#9bb5ab','#c4bea5'][i]} walk={i%2?15:0}/>)}
 {alone&&<><div style={{position:'absolute',left:870,top:390,width:330,height:8,background:'#d9d0b7',opacity:show(p,.3,.7)}}/><Caption x={960} y={550} size={39} w={630} t='良い成績と、安心できる毎日は\n同じではない。' opacity={show(p,.25,.6)}/></>}
 </Stage>;

const TwoHomes=({m,p}:{m:M;p:number})=>{
 const v=m.variant%3;
 return <Stage m={m} tag='同じ国、異なる家庭' kind='warm'>
 <div style={{position:'absolute',left:95,top:175,width:800,height:715,background:'#a6a5a14d',border:'16px solid #e0cbb35b'}}/>
 <div style={{position:'absolute',right:95,top:175,width:800,height:715,background:'#1b242aac',border:'16px solid #a2a5a14c'}}/>
 <div style={{position:'absolute',left:963,top:170,width:7,height:730,background:'#e0d8c576'}}/>
 <div style={{position:'absolute',left:190,top:680,width:590,height:65,background:'#cda77e',borderRadius:13}}/>
 <div style={{position:'absolute',left:1090,top:660,width:520,height:65,background:'#605246',borderRadius:13}}/>
 <Figure x={270+(v===1?50:0)} y={750} z={.55} coat='#bfcab8' arm={25*show(p)}/><Figure x={565} y={760} z={.53} coat='#d0aaa6' arm={-23*show(p,.2,.65)}/>
 <Figure x={1220+(v===2?150:0)} y={760} z={.55} coat='#8499ab'/>
 {v===1&&<Caption x={185} y={360} t='夕食を囲む家族' size={42} w={630}/>}
 {v===2&&<Caption x={1150} y={360} t='仕事帰りを待つ子ども' size={42} w={640}/>}
 </Stage>;
};

const Doors=({m,p}:{m:M;p:number})=><Stage m={m} tag='あなたが出生前に選べるのは国だけ' kind='black'>
 {['FINLAND','NETHERLANDS','COSTA RICA','JAPAN'].map((name,i)=><React.Fragment key={name}>
 <div style={{position:'absolute',left:105+i*445,top:245,width:350,height:605,borderRadius:'145px 145px 6px 6px',background:['linear-gradient(#c2d3df,#293648)','linear-gradient(#d3b6a2,#423a38)','linear-gradient(#9db4a2,#264c44)','linear-gradient(#d9c4a9,#383344)'][i],border:'15px solid #ebdfca66',boxShadow:'0 20px 70px #0009',transform:'perspective(900px) rotateY('+(m.variant%4===i?-(show(p)*25):0)+'deg)'}}/>
 <Caption x={122+i*445} y={335} t={name} size={24} w={330} align='center'/>
 <div style={{position:'absolute',left:390+i*445,top:572,width:14,height:14,borderRadius:'50%',background:'#ffdb89'}}/>
 </React.Fragment>)}
 {m.variant%3===2&&<Caption x={330} y={890} t='家族の収入や健康状態は選べない。' w={1270} size={43} align='center' opacity={show(p)}/>}
 </Stage>;

const Book=({m,p,sen=false}:{m:M;p:number;sen?:boolean})=><Stage m={m} tag={sen?'AMARTYA SEN · 実際に選べる生き方':'JOHN RAWLS · 無知のヴェール'} kind='warm'>
 <div style={{position:'absolute',left:210,top:250,width:1380,height:600,background:'#4a382b',borderRadius:24,transform:'rotate(-3deg)',boxShadow:'0 20px 90px #000c'}}/>
 <div style={{position:'absolute',left:380,top:180,width:1100,height:620,background:'#ded1b2',borderRadius:'8px 45px 45px 8px',borderLeft:'42px solid #8a6f52',boxShadow:'0 10px 45px #0008',transform:'rotate('+(-3+show(p)*3)+'deg)'}}/>
 <Caption x={530} y={280} size={51} w={790} color='#423b35' t={sen?'ケイパビリティ・アプローチ\n何ができる機会を持つか':'無知のヴェール\n出生先の立場を知らずに考える'}/>
 {m.variant%3!==0&&<div style={{position:'absolute',right:190,top:410,width:540,height:360,background:'#202a36c5',border:'3px solid #dcc79c88',borderRadius:20,opacity:show(p,.3,.75)}}/>}
 </Stage>;

const LifeLine=({m,p,adult=false}:{m:M;p:number;adult?:boolean})=><Stage m={m} tag={adult?'失業のあとにも続く選択':'不合格のあとにも続く選択'} kind='night'>
 <div style={{position:'absolute',left:0,right:0,bottom:0,height:275,background:'#253540'}}/>
 <Figure x={330+(m.variant%2)*155} y={810} z={.87} coat={adult?'#b8baa4':'#acc2d2'} arm={15*show(p)}/>
 <svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0}}>
 <path d='M470 770 L790 580 L1020 480 L1390 330' fill='none' stroke='#dfc17b' strokeWidth='13' strokeLinecap='round' strokeDasharray='1600' strokeDashoffset={1600*(1-show(p,.1,.85))}/>
 <path d='M790 580 L970 710 L1400 730' fill='none' stroke='#9bc4cd' strokeWidth='10' strokeDasharray='1500' strokeDashoffset={1500*(1-show(p,.28,.94))}/>
 {[ [790,580],[1020,480],[1390,330],[970,710],[1400,730] ].map(([x,y],i)=><circle key={i} cx={x} cy={y} r='15' fill={i>2?'#9bc4cd':'#dfc17b'} opacity={show(p,.1+i*.08,.3+i*.08)}/>)}
 </svg>
 <Chip x={1080} y={160} w={510} t={adult?'別の働き方を探す':'別の学び方を探す'} opacity={show(p,.35,.7)} size={34}/>
 </Stage>;

const Capability=({m,p}:{m:M;p:number})=><Stage m={m} tag='満足度と、実際にできることは異なる' kind='interior'>
 <div style={{position:'absolute',left:340,top:240,width:1240,height:480,border:'4px solid #e6d3b560',borderRadius:28}}/>
 <Figure x={465} y={790} z={.8} coat='#8ea6a3'/><Figure x={1280} y={790} z={.8} coat='#b9a0ab'/>
 <svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0}}><path d='M715 640 L910 440 L1125 440' stroke='#ddb97f' strokeWidth='12' fill='none' strokeDasharray='900' strokeDashoffset={900*(1-show(p,.1,.7))}/><path d='M1510 640 L1400 460 L1290 460' stroke='#9cc5c5' strokeWidth='10' fill='none' strokeDasharray='900' strokeDashoffset={900*(1-show(p,.3,.85))}/></svg>
 {m.variant%3===0?<Chip x={725} y={270} w={510} t='同じ収入 ≠ 同じ機会' opacity={show(p)} accent='#dcb778'/>:m.variant%3===1?<Chip x={725} y={270} w={510} t='必要な支援や設備の違い' opacity={show(p)} accent='#a3c9cd'/>:<Chip x={725} y={270} w={510} t='価値ある生き方を実現できるか' opacity={show(p)} accent='#c7aaa9'/>}
 </Stage>;

const Globe=({m,p}:{m:M;p:number})=><Stage m={m} tag='一人ひとりの人生と、国の平均値' kind='black'>
 <svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0}}><circle cx='960' cy='555' r='330' fill='#1d414c' stroke='#9fbdbc' strokeWidth='5'/><ellipse cx='960' cy='555' rx='140' ry='330' fill='none' stroke='#d6c9ac' strokeWidth='4'/><ellipse cx='960' cy='555' rx='330' ry='110' fill='none' stroke='#d6c9ac' strokeWidth='4'/><path d='M740 390 L840 330 L930 370 L940 500 L820 540 L790 660 L670 610 Z M1030 640 L1100 540 L1275 575 L1200 730 L1090 800 Z' fill='#789e8c' opacity={show(p,.12,.6)}/></svg>
 {['ヘルシンキ','オランダ','コスタリカ','大阪'].map((t,i)=><Chip key={t} x={60+(i%2)*1370} y={210+Math.floor(i/2)*480} w={450} h={105} t={t} opacity={show(p,.08+i*.12,.3+i*.12)} accent={['#a5cad7','#d4bc9b','#b7d0a6','#bcb6d3'][i]}/>)}
 </Stage>;

const ClockFuture=({m,p}:{m:M;p:number})=><Stage m={m} tag={m.phase==='future_2036'?'2036 · 十歳になった子どもたち':'2046 · 二十歳になった子どもたち'} kind='city'>
 <div style={{position:'absolute',left:130,top:490,width:1660,height:20,background:'#dee2d055'}}/>
 {Array.from({length:4}).map((_,i)=><div key={i} style={{position:'absolute',left:130+i*430,top:250+(i%2)*35,width:360,height:620,background:['#233d4d','#50635e','#6c5b4a','#414956'][i],border:'7px solid #d4d4cd80',borderRadius:14}}/>)}
 {Array.from({length:4}).map((_,i)=><Figure key={i} x={235+i*427+show(p,.05+i*.05,.4+i*.05)*55} y={825} z={m.phase==='future_2036'? .57:.79} coat={['#c7b9ba','#a8bab8','#d4b785','#b6bfd2'][i]} walk={12*Math.sin(p*7+i)}/>)}
 <Caption x={410} y={148} t={m.phase==='future_2036'?'十年後、四人はそれぞれの毎日を生きる':'二十年後、四人はそれぞれの未来を考える'} size={43} w={1100} align='center'/>
 </Stage>;

const ReturnBabies=({m,p}:{m:M;p:number})=><Stage m={m} tag='2026 · 四つの病室へ戻る' kind='black'>
 {['FINLAND','NETHERLANDS','COSTA RICA','JAPAN'].map((t,i)=><React.Fragment key={t}><div style={{position:'absolute',left:95+i*445,top:215,width:400,height:635,borderRadius:30,background:['#344859','#756a60','#456d61','#424f63'][i],border:'6px solid #d3d7d330',opacity:.65+.35*show(p,.06+i*.1,.36+i*.1)}}/><Caption x={125+i*445} y={260} t={t} size={23} w={340} align='center'/><Baby x={120+i*445} y={500+(i%2)*35} z={.73} move={p} blanket={['#e1b6be','#e6ccad','#d5c89a','#b8cddd'][i]}/></React.Fragment>)}
 {m.variant%3===2&&<Caption x={260} y={865} t='誰一人、自分の人生の始まりを選んでいない。' size={40} w={1400} align='center' opacity={show(p)}/>}
 </Stage>;

const ChoiceTree=({m,p,mode='choices'}:{m:M;p:number;mode?:string})=><Stage m={m} tag={mode==='ending'?'選べなかった始まりを、選び直していく時間':mode==='choice'?'人生の形が変わったときにも':'一つの人生から、別の可能性へ'} kind='black'>
 <svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0}}>
 <path d='M270 690 L560 690 L770 485 L1050 485 L1280 275 L1550 275' stroke='#d6b576' strokeWidth='16' strokeLinecap='round' strokeLinejoin='round' fill='none' strokeDasharray='1850' strokeDashoffset={1850*(1-show(p,.05,.8))}/>
 <path d='M770 485 L1040 735 L1370 740 L1550 570' stroke='#8bb7c1' strokeWidth='12' strokeLinecap='round' fill='none' strokeDasharray='1350' strokeDashoffset={1350*(1-show(p,.2,.88))}/>
 <path d='M1050 485 L1350 465 L1600 800' stroke='#b49cc7' strokeWidth='10' strokeLinecap='round' fill='none' strokeDasharray='1300' strokeDashoffset={1300*(1-show(p,.38,.98))}/>
 {[ [270,690],[560,690],[770,485],[1050,485],[1280,275],[1550,275],[1040,735],[1370,740],[1550,570],[1350,465],[1600,800] ].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i===0?29:17} fill={i%3===0?'#cbb37d':i%3===1?'#9bb7bc':'#bbb2cf'} opacity={show(p,.04+i*.055,.24+i*.055)}/>)}
 </svg>
 {mode==='ending'&&<Caption x={205} y={190} t='人生とは、\n選べなかった始まりを、\n選び直していく時間である。' size={73} w={1520} align='center' opacity={show(p,.25,.75)}/>}
 {mode==='choice'&&<Caption x={530} y={770} t='幸福の正解を先に決める必要はない。' size={42} w={1000} align='center' opacity={show(p,.15,.55)}/>}
 </Stage>;

const Scene=({m,p}:{m:M;p:number})=>{
 const v=m.variant%4;
 switch(m.phase){
 case 'birth_finland': return <Hospital m={m} p={p} country='FI'/>;
 case 'birth_netherlands': return <Hospital m={m} p={p} country='NL'/>;
 case 'birth_costarica': return <Hospital m={m} p={p} country='CR'/>;
 case 'birth_japan': return <Hospital m={m} p={p} country='JP'/>;
 case 'opening_question': return <Doors m={m} p={p}/>;
 case 'finland_cafe': return <Cafe m={m} p={p}/>;
 case 'world_happiness': return <Chart m={m} p={p} kind='adult'/>;
 case 'adult_baby_contrast': return v%2===0?<Cafe m={m} p={p}/>:<Hospital m={m} p={p} country='FI'/>;
 case 'unicef_intro': return <Stage m={m} tag='NETHERLANDS · 少年の朝' kind='city'><div style={{position:'absolute',left:120,top:300,width:670,height:460,background:'#64746d',border:'14px solid #dad5c7'}}/><div style={{position:'absolute',left:280,top:420,width:380,height:230,background:'#e4d1a8'}}/><Figure x={850+show(p)*260} y={810} z={.9} coat='#c5b4a8' walk={20*Math.sin(p*9)}/><Figure x={1300} y={810} z={.83} coat='#98afb3' arm={17*show(p)}/><div style={{position:'absolute',left:920,top:770,width:210,height:90,border:'8px solid #1f2931',borderRadius:'50%'}}/></Stage>;
 case 'child_school': return <Classroom m={m} p={p}/>;
 case 'unicef_dimensions': return <Chart m={m} p={p} kind='child'/>;
 case 'child_health_history': return <Stage m={m} tag='百年以上前の出産' kind='warm'><div style={{position:'absolute',left:240,top:240,width:1420,height:500,background:'#70665c',borderRadius:22,border:'10px solid #a59b87'}}/><Figure x={410} y={790} z={.76} coat='#f0e1c9' hair='#4d403b'/><Figure x={1310} y={800} z={.8} coat='#7e7977' arm={22*show(p)}/><Baby x={735} y={550} z={1.1} move={p} blanket='#e1c8ac'/><div style={{position:'absolute',left:1490,top:260,width:115,height:160,background:'#d8b77b',borderRadius:'50%',opacity:.7}}/></Stage>;
 case 'hospital_modern': return <Hospital m={m} p={p} country='JP'/>;
 case 'survival_choice': return <Stage m={m} tag='人生の選択が始まる、その前に' kind='interior'><Baby x={260} y={430} z={1.3} move={p}/><svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0}}><path d='M800 600 L1050 560 L1340 460 L1610 320' stroke='#cbb98a' strokeWidth='15' fill='none' strokeDasharray='1500' strokeDashoffset={1500*(1-show(p))}/></svg><Chip x={1080} y={245} w={600} t='まず、成長できること。\nその後に、選べること。' opacity={show(p,.3,.78)} size={39}/></Stage>;
 case 'japan_classroom': return <Classroom m={m} p={p} alone/>;
 case 'school_alternative': return <ChoiceTree m={m} p={p}/>;
 case 'same_country_two_homes': return <TwoHomes m={m} p={p}/>;
 case 'inequality_home': return <TwoHomes m={m} p={p}/>;
 case 'inequality_data': return <Chart m={m} p={p} kind='inequality'/>;
 case 'four_doors': return <Doors m={m} p={p}/>;
 case 'veil_of_ignorance': return <Book m={m} p={p}/>;
 case 'second_question': return <ChoiceTree m={m} p={p} mode='choice'/>;
 case 'costarica_street': return <Stage m={m} tag='COSTA RICA · 午後の街' kind='tropical'><div style={{position:'absolute',left:190,top:430,width:580,height:390,background:'#e7bc8b',border:'20px solid #725745'}}/><div style={{position:'absolute',left:860,top:320,width:660,height:500,background:'#c9a27f',border:'18px solid #59443d'}}/><div style={{position:'absolute',left:0,top:790,width:1920,height:200,background:'#343d32'}}/><Figure x={330+show(p)*60} y={850} z={.77} coat='#d5bbb0'/><Figure x={1050+show(p,.2,.8)*130} y={850} z={.74} coat='#9fb9a0'/><Figure x={1480} y={830} z={.66} coat='#e2c797'/></Stage>;
 case 'costarica_contrast': return v%2===0?<Stage m={m} tag='人生評価と、家庭の条件は別の指標' kind='tropical'><Figure x={240} y={860} z={.9} coat='#d5be9e'/><Figure x={1370} y={860} z={.78} coat='#b4c2b2'/><Chip x={610} y={320} w={730} h={205} t='成人の人生評価が高い\n≠\n子ども全員が経済的に安定' opacity={show(p)} size={36}/></Stage>:<Chart m={m} p={p} kind='inequality'/>;
 case 'finland_return': return v%2===0?<Cafe m={m} p={p}/>:<Stage m={m} tag='同じ街の、別の窓' kind='night'><div style={{position:'absolute',left:420,top:220,width:1040,height:600,background:'#283744',border:'15px solid #8b969c'}}/><div style={{position:'absolute',left:680,top:310,width:460,height:380,background:'#bb9e7c'}}/><Figure x={790} y={795} z={.7} coat='#c1a6b2'/><Caption x={1140} y={330} t='国の平均値は\n個人の未来を保証しない。' size={45} w={610} opacity={show(p)}/></Stage>;
 case 'future_2036': return <ClockFuture m={m} p={p}/>;
 case 'future_2046': return <ClockFuture m={m} p={p}/>;
 case 'future_uncertainty': return <ChoiceTree m={m} p={p} mode='choice'/>;
 case 'sen_intro': return <Book m={m} p={p} sen/>;
 case 'capabilities': return <Capability m={m} p={p}/>;
 case 'path_student': return <LifeLine m={m} p={p}/>;
 case 'path_worker': return <LifeLine m={m} p={p} adult/>;
 case 'path_health': return <Hospital m={m} p={p} country='JP'/>;
 case 'path_core': return <ChoiceTree m={m} p={p} mode='choice'/>;
 case 'four_adults': return <ClockFuture m={m} p={p}/>;
 case 'metrics_recap': return v%2===0?<Globe m={m} p={p}/>:<Chart m={m} p={p} kind='child'/>;
 case 'answer_reversal': return <ChoiceTree m={m} p={p} mode='choice'/>;
 case 'possibility': return <Capability m={m} p={p}/>;
 case 'return_four_births': return <ReturnBabies m={m} p={p}/>;
 case 'life_not_fixed': return <ChoiceTree m={m} p={p}/>;
 case 'final_line': return v%3===0?<ReturnBabies m={m} p={p}/>:<ChoiceTree m={m} p={p} mode='ending'/>;
 default: throw new Error('V61 scene phase missing visual design: '+m.phase);
 }
};

export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const m=scenes[Math.max(0,n-1)]??scenes[0],p=clamp(progress);
 const fadeIn=interpolate(p,[0,.025],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const fadeOut=interpolate(p,[.965,1],[1,.8],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const z=m.shotKind==='macro'? .041:m.shotKind==='detail'? .028:m.shotKind==='tracking'? .035:.012;
 const focusX=33+(m.bgSeed*29)%34,focusY=36+(m.bgSeed*17)%28;
 const delta=m.shotKind==='tracking'?38*p:0;
 return <div style={{position:'absolute',inset:0,opacity:fadeIn*fadeOut,transform:'translateX('+delta+'px) scale('+(1+z*Math.sin(p*Math.PI))+')',transformOrigin:focusX+'% '+focusY+'%'}}>
 <Scene m={m} p={p}/>
 <div style={{position:'absolute',left:0,right:0,bottom:0,height:150,background:'linear-gradient(transparent,#0004)',pointerEvents:'none'}}/>
 </div>;
};
