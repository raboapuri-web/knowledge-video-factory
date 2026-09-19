import React from 'react';
import {interpolate} from 'remotion';
import sceneData from './scene-data.json';

type Meta={id:string;phase:string;variant:number;shotKind:string;visual:string;bgGroup:string;bgSeed:number};
const meta=sceneData as Meta[];
const font='Noto Sans JP, sans-serif';
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const E=(p:number,a=.08,b=.35)=>interpolate(p,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});

const palettes=[
 ['#070912','#1a1e3d','#b79af1'],['#0a1116','#163d4d','#8fc4ce'],['#160c12','#552038','#d493b2'],
 ['#0f130b','#3e4a1f','#d0bf74'],['#12100c','#543d27','#e0b976'],['#0b0c12','#34364f','#c9a7d7'],
 ['#081313','#155350','#82d0c0'],['#16100b','#633b22','#e4a36f'],['#080d14','#243b64','#88aee0']
];

const Backdrop=({m,label,children}:{m:Meta;label:string;children?:React.ReactNode})=>{
  const c=palettes[(m.bgSeed-1)%palettes.length];
  const x=12+(m.bgSeed*23)%76,y=14+(m.bgSeed*31)%68;
  const size=72+(m.bgSeed%7)*15;
  return <div style={{position:'absolute',inset:0,overflow:'hidden',fontFamily:font,
    background:`radial-gradient(circle at ${x}% ${y}%,${c[1]} 0%,${c[0]} 49%,#020305 100%)`}}>
    <div style={{position:'absolute',inset:-60,opacity:.36,backgroundImage:`linear-gradient(${(m.bgSeed*17)%80}deg,rgba(255,255,255,.028) 1px,transparent 1px),linear-gradient(${90+(m.bgSeed*17)%80}deg,rgba(255,255,255,.017) 1px,transparent 1px)`,backgroundSize:`${size}px ${size}px`}}/>
    {Array.from({length:6}).map((_,i)=><div key={i} style={{position:'absolute',left:`${(m.bgSeed*37+i*19)%108-4}%`,top:`${(m.bgSeed*41+i*23)%100}%`,width:100+i*48,height:100+i*48,borderRadius:'50%',background:i%2?c[2]+'12':'rgba(255,255,255,.025)',filter:'blur(24px)'}}/>)}
    <div style={{position:'absolute',left:42,top:34,padding:'8px 15px',borderRadius:999,border:'1px solid rgba(255,255,255,.16)',background:'rgba(0,0,0,.28)',fontSize:22,fontWeight:800,color:'#f1eee7aa',letterSpacing:1}}>{label}</div>
    {children}
  </div>;
};

const Text=({x,y,text,size=44,w=900,color='#f4f0e8',alpha=1,align='left'}:{x:number;y:number;text:string;size?:number;w?:number;color?:string;alpha?:number;align?:'left'|'center'|'right'})=>
  <div style={{position:'absolute',left:x,top:y,width:w,fontFamily:font,fontSize:size,fontWeight:900,lineHeight:1.36,color,opacity:alpha,textAlign:align,whiteSpace:'pre-line',textShadow:'0 5px 22px rgba(0,0,0,.8)'}}>{text}</div>;

const Card=({x,y,text,w=430,h=130,accent='#c9a56d',alpha=1}:{x:number;y:number;text:string;w?:number;h?:number;accent?:string;alpha?:number})=>
  <div style={{position:'absolute',left:x,top:y,width:w,minHeight:h,padding:24,borderRadius:28,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',whiteSpace:'pre-line',
    background:'rgba(4,7,11,.72)',border:`2px solid ${accent}88`,boxShadow:'0 25px 80px rgba(0,0,0,.5)',fontFamily:font,fontSize:33,fontWeight:900,lineHeight:1.35,color:'#f5f1e9',opacity:alpha}}>{text}</div>;

const Person=({x,y=820,s=1,woman=false,old=false,child=false,phone=false,color='#d7d2c7',pose='stand'}:{x:number;y?:number;s?:number;woman?:boolean;old?:boolean;child?:boolean;phone?:boolean;color?:string;pose?:string})=>{
  const h=(child?280:old?400:450)*s;
  return <div style={{position:'absolute',left:x,top:y-h,width:170*s,height:h}}>
    <div style={{position:'absolute',left:52*s,top:0,width:64*s,height:64*s,borderRadius:'50%',background:color}}/>
    {woman&&<div style={{position:'absolute',left:42*s,top:14*s,width:86*s,height:82*s,borderRadius:'44% 44% 52% 52%',background:'#3e3232',zIndex:-1}}/>}
    {old&&<div style={{position:'absolute',left:50*s,top:10*s,width:70*s,height:10*s,borderRadius:8,background:'#c7c4bd'}}/>}
    <div style={{position:'absolute',left:35*s,top:65*s,width:100*s,height:(child?130:195)*s,borderRadius:35*s,background:color,transform:pose==='sit'?'rotate(5deg)':'none'}}/>
    <div style={{position:'absolute',left:25*s,top:90*s,width:24*s,height:145*s,borderRadius:20,background:color,transform:`rotate(${phone?-35:pose==='reach'?-52:-8}deg)`,transformOrigin:'top'}}/>
    <div style={{position:'absolute',right:25*s,top:90*s,width:24*s,height:145*s,borderRadius:20,background:color,transform:`rotate(${phone?42:pose==='reach'?48:8}deg)`,transformOrigin:'top'}}/>
    <div style={{position:'absolute',left:43*s,top:(child?190:255)*s,width:30*s,height:(child?90:185)*s,borderRadius:18,background:color,transform:pose==='walk'?'rotate(13deg)':'none'}}/>
    <div style={{position:'absolute',right:43*s,top:(child?190:255)*s,width:30*s,height:(child?90:185)*s,borderRadius:18,background:color,transform:pose==='walk'?'rotate(-15deg)':'none'}}/>
    {phone&&<div style={{position:'absolute',right:-4*s,top:170*s,width:46*s,height:78*s,borderRadius:8,background:'#16191e',border:'3px solid #70757b'}}/>}
  </div>;
};

