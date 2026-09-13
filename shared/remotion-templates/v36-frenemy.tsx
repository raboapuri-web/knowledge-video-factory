import React from 'react';
import {AbsoluteFill,interpolate,spring,useCurrentFrame,useVideoConfig} from 'remotion';

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const font='"Noto Sans CJK JP",sans-serif';
const C={paper:'#f4efe7',ink:'#06080b',muted:'#929aa4',red:'#c9555e',amber:'#d6a84f',cyan:'#69c4cb',blue:'#6f91cf',violet:'#9a82d3',green:'#7fa98b',steel:'#38424d'};
const p=(f:number,a=0,b=30)=>interpolate(f,[a,b],[0,1],clamp);

const Bg=({children,tone='dark'}:{children:React.ReactNode;tone?:'dark'|'blue'|'red'|'gold'})=>{
  const f=useCurrentFrame();
  const bg=tone==='blue'?'linear-gradient(145deg,#06101a,#102334 58%,#020304)':tone==='red'?'linear-gradient(145deg,#150708,#2b1014 58%,#020304)':tone==='gold'?'linear-gradient(145deg,#130f08,#2c2213 58%,#020304)':'linear-gradient(145deg,#05070a,#141a21 58%,#020304)';
  return <AbsoluteFill style={{background:bg,color:C.paper,fontFamily:font,overflow:'hidden'}}><AbsoluteFill style={{transform:`scale(${1.006+Math.sin(f/180)*.006})`}}>{children}</AbsoluteFill><AbsoluteFill style={{background:'radial-gradient(circle at 50% 42%,transparent 24%,rgba(0,0,0,.30) 70%,rgba(0,0,0,.88) 100%)'}}/></AbsoluteFill>;
};

export const ComparisonMirror=({headline='親友は、自分を映す鏡になる',selfLabel='自分',friendLabel='親友',selfValue='現在地',friendValue='一歩先'}:{headline?:string;selfLabel?:string;friendLabel?:string;selfValue?:string;friendValue?:string})=>{
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  const q=spring({frame:f,fps,config:{damping:16,stiffness:85}});
  const person=(x:number,label:string,value:string,color:string,mirror=false)=><div style={{position:'absolute',left:x,top:290,width:430,height:520,transform:`scaleX(${mirror?-1:1})`}}><div style={{position:'absolute',left:125,top:0,width:180,height:180,borderRadius:'50%',background:`radial-gradient(circle at 42% 32%,${color},#0b0e12 72%)`,border:`4px solid ${color}66`}}/><div style={{position:'absolute',left:45,top:175,width:340,height:300,borderRadius:'90px 90px 30px 30px',background:`linear-gradient(180deg,${color}b5,#0c1015)`}}/><div style={{position:'absolute',left:0,right:0,top:475,textAlign:'center',fontSize:38,fontWeight:950,color}}>{label}<div style={{fontSize:27,color:C.muted,marginTop:10}}>{value}</div></div></div>;
  return <Bg tone="blue"><div style={{position:'absolute',left:100,right:100,top:70,textAlign:'center',fontSize:56,fontWeight:950}}>{headline}</div>{person(300,selfLabel,selfValue,C.steel)}{person(1190,friendLabel,friendValue,C.cyan,true)}<div style={{position:'absolute',left:940,top:230,width:7,height:650,background:'linear-gradient(180deg,transparent,#d7edf2cc,transparent)',boxShadow:'0 0 52px rgba(120,220,230,.28)',opacity:q}}/><div style={{position:'absolute',left:790,top:475,width:330,textAlign:'center',fontSize:34,fontWeight:900,color:C.amber,opacity:q}}>比較可能性<div style={{fontSize:23,color:C.muted,marginTop:8}}>似ているほど、差が意味を持つ</div></div></Bg>;
};

export const ReferenceGroupScale=({headline='同じ数字でも、隣に誰がいるかで意味が変わる',value='600万円',lowPeer='400万円',highPeer='1500万円'}:{headline?:string;value?:string;lowPeer?:string;highPeer?:string})=>{
  const f=useCurrentFrame();
  const q=p(f,8,52);
  const panel=(x:number,peer:string,caption:string,color:string,up:boolean)=><div style={{position:'absolute',left:x,top:300,width:690,height:500,borderRadius:34,border:`2px solid ${color}55`,background:'rgba(5,8,12,.78)',padding:'40px 50px'}}><div style={{fontSize:26,color:C.muted}}>自分</div><div style={{fontSize:72,fontWeight:950,color:C.paper,marginTop:8}}>{value}</div><div style={{marginTop:58,fontSize:26,color:C.muted}}>友人平均</div><div style={{fontSize:58,fontWeight:950,color}}>{peer}</div><div style={{position:'absolute',right:45,bottom:38,fontSize:64,fontWeight:950,color,transform:`translateY(${(1-q)*(up?40:-40)}px)`,opacity:q}}>{up?'↑ 誇らしい':'↓ 心細い'}</div></div>;
  return <Bg tone="gold"><div style={{position:'absolute',left:100,right:100,top:70,textAlign:'center',fontSize:54,fontWeight:950}}>{headline}</div>{panel(170,lowPeer,'上方',C.green,true)}{panel(1060,highPeer,'下方',C.red,false)}<div style={{position:'absolute',left:905,top:360,width:4,height:390,background:'rgba(255,255,255,.12)'}}/></Bg>;
};

