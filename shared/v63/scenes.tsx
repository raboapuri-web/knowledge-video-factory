import React from 'react';
import {interpolate} from 'remotion';
import sceneData from './scene-data.json';

type M={id:string;phase:string;variant:number;shotKind:string;visual:string;bgGroup:string;bgSeed:number};
const data=sceneData as M[];
const font='Noto Sans JP, sans-serif';
const show=(p:number,a=.05,b=.4)=>interpolate(p,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const palette={
 rome:['#221a22','#58403e','#cfac7e','#e0c8a0'],
 tang:['#101b2b','#324256','#d2b78d','#b2c6cc'],
 japan:['#151d29','#40595e','#e7d8bc','#c7a1a0'],
 song:['#131e29','#31535a','#d1c5a1','#c4ae91'],
 italy:['#241b26','#553843','#d8b89b','#af9eab'],
 modern:['#111923','#395263','#e3d8c2','#c4ced7']
} as const;
type Era=keyof typeof palette;
const Label=({x=110,y=140,t,size=40,w=1100,p=1,tone='#f2e9d9'}:{x?:number;y?:number;t:string;size?:number;w?:number;p?:number;tone?:string})=><div style={{position:'absolute',left:x,top:y,width:w,color:tone,opacity:p,fontSize:size,lineHeight:1.4,letterSpacing:1,fontWeight:750,whiteSpace:'pre-line',textShadow:'0 5px 20px #000d'}}>{t}</div>;
const Placard=({x,y,t,p=1,w=520,size=35}:{x:number;y:number;t:string;p?:number;w?:number;size?:number})=><div style={{position:'absolute',left:x,top:y,width:w,minHeight:90,display:'flex',alignItems:'center',justifyContent:'center',padding:20,border:'2px solid #e3cfac99',borderRadius:10,background:'#07121fd9',color:'#fff2dd',textAlign:'center',fontWeight:750,fontSize:size,lineHeight:1.3,opacity:p,boxShadow:'0 15px 40px #0008'}}>{t}</div>;
const Stage=({m,era,place,children,night=false}:{m:M;era:Era;place:string;children:React.ReactNode;night?:boolean})=>{
 const c=palette[era],s=m.bgSeed,x=(s*41)%1350+180,y=(s*13)%240+90;
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:'radial-gradient(ellipse at '+(x/19.2)+'% '+(y/10.8)+'%,'+c[1]+','+c[0]+' 72%)'}}>
 <div style={{position:'absolute',left:0,right:0,top:night?110:0,height:night?370:460,background:'linear-gradient(110deg,'+c[1]+',#f4d29a12 66%,#15202d22)'}}/>
 <div style={{position:'absolute',left:x,top:y,width:night?84:160,height:night?84:160,borderRadius:'50%',background:night?'#f2e6ca':'#d5bc9188',boxShadow:'0 0 100px #e6b98a66'}}/>
 <div style={{position:'absolute',left:0,right:0,bottom:0,height:145,background:'linear-gradient(0deg,#02080df0,transparent)'}}/>
 <div style={{position:'absolute',left:42,top:34,padding:'10px 19px',borderRadius:4,border:'1px solid #f2e6c57a',background:'#081522bd',color:'#f7eddb',fontSize:22,letterSpacing:1,fontWeight:760}}>{place}</div>
 {children}
 </div>;
};
const Figure=({x,y=825,z=1,coat='#a59d8f',skin='#c59d7f',hat=false,arm=0,walk=0,orient=1}:{x:number;y?:number;z?:number;coat?:string;skin?:string;hat?:boolean;arm?:number;walk?:number;orient?:number})=><svg viewBox='0 0 190 480' style={{position:'absolute',left:x,top:y-480*z,width:190*z,height:480*z,transform:'scaleX('+orient+')',filter:'drop-shadow(0 10px 18px #0009)'}}>
 <path d='M42 40 Q82 -4 136 31 L133 80 L38 79 Z' fill='#262529'/>{hat&&<path d='M19 34 L172 34 L139 15 L38 15 Z' fill='#39343a'/>}
 <ellipse cx='88' cy='69' rx='37' ry='43' fill={skin}/><path d='M41 117 Q92 89 140 117 L151 303 L27 303 Z' fill={coat}/>
 <path d={'M42 139 L'+(14+arm)+' 285 M140 139 L'+(178-arm)+' 273'} stroke={coat} strokeWidth='27' strokeLinecap='round'/>
 <path d={'M65 295 L'+(45+walk)+' 461 M117 294 L'+(132-walk)+' 460'} stroke='#414953' strokeWidth='26' strokeLinecap='round'/>
 <ellipse cx='76' cy='69' rx='3' ry='3' fill='#332d2a'/><ellipse cx='106' cy='69' rx='3' ry='3' fill='#332d2a'/>
 </svg>;
