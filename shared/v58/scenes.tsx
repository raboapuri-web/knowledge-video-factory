import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame} from 'remotion';
import {MaleCharacter,FemaleCharacter} from './characters';

type Meta={id:string;phase:string;visual:string;localIndex:number;variant:number;shotKind:string};
const font='Noto Sans JP, sans-serif';
const C=(v:number)=>Math.max(0,Math.min(1,v));
const E=(p:number,a:number,b:number)=>C((p-a)/Math.max(.001,b-a));

const Bg=({src,p,x=0,y=0,dim=0,scale=1.055}:{src:string;p:number;x?:number;y?:number;dim?:number;scale?:number})=><>
  <Img src={staticFile(src)} style={{position:'absolute',inset:-46,width:2012,height:1172,objectFit:'cover',transform:`translate(${x*p}px,${y*p}px) scale(${scale+.025*p})`,filter:dim?`brightness(${1-dim})`:undefined}}/>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 45%,transparent 48%,rgba(0,0,0,.46) 100%)'}}/>
</>;

const Grain=()=>{const f=useCurrentFrame();return <><div style={{position:'absolute',inset:0,opacity:.07,backgroundImage:'radial-gradient(#fff .7px,transparent .7px)',backgroundSize:'5px 5px',transform:`translate(${f%5}px,${(f*3)%5}px)`,mixBlendMode:'soft-light'}}/><div style={{position:'absolute',inset:0,boxShadow:'inset 0 0 170px #000b'}}/></>};

const Char=({x,y,s=.72,pose='standing',direction='front',outfit='businessCasual',tone='#44566b',phone=false}:{x:number;y:number;s?:number;pose?:any;direction?:any;outfit?:any;tone?:string;phone?:boolean})=>
  <MaleCharacter pose={pose} direction={direction} outfit={outfit} prop={phone?'phone':'none'} colors={{top:tone}} width={300} scale={s} style={{position:'absolute',left:x,top:y}}/>;

const Woman=({x,y,s=.72,pose='standing',direction='front',outfit='casual'}:{x:number;y:number;s?:number;pose?:any;direction?:any;outfit?:any})=>
  <FemaleCharacter pose={pose} direction={direction} outfit={outfit} width={300} scale={s} style={{position:'absolute',left:x,top:y}}/>;

const Text=({x,y,text,size=44,w=900,color='#f4f1ea',alpha=1}:{x:number;y:number;text:string;size?:number;w?:number;color?:string;alpha?:number})=>
  <div style={{position:'absolute',left:x,top:y,width:w,fontFamily:font,fontWeight:900,fontSize:size,lineHeight:1.35,color,opacity:alpha,textShadow:'0 6px 28px #000',whiteSpace:'pre-line'}}>{text}</div>;

const Card=({x,y,w=430,h=120,text,size=30,alpha=1,accent='#c5a56c'}:{x:number;y:number;w?:number;h?:number;text:string;size?:number;alpha?:number;accent?:string})=>
  <div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:18,background:'rgba(8,10,14,.90)',border:`2px solid ${accent}88`,boxShadow:'0 25px 70px #0009',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:font,fontWeight:820,fontSize:size,lineHeight:1.35,color:'#f5f2ea',textAlign:'center',whiteSpace:'pre-line',opacity:alpha}}>{text}</div>;

const Laptop=({x,y}:{x:number;y:number})=><div style={{position:'absolute',left:x,top:y}}>
  <div style={{width:360,height:225,borderRadius:16,background:'#20252c',border:'8px solid #59616a',boxShadow:'0 20px 55px #0009'}}>
    <div style={{margin:14,width:316,height:176,background:'#dfe8ec',position:'relative'}}>
      <div style={{position:'absolute',left:22,top:24,width:170,height:14,background:'#8ca3af'}}/>
      <div style={{position:'absolute',left:22,top:58,width:255,height:12,background:'#aebfc8'}}/>
      <div style={{position:'absolute',left:22,top:92,width:220,height:12,background:'#b7c5cc'}}/>
      <div style={{position:'absolute',left:22,top:126,width:275,height:12,background:'#9db1bc'}}/>
    </div>
  </div><div style={{width:420,height:24,marginLeft:-30,borderRadius:'0 0 18px 18px',background:'#777f86'}}/>
</div>;

