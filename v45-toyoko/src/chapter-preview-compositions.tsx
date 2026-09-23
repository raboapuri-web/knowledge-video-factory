import React from 'react';
import {AbsoluteFill,Audio,Img,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import chapter from './chapter-selected-data.json';
import board from './toyoko_scene_plan.json';
import {PrologueShot,type ToyokoShot} from './prologue';
import {Caption} from './video-compositions';
import {HoodieGirlRig} from '../../shared/asset-library/人物テンプレート/hoodie-girl-rig';
import {HoodieBoyRig} from '../../shared/asset-library/人物テンプレート/hoodie-boy-rig';
import {OfficeWorkerRig} from '../../shared/asset-library/人物テンプレート/office-worker-rig';

type EditorialShot={
 id:string;fromFrame:number;durationFrames:number;visualRef:string;
 recommendation:string;originalShot:ToyokoShot|null;sourceText:string
};
type ChapterPreview={
 status:string;chapterId:string;durationFrames:number;audioFile:string;
 narrationBeats:{id:string;from:number;frames:number;caption:string}[];
 shots:EditorialShot[]
};
const film=chapter as unknown as ChapterPreview;
const boardRegistry=new Map(board.assetRegistry.backgrounds.map(x=>[x.id,x]));
const fileFor=(id:string)=>{
 const a=boardRegistry.get(id);
 const p=a?.assetFile??('shared/asset-library/'+a?.sourceOrBrief);
 const file=p?.match(/^shared\/asset-library\/背景\/([\w.-]+\.png)$/)?.[1];
 if(!file)throw Error('Missing approved chapter background '+id);
 return file;
};
const bg=(id:string)=>staticFile('assets/library/背景/'+fileFor(id));
const clamp=(v:number)=>Math.min(1,Math.max(0,v));
const lerp=(a:number,b:number,p:number)=>a+(b-a)*clamp(p);
const girl=(x:number,y:number,scale:number,action:'idle'|'walk'|'sit'='idle',mirror=false)=>
 <HoodieGirlRig x={x} y={y} scale={scale} action={action} mirror={mirror}
  showChair={false} hoodieColor='#7764ac' sleeveColor='#715da4'/>;
const boy=(x:number,y:number,scale:number)=>
 <HoodieBoyRig x={x} y={y} scale={scale} action='sit' actionStartFrame={-70}
   showChair={false} hoodieColor='#438b90'/>;
const adult=(x:number,y:number,scale:number)=>
 <OfficeWorkerRig x={x} y={y} scale={scale} action='idle'
   showBriefcase={false} suitColor='#718081' pantsColor='#414b55'/>;
const Background=({id,p=0,zoom=1.02}:{id:string;p?:number;zoom?:number})=>
 <Img src={bg(id)} style={{position:'absolute',inset:0,width:'100%',height:'100%',
  objectFit:'cover',transform:'scale('+lerp(zoom,zoom+.09,p)+')',
  filter:'brightness(.82) saturate(.78)'}}/>;
const SpecialCut=({name,frames}:{name:string;frames:number})=>{
 const frame=useCurrentFrame(),p=clamp(frame/Math.max(1,frames-1));
 const bgStyle={background:'#0a1322',overflow:'hidden'} as const;
 if(name==='CITY_ADULTS')return <AbsoluteFill style={bgStyle}>
   <Background id='BG_TOYOKO_GROUND' p={p} zoom={1.1}/>
   {boy(260,488,.7)}{girl(650,462,.73,'sit')}
   {adult(1380,335,.83)}
   <AbsoluteFill style={{background:'linear-gradient(90deg,transparent 33%,rgba(2,5,12,.3) 75%)'}}/>
  </AbsoluteFill>;
 if(name==='SHELTER_VS_TOWN')return <AbsoluteFill style={bgStyle}>
   <AbsoluteFill style={{clipPath:'polygon(0 0,50% 0,50% 100%,0 100%)'}}>
    <Background id='BG_SHELTER_ENTRANCE' p={p}/>
   </AbsoluteFill>
   <AbsoluteFill style={{clipPath:'polygon(50% 0,100% 0,100% 100%,50% 100%)'}}>
    <Background id='BG_TOYOKO_GROUND' p={1-p}/>
   </AbsoluteFill>
   <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(4,12,22,.07),rgba(4,12,22,.46) 50%,rgba(4,12,22,.1))'}}/>
   {girl(790,328,.95,'idle')}
  </AbsoluteFill>;
 if(name==='TWO_ADULTS')return <AbsoluteFill style={bgStyle}>
   <AbsoluteFill style={{clipPath:'polygon(0 0,50% 0,50% 100%,0 100%)'}}>
    <Background id='BG_SHELTER_COUNSEL' p={p}/>{adult(250,290,.82)}
   </AbsoluteFill>
   <AbsoluteFill style={{clipPath:'polygon(50% 0,100% 0,100% 100%,50% 100%)'}}>
    <Background id='BG_KABUKICHO_ALLEY' p={p}/>{adult(1290,300,.82)}
   </AbsoluteFill>
   <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(6,10,18,.23),transparent 43%,rgba(4,5,10,.25))'}}/>
   {girl(818,430,.66)}
  </AbsoluteFill>;
 if(name==='THREE_PLACES')return <AbsoluteFill style={{...bgStyle,background:'#101b2b'}}>
   {[
     ['BG_GIRL_HOME',190],
     ['BG_SHELTER_ENTRANCE',710],
     ['BG_TOYOKO_GROUND',1230]
   ].map(([id,x],i)=><div key={id} style={{position:'absolute',left:Number(x),top:215,
    width:480,height:620,border:'4px solid '+(i===1?'#e4c58f':'#859fae'),borderRadius:26,
    boxShadow:'0 10px 40px rgba(0,0,0,.38)',overflow:'hidden',
    opacity:clamp((p*3-i*.32)*1.65),transform:'translateY('+lerp(40,0,p)+'px)'}}>
     <Img src={bg(String(id))} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
     <div style={{position:'absolute',inset:0,background:'linear-gradient(0deg,rgba(4,9,17,.54),transparent 60%)'}}/>
    </div>)}
   {girl(846,445,.6)}
  </AbsoluteFill>;
 if(name==='NIGHT_QUESTION')return <AbsoluteFill style={bgStyle}>
    <Background id='BG_TOWN_NIGHT_WIDE' p={p} zoom={1.03}/>
    <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(3,7,15,.3),transparent 55%,rgba(3,7,15,.36))'}}/>
    {girl(730,388,.8,'idle')}
   </AbsoluteFill>;
 throw Error('No approved preview special cut: '+name);
};
const StandaloneFilm=()=>{
 if(film.status!=='chapter_preview_ready'||film.chapterId!=='prologue'||film.shots.length!==21||
    !film.audioFile||film.durationFrames<1)throw Error('Standalone chapter-preview manifest absent');
 let end=0;
 for(const s of film.shots){
   if(s.fromFrame!==end||s.durationFrames<1)throw Error('Source-to-scene frame gap at '+s.id);
   end+=s.durationFrames;
 }
 if(end>film.durationFrames||film.narrationBeats[0].from!==0)
  throw Error('Editorial cuts extend beyond original VOICEVOX chapter length');
 return <AbsoluteFill style={{background:'#0a101a'}}>
   {film.shots.map(s=><Sequence key={s.id} name={s.id+' '+s.recommendation.slice(0,35)}
      from={s.fromFrame} durationInFrames={s.durationFrames}>
      {s.originalShot?
        <PrologueShot shot={s.originalShot} file={fileFor(s.originalShot.background)}
          durationSeconds={s.durationFrames/30}/>:
        <SpecialCut name={s.visualRef} frames={s.durationFrames}/>}
    </Sequence>)}
    {/* Narration/subtitle timing never changes when a visual is revised. */}
    {film.narrationBeats.map(b=><Sequence key={b.id} from={b.from}
      durationInFrames={b.frames} name={'caption-'+b.id}>
       <Caption text={b.caption} durationFrames={b.frames}/>
     </Sequence>)}
    <Audio src={staticFile(film.audioFile)} volume={1}/>
   </AbsoluteFill>;
};
export {film as chapterPreviewData,StandaloneFilm};
