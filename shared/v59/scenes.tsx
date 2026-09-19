import React from 'react';
import {interpolate} from 'remotion';
import sceneData from './scene-data.json';

type M={id:string;phase:string;variant:number;shotKind:string;visual:string;bgGroup:string;bgSeed:number};
const all=sceneData as M[];
const font='Noto Sans JP, sans-serif';
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const appear=(p:number,a=.08,b=.34)=>interpolate(p,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const palette=[['#09111c','#20445a','#e9b46e'],['#110e19','#43406c','#a2d8ff'],['#0c1615','#27544f','#d7c08a'],['#17100f','#664533','#f2c585'],['#0c101c','#303d70','#80d6dd'],['#10130d','#3a513b','#f1c27c']];
const Label=({x,y,s,size=43,w=1000,color='#eff4f5',opacity=1}:{x:number;y:number;s:string;size?:number;w?:number;color?:string;opacity?:number})=>
<div style={{position:'absolute',left:x,top:y,width:w,fontFamily:font,fontSize:size,fontWeight:850,color,opacity,lineHeight:1.34,whiteSpace:'pre-line',textShadow:'0 5px 24px #000c'}}>{s}</div>;
const Panel=({x,y,s,w=400,h=135,p=1,color='#b5d4e7'}:{x:number;y:number;s:string;w?:number;h?:number;p?:number;color?:string})=>
<div style={{position:'absolute',left:x,top:y,width:w,height:h,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:20,borderRadius:22,background:'#08121bc9',border:'2px solid '+color+'66',boxShadow:'0 18px 60px #0008',fontSize:32,fontWeight:800,color:'#f4f3ed',lineHeight:1.35,opacity:p,whiteSpace:'pre-line'}}>{s}</div>;
const Set=({m,tag,children}:{m:M;tag:string;children:React.ReactNode})=>{
const q=palette[m.bgSeed%palette.length],a=20+(m.bgSeed*23)%68,b=17+(m.bgSeed*37)%62;
return <div style={{position:'absolute',inset:0,overflow:'hidden',fontFamily:font,background:'radial-gradient(circle at '+a+'% '+b+'%,'+q[1]+', '+q[0]+' 58%, #020509 100%)'}}>
<div style={{position:'absolute',inset:0,opacity:.19,backgroundImage:'linear-gradient(0deg,#fff4 1px,transparent 1px),linear-gradient(90deg,#fff3 1px,transparent 1px)',backgroundSize:(70+(m.bgSeed%7)*17)+'px '+(70+(m.bgSeed%7)*17)+'px'}}/>
<div style={{position:'absolute',left:40,top:28,padding:'7px 18px',fontSize:22,color:'#e8e6df',border:'1px solid #ffffff44',background:'#01070a77',borderRadius:40}}>{tag}</div>
{children}</div>};
const Human=({x,y=800,z=1,coat='#e7d5b9',arm=0}:{x:number;y?:number;z?:number;coat?:string;arm?:number})=><svg viewBox='0 0 180 470' style={{position:'absolute',left:x,top:y-470*z,width:180*z,height:470*z,filter:'drop-shadow(0px 14px 14px #0008)'}}>
<ellipse cx='90' cy='43' rx='37' ry='41' fill='#cbb8a2'/><path d='M49 83 Q90 65 131 83 L145 260 L38 260 Z' fill={coat}/>
<path d={'M49 103 L25 '+(260+arm)+' M130 100 L158 '+(248-arm)} stroke={coat} strokeWidth='27' strokeLinecap='round'/>
<path d='M60 260 L53 459 M117 260 L130 458' stroke='#808f9a' strokeWidth='29' strokeLinecap='round'/>
</svg>;
const Phone=({x,y,p,clock='19:00'}:{x:number;y:number;p:number;clock?:string})=><div style={{position:'absolute',left:x,top:y,width:310,height:555,background:'#080d14',border:'8px solid #72767f',borderRadius:42,boxShadow:'0 22px 80px #000a'}}>
<div style={{position:'absolute',inset:17,borderRadius:25,background:'linear-gradient(#26384f,#0e1927)',overflow:'hidden'}}>
<Label x={75} y={32} s={clock} size={50} w={180}/><div style={{position:'absolute',top:142,left:18,right:18,borderRadius:18,padding:15,background:'#e1e8df',fontSize:24,color:'#142330',transform:'translateY('+(-25+30*appear(p,.1,.5))+'px)'}}>私も時計台の前にいるけど、どこ？</div>
<div style={{position:'absolute',top:300,right:16,left:50,borderRadius:18,padding:13,background:'#c8e4dc',fontSize:23,color:'#172923',opacity:appear(p,.35,.7)}}>地下二階にいるの？</div>
</div></div>;
const Clock=({x,y,t='19:00',p=0,r=90}:{x:number;y:number;t?:string;p?:number;r?:number})=><div style={{position:'absolute',left:x,top:y,width:r*2,height:r*2,borderRadius:'50%',background:'#f1e6ca',border:'12px solid #8b6d43',boxShadow:'0 10px 36px #0008'}}>
<div style={{position:'absolute',left:r-6,top:25,width:12,height:r-31,background:'#32353c',transformOrigin:'bottom center',transform:'rotate('+(p*22)+'deg)'}}/>
<div style={{position:'absolute',left:r-4,top:r-1,width:8,height:r-15,background:'#32353c',transformOrigin:'top center',transform:'rotate('+(p*78)+'deg)'}}/>
<div style={{position:'absolute',top:r+30,left:0,width:r*2,textAlign:'center',fontSize:25,color:'#24282b',fontWeight:800}}>{t}</div></div>;
const Station=({m,p,underground=false,exit=false}:{m:M;p:number;underground?:boolean;exit?:boolean})=>{
const i=m.variant%4;return <Set m={m} tag={underground?'地下二階・もう一つの時計台':'中央改札・待ち合わせ'}>
<div style={{position:'absolute',left:0,top:180,right:0,height:85,background:'#82919a44'}}/><div style={{position:'absolute',left:90,top:255,right:90,bottom:110,border:'4px solid #ffffff2d',background:underground?'linear-gradient(100deg,#2a3945,#1d2631)':'linear-gradient(100deg,#65717b,#303b47)'}}/>
{Array.from({length:7}).map((_,k)=><div key={k} style={{position:'absolute',left:170+k*245,top:265,width:12,height:510,background:'#aeb8bb77'}}/>)}
<div style={{position:'absolute',left:640,top:190,width:660,height:85,background:'#17222e',border:'3px solid #bcc9cf66',display:'flex',alignItems:'center',justifyContent:'center',color:'#eef1e9',fontSize:34,fontWeight:800}}>CENTRAL GATE　中央改札</div>
<Clock x={845+(i===2?45:0)} y={298} p={p} t={underground?'B2':'19:00'} r={85}/>
<Human x={230+(i*95)+p*100} y={810} z={.83} coat='#cfc7bd' arm={15*Math.sin(p*7)}/><Human x={1330-(exit?p*220:0)} y={810} z={.85} coat='#a5b7cb'/>
{i===1&&<Phone x={1290} y={370} p={p}/>}
{i===2&&<Panel x={150} y={290} w={420} h={170} s={underground?'同じ地図上の位置でも
高さが違う':'駅構内には
別の階がある'} p={appear(p)}/>}
{i===3&&<div style={{position:'absolute',left:570,top:590,width:650,height:8,background:'#f1b769',transformOrigin:'left',transform:'scaleX('+appear(p,.12,.73)+')'}}/>}
</Set>};
const Axes=({p,mode='3',originX=920,originY=550,scale=1}:{p:number;mode?:string;originX?:number;originY?:number;scale?:number})=>{
const lines=[{dx:430,dy:0,c:'#efae65',s:'x / 左右'},{dx:-225,dy:260,c:'#7fd1c5',s:'y / 前後'},{dx:0,dy:-355,c:'#91b5ef',s:'z / 高さ'}];
if(mode==='4t')lines.push({dx:235,dy:-215,c:'#e88dc0',s:'t / 時間'});
if(mode==='5')lines.push({dx:-370,dy:-190,c:'#dbc18d',s:'w / 追加方向'});
return <svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0,transform:'scale('+scale+')'}}>
{lines.map((l,i)=><g key={i} opacity={appear(p,.04+i*.08,.35+i*.1)}><line x1={originX} y1={originY} x2={originX+l.dx} y2={originY+l.dy} stroke={l.c} strokeWidth='8'/><circle cx={originX+l.dx} cy={originY+l.dy} r='12' fill={l.c}/><text x={originX+l.dx+18} y={originY+l.dy-18} fill={l.c} fontSize='32' fontWeight='800'>{l.s}</text></g>)}
<circle cx={originX} cy={originY} r='17' fill='#eee'/></svg>};
const Cube=({x=520,y=290,s=250,p=1,color='#90bbdb',alpha=.9}:{x?:number;y?:number;s?:number;p?:number;color?:string;alpha?:number})=><svg viewBox='0 0 600 600' style={{position:'absolute',left:x,top:y,width:s*1.55,height:s*1.55,opacity:alpha}}>
<path d='M 90 160 L 340 160 L 340 410 L 90 410 Z M 225 45 L 475 45 L 475 295 L 225 295 Z M 90 160 L 225 45 M 340 160 L 475 45 M 340 410 L 475 295 M 90 410 L 225 295' stroke={color} strokeWidth='10' fill='none' strokeLinejoin='round' strokeDasharray='2500' strokeDashoffset={2500*(1-appear(p,.03,.8))}/></svg>;
const Hyper=({p,x=430,y=140,size=700,fifth=false}:{p:number;x?:number;y?:number;size?:number;fifth?:boolean})=>{
const v=[[-1,-1,-1],[-1,-1,1],[-1,1,-1],[-1,1,1],[1,-1,-1],[1,-1,1],[1,1,-1],[1,1,1]];
const coords=(outer:number)=>v.map(a=>[450+a[0]*(outer?310:165)+a[2]*(outer?85:45),410+a[1]*(outer?210:120)-a[2]*(outer?70:37)]);
return <svg viewBox='0 0 950 850' style={{position:'absolute',left:x,top:y,width:size*1.15,height:size}}>
{[0,1].map(k=><g key={k}>{v.map((v0,i)=>v.map((v1,j)=>{const diff=v0.filter((q,a)=>q!==v1[a]).length;if(diff!==1||j<i)return null;const a=coords(k)[i],b=coords(k)[j];return <line key={i+'-'+j} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={k?'#d3ac70':'#8bd7df'} strokeWidth='5' opacity={appear(p,.08+(i%4)*.02,.65)}/>}) )}</g>)}
{v.map((_,i)=>{const a=coords(0)[i],b=coords(1)[i];return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke='#f0f5e3' strokeWidth='4' opacity={appear(p,.24+i*.025,.85)}/>})}
{fifth&&v.map((_,i)=>{const a=coords(i%2)[i];return <circle key={i} cx={a[0]+50*Math.sin(p*5+i)} cy={a[1]+80*Math.cos(p*4+i)} r={7+i%3} fill='#ec8fc7' opacity={appear(p,.3,.8)}/>})}
</svg>};
const SphereCut=({p,higher=false}:{p:number;higher?:boolean})=>{
const d=(p-.5)*2,r=Math.sqrt(Math.max(.004,1-d*d));return <Set m={all[0]} tag=''>
<svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0}}>
<ellipse cx='940' cy='670' rx='670' ry='230' fill='#66b4c52a' stroke='#82d6e8a1' strokeWidth='4'/>
<circle cx='940' cy={670+300*(.5-p)} r='288' fill='#9bbbd133' stroke='#bdedfa' strokeWidth='5'/>
<ellipse cx='940' cy='670' rx={285*r} ry={95*r} fill='#d8ac6588' stroke='#f7dba9' strokeWidth='7'/>
<line x1='210' y1='670' x2='1660' y2='670' stroke='#dcf0f6' strokeWidth='4' strokeDasharray='18 13'/>
</svg><Label x={1100} y={150} s={higher?'四次元球の三次元断面':'三次元球の二次元断面'} size={42}/><Label x={300} y={850} s='断面だけが現れ、大きくなり、また消える' size={39}/></Set>};
const Flatland=({m,p,mode='house'}:{m:M;p:number;mode?:string})=><Set m={m} tag='1884年 ― 二次元の住人'>
<div style={{position:'absolute',left:180,top:185,width:1520,height:680,background:'#eee7cb',transform:'perspective(1000px) rotateX(24deg)',boxShadow:'0 20px 80px #0009'}}/>
<svg viewBox='0 0 1500 680' style={{position:'absolute',left:210,top:170,width:1500,height:680}}>
{Array.from({length:12}).map((_,i)=><line key={i} x1={i*135} y1='0' x2={i*135} y2='680' stroke='#baa982' strokeWidth='2' opacity='.55'/>)}
{Array.from({length:7}).map((_,i)=><line key={i} x1='0' y1={i*110} x2='1500' y2={i*110} stroke='#baa982' strokeWidth='2' opacity='.55'/>)}
<path d='M430 160 H1030 V510 H430 Z' fill='none' stroke='#6f5b4a' strokeWidth='30'/>
<polygon points={(210+320*appear(p,.1,.5))+',440 '+(275+320*appear(p,.1,.5))+',375 '+(335+320*appear(p,.1,.5))+',440 '+(275+320*appear(p,.1,.5))+',505'} fill='#618da0'/>
<circle cx='750' cy='340' r='28' fill='#ce4b55'/>
{mode==='lift'&&<><path d='M750 340 Q 1200 70 1260 250' stroke='#eebd63' strokeWidth='9' strokeDasharray='25 18' fill='none' opacity={appear(p)}/><circle cx={750+510*appear(p,.25,.9)} cy={340-90*Math.sin(p*Math.PI)} r='28' fill='#f3a85d'/></>}
</svg>
{mode==='lift'?<Label x={1030} y={145} s='壁を通らず、別の方向へ' w={600}/>:<Label x={1120} y={760} s='宝石には近づけない' w={580}/>}
</Set>;
const StationSlice=({m,p}:{m:M;p:number})=><Set m={m} tag='地図には載らない高さ'>
<div style={{position:'absolute',left:200,top:180,width:1500,height:690,border:'5px solid #dbe5e977',background:'linear-gradient(#9fa2a539,#233d51aa)',borderRadius:24}}/>
{[-2,-1,0,1,2].map((k,i)=><div key={k} style={{position:'absolute',left:310,top:285+i*105,width:1230,height:7,background:i===2?'#f2c36f':'#e9eff166'}}/>)}
<Human x={620} y={575} z={.53} coat='#e6ccb2'/><Human x={1210} y={785} z={.53} coat='#a9bedd'/>
<Label x={350} y={250} s='地上 0階' size={30}/><Label x={360} y={585} s='地下 2階' size={30}/><path style={{position:'absolute',left:995,top:440,height:230,borderLeft:'7px dashed #eec476',opacity:appear(p)}}/>
<Panel x={700} y={130} s='同じ平面座標でも階が違う' w={650} p={appear(p)}/></Set>;
const Rail=({m,p,flat=false}:{m:M;p:number;flat?:boolean})=><Set m={m} tag={flat?'二次元 ― 回り込める':'一次元 ― 前後だけ'}>
<div style={{position:'absolute',left:125,top:565,width:1600,height:20,background:'#bdc4c8',boxShadow:'0 18px 26px #0007'}}/>
{flat&&<div style={{position:'absolute',left:125,top:310,width:1600,height:14,background:'#86a9b5',opacity:.6}}/>}
{[0,1].map((_,i)=><div key={i} style={{position:'absolute',left:280+i*880+(i===0?appear(p,.14,.8)*400:0),top:flat&&i===0?525-175*Math.sin(p*Math.PI):520,width:95,height:75,borderRadius:18,background:i?'#c9a46b':'#7ecbd2',boxShadow:'0 0 18px #0008'}}>
<div style={{position:'absolute',left:23,top:15,width:13,height:13,borderRadius:20,background:'#121f26'}}/><div style={{position:'absolute',right:23,top:15,width:13,height:13,borderRadius:20,background:'#121f26'}}/>
</div>)}
{flat?<Axes p={p} originX={460} originY={760} mode='2' scale={.58}/>:<Label x={530} y={240} s='横へ逃げられない' size={57}/>}</Set>;
const StationDiagram=({m,p}:{m:M;p:number})=><Set m={m} tag='空間座標 + 時刻'>
<Axes p={p} mode='4t'/><Panel x={120} y={300} s='左右 x ・ 前後 y
高さ z ・ 時刻 t' w={480} h={235} p={appear(p)}/><Clock x={1460} y={320} t={m.variant%2?'19:10':'19:00'} p={p} r={75}/></Set>;
const Train=({m,p}:{m:M;p:number})=>{
const x=90+(m.variant%3)*65;return <Set m={m} tag='1905年 ― 特殊相対性理論'>
<div style={{position:'absolute',left:0,right:0,bottom:200,height:15,background:'#c8d1d177'}}/>
<div style={{position:'absolute',left:x+p*220,top:385,width:1550,height:335,borderRadius:'110px 110px 25px 25px',background:'linear-gradient(90deg,#445d70,#9babb1 55%,#344a60)',border:'7px solid #bcccd6'}}>
{Array.from({length:7}).map((_,i)=><div key={i} style={{position:'absolute',left:100+i*203,top:55,width:130,height:115,background:'#142a3a',border:'5px solid #dae5e455'}}/>)}
{[150,460,780,1090,1380].map((v,i)=><div key={i} style={{position:'absolute',left:v,top:310,width:104,height:104,borderRadius:'50%',background:'#20252b',border:'15px solid #79868b'}}/>)}</div>
{m.variant%3===1?<><div style={{position:'absolute',left:370,top:345,width:12,height:175,background:'#fff1b6',boxShadow:'0 0 100px 40px #f2db9b99',opacity:appear(p,.07,.26)}}/><div style={{position:'absolute',left:1550,top:345,width:12,height:175,background:'#fff1b6',boxShadow:'0 0 100px 40px #f2db9b99',opacity:appear(p,.23,.45)}}/></>:<Label x={390} y={170} s='ホームと列車では「同時」の定義が異なる' size={47}/>}
</Set>};
const Worldline=({m,p,cone=false}:{m:M;p:number;cone?:boolean})=><Set m={m} tag={cone?'光円錐 ― 因果関係の境界':'四次元時空 ― 世界線'}>
<svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0}}>
{Array.from({length:9}).map((_,i)=><g key={i}><line x1={290+i*155} y1='180' x2={290+i*155} y2='850' stroke='#82a9bd44' strokeWidth='2'/><line x1='250' y1={220+i*75} x2='1620' y2={220+i*75} stroke='#82a9bd44' strokeWidth='2'/></g>)}
<line x1='260' y1='850' x2='1640' y2='850' stroke='#f1c46c' strokeWidth='7'/><line x1='440' y1='875' x2='440' y2='160' stroke='#96d9e3' strokeWidth='7'/>
{cone?<><path d='M840 540 L540 210 L1140 210 Z M840 540 L540 840 L1140 840 Z' fill='#dfb46b44' stroke='#dfb46b' strokeWidth='6' opacity={appear(p)}/><circle cx='840' cy='540' r='14' fill='#fff'/></>:<><path d='M 720 840 L 720 660 Q 720 600 770 580 L 940 460 L 940 230' fill='none' stroke='#eab16e' strokeWidth='12' strokeDasharray='1250' strokeDashoffset={1250*(1-appear(p,.06,.86))}/><circle cx={720+220*appear(p,.18,.7)} cy={840-610*appear(p,.18,.7)} r='17' fill='#f6e6b8'/></>}
</svg><Label x={470} y={115} s='時間 t ↑' size={36}/><Label x={1370} y={860} s='位置 x →' size={36}/></Set>;
const Gps=({m,p}:{m:M;p:number})=><Set m={m} tag='GPS衛星 ― 相対性理論が支える測位'>
<div style={{position:'absolute',left:310,top:440,width:1250,height:1050,borderRadius:'50%',background:'radial-gradient(circle at 35% 10%,#5aacc7,#1e608a 48%,#082c49 70%)',boxShadow:'0 0 100px #55a3bf45'}}/>
{[0,1,2].map((_,i)=>{const x=450+i*490,y=230+(i%2)*105;return <svg key={i} viewBox='0 0 290 170' style={{position:'absolute',left:x,top:y,width:290,height:170,transform:'translateY('+12*Math.sin(p*7+i)+'px)'}}>
<rect x='0' y='45' width='110' height='80' fill='#607fa9' stroke='#d0dfeb' strokeWidth='3'/><rect x='180' y='45' width='110' height='80' fill='#607fa9' stroke='#d0dfeb' strokeWidth='3'/><rect x='110' y='25' width='70' height='125' rx='14' fill='#d7c391'/><path d='M40 50 V125 M80 50 V125 M210 50 V125 M250 50 V125' stroke='#cdddeb' strokeWidth='3'/></svg>})}
<Label x={1170} y={630} s='衛星の時計：一日あたり約38μsの補正' w={600} size={38}/></Set>;
const Hose=({m,p}:{m:M;p:number})=><Set m={m} tag='1926年 ― 丸められた追加次元'>
<svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0}}>
<path d='M 160 610 C 430 530 670 670 980 560 S 1480 620 1810 490' stroke='#ba9872' strokeWidth='160' strokeLinecap='round' fill='none'/>
<path d='M 160 610 C 430 530 670 670 980 560 S 1480 620 1810 490' stroke='#e0c3a0' strokeWidth='85' strokeLinecap='round' fill='none'/>
<ellipse cx='950' cy='570' rx='85' ry='95' fill='none' stroke='#dcefe6' strokeWidth='8' strokeDasharray='20 14' opacity={appear(p,.14,.52)}/>
<circle cx={580+500*appear(p,.18,.82)} cy={560-46*Math.sin(p*5)} r='15' fill='#181d22' stroke='#eee' strokeWidth='4'/>
</svg>
<Label x={350} y={210} s='遠くでは一本の線。近づくと周回方向がある。' size={43} w={1310}/>
{m.variant%3===1&&<Panel x={1180} y={760} s='非常に小さい方向は
日常の尺度で見分けにくい' w={520} h={175} p={appear(p)}/>}
</Set>;
const Collider=({m,p}:{m:M;p:number})=><Set m={m} tag='追加次元の検証 ― 粒子加速器'>
<svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0}}>
<ellipse cx='940' cy='570' rx='690' ry='300' stroke='#96a7b9' strokeWidth='76' fill='none'/><ellipse cx='940' cy='570' rx='690' ry='300' stroke='#212936' strokeWidth='48' fill='none'/>
{Array.from({length:24}).map((_,i)=>{const a=i*Math.PI/12;return <circle key={i} cx={940+690*Math.cos(a)} cy={570+300*Math.sin(a)} r='13' fill='#d8a96b'/>})}
<circle cx={940+690*Math.cos(p*6)} cy={570+300*Math.sin(p*6)} r='15' fill='#90def0'/>
<circle cx={940-690*Math.cos(p*6)} cy={570-300*Math.sin(p*6)} r='15' fill='#eeb879'/>
{m.variant%3===1&&Array.from({length:16}).map((_,i)=>{const a=i*Math.PI/8;return <line key={i} x1='940' y1='570' x2={940+230*appear(p,.25,.75)*Math.cos(a)} y2={570+230*appear(p,.25,.75)*Math.sin(a)} stroke={i%2?'#7fcadd':'#e6b16b'} strokeWidth='4' opacity={appear(p,.2,.6)}/>})}
</svg><Label x={440} y={145} s='仮説ごとの予測を観測と照合する' size={48} w={1250}/></Set>;
const Compare=({m,p,typ}:{m:M;p:number;typ:'space'|'time'|'five'|'summary'})=><Set m={m} tag='三次元・四次元・五次元を説明する'>
{typ==='summary'?<><Cube x={150} y={310} s={230} p={p}/><Clock x={875} y={400} r={95} p={p}/><Hyper p={p} x={1190} y={280} size={450}/>{['3次元：場所','4次元時空：場所＋時間','5次元時空：さらに1座標'].map((t,i)=><Panel key={t} x={55+i*610} y={780} w={550} h={126} s={t} p={appear(p,.1+i*.12,.42+i*.12)}/>)}</>:
typ==='space'?<><Axes p={p} mode='3'/><Cube x={360} y={400} s={260} p={p}/><Panel x={1160} y={420} s='左右・前後・上下
3つの独立した位置情報' w={540} h={190} p={appear(p)}/></>:
typ==='time'?<><Axes p={p} mode='4t'/><Clock x={1370} y={450} p={p} r={110}/><Panel x={180} y={700} s='出来事には「どこで」に加え「いつ」が必要' w={800} h={135} p={appear(p)}/></>:
<><Axes p={p} mode='5'/><Panel x={150} y={680} s='追加の空間座標を仮定する
実在は未確認' w={720} h={165} p={appear(p)}/></>}
</Set>;
const Phase=({m,p}:{m:M;p:number})=>{
const v=m.variant%4;switch(m.phase){
case 'station':return <Station m={m} p={p} underground={v===2}/>;
case 'station_slice':return <StationSlice m={m} p={p}/>;
case 'question':return <Set m={m} tag='次元とは何を数えるのか'><Axes p={p} mode={v===3?'5':'4t'}/><Panel x={250} y={700} w={1280} h={150} s={v%2?'3次元・4次元・5次元の違い':'場所の情報が足りなかったのか、時刻が違ったのか'} p={appear(p)}/></Set>;
case 'line_world':return <Rail m={m} p={p}/>;
case 'plane_world':return <Rail m={m} p={p} flat/>;
case 'paper_fly':return <Set m={m} tag='紙のアリと空中のハエ'><div style={{position:'absolute',left:270,top:520,width:1300,height:240,transform:'perspective(850px) rotateX(47deg)',background:'#e1d9c0',boxShadow:'0 20px 65px #000a'}}/><div style={{position:'absolute',left:660,top:630,width:19,height:14,borderRadius:10,background:'#3a3430'}}/><div style={{position:'absolute',left:1160,top:290+120*Math.sin(p*4),width:80,height:38,borderRadius:'50%',background:'#9db9cb',boxShadow:'0 0 0 14px #a8d1dc55'}}/><Axes p={p} originX={730} originY={620} scale={.65}/></Set>;
case 'axes':return <Set m={m} tag='独立した座標'><Axes p={p} mode={v===3?'5':'3'}/><Panel x={150} y={710} w={650} h={130} s='新しい方向が増える = 必要な座標が増える' p={appear(p)}/></Set>;
case 'flatland_book':return <Set m={m} tag='1884年 ― E. A. アボット『フラットランド』'><div style={{position:'absolute',left:440,top:210,width:1000,height:680,background:'#cbb88f',border:'18px solid #654c36',transform:'perspective(800px) rotateY('+(-14+15*p)+'deg)',boxShadow:'0 30px 100px #000b'}}/><Label x={660} y={350} s='FLATLAND' size={105} color='#3e3429' w={650}/><Label x={660} y={520} s='A ROMANCE OF MANY DIMENSIONS' size={40} color='#3e3429' w={650}/></Set>;
case 'flatland_house':return <Flatland m={m} p={p} mode={v>=2?'lift':'house'}/>;
case 'sphere_section':return <Set m={m} tag='球の断面 ― 点 → 円 → 点'><svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0}}><ellipse cx='980' cy='640' rx='620' ry='170' fill='#74afc12c' stroke='#a4dce477' strokeWidth='5'/><circle cx='980' cy={550+180*Math.sin(p*5)} r='300' fill='#9abdd741' stroke='#b0dff0' strokeWidth='6'/><ellipse cx='980' cy='640' rx={300*Math.sqrt(Math.max(.01,1-Math.pow(2*p-1,2)))} ry={100*Math.sqrt(Math.max(.01,1-Math.pow(2*p-1,2)))} fill='#e6b57088' stroke='#f2ce8e' strokeWidth='7'/></svg><Label x={420} y={175} s={v%2?'見えていたのは球全体ではない':'断面が大きくなり、小さくなる'} size={49}/></Set>;
case 'fourth_thought':return <Set m={m} tag='四番目の空間方向 ― 思考実験'><Cube x={350} y={280} s={360} p={p}/><div style={{position:'absolute',left:860,top:540,width:66,height:66,borderRadius:40,background:'#e26061',boxShadow:'0 0 65px #ec6d73',transform:'translate('+Math.round(480*appear(p,.17,.8))+'px,'+Math.round(-190*Math.sin(p*Math.PI))+'px)'}}/><Panel x={1110} y={180} s='金庫の壁を通らず
別の空間方向を使う' w={570} h={155} p={appear(p)}/></Set>;
case 'riemann':return <Set m={m} tag='1854年 ― リーマンの幾何学'><div style={{position:'absolute',left:290,top:190,width:1290,height:660,background:'#1b3026',border:'20px solid #5f4732',boxShadow:'0 28px 75px #0008'}}/><Axes p={p} originX={900} originY={580} mode={v>=2?'5':'3'} scale={.85}/><Label x={420} y={275} s='座標を増やして空間を定義する' size={48}/></Set>;
case 'dimension_build':return <Set m={m} tag='線分 → 正方形 → 立方体 → 4次元立方体'><svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0}}><line x1='250' y1='610' x2='470' y2='610' stroke='#d4b270' strokeWidth='12'/><rect x='540' y='500' width='240' height='240' fill='#7dd1c322' stroke='#7dd1c3' strokeWidth='9' opacity={appear(p,.12,.36)}/></svg><Cube x={780} y={375} s={230} p={p}/><Hyper p={p} x={1230} y={350} size={340}/></Set>;
case 'tesseract':return <Set m={m} tag='テッセラクト ― 4次元立方体の投影'><Hyper p={p} x={350+(v%2)*95} y={135} size={800}/>{v>=2?<Panel x={1220} y={400} w={510} h={200} s='頂点16 / 辺32
立方体状の境界8' p={appear(p)}/>:<Label x={1280} y={330} s='投影図は本体ではない' size={42} w={520}/>}</Set>;
case 'four_dimensions':return <Set m={m} tag='同じ「4次元」でも意味は異なる'><Hyper p={p} x={140} y={220} size={620}/><Clock x={1380} y={390} p={p} r={120}/><Panel x={140} y={770} s='数学：空間が4方向' w={700} p={appear(p)}/><Panel x={1080} y={770} s='物理：空間3＋時間1' w={700} p={appear(p)}/></Set>;
case 'time_station':return <StationDiagram m={m} p={p}/>;
case 'einstein':return <Set m={m} tag='1905年 ― アインシュタイン'><div style={{position:'absolute',left:240,top:200,width:1430,height:600,background:'#c1ab87',border:'15px solid #5a4634',boxShadow:'0 28px 85px #000b'}}/><Clock x={420} y={300} p={p} r={125}/><Axes p={p} mode='4t' originX={1190} originY={620} scale={.65}/><Label x={880} y={285} s='時間と空間は
観測者の運動に依存する' size={53} w={760} color='#292e34'/></Set>;
case 'train':return <Train m={m} p={p}/>;
case 'simultaneity':return <Set m={m} tag='遠くの出来事は、誰にとって同時か'><Worldline m={m} p={p}/><Panel x={1100} y={220} w={600} h={160} s='ホームの同時線と
車内の同時線は異なる' p={appear(p)}/></Set>;
case 'minkowski':return <Set m={m} tag='1908年 ― ミンコフスキー'><Axes p={p} mode='4t' originX={1010} originY={690}/><Panel x={230} y={270} w={570} h={200} s='空間と時間を
一つの時空として扱う' p={appear(p)}/></Set>;
case 'worldline':return <Worldline m={m} p={p}/>;
case 'lightcone':return <Worldline m={m} p={p} cone/>;
case 'gps':return <Gps m={m} p={p}/>;
case 'four_compare':return <Compare m={m} p={p} typ={v%2?'space':'time'}/>;
case 'fifth_geometry':return <Set m={m} tag='第5の座標を数学で追加する'><Hyper p={p} x={230} y={155} size={800} fifth/><Panel x={1220} y={360} w={530} h={210} s='5次元立方体
頂点32個' p={appear(p)}/></Set>;
case 'fifth_types':return <Compare m={m} p={p} typ='five'/>;
case 'kaluza':return <Set m={m} tag='1921年 ― カルツァの5次元'><div style={{position:'absolute',left:220,top:185,width:1480,height:680,background:'#1a312b',border:'18px solid #644d38'}}/><Axes p={p} mode='5' originX={1060} originY={570} scale={.88}/><Label x={360} y={280} s='重力 + 電磁気
高次元の幾何学に統合できるか？' size={46} w={620}/></Set>;
case 'klein_hose':return <Hose m={m} p={p}/>;
case 'compactification':return <Set m={m} tag='コンパクト化 ― 見えないほど小さな方向'><svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0}}>{Array.from({length:10}).map((_,i)=><ellipse key={i} cx={280+i*145} cy='560' rx={80-(i*5)} ry={135-i*9} fill='none' stroke={i%2?'#e2c08d':'#88ced6'} strokeWidth='6' opacity={appear(p,.05+i*.05,.25+i*.06)}/>)}</svg><Label x={360} y={245} s='遠くの「線」の中に、閉じた方向があるかもしれない' size={49} w={1250}/></Set>;
case 'collider':return <Collider m={m} p={p}/>;
case 'evidence':return <Set m={m} tag='数学的に定義できる ≠ 実在する'><Hyper p={p} x={200} y={225} size={590}/><Panel x={1000} y={250} w={680} h={215} s='観測で支持：4次元時空
追加空間次元：実在は未確認' p={appear(p)}/></Set>;
case 'misconceptions':return <Set m={m} tag='5次元は未来を選べる？'><Clock x={350} y={400} p={p} r={130}/><Hyper p={p} x={860} y={280} size={580}/><Panel x={570} y={750} w={760} h={125} s='座標が増えるだけでは、時間旅行は導かれない' p={appear(p)}/></Set>;
case 'return_station':return <Station m={m} p={p} exit/>;
case 'teach':return <Compare m={m} p={p} typ={v%3===0?'space':v%3===1?'time':'five'}/>;
case 'summary':return <Compare m={m} p={p} typ='summary'/>;
case 'closing':return <Set m={m} tag='見えない次元を、何で確かめるか'><Cube x={220} y={300} s={260} p={p}/><Worldline m={m} p={p}/><Hyper p={p} x={1180} y={370} size={400}/><Label x={340} y={155} s='数学は構造を定義し、物理学は実在を検証する' size={48} w={1300}/></Set>;
default:throw new Error('V59 missing semantic visual renderer for phase '+m.phase);
}};
export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
const m=all[n-1];if(!m)throw new Error('V59 missing scene metadata '+n);
const p=clamp(progress),zoom=m.shotKind==='detail'?.028:m.shotKind==='macro'?.045:.014;
const opacity=interpolate(p,[0,.025,.955,1],[0,1,1,.84],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
return <div style={{position:'absolute',inset:0,opacity,transform:'scale('+(1+zoom*Math.sin(Math.PI*p))+')',transformOrigin:(38+(n*17)%24)+'% '+(40+(n*19)%20)+'%'}}><Phase m={m} p={p}/></div>;
};
