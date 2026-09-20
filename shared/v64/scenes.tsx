import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame} from 'remotion';
import {FemaleCharacter,MaleCharacter} from './characters';

type Meta={id:string;phase:string;location:string;visual:string;localIndex:number;shotKind:string};
type Props={meta:Meta;narration:string;beatProgress:number;stageProgress:number;stageElapsed:number;seconds:number};
const font='"Noto Sans JP",sans-serif';
const clamp=(x:number)=>Math.min(1,Math.max(0,x));
const ease=(p:number,a=.06,b=.42)=>clamp((p-a)/Math.max(.001,b-a));
const show=(p:number,a=.08,b=.28)=>({opacity:ease(p,a,b),transform:'translateY('+((1-ease(p,a,b))*24)+'px)'});
const inset={position:'absolute' as const};
const BG:React.FC<{file:string;elapsed:number;dim?:number;pan?:number}>=({file,elapsed,dim=0,pan=0})=>
 <Img src={staticFile('assets/backgrounds/'+file)} style={{position:'absolute',left:-28,top:-18,width:1976,height:1116,
 transform:'translateX('+Math.sin(elapsed/17)*pan+'px) scale(1.018)',objectFit:'cover',filter:'brightness('+(1-dim)+')'}}/>;
const Shade=()=> <div style={{...inset,inset:0,background:'linear-gradient(90deg,#02040b55,transparent 35%,#02040b30),linear-gradient(0deg,#04060baa,transparent 32%)',pointerEvents:'none'}}/>;
const Label=({name,sub}:{name:string;sub?:string})=><div style={{...inset,top:46,left:80,color:'#eee7de',fontFamily:font,fontSize:24,fontWeight:700,letterSpacing:3,textShadow:'0 3px 16px #000c'}}>
 {name}{sub&&<span style={{display:'block',marginTop:7,fontSize:16,fontWeight:400,opacity:.7,letterSpacing:1}}>{sub}</span>}
 </div>;
const Text=({children,x=120,y=150,w=790,size=46,p=1,color='#f7f3e9',align='left'}:{
 children:React.ReactNode;x?:number;y?:number;w?:number;size?:number;p?:number;color?:string;align?:'left'|'center'})=>
 <div style={{...inset,left:x,top:y,width:w,fontFamily:font,fontSize:size,lineHeight:1.55,fontWeight:800,textAlign:align,color,
 textShadow:'0 5px 22px #000,0 2px 5px #000',...show(p)}}>{children}</div>;
const Woman=({x,y,scale=1,pose='standing',direction='front',outfit='casual',p=1}:{
 x:number;y:number;scale?:number;pose?:any;direction?:any;outfit?:any;p?:number})=>
 <FemaleCharacter width={330} scale={scale} pose={pose} direction={direction} outfit={outfit}
  colors={{top:'#473948',bottom:'#252736'}} style={{position:'absolute',left:x,top:y,opacity:p}}/>;
const Man=({x,y,scale=1,pose='standing',direction='front',outfit='casual',p=1}:{
 x:number;y:number;scale?:number;pose?:any;direction?:any;outfit?:any;p?:number})=>
 <MaleCharacter width={330} scale={scale} pose={pose} direction={direction} outfit={outfit}
  colors={{top:'#384b54',bottom:'#1c2937'}} style={{position:'absolute',left:x,top:y,opacity:p}}/>;
const Glass=({x,y,tilt=0,fill=.55}: {x:number;y:number;tilt?:number;fill?:number})=>
 <svg viewBox="0 0 110 300" width={110} height={300} style={{...inset,left:x,top:y,transform:'rotate('+tilt+'deg)'}}>
 <path d="M17 14L25 155Q55 183 85 155L93 14Z" fill="#f5e1c5" fillOpacity=".12" stroke="#f6e6d1" strokeWidth="5"/>
 <path d={'M26 '+(156-100*fill)+'L84 '+(156-100*fill)+' 80 146Q55 170 30 146Z'} fill="#c3a66a" fillOpacity=".66"/>
 <path d="M55 165V263M24 271H86" stroke="#f6e6d1" strokeWidth="6" strokeLinecap="round"/>
 </svg>;
