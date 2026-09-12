import React from 'react';
import {AbsoluteFill,interpolate} from 'remotion';

export type Beat={id:string;visual:string;narration:string};
type P={beat:Beat;p:number;mode:string};

const font="'Noto Sans CJK JP','Noto Sans JP',sans-serif";
const ease=(p:number,a=0,b=1)=>interpolate(p,[a,b],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
const drift=(p:number,n=1)=>Math.sin(p*Math.PI*2*n);
const base=(bg:string):React.CSSProperties=>({background:bg,color:'#f4f2ee',fontFamily:font,overflow:'hidden'});
const label:React.CSSProperties={position:'absolute',top:52,left:64,fontSize:24,letterSpacing:3,opacity:.78,fontWeight:700};
const softShadow='0 18px 60px rgba(0,0,0,.35)';

const Person=({x,y,scale=1,shirt='#626b78',skin='#d7ae94',hair='#252323,pose=0}:{x:number;y:number;scale?:number;shirt?:string;skin?:string;hair?:string;pose?:number})=><div style={{position:'absolute',left:x,top:y,width:130*scale,height:300*scale,transform:`translateY(${Math.sin(pose)*4}px)`}}>
  <div style={{position:'absolute',left:35*scale,top:0,width:62*scale,height:76*scale,borderRadius:'48% 48% 45% 45%',background:skin}}/>
  <div style={{position:'absolute',left:30*scale,top:-8*scale,width:73*scale,height:30*scale,borderRadius:'55% 55% 20% 20%',background:hair}}/>
  <div style={{position:'absolute',left:18*scale,top:70*scale,width:100*scale,height:130*scale,borderRadius:22*scale,background:shirt}}/>
  <div style={{position:'absolute',left:28*scale,top:195*scale,width:28*scale,height:100*scale,borderRadius:15*scale,background:'#30333b',transform:`rotate(${pose*2}deg)`}}/>
  <div style={{position:'absolute',left:78*scale,top:195*scale,width:28*scale,height:100*scale,borderRadius:15*scale,background:'#30333b',transform:`rotate(${-pose*2}deg)`}}/>
  <div style={{position:'absolute',left:-4*scale,top:88*scale,width:28*scale,height:105*scale,borderRadius:15*scale,background:skin,transformOrigin:'top',transform:`rotate(${8+pose*8}deg)`}}/>
  <div style={{position:'absolute',left:110*scale,top:88*scale,width:28*scale,height:105*scale,borderRadius:15*scale,background:skin,transformOrigin:'top',transform:`rotate(${-8-pose*8}deg)`}}/>
</div>;

const Window=({x,y,w,h,night=false}:{x:number;y:number;w:number;h:number;night?:boolean})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,border:'8px solid #403b37',background:night?'linear-gradient(#111a2d,#27334c)':'linear-gradient(#d8e7ef,#f5d7ad)'}}>
  <div style={{position:'absolute',left:'48%',top:0,width:7,height:'100%',background:'#403b37'}}/>
  <div style={{position:'absolute',left:0,top:'50%',width:'100%',height:7,background:'#403b37'}}/>
</div>;

const Clock=({x,y,size=150,p=0}:{x:number;y:number;size?:number;p?:number})=><div style={{position:'absolute',left:x,top:y,width:size,height:size,borderRadius:'50%',border:'8px solid #d8d0c5',background:'#23242a',boxShadow:softShadow}}>
  <div style={{position:'absolute',left:'49%',top:'18%',width:5,height:'34%',background:'#eee',transformOrigin:'50% 94%',transform:`rotate(${p*240}deg)`}}/>
  <div style={{position:'absolute',left:'49%',top:'49%',width:5,height:'28%',background:'#d6a86c',transformOrigin:'50% 6%',transform:`rotate(${p*900}deg)`}}/>
</div>;

const Phone=({x,y,p=0,lines=4}:{x:number;y:number;p?:number;lines?:number})=><div style={{position:'absolute',left:x,top:y,width:210,height:390,borderRadius:32,background:'#121419',border:'8px solid #393d46',boxShadow:softShadow,transform:`rotate(${drift(p)*1.2}deg)`}}>
  <div style={{position:'absolute',left:16,top:30,width:178,height:315,borderRadius:18,background:'#e9ecef',overflow:'hidden'}}>
    {Array.from({length:lines}).map((_,i)=><div key={i} style={{margin:16,width:140-(i%2)*25,height:18,borderRadius:10,background:i===0?'#8894a4':'#c5cbd2',transform:`translateX(${i%2?ease(p,.2,.8)*18:0}px)`}}/>) }
  </div>
</div>;

export const BirthdayScene=({p,mode}:P)=>{
  const after=mode==='birthday_afterparty'||mode==='final_home';
  return <AbsoluteFill style={base(after?'linear-gradient(120deg,#17191f,#27232a)':'linear-gradient(120deg,#332522,#191c24)')}>
    <div style={label}>{after?'実家・夜':'母の65歳の誕生日'}</div>
    <Window x={1180} y={80} w={560} h={370} night={after}/>
    <div style={{position:'absolute',left:160,top:570,width:1580,height:250,borderRadius:34,background:'#5c3c2d',boxShadow:softShadow,transform:`scaleX(${.96+ease(p)*.04})`}}/>
    {!after&&<><div style={{position:'absolute',left:820,top:510,width:250,height:110,borderRadius:'50%',background:'#f2e3d1',boxShadow:softShadow}}/><div style={{position:'absolute',left:875,top:465,fontSize:64}}>🎂</div></>}
    <Person x={260} y={290} shirt="#5c748f" pose={drift(p,1)}/><Person x={1300} y={300} shirt="#45515f" pose={-drift(p,1.2)}/>
    <Person x={70} y={330} scale={.88} shirt="#786b5f"/><Person x={1540} y={330} scale={.88} shirt="#7b5f65"/>
    {after&&<div style={{position:'absolute',left:710,top:440,width:500,height:270,background:'#2a2522',border:'10px solid #7c6552',transform:`rotate(${interpolate(p,[0,1],[-5,2])}deg)`,boxShadow:softShadow}}><div style={{margin:25,fontSize:34,color:'#d8c6ad'}}>古い家族アルバム</div></div>}
  </AbsoluteFill>;
};

export const BrothersScene=({p,mode}:P)=>{
  const paths=mode==='two_paths'||mode==='final_paths';
  return <AbsoluteFill style={base('radial-gradient(circle at 50% 35%,#303642,#11141a)')}>
    <div style={label}>{paths?'同じ家から、別の道へ':'同じ家・違う二人'}</div>
    <div style={{position:'absolute',left:0,top:0,width:'50%',height:'100%',background:'linear-gradient(180deg,rgba(72,91,116,.45),transparent)'}}/>
    <div style={{position:'absolute',right:0,top:0,width:'50%',height:'100%',background:'linear-gradient(180deg,rgba(76,68,89,.45),transparent)'}}/>
    <Person x={400+ease(p)*90} y={320} scale={1.18} shirt="#577698" pose={drift(p)}/><Person x={1250-ease(p)*90} y={330} scale={1.1} shirt="#596273" pose={-drift(p)}/>
    {paths&&<svg width="1920" height="1080" style={{position:'absolute',inset:0}}><path d={`M960 700 C ${840-ease(p)*160} 650, 600 820, 250 970`} stroke="#9cb3cd" strokeWidth="16" fill="none"/><path d={`M960 700 C ${1080+ease(p)*160} 650, 1330 820, 1690 970`} stroke="#c6acb8" strokeWidth="16" fill="none"/></svg>}
  </AbsoluteFill>;
};

export const GeneticsScene=({p,mode}:P)=>{
  const cards=mode==='genetic_cards';
  return <AbsoluteFill style={base('linear-gradient(135deg,#091a20,#152a31 55%,#11161c)')}>
    <div style={label}>{cards?'同じカード束、違う手札':'染色体はシャッフルされる'}</div>
    {!cards&&<>
      {Array.from({length:12}).map((_,i)=><div key={i} style={{position:'absolute',left:160+i*135,top:210+(i%2)*180,width:45,height:360,borderRadius:30,background:i%2?'#d19b6b':'#6ba5b4',transform:`rotate(${(i%2?1:-1)*(12+drift(p+i*.1)*8)}deg) translateY(${drift(p+i*.05)*25}px)`,boxShadow:softShadow}}/>) }
      <svg width="1920" height="1080" style={{position:'absolute',inset:0,opacity:.8}}><path d="M250 780 C 600 450, 900 900, 1500 400" stroke="#f0d4a5" strokeWidth="9" fill="none" strokeDasharray="20 18"/></svg>
    </>}
    {cards&&<div style={{position:'absolute',left:180,top:210,right:180,bottom:180,display:'flex',justifyContent:'space-around',alignItems:'center'}}>
      {[0,1,2].map((g)=><div key={g} style={{width:420,height:550,borderRadius:30,background:'#252c35',padding:24,boxShadow:softShadow,transform:`translateY(${drift(p+g*.15)*18}px)`}}>{Array.from({length:12}).map((_,i)=><div key={i} style={{display:'inline-block',width:80,height:115,margin:8,borderRadius:10,background:(i+g)%3===0?'#b9896c':(i+g)%3===1?'#668a9d':'#7b738f',transform:`rotate(${(i%3-1)*4}deg)`}}/>)}</div>)}
    </div>}
  </AbsoluteFill>;
};

export const HistoryScene=({p,mode}:P)=>{
  const adler=mode==='adler_room';
  const letters=mode==='letters_archive';
  return <AbsoluteFill style={base('linear-gradient(120deg,#342719,#16130f)')}>
    <div style={label}>{adler?'20世紀・出生順位の理論':letters?'双子から届く手紙':'1875年・ロンドン'}</div>
    <div style={{position:'absolute',left:100,top:120,width:1720,height:780,borderRadius:40,background:'#4a3525',boxShadow:'inset 0 0 100px rgba(0,0,0,.6)'}}/>
    <div style={{position:'absolute',left:240,top:550,width:1450,height:220,background:'#6e4b2e',transform:'perspective(800px) rotateX(55deg)',boxShadow:softShadow}}/>
    {letters?Array.from({length:18}).map((_,i)=><div key={i} style={{position:'absolute',left:340+(i%6)*200,top:250+Math.floor(i/6)*120,width:155,height:90,background:'#d7c3a2',transform:`rotate(${(i%5-2)*5+drift(p+i*.04)*2}deg) translateY(${-ease(p,.1,.9)*(i%3)*20}px)`,boxShadow:softShadow}}/>):<><Person x={760} y={240} shirt={adler?'#5a4f45':'#443d36'} pose={drift(p)*.4}/><div style={{position:'absolute',left:1020,top:260,width:420,height:260,background:'#d8c5a5',padding:28,color:'#2d251e',fontSize:34,transform:`rotate(${drift(p)*1.3}deg)`}}>{adler?'出生順位 ≠ 運命の番号':'Nature / Nurture'}</div></>}
  </AbsoluteFill>;
};

export const LabScene=({p,mode}:P)=>{
  const brain=mode==='brain_development'||mode==='neural_noise';
  const epi=mode==='epigenetic_lab';
  const data=mode==='birth_order_data';
  return <AbsoluteFill style={base('linear-gradient(135deg,#17212b,#202f3a 55%,#10161d)')}>
    <div style={label}>{brain?'発達する脳':epi?'一卵性双生児のエピジェネティクス':data?'出生順位を大規模データで見る':'双生児研究'}</div>
    {brain?<div style={{position:'absolute',left:480,top:180,width:960,height:720,borderRadius:'48% 52% 45% 55%',background:'radial-gradient(circle,#8b6f96,#463d59 68%,#1d2230)',boxShadow:'0 0 100px rgba(158,126,177,.4)'}}>{Array.from({length:70}).map((_,i)=><div key={i} style={{position:'absolute',left:80+(i*71)%800,top:55+(i*113)%600,width:10+(i%4)*3,height:10+(i%4)*3,borderRadius:'50%',background:'#d4bedc',boxShadow:`0 0 ${10+(i%5)*4}px #c9b7d4`,transform:`translate(${drift(p+i*.03)*18}px,${drift(p+i*.06)*12}px) scale(${.6+ease(p,.05,.85)*.5})`}}/>)}</div>:<>
      <div style={{position:'absolute',left:150,top:180,width:680,height:650,borderRadius:35,background:'#d8e0e6',boxShadow:softShadow}}><div style={{padding:34,color:'#25303b',fontSize:34}}>LAB / behavioral genetics</div>{Array.from({length:8}).map((_,i)=><div key={i} style={{margin:'22px 40px',height:22,width:500-(i%3)*80,background:i%2?'#8395a5':'#acb8c1',borderRadius:11,transform:`scaleX(${.65+ease(p,i*.04,.8)*.35})`,transformOrigin:'left'}}/>)}</div>
      <div style={{position:'absolute',left:1030,top:170,width:620,height:630,borderRadius:40,background:'#0d1218',border:'2px solid #607080',overflow:'hidden'}}>{Array.from({length:epi?20:12}).map((_,i)=><div key={i} style={{position:'absolute',left:40+(i%5)*110,top:70+Math.floor(i/5)*120,width:60,height:60,borderRadius:epi?'50%':10,background:epi?(i%3?'#6e93a5':'#bb886e'):(i%2?'#88a0b2':'#b2bdc5'),transform:`translateY(${drift(p+i*.07)*16}px)`}}/>)}</div>
    </>}
  </AbsoluteFill>;
};

export const LivingRoomScene=({p,mode}:P)=>{
  const older=mode==='livingroom_naoto';
  const dinner=mode==='dinner_dialogue'||mode==='reaction_loop';
  const album=mode==='family_album'||mode==='album_perspective';
  const system=mode==='family_system'||mode==='house_layers'||mode==='terrain_home'||mode==='home_safety';
  return <AbsoluteFill style={base(older?'linear-gradient(#2b3038,#1d2026)':'linear-gradient(#3a302b,#232323)')}>
    <div style={label}>{album?'家族のアルバム':dinner?'同じ食卓、違う反応':system?'同じ住所でも、同じ環境ではない':older?'2002年・直人5歳':'1999年・悠真5歳'}</div>
    <Window x={1280} y={100} w={470} h={320} night={album}/>
    <div style={{position:'absolute',left:120,top:580,width:1660,height:260,borderRadius:32,background:'#6c4b38',boxShadow:softShadow}}/>
    {album?<><div style={{position:'absolute',left:500,top:300,width:920,height:510,background:'#332a25',border:'14px solid #7a5d46',transform:`rotate(${interpolate(p,[0,1],[-4,3])}deg)`,boxShadow:softShadow}}>{Array.from({length:8}).map((_,i)=><div key={i} style={{position:'absolute',left:60+(i%4)*205,top:70+Math.floor(i/4)*205,width:165,height:135,background:i%2?'#c0a88c':'#9da6a1',border:'8px solid #e8dfd3',transform:`rotate(${(i%3-1)*4}deg)`}}/>)}</div></>:<><Person x={360} y={300} scale={older?.9:1.05} shirt="#55718a" pose={dinner?drift(p):0}/><Person x={900} y={320} scale={.88} shirt="#68707c" pose={dinner?-drift(p):0}/><Person x={1280} y={260} scale={1.05} shirt="#665b51"/>{system&&Array.from({length:5}).map((_,i)=><div key={i} style={{position:'absolute',left:220+i*310,top:160+(i%2)*100,width:240,height:100,borderRadius:20,background:'rgba(220,220,220,.12)',border:'2px solid rgba(255,255,255,.15)',transform:`translateY(${drift(p+i*.1)*20}px)`}}/> )}</>}
  </AbsoluteFill>;
};

export const SchoolScene=({p,mode}:P)=>{
  const library=mode==='school_library';
  const classRoom=mode==='classroom_seat'||mode==='festival_committee';
  const newyear=mode==='newyear_family'||mode==='identity_mirrors';
  const preschool=mode==='preschool_twins'||mode==='twin_divergence';
  if(newyear)return <AbsoluteFill style={base('linear-gradient(#4a322a,#1c1918)')}><div style={label}>親戚の集まりと家族の役割</div><div style={{position:'absolute',left:150,top:610,width:1620,height:220,background:'#7c5b40',borderRadius:40}}/><Person x={280} y={300} shirt="#537394"/><Person x={1250} y={310} shirt="#626b78"/>{['活発な兄','静かな弟','運動','勉強'].map((t,i)=><div key={t} style={{position:'absolute',left:600+(i%2)*430,top:180+Math.floor(i/2)*170,width:330,height:100,borderRadius:30,background:'rgba(245,239,228,.13)',fontSize:36,display:'flex',alignItems:'center',justifyContent:'center',transform:`translateY(${drift(p+i*.12)*14}px)`}}>{t}</div>)}</AbsoluteFill>;
  if(preschool)return <AbsoluteFill style={base('linear-gradient(#bcd3df,#d8c9a4)')}><div style={{...label,color:'#27313a'}}>同じ教室から、別の人間関係へ</div><div style={{position:'absolute',left:0,bottom:0,width:'100%',height:420,background:'#758d5d'}}/>{Array.from({length:8}).map((_,i)=><div key={i} style={{position:'absolute',left:120+i*220,top:200+(i%2)*130,width:130,height:130,borderRadius:25,background:i%3===0?'#c38d6b':i%3===1?'#708fa5':'#c7b15f',transform:`translate(${drift(p+i*.08)*20}px,${drift(p+i*.06)*12}px)`}}/>)}<Person x={500-ease(p)*120} y={420} scale={.75} shirt="#5d7d9b"/><Person x={1050+ease(p)*120} y={420} scale={.75} shirt="#5d7d9b"/></AbsoluteFill>;
  return <AbsoluteFill style={base(library?'linear-gradient(#293426,#151b17)':classRoom?'linear-gradient(#d9d1bf,#6c7780)':'linear-gradient(#b7ceda,#586d7b)')}>
    <div style={{...label,color:library?'#eee':'#25303a'}}>{library?'学校の図書室':classRoom?(mode==='festival_committee'?'文化祭実行委員':'中学一年の教室'):'小学校・放課後'}</div>
    {library?<>{Array.from({length:6}).map((_,i)=><div key={i} style={{position:'absolute',left:120+i*285,top:170,width:220,height:650,background:'#4a3829'}}>{Array.from({length:8}).map((__,j)=><div key={j} style={{margin:18,width:160,height:38,background:(i+j)%2?'#8e725e':'#647568'}}/>)}</div>)}<Person x={920} y={360} scale={.8} shirt="#697581"/></>:classRoom?<>{Array.from({length:15}).map((_,i)=><div key={i} style={{position:'absolute',left:170+(i%5)*315,top:260+Math.floor(i/5)*220,width:200,height:110,background:'#7a634f',transform:`perspective(500px) rotateX(15deg) translateY(${drift(p+i*.05)*4}px)`}}/>)}<Person x={1230} y={300} scale={.72} shirt="#65788d"/>{mode==='festival_committee'&&<div style={{position:'absolute',left:400,top:170,width:700,height:170,background:'#efe7d5',color:'#3a342d',fontSize:55,display:'flex',alignItems:'center',justifyContent:'center',transform:`scale(${.85+ease(p)*.15})`}}>文化祭 実行委員</div>}</>:<><div style={{position:'absolute',left:0,bottom:0,width:'100%',height:370,background:'#788d66'}}/><div style={{position:'absolute',left:1130,top:520,width:170,height:170,borderRadius:'50%',background:'#d8d8d1',transform:`translate(${ease(p)*180}px,${-Math.abs(Math.sin(p*Math.PI*2))*140}px)`}}/><Person x={550+ease(p)*180} y={380} scale={.8} shirt="#587493" pose={drift(p)*1.2}/></>}
  </AbsoluteFill>;
};

export const FeedbackScene=({p,mode}:P)=> <AbsoluteFill style={base('radial-gradient(circle,#263642,#11161c)')}><div style={label}>{mode==='chance_branch'?'偶然が次の環境を変える':'小さな差が自分を増幅する'}</div><svg width="1920" height="1080" style={{position:'absolute',inset:0}}>{Array.from({length:7}).map((_,i)=>{const x=280+i*220,y=540+Math.sin(i)*160;return <React.Fragment key={i}><circle cx={x} cy={y} r={55+ease(p,i*.05,.8)*18} fill={i%2?'#7f9aad':'#ad866f'}/>{i<6&&<path d={`M${x+55} ${y} C ${x+120} ${y-100}, ${x+140} ${540+Math.sin(i+1)*160+100}, ${x+220-55} ${540+Math.sin(i+1)*160}`} stroke="#ddd1bd" strokeWidth="9" fill="none"/>}</React.Fragment>})}</svg></AbsoluteFill>;

export const CareerScene=({p,mode}:P)=>{
  const event=mode==='network_event';
  const photo=mode==='photo_trip';
  const env=mode==='environment_choice';
  const uni=mode==='university_split';
  if(photo)return <AbsoluteFill style={base('linear-gradient(#667c8b,#d0b88d)')}><div style={label}>直人の休日</div><div style={{position:'absolute',bottom:0,width:'100%',height:350,background:'#43533f'}}/><div style={{position:'absolute',left:1230,top:150,width:520,height:360,background:'#8c8b83',clipPath:'polygon(0 30%,100% 0,100% 100%,0 100%)'}}/><Person x={650} y={420} shirt="#5a6875"/><div style={{position:'absolute',left:760,top:480,width:100,height:70,background:'#15191e',borderRadius:15,transform:`rotate(${drift(p)*3}deg)`}}/></AbsoluteFill>;
  return <AbsoluteFill style={base(event?'linear-gradient(#222831,#12161c)':'linear-gradient(120deg,#28313d,#1b232c)')}><div style={label}>{env?'自分に合う環境を選ぶ':uni?'大学でさらに分かれる':event?'悠真の交流会':'進路指導室'}</div>{event?Array.from({length:10}).map((_,i)=><Person key={i} x={110+(i%5)*350} y={220+Math.floor(i/5)*350} scale={.62} shirt={i%2?'#546b7f':'#665e67'} pose={drift(p+i*.07)}/>):<><div style={{position:'absolute',left:150,top:190,width:720,height:690,borderRadius:36,background:'#d7d1c2',color:'#25303a',padding:50}}><div style={{fontSize:44,fontWeight:800}}>進路希望</div><div style={{marginTop:70,fontSize:38,lineHeight:2}}>{mode==='career_yuma'?'経営・マーケティング\n人と動かす仕事':mode==='career_naoto'?'理工系\n光学・機械・研究':uni?'イベント運営 / 研究室':'性格 → 選択 → 環境'}</div></div><div style={{position:'absolute',left:1050,top:200,width:650,height:670,borderRadius:36,background:'#111820',overflow:'hidden'}}>{Array.from({length:12}).map((_,i)=><div key={i} style={{position:'absolute',left:70+(i%4)*140,top:70+Math.floor(i/4)*180,width:95,height:95,borderRadius:'50%',background:i%2?'#7695aa':'#aa806b',transform:`translateY(${drift(p+i*.08)*20}px)`}}/>)}</div></>}</AbsoluteFill>;
};

export const TwinScene=({p,mode}:P)=>{
  const old=mode==='identical_twins_old';
  return <AbsoluteFill style={base(old?'linear-gradient(#38404a,#1b2026)':'linear-gradient(#98b8c4,#d8c69a)')}><div style={label}>{old?'50年後の一卵性双生児':'ほぼ同じDNAから始まる二人'}</div><div style={{position:'absolute',left:0,bottom:0,width:'100%',height:330,background:old?'#2f3338':'#6d8660'}}/><Person x={480-ease(p)*40} y={330} scale={old?1.05:.8} shirt="#627d97" hair={old?'#a6a4a1':'#292626'}/><Person x={1180+ease(p)*40} y={330} scale={old?1.05:.8} shirt="#627d97" hair={old?'#b3b0aa':'#292626'}/>{old&&<><div style={{position:'absolute',left:360,top:190,fontSize:34,opacity:.75}}>喫煙・都市A・仕事A</div><div style={{position:'absolute',right:300,top:190,fontSize:34,opacity:.75}}>非喫煙・都市B・仕事B</div></>}</AbsoluteFill>;
};

export const FinalScene=({p,mode}:P)=>{
  if(mode==='causal_web')return <AbsoluteFill style={base('radial-gradient(circle,#2a3440,#0e1217)')}><div style={label}>原因は箱ではなく、網の目</div><svg width="1920" height="1080" style={{position:'absolute',inset:0}}>{Array.from({length:18}).map((_,i)=>{const a=i/18*Math.PI*2,x=960+Math.cos(a)*(250+(i%3)*120),y=540+Math.sin(a)*(220+(i%4)*65);return <React.Fragment key={i}><circle cx={x} cy={y} r={32} fill={i%3===0?'#b28870':i%3===1?'#718fa5':'#82789b'}/><line x1={x} y1={y} x2={960+drift(p+i*.03)*80} y2={540+drift(p+i*.05)*60} stroke="rgba(220,220,220,.35)" strokeWidth="5"/></React.Fragment>})}</svg></AbsoluteFill>;
  const split=mode==='station_split';
  return <AbsoluteFill style={base('linear-gradient(#111827,#232c38)')}><div style={label}>{split?'同じ改札から別のホームへ':'夜の帰り道'}</div><div style={{position:'absolute',bottom:0,width:'100%',height:300,background:'#1b1e22'}}/>{Array.from({length:9}).map((_,i)=><div key={i} style={{position:'absolute',left:60+i*220,top:170+(i%3)*60,width:130,height:350,background:'#303943',boxShadow:'0 0 20px rgba(255,220,150,.08)'}}/>)}<Person x={520-ease(p)*210} y={430} scale={.8} shirt="#557694"/><Person x={1100+ease(p)*210} y={430} scale={.8} shirt="#626b77"/><div style={{position:'absolute',left:split?860:1250,top:260,width:split?180:90,height:split?400:70,background:split?'#858b91':'#17191d',transform:`rotate(${split?0:drift(p)*3}deg)`}}/></AbsoluteFill>;
};

export const CaptionLayer=({beat,p}:{beat:Beat;p:number})=>{
  const parts=beat.narration.split(/(?<=。)/).filter(Boolean);
  const idx=Math.min(parts.length-1,Math.floor(p*parts.length));
  return <div style={{position:'absolute',left:135,right:135,bottom:42,minHeight:118,borderRadius:24,background:'rgba(8,10,14,.82)',border:'1px solid rgba(255,255,255,.16)',boxShadow:softShadow,padding:'24px 38px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:font,fontSize:39,fontWeight:700,lineHeight:1.55,textAlign:'center',color:'#f4f1eb',textShadow:'0 3px 12px #000'}}>{parts[idx]??beat.narration}</div>;
};