const Ink=({x,y,t='',p=1,w=460,h=340}:{x:number;y:number;t?:string;p?:number;w?:number;h?:number})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,opacity:p,transform:'rotate(-3deg)',background:'linear-gradient(140deg,#efddb3,#b9a883)',border:'8px solid #d5c29c',boxShadow:'0 18px 40px #000a',padding:28,boxSizing:'border-box'}}>
 <div style={{height:'100%',borderLeft:'2px solid #705c4d77',display:'flex',gap:25,flexDirection:'row-reverse',justifyContent:'center'}}>
 {(t?t.split('\n'):['山水有清音','月夜懷故國','江流千古','遠客無歸路']).map((v,i)=><div key={i} style={{writingMode:'vertical-rl',fontFamily:'Noto Serif CJK JP, serif',fontSize:Math.min(34,28+w/70),lineHeight:1.4,color:'#352923',height:'94%',overflow:'hidden'}}>{v}</div>)}
 </div></div>;
const River=({s,p,night=true}:{s:number;p:number;night?:boolean})=><div style={{position:'absolute',left:0,top:night?555:520,width:1920,height:480,background:night?'linear-gradient(#233c48,#0b1c2b)':'linear-gradient(#739091,#244b5b)'}}>
 {Array.from({length:18}).map((_,i)=><div key={i} style={{position:'absolute',left:(i*213+s*47)%1900,top:35+i*22,width:100+i%3*75,height:2,transform:'translateX('+(p*16*(i%3+1))+'px)',background:i%3?'#e8d9b26b':'#d7e6eb65'}}/>)}
 </div>;
const Boat=({x,y,p,sail=false}:{x:number;y:number;p:number;sail?:boolean})=><svg viewBox='0 0 600 240' style={{position:'absolute',left:x+p*55,top:y+Math.sin(p*6)*6,width:650,height:260,filter:'drop-shadow(0 18px 16px #000b)'}}>
 <path d='M40 127 Q300 174 561 113 L489 214 Q294 244 110 196 Z' fill='#573c2f' stroke='#bca37e' strokeWidth='8'/>
 {sail&&<path d='M280 35 L280 132 L460 130 Z' fill='#e6d7bc'/>}
 <path d='M160 130 L190 24 L415 20 L447 130 Z' fill='#a78960' stroke='#46382f' strokeWidth='8'/>
 <path d='M190 24 L410 19 L383 0 L218 0 Z' fill='#3a2923'/><path d='M213 75 L386 75 M280 25 L280 130' stroke='#f4dcb0' strokeWidth='5'/>
 </svg>;
const Court=({m,p,era='tang',title='宮廷の任命簿'}:{m:M;p:number;era?:Era;title?:string})=><Stage m={m} era={era} place={title}>
 <div style={{position:'absolute',left:120,top:230,width:1680,height:620,background:'#b19b7d2a',border:'9px solid #e6d6a233'}}/>
 {Array.from({length:9}).map((_,i)=><div key={i} style={{position:'absolute',left:180+i*190,top:180,width:42,height:690,background:era==='japan'?'#675548':'#634b3e',boxShadow:'8px 0 30px #0006'}}/>)}
 <div style={{position:'absolute',left:300,top:665,width:1350,height:60,background:'#664639',borderTop:'8px solid #c09f78'}}/>
 <Figure x={420+(m.variant%3)*110} y={780} z={.72} coat='#6a7181' hat arm={18*show(p)}/>
 <Figure x={1190-(m.variant%2)*75} y={795} z={.69} coat='#8b6b5f' hat orient={-1}/>
 <Ink x={730} y={330} w={490} h={320} p={show(p,.08,.3)} t={'官位授受\n都城官署\n遠任命書'}/>
 </Stage>;