const Moon=({x,y,r=66,p=1}:{x:number;y:number;r?:number;p?:number})=><div style={{...inset,left:x-r,top:y-r,width:2*r,height:2*r,borderRadius:'50%',
 background:'radial-gradient(circle at 34% 35%,#fffaf0,#ecdabb 66%,#bdb1a7)',boxShadow:'0 0 30px #dcd3c78c,0 0 130px #e6d5b03a',opacity:p,
 transform:'translateY('+(-8*p)+'px)'}}><div style={{...inset,left:r*.9,top:r*.1,width:r*1.18,height:r*1.55,borderRadius:'50%',background:'#131a31',opacity:.9}}/></div>;
const Mobile=({x=1270,y=150,title='悠真',messages,read=false,clock,p=1,dim=false}:{
 x?:number;y?:number;title?:string;messages:{text:string;own?:boolean}[];read?:boolean;clock?:string;p?:number;dim?:boolean})=>
 <div style={{...inset,left:x,top:y,width:455,height:770,border:'13px solid #181d27',borderRadius:55,
 background:'#edf3ee',boxShadow:'0 25px 90px #000c, inset 0 0 0 2px #879197',opacity:p,
 transform:'translateY('+((1-p)*44)+'px) rotate(-3deg)',overflow:'hidden',fontFamily:font}}>
 <div style={{height:52,background:'#d8e4dc',display:'flex',justifyContent:'space-between',padding:'12px 28px',fontSize:17,color:'#26372e'}}>
 <span>{clock||'01:43'}</span><span>●●●　82%</span></div>
 <div style={{background:'#fff',textAlign:'center',color:'#29352d',fontSize:23,fontWeight:800,padding:17,borderBottom:'1px solid #ddd'}}>{title}</div>
 <div style={{padding:'20px 18px',height:565,overflow:'hidden',filter:dim?'blur(2px)':undefined}}>
 {messages.map((m,i)=><div key={i} style={{display:'flex',justifyContent:m.own?'flex-end':'flex-start',marginBottom:16}}>
 <div style={{maxWidth:315,background:m.own?'#a6e68b':'#fff',color:'#25322b',padding:'14px 19px',borderRadius:19,fontSize:22,lineHeight:1.38,
 boxShadow:'0 2px 6px #0002',whiteSpace:'pre-line'}}>{m.text}</div></div>)}
 {read&&<div style={{fontSize:17,color:'#637769',textAlign:'right',paddingRight:16}}>既読</div>}
 </div><div style={{...inset,bottom:0,left:0,right:0,height:60,background:'#fff',borderTop:'1px solid #ddd'}}/>
 </div>;
const Coffee=({x,y,p=1,milk=false}:{x:number;y:number;p?:number;milk?:boolean})=>
 <svg viewBox="0 0 260 220" width={260} height={220} style={{...inset,left:x,top:y,opacity:p}}>
 <ellipse cx="120" cy="165" rx="105" ry="24" fill="#2b231f" fillOpacity=".4"/>
 <path d="M45 56H190L178 159Q126 196 58 158Z" fill="#ece6db" stroke="#b7a99c" strokeWidth="8"/>
 <path d="M188 78Q262 62 242 119Q225 157 182 139" stroke="#e8e2d8" fill="none" strokeWidth="16"/>
 <ellipse cx="117" cy="56" rx="73" ry="15" fill={milk?'#9c7457':'#3d261f'}/>
 <ellipse cx="118" cy="55" rx="46" ry="10" fill={milk?'#d2ae88':'#4b2f23'}/>
 <path d={'M110 40Q80 '+(10-p*13)+' 103 '+(-25*p)} fill="none" stroke="#f3e4cd" strokeWidth="5" opacity={p*.55}/>
 </svg>;
const Milk=({x,y,p=1}:{x:number;y:number;p?:number})=><div style={{...inset,left:x,top:y,width:118,height:210,opacity:p,transform:'rotate(-5deg)'}}>
 <div style={{height:27,marginLeft:12,marginRight:12,background:'#e9f0f7',clipPath:'polygon(0 100%,28% 0,72% 0,100% 100%)'}}/>
 <div style={{height:176,background:'#eff3f3',border:'3px solid #c9d0d5',boxShadow:'0 9px 22px #0005',textAlign:'center',color:'#376c9d',fontFamily:font,fontSize:25,fontWeight:900,paddingTop:18}}>
 牛乳<div style={{marginTop:9,height:55,background:'#3374b4',clipPath:'polygon(0 70%,50% 5%,100% 70%,100% 100%,0 100%)'}}/></div></div>;