const Slides=({count,p}:{count:number;p:number})=><div style={{position:'absolute',left:1180,top:120,width:600,height:760}}>
  {Array.from({length:Math.min(count,20)}).map((_,i)=>{
    const visible=i<Math.ceil(count*(.55+.45*E(p,.05,.65)));
    return <div key={i} style={{position:'absolute',left:(i%4)*128,top:Math.floor(i/4)*128,width:112,height:78,borderRadius:8,background:visible?'#eef2f4':'#30343a',border:'3px solid #87949c',boxShadow:'0 10px 25px #0007',opacity:visible?1:.18}}>
      <div style={{position:'absolute',left:10,right:10,top:12,height:8,background:'#8fa3ae'}}/>
      <div style={{position:'absolute',left:10,right:30,top:32,height:6,background:'#bac7cd'}}/>
    </div>
  })}
  <Text x={40} y={660} text={count===20?'20枚':'4枚'} size={52} w={220} color={count===20?'#e7d9bf':'#dfbe77'}/>
</div>;

const SlackPanel=({p}:{p:number})=><div style={{position:'absolute',right:110,top:110,width:620,height:720,borderRadius:28,background:'#151922',border:'2px solid #4d5865',padding:32,fontFamily:font,color:'#f5f5f1',boxShadow:'0 35px 100px #000a'}}>
  <div style={{fontSize:25,fontWeight:900,opacity:.55}}>Slack</div>
  {['#general','#team-sales','#project-a'].map((t,i)=><div key={t} style={{marginTop:18,padding:14,borderRadius:13,background:i===1?'#2a313c':'#20252d',fontSize:25,opacity:.78}}>{t}</div>)}
  <div style={{marginTop:34,fontSize:24,opacity:.42}}>通知なし</div>
  <div style={{marginTop:18,height:10,width:420,background:'#2e343d'}}/><div style={{marginTop:14,height:10,width:340,background:'#2e343d'}}/>
  <div style={{position:'absolute',right:30,bottom:30,fontSize:76,opacity:.22+.3*Math.sin(p*9)}}>●</div>
</div>;

const Phone=({children,x=1240,y=130}:{children?:React.ReactNode;x?:number;y?:number})=><div style={{position:'absolute',left:x,top:y,width:430,height:790,borderRadius:54,background:'#0b0e13',border:'12px solid #333b44',boxShadow:'0 35px 100px #000c',overflow:'hidden'}}>
  <div style={{position:'absolute',left:145,top:12,width:140,height:18,borderRadius:15,background:'#1f252c'}}/>{children}
</div>;

const Clock=({time,x=160,y=120}:{time:string;x?:number;y?:number})=><div style={{position:'absolute',left:x,top:y,fontFamily:font,fontSize:82,fontWeight:900,color:'#e6d6b8',textShadow:'0 8px 35px #000'}}>{time}</div>;

const Footstep=({wet=false,p=0}:{wet?:boolean;p?:number})=><>
  {Array.from({length:5}).map((_,i)=><div key={i} style={{position:'absolute',left:220+i*320+(i%2?80:0),top:760+(i%2)*70,width:105,height:44,borderRadius:'50%',background:wet?'rgba(174,205,218,.38)':'rgba(20,22,25,.28)',transform:`rotate(${-12+i*8}deg) scale(${.8+.18*E(p,i*.08,.35+i*.08)})`,opacity:E(p,i*.07,.28+i*.07)}}/>)}
  <Text x={wet?260:1180} y={wet?170:180} text={wet?'びちゃ。\nびちゃ。\nびちゃ。':'カツ。\nカツ。\nカツ。'} size={64} w={420} color={wet?'#d8edf4':'#f0e3c5'} alpha={.8}/>
</>;

const OfficeCrowd=({p}:{p:number})=><>{Array.from({length:9}).map((_,i)=><Char key={i} x={80+i*205+(i%2)*35} y={560+(i%3)*22} s={.48} pose='walking' direction={i%2?'left':'right'} tone={i%3===0?'#384858':'#4c5562'}/>)}</>;