const Study=({m,p,era,name,work,letter=false}:{m:M;p:number;era:Era;name:string;work:string;letter?:boolean})=><Stage m={m} era={era} place={name} night>
 <div style={{position:'absolute',left:150,top:120,width:540,height:580,border:'22px solid #5b4a3d',background:'#a2947350',boxShadow:'0 0 50px #0008'}}/>
 {Array.from({length:9}).map((_,i)=><div key={i} style={{position:'absolute',left:180+i*55,top:220+(i%2)*48,width:5,height:5,borderRadius:'50%',background:'#f7e3aa',opacity:.7}}/>)}
 <div style={{position:'absolute',left:540,top:720,width:1200,height:52,background:'#6b4c38',boxShadow:'0 28px 50px #0009'}}/>
 <Figure x={350} y={755} z={.77} coat={era==='italy'?'#683e48':'#a28c7c'} hat={era!=='italy'} arm={22*show(p)}/>
 <Ink x={850+(m.variant%2)*72} y={400-(m.variant%3)*42} w={640} h={300} p={show(p,.05,.35)} t={work}/>
 {letter&&Array.from({length:4}).map((_,i)=><div key={i} style={{position:'absolute',left:1200+i*26,top:210+i*24,width:210,height:125,transform:'rotate('+(i*8-10)+'deg)',background:'#decaa1',border:'5px solid #c1a882',opacity:show(p,.1+i*.1,.5+i*.1)}}/>)}
 <div style={{position:'absolute',left:735,top:680,width:70,height:30,borderRadius:'50%',background:'#171619',transform:'rotate('+(-10+p*18)+'deg)'}}/>
 </Stage>;
const Road=({m,p,era,place,city=false}:{m:M;p:number;era:Era;place:string;city?:boolean})=><Stage m={m} era={era} place={place} night={era==='rome'}>
 <div style={{position:'absolute',left:0,right:0,top:410,height:440,background:'linear-gradient(#465460aa,#17253055)'}}/>
 {Array.from({length:10}).map((_,i)=><div key={i} style={{position:'absolute',left:i*220-50-(m.bgSeed%5)*25,top:345+(i%3)*42,width:150,height:460,background:city?'#3b3d45':'#293c3b',clipPath:city?'polygon(8% 30%,8% 100%,95% 100%,95% 0)':'polygon(50% 0,85% 62%,73% 64%,100% 100%,0 100%,30% 63%,17% 58%)',opacity:.83}}/>)}
 <div style={{position:'absolute',left:0,bottom:0,width:1920,height:355,background:'#806a5170',clipPath:'polygon(36% 0,68% 0,100% 100%,0 100%)'}}/>
 <Figure x={570+Math.round(p*290)} y={890} z={.83} coat='#9e8973' hat walk={19*Math.sin(p*8)}/>
 <Figure x={1300-Math.round(p*70)} y={925} z={.62} coat='#665665' hat walk={15*Math.sin(p*8+1)}/>
 <div style={{position:'absolute',left:1500,top:660,width:220,height:130,opacity:show(p),border:'9px solid #b6a27c',background:'#584a42'}}/>
 </Stage>;
const Map=({m,p,era,places,heading}:{m:M;p:number;era:Era;places:string[];heading:string})=><Stage m={m} era={era} place={heading}>
 <div style={{position:'absolute',left:250,top:165,width:1380,height:685,background:'#d6c29a',border:'16px solid #907a59',boxShadow:'0 23px 90px #0009'}}/>
 <svg viewBox='0 0 1300 610' style={{position:'absolute',left:295,top:205,width:1280,height:600}}>
 <path d='M80 150 L195 70 L320 150 L360 280 L540 208 L670 285 L760 175 L955 200 L1150 110 L1250 220 L1130 460 L835 530 L640 435 L430 520 L280 410 L95 480 Z' fill='#8eaa9a' stroke='#607e70' strokeWidth='8'/>
 <path d='M105 160 Q360 360 635 230 T1190 460' fill='none' stroke='#638ba0' strokeWidth='27' opacity='.75'/>
 <path d={'M175 370 Q525 '+(190-p*70)+' 960 285'} fill='none' stroke='#783e39' strokeWidth='9' strokeDasharray='19 15' strokeDashoffset={-p*75}/>
 <circle cx={175+785*show(p,.02,.93)} cy={370-85*show(p,.02,.93)} r='18' fill='#8e2520' stroke='#fff7dd' strokeWidth='6'/>
 </svg>
 <Placard x={370} y={735} w={1160} size={32} t={places.join('　→　')} p={show(p,.16,.65)}/>
 </Stage>;
