import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Backdrop} from './backgrounds';import {V46_ADULT_MAN_RIG} from './adult-man-rig';import {OfficeWomanRig} from './office-woman-rig';import {WorkSubject,K,q,ease} from './work-art';
export type Beat={id:string;phase:string;variant:number;narration:string;environment:string;family:string;action:string;primary:string;verb:string;mode:string;actionId:string;sceneKey:string;visual:string;shotKind:string;continuity:string};
const hash=(s:string)=>[...s].reduce((a,c)=>((a*31)^c.charCodeAt(0))>>>0,113);
const chapter:Record<string,string>={prologue:'プロローグ　仕事ができる人への「ご褒美」',invisible:'第1章　会社には見えない仕事がある',ratchet:'第2章　成功すると基準が上がる',concentration:'第3章　忙しい人に仕事が集まる',incentives:'第4章　能力を見せると損をする制度',epilogue:'エピローグ　真面目さを消耗品にしない'};
const CharacterLayer=({beat}:{beat:Beat})=>{
 const protagonist=/sato|clock-1745|extra-project|trust-three|month-stack|reward-work|calendar-three|desk-overflow|possible-load|record-|new-minimum|early-finish|capacity-hide|busy-one|choose-a|star-worker|eight-hours|private-resource|hidden-overload|stop-helping|family-message|expectation-growth|load-not-promotion|empty-desk|who-does-it|final-question/.test(beat.primary)||(/佐藤/.test(beat.narration)&&!beat.primary.includes('loop'));
 const boss=/上司/.test(beat.narration)&&!protagonist;
 const act=(beat.verb==='walk'?'walk':beat.verb==='point'?'point':'idle') as any;
 return <>{protagonist?<V46_ADULT_MAN_RIG x={beat.shotKind==='split'?1220:1260} y={280} scale={.82} action={act} talking={beat.verb==='speak'} suitColor="#46535e" pantsColor="#333c43" pose={beat.verb==='sit'?{bodyLean:8,headTilt:4}:beat.verb==='slump'?{bodyLean:14,headTilt:10}:{}}/>:null}{boss?<OfficeWomanRig x={520} y={300} scale={.78} action="idle" talking={beat.verb==='speak'} suitColor="#596a78" pantsColor="#424c55" mirror={false}/>:null}</>;
};
export const SceneVisual=({beat,progress}:{beat:Beat;progress:number})=>{
 const e=ease(progress),seed=hash(beat.action),scale=beat.shotKind==='detail'?1.12:beat.shotKind==='macro'?1.2:beat.shotKind==='establish'?.88:1;
 const sx=beat.shotKind==='split'?570:beat.shotKind==='profile'?650:680+(seed%110),sy=beat.shotKind==='overhead'?420:500+(seed%50);
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:'#08131b'}}>
  <Backdrop family={beat.family} environment={beat.environment}/>
  <div style={{position:'absolute',left:70,top:55,padding:'9px 18px',border:'1px solid rgba(255,255,255,.15)',borderRadius:18,background:'rgba(5,13,18,.72)',fontFamily:'Noto Sans JP,sans-serif',fontWeight:760,fontSize:24,color:'#d9d4c9'}}>{chapter[beat.phase]||''}</div>
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
   <g transform={'translate('+sx+' '+sy+') scale('+scale+')'}><WorkSubject kind={beat.primary} p={progress}/></g>
   {beat.verb==='stack'?<g>{Array.from({length:7},(_,i)=><rect key={i} x={1120+i*18} y={760-i*64} width="330" height="54" rx="12" fill={i>4?K.red:i%2?K.paper:K.gray} opacity={q(e*1.6-i*.11)}/>)}</g>:null}
   {beat.verb==='route'?<g>{[-2,-1,0,1,2].map((i,j)=><line key={i} x1={1150+i*130} y1="720" x2="1500" y2="470" stroke={K.red} strokeWidth="10" opacity={q(e*1.5-j*.12)}/>)}</g>:null}
   {beat.verb==='ratchet'?<path d={'M1080 760 L1220 650 L1360 '+(580-80*e)+' L1510 '+(470-120*e)+' L1650 '+(350-150*e)} fill="none" stroke={K.red} strokeWidth="16"/>:null}
   {beat.verb==='add'?<g>{[0,1,2,3].map(i=><circle key={i} cx={1180+i*130} cy={760-i*65} r={24+18*e} fill={i===3?K.red:K.gold} opacity={q(e*1.5-i*.16)}/>)}</g>:null}
   {beat.verb==='subtract'?<g opacity={1-e}>{[0,1,2,3].map(i=><rect key={i} x={1120+i*120} y="700" width="90" height="90" rx="12" fill={K.gray}/>)}</g>:null}
   {beat.verb==='hide'?<rect x="1050" y={610-300*e} width="650" height={300*e} fill="#08131b" opacity=".88"/>:null}
   {beat.verb==='balance'?<g><line x1="1100" y1="690" x2="1650" y2={690-140*e} stroke={K.gold} strokeWidth="16"/><circle cx="1375" cy="590" r="32" fill={K.paper}/></g>:null}
   {beat.verb==='overflow'?<g>{Array.from({length:8},(_,i)=><rect key={i} x={1080+(i%4)*150} y={680-Math.floor(i/4)*110} width="125" height="80" rx="12" fill={i>5?K.red:K.blue} opacity={q(e*1.8-i*.1)}/>)}</g>:null}
   {beat.verb==='freeze'?<g><rect x="1080" y="250" width="600" height="500" fill="#17303c" opacity={.15+.5*e}/><text x="1380" y="520" textAnchor="middle" fontFamily="Noto Sans JP" fontWeight="800" fontSize="58" fill={K.paper} opacity={e}>これ以上、見せない</text></g>:null}
  </svg>
  <CharacterLayer beat={beat}/>
 </div>;
};