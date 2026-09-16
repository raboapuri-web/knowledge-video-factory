import React from 'react';
import {interpolate} from 'remotion';
import sceneData from './scene-data.json';

type Meta={id:string;phase:string;variant:number;shotKind:string;visual:string;bgGroup:string;bgSeed:number};
const meta=sceneData as Meta[];
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const font='Noto Sans JP, sans-serif';
const ease=(p:number)=>p*p*(3-2*p);
const lerp=(a:number,b:number,p:number)=>a+(b-a)*ease(p);
const C={ink:'#06080d',paper:'#f3f2ec',muted:'#9aa3ad',gold:'#d6b16b',red:'#c85b62',blue:'#79a9cc',cyan:'#79c8c5',green:'#8cad83',purple:'#a586bc',skin:'#c9a48a'};

const StaticBackdrop=({m,children}:{m:Meta;children?:React.ReactNode})=>{
  const s=m.bgSeed;
  const base=m.phase.includes('morning')||m.phase==='return_room'?'#101925':m.phase.includes('hallway')||m.phase==='night_road'?'#05080e':m.phase.includes('station')?'#111820':m.phase.includes('rubber')?'#171a1c':m.phase.includes('office')?'#11161b':m.phase.includes('dress')?'#14111a':m.phase.includes('illusion')?'#0e1520':m.phase.includes('social')?'#111018':'#080b12';
  const glow=m.phase.includes('morning')||m.phase==='return_room'?'rgba(93,145,195,.20)':m.phase.includes('hallway')?'rgba(211,170,88,.08)':m.phase.includes('rubber')?'rgba(205,222,224,.09)':m.phase.includes('dress')?'rgba(140,100,180,.13)':m.phase.includes('station')?'rgba(80,130,165,.14)':'rgba(100,145,180,.10)';
  const gx=18+(s*17)%66,gy=16+(s*23)%60;
  return <div style={{position:'absolute',inset:0,overflow:'hidden',fontFamily:font,color:C.paper,background:`radial-gradient(circle at ${gx}% ${gy}%,${glow},transparent 34%),linear-gradient(145deg,${base},#030408 72%)`}}>
    <div style={{position:'absolute',left:0,right:0,top:0,height:1,background:'rgba(255,255,255,.06)'}}/>
    <div style={{position:'absolute',left:70,top:50,padding:'7px 14px',borderRadius:999,border:'1px solid rgba(255,255,255,.14)',background:'rgba(0,0,0,.22)',fontSize:18,letterSpacing:1,color:'rgba(255,255,255,.68)'}}>SCENE {m.id}</div>
    {children}
    <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'radial-gradient(circle at 50% 46%,transparent 43%,rgba(0,0,0,.18) 74%,rgba(0,0,0,.64) 100%)'}}/>
  </div>;
};

const Label=({text,x,y,size=34,color=C.paper,align='left'}:{text:string;x:number;y:number;size?:number;color?:string;align?:'left'|'center'|'right'})=><div style={{position:'absolute',left:x,top:y,width:900,fontSize:size,fontWeight:900,lineHeight:1.25,color,textAlign:align,textShadow:'0 5px 24px rgba(0,0,0,.75)',whiteSpace:'pre-line'}}>{text}</div>;
const Dot=({x,y,r=14,color=C.cyan,opacity=1}:{x:number;y:number;r?:number;color?:string;opacity?:number})=><div style={{position:'absolute',left:x-r,top:y-r,width:r*2,height:r*2,borderRadius:'50%',background:color,opacity,boxShadow:`0 0 ${r*2}px ${color}66`}}/>;
const Line=({x,y,w,rot=0,color='rgba(255,255,255,.35)',h=4}:{x:number;y:number;w:number;rot?:number;color?:string;h?:number})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,background:color,transform:`rotate(${rot}deg)`,transformOrigin:'0 50%',borderRadius:4}}/>;
const Arrow=({x,y,w=220,rot=0,color=C.gold,p=1}:{x:number;y:number;w?:number;rot?:number;color?:string;p?:number})=><div style={{position:'absolute',left:x,top:y,width:w*ease(p),height:5,background:color,transform:`rotate(${rot}deg)`,transformOrigin:'0 50%',boxShadow:`0 0 16px ${color}66`}}><div style={{position:'absolute',right:-2,top:-8,width:0,height:0,borderTop:'10px solid transparent',borderBottom:'10px solid transparent',borderLeft:`16px solid ${color}`}}/></div>;