export const FriendEnemyBlend=({headline='FriendがEnemyに変わるのではない',friend='FRIEND',enemy='ENEMY',result='FRENEMY'}:{headline?:string;friend?:string;enemy?:string;result?:string})=>{
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  const q=spring({frame:f-8,fps,config:{damping:14,stiffness:88}});
  const lx=interpolate(q,[0,1],[250,760],clamp); const rx=interpolate(q,[0,1],[1320,980],clamp);
  return <Bg tone="red"><div style={{position:'absolute',left:100,right:100,top:70,textAlign:'center',fontSize:54,fontWeight:950}}>{headline}</div><div style={{position:'absolute',left:lx,top:335,width:500,height:250,borderRadius:125,background:'rgba(105,196,203,.20)',border:`4px solid ${C.cyan}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:62,fontWeight:950,color:C.cyan}}>{friend}</div><div style={{position:'absolute',left:rx,top:335,width:500,height:250,borderRadius:125,background:'rgba(201,85,94,.20)',border:`4px solid ${C.red}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:62,fontWeight:950,color:C.red}}>{enemy}</div><div style={{position:'absolute',left:0,right:0,top:680,textAlign:'center',fontSize:84,fontWeight:950,letterSpacing:8,color:C.paper,opacity:p(f,30,70)}}>{result}<div style={{fontSize:29,color:C.muted,letterSpacing:0,marginTop:14}}>友情を残したまま、敵意が追加される</div></div></Bg>;
};

export const AmbivalenceSwitchboard=({headline='助ける。そして、傷つける。',positive=['相談に乗る','応援する','助ける'],negative=['腐す','情報を隠す','足を引く']}:{headline?:string;positive?:string[];negative?:string[]})=>{
  const f=useCurrentFrame();
  const row=(x:number,y:number,label:string,color:string,on:boolean,i:number)=><div key={label} style={{position:'absolute',left:x,top:y,width:650,height:96,borderRadius:20,background:'rgba(7,10,14,.84)',border:`2px solid ${color}44`,display:'flex',alignItems:'center',padding:'0 30px',fontSize:31,fontWeight:900}}><div style={{width:30,height:30,borderRadius:'50%',marginRight:24,background:on?color:'#252b32',boxShadow:on?`0 0 28px ${color}`:'none',opacity:p(f,i*8,i*8+20)}}/>{label}</div>;
  return <Bg><div style={{position:'absolute',left:100,right:100,top:70,textAlign:'center',fontSize:56,fontWeight:950}}>{headline}</div><div style={{position:'absolute',left:220,top:220,fontSize:40,fontWeight:950,color:C.cyan}}>HELP</div><div style={{position:'absolute',left:1060,top:220,fontSize:40,fontWeight:950,color:C.red}}>HARM</div>{positive.map((t,i)=>row(220,300+i*130,t,C.cyan,(Math.floor(f/28)+i)%2===0,i))}{negative.map((t,i)=>row(1060,300+i*130,t,C.red,(Math.floor(f/28)+i)%2===1,i+1))}<div style={{position:'absolute',left:858,top:300,width:200,height:360,display:'flex',alignItems:'center',justifyContent:'center',fontSize:86,fontWeight:950,color:C.amber}}>↔</div></Bg>;
};

export const HighlightFeed=({headline='友人のハイライト集 vs 自分のノーカット人生',items=['昇進','海外旅行','結婚','起業'],selfLabel='自分の24時間'}:{headline?:string;items?:string[];selfLabel?:string})=>{
  const f=useCurrentFrame();
  return <Bg tone="blue"><div style={{position:'absolute',left:100,right:100,top:68,textAlign:'center',fontSize:52,fontWeight:950}}>{headline}</div><div style={{position:'absolute',left:190,top:210,width:700,height:650,borderRadius:36,border:`2px solid ${C.cyan}55`,background:'rgba(5,12,17,.82)',overflow:'hidden'}}><div style={{padding:'30px 36px',fontSize:32,fontWeight:950,color:C.cyan}}>FRIENDS / HIGHLIGHTS</div>{items.map((t,i)=>{const y=110+((i*145+f*1.25)%650)-120;return <div key={t} style={{position:'absolute',left:38,right:38,top:y,height:112,borderRadius:22,background:'linear-gradient(90deg,rgba(105,196,203,.18),rgba(255,255,255,.03))',border:'1px solid rgba(105,196,203,.32)',display:'flex',alignItems:'center',padding:'0 32px',fontSize:34,fontWeight:900}}><span style={{fontSize:48,marginRight:24}}>✓</span>{t}</div>})}</div><div style={{position:'absolute',left:1030,top:210,width:700,height:650,borderRadius:36,border:'2px solid rgba(255,255,255,.14)',background:'rgba(7,9,12,.86)'}}><div style={{padding:'30px 36px',fontSize:32,fontWeight:950,color:C.muted}}>{selfLabel}</div>{['仕事','移動','不安','家事','失敗','睡眠'].map((t,i)=><div key={t} style={{position:'absolute',left:55+(i%2)*300,top:130+Math.floor(i/2)*145,width:245,height:95,borderRadius:18,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.10)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:800,color:i===2||i===4?C.red:C.paper,opacity:.75+.2*Math.sin((f+i*13)/25)}}>{t}</div>)}<div style={{position:'absolute',left:0,right:0,bottom:35,textAlign:'center',fontSize:27,color:C.muted}}>勝った瞬間だけを集めた他人に、全日常で挑む</div></div></Bg>;
};