const Phone=({x=1110,y=120,p=0,mode='feed'}:{x?:number;y?:number;p?:number;mode?:string})=><div style={{position:'absolute',left:x,top:y,width:520,height:850,borderRadius:64,background:'#11151c',border:'10px solid #292d35',boxShadow:'0 35px 120px #000c',overflow:'hidden'}}>
  <div style={{position:'absolute',left:155,top:18,width:210,height:28,borderRadius:20,background:'#020305'}}/>
  <div style={{position:'absolute',inset:28,top:55,borderRadius:42,overflow:'hidden',background:mode==='feed'?'linear-gradient(#171b2b,#442841)':'#eef0eb'}}>
    {mode==='feed'&&<><div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 25%,#ddd7bd 0 8%,transparent 9%),linear-gradient(#11172b,#372040 55%,#0b0d12)'}}/>
      <Text x={28} y={360} w={400} size={31} text='今これを見たあなたには\n意味があります' align='center' alpha={E(p,.12,.35)}/>
      <div style={{position:'absolute',right:18,bottom:95,fontSize:40,color:'#fff'}}>♡<br/>◯<br/>↗</div></>}
    {mode==='chat'&&<>{['私も同じです','222を毎日見ます','今は手放しの時期ですね'].map((t,i)=><div key={t} style={{position:'absolute',left:25,top:100+i*150,width:380,padding:18,borderRadius:22,background:i%2?'#d8e9d5':'#fff',fontFamily:font,fontSize:24,fontWeight:800,color:'#222',opacity:E(p,.08+i*.12,.28+i*.12)}}>{t}</div>)}</>}
    {mode==='numbers'&&<><div style={{position:'absolute',left:70,top:120,fontFamily:font,fontSize:110,fontWeight:950,color:'#222'}}>2:22</div><div style={{position:'absolute',left:80,top:330,fontFamily:font,fontSize:56,fontWeight:900,color:'#555'}}>222</div><div style={{position:'absolute',left:250,top:480,fontFamily:font,fontSize:46,fontWeight:900,color:'#777'}}>1,840</div><div style={{position:'absolute',left:70,top:610,fontFamily:font,fontSize:52,fontWeight:900,color:'#888'}}>306</div></>}
  </div>
</div>;

const Stars=({p,lines=true}:{p:number;lines?:boolean})=><svg viewBox='0 0 1600 760' style={{position:'absolute',left:160,top:150,width:1600,height:760}}>
  {Array.from({length:38}).map((_,i)=>{const x=(i*197)%1510+40,y=(i*313)%690+30;return <circle key={i} cx={x} cy={y} r={2+(i%4)} fill='#f8f1d7' opacity={.35+.55*((i%5)/5)}/>})}
  {lines&&[[160,160,430,260],[430,260,650,120],[650,120,850,300],[850,300,1120,220],[1120,220,1380,350],[430,260,500,530],[500,530,840,610],[840,610,1120,220]].map((a,i)=><line key={i} x1={a[0]} y1={a[1]} x2={a[2]} y2={a[3]} stroke='#d6b46d' strokeWidth='4' opacity={E(p,.08+i*.06,.3+i*.06)}/>)}
</svg>;

const Noise=({p}:{p:number})=><div style={{position:'absolute',left:420,top:190,width:1080,height:650,borderRadius:24,overflow:'hidden',background:'#bfc2c3'}}>
 {Array.from({length:850}).map((_,i)=><div key={i} style={{position:'absolute',left:(i*47)%1080,top:(i*83)%650,width:3+(i%4),height:3+(i%4),background:i%2?'#111':'#eee',opacity:.7}}/>)}
 <div style={{position:'absolute',left:370,top:170,width:340,height:300,borderRadius:'50%',border:'10px solid rgba(35,40,45,.12)',opacity:E(p,.35,.75)}}/>
 <div style={{position:'absolute',left:450,top:250,width:40,height:40,borderRadius:'50%',background:'rgba(20,20,20,.25)',opacity:E(p,.45,.8)}}/><div style={{position:'absolute',left:590,top:250,width:40,height:40,borderRadius:'50%',background:'rgba(20,20,20,.25)',opacity:E(p,.45,.8)}}/>
</div>;

const Roulette=({p}:{p:number})=><div style={{position:'absolute',left:270,top:220,width:620,height:620,borderRadius:'50%',border:'34px solid #5e2630',boxShadow:'0 0 0 22px #c6a55f inset,0 35px 100px #000b',transform:`rotate(${p*160}deg)`}}>
 {Array.from({length:12}).map((_,i)=><div key={i} style={{position:'absolute',left:285,top:15,width:10,height:285,background:'#e5d7b5',transformOrigin:'5px 295px',transform:`rotate(${i*30}deg)`}}/>)}
 <div style={{position:'absolute',left:225,top:225,width:100,height:100,borderRadius:'50%',background:'#d1b269'}}/>
</div>;

const Ocean=({rough=false,p=0}:{rough?:boolean;p?:number})=><>
 <div style={{position:'absolute',left:0,right:0,bottom:0,height:560,background:rough?'linear-gradient(#355166,#0d1a25)':'linear-gradient(#5fa8bc,#17465a)'}}/>
 {Array.from({length:9}).map((_,i)=><div key={i} style={{position:'absolute',left:-100+i*260,bottom:170+(i%3)*35,width:420,height:45,borderRadius:'50%',borderTop:`${rough?18:8}px solid rgba(255,255,255,.45)`,transform:`translateX(${Math.sin(p*6+i)*35}px)`}}/>)}
 <div style={{position:'absolute',left:rough?760:520,bottom:330,width:450,height:90,background:'#805f35',clipPath:'polygon(0 30%,100% 0,88% 100%,10% 100%)',transform:`rotate(${rough?Math.sin(p*7)*7:0}deg)`}}/>
 <div style={{position:'absolute',left:rough?1200:1300,top:rough?160:210,width:rough?420:280,height:rough?240:150,borderRadius:'50%',background:rough?'#252b35':'#d9e4dc',opacity:.55}}/>
