import React from 'react';
import {AbsoluteFill,Composition,interpolate,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json';
import sync from './sync-timing.json';
import {SceneVisual} from './scenes';
import assetPlan from './asset-plan.json';
import {PartOverlay, type AssetSelection} from '../../shared/asset-library/remotion';
import {OfficeWorkerRigPreview,type OfficeWorkerAction} from '../../shared/asset-library/人物テンプレート/office-worker-rig';
import {OfficeWorkerBackgroundScene} from '../../shared/asset-library/人物テンプレート/scene';
import {OfficeWomanRigPreview,type OfficeWomanAction} from '../../shared/asset-library/人物テンプレート/office-woman-rig';
import {OfficeWomanBackgroundScene} from '../../shared/asset-library/人物テンプレート/office-woman-scene';
import {HoodieGirlRigPreview,type HoodieGirlAction} from '../../shared/asset-library/人物テンプレート/hoodie-girl-rig';
import {HoodieGirlBackgroundScene} from '../../shared/asset-library/人物テンプレート/hoodie-girl-scene';
import {HoodieBoyRigPreview,type HoodieBoyAction} from '../../shared/asset-library/人物テンプレート/hoodie-boy-rig';
import {HoodieBoyBackgroundScene} from '../../shared/asset-library/人物テンプレート/hoodie-boy-scene';
import {PASSERBYPreview,type PasserbyAction} from '../../shared/asset-library/人物テンプレート/PASSERBY';
import {PASSERBYScene} from '../../shared/asset-library/人物テンプレート/passerby-scene';
import {RESEARCHER_MANPreview,type ResearcherAction} from '../../shared/asset-library/人物テンプレート/RESEARCHER_MAN';
import {ResearcherBackgroundScene} from '../../shared/asset-library/人物テンプレート/researcher-man-scene';

type Beat={id:string;visual:string;narration:string;phase:string;variant:number;shotKind:string;bgGroup:string;bgSeed:number};
type SyncBeat={index:number;start:number;end:number};
const beats=scriptData.beats as Beat[];
const font='Noto Sans JP, sans-serif';
const clamp=(v:number)=>Math.max(0,Math.min(1,v));

const splitSubtitle=(text:string)=>{
  const sentences=(text.match(/[^。！？]+[。！？]?/g)??[text]).map(v=>v.trim()).filter(Boolean);
  const out:string[]=[];
  for(const s of sentences){
    if(s.length<=27){out.push(s);continue;}
    const parts=s.split(/(?<=[、，])/).map(v=>v.trim()).filter(Boolean);
    let buf='';
    for(const part of parts){if((buf+part).length>27&&buf){out.push(buf);buf=part}else buf+=part;}
    if(buf)out.push(buf);
  }
  return out.length?out:[text];
};

const activeAt=(sec:number)=>{
  const arr=(sync.beats||[]) as SyncBeat[];
  if(!arr.length)return {index:0,progress:0};
  let i=arr.findIndex(b=>sec>=b.start&&sec<b.end);
  if(i<0)i=arr.length-1;
  const b=arr[i];
  return {index:i,progress:clamp((sec-b.start)/Math.max(.001,b.end-b.start))};
};

const Subtitle=({beat,progress}:{beat:Beat;progress:number})=>{
  const chunks=splitSubtitle(beat.narration);
  const weights=chunks.map(x=>Math.max(1,x.length));
  const total=weights.reduce((a,b)=>a+b,0);
  const target=progress*total;
  let acc=0,k=0;
  for(let i=0;i<chunks.length;i++){acc+=weights[i];if(target<acc){k=i;break;}}
  const opacity=interpolate(progress,[0,.025,.95,1],[0,1,1,.2],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return <div style={{position:'absolute',left:90,right:90,bottom:24,display:'flex',justifyContent:'center',opacity,pointerEvents:'none'}}>
    <div style={{maxWidth:1540,padding:'10px 25px 12px',borderRadius:14,background:'rgba(0,0,0,.66)',fontFamily:font,fontWeight:780,fontSize:30,lineHeight:1.4,textAlign:'center',color:'#f8f6ef',textShadow:'0 2px 12px rgba(0,0,0,.98)',boxShadow:'0 8px 30px rgba(0,0,0,.30)'}}>{chunks[k]??chunks[chunks.length-1]}</div>
  </div>;
};

const V69=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const a=activeAt(frame/fps);
  const beat=beats[a.index]??beats[0];
  
  return <AbsoluteFill style={{background:'#020306',fontFamily:font}}>
    <AbsoluteFill><SceneVisual n={a.index+1} progress={a.progress}/>
      {<PartOverlay selection={(assetPlan.scenes as Record<string,AssetSelection>)[beat.id]} progress={a.progress}/>}</AbsoluteFill>
    <Subtitle beat={beat} progress={a.progress}/>
  </AbsoluteFill>;
};

const ScenePreview=()=>{const frame=useCurrentFrame();const n=Math.min(beats.length,Math.floor(frame/20)+1);const p=(frame%20)/20;const sel=(assetPlan.scenes as Record<string,AssetSelection>)[beats[n-1].id];return <AbsoluteFill style={{background:'#03070c'}}><SceneVisual n={n} progress={p}/>{<PartOverlay selection={sel} progress={p}/>}</AbsoluteFill>;};

/** Standalone example: a confirmed library background + an articulated character. */
const OfficeWorkerOfficePreview=()=>{
  const frame=useCurrentFrame();
  const action:OfficeWorkerAction=frame<60?'idle':frame<120?'walk':frame<180?'wave':'point';
  return <OfficeWorkerBackgroundScene backgroundFile='BG_office.png'
    worker={{x:780,y:180,scale:1,action,talking:action==='point'}}/>;
};

/** Enlarged idle shot for verifying the chin / neck / collar connection. */
const OfficeWorkerNeckCloseup=()=>(
  <OfficeWorkerBackgroundScene backgroundFile='BG_office.png'
    worker={{x:625,y:380,scale:1.9,action:'idle'}}/>
);

/** An independently previewable 8-second scene; does not change the episode. */
const HoodieGirlRoomPreview=()=>{
  const f=useCurrentFrame();
  const action:HoodieGirlAction=
    f<60?'idle':f<120?'walk':f<180?'wave':f<240?'point':
    f<300?'sit':f<360?'sitPhone':f<420?'standUp':'walkPhone';
  const actionStartFrame=action==='sit'?240:action==='standUp'?360:0;
  return <HoodieGirlBackgroundScene backgroundFile='BG_oneroom.png'
    girl={{x:1100,y:500,scale:.84,action,actionStartFrame,
      talking:action==='point'||action==='sitPhone'}}/>;
};

/** Zoomed visual QA of jaw, neck, hood collar and head-tilt join. */
const HoodieGirlNeckCloseup=()=>(
  <HoodieGirlBackgroundScene backgroundFile='BG_oneroom.png'
    girl={{x:635,y:420,scale:2,action:'idle',pose:{headTilt:3}}}/>
);

/** Larger phone-holding pose to inspect the palm, screen and forearm attachment. */
const HoodieGirlPhoneCloseup=()=>(
  <HoodieGirlBackgroundScene backgroundFile='BG_oneroom.png'
    girl={{x:610,y:290,scale:2.25,action:'sitPhone'}}/>
);

/** Independent boy preview: identical action timing to the hoodie girl. */
const HoodieBoyRoomPreview=()=>{
  const frame=useCurrentFrame();
  const action:HoodieBoyAction=
    frame<60?'idle':frame<120?'walk':frame<180?'wave':frame<240?'point':
    frame<300?'sit':frame<360?'sitPhone':frame<420?'standUp':'walkPhone';
  const actionStartFrame=action==='sit'?240:action==='standUp'?360:0;
  return <HoodieBoyBackgroundScene backgroundFile='BG_oneroom.png'
    boy={{x:1100,y:500,scale:.84,action,actionStartFrame,
      talking:action==='point'||action==='sitPhone'}}/>;
};

/** Enlarged face and the phone grip for quality review. */
const HoodieBoyFaceCloseup=()=>(
  <HoodieBoyBackgroundScene backgroundFile='BG_oneroom.png'
    boy={{x:635,y:420,scale:2,action:'idle',pose:{headTilt:3}}}/>
);
const HoodieBoyPhoneCloseup=()=>(
  <HoodieBoyBackgroundScene backgroundFile='BG_oneroom.png'
    boy={{x:690,y:110,scale:1.7,action:'sitPhone'}}/>
);

/** Independent female office-worker demo; existing episode and male rig untouched. */
const OfficeWomanOfficePreview=()=>{
  const f=useCurrentFrame();
  const action:OfficeWomanAction=f<60?'idle':f<120?'walk':f<180?'wave':'point';
  return <OfficeWomanBackgroundScene backgroundFile='BG_office.png'
    woman={{x:780,y:180,scale:1,action,talking:action==='point'}}/>;
};
const OfficeWomanFaceCloseup=()=>(
  <OfficeWomanBackgroundScene backgroundFile='BG_office.png'
    woman={{x:690,y:230,scale:2,action:'idle',pose:{headTilt:3}}}/>
);

/** Five adult anonymous walkers. Photo is taken ONLY by the center person. */
const PASSERBYTownPreview=()=>{
  const frame=useCurrentFrame();
  const action:PasserbyAction=frame<90?'idle':frame<180?'walk':'photoFlash';
  return <PASSERBYScene backgroundFile='BG_town.png'
    crowd={{action,photoStartFrame:180}}/>;
};
/** Laboratory character demo: four selectable actions, 2 seconds each. */
const RESEARCHER_MANLabPreview=()=>{
  const frame=useCurrentFrame();
  const action:ResearcherAction=frame<60?'idle':frame<120?'walk':frame<180?'inspectFlask':'point';
  return <ResearcherBackgroundScene backgroundFile='BG_kenkyu.png'
    researcher={{x:795,y:190,scale:1,action,talking:action==='point'}}/>;
};
const RESEARCHER_MANFaceCloseup=()=>(
  <ResearcherBackgroundScene backgroundFile='BG_kenkyu.png'
    researcher={{x:620,y:240,scale:1.85,action:'inspectFlask',pose:{headTilt:4}}}/>
);

const Root=()=>{
  const duration=Math.max(30,Math.ceil(Number(sync.durationSeconds||1700)*30));
  return <><Composition id='V69FreeServices' component={V69} durationInFrames={duration} fps={30} width={1920} height={1080}/><Composition id='V69ScenePreview' component={ScenePreview} durationInFrames={beats.length*20} fps={30} width={1920} height={1080}/><Composition id='OfficeWorkerRigPreview' component={OfficeWorkerRigPreview} durationInFrames={240} fps={30} width={1920} height={1080}/><Composition id='OfficeWorkerOfficePreview' component={OfficeWorkerOfficePreview} durationInFrames={240} fps={30} width={1920} height={1080}/><Composition id='OfficeWorkerNeckCloseup' component={OfficeWorkerNeckCloseup} durationInFrames={60} fps={30} width={1920} height={1080}/><Composition id='OfficeWomanRigPreview' component={OfficeWomanRigPreview} durationInFrames={240} fps={30} width={1920} height={1080}/><Composition id='OfficeWomanOfficePreview' component={OfficeWomanOfficePreview} durationInFrames={240} fps={30} width={1920} height={1080}/><Composition id='OfficeWomanFaceCloseup' component={OfficeWomanFaceCloseup} durationInFrames={60} fps={30} width={1920} height={1080}/><Composition id='PASSERBYPreview' component={PASSERBYPreview} durationInFrames={270} fps={30} width={1920} height={1080}/><Composition id='PASSERBYTownPreview' component={PASSERBYTownPreview} durationInFrames={270} fps={30} width={1920} height={1080}/><Composition id='RESEARCHER_MANPreview' component={RESEARCHER_MANPreview} durationInFrames={240} fps={30} width={1920} height={1080}/><Composition id='RESEARCHER_MANLabPreview' component={RESEARCHER_MANLabPreview} durationInFrames={240} fps={30} width={1920} height={1080}/><Composition id='RESEARCHER_MANFaceCloseup' component={RESEARCHER_MANFaceCloseup} durationInFrames={60} fps={30} width={1920} height={1080}/><Composition id='HoodieGirlRigPreview' component={HoodieGirlRigPreview} durationInFrames={480} fps={30} width={1920} height={1080}/><Composition id='HoodieGirlRoomPreview' component={HoodieGirlRoomPreview} durationInFrames={480} fps={30} width={1920} height={1080}/><Composition id='HoodieGirlNeckCloseup' component={HoodieGirlNeckCloseup} durationInFrames={60} fps={30} width={1920} height={1080}/><Composition id='HoodieGirlPhoneCloseup' component={HoodieGirlPhoneCloseup} durationInFrames={60} fps={30} width={1920} height={1080}/><Composition id='HoodieBoyRigPreview' component={HoodieBoyRigPreview} durationInFrames={480} fps={30} width={1920} height={1080}/><Composition id='HoodieBoyRoomPreview' component={HoodieBoyRoomPreview} durationInFrames={480} fps={30} width={1920} height={1080}/><Composition id='HoodieBoyFaceCloseup' component={HoodieBoyFaceCloseup} durationInFrames={60} fps={30} width={1920} height={1080}/><Composition id='HoodieBoyPhoneCloseup' component={HoodieBoyPhoneCloseup} durationInFrames={60} fps={30} width={1920} height={1080}/></>;
};
registerRoot(Root);