const Harbor=({m,p,era,place,book}:{m:M;p:number;era:Era;place:string;book?:string})=><Stage m={m} era={era} place={place} night>
 <River s={m.bgSeed} p={p}/><Boat x={260+(m.variant%4)*100} y={515} p={p} sail={era==='rome'}/>
 <Figure x={1170+(m.variant%3)*72} y={870} z={.78} coat='#b6a48f' hat arm={15*show(p)}/>
 {book&&<Ink x={1300} y={230} w={475} h={300} t={book} p={show(p,.22,.56)}/>}
 {Array.from({length:12}).map((_,i)=><div key={i} style={{position:'absolute',left:(i*147+m.bgSeed*63)%1920,top:610+i*19,width:60+(i%3)*70,height:2,transform:'translateX('+(p*32)+'px)',background:'#eed8a650'}}/>)}
 </Stage>;
const Instrument=({m,p}:{m:M;p:number})=><Stage m={m} era='tang' place='江州・八一六年　琵琶の音' night>
 <River s={m.bgSeed} p={p}/><Boat x={170} y={540} p={p}/>
 <Figure x={1170} y={890} z={.83} coat='#b2898e' skin='#d5b493' arm={-15*show(p)}/>
 <svg viewBox='0 0 350 600' style={{position:'absolute',left:1280,top:290,width:285,height:515,transform:'rotate('+(-13+7*Math.sin(p*8))+'deg)',filter:'drop-shadow(0 12px 25px #0008)'}}>
 <path d='M160 10 L195 10 L205 185 Q320 250 285 410 Q205 580 95 415 Q60 250 148 185 Z' fill='#bb824e' stroke='#f6d19b' strokeWidth='12'/>
 {Array.from({length:4}).map((_,i)=><path key={i} d={'M'+(157+i*10)+' 35 L'+(140+i*18)+' 510'} stroke='#f7e6c7' strokeWidth='3'/>)}
 </svg>
 {Array.from({length:8}).map((_,i)=><div key={i} style={{position:'absolute',left:870+i*72,top:300-i%3*45,width:4,height:50+i%3*32,borderRadius:10,background:'#e7d7b3',opacity:show(p,.05+i*.055,.24+i*.06),transform:'translateY('+Math.sin(p*12+i)*25+'px)'}}/>)}
 </Stage>;
const Valley=({m,p,fish=false}:{m:M;p:number;fish?:boolean})=><Stage m={m} era='tang' place={fish?'永州・石潭の水面':'永州・竹林と渓谷'}>
 <div style={{position:'absolute',left:0,top:270,width:1920,height:660,background:'linear-gradient(#55716c,#213c40)'}}/>
 {Array.from({length:27}).map((_,i)=><div key={i} style={{position:'absolute',left:(i*97+m.bgSeed*27)%1920,top:40+(i%4)*25,width:10,height:690,transform:'rotate('+(i%3*6-6)+'deg)',background:i%2?'#19332e':'#385c43',borderRight:'6px solid #72915b'}}/>)}
 {Array.from({length:12}).map((_,i)=><div key={i} style={{position:'absolute',left:(i*214+m.bgSeed*17)%1800,top:390+(i%3)*110,width:230,height:115,borderRadius:'55% 45% 30% 50%',background:i%2?'#586059':'#68665b',border:'5px solid #829086',boxShadow:'0 18px 35px #0008'}}/>)}
 <div style={{position:'absolute',left:0,bottom:0,width:1920,height:390,background:'linear-gradient(#7d9e95e8,#143744e8)'}}/>
 {fish&&Array.from({length:9}).map((_,i)=><svg key={i} viewBox='0 0 100 50' style={{position:'absolute',left:260+i*174+p*(i%2?60:-55),top:690+(i%3)*70,width:78,height:40,opacity:.8}}><path d='M8 25 Q43 -5 76 25 Q44 56 8 25 L0 3 L0 47 Z' fill='#dde8d9'/><circle cx='58' cy='23' r='3' fill='#243c43'/></svg>)}
 {!fish&&<Figure x={740+240*show(p)} y={845} z={.8} coat='#8a8478' hat walk={12*Math.sin(p*6)}/>}
 </Stage>;
