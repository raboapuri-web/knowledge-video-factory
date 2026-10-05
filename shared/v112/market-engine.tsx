import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Backdrop} from './backgrounds';
import {V46_ADULT_MAN_RIG} from './adult-man-rig';
import {OfficeWomanRig} from './office-woman-rig';
import {MarketSubject,K,q,ease} from './market-art';

export type Beat={id:string;phase:string;variant:number;narration:string;environment:string;family:string;action:string;primary:string;verb:string;mode:string;actionId:string;sceneKey:string;visual:string;shotKind:string;continuity:string};
const hash=(s:string)=>[...s].reduce((a,c)=>((a*31)^c.charCodeAt(0))>>>0,112);
const title:Record<string,string>={prologue:'プロローグ　あなたの給料は本当にあなたの値段か',future:'第1章　若者は未来を売っている',capitals:'第2章　会社の中と外で値段が違う',seniority:'第3章　年功序列という後払い',repro:'第4章　40代で問われる再現性',epilogue:'エピローグ　二つの値札'};

const CharacterLayer=({beat,p}:{beat:Beat;p:number})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps;
 const protagonist=/office-worker|manager-day|career-form|market-question|employee-badge|doors-open|badge-down|two-price-tags|subtract-list|outside-mirror|value-separation/.test(beat.primary)||(/彼/.test(beat.narration)&&beat.phase!=='future');
 const young=/young-worker|potential-interview|training-investment|future-value/.test(beat.primary);
 const interviewer=/candidate-a|candidate-b|midcareer-hire|young-hire/.test(beat.primary);
 const walk=beat.verb==='walk',point=beat.verb==='point',sit=beat.verb==='sit';
 const act=(walk?'walk':point?'point':sit?'idle':'idle') as any;
 const x=beat.shotKind==='split'?1180:1250+(hash(beat.id)%70), y=280;
 return <>{protagonist?<V46_ADULT_MAN_RIG x={x} y={y} scale={.82} action={act} talking={beat.verb==='speak'} suitColor="#46535e" pantsColor="#323b42" pose={sit?{bodyLean:8,headTilt:4}:{}}/>:null}{young?<V46_ADULT_MAN_RIG x={1180} y={300} scale={.78} action={act} talking={false} suitColor="#607c8b" pantsColor="#39454d" pose={{}}/>:null}{interviewer?<OfficeWomanRig x={beat.primary==='candidate-a'?450:1420} y={310} scale={.76} action="idle" talking={false} suitColor="#596a78" pantsColor="#424c55" mirror={beat.primary==='candidate-b'}/>:null}{beat.verb==='wait'?<div style={{position:'absolute',left:930,top:550,width:18,height:18,borderRadius:20,background:K.gold,boxShadow:'0 0 0 '+(20+30*Math.abs(Math.sin(t*2)))+'px rgba(200,161,93,.14)'}}/>:null}</>;
};

export const SceneVisual=({beat,progress}:{beat:Beat;progress:number})=>{
 const e=ease(progress),seed=hash(beat.action),scale=beat.shotKind==='detail'?1.12:beat.shotKind==='macro'?1.2:beat.shotKind==='establish'?.88:1;
 const sx=beat.shotKind==='split'?560:beat.shotKind==='profile'?650:680+(seed%120), sy=beat.shotKind==='overhead'?410:500+(seed%55);
 const add=beat.mode==='append';
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:'#09131b'}}>
   <Backdrop family={beat.family} environment={beat.environment}/>
   <div style={{position:'absolute',left:70,top:55,padding:'9px 18px',border:'1px solid rgba(255,255,255,.16)',borderRadius:18,background:'rgba(5,13,18,.72)',fontFamily:'Noto Sans JP,sans-serif',fontWeight:760,fontSize:24,color:'#d9d4c9'}}>{title[beat.phase]||''}</div>
   <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
     <g transform={'translate('+sx+' '+sy+') scale('+scale+')'}><MarketSubject kind={beat.primary} p={progress}/></g>
     {beat.verb==='transfer'||beat.verb==='shift'?<g><line x1="330" y1="770" x2={330+1180*e} y2="770" stroke={K.red} strokeWidth="15"/><circle cx={330+1180*e} cy="770" r="25" fill={K.red}/></g>:null}
     {beat.verb==='split'?<g><line x1="960" y1="180" x2="960" y2="850" stroke={K.paper} strokeWidth="8" opacity=".6"/><circle cx="720" cy="790" r={90+70*e} fill="none" stroke={K.blue} strokeWidth="12"/><circle cx="1200" cy="790" r={90+70*e} fill="none" stroke={K.red} strokeWidth="12"/></g>:null}
     {beat.verb==='rise'?<g>{[0,1,2,3].map(i=><rect key={i} x={1180+i*120} y={760-(i+1)*95*e} width="70" height={(i+1)*95*e} rx="10" fill={i===3?K.gold:K.teal}/>)}</g>:null}
     {beat.verb==='fall'?<path d={'M1120 330 C1250 390 1360 480 1510 '+(500+240*e)} fill="none" stroke={K.red} strokeWidth="18"/>:null}
     {beat.verb==='erase'?<g opacity={1-e}><rect x="1100" y="260" width="550" height="330" rx="25" fill={K.paper}/><rect x="1170" y="330" width="410" height="24" fill={K.gray}/><rect x="1170" y="390" width="350" height="24" fill={K.gray}/></g>:null}
     {beat.verb==='compare'?<g><rect x="1060" y="680" width={240+180*e} height="70" rx="16" fill={K.blue}/><rect x="1060" y="780" width={240+420*e} height="70" rx="16" fill={K.gold}/></g>:null}
     {beat.verb==='filter'?<g>{['会社','役職','勤続','人脈'].map((x,i)=><g key={x} opacity={q(1-e+i*.14)}><rect x={1110+i*120} y={690+i*35} width="105" height="105" rx="16" fill={K.gray}/><text x={1162+i*120} y={752+i*35} textAnchor="middle" fontFamily="Noto Sans JP" fontSize="24" fill={K.paper}>{x}</text></g>)}</g>:null}
     {add?<circle cx={1680} cy={820} r={45+55*e} fill={K.gold} opacity=".38"/>:<rect x={1640} y="780" width={80*e} height={80*e} rx="14" fill={K.red} opacity=".4"/>}
   </svg>
   <CharacterLayer beat={beat} p={progress}/>
 </div>;
};