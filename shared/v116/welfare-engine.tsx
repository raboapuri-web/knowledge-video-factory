import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Backdrop} from './backgrounds';
import {OfficeWorkerRig} from './office-worker-rig';
import {OfficeWomanRig} from './office-woman-rig';
import {WelfareSubject,K,ease,q} from './welfare-art';

export type Beat={id:string;phase:string;variant:number;narration:string;environment:string;family:string;action:string;primary:string;verb:string;mode:string;actionId:string;sceneKey:string;visual:string;shotKind:string;continuity:string};
const hash=(s:string)=>[...s].reduce((a,c)=>((a*31)^c.charCodeAt(0))>>>0,116);
const title:Record<string,string>={prologue:'プロローグ　消えた二万円はどこへ行ったか',mpc:'第1章　同じ一万円でも行き先は違う',depression:'第2章　全員で節約すると全員が貧しくなる',multiplier:'第3章　支援が中間層の給与になるまで',fiscal:'第4章　節約額以上のものを失うことがある',design:'第5章　福祉は多ければ多いほど良いのか',epilogue:'エピローグ　中間層も同じ床の上にいる'};
const motherSet=new Set(['mother','basket','support','bills','twohouseholds','cashtransfer']);
const womanSet=new Set(['middleworker','shift','restaurant','clothing','lifeshock']);
const manSet=new Set(['manager','student','depression','budget','middle-office']);
const CharacterLayer=({beat}:{beat:Beat})=>{
 const seed=hash(beat.id),act=(beat.verb==='walk'?'walk':beat.verb==='point'?'point':'idle') as any;
 return <>
  {motherSet.has(beat.primary)?<OfficeWomanRig x={1220+(seed%80)} y={300} scale={.78} action={act} talking={beat.verb==='speak'} suitColor="#866c58" pantsColor="#4d4d4a"/>:null}
  {womanSet.has(beat.primary)?<OfficeWomanRig x={1240+(seed%70)} y={300} scale={.78} action={act} talking={beat.verb==='speak'} suitColor="#5a7480" pantsColor="#424c55"/>:null}
  {manSet.has(beat.primary)?<OfficeWorkerRig x={1230+(seed%70)} y={285} scale={.80} action={act} talking={beat.verb==='speak'} suitColor="#46535e" pantsColor="#323b42"/>:null}
 </>;
};
const VerbLayer=({beat,p}:{beat:Beat;p:number})=>{const e=ease(p);return <svg width="1920" height="1080" style={{position:'absolute',inset:0}}>
 {beat.verb==='remove'?<g opacity={1-e}><rect x="1370" y="690" width="250" height="110" rx="18" fill={K.red}/><line x1="1360" y1="680" x2="1640" y2="820" stroke={K.paper} strokeWidth="14"/></g>:null}
 {beat.verb==='cut'?<g><rect x="1110" y="720" width="520" height="55" rx="14" fill={K.gray}/><rect x="1110" y="720" width={520*(1-e*.45)} height="55" rx="14" fill={K.red}/></g>:null}
 {beat.verb==='transfer'?<g><line x1="1040" y1="780" x2={1040+620*e} y2="780" stroke={K.gold} strokeWidth="14"/><circle cx={1040+620*e} cy="780" r="20" fill={K.gold}/></g>:null}
 {beat.verb==='spread'?<g>{[0,1,2,3].map(i=><circle key={i} cx={1200+i*140*e} cy={760-Math.sin(e*Math.PI+i)*70} r={24} fill={i%2?K.teal:K.gold}/>)}</g>:null}
 {beat.verb==='fall'?<path d={'M1100 360 C1250 430 1390 520 1600 '+(560+180*e)} fill="none" stroke={K.red} strokeWidth="18"/>:null}
 {beat.verb==='rise'?<path d={'M1090 760 C1260 700 1410 580 1640 '+(500-170*e)} fill="none" stroke={K.teal} strokeWidth="18"/>:null}
 {beat.verb==='split'?<g><line x1="960" y1="180" x2="960" y2="870" stroke={K.paper} strokeWidth="8" opacity=".5"/><circle cx="720" cy="790" r={75+55*e} fill="none" stroke={K.blue} strokeWidth="12"/><circle cx="1200" cy="790" r={75+55*(1-e)} fill="none" stroke={K.red} strokeWidth="12"/></g>:null}
 {beat.verb==='highlight'?<circle cx="1510" cy="760" r={55+80*e} fill="none" stroke={K.gold} strokeWidth="14" opacity={.8-e*.5}/>:null}
 {beat.verb==='connect'?<g>{[0,1,2,3].map(i=><line key={i} x1="1120" y1={650+i*70} x2="1700" y2={610+(3-i)*75} stroke={i%2?K.teal:K.gold} strokeWidth="8" opacity={.2+.7*e}/>)}</g>:null}
 {beat.verb==='save'?<g><rect x="1480" y="720" width="240" height="90" rx="18" fill={K.teal}/><text x="1600" y="778" textAnchor="middle" fontFamily="Noto Sans JP" fontSize="32" fontWeight="760" fill={K.paper}>維持</text></g>:null}
 </svg>};
export const SceneVisual=({beat,progress}:{beat:Beat;progress:number})=>{
 const seed=hash(beat.action),scale=beat.shotKind==='detail'?1.10:beat.shotKind==='macro'?1.18:beat.shotKind==='establish'?.9:1;
 const sx=beat.shotKind==='split'?560:630+(seed%150),sy=beat.shotKind==='overhead'?400:485+(seed%55);
 const camX=(seed%5-2)*7*Math.sin(progress*Math.PI),camY=((seed>>3)%5-2)*5*Math.sin(progress*Math.PI*.8);
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:'#0b1418'}}>
  <div style={{position:'absolute',inset:0,transform:`translate(${camX}px,${camY}px)`}}><Backdrop family={beat.family} environment={beat.environment} p={progress}/></div>
  <div style={{position:'absolute',left:70,top:55,padding:'9px 18px',border:'1px solid rgba(255,255,255,.16)',borderRadius:18,background:'rgba(5,13,18,.72)',fontFamily:'Noto Sans JP,sans-serif',fontWeight:760,fontSize:24,color:'#d9d4c9'}}>{title[beat.phase]||''}</div>
  <svg width="1920" height="1080" style={{position:'absolute',inset:0}}><g transform={'translate('+sx+' '+sy+') scale('+scale+')'}><WelfareSubject kind={beat.primary} p={progress} variant={beat.variant}/></g></svg>
  <VerbLayer beat={beat} p={progress}/><CharacterLayer beat={beat}/>
 </div>;
};