const Taxi=({n,p,elapsed,phase}: {n:string;p:number;elapsed:number;phase:string})=>{
 const phone=/スマホ|LINE|通知|既読|メッセージ|画面を伏せた|トーク/.test(n)&&!n.includes('悠真のことを思い出し');
 const image=/窓|顔|笑|映っ|月/.test(n);
 const moon=phase==='taxi_moon'||(phase==='taxi_exit'&&/月/.test(n));
 const waiting=phase==='taxi_message';
 const route=phase==='taxi_open'?'西麻布 → 外苑西通り':phase==='taxi_return'?'渋谷 → 三軒茶屋':phase==='taxi_moon'?'池尻大橋 → 三軒茶屋':'三軒茶屋交差点';
 const first=!['taxi_return','taxi_moon','taxi_exit'].includes(phase);
 const notification=waiting?['今日はありがとう！ また飲もうね']:['今度は二人でご飯行かない？'];
 return <AbsoluteFill>
  <BG file="BG_v64_taxi_night.svg" elapsed={elapsed} dim={moon?.16:.19}/>
  <div style={{...inset,top:160,left:100,right:100,height:600,overflow:'hidden',pointerEvents:'none'}}>
   {Array.from({length:7}).map((_,i)=><div key={i} style={{...inset,left:((i*344-elapsed*80)%2410+2410)%2410-260,top:0,width:130,height:490,transform:'skewX(-12deg)',opacity:.14,background:'linear-gradient(90deg,transparent,#e0b57888 45%,transparent)'}}/>)}
   {Array.from({length:11}).map((_,i)=><div key={i} style={{...inset,left:((i*243-elapsed*47)%2300+2300)%2300-240,top:300+(i%4)*36,width:120,height:5,background:i%3?'#dab88b':'#d1ddec',boxShadow:'0 0 21px #e5c98b',opacity:.35}}/>)}
  </div>
  <Moon x={1450} y={310} r={72} p={moon?ease(p,.03,.45):0}/>
  {/* The same taxi seat, window, door, and moving roadway remain mounted for adjacent taxi narration beats. */}
  <svg style={{...inset,inset:0,pointerEvents:'none'}} width="1920" height="1080" viewBox="0 0 1920 1080">
   <path d="M88 98V780H1840V96M88 765H1837M480 98L350 765M1510 98L1655 765" stroke="#090b12" strokeWidth="34" fill="none"/>
   <path d="M0 1078L420 765H1525L1920 1078" fill="#211e27"/>
   <path d="M0 948L420 768H1525L1920 948" fill="#191a25"/>
   <path d="M455 765V1080M1490 765V1080" stroke="#534955" strokeWidth="22"/>
   <path d="M138 765H1768" stroke="#8d8390" strokeWidth="6" opacity=".7"/>
   <path d="M1680 125L1830 125L1830 736L1680 736" fill="none" stroke="#1e1a27" strokeWidth="18"/>
   <path d="M1670 465L1730 485" stroke="#aaa4a5" strokeWidth="17" strokeLinecap="round"/>
  </svg>
  {/* Her reflection is translucent; it is the SAME woman seen in the window, not a sudden second character. */}
  <div style={{...inset,left:460,top:180,width:310,height:530,opacity:image?.24:.08,transform:'scaleX(-1)',filter:'blur(1.5px)'}}>
   <div style={{...inset,top:0,left:78,width:150,height:185,borderRadius:'50%',background:'#ab8a83',boxShadow:'0 0 0 28px #221b29'}}/>
   <div style={{...inset,top:160,left:0,width:310,height:360,borderRadius:'45% 45% 20% 20%',background:'#3e2a3a'}}/>
  </div>
  <div style={{...inset,left:45,top:450,width:460,height:660,pointerEvents:'none'}}>
   <div style={{...inset,left:80,top:65,width:210,height:250,borderRadius:'47%',background:'#221b29'}}/>
   <div style={{...inset,left:120,top:94,width:158,height:192,borderRadius:'42%',background:'#ba9384'}}/>
   <div style={{...inset,left:155,top:239,width:84,height:80,background:'#aa827a'}}/>
   <div style={{...inset,left:26,top:293,width:390,height:370,borderRadius:'48% 52% 0 0',background:'#302031',transform:'rotate(-4deg)'}}/>
   <div style={{...inset,left:230,top:385,width:180,height:50,borderRadius:45,background:'#ae8c80',transform:'rotate(20deg)'}}/>
   <div style={{...inset,left:295,top:384,width:80,height:100,borderRadius:10,background:'#131922',transform:'rotate(-15deg)'}}/>
  </div>
  {phone&&<Mobile x={1280} y={126} p={ease(p)} title={first?'今夜のお客さん':'今夜のお客さん'}
   clock={first?'01:43':'02:09'} messages={[{text:notification[0]}]}/>}
  {moon&&image&&<div style={{...inset,left:465,top:180,width:300,height:500,border:'2px solid #b4b5c335',opacity:ease(p,.1,.7),transform:'translateX(8px)'}}/>}
  {/交差点で止まった|このあたりですか|ここでお願いします/.test(n)&&<div style={{...inset,right:190,bottom:230,width:140,height:12,background:'#df5556',boxShadow:'0 0 90px 28px #a3203877'}}/>}
  <Shade/><Label name={route} sub="TAXI / 01:43"/>
  {/既読というシステム|既読の二文字|小さな「既読」/.test(n)&&<Text x={1030} y={350} w={650} size={59} p={p}>既読</Text>}
  {/誰かに選んでもらえた|たった一人から聞きたかった|でも、本当は/.test(n)&&<Text x={1070} y={355} w={640} size={50} p={p}>「また会いたい」</Text>}
  {/午前一時四十三分/.test(n)&&<Text x={1080} y={285} w={600} size={75} p={p}>01:43</Text>}
 </AbsoluteFill>;
};
const Gallery=({n,p,elapsed}:{n:string;p:number;elapsed:number})=>{
 const name=/名前|間違え/.test(n),invite=/また呼んでいい|もちろんです|また会いたい/.test(n);
 return <AbsoluteFill>
  <BG file="BG_v64_gallery_night.svg" elapsed={elapsed} dim={.18}/>
  <div style={{...inset,left:450,top:420,width:1000,height:260,background:'radial-gradient(ellipse,#e3a27f32,transparent 70%)',opacity:.6+.3*Math.sin(elapsed/3)}}/>
  <Man x={230} y={235} scale={1.35} p={1}/><Man x={1460} y={300} scale={1.18} p={1}/>
  <Woman x={890} y={260} scale={1.3} p={1}/>
  <div style={{...inset,left:580,top:740,width:850,height:260,borderRadius:'45%',background:'linear-gradient(#8c655e,#3c2731)',boxShadow:'0 15px 70px #0009'}}/>
  <Glass x={730} y={590} tilt={Math.sin(elapsed/4)*2}/>
  <Glass x={1080} y={610} tilt={Math.sin(elapsed/5)*4}/>
  <div style={{...inset,left:1220,top:730,width:150,height:105,borderRadius:27,background:'#16141b',boxShadow:'0 0 0 6px #b69e7d88'}}/>
  {name&&<Text x={140} y={140} w={540} size={47} p={p}>「美咲ちゃん、あ……」</Text>}
  {invite&&<Text x={1210} y={150} w={570} size={48} p={p}>「また呼んでいい？」</Text>}
  {/かわいい|彼氏いない|モテる|褒め/.test(n)&&<div style={{...inset,left:1100,top:140,opacity:ease(p)}}><Text x={0} y={0} size={55}>「かわいいね」</Text></div>}
  <Shade/><Label name="西麻布" sub="PRIVATE LOUNGE"/>
 </AbsoluteFill>;
};
const Meeting=({n,p,elapsed}:{n:string;p:number;elapsed:number})=><AbsoluteFill>
 <BG file="BG_ebisu_restaurant_night.svg" elapsed={elapsed} dim={.18} pan={7}/>
 <Woman x={500} y={255} scale={1.3}/><Man x={1030} y={240} scale={1.4}/>
 <div style={{...inset,left:480,top:780,width:1050,height:250,background:'linear-gradient(#8d5f4b,#26191a)',borderRadius:'47% 47% 0 0',boxShadow:'0 9px 50px #0009'}}/>
 <Glass x={690} y={650}/><Glass x={1210} y={660}/>
 {/駅|また飲もう/.test(n)&&<Text x={1230} y={148} size={45} w={520} p={p}>「また飲もうよ」</Text>}
 {/LINE|返事|嬉しかった/.test(n)&&<Mobile x={1290} y={120} p={ease(p)} title="悠真" messages={[{text:'今日は楽しかった！ 無事帰れた？'}]}/>}
 <Shade/><Label name="恵比寿" sub="友人の誕生日会 / 二年前"/>
 </AbsoluteFill>;