export const SceneVisual=({meta,beatProgress:bp,phaseProgress:pp}:{meta:Meta;beatProgress:number;phaseProgress:number})=>{
  const v=meta.variant;
  let scene:React.ReactNode;
  switch(meta.phase){
    case 'train_departure':
      scene=<><Bg src='assets/backgrounds/BG_joetsu_shinkansen_interior.svg' p={pp} x={-90}/><Char x={760} y={590} s={.78} pose='sitting' direction='right' outfit='casual'/>{v%3===0&&<Text x={130} y={120} text='拝啓、高校生の君へ。' size={58} w={900}/>} {v%3===1&&<Card x={1280} y={150} w={420} text={"東京 → 新潟\n上越新幹線 とき"}/>}{v%3===2&&<Text x={1140} y={250} text='逆向き。' size={72} w={500} color='#dfbe77'/>}</>;
      break;
    case 'niigata_memory':
      scene=<><Bg src='assets/backgrounds/BG_niigata_wet_road_winter.svg' p={pp} x={-120} dim={.06}/><Char x={470+pp*180} y={590} s={.68} pose='walking' direction='right' outfit='casual'/><Footstep wet p={pp}/>{v%4===1&&<Text x={1050} y={160} text={"灰色の空。\n濡れた制服。\n結露した窓。"} size={43} w={650}/>} {v%4===2&&<Card x={1160} y={230} text='もっと乾いた場所へ' accent='#a9c8d5'/>}{v%4===3&&<Card x={1160} y={390} text='もっと速い場所へ' accent='#d0b985'/>}</>;
      break;
    case 'niigata_station':
      scene=<><Bg src='assets/backgrounds/BG_niigata_station_platform_winter.svg' p={pp} x={-40}/><Char x={700} y={600} s={.68} direction='right' outfit='casual'/><Woman x={1080} y={610} s={.66} direction='left'/>{v%4===0&&<Text x={150} y={130} text='「着いたら連絡してね」' size={50} w={760}/>} {v%4===1&&<Text x={150} y={220} text='「困ったら電話すればいいから」' size={48} w={880}/>} {v%4===2&&<Text x={150} y={310} text='「もう高校卒業したんだけど」' size={48} w={880}/>} {v%4===3&&<Text x={1150} y={200} text='何者かになる予定の人間。' size={42} w={620}/>}</>;
      break;
    case 'college_montage':
      scene=<><Bg src='assets/backgrounds/BG_nakano_shinbashi_1k_night.svg' p={pp} x={-65} dim={.12}/><Char x={620} y={605} s={.7} pose='sitting' direction='right' outfit='casual'/>{['高田馬場','新宿','渋谷','恵比寿'].map((t,i)=><Card key={t} x={110+i*395} y={130+(i%2)*130} w={300} h={90} text={t} size={32} alpha={E(bp,.06+i*.08,.3+i*.08)}/>)}</>;
      break;
    case 'roppongi_club':
      scene=<><Bg src='assets/backgrounds/BG_roppongi_club_night.svg' p={pp} x={-50}/>{Array.from({length:7}).map((_,i)=><Char key={i} x={210+i*220} y={600+(i%2)*25} s={.5} pose='standing' direction={i%2?'left':'right'} outfit='casual' tone={i%3===0?'#553a66':'#334b5c'}/>)}
      <div style={{position:'absolute',inset:0,background:`linear-gradient(${95+pp*40}deg,rgba(98,43,136,.22),transparent 35%,rgba(23,112,135,.22))`}}/>
      {v%3===1&&<Text x={160} y={150} text='何が楽しいのか、最後まで分からなかった。' size={46} w={1000}/>} {v%3===2&&<Text x={1120} y={200} text='でも、楽しそうにした。' size={48} w={650} color='#e3c786'/>}</>;
      break;
    case 'job_entry':
      scene=<><Bg src='assets/backgrounds/BG_shinagawa_walkway_morning.svg' p={pp} x={-100}/><OfficeCrowd p={pp}/><Char x={820} y={575} s={.63} pose='walking' direction='right'/>{v%4===0&&<Text x={150} y={115} text={"新品のスーツ。\n新品の革靴。\n社員証。名刺。"} size={45} w={650}/>} {v%4===1&&<Card x={1260} y={150} text='勤務地：品川'/>}{v%4===2&&<Text x={1150} y={235} text='やっと東京側の人間になった。' size={44} w={650}/>}</>;
      break;
    case 'first_year':
      scene=<><Bg src='assets/backgrounds/BG_shinagawa_office_day.svg' p={pp} x={-40}/><Char x={370} y={590} s={.7} pose='sitting' direction='right'/><Laptop x={760} y={490}/>{v%4===0&&<Card x={1180} y={140} text='宛先ミス' accent='#d49a8d'/>}{v%4===1&&<Card x={1180} y={290} text='Excel 数式破損' accent='#d49a8d'/>}{v%4===2&&<Card x={1180} y={440} text='数字を一桁ミス' accent='#d49a8d'/>}{v%4===3&&<Text x={1120} y={660} text='「一年目なんだから、次気をつければいいよ」' size={38} w={680}/>}</>;
      break;
    case 'misalignment':
      scene=<><Bg src='assets/backgrounds/BG_shinagawa_office_day.svg' p={pp} x={-25}/><Char x={400} y={590} s={.7} pose='sitting' direction='right'/><Laptop x={760} y={490}/>{v%3===0&&<Text x={1160} y={155} text='前も言ったよね。' size={56} w={620} color='#e0b3a9'/>}{v%3===1&&<Text x={1160} y={275} text='ほんの少しだけ、ずれている。' size={48} w={620}/>} {v%3===2&&<Text x={1160} y={420} text='そこじゃない。' size={72} w={620} color='#e0b3a9'/>}</>;
      break;
    case 'powerpoint':
      scene=<><Bg src='assets/backgrounds/BG_shinagawa_office_day.svg' p={pp} x={-35} dim={.08}/><Char x={260} y={610} s={.66} pose='standing' direction='right'/><Char x={650} y={590} s={.72} pose='sitting' direction='left' tone='#555d66'/>{v<4?<Slides count={20} p={bp}/>:<Slides count={4} p={bp}/>}
      {v===1&&<Text x={90} y={140} text={"夜9時まで。\n20枚。"} size={48} w={440}/>} {v===2&&<Text x={90} y={280} text='「で、何が言いたいの？」' size={50} w={620} color='#e0b3a9'/>}{v===3&&<Text x={90} y={430} text='「数字を並べるのが仕事じゃない」' size={42} w={700}/>} {v>=4&&<Text x={90} y={650} text='20 → 17 → 13 → 9 → 4' size={54} w={800} color='#dfbe77'/>}</>;
      break;
    case 'sano_gap':
      scene=<><Bg src='assets/backgrounds/BG_shinagawa_office_day.svg' p={pp} x={-30}/><Char x={260} y={610} s={.64} pose='sitting' direction='right'/><Char x={1060} y={585} s={.69} pose='standing' direction='left' tone='#2d5266'/>{v%4===0&&<Card x={1300} y={150} text='佐野：5分で確認'/>}{v%4===1&&<Card x={1300} y={310} text='僕：2日で20枚' accent='#b77a73'/>}{v%4===2&&<Text x={1120} y={510} text={"努力して駄目だったら、\n本当に能力の問題になる。"} size={41} w={700}/>} {v%4===3&&<>{['ロジカルシンキング','仮説思考','結論から話す技術'].map((t,i)=><Card key={t} x={140+i*420} y={150} w={350} h={90} text={t} size={27}/>)}</>}</>;
      break;
    case 'office_isolation':
      scene=<><Bg src='assets/backgrounds/BG_shinagawa_office_day.svg' p={pp} x={-20} dim={.16}/><Char x={450} y={610} s={.67} pose='standing' direction='right'/>{v%4===0&&<Text x={120} y={130} text='怒られないことが、一日の目標になった。' size={46} w={900}/>} {v%4===1&&<><Card x={1080} y={140} text='「小川さんってさ」' accent='#b78279'/><Card x={1080} y={300} text='「悪い人じゃないんだけどね」' accent='#b78279'/><Card x={1080} y={460} text='「全部、一回説明しないといけない感じ」' accent='#b78279'/></>} {v%4===2&&<Text x={1110} y={660} text={"僕という人間の扱い方が、\nもう共有されていた。"} size={42} w={650}/>} {v%4===3&&<><Char x={1160} y={590} s={.6} direction='right' tone='#2d5266'/><Text x={1080} y={150} text='佐野は会社側の人間。' size={46} w={650}/></>}</>;
      break;
    case 'evaluation':
      scene=<><Bg src='assets/backgrounds/BG_shinagawa_office_day.svg' p={pp} x={-25} dim={.1}/><Char x={410} y={600} s={.68} pose='sitting' direction='right'/><Char x={950} y={590} s={.72} pose='sitting' direction='left' tone='#5c5b60'/>{v%4===0&&<Text x={1220} y={130} text='「真面目なんだよね」' size={48} w={520}/>} {v%4===1&&<Text x={1180} y={270} text='「もう一段、自分で考えて動けるといい」' size={39} w={650}/>} {v%4===2&&<Text x={1220} y={420} text='「受け身に見える」' size={46} w={540}/>} {v%4===3&&<Text x={1110} y={610} text='“なんとなく足りない”は、直し方が分からない。' size={42} w={720} color='#e0b3a9'/>}</>;
      break;
    case 'ooimachi_sunday':
      scene=<><Bg src='assets/backgrounds/BG_ooimachi_1k_night.svg' p={pp} x={-25} dim={.05}/><Char x={500} y={610} s={.74} pose='sitting' direction='right' outfit='casual' phone/><SlackPanel p={pp}/>{v%4===0&&<Clock time='18:00'/>}{v%4===1&&<Clock time='20:00'/>}{v%4===2&&<Clock time='22:00'/>}{v%4===3&&<><Clock time='03:41'/><Text x={120} y={260} text='目を閉じると、会議が始まる。' size={44} w={760}/></>}</>;
      break;
    case 'restroom':
      scene=<><Bg src='assets/backgrounds/BG_office_restroom.svg' p={pp} x={-25} dim={.08}/><Char x={690} y={565} s={.8} pose='sitting' direction='right'/>{v%5===0&&<Text x={120} y={120} text='月曜日。品川駅。' size={52} w={600}/>} {v%5===1&&<Text x={120} y={240} text={"吐いた。\nほとんど何も出なかった。"} size={45} w={720}/>} {v%5===2&&<Text x={1180} y={160} text='08:34' size={78} w={400} color='#e4c17d'/>} {v%5===3&&<Text x={1120} y={330} text={"ネクタイを締め直す。\n社員証を掛け直す。"} size={42} w={650}/>} {v%5===4&&<Text x={1120} y={520} text={"鏡の中の男は、\n仕事に行けない人には見えなかった。"} size={41} w={650}/>}</>;
      break;
    case 'walkway_break':
      scene=<><Bg src='assets/backgrounds/BG_shinagawa_walkway_morning.svg' p={pp} x={-70}/><OfficeCrowd p={pp}/><Char x={850} y={575} s={.67} pose='standing' direction='right'/><Footstep p={pp}/>{v%4===0&&<Clock time='07:58'/>}{v%4===1&&<Clock time='08:03'/>}{v%4===2&&<Clock time='08:12'/>}{v%4===3&&<Text x={180} y={135} text={"乾いた東京のアスファルトの上で、\n僕だけが一歩も進めなかった。"} size={48} w={1050} color='#f0e3c5'/>}</>;
      break;
    case 'leave_and_resign':
      scene=<><Bg src='assets/backgrounds/BG_ooimachi_1k_night.svg' p={pp} x={-20} dim={.1}/><Char x={520} y={615} s={.72} pose='sitting' direction='right' outfit='casual'/>{v%6===0&&<Card x={1120} y={130} text='休職：3ヶ月'/>}{v%6===1&&<Text x={1100} y={300} text='「気づけなくてごめんな」' size={44} w={650}/>} {v%6===2&&<Text x={1080} y={470} text={"平日14時。\n会社にいない人は、たくさんいた。"} size={40} w={700}/>} {v%6===3&&<Card x={1180} y={200} text='退職届' accent='#b78279'/>} {v%6===4&&<Card x={1180} y={360} text={"社員証\nカチャ。"} accent='#d1b177'/>} {v%6===5&&<Text x={1070} y={560} text='僕が辞めても、東京には何も起きなかった。' size={41} w={720}/>}</>;
      break;
    case 'mother_call':
      scene=<><Bg src='assets/backgrounds/BG_ooimachi_1k_night.svg' p={pp} x={-20} dim={.16}/><Char x={500} y={610} s={.74} pose='phone' direction='right' outfit='casual' phone/><Phone><div style={{position:'absolute',inset:60,top:95,fontFamily:font,color:'#f4f3ef'}}><div style={{fontSize:34,fontWeight:900}}>母</div><div style={{marginTop:58,fontSize:29,lineHeight:1.7}}>「一回、新潟戻ろうと思ってる」</div><div style={{marginTop:40,fontSize:29,lineHeight:1.7,color:'#e5c987'}}>「部屋、片付けとくね」</div></div></Phone></>;
      break;
    case 'packing':
      scene=<><Bg src='assets/backgrounds/BG_ooimachi_1k_night.svg' p={pp} x={-25} dim={.06}/><Char x={520} y={610} s={.72} pose='standing' direction='right' outfit='casual'/>{Array.from({length:6}).map((_,i)=><div key={i} style={{position:'absolute',left:980+(i%3)*210,top:520+Math.floor(i/3)*180,width:180,height:135,background:'#8d6f4d',border:'3px solid #b18c62',boxShadow:'0 20px 50px #0007',opacity:E(pp,.05+i*.03,.28+i*.03)}}/>)}
      {v%3===0&&<Text x={110} y={130} text={"東京で十一年かけて増やしたものは、\n段ボール六箱になった。"} size={47} w={900}/>} {v%3===1&&<Card x={1120} y={150} text='15:12 東京 → 新潟'/>} {v%3===2&&<Text x={1110} y={360} text='「駅まで迎えに行くね」' size={46} w={650}/>}</>;
      break;
    case 'return_train':
      scene=<><Bg src='assets/backgrounds/BG_joetsu_shinkansen_interior.svg' p={pp} x={-80} dim={.05}/><Char x={760} y={590} s={.78} pose='sitting' direction='right' outfit='casual'/>{v%5===0&&<Card x={120} y={150} text={"東京 → 新潟\n片道"} accent='#c08d79'/>}{v%5===1&&<Text x={110} y={360} text={"旅行でもない。\n帰省でもない。\n帰る。"} size={49} w={650}/>} {v%5===2&&<Text x={1120} y={180} text='東京は僕を何者かにしてくれる場所じゃなかった。' size={42} w={680}/>} {v%5===3&&<Text x={1120} y={360} text={"自分が何者でもないことを、\nはっきり見せてくる場所だった。"} size={41} w={700} color='#dfbe77'/>} {v%5===4&&<Text x={1100} y={590} text='可能性は、試される前だけ大きく持てる。' size={43} w={720}/>}</>;
      break;
    case 'tunnel_return':
      scene=<><Bg src='assets/backgrounds/BG_joetsu_shinkansen_interior.svg' p={pp} x={-20} dim={.42}/><Char x={770} y={595} s={.78} pose='sitting' direction='right' outfit='casual'/>{v%4===0&&<Text x={120} y={140} text={"高崎を過ぎた。\n長いトンネル。"} size={48} w={700}/>} {v%4===1&&<div style={{position:'absolute',left:1110,top:160,width:560,height:460,background:'rgba(0,0,0,.66)',borderRadius:20,boxShadow:'inset 0 0 80px #000'}}><Text x={75} y={100} text={"29歳。\nパーカー。\n古いスニーカー。"} size={44} w={420}/></div>} {v%4===2&&<Text x={1100} y={690} text={"悪かったな。\nこんな感じだった。"} size={48} w={700}/>} {v%4===3&&<Text x={120} y={680} text='トンネルを抜けると、窓の外が白くなる。' size={42} w={900}/>}</>;
      break;
    case 'niigata_arrival':
      scene=<><Bg src='assets/backgrounds/BG_niigata_wet_road_winter.svg' p={pp} x={-70}/><Char x={520+pp*220} y={590} s={.7} pose='walking' direction='right' outfit='casual'/><Footstep wet p={pp}/>{v%4===1&&<Text x={1100} y={160} text={"高層ビルもない。\n会社のロゴもない。\n肩書きもない。"} size={44} w={670}/>} {v%4===2&&<Text x={1100} y={390} text={"でも、少しくらい\nゆっくりでいい。"} size={50} w={650} color='#d8edf4'/>} {v%4===3&&<Text x={1110} y={590} text={"びちゃ。\n帰ってきた音がする。"} size={54} w={620} color='#d8edf4'/>}</>;
      break;
    case 'final_letter':
      scene=<><div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#111922,#050709)'}}/><Bg src='assets/backgrounds/BG_joetsu_shinkansen_interior.svg' p={pp} x={-20} dim={.52}/><Char x={760} y={600} s={.75} pose='sitting' direction='right' outfit='casual'/>{v%4===0&&<Text x={180} y={150} text='東京へ行ってこい。' size={60} w={800}/>} {v%4===1&&<Text x={180} y={300} text={"思っているほど、\n特別な人間にはならない。"} size={50} w={900}/>} {v%4===2&&<Text x={180} y={500} text={"帰る場所を嫌えるというのは、\n帰る場所がある人間の贅沢だった。"} size={47} w={1200} color='#dfbe77'/>} {v%4===3&&<Text x={180} y={700} text='敬具。' size={64} w={500}/>}</>;
      break;
    default:
      scene=<><Bg src='assets/backgrounds/BG_joetsu_shinkansen_interior.svg' p={pp}/><Text x={180} y={180} text={meta.phase} size={52}/></>;
  }
  return <AbsoluteFill>{scene}<Grain/><div style={{position:'absolute',left:32,top:24,fontFamily:font,fontSize:18,fontWeight:700,color:'rgba(255,255,255,.34)'}}>{meta.id}</div></AbsoluteFill>;
};