const Person=({x,y=330,scale=1,color='#c9d0d7',dir=1,arm=0,opacity=1}:{x:number;y?:number;scale?:number;color?:string;dir?:number;arm?:number;opacity?:number})=><div style={{position:'absolute',left:x,top:y,width:180,height:500,transform:`scale(${scale}) scaleX(${dir})`,transformOrigin:'top left',opacity}}>
  <div style={{position:'absolute',left:58,top:0,width:72,height:72,borderRadius:'50%',background:color}}/>
  <div style={{position:'absolute',left:39,top:68,width:110,height:210,borderRadius:'40px 40px 28px 28px',background:color}}/>
  <div style={{position:'absolute',left:18,top:90,width:28,height:180,borderRadius:18,background:color,transform:`rotate(${arm}deg)`,transformOrigin:'top'}}/>
  <div style={{position:'absolute',right:18,top:90,width:28,height:180,borderRadius:18,background:color,transform:`rotate(${-arm}deg)`,transformOrigin:'top'}}/>
  <div style={{position:'absolute',left:50,top:268,width:32,height:210,borderRadius:18,background:color,transform:'rotate(2deg)'}}/>
  <div style={{position:'absolute',right:48,top:268,width:32,height:210,borderRadius:18,background:color,transform:'rotate(-2deg)'}}/>
</div>;

const Phone=({x,y,p,text='06:47'}:{x:number;y:number;p:number;text?:string})=><div style={{position:'absolute',left:x,top:y,width:285,height:545,borderRadius:42,border:'9px solid #222831',background:'#0b1118',boxShadow:'0 28px 70px #000a',transform:`rotate(${lerp(-2,2,p)}deg)`}}>
  <div style={{position:'absolute',left:20,right:20,top:48,height:180,borderRadius:24,background:'linear-gradient(160deg,#29445d,#101b28)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:58,fontWeight:900}}>{text}</div>
  <div style={{position:'absolute',left:24,right:24,top:260,height:82,borderRadius:18,background:'rgba(255,255,255,.08)'}}/>
  <div style={{position:'absolute',left:24,right:75,top:370,height:12,borderRadius:9,background:'rgba(255,255,255,.18)'}}/>
  <div style={{position:'absolute',left:24,right:45,top:404,height:12,borderRadius:9,background:'rgba(255,255,255,.10)'}}/>
</div>;

const Bedroom=({p,variant}:{p:number;variant:number})=>{
  const light=lerp(.14,.72,p);
  return <>
    <div style={{position:'absolute',left:0,top:0,width:510,height:1080,background:`linear-gradient(90deg,rgba(95,145,190,${light}),rgba(58,94,126,.05))`,clipPath:'polygon(0 0,72% 0,100% 100%,0 100%)'}}/>
    <div style={{position:'absolute',left:120,top:240,width:560,height:360,borderRadius:18,background:'#151c24',boxShadow:'0 35px 90px #000a'}}/>
    <div style={{position:'absolute',left:160,top:270,width:300,height:95,borderRadius:45,background:'#687a88'}}/>
    <div style={{position:'absolute',right:180,top:205,width:420,height:210,borderRadius:12,background:'#0e141c',border:'2px solid rgba(255,255,255,.08)'}}/>
    <div style={{position:'absolute',right:205,top:250,width:175,height:70,borderRadius:10,background:'#1b2632'}}/>
    <Phone x={1180+Math.sin(p*3)*8} y={400} p={p} text={variant<2?'06:47':'REAL?'} />
    {variant%3===0&&<Label x={760} y={125} size={58} text={'あなたは「部屋を見ている」と思う'} />}
    {variant%3===1&&<><Label x={760} y={125} size={52} text={'机・壁・時計\n全部、当たり前に見える'} /><Arrow x={1020} y={330} w={270} rot={15} p={p}/></>}
    {variant%3===2&&<Label x={770} y={130} size={56} color={C.gold} text={'脳はこの部屋を\n直接見たことがない'} />}
  </>;
};

const Skull=({p,variant}:{p:number;variant:number})=><>
  <div style={{position:'absolute',left:610,top:170,width:700,height:730,borderRadius:'48% 48% 42% 42%',border:'5px solid rgba(255,255,255,.28)',background:'radial-gradient(circle at 48% 42%,rgba(150,92,115,.18),rgba(20,13,22,.85) 60%,rgba(0,0,0,.95))',boxShadow:'inset 0 0 120px #000,0 0 90px #000'}}/>
  <div style={{position:'absolute',left:730,top:290,width:460,height:350,borderRadius:'50%',background:'radial-gradient(circle at 50% 55%,#6e4755,#2a1f2a 70%)',filter:'drop-shadow(0 0 25px #a86a8277)'}}/>
  {Array.from({length:22}).map((_,i)=>{const a=i*.71;return <Dot key={i} x={960+Math.sin(a)*190} y={465+Math.cos(a*1.23)*130} r={6+(i%4)} color={i%2?C.cyan:C.purple} opacity={.35+.55*ease(p)}/>})}
  {variant%3===0&&<Label x={120} y={170} size={50} text={'頭蓋骨の中に\n窓はない'} />}
  {variant%3===1&&<><div style={{position:'absolute',left:210,top:300,width:310,height:205,border:'3px solid rgba(255,255,255,.22)',background:'#111',boxShadow:'0 20px 60px #0009'}}/><Label x={120} y={570} size={39} color={C.red} text={'脳内スクリーンもない'} /></>}
  {variant%3===2&&<><Person x={295} y={430} scale={.38} color={C.gold}/><Label x={120} y={160} size={46} text={'小さな「あなた」も\n座っていない'} /></>}
</>;

const Basement=({p,variant}:{p:number;variant:number})=><>
  <div style={{position:'absolute',left:210,top:180,width:1500,height:700,border:'4px solid #3f4750',background:'#090d11',boxShadow:'inset 0 0 100px #000'}}/>
  <div style={{position:'absolute',left:270,top:250,width:340,height:500,border:'2px solid #343b43',background:'#0d1217'}}/>
  <Person x={350} y={360} scale={.55} color='#c9c0ad'/>
  {Array.from({length:5}).map((_,i)=>{const y=250+i*120;const pulse=(p*1.2+i*.16)%1;return <React.Fragment key={i}><Line x={1180} y={y} w={450} color='rgba(100,160,190,.32)'/><Dot x={1180+450*(1-pulse)} y={y} r={12} color={i%2?C.gold:C.cyan}/></React.Fragment>})}
  <Label x={700} y={150} size={48} text={variant%3===0?'窓のない地下室':variant%3===1?'届くのは「信号」だけ':'外で何が起きたか推理する'} />
  {variant%3===2&&<>{['A','B','C'].map((t,i)=><div key={t} style={{position:'absolute',left:1430,top:300+i*130,width:110,height:74,borderRadius:16,border:'2px solid rgba(255,255,255,.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,fontWeight:900}}>{t}</div>)}</>}
</>;

const SignalPipeline=({p,variant}:{p:number;variant:number})=>{
  const appleX=130,eyeX=670,brainX=1330;
  return <>
    <div style={{position:'absolute',left:appleX,top:360,width:210,height:210,borderRadius:'48% 52% 50% 50%',background:'#a8343b',boxShadow:'inset -22px -15px 40px #5d1720,0 20px 55px #0008'}}/><div style={{position:'absolute',left:245,top:315,width:18,height:70,background:'#594328',transform:'rotate(12deg)'}}/>
    <div style={{position:'absolute',left:eyeX,top:375,width:250,height:145,borderRadius:'50%',background:'#e8e0d5',border:'5px solid #776e66'}}><div style={{position:'absolute',left:92,top:37,width:70,height:70,borderRadius:'50%',background:'#4f7895'}}/><div style={{position:'absolute',left:115,top:60,width:24,height:24,borderRadius:'50%',background:'#090b0e'}}/></div>
    <div style={{position:'absolute',left:brainX,top:300,width:360,height:320,borderRadius:'48%',background:'radial-gradient(circle at 42% 38%,#7a5264,#332635 72%)',boxShadow:'0 0 40px #8c617044'}}/>
    <Arrow x={370} y={435} w={260} p={p} color={C.gold}/><Arrow x={950} y={435} w={320} p={p} color={C.cyan}/>
    {Array.from({length:10}).map((_,i)=><Dot key={i} x={970+lerp(0,290,(p+i*.08)%1)} y={430+Math.sin(i*1.4)*35} r={6} color={i%2?C.cyan:C.blue}/>)}
    <Label x={150} y={140} size={45} text={variant%4===0?'リンゴそのものは\n脳へ行かない':variant%4===1?'光 → 網膜 → 神経信号':variant%4===2?'音も最後は神経信号':'脳は「原因」を逆算する'} />
  </>;
};

const Hallway=({p,variant}:{p:number;variant:number})=>{
  const lamp=variant>=2?lerp(.05,.8,p):.07;
  return <>
    <div style={{position:'absolute',left:300,top:90,width:1320,height:880,background:`linear-gradient(90deg,rgba(212,177,104,${lamp}),rgba(28,31,34,.06) 55%,rgba(0,0,0,.72))`,clipPath:'polygon(0 0,78% 10%,100% 100%,10% 100%)'}}/>
    <div style={{position:'absolute',right:330,top:220,width:160,height:560,background:'#12161a',boxShadow:'0 35px 80px #000'}}/>
    <div style={{position:'absolute',right:350,top:310,width:122,height:310,background:'#0a0c0f',borderRadius:'42% 42% 12% 12%',opacity:variant<3?.95:.45}}/>
    {variant>=3&&<div style={{position:'absolute',right:342,top:300,width:145,height:370}}><div style={{position:'absolute',left:55,top:0,width:36,height:250,background:'#252a2e'}}/><div style={{position:'absolute',left:8,top:55,width:130,height:220,borderRadius:'44% 44% 12% 12%',background:'#14171a',transform:`rotate(${lerp(-2,4,p)}deg)`}}/></div>}
    <Person x={470} y={390} scale={.65} color='#aeb7bf' arm={variant===1?18:0}/>
    <Label x={650} y={120} size={48} color={variant<3?C.red:C.gold} text={variant===0?'廊下の奥に「誰か」がいる':variant===1?'心臓が跳ね、足が止まる':variant===2?'照明をつける':'そこにいたのは、コート'} />
  </>;
};

const Station=({p,variant}:{p:number;variant:number})=><>
  <div style={{position:'absolute',left:0,right:0,top:160,height:90,background:'#25303a',borderTop:'2px solid #627380',borderBottom:'2px solid #0b0e12'}}/>
  <div style={{position:'absolute',left:0,right:0,bottom:0,height:300,background:'linear-gradient(#252a2e,#111519)',clipPath:'polygon(0 22%,100% 0,100% 100%,0 100%)'}}/>
  {Array.from({length:18}).map((_,i)=><Person key={i} x={80+i*105+Math.sin(p*4+i)*18} y={430+((i*37)%75)} scale={.35+((i%3)*.04)} color={i===8?'#c9b78e':'#7f8e99'} opacity={.45+.35*(i%2)}/>) }
  <Person x={360} y={400} scale={.55} color='#c6d0d5' arm={variant>=1?lerp(0,28,p):0}/>
  {variant>=1&&<Person x={1150-lerp(0,170,p)} y={395} scale={.54} color='#c9b78e'/>}
  <Label x={700} y={105} size={48} text={variant%4===0?'友人を待つ脳':variant%4===1?'「あ、来た」':variant%4===2?'近づくと、知らない人':'期待まで使って判断している'} />
</>;

const Predictor=({p,variant}:{p:number;variant:number})=><>
  <div style={{position:'absolute',left:170,top:240,width:650,height:520,borderRadius:28,border:'2px solid rgba(255,255,255,.16)',background:'rgba(11,17,24,.72)',padding:38}}><div style={{fontSize:34,fontWeight:900}}>脳の予想</div><div style={{fontSize:68,fontWeight:1000,marginTop:110,color:C.gold}}>{variant%3===0?'人かも':variant%3===1?'友人かも':'飛んでくる'}</div></div>
  <div style={{position:'absolute',right:170,top:240,width:650,height:520,borderRadius:28,border:'2px solid rgba(255,255,255,.16)',background:'rgba(11,17,24,.72)',padding:38}}><div style={{fontSize:34,fontWeight:900}}>現実からの情報</div><div style={{position:'absolute',left:70,right:70,bottom:90,height:26,borderRadius:16,background:'#1c2933',overflow:'hidden'}}><div style={{height:'100%',width:`${18+82*ease(p)}%`,background:C.cyan}}/></div></div>
  <Arrow x={810} y={500} w={285} p={p} color={C.red}/>
  <Label x={590} y={100} size={49} text={variant%4===3?'知覚は「録画」より「答え合わせ」に近い':'先に予想し、あとで修正する'} />
</>;

const Illusion=({p,variant}:{p:number;variant:number})=>{
  const leftBg=variant%2===0?'#15191e':'#d9d8d2',rightBg=variant%2===0?'#d9d8d2':'#15191e';
  return <>
    <div style={{position:'absolute',left:180,top:250,width:650,height:500,background:leftBg,borderRadius:26}}><div style={{position:'absolute',left:210,top:155,width:230,height:190,background:'#777'}}/></div>
    <div style={{position:'absolute',right:180,top:250,width:650,height:500,background:rightBg,borderRadius:26}}><div style={{position:'absolute',left:210,top:155,width:230,height:190,background:'#777'}}/></div>
    <Line x={845} y={505} w={230} color={C.gold}/>
    <Label x={560} y={100} size={47} text={variant%4===0?'同じ灰色なのに、違って見える':variant%4===1?'脳は周囲の明るさまで計算する':variant%4===2?'白い紙は夕方でも白い':'錯視は「脳の補正」が見える窓'} />
    {variant%4===2&&<div style={{position:'absolute',left:760,top:360,width:390,height:260,background:'#f1efe8',boxShadow:`0 0 ${lerp(15,80,p)}px rgba(240,210,130,.45)`,transform:`rotate(${lerp(-5,5,p)}deg)`}}/>}
  </>;
};

const Dress=({p,variant}:{p:number;variant:number})=><>
  <div style={{position:'absolute',left:720,top:170,width:480,height:720,filter:'drop-shadow(0 35px 70px #000a)'}}><div style={{position:'absolute',left:180,top:0,width:120,height:160,borderRadius:'50% 50% 30% 30%',background:'#1a1b20'}}/><div style={{position:'absolute',left:110,top:140,width:260,height:500,background:variant%2===0?'linear-gradient(90deg,#5f75a3,#17161b,#856b38)':'linear-gradient(90deg,#e4dfc7,#c9b271,#b8a268)',clipPath:'polygon(25% 0,75% 0,100% 100%,0 100%)'}}/></div>
  <div style={{position:'absolute',left:90,top:280,width:470,height:290,borderRadius:24,background:'rgba(255,255,255,.06)',padding:35,fontSize:52,fontWeight:950,color:'#879bd0'}}>青 × 黒</div>
  <div style={{position:'absolute',right:90,top:280,width:470,height:290,borderRadius:24,background:'rgba(255,255,255,.06)',padding:35,fontSize:52,fontWeight:950,color:'#e8dfb4'}}>白 × 金</div>
  {Array.from({length:12}).map((_,i)=><Dot key={i} x={310+((i*131)%1300)} y={680+Math.sin(i*1.4+p*5)*65} r={8} color={i%2?C.blue:C.gold}/>) }
  <Label x={555} y={80} size={45} text={variant%4===0?'同じ画像で、違う色が見える':variant%4===1?'照明条件を脳が推測する':variant%4===2?'推測が違えば、経験も変わる':'「赤」は脳の中で完成する'} />
</>;

const RubberHand=({p,variant}:{p:number;variant:number})=>{
  const brushX=lerp(0,90,p);
  return <>
    <div style={{position:'absolute',left:140,right:140,top:600,height:210,background:'#34383c',transform:'perspective(800px) rotateX(58deg)',transformOrigin:'bottom',boxShadow:'0 35px 70px #000a'}}/>
    <div style={{position:'absolute',left:360,top:405,width:430,height:145,borderRadius:'80px 30px 30px 80px',background:C.skin,opacity:variant===0?.35:.1}}/>
    <div style={{position:'absolute',left:1060,top:405,width:430,height:145,borderRadius:'80px 30px 30px 80px',background:'#c7a487',boxShadow:'0 18px 55px #0008'}}/>
    <div style={{position:'absolute',left:830,top:250,width:90,height:470,background:'#20262b',boxShadow:'0 10px 35px #000'}}/>
    {variant>=1&&<><div style={{position:'absolute',left:590+brushX,top:330,width:18,height:270,background:'#b98f58',transform:'rotate(22deg)',transformOrigin:'bottom'}}/><div style={{position:'absolute',left:1280-brushX,top:330,width:18,height:270,background:'#b98f58',transform:'rotate(-22deg)',transformOrigin:'bottom'}}/></>}
    {variant>=3&&<div style={{position:'absolute',left:1190,top:120,width:180,height:380,transform:`rotate(${lerp(-18,28,p)}deg)`,transformOrigin:'bottom'}}><div style={{position:'absolute',left:65,top:0,width:52,height:300,background:'#84613d'}}/><div style={{position:'absolute',left:0,top:0,width:180,height:70,borderRadius:15,background:'#6f7175'}}/></div>}
    <Label x={560} y={100} size={47} text={variant===0?'本物の手を隠す':variant===1?'本物とゴムの手を同時に撫でる':variant===2?'ゴムの手が「自分の手」に感じ始める':'ハンマーに身体が反応する'} />
  </>;
};

const SelfModel=({p,variant}:{p:number;variant:number})=><>
  <Person x={760} y={270} scale={1.1} color='#b8c4ce'/>
  <div style={{position:'absolute',left:835,top:300,width:160,height:120,borderRadius:20,border:'3px solid rgba(255,255,255,.25)',background:'rgba(20,27,35,.75)'}}/>
  {variant%4===0&&<Label x={170} y={180} size={48} text={'頭の中に\n「操縦席」がある？'} />}
  {variant%4===1&&<><Person x={875} y={330} scale={.18} color={C.gold}/><Label x={1120} y={220} size={42} text={'小さな自分を置くと\nさらに小さな自分が必要'} /></>}
  {variant%4===2&&Array.from({length:5}).map((_,i)=><Person key={i} x={1120+i*110} y={350+i*55} scale={.30-i*.035} color={i%2?C.cyan:C.gold}/>) }
  {variant%4===3&&<>{['身体','位置','行動','連続性'].map((t,i)=><div key={t} style={{position:'absolute',left:240+i*380,top:730-((i%2)*80),width:300,height:120,borderRadius:22,border:'2px solid rgba(255,255,255,.16)',background:'rgba(255,255,255,.05)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:34,fontWeight:900,transform:`translateY(${(1-ease(p))*50}px)`}}>{t}</div>)}</>}
</>;

const BodySignals=({p,variant}:{p:number;variant:number})=><>
  <Person x={760} y={210} scale={1.05} color='rgba(185,201,210,.30)'/>
  <div style={{position:'absolute',left:870,top:430,width:80,height:110,borderRadius:'55% 45% 55% 45%',background:'#b94b55',transform:`scale(${1+.08*Math.sin(p*18)})`,boxShadow:'0 0 25px #b94b5577'}}/>
  <div style={{position:'absolute',left:840,top:570,width:140,height:70,borderRadius:'50%',border:'5px solid #7eb6c8'}}/>
  {['心拍','呼吸','体温','胃'].map((t,i)=>{const a=i*Math.PI/2;const x=930+Math.cos(a)*450,y=500+Math.sin(a)*270;return <React.Fragment key={t}><div style={{position:'absolute',left:x-85,top:y-45,width:170,height:90,borderRadius:20,background:'rgba(255,255,255,.06)',border:'2px solid rgba(255,255,255,.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:900}}>{t}</div><Arrow x={x>930?x-190:x+90} y={y} w={160} rot={x>930?180:0} p={p} color={i%2?C.gold:C.cyan}/></React.Fragment>})}
  <Label x={600} y={90} size={47} text={variant%3===0?'脳は身体の中も監視している':variant%3===1?'「今の自分」を身体から推測する':'身体感覚も、意味づけされる'} />
</>;

const NightRoad=({p,variant}:{p:number;variant:number})=><>
  <div style={{position:'absolute',left:0,right:0,bottom:0,height:430,background:'linear-gradient(#161b20,#080b0f)',clipPath:'polygon(0 30%,100% 5%,100% 100%,0 100%)'}}/>
  {Array.from({length:9}).map((_,i)=><div key={i} style={{position:'absolute',left:100+i*225,top:180+(i%3)*45,width:18,height:400,background:'#20252b'}}><div style={{position:'absolute',left:-70,top:0,width:155,height:90,borderRadius:'50%',background:'#1b2a22'}}/></div>)}
  <Person x={500} y={410} scale={.68} color='#b6c3ce' arm={variant===1?22:0}/>
  <div style={{position:'absolute',right:260,top:480,width:250,height:430,borderRadius:18,background:'#273038',boxShadow:'0 25px 55px #000a'}}><div style={{position:'absolute',left:35,right:35,top:80,height:160,background:'#050607',borderRadius:10}}/></div>
  {variant>=1&&<><div style={{position:'absolute',right:335,top:660,width:95,height:150,borderRadius:20,background:C.blue,transform:`translateY(${lerp(-100,10,p)}px) rotate(${lerp(-18,5,p)}deg)`}}/><Label x={730} y={120} size={50} color={C.red} text={variant===1?'バンッ！':variant===2?'心臓が速くなる':'原因が分かると、身体も落ち着く'} /></>}
</>;

const Controlled=({p,variant}:{p:number;variant:number})=><>
  <div style={{position:'absolute',left:180,top:230,width:620,height:510,borderRadius:30,border:`3px solid ${C.purple}77`,background:'rgba(70,45,90,.16)',padding:36}}><div style={{fontSize:30,fontWeight:900,color:C.purple}}>脳の予想</div><div style={{fontSize:56,fontWeight:1000,marginTop:140}}>{variant%3===0?'人がいる':variant%3===1?'友人だ':'自分の手だ'}</div></div>
  <div style={{position:'absolute',right:180,top:230,width:620,height:510,borderRadius:30,border:`3px solid ${C.cyan}77`,background:'rgba(45,90,92,.16)',padding:36}}><div style={{fontSize:30,fontWeight:900,color:C.cyan}}>現実からの信号</div><div style={{position:'absolute',left:80,right:80,top:210,height:210,borderRadius:'50%',border:'4px solid rgba(255,255,255,.18)'}}><Dot x={210+lerp(-100,100,p)} y={105} r={18} color={C.cyan}/></div></div>
  <Arrow x={800} y={490} w={320} p={p} color={C.gold}/>
  <Label x={590} y={100} size={47} text={variant%4===3?'「制御された幻覚」＝予想＋現実の修正':'脳の予想を、現実が修正する'} />
</>;

const Classroom=({p,variant}:{p:number;variant:number})=><>
  <div style={{position:'absolute',left:180,top:190,width:1120,height:610,borderRadius:22,background:'#1a2324',border:'10px solid #5a4631',boxShadow:'0 30px 80px #000a',padding:55}}><div style={{fontSize:42,fontWeight:900}}>脳の答案</div><div style={{fontSize:62,fontWeight:1000,marginTop:105,color:C.paper}}>{variant%3===0?'ここには机があるはず':variant%3===1?'この音は人の声だろう':'これは自分の手だ'}</div>{variant>=1&&<div style={{position:'absolute',right:120,bottom:110,fontSize:110,fontWeight:1000,color:C.red,transform:`rotate(${lerp(-8,7,p)}deg)`}}>修正</div>}</div>
  <div style={{position:'absolute',right:190,top:280,width:260,height:430,background:'#d8d4c7',transform:'rotate(4deg)',boxShadow:'0 25px 60px #000a'}}><div style={{position:'absolute',left:40,top:55,right:40,height:5,background:'#333'}}/><div style={{position:'absolute',left:40,top:100,right:80,height:5,background:'#555'}}/><div style={{position:'absolute',right:25,top:140,fontSize:88,color:C.red,fontWeight:1000}}>✓</div></div>
</>;

const Office=({p,variant}:{p:number;variant:number})=><>
  <div style={{position:'absolute',left:0,right:0,bottom:0,height:290,background:'#1d2328'}}/>
  {Array.from({length:6}).map((_,i)=><div key={i} style={{position:'absolute',left:160+i*285,top:280,width:220,height:140,background:'#151a1e',border:'2px solid rgba(255,255,255,.06)'}}/>)}
  <Person x={440} y={400} scale={.63} color='#b8c3cb'/><Person x={1140} y={390} scale={.65} color='#b8ad9f' dir={-1}/>
  {variant>=1&&<div style={{position:'absolute',left:1080,top:335,width:260,height:145,borderRadius:'50%',border:'3px solid rgba(200,91,98,.35)',transform:`scale(${.8+.2*ease(p)})`}}/>}
  <Label x={700} y={120} size={47} text={variant%4===0?'昨日、仕事で大きなミスをした':variant%4===1?'上司の返事が少し小さい':variant%4===2?'「怒っているのかも」と脳が予想する':'実際は、ただ寝不足かもしれない'} />
</>;

const Message=({p,variant}:{p:number;variant:number})=><>
  <Phone x={260} y={210} p={p} text={'22:18'}/>
  <div style={{position:'absolute',left:650,top:290,width:660,height:190,borderRadius:36,background:'#29485d',padding:'52px 62px',fontSize:64,fontWeight:950,boxShadow:'0 30px 80px #0008'}}>了解！</div>
  {variant>=1&&<>{['！','脈あり？','返信速度','句読点'].map((t,i)=><div key={t} style={{position:'absolute',left:710+i*250,top:600+Math.sin(i+p*5)*35,width:210,height:100,borderRadius:22,background:'rgba(255,255,255,.06)',border:'2px solid rgba(255,255,255,.14)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:900,transform:`scale(${.82+.18*ease(p)})`}}>{t}</div>)}</>}
  {variant>=2&&<Label x={660} y={125} size={45} color={C.gold} text={'二文字＋記号一つから\n恋愛感情を推理する脳'} />}
</>;

const Ambiguity=({p,variant}:{p:number;variant:number})=><>
  <div style={{position:'absolute',left:250,top:260,width:520,height:420,borderRadius:26,background:'rgba(255,255,255,.06)',border:'2px solid rgba(255,255,255,.14)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:72,fontWeight:1000}}>¥1,000</div>
  <div style={{position:'absolute',right:250,top:260,width:520,height:420,borderRadius:26,background:'rgba(255,255,255,.06)',border:'2px solid rgba(255,255,255,.14)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:72,fontWeight:1000,color:C.gold}}>「¥1,000,000ある」</div>
  <Line x={800} y={470} w={320} color={C.red} h={10}/>
  <Label x={530} y={120} size={46} text={variant%3===0?'信じても、レジは修正してくる':variant%3===1?'明確な現実は、予想を押し返す':'曖昧な場面ほど、予想が入りやすい'} />
</>;

const Social=({p,variant}:{p:number;variant:number})=><>
  {Array.from({length:12}).map((_,i)=>{const col=i%4,row=Math.floor(i/4);return <div key={i} style={{position:'absolute',left:190+col*390,top:180+row*250,width:320,height:190,borderRadius:24,border:'2px solid rgba(255,255,255,.12)',background:i%2?'rgba(100,80,125,.12)':'rgba(70,110,125,.12)',transform:`translateY(${Math.sin(p*5+i)*9}px)`}}><Person x={25} y={35} scale={.22} color={i%3===0?C.gold:'#aab4bc'}/><div style={{position:'absolute',left:145,top:44,right:25,height:8,borderRadius:5,background:'rgba(255,255,255,.25)'}}/><div style={{position:'absolute',left:145,top:80,right:55,height:8,borderRadius:5,background:'rgba(255,255,255,.14)'}}/></div>})}
  {variant>=1&&Array.from({length:7}).map((_,i)=><Arrow key={i} x={380+(i%3)*450} y={400+Math.floor(i/3)*220} w={180} rot={(i%2?18:-18)} p={p} color={i%2?C.red:C.cyan}/>)}
  <Label x={550} y={70} size={44} text={variant%3===0?'同じ出来事から、違う意味が生まれる':variant%3===1?'それぞれの脳内モデルが衝突する':'そしてSNSは今日も静かにならない'} />
</>;

const Limits=({p,variant}:{p:number;variant:number})=><>
  <div style={{position:'absolute',left:230,top:235,width:610,height:520,borderRadius:30,border:`3px solid ${C.cyan}66`,background:'rgba(50,100,110,.12)',padding:42}}><div style={{fontSize:38,fontWeight:950}}>予測処理で説明しやすい</div><div style={{fontSize:34,lineHeight:1.8,marginTop:65}}>・知覚の補正<br/>・錯視<br/>・身体所有感<br/>・期待の影響</div></div>
  <div style={{position:'absolute',right:230,top:235,width:610,height:520,borderRadius:30,border:`3px solid ${C.red}66`,background:'rgba(110,55,60,.12)',padding:42}}><div style={{fontSize:38,fontWeight:950}}>まだ残る大問題</div><div style={{fontSize:48,fontWeight:1000,lineHeight:1.45,marginTop:90}}>なぜ脳活動に<br/><span style={{color:C.gold}}>「感じ」</span>が伴うのか？</div></div>
  <Arrow x={845} y={500} w={220} p={p} color={C.gold}/>
  <Label x={590} y={95} size={45} text={variant%2===0?'有力な枠組み ≠ 意識の完全解明':'人類はまだ、大きな謎を残している'} />
</>;

const Final=({p,variant}:{p:number;variant:number})=><>
  <div style={{position:'absolute',left:650,top:220,width:620,height:520,borderRadius:'48%',background:'radial-gradient(circle at 50% 50%,rgba(113,77,96,.55),rgba(28,20,31,.92) 70%)',boxShadow:'0 0 80px #8d657244'}}/>
  {Array.from({length:34}).map((_,i)=>{const a=i*.53;const r=90+(i%6)*52;return <Dot key={i} x={960+Math.cos(a)*r} y={480+Math.sin(a*1.2)*r*.62} r={5+(i%3)*2} color={i%2?C.cyan:C.gold} opacity={.4+.6*ease(p)}/>})}
  {variant%5===0&&<Label x={150} y={150} size={50} text={'頭蓋骨の中には\n机も時計も色もない'} />}
  {variant%5===1&&<Label x={1170} y={150} size={47} text={'それでも脳は\n世界を十分に当てる'} />}
  {variant%5===2&&<><Arrow x={520} y={510} w={350} p={p} color={C.cyan}/><Arrow x={1400} y={510} w={-1} p={p} color={C.gold}/></>}
  {variant%5===3&&<Label x={390} y={815} size={49} color={C.gold} text={'現実が、脳の予想を一秒ごとに修正する'} />}
  {variant%5===4&&<Label x={310} y={810} size={55} text={'その「採点済みの予想」を、私たちは現実と呼ぶ'} />}
</>;

export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
  const m=meta[Math.max(0,n-1)]??meta[0];
  const p=Math.max(0,Math.min(1,progress));
  let body:React.ReactNode=null;
  if(m.phase==='morning_room') body=<Bedroom p={p} variant={m.variant}/>;
  else if(m.phase==='skull_box') body=<Skull p={p} variant={m.variant}/>;
  else if(m.phase==='basement_detective') body=<Basement p={p} variant={m.variant}/>;
  else if(m.phase==='signal_decode') body=<SignalPipeline p={p} variant={m.variant}/>;
  else if(m.phase==='hallway_coat') body=<Hallway p={p} variant={m.variant}/>;
  else if(m.phase==='station_friend') body=<Station p={p} variant={m.variant}/>;
  else if(m.phase==='prediction_engine') body=<Predictor p={p} variant={m.variant}/>;
  else if(m.phase==='illusion') body=<Illusion p={p} variant={m.variant}/>;
  else if(m.phase==='dress') body=<Dress p={p} variant={m.variant}/>;
  else if(m.phase==='rubber_hand') body=<RubberHand p={p} variant={m.variant}/>;
  else if(m.phase==='self_model') body=<SelfModel p={p} variant={m.variant}/>;
  else if(m.phase==='interoception') body=<BodySignals p={p} variant={m.variant}/>;
  else if(m.phase==='night_road') body=<NightRoad p={p} variant={m.variant}/>;
  else if(m.phase==='controlled_hallucination') body=m.variant%4===3?<Classroom p={p} variant={m.variant}/>:<Controlled p={p} variant={m.variant}/>;
  else if(m.phase==='office') body=<Office p={p} variant={m.variant}/>;
  else if(m.phase==='message') body=<Message p={p} variant={m.variant}/>;
  else if(m.phase==='ambiguity') body=<Ambiguity p={p} variant={m.variant}/>;
  else if(m.phase==='social') body=<Social p={p} variant={m.variant}/>;
  else if(m.phase==='limits') body=<Limits p={p} variant={m.variant}/>;
  else if(m.phase==='return_room') body=<Bedroom p={p} variant={m.variant+2}/>;
  else body=<Final p={p} variant={m.variant}/>;
  return <StaticBackdrop m={m}>{body}</StaticBackdrop>;
};
