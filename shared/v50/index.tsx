import React from 'react';
import {AbsoluteFill,Composition,Img,interpolate,registerRoot,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import sync from './sync-timing.json';
import {SceneVisual} from './scenes';

type Beat={id:string;visual:string;narration:string;phase?:string;variant?:number;shotKind?:string};
type SyncBeat={index:number;start:number;end:number};
const beats=scriptData.beats as Beat[];
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const font='Noto Sans JP, sans-serif';

const splitSubtitle=(text:string)=>{
  const s=(text.match(/[^。！？]+[。！？]?/g)??[text]).map(v=>v.trim()).filter(Boolean);
  const out:string[]=[];
  for(const q of s){
    if(q.length<=25){out.push(q);continue;}
    const parts=q.split(/(?<=[、，])/).map(v=>v.trim()).filter(Boolean);
    let b='';
    for(const p of parts){if((b+p).length>25&&b){out.push(b);b=p}else b+=p}
    if(b)out.push(b);
  }
  return out.length?out:[text];
};

const activeAt=(sec:number)=>{
  const arr=(sync.beats||[]) as SyncBeat[];
  if(!arr.length)return {index:0,progress:0,phaseProgress:0};
  let i=arr.findIndex(b=>sec>=b.start&&sec<b.end);
  if(i<0)i=arr.length-1;
  const b=arr[i];
  const beatProgress=clamp((sec-b.start)/Math.max(.001,b.end-b.start));
  const phase=beats[i]?.phase;
  let s=i,e=i;
  while(s>0&&beats[s-1]?.phase===phase)s--;
  while(e<arr.length-1&&beats[e+1]?.phase===phase)e++;
  const phaseStart=arr[s]?.start??b.start;
  const phaseEnd=arr[e]?.end??b.end;
  const phaseProgress=clamp((sec-phaseStart)/Math.max(.001,phaseEnd-phaseStart));
  return {index:i,progress:beatProgress,phaseProgress};
};

const Subtitle=({beat,progress}:{beat:Beat;progress:number})=>{
  const chunks=splitSubtitle(beat.narration);
  const weights=chunks.map(x=>Math.max(1,x.length));
  const total=weights.reduce((a,b)=>a+b,0);
  const target=progress*total;
  let sum=0,k=0;
  for(let i=0;i<chunks.length;i++){sum+=weights[i];if(target<sum){k=i;break}}
  return <div style={{position:'absolute',left:140,right:140,bottom:26,display:'flex',justifyContent:'center',pointerEvents:'none'}}>
    <div style={{maxWidth:1460,padding:'8px 22px 10px',borderRadius:12,background:'rgba(0,0,0,.54)',fontFamily:font,fontWeight:700,fontSize:28,lineHeight:1.35,textAlign:'center',color:'#f5f3ee',textShadow:'0 2px 10px rgba(0,0,0,.96)'}}>{chunks[k]??chunks[chunks.length-1]}</div>
  </div>;
};

const Glass=({x,y,s=1}:{x:number;y:number;s?:number})=><div style={{position:'absolute',left:x,top:y,width:52*s,height:92*s,border:'4px solid rgba(235,240,245,.66)',borderTop:'none',borderRadius:`0 0 ${14*s}px ${14*s}px`,background:'linear-gradient(to top,rgba(194,142,70,.78) 0 52%,rgba(255,255,255,.05) 52%)',boxShadow:'0 12px 28px rgba(0,0,0,.35)'}}/>;
const Can=({x,y,rot=0}:{x:number;y:number;rot?:number})=><div style={{position:'absolute',left:x,top:y,width:54,height:118,borderRadius:12,background:'linear-gradient(90deg,#747a80,#d4d7d8 45%,#686d72)',border:'2px solid #e0e3e4aa',transform:`rotate(${rot}deg)`,boxShadow:'0 15px 30px #0007'}}><div style={{position:'absolute',left:9,right:9,top:8,height:8,borderRadius:8,background:'#43484d'}}/></div>;
const Silhouette=({x,p,dir=1}:{x:number;p:number;dir?:number})=><div style={{position:'absolute',left:x+dir*210*(p-.5),bottom:80,width:170,height:510,opacity:.2,filter:'blur(2px)',transform:`scaleX(${dir})`}}><div style={{position:'absolute',left:44,top:0,width:78,height:78,borderRadius:'50%',background:'#050607'}}/><div style={{position:'absolute',left:20,top:72,width:128,height:270,borderRadius:'55px 55px 20px 20px',background:'#050607'}}/><div style={{position:'absolute',left:32,top:320,width:38,height:190,background:'#050607',transform:'rotate(4deg)'}}/><div style={{position:'absolute',right:30,top:320,width:38,height:190,background:'#050607',transform:'rotate(-6deg)'}}/></div>;

const ShotAccent=({beat,progress}:{beat:Beat;progress:number})=>{
  const v=beat.variant??0;
  const phase=beat.phase??'';
  const a=interpolate(progress,[0,.08,.9,1],[0,1,1,.25],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const restaurant=['baba_youth','yurakucho_talk','reunion','acceptance'].includes(phase);
  const street=['mori_transfer','return_baba','stairs_down','walk_home','rotary_goodbye'].includes(phase);
  const room=['present_lonely','busy_excuse','juniors_safe','meguro_buy','screentime_alibi','spring_invite','no_grading'].includes(phase);
  const photo=['wedding_measure','kobayashi_house','different_game','final_archive'].includes(phase);
  if(restaurant){
    if(v%3===0)return <div style={{opacity:a}}><div style={{position:'absolute',left:-40,right:-40,bottom:-40,height:250,background:'linear-gradient(#5d3b28,#2d1b14)',boxShadow:'0 -20px 55px #0008'}}/><Glass x={280} y={790} s={1.25}/><Glass x={1510} y={805} s={1.05}/></div>;
    if(v%3===1)return <div style={{opacity:a}}><Img src={staticFile('assets/props/PROP_izakaya_beer_edamame_table.svg')} style={{position:'absolute',left:510,bottom:-130,width:920,filter:'drop-shadow(0 24px 34px rgba(0,0,0,.55))',transform:`translateY(${18*(1-progress)}px)`}}/></div>;
    return <div style={{opacity:a}}><div style={{position:'absolute',left:0,top:0,bottom:0,width:250,background:'linear-gradient(90deg,rgba(0,0,0,.75),transparent)'}}/><div style={{position:'absolute',right:0,top:0,bottom:0,width:220,background:'linear-gradient(-90deg,rgba(0,0,0,.7),transparent)'}}/></div>;
  }
  if(street)return <div style={{opacity:a}}><Silhouette x={v%2?1480:80} p={progress} dir={v%2?-1:1}/>{v%3===2&&<div style={{position:'absolute',left:0,right:0,top:120,height:12,background:'rgba(255,232,178,.18)',boxShadow:'0 0 50px rgba(255,220,150,.4)',transform:`translateX(${(progress-.5)*500}px)`}}/>}</div>;
  if(room){
    if(v%3===0)return <div style={{opacity:a}}><div style={{position:'absolute',left:-60,bottom:-30,width:720,height:210,borderRadius:'45% 45% 0 0',background:'#15120f',boxShadow:'0 -18px 50px #0008'}}/><Can x={210} y={830} rot={-10}/></div>;
    if(v%3===1)return <div style={{opacity:a}}><div style={{position:'absolute',right:150,top:140,width:310,height:570,borderRadius:45,background:'rgba(8,11,16,.28)',border:'2px solid rgba(230,240,255,.1)',boxShadow:'0 0 80px rgba(116,163,214,.18)'}}/><div style={{position:'absolute',right:180,top:180,width:250,height:500,background:'linear-gradient(180deg,rgba(100,160,220,.08),rgba(100,160,220,.01))'}}/></div>;
    return <div style={{opacity:a}}>{Array.from({length:7}).map((_,i)=><div key={i} style={{position:'absolute',left:160+i*270,top:120+(i%3)*220,width:22+(i%2)*16,height:22+(i%2)*16,borderRadius:'50%',background:'rgba(255,229,175,.24)',filter:'blur(8px)',transform:`translateY(${Math.sin(progress*6+i)*18}px)`}}/>)}</div>;
  }
  if(photo)return <div style={{opacity:a}}>{v%2===0?<><div style={{position:'absolute',left:70,top:80,width:340,height:430,border:'18px solid rgba(245,242,232,.88)',boxShadow:'0 25px 70px #0008',transform:'rotate(-5deg)',background:'rgba(255,255,255,.04)'}}/><div style={{position:'absolute',right:90,bottom:90,width:300,height:380,border:'16px solid rgba(245,242,232,.72)',boxShadow:'0 25px 70px #0008',transform:'rotate(6deg)',background:'rgba(255,255,255,.03)'}}/></>:<><div style={{position:'absolute',left:0,right:0,bottom:0,height:180,background:'linear-gradient(transparent,rgba(0,0,0,.55))'}}/><div style={{position:'absolute',left:140,bottom:110,width:520,height:10,background:'rgba(255,255,255,.25)',transform:`scaleX(${.35+.65*progress})`,transformOrigin:'left'}}/></>}</div>;
  return <div style={{opacity:a}}>{v%2===0?<div style={{position:'absolute',left:-100,top:-100,width:420,height:1280,background:'linear-gradient(90deg,rgba(0,0,0,.55),transparent)',transform:'rotate(-7deg)'}}/>:<div style={{position:'absolute',right:-120,top:80,width:520,height:920,background:'linear-gradient(-90deg,rgba(255,255,255,.045),transparent)',transform:`translateX(${40*(1-progress)}px) skewX(-8deg)`}}/>}</div>;
};

const V50=()=>{
  const f=useCurrentFrame(),{fps}=useVideoConfig(),a=activeAt(f/fps),beat=beats[a.index]??beats[0],n=a.index+1;
  const startsPhase=a.index===0||beats[a.index-1]?.phase!==beat.phase;
  const fade=startsPhase?interpolate(a.progress,[0,.035],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}):1;
  return <AbsoluteFill style={{background:'#020305'}}>
    <AbsoluteFill style={{opacity:fade}}><SceneVisual n={n} progress={a.phaseProgress}/></AbsoluteFill>
    <ShotAccent beat={beat} progress={a.progress}/>
    <Subtitle beat={beat} progress={a.progress}/>
  </AbsoluteFill>;
};

const Root=()=>{
  const d=Math.max(30,Math.ceil(Number(sync.durationSeconds||840)*30));
  return <Composition id='V50FriendsShots' component={V50} durationInFrames={d} fps={30} width={1920} height={1080}/>;
};
registerRoot(Root);