const Plum=({m,p}:{m:M;p:number})=><Stage m={m} era='japan' place='大宰府・都から遠い春'>
 <div style={{position:'absolute',left:190,top:280,width:1450,height:575,background:'#d2c9af35',border:'12px solid #8d775d'}}/>
 {Array.from({length:9}).map((_,i)=><div key={i} style={{position:'absolute',left:210+i*154,top:285,width:13,height:580,background:'#6a594a'}}/>)}
 <svg viewBox='0 0 1100 610' style={{position:'absolute',left:350,top:110,width:1100,height:650}}>
 <path d='M250 600 Q350 340 480 50 M400 380 Q610 245 850 180 M515 270 Q455 130 320 65 M650 222 Q795 60 990 35' fill='none' stroke='#60463f' strokeWidth='25' strokeLinecap='round'/>
 {Array.from({length:22}).map((_,i)=><circle key={i} cx={320+(i*67)%700} cy={65+(i*83)%365} r={9+i%3*4} fill={i%3?'#efbdc4':'#f7e1de'} opacity={show(p,i*.015,.4+i*.01)}/>)}
 </svg>
 <Figure x={1050} y={885} z={.83} coat='#848a92' hat/>
 </Stage>;
const Bookshelf=({m,p}:{m:M;p:number})=><Stage m={m} era='modern' place='六人が残した作品'>
 {Array.from({length:6}).map((_,i)=>{const labels=['『悲しみの歌』','『琵琶行』','『永州八記』','『菅家後集』','『赤壁賦』','『神曲』'];return <div key={i} style={{position:'absolute',left:110+i*288,top:280+(i%2)*28,width:220,height:490,background:['#a68a72','#485b68','#557065','#988977','#6a7577','#794b4c'][i],border:'8px solid #d1b88e99',borderRadius:8,boxShadow:'14px 25px 55px #0009',opacity:show(p,i*.055,.22+i*.08),transform:'translateY('+(1-show(p,i*.055,.22+i*.08))*90+'px)'}}>
 <Label x={20} y={60} w={180} t={labels[i]} size={36}/><div style={{position:'absolute',left:30,bottom:50,width:148,height:8,background:'#e6d3a5'}}/></div>})}
 </Stage>;
const Present=({m,p,ending=false}:{m:M;p:number;ending?:boolean})=><Stage m={m} era='modern' place={ending?'役職が消えても、言葉は残る':'現代の職場・失われる肩書'}>
 <div style={{position:'absolute',left:200,top:190,width:550,height:540,border:'20px solid #71818b',background:'#9dabb456'}}/>
 {Array.from({length:10}).map((_,i)=><div key={i} style={{position:'absolute',left:245+i*43,top:260+i%3*70,width:7,height:7,background:'#dfd8b7'}}/>)}
 <div style={{position:'absolute',left:790,top:655,width:950,height:48,background:'#65707a'}}/>
 <div style={{position:'absolute',left:1110,top:520,width:300,height:140,background:'#b4a27f',border:'8px solid #e6d5b4'}}/>
 <Figure x={850+120*show(p)} y={810} z={.78} coat='#7b8493' arm={12*show(p)}/>
 {ending&&<><Ink x={1150} y={210} w={515} h={290} t={'官位は消え\n言葉は残る'} p={show(p,.2,.73)}/><Label x={290} y={160} w={830} t='名簿に残る肩書　／　作品に残る視線' size={42} p={show(p)}/></>}
 </Stage>;