const Walk=({n,p,elapsed,moon=false}:{n:string;p:number;elapsed:number;moon?:boolean})=>{
 const station=/祐天寺|ラーメン/.test(n),river=/目黒川/.test(n);
 return <AbsoluteFill>
  <BG file={station?'BG_ebisu_meguro_walk_night.svg': 'BG_ebisu_meguro_walk_night.svg'} elapsed={elapsed} dim={moon?.1:.21} pan={8}/>
  <div style={{...inset,left:100,top:730,right:90,height:220,background:'linear-gradient(#141b27b0,#0a0f19c0)',transform:'skewX(-6deg)'}}/>
  <Moon x={1530} y={270} r={79} p={moon?1:0}/>
  <Woman x={510+Math.sin(elapsed/1.1)*7} y={380+Math.sin(elapsed*5)*4} scale={1.25} direction="right"/>
  <Man x={900+Math.sin(elapsed/1.1)*7} y={345+Math.sin(elapsed*5+1)*4} scale={1.4} direction="left"/>
  {/月きれい|ほんとだ/.test(n)&&moon&&<Text x={1180} y={155} w={570} size={47} p={p}>「今日、月きれいだね」</Text>}
  {/中目黒|祐天寺|目黒川/.test(n)&&!moon&&<div style={{...inset,left:1210,top:150,opacity:ease(p)}}><Text x={0} y={0} size={49}>{river?'目黒川':station?'祐天寺':'中目黒'}</Text></div>}
  <Shade/><Label name={moon?'目黒銀座商店街':river?'目黒川沿い':'中目黒・祐天寺'} sub={moon?'春の夜 / あの人が見ていた月':'二年前の記憶'}/>
 </AbsoluteFill>;
};
const Room=({n,p,elapsed,phase}:{n:string;p:number;elapsed:number;phase:string})=>{
 const coffee=/土曜日|朝|コーヒー|牛乳|カップ|窓|光|布団|嬉しかった/.test(n)&&phase==='yutenji_room';
 const chat=phase==='old_chat'||/LINE|既読|返信|送って/.test(n);
 const waiting=/会いた|会え|会う|我慢|仕事|忙し|恋人|付き合おう|重い/.test(n);
 const stages=coffee?'morning':chat?'night':waiting?'evening':'warm';
 return <AbsoluteFill>
  <BG file="BG_v64_yutenji_1k.svg" elapsed={elapsed} dim={stages==='night'?.65:stages==='evening'?.3:.05} pan={3}/>
  <div style={{...inset,left:140,top:150,width:850,height:750,background:'linear-gradient(110deg,#ffe5b122,transparent 72%)',opacity:coffee?1:0}}/>
  <Woman x={280} y={555} scale={1.15} pose="sitting" direction="right"/>
  <Man x={1010} y={390} scale={1.26} pose={coffee?'standing':'sitting'} direction="left"/>
  <div style={{...inset,left:780,top:752,width:580,height:150,background:'#755e51',borderRadius:'30%',opacity:coffee?1:.6}}/>
  {coffee&&<><Coffee x={820} y={580} p={ease(p,.01,.3)} milk/><Coffee x={1140} y={570} p={ease(p,.14,.43)}/>
   <Milk x={1220} y={635} p={/牛乳|カップ/.test(n)?ease(p):.75}/></>}
  {chat&&<Mobile x={1340} y={112} title="悠真" clock="23:17" read={/既読/.test(n)} p={ease(p)}
   messages={[{text:'今日はありがとう',own:true},{text:/寝落ち/.test(n)?'こちらこそ！ 昨日寝落ちしてた笑':'',own:false}].filter(x=>x.text)}/>}
  {waiting&&!chat&&<Text x={1150} y={130} size={46} w={610} p={p}>「付き合おう」</Text>}
  <Shade/><Label name="祐天寺" sub="駅から七分 / 六畳の一K"/>
 </AbsoluteFill>;
};
const Cafe=({n,p,elapsed}:{n:string;p:number;elapsed:number})=><AbsoluteFill>
 <BG file="BG_v64_ebisu_cafe.svg" elapsed={elapsed} dim={.12} pan={4}/>
 <Woman x={260} y={330} scale={1.4} direction="right"/>
 <Man x={1320} y={330} scale={1.44} direction="left"/>
 <div style={{...inset,left:430,top:735,width:1080,height:210,background:'linear-gradient(#9b7b65,#5a463f)',borderRadius:'50% 50% 10% 10%'}}/>
 <Coffee x={720} y={625} p={1} milk/>
 <div style={{...inset,left:550,top:680,width:140,height:30,background:'#e3e2d9',borderRadius:'50%',opacity:.5}}/>
 {/恋人|付き合う|ちゃんと伝え/.test(n)&&<Text x={1180} y={172} w={610} size={45} p={p}>「付き合うことになった人がいて」</Text>}
 {/おめでとう|ありがとう/.test(n)&&<Text x={1190} y={155} w={530} size={53} p={p}>「ありがとう」</Text>}
 <Shade/><Label name="恵比寿" sub="カフェ / 彼が恋人の話をした日"/>
 </AbsoluteFill>;