</>;

const Pigeon=({x,y,p}:{x:number;y:number;p:number})=><div style={{position:'absolute',left:x,top:y,width:280,height:260,transform:`rotate(${Math.sin(p*10)*8}deg)`}}>
 <div style={{position:'absolute',left:65,top:80,width:150,height:110,borderRadius:'55% 45% 50% 50%',background:'#8d949e'}}/><div style={{position:'absolute',left:20,top:55,width:95,height:90,borderRadius:'50%',background:'#9ca4af'}}/>
 <div style={{position:'absolute',left:-8,top:92,width:50,height:28,background:'#d5a768',clipPath:'polygon(0 50%,100% 0,100% 100%)'}}/><div style={{position:'absolute',left:50,top:82,width:10,height:10,borderRadius:'50%',background:'#111'}}/>
 <div style={{position:'absolute',left:110,top:185,width:7,height:65,background:'#bf755c'}}/><div style={{position:'absolute',left:160,top:185,width:7,height:65,background:'#bf755c'}}/>
</div>;

const TableGrid=({p}:{p:number})=><div style={{position:'absolute',left:410,top:220,width:1100,height:610}}>
 <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
 {['着用＋成功','着用＋失敗','非着用＋成功','非着用＋失敗','3日','4日','3日','3日'].map((t,i)=><div key={i} style={{height:i<4?130:230,borderRadius:20,background:i<4?'rgba(255,255,255,.08)':i===4?'rgba(208,174,103,.55)':'rgba(255,255,255,.045)',border:'1px solid #fff2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:i<4?28:58,fontWeight:900,color:'#eee',opacity:E(p,.04+i*.04,.28+i*.04)}}>{t}</div>)}
 </div>
</div>;

const WordOrbit=({p}:{p:number})=><div style={{position:'absolute',inset:0}}>
 {['量子','波動','宇宙','周波数','エネルギー','次元'].map((t,i)=>{const a=(i/6)*Math.PI*2+p*.45;const x=960+Math.cos(a)*(480+(i%2)*80),y=520+Math.sin(a)*260;return <div key={t} style={{position:'absolute',left:x-90,top:y-45,width:180,textAlign:'center',fontFamily:font,fontSize:38,fontWeight:950,color:'#f3eee7',transform:`rotate(${Math.sin(a)*9}deg)`}}>{t}</div>})}
 <div style={{position:'absolute',left:760,top:430,width:400,height:160,borderRadius:80,border:'3px solid #d7b06c55',boxShadow:'0 0 80px #d7b06c22'}}/>
</div>;

const FeedStack=({p}:{p:number})=><div style={{position:'absolute',left:260,right:260,top:210,bottom:170}}>
 {['執着を手放すと引き寄せが始まる','手放した瞬間に現実が動く','願いが叶わないのは執着しているから','次のステージへ移るサイン'].map((t,i)=><div key={t} style={{position:'absolute',left:100+i*190,top:60+i*120,width:840,height:120,borderRadius:30,background:'rgba(255,255,255,.07)',border:'1px solid rgba(255,255,255,.18)',padding:28,fontSize:32,fontWeight:900,color:'#eee',opacity:E(p,.04+i*.12,.22+i*.12),transform:`translateX(${i%2?80:-60}px)`}}>{t}</div>)}
</div>;

const BeliefShield=({p}:{p:number})=><div style={{position:'absolute',left:320,right:320,top:220,bottom:190}}>
 <div style={{position:'absolute',left:510,top:140,width:420,height:420,borderRadius:'50%',border:'14px solid #c9a865',boxShadow:'0 0 0 35px rgba(201,168,101,.1),0 0 100px rgba(201,168,101,.2)'}}/>
 {['叶った→証明','叶わない→手放せてない','失敗→潜在意識の問題','反論→波動が低い'].map((t,i)=><Card key={t} x={i%2?920:0} y={40+Math.floor(i/2)*330} w={430} h={140} text={t} accent={i<2?'#88a9b8':'#c7856d'} alpha={E(p,.08+i*.1,.28+i*.1)}/>)}
</div>;

const Ritual=({p}:{p:number})=><div style={{position:'absolute',left:300,right:300,top:210,bottom:170}}>
 <div style={{position:'absolute',left:120,top:210,width:480,height:300,borderRadius:26,background:'#6c4a32'}}/><div style={{position:'absolute',left:160,top:150,width:400,height:260,borderRadius:20,background:'#d9d1be',transform:`rotate(${-8+6*E(p,.1,.5)}deg) translateY(${80*E(p,.45,.8)}px)`}}/>
 <div style={{position:'absolute',right:80,top:170,width:560,height:400,borderRadius:24,background:'#eee9db',boxShadow:'0 20px 70px #0008'}}/><div style={{position:'absolute',right:185,top:300,width:340,height:5,background:'#7b6656',transform:`rotate(${20*E(p,.1,.65)}deg)`}}/><div style={{position:'absolute',right:250,top:350,width:220,height:160,background:'linear-gradient(135deg,transparent 47%,#8a6e5d 48% 52%,transparent 53%)',opacity:E(p,.4,.75)}}/>
</div>;

const Grass=({p}:{p:number})=><div style={{position:'absolute',left:0,right:0,bottom:0,height:470,background:'linear-gradient(#374125,#12170e)'}}>
 {Array.from({length:90}).map((_,i)=><div key={i} style={{position:'absolute',left:(i*43)%1920,bottom:0,width:4,height:70+(i%7)*20,background:'#637044',transformOrigin:'bottom',transform:`rotate(${-12+Math.sin(p*12+i)*16}deg)`}}/>)}
 <div style={{position:'absolute',right:300,bottom:170,width:280,height:160,borderRadius:'55% 45% 50% 45%',background:'rgba(0,0,0,.45)',opacity:E(p,.45,.7)}}/>
</div>;

const SplitChoice=({p}:{p:number})=><div style={{position:'absolute',inset:0}}>
 <div style={{position:'absolute',left:0,top:0,bottom:0,width:'50%',background:'linear-gradient(#3b2445,#130d16)'}}/><div style={{position:'absolute',right:0,top:0,bottom:0,width:'50%',background:'linear-gradient(#26384a,#0a0f14)'}}/>
 <Text x={150} y={230} text='「すべてには理由がある」' size={52} w={650} align='center'/>
 <Text x={1110} y={230} text='「分からないこともある」' size={52} w={650} align='center'/>
 <div style={{position:'absolute',left:958,top:120,bottom:120,width:4,background:'#f2e9d855'}}/>
 <Person x={440} y={850} woman s={.82} phone/><Person x={1300} y={850} woman s={.82}/>
 <div style={{position:'absolute',left:240,top:670,width:430,height:12,background:'#d1a568',transform:`scaleX(${E(p,.12,.7)})`,transformOrigin:'left'}}/>
 <div style={{position:'absolute',right:240,top:670,width:430,height:12,background:'#8da9bd',transform:`scaleX(${E(p,.25,.85)})`,transformOrigin:'right'}}/>
</div>;

const Phase=({m,p}:{m:Meta;p:number})=>{
 const v=m.variant||0;
 switch(m.phase){
  case 'opening_room':
   return <Backdrop m={m} label='午前1:47 — 答えのない部屋'>{v%4===0?<><Person x={710} y={850} woman s={.9} pose='sit' phone/><div style={{position:'absolute',left:350,top:610,width:360,height:180,borderRadius:22,background:'#302b2b'}}/><div style={{position:'absolute',left:410,top:565,width:90,height:120,borderRadius:18,background:'#707c87',opacity:.7}}/><Text x={1150} y={260} text='返信なし' size={48} color='#d18c8c'/></>:v%4===1?<><Person x={650} y={850} woman s={.9} pose='sit'/>{['別れ','異動落選','理由が分からない'].map((t,i)=><Card key={t} x={1060} y={210+i*190} w={520} h={120} text={t} accent={i===2?'#d49e67':'#a87891'} alpha={E(p,.06+i*.12,.28+i*.12)}/>)}</>:v%4===2?<><Phone p={p}/><Person x={480} y={850} woman s={.85} phone/></>:<><Text x={450} y={300} text='原因が分からないとき、\nなぜ検証しにくい説明ほど魅力的になるのか。' size={58} w={1050} align='center'/></>}</Backdrop>;
  case 'feed_signs':
   return <Backdrop m={m} label='スマートフォンの中の宇宙'>{v%4===0?<Phone p={p}/>:v%4===1?<><Phone p={p}/><Text x={180} y={240} text='1111\n222\n「転換期」' size={76} w={500} color='#ddbd76'/></>:v%4===2?<FeedStack p={p}/>:<><Person x={460} y={850} woman s={.86} phone/><Text x={970} y={300} text='誰も彼女の人生を知らない。\nそれでも視線は止まる。' size={46} w={680}/></>}</Backdrop>;
  case 'rational_day':
   return <Backdrop m={m} label='翌朝 — 論理性は消えていない'>{v%3===0?<><Person x={500} y={850} woman s={.88}/><div style={{position:'absolute',left:850,top:230,width:720,height:460,borderRadius:22,background:'#e8ebe8'}}/>{Array.from({length:7}).map((_,i)=><div key={i} style={{position:'absolute',left:900,top:280+i*52,width:610,height:2,background:'#6c777755'}}/>)}{Array.from({length:8}).map((_,i)=><div key={i} style={{position:'absolute',left:900+i*80,top:280,width:2,height:360,background:'#6c777744'}}/>)}</>:v%3===1?<><Card x={400} y={250} text='昼：数字を確認する' w={480}/><Card x={1040} y={250} text='夜：意味を探す' w={480} accent='#bd8faf'/><Text x={520} y={610} text='同じ人間、違う認知モード' size={50}/></>:<><Text x={430} y={320} text='スピる = 論理能力が突然消える、ではない。' size={62} w={1060} align='center'/></>}</Backdrop>;
  case 'definition':
   return <Backdrop m={m} label='この動画でいう「スピリチュアル」'><div style={{position:'absolute',left:250,right:250,top:210,bottom:180,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:22}}>{['宇宙のサイン','占星術','引き寄せ','波動','予知','意味ある偶然','儀式','超自然的因果'].map((t,i)=><div key={t} style={{borderRadius:28,background:'rgba(255,255,255,.06)',border:'1px solid #fff2',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:32,fontWeight:900,color:'#eee',opacity:E(p,.03+i*.05,.23+i*.05)}}>{t}</div>)}</div></Backdrop>;
  case 'trobriand_lagoon':
   return <Backdrop m={m} label='1910年代 — トロブリアンド諸島'><Ocean p={p}/><Text x={210} y={170} text='礁湖：技術でかなり予測できる' size={44}/></Backdrop>;
  case 'trobriand_ocean':
   return <Backdrop m={m} label='外海 — 不確実性が増える'><Ocean rough p={p}/>{v%2===0?<Text x={230} y={170} text='波・風・事故・漁獲\n制御できないものが増える' size={45}/>:<Card x={1180} y={180} text='技術だけでは\n不確実性を消せない' w={500} accent='#c9886d'/>}</Backdrop>;
  case 'malinowski':
   return <Backdrop m={m} label='マリノフスキの問い'>{v%3===0?<><Person x={400} y={850} s={.9}/><div style={{position:'absolute',left:860,top:190,width:680,height:520,background:'#d6c6a3',transform:'rotate(-2deg)'}}/><Text x={940} y={260} text='Bronisław\nMalinowski' size={62} w={560} color='#413326'/></>:v%3===1?<><Card x={320} y={250} text='制御できる部分\n→ 技術' w={560} h={260}/><Card x={1040} y={250} text='制御できない部分\n→ 儀礼・魔術' w={560} h={260} accent='#c48ba8'/></>:<><Text x={410} y={320} text='なぜ不確実性が増えると、\n人間は意味や儀式を必要とするのか。' size={58} w={1100} align='center'/></>}</Backdrop>;
  case 'control_lab':
   return <Backdrop m={m} label='2008 — コントロール喪失実験'>{v%3===0?<><Person x={420} y={850} s={.88}/><div style={{position:'absolute',left:840,top:190,width:740,height:500,borderRadius:24,background:'#1b2028',border:'3px solid #68717a'}}/><Noise p={p}/></>:v%3===1?<Noise p={p}/>:<><Text x={440} y={260} text='「自分では結果をコントロールできない」' size={54} w={1050} align='center'/><div style={{position:'absolute',left:620,top:520,width:680,height:14,background:'#fff2'}}/><div style={{position:'absolute',left:620,top:520,width:680*E(p,.1,.75),height:14,background:'#c78eaa'}}/></>}</Backdrop>;
  case 'pattern_noise':
   return <Backdrop m={m} label='ランダムの中に顔が見える'><Noise p={p}/>{v%2===1&&<Text x={540} y={870} text='パターンは最初から存在したのか？' size={42}/>}</Backdrop>;
  case 'roulette_order':
   return <Backdrop m={m} label='ランダムな世界 / 意味のある世界'><Roulette p={p}/>{v%3===0?<>{['恋愛','病気','仕事','事故'].map((t,i)=><Card key={t} x={1120} y={180+i*165} w={430} h={110} text={t} accent='#8ba5b7' alpha={E(p,.06+i*.1,.26+i*.1)}/>)}</>:v%3===1?<>{['必要な出来事','魂の成長','宇宙の導き'].map((t,i)=><Card key={t} x={1100} y={220+i*190} w={480} h={120} text={t} accent='#d0aa68' alpha={E(p,.06+i*.12,.3+i*.12)}/>)}</>:<Text x={1030} y={370} text='結果は同じ。\n右側には「理由」がある。' size={50} w={620}/>}</Backdrop>;
  case 'compensatory_control':
   return <Backdrop m={m} label='補償的コントロール'>{v%3===0?<><Person x={470} y={850} woman s={.86}/><div style={{position:'absolute',left:920,top:210,width:570,height:570,borderRadius:'50%',border:'8px solid #c9a56d55',boxShadow:'0 0 100px #c9a56d22'}}/><Text x={995} y={390} text='外部の秩序' size={52}/></>:v%3===1?<><Card x={340} y={250} text='自分で制御できない' w={550} h={240} accent='#b9809d'/><Card x={1040} y={250} text='外部に秩序を見つける' w={550} h={240} accent='#c9a667'/></>:<Text x={400} y={300} text='無秩序より、\n何らかの秩序がある世界の方が耐えやすい。' size={60} w={1120} align='center'/>}</Backdrop>;
  case 'story_reframe':
   return <Backdrop m={m} label='出来事を物語へ変換する'>{v%3===0?<><Person x={450} y={850} woman s={.88} phone/>{['失敗','準備期間','拒絶','転換','偶然','次の章'].map((t,i)=><Card key={t} x={980+(i%2)*320} y={150+Math.floor(i/2)*210} w={270} h={100} text={t} accent={i%2?'#d0a765':'#9d7d93'} alpha={E(p,.04+i*.07,.24+i*.07)}/>)}</>:v%3===1?<><div style={{position:'absolute',left:300,top:520,width:1300,height:10,background:'#fff3'}}/>{['過去','現在','未来'].map((t,i)=><div key={t} style={{position:'absolute',left:350+i*530,top:470,width:110,height:110,borderRadius:'50%',background:['#7d718b','#ba8d76','#d0b163'][i],display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,fontWeight:900,color:'#fff'}}>{t}</div>)}</>:<Text x={470} y={300} text='物語には、時間を整理する力がある。' size={64} w={980} align='center'/>}</Backdrop>;
  case 'teleology':
   return <Backdrop m={m} label='目的論的思考'>{v%3===0?<><div style={{position:'absolute',left:250,right:250,top:170,bottom:160,background:'linear-gradient(#6d7d96,#314453 52%,#202a22 53%)'}}/>{Array.from({length:18}).map((_,i)=><div key={i} style={{position:'absolute',left:220+(i*97)%1420,top:170+(i*61)%420,width:3,height:100,background:'#a9c6de',transform:'rotate(15deg)'}}/>)}<Text x={560} y={700} text='「雨は植物を育てるために降る」？' size={46}/></>:v%3===1?<><Card x={320} y={250} text='原因\n水蒸気→凝結→重力' w={570} h={260}/><Card x={1030} y={250} text='目的\n植物を育てるため' w={570} h={260} accent='#c891ab'/></>:<Text x={410} y={310} text='原因より「目的」を置いた方が、\n物語として分かりやすい。' size={60} w={1100} align='center'/>}</Backdrop>;
  case 'meaning_vs_cause':
   return <Backdrop m={m} label='意味を作る / 宇宙に意図がある'>{v%2===0?<><Card x={290} y={260} text='経験から意味を作る\n「ここから学ぼう」' w={600} h={300} accent='#85aa9a'/><Card x={1030} y={260} text='出来事に意図を仮定する\n「学ばせるために起きた」' w={600} h={300} accent='#c78ba8'/></>:<Text x={370} y={320} text='似て見えるが、因果関係としては別物である。' size={62} w={1180} align='center'/>}</Backdrop>;
  case 'skinner_pigeon':
   return <Backdrop m={m} label='1948 — スキナーのハト'>{v%3===0?<><div style={{position:'absolute',left:330,top:160,width:1260,height:700,border:'8px solid #6d737b',background:'rgba(255,255,255,.03)'}}/><Pigeon x={760} y={470} p={p}/><div style={{position:'absolute',right:480,top:430,width:170,height:80,borderRadius:14,background:'#775a3d'}}/></>:v%3===1?<><Pigeon x={800} y={450} p={p}/><Text x={540} y={180} text='行動とは無関係に餌が出る' size={48}/></>:<><Pigeon x={800} y={450} p={p}/><Text x={450} y={730} text='偶然の直前の行動を、因果と結びつけるように見える。' size={42} w={1050} align='center'/></>}</Backdrop>;
  case 'bracelet':
   return <Backdrop m={m} label='日常の因果錯覚'>{v%3===0?<><Person x={450} y={850} s={.9}/><div style={{position:'absolute',left:900,top:300,width:240,height:240,borderRadius:'50%',border:'28px solid #d6b23f',boxShadow:'0 0 80px #d6b23f44'}}/><Card x={1220} y={260} text='大型契約 成功' w={390} accent='#79a98d' alpha={E(p,.25,.55)}/></>:v%3===1?<TableGrid p={p}/>:<Text x={420} y={320} text='人間の記憶は、\n表計算ソフトではない。' size={68} w={1080} align='center'/>}</Backdrop>;
  case 'causal_illusion':
   return <Backdrop m={m} label='願った翌日に連絡が来た'>{v%2===0?<><div style={{position:'absolute',left:300,top:230,width:500,height:420,borderRadius:40,background:'#1b2028'}}/><Text x={370} y={360} text='願う' size={80} w={360} align='center'/><div style={{position:'absolute',left:800,top:430,width:320,height:8,background:'#d2aa67',transform:`scaleX(${E(p,.1,.65)})`,transformOrigin:'left'}}/><div style={{position:'absolute',right:300,top:230,width:500,height:420,borderRadius:40,background:'#233227'}}/><Text x={1110} y={360} text='連絡が来る' size={64} w={390} align='center'/></>:<Text x={410} y={330} text='一件の劇的な一致は記憶され、\n何も起きなかった27日は物語にならない。' size={58} w={1120} align='center'/>}</Backdrop>;
  case 'forer':
   return <Backdrop m={m} label='1949 — Forer / Barnum effect'>{v%3===0?<><div style={{position:'absolute',left:310,top:200,width:560,height:600,background:'#d9d1bc',transform:'rotate(-2deg)'}}/><Text x={370} y={290} text='あなた専用\n性格分析' size={56} w={440} color='#3e342d'/><Text x={1010} y={240} text='実際には\n全員ほぼ同じ文章' size={52} w={600}/></>:v%3===1?<>{['認められたい','一人になりたい時もある','強く見える','実は繊細'].map((t,i)=><Card key={t} x={300+(i%2)*700} y={200+Math.floor(i/2)*260} w={550} h={150} text={t} accent={i%2?'#ba8aa5':'#8fa8b5'} alpha={E(p,.05+i*.1,.28+i*.1)}/>)}</>:<Text x={400} y={320} text='曖昧だからこそ、\n受け手が自分の人生で完成させられる。' size={62} w={1120} align='center'/>}</Backdrop>;
  case 'universal_reading':
   return <Backdrop m={m} label='同じ言葉、五つの人生'><div style={{position:'absolute',left:200,right:200,top:240,bottom:160,display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:18}}>{['会社員','大学生','子育て','退職者','経営者'].map((t,i)=><div key={t} style={{borderRadius:30,background:'rgba(255,255,255,.06)',border:'1px solid #fff2',paddingTop:50,textAlign:'center',fontSize:31,fontWeight:900,color:'#eee',opacity:E(p,.04+i*.08,.25+i*.08)}}><Person x={38} y={450} s={.55} woman={i===2}/><div style={{position:'absolute'}}/>{t}</div>)}</div></Backdrop>;
  case 'pseudo_profound':
   return <Backdrop m={m} label='「深そう」に見える文章'>{v%3===0?<WordOrbit p={p}/>:v%3===1?<><WordOrbit p={p}/><Text x={440} y={750} text='量子的周波数が宇宙のエネルギーと共鳴すると次元が変わる' size={38} w={1040} align='center'/></>:<>{['何を測る？','何Hz？','どう反証する？'].map((t,i)=><Card key={t} x={290+i*520} y={320} w={430} h={150} text={t} accent='#b96c70' alpha={E(p,.08+i*.12,.3+i*.12)}/>)}</>}</Backdrop>;
  case 'incomprehension_depth':
   return <Backdrop m={m} label='理解不能性が「深さ」に変わる'>{v%2===0?<><div style={{position:'absolute',left:310,top:220,width:1300,height:520,background:'#111722',border:'2px solid #fff2',borderRadius:30,padding:50,fontSize:44,fontWeight:900,color:'#d5deeb'}}>∫ ψ(x) e^(-iωx) dx　　Σ λᵢφᵢ　　∂ρ/∂t + ∇·J = 0</div><Text x={510} y={780} text='分からない = 相手が深い？' size={46}/></>:<Text x={390} y={310} text='「自分が分からないのは、\n自分の知識が足りないからだ」' size={62} w={1140} align='center'/>}</Backdrop>;
  case 'repetition':
   return <Backdrop m={m} label='錯誤真実効果'>{v%3===0?<FeedStack p={p}/>:v%3===1?<>{Array.from({length:12}).map((_,i)=><div key={i} style={{position:'absolute',left:220+(i%4)*390,top:160+Math.floor(i/4)*240,width:320,height:130,borderRadius:24,background:'rgba(255,255,255,.05)',border:'1px solid #fff2',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:900,color:'#eee',opacity:.25+.65*E(p,.02+i*.04,.18+i*.04)}}>聞いたことがある</div>)}</>:<Text x={420} y={320} text='「聞き覚え」が、\n少しずつ「本当かもしれない」に変わる。' size={64} w={1080} align='center'/>}</Backdrop>;
  case 'unfalsifiable':
   return <Backdrop m={m} label='何が起きても理論が傷つかない'>{v%2===0?<BeliefShield p={p}/>:<Text x={410} y={320} text='成功も失敗も反論も、\nすべて信念の証拠へ回収できる。' size={64} w={1120} align='center'/>}</Backdrop>;
  case 'prophecy_case':
   return <Backdrop m={m} label='心理学史の有名話も再検討される'>{v%3===0?<><div style={{position:'absolute',left:320,top:190,width:520,height:650,background:'#d7cfbe'}}/><Text x={390} y={280} text='When\nProphecy\nFails' size={62} w={400} color='#342e2a'/><Text x={1040} y={260} text='「予言が外れたら\n信念が強まった」？' size={48} w={620}/></>:v%3===1?<>{['古典的ストーリー','アーカイブ資料','再評価'].map((t,i)=><Card key={t} x={260+i*520} y={300} w={430} h={190} text={t} accent={i===1?'#7fa8b6':'#c89d68'} alpha={E(p,.08+i*.12,.3+i*.12)}/>)}</>:<Text x={360} y={300} text='科学者も、分かりやすい物語を好む脳の外にはいない。' size={58} w={1200} align='center'/>}</Backdrop>;
  case 'ritual_loss':
   return <Backdrop m={m} label='儀式には心理的効果が生じることがある'>{v%2===0?<Ritual p={p}/>:<><Person x={380} y={850} woman s={.82}/><Ritual p={p}/><Text x={1180} y={210} text='「ここで一区切り」' size={44} w={500}/></>}</Backdrop>;
  case 'ritual_motion':
   return <Backdrop m={m} label='儀式とコントロール感'>{v%3===0?<>{Array.from({length:5}).map((_,i)=><div key={i} style={{position:'absolute',left:300+i*270,top:320+(i%2)*120,width:120,height:120,borderRadius:'50%',border:'10px solid #c8a567',transform:`rotate(${p*80+i*25}deg)`}}/>)}</>:v%3===1?<><Person x={530} y={850} child s={.78}/><div style={{position:'absolute',left:980,top:330,width:210,height:52,background:'#2c3440',borderRadius:12}}/><Text x={1260} y={300} text='いつものペン' size={46} w={400}/></>:<Text x={390} y={310} text='心理的効果が本物でも、\n超自然的因果が本物とは限らない。' size={64} w={1140} align='center'/>}</Backdrop>;
  case 'community':
   return <Backdrop m={m} label='孤独が共同体へ変わる'><Person x={400} y={850} woman s={.86} phone/><Phone x={1080} y={120} p={p} mode='chat'/>{v%2===1&&<Text x={180} y={240} text='苦しみが\n「自分だけの失敗」ではなくなる' size={46} w={650}/>}</Backdrop>;
  case 'intelligence_nuance':
   return <Backdrop m={m} label='「スピる人は頭が悪い」で終わらない'>{v%3===0?<><div style={{position:'absolute',left:250,right:250,top:240,bottom:180,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24}}>{['雲に顔を見る','偶然に意味を感じる','人生を物語化','不安で手順を反復'].map((t,i)=><div key={t} style={{borderRadius:28,background:'rgba(255,255,255,.06)',border:'1px solid #fff2',display:'flex',alignItems:'center',justifyContent:'center',padding:25,textAlign:'center',fontSize:31,fontWeight:900,color:'#eee',opacity:E(p,.04+i*.1,.27+i*.1)}}>{t}</div>)}</div></>:v%3===1?<><Card x={440} y={260} w={1040} h={320} text='研究結果にはばらつきが大きい。\n単純な「知能の低さ」で説明しない。' accent='#88a9b9' alpha={E(p,.12,.5)}/></>:<Text x={400} y={320} text='スピリチュアル的思考の材料は、\n普通の人間の認知と地続きである。' size={60} w={1120} align='center'/>}</Backdrop>;
  case 'evolution_false_positive':
   return <Backdrop m={m} label='進化的視点 — 見逃しより誤検出が安い'><Grass p={p}/>{v%3===0?<><Person x={520} y={820} s={.82} pose='walk'/><Text x={1020} y={260} text='ガサッ……\n風か？ 捕食者か？' size={52} w={600}/></>:v%3===1?<><Card x={330} y={220} text='誤検出\n風なのに逃げる' w={560} h={260} accent='#8aa4b5'/><Card x={1040} y={220} text='見逃し\n捕食者なのに無視' w={560} h={260} accent='#bf6464'/></>:<Text x={410} y={300} text='真理だけを発見する脳より、\n生き残るのに十分速い脳。' size={64} w={1120} align='center'/>}</Backdrop>;
  case 'algorithm_signs':
   return <Backdrop m={m} label='古い認知装置 × 現代アルゴリズム'>{v%3===0?<><Phone p={p}/>{['失恋','妊活','転職'].map((t,i)=><Card key={t} x={230} y={220+i*190} w={450} h={110} text={t+'を検索'} alpha={E(p,.05+i*.1,.3+i*.1)}/>)}</>:v%3===1?<><Phone p={p}/><Text x={230} y={260} text='「なぜ今、この動画が？」' size={52} w={650}/></>:<Text x={390} y={310} text='アルゴリズムは宇宙のサインではない。\nでも体験としては、そう見える。' size={60} w={1160} align='center'/>}</Backdrop>;
  case 'angel_numbers':
   return <Backdrop m={m} label='2:22 — 意味のある数字に見える'><Person x={390} y={850} woman s={.86} phone/><Phone x={1100} y={120} p={p} mode='numbers'/>{v%2===1&&<>{['222円','部屋222','2:22'].map((t,i)=><Card key={t} x={520+i*250} y={190+i*150} w={210} h={90} text={t} accent='#d1aa66' alpha={E(p,.08+i*.12,.3+i*.12)}/>)}</>}</Backdrop>;
  case 'selective_memory':
   return <Backdrop m={m} label='目立った数字だけが残る'>{v%2===0?<>{['72','1840','306','915','222','541','36','808','112','222'].map((t,i)=><div key={i} style={{position:'absolute',left:180+(i%5)*330,top:170+Math.floor(i/5)*300,fontSize:t==='222'?80:50,fontWeight:950,color:t==='222'?'#e0b765':'#f1eee755',transform:`rotate(${(i%3-1)*8}deg)`,opacity:E(p,.03+i*.05,.25+i*.05)}}>{t}</div>)}</>:<Text x={400} y={310} text='先に意味が生まれ、\n意味に合う出来事だけが目立つことがある。' size={64} w={1120} align='center'/>}</Backdrop>;
  case 'secular_order':
   return <Backdrop m={m} label='スピを消しても「意味需要」は残る'><div style={{position:'absolute',left:230,right:230,top:220,bottom:180,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:22}}>{['市場は正しい','成功者のルーティン','ブランドで人生が変わる','努力は必ず報われる'].map((t,i)=><div key={t} style={{borderRadius:30,background:'rgba(255,255,255,.065)',border:'1px solid #fff2',display:'flex',alignItems:'center',justifyContent:'center',padding:30,textAlign:'center',fontSize:32,fontWeight:900,color:'#eee',opacity:E(p,.04+i*.1,.28+i*.1)}}>{t}</div>)}</div></Backdrop>;
  case 'order_core':
   return <Backdrop m={m} label='人間が欲しいものは「秩序」'>{v%3===0?<>{['偶然→理由','不安→行動','苦しみ→物語','孤独→共同体'].map((t,i)=><Card key={t} x={270+(i%2)*780} y={190+Math.floor(i/2)*300} w={620} h={160} text={t} accent={i%2?'#b88da6':'#d0a765'} alpha={E(p,.05+i*.1,.28+i*.1)}/>)}</>:v%3===1?<Text x={390} y={310} text='スピリチュアルは、\nこの需要を効率よく満たす一つの形式である。' size={62} w={1140} align='center'/>:<Stars p={p}/>}</Backdrop>;
  case 'choice_uncertainty':
   return <Backdrop m={m} label='保証のある物語 / 保証のない現実'><SplitChoice p={p}/></Backdrop>;
  case 'thesis':
   return <Backdrop m={m} label='なぜ人はスピるのか？'>{v%3===0?<Text x={380} y={290} text='理解できないものを信じたいのではない。' size={66} w={1160} align='center'/>:v%3===1?<Text x={360} y={290} text='理解できないまま放置された世界に\n耐えにくいのである。' size={68} w={1200} align='center'/>:<>{['パターン','目的','曖昧な意味','儀式','共同体'].map((t,i)=><Card key={t} x={180+i*330} y={370+(i%2)*160} w={280} h={95} text={t} accent={i%2?'#b98ca5':'#cda667'} alpha={E(p,.04+i*.08,.26+i*.08)}/>)}</>}</Backdrop>;
  case 'stars_final':
   return <Backdrop m={m} label='星に線を引く脳'>{v%4===0?<Stars p={p}/>:v%4===1?<><Stars p={p}/><Text x={450} y={760} text='ばらばらの光点を、ばらばらのまま見続けるのは難しい。' size={42} w={1040} align='center'/></>:v%4===2?<><Stars p={p}/>{['運命','宇宙','神','因果関係'].map((t,i)=><Card key={t} x={260+i*370} y={720-(i%2)*110} w={310} h={100} text={t} accent='#cda766' alpha={E(p,.05+i*.1,.28+i*.1)}/>)}</>:<><Stars p={1-p} lines={false}/><Text x={380} y={300} text='自分が引いた線を、\n最初から宇宙にあった線だと思い込まない。' size={60} w={1160} align='center'/></>}</Backdrop>;
  case 'final_message':
   return <Backdrop m={m} label='「分からない」に耐える'>{v%3===0?<><Text x={380} y={270} text='科学が発達しても、\n人生から偶然は消えない。' size={66} w={1160} align='center'/>{['別れ','病気','失敗','予測不能'].map((t,i)=><Card key={t} x={250+i*380} y={610} w={310} h={105} text={t} accent='#94798a' alpha={E(p,.06+i*.1,.28+i*.1)}/>)}</>:v%3===1?<><Stars p={1-p} lines={false}/><Text x={350} y={300} text='世界は、我々の都合とは無関係に\n説明を拒むことがある。' size={66} w={1220} align='center'/></>:<><div style={{position:'absolute',inset:0,background:'rgba(0,0,0,.45)'}}/><Text x={330} y={260} text='我々が信じたがっているのは、\n理解できないものではない。' size={62} w={1260} align='center'/><Text x={300} y={560} text='理解できない人生にも、何か意味があってほしいという希望なのである。' size={58} w={1320} align='center' color='#e2bd72'/></>}</Backdrop>;
  default:
   return <Backdrop m={m} label='なぜ人はスピるのか'><Text x={500} y={360} text={m.phase} size={58}/></Backdrop>;
 }
};

export const SceneVisual=({n,progress}:{n:number;progress:number})=>{
 const m=meta[Math.max(0,n-1)]??meta[0];
 const p=clamp(progress);
 const enter=interpolate(p,[0,.025],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const exit=interpolate(p,[.97,1],[1,.88],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const zoom=m.shotKind==='detail'?.026:m.shotKind==='macro'?.04:m.shotKind==='tracking'?.02:.012;
 return <div style={{position:'absolute',inset:0,opacity:enter*exit,transform:`scale(${1+zoom*Math.sin(p*Math.PI)})`,transformOrigin:`${36+(n*17)%28}% ${38+(n*19)%24}%`}}>
   <Phase m={m} p={p}/>
   <div style={{position:'absolute',left:0,right:0,bottom:0,height:190,background:'linear-gradient(transparent,rgba(0,0,0,.26))',pointerEvents:'none'}}/>
 </div>;
};