const Scene=({m,p}:{m:M;p:number})=>{const v=m.variant%4;
 switch(m.phase){
 case 'prologue_river':return <Harbor m={m} p={p} era='song' place='黄州・一〇八二年　月下の小舟' book={v>=2?'前赤壁賦\n江流與月':undefined}/>;
 case 'prologue_question':return v%2?<Bookshelf m={m} p={p}/>:<Court m={m} p={p} era='song' title='役職の記録と、残された言葉'/>;
 case 'definition':return <Stage m={m} era='modern' place='左遷・流刑・亡命は異なる経験'><Placard x={210} y={325} t='左遷　職や任地の変更' p={show(p,.03,.27)}/><Placard x={770} y={325} t='流刑　居住地の制限' p={show(p,.25,.52)}/><Placard x={1330} y={325} w={400} t='亡命　故郷からの追放' p={show(p,.52,.8)}/></Stage>;
 case 'ovid_rome':return v%2?<Study m={m} p={p} era='rome' name='古代ローマ・紀元八年' work={'別離の夜\n詩と過ち'} letter/>:<Court m={m} p={p} era='rome' title='ローマ・皇帝の処分'/>;
 case 'ovid_coast':return v%2?<Harbor m={m} p={p} era='rome' place='黒海西岸・トミス' book={'遠地の詩人\n帰還の願い'}/>:<Map m={m} p={p} era='rome' heading='ローマから黒海沿岸へ' places={['ローマ','トミス']}/>;
 case 'ovid_letters':return <Study m={m} p={p} era='rome' name='トミス・故郷への手紙' work={'Tristia\nEpistulae ex Ponto'} letter/>;
 case 'ovid_transition':return v%2?<Harbor m={m} p={p} era='rome' place='帰郷できない海辺'/>:<Study m={m} p={p} era='rome' name='追放前から詩人だった' work={'流刑は\n創作の報酬ではない'} letter/>;
 case 'bai_capital':return v%2?<Road m={m} p={p} era='tang' place='長安から江州へ' city/>:<Court m={m} p={p} title='唐・八一五年　江州司馬へ'/>;
 case 'bai_river':return v%2?<Instrument m={m} p={p}/>:<Harbor m={m} p={p} era='tang' place='江州の岸辺・旅人を見送る夜'/>;
 case 'bai_mirror':return v%2?<Study m={m} p={p} era='tang' name='『琵琶行』・二つの人生' work={'都を離れ\n共鳴する人々'}/>:<Instrument m={m} p={p}/>;
 case 'bai_music':return <Instrument m={m} p={p}/>;
 case 'bai_outcome':return v%2?<Map m={m} p={p} era='tang' heading='中心から地方へ　視点の移動' places={['長安','江州']}/>:<Study m={m} p={p} era='tang' name='『琵琶行』の筆' work={'自分の不遇\n他人の物語'}/>;
 case 'liu_reform':return v%2?<Road m={m} p={p} era='tang' place='八〇五年・永州への道'/>:<Court m={m} p={p} title='柳宗元・政治改革と失脚'/>;
 case 'liu_path':return <Valley m={m} p={p}/>;
 case 'liu_fish':return <Valley m={m} p={p} fish/>;
 case 'liu_contrast':return v%2?<Study m={m} p={p} era='tang' name='柳宗元・永州八記' work={'竹・石・水音\n小さな潭'}/>:<Valley m={m} p={p} fish/>;
 case 'michizane_palace':return <Court m={m} p={p} era='japan' title='九〇一年・菅原道真と大宰府'/>;
 case 'michizane_road':return v%2?<Study m={m} p={p} era='japan' name='大宰府・菅家後集' work={'故郷への思い\n都からの距離'}/>:<Map m={m} p={p} era='japan' heading='京から大宰府へ' places={['京都','大宰府']}/>;
 case 'michizane_plum':return <Plum m={m} p={p}/>;
 case 'michizane_after':return v%2?<Study m={m} p={p} era='japan' name='詩が伝える都との距離' work={'菅家後集\n帰れない日々'}/>:<Road m={m} p={p} era='japan' place='九〇三年・大宰府' />;
 case 'su_court':return <Court m={m} p={p} era='song' title='一〇七九年・烏台詩案と蘇軾'/>;
 case 'su_farm':return <Stage m={m} era='song' place='黄州・耕す日々'><div style={{position:'absolute',left:0,top:555,width:1920,height:460,background:'#4a4f3c'}}/>{Array.from({length:17}).map((_,i)=><div key={i} style={{position:'absolute',left:80+i*112,top:605+(i%3)*45,width:18,height:390,background:'#8c7d57',transform:'rotate('+(i%2?12:-12)+'deg)'}}/>)}<Figure x={490+330*show(p)} y={820} z={.83} coat='#9e8a7b' hat walk={15*Math.sin(p*8)}/><Placard x={980} y={235} t='役職の外でも、生活と観察は続く' p={show(p,.23,.68)} w={700}/></Stage>;
 case 'su_coldfood':return <Study m={m} p={p} era='song' name='黄州寒食詩・書と生活' work={'黃州寒食詩\n雨與暮春'}/>;
 case 'su_boat':return <Harbor m={m} p={p} era='song' place='黄州の赤壁・一〇八二年' book={v>=1?'前赤壁賦\n月與江流':undefined}/>;
 case 'su_riverchange':return v%2?<Study m={m} p={p} era='song' name='『赤壁賦』・変化する川' work={'流れる水\n移ろう時間'}/>:<Harbor m={m} p={p} era='song' place='移ろう水・続く川' book={'変化するもの\n変わらないもの'}/>;
 case 'su_two_works':return v%2?<Harbor m={m} p={p} era='song' place='黄州・川の夜' book={'前赤壁賦'}/>:<Study m={m} p={p} era='song' name='黄州・雨の日' work={'寒食詩\n痛みと沈黙'}/>;
 case 'dante_florence':return v%2?<Road m={m} p={p} era='italy' place='一三〇二年・フィレンツェ' city/>:<Court m={m} p={p} era='italy' title='都市国家の政治と追放'/>;
 case 'dante_wander':return v%2?<Study m={m} p={p} era='italy' name='亡命先・神曲を書く' work={'INFERNO\nPURGATORIO\nPARADISO'}/>:<Road m={m} p={p} era='italy' place='故郷の外・旅する詩人' city/>;
 case 'dante_inferno':return <Stage m={m} era='italy' place='『神曲』・地獄をめぐる旅' night><div style={{position:'absolute',left:240,top:180,width:1450,height:750,borderRadius:'50% 50% 18% 18%',background:'radial-gradient(circle at 50% 15%,#953e36,#221723 63%,#0b0913)',boxShadow:'0 0 90px #000 inset'}}/>{Array.from({length:7}).map((_,i)=><div key={i} style={{position:'absolute',left:370+i*87,top:280+i*76,width:1030-i*125,height:490-i*33,border:'14px solid #db8d6c88',borderRadius:'49%',opacity:show(p,i*.07,.25+i*.065)}}/>)}<Figure x={650} y={880} z={.72} coat='#a66856' arm={-12*show(p)}/><Figure x={1000} y={880} z={.78} coat='#7d8b89'/></Stage>;
 case 'dante_language':return v%2?<Study m={m} p={p} era='italy' name='故郷の言葉で書かれた長編詩' work={'COMMEDIA\n俗語で書く旅'}/>:<Map m={m} p={p} era='italy' heading='フィレンツェからラヴェンナへ' places={['フィレンツェ','亡命先','ラヴェンナ']}/>;
 case 'patterns':return <Bookshelf m={m} p={p}/>;
 case 'selection_bias':return <Stage m={m} era='modern' place='作品が残った人だけを見ていないか'><Ink x={220} y={265} t={'名作だけを選ぶ\n見えない声'} p={show(p)} w={620} h={450}/><div style={{position:'absolute',left:1030,top:215,width:560,height:580,border:'9px solid #d2bb91',background:'#131f2a'}}/>{Array.from({length:12}).map((_,i)=><div key={i} style={{position:'absolute',left:1100+(i%4)*105,top:300+Math.floor(i/4)*115,width:56,height:64,background:i<5?'#d6b988':'#d4d6da30',opacity:show(p,i*.03,.36+i*.025)}}/>)}<Placard x={990} y={820} t='苦難が才能を生むとは断定できない' size={30} w={720} p={show(p,.45,.85)}/></Stage>;
 case 'hypothesis_distance':return v%2?<Valley m={m} p={p} fish/>:<Map m={m} p={p} era='tang' heading='社会の中心から、別の景色へ' places={['宮廷','川・谷・地方','読者']}/>;
 case 'modern_scene':return <Present m={m} p={p}/>;
 case 'ending':return v%2?<Bookshelf m={m} p={p}/>:<Present m={m} p={p} ending/>;
 default:throw new Error('V63 unimplemented narrative phase: '+m.phase);
 }};
export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const m=data[Math.max(0,n-1)]??data[0],p=Math.max(0,Math.min(1,progress));
 const fade=show(p,0,.024);
 const zoom=m.shotKind==='macro' ? .035 : m.shotKind==='detail' ? .025 : m.shotKind==='tracking' ? .025 : .011;
 const dx=m.shotKind==='tracking'?p*45:0;
 return <div style={{position:'absolute',inset:0,overflow:'hidden',opacity:fade,transform:'translateX('+dx+'px) scale('+(1+zoom*p)+')',transformOrigin:((m.bgSeed*17)%70+15)+'% '+((m.bgSeed*11)%45+24)+'%'}}>
 <Scene m={m} p={p}/>
 <div style={{position:'absolute',bottom:0,left:0,right:0,height:160,background:'linear-gradient(transparent,#0005)'}}/>
 </div>;
};