const Sangen=({n,p,elapsed,milk=false}:{n:string;p:number;elapsed:number;milk?:boolean})=><AbsoluteFill>
 <BG file={milk?'BG_v64_convenience.svg':'BG_sangenjaya_street_night.svg'} elapsed={elapsed} dim={milk?.04:.19} pan={milk?0:10}/>
 <Woman x={milk?560:850} y={milk?305:305} scale={1.65} direction={milk?'right':'front'}/>
 {milk&&<><div style={{...inset,left:1070,top:320,width:570,height:510,background:'linear-gradient(90deg,#e5f3fb,#bdcfd4)',border:'12px solid #abc0cd'}}/>
  {Array.from({length:8}).map((_,i)=><Milk key={i} x={1100+(i%4)*135} y={355+Math.floor(i/4)*230} p={i===3?1:ease(p)}/>)}
  <Milk x={880} y={665-200*ease(p)} p={ease(p,.2,.75)}/></>}
 {!milk&&/月は|空を/.test(n)&&<Moon x={1440} y={195} r={69} p={/隠れ/.test(n)?0:ease(p)}/>}
 {!milk&&/スマホ|LINE/.test(n)&&<Mobile x={1280} y={130} p={ease(p)} messages={[{text:'今度は二人でご飯行かない？'}]}/>}
 <Shade/><Label name={milk?'茶沢通り':'三軒茶屋'} sub={milk?'コンビニ / 翌朝の牛乳':'タクシーを降りたあと'}/>
 </AbsoluteFill>;
