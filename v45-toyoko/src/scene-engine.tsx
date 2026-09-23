import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {MovingActors,ShotProps,clamp,lerp,smooth,type Shot} from './full-motion';
import {ConceptVisual,Rain} from './concept-visuals';

const resolve=(file:string)=>staticFile('assets/library/背景/'+file);
const motionOf=(camera:string,p:number,i:number)=>{
 const wide=/wide|crane|street|high|map|group|grid/.test(camera);
 const close=/closeup|insert|hands|reaction|focus|zoom/.test(camera);
 const track=/tracking|follow|dolly|pan|rear|side/.test(camera);
 const zoom=wide?lerp(1.025,1.090,smooth(p)):close?lerp(1.10,1.18,smooth(p)):lerp(1.055,1.112,smooth(p));
 const direction=i%2?-1:1;
 const x=track?lerp(-36,33,smooth(p))*direction:Math.sin(p*Math.PI)*5*direction;
 const y=/crane|tilt/.test(camera)?lerp(-45,24,smooth(p)):/hands|insert/.test(camera)?lerp(-5,-24,p):0;
 return 'translate('+x+'px,'+y+'px) scale('+zoom+')';
};

const Metro=({p}:{p:number})=><svg viewBox='0 0 1920 1080'
 style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none'}}>
 <g opacity={smooth((p-.11)/.3)*.55} stroke='#d6e3dc' fill='none' strokeWidth={5}>
  <path d='M-10 850 C350 750 480 700 725 710 S1360 840 1920 690'/>
  <path d='M-10 890 C350 790 480 740 725 750 S1360 880 1920 730'/>
 </g>
 </svg>;
const Notice=({p}:{p:number})=><svg style={{position:'absolute',left:1375,top:295,width:150,height:215,
 filter:'drop-shadow(0 4px 10px #23303b)',opacity:smooth((p-.13)/.3)}}
 viewBox='0 0 150 215'>
 <rect x={5} y={5} width={140} height={200} rx={5} fill='#dce4dd' stroke='#647a7f' strokeWidth={5}/>
 <circle cx={74} cy={48} r={20} fill='#687e80'/>
 <path d='M38 102 H110 M38 128 H108 M38 154 H90' stroke='#8b9c9a' strokeWidth={6}/>
 </svg>;
const StreetDoorMatch=({shot,p}:{shot:Shot;p:number})=>{
 if(shot.camera!=='match_cut_door'&&shot.camera!=='matched_doorway'&&!shot.visual.includes('マッチカット'))return null;
 return <svg viewBox='0 0 1920 1080' style={{position:'absolute',inset:0,width:'100%',height:'100%'}}>
 <rect x={1598} y={138} width={13} height={790} fill='#e0daca' opacity={smooth((p-.1)/.6)*.45}/>
 </svg>;
};

/** Every non-prologue cut draws its exact registered background plus all named
 * characters, required prop classes and a scene-appropriate deterministic motion layer.
 * Source shot order is immutable; no generic replacement of unmatched background IDs. */
export const StoryboardShot=({shot,backgroundFile,durationSeconds}:{
 shot:Shot;backgroundFile:string;durationSeconds:number
})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const frames=Math.max(1,Math.round(durationSeconds*fps));
 const p=clamp(frame/Math.max(1,frames-1));
 const sceneNumber=Number(shot.shotId.replace(/\D/g,'').slice(0,3))||1;
 const rain=shot.background==='BG_VANCOUVER_RAIN'||shot.weatherEffect?.type==='rain';
 const daylight=/DAY|CLASSROOM|DINING|YOUTH_CENTER/.test(shot.background)&&
  !shot.visual.includes('夜');
 const needsNotice=shot.visual.includes('規則表示')||shot.visual.includes('施設の案内');
 const needsMetro=shot.background==='BG_LIBRARY_SUBWAY'||shot.camera==='map_to_street';
 const filter=rain?'brightness(.70) saturate(.62) contrast(1.13)':
    daylight?'brightness(.94) saturate(.89)':'brightness(.89) saturate(.77) contrast(1.05)';
 const hardCut=shot.camera.includes('two_stage_cut')||shot.visual.includes('切り返し');
 const alternating=hardCut&&p>.55;
 const scale=alternating?1.16:1;
 return <AbsoluteFill style={{background:'#101722',overflow:'hidden'}}>
  <Img src={resolve(backgroundFile)} style={{position:'absolute',inset:0,
   width:'100%',height:'100%',objectFit:'cover',filter,
   transform:motionOf(shot.camera,p,sceneNumber)+' scale('+scale+')'}}/>
  <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(5,12,22,.17),transparent 30%,transparent 60%,rgba(2,5,12,.29))',
   pointerEvents:'none'}}/>
  {needsMetro&&<Metro p={p}/>}
  {rain&&<Rain p={p} seed={sceneNumber}/>}
  {needsNotice&&<Notice p={p}/>}
  <StreetDoorMatch shot={shot} p={p}/>
  {/* Animated human layers are independent of static background plate and camera. */}
  <MovingActors shot={shot} p={p} seconds={durationSeconds}/>
  <ConceptVisual shot={shot} p={p}/>
  <ShotProps shot={shot} p={p}/>
  {hardCut&&<AbsoluteFill style={{border:'0 solid rgba(0,0,0,0)',
    boxShadow:p>.55?'inset 0 0 80px rgba(0,0,0,.29)':'none',
    pointerEvents:'none'}}/>}
 </AbsoluteFill>;
};
