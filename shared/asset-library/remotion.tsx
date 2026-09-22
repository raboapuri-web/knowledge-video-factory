import React from 'react';
import {AbsoluteFill,Img,staticFile,interpolate} from 'remotion';
export type AssetChoice={id:string;file:string;score:number;sha256:string;
 layout:{x:number;y:number;w:number;h:number};motion?:string};
export type AssetSelection={bgGroup:string;mode:'library'|'bespoke';
 background:AssetChoice|null;part:AssetChoice|null;person:AssetChoice|null};
const position=(a:AssetChoice):React.CSSProperties=>({
 position:'absolute',left:a.layout.x,top:a.layout.y,width:a.layout.w,height:a.layout.h,
 objectFit:'contain',pointerEvents:'none'
});
const Sprite=({item,progress}:{item:AssetChoice;progress:number})=>{
 const p=Math.max(0,Math.min(1,progress));
 const fade=interpolate(p,[0,.16,1],[0,1,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const shift=(1-fade)*(item.motion==='enter-left'?-56:item.motion==='enter-right'?56:0);
 const rise=item.motion==='rise'?(1-fade)*35:0;
 return <Img src={staticFile(item.file)} style={{...position(item),opacity:fade,
  transform:'translate('+shift+'px, '+rise+'px)'}}/>;
};
/** Scene background is held frame-static. Foreground alone may animate. */
export const AssetLayers=({selection,progress,slot}:{selection:AssetSelection;progress:number;slot:'background'|'foreground'})=>{
 if(slot==='background')return selection.background?<AbsoluteFill style={{background:'#17232f'}}>
  <Img src={staticFile(selection.background.file)} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
 </AbsoluteFill>:null;
 return <AbsoluteFill style={{pointerEvents:'none'}}>
  {selection.person&&<Sprite item={selection.person} progress={progress}/>}
  {selection.part&&<Sprite item={selection.part} progress={progress}/>}
 </AbsoluteFill>;
};
/** Only use when the storyboard explicitly chooses assetComposition='library'.
 * Keep subtitles, VOICEVOX timing, BGM and scene IDs in the existing video root.
 */
export const AssetScene=({selection,progress}:{selection:AssetSelection;progress:number})=>{
 if(selection.mode!=='library'||!selection.background||!selection.part||!selection.person)
  throw Error('AssetScene requires an explicitly approved complete semantic composition');
 return <AbsoluteFill><AssetLayers selection={selection} progress={progress} slot="background"/>
  <AssetLayers selection={selection} progress={progress} slot="foreground"/></AbsoluteFill>;
};
