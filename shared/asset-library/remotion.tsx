import React from 'react';
import {AbsoluteFill,Img,staticFile,interpolate} from 'remotion';

export type AssetChoice={
 id:string;file:string;score:number;sha256:string;matchedTags?:string[];
 layout:{x:number;y:number;w:number;h:number};motion?:string
};
export type AssetSelection={
 bgGroup:string;mode:'bespoke'|'suggested'|'parts-overlay';part:AssetChoice|null
};
const Sprite=({item,progress}:{item:AssetChoice;progress:number})=>{
 const p=Math.max(0,Math.min(1,progress));
 const visibility=interpolate(p,[0,.16,1],[0,1,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const shift=(1-visibility)*(item.motion==='enter-left'?-56:item.motion==='enter-right'?56:0);
 const rise=item.motion==='rise'?(1-visibility)*35:0;
 return <Img src={staticFile(item.file)} style={{
  position:'absolute',left:item.layout.x,top:item.layout.y,width:item.layout.w,height:item.layout.h,
  objectFit:'contain',pointerEvents:'none',opacity:visibility,
  transform:'translate('+shift+'px, '+rise+'px)'
 }}/>;
};
/** Overlay a storyboard-approved prop only; original background, character, animation,
 * subtitles, audio, and timing remain untouched. A suggestion is never rendered.
 */
export const PartOverlay=({selection,progress}:{selection:AssetSelection;progress:number})=>{
 if(selection.mode!=='parts-overlay')return null;
 if(!selection.part)throw Error('Approved part overlay is missing its matched asset');
 return <AbsoluteFill style={{pointerEvents:'none'}}>
  <Sprite item={selection.part} progress={progress}/>
 </AbsoluteFill>;
};