export const SceneVisual:React.FC<Props>=({meta,narration:n,beatProgress:p,stageElapsed:elapsed})=>{
 const phase=meta.phase;
 let scene:React.ReactNode;
 switch(meta.location){
  case 'taxi':scene=<Taxi n={n} p={p} elapsed={elapsed} phase={phase}/>;break;
  case 'gallery':scene=<Gallery n={n} p={p} elapsed={elapsed}/>;break;
  case 'ebisu_izakaya':scene=<Meeting n={n} p={p} elapsed={elapsed}/>;break;
  case 'date_walk':scene=<Walk n={n} p={p} elapsed={elapsed}/>;break;
  case 'meguro_walk':scene=<Walk n={n} p={p} elapsed={elapsed} moon/>;break;
  case 'yutenji_room':scene=<Room n={n} p={p} elapsed={elapsed} phase={phase}/>;break;
  case 'ebisu_cafe':scene=<Cafe n={n} p={p} elapsed={elapsed}/>;break;
  case 'sangen_street':scene=<Sangen n={n} p={p} elapsed={elapsed}/>;break;
  case 'convenience':scene=<Sangen n={n} p={p} elapsed={elapsed} milk/>;break;
  default:throw new Error('Unmapped location: '+meta.location);
 }
 return <AbsoluteFill style={{fontFamily:font,overflow:'hidden'}}>{scene}
 <div style={{...inset,inset:0,background:'radial-gradient(ellipse at center,transparent 40%,#080a15b2 100%)',pointerEvents:'none'}}/>
 </AbsoluteFill>;
};
