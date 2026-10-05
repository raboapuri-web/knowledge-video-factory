import React from 'react';
import {useCurrentFrame,useVideoConfig} from 'remotion';
import {Backdrop} from './backgrounds';
import {V46_ADULT_MAN_RIG} from './adult-man-rig';
import {OfficeWorkerRig} from './office-worker-rig';
import {OfficeWomanRig} from './office-woman-rig';
import {CareerSubject,K,q,ease} from './career-art';

export type Beat={id:string;phase:string;variant:number;narration:string;environment:string;family:string;action:string;primary:string;verb:string;mode:string;actionId:string;sceneKey:string;visual:string;shotKind:string;continuity:string};
const hash=(s:string)=>[...s].reduce((a,c)=>((a*31)^c.charCodeAt(0))>>>0,113);
const title:Record<string,string>={
 prologue:'プロローグ　社内では必要なのに、外では値段がつかない',
 internal:'第1章　日本企業は社内で人を育ててきた',
 dialect:'第2章　能力は会社専用の方言になる',
 signaling:'第3章　市場は外から確認できる能力に値段をつける',
 obsolescence:'第4章　怖いのは市場の方が変わること',
 epilogue:'エピローグ　転職できる状態を失わない'
};
const protagonistPrimaries=new Set(['protagonist','restructure-notice','career-form','internal-knowledge','portable-question','tenure-growth','approval-route','company-dialect','skill-weights','current-mix','target-mix','skill-cards','bundle-break','achievement-proof','market-price','market-check','new-system','skill-obsolescence','two-curves','market-shift','resume-translate','portable-core','outside-option','stay-vs-stuck','career-healthcheck','freedom-exit']);
const youngPrimaries=new Set(['showa-newhire','job-rotation','internal-promotion','general-capital','firm-specific','rookie-question','retraining']);
const agentPrimaries=new Set(['agent-call','observable-proof','external-contact']);
const actionFor=(verb:string)=>verb==='walk'?'walk':verb==='point'||verb==='route'||verb==='highlight'?'point':'idle';

const CharacterLayer=({beat,p}:{beat:Beat;p:number})=>{
 const f=useCurrentFrame(),{fps}=useVideoConfig(),t=f/fps,seed=hash(beat.id);
 const protagonist=protagonistPrimaries.has(beat.primary)||(/男性|彼/.test(beat.narration)&&beat.phase!=='internal');
 const young=youngPrimaries.has(beat.primary),agent=agentPrimaries.has(beat.primary);
 const act=actionFor(beat.verb) as any;
 const x=beat.shotKind==='split'?1170:1220+(seed%100),y=285+(seed%25);
 return <>
  {protagonist?<V46_ADULT_MAN_RIG x={x} y={y} scale={.80} action={act} talking={beat.verb==='speak'} suitColor="#46535e" pantsColor="#323b42" pose={beat.verb==='sit'?{bodyLean:8,headTilt:3}:beat.verb==='look'?{headTilt:6}:{}}/>:null}
  {young?<OfficeWorkerRig x={beat.phase==='internal'?1180:1260} y={300} scale={.76} action={act} talking={beat.verb==='speak'} suitColor={beat.primary==='showa-newhire'?'#6d6c64':'#607c8b'} pantsColor="#39454d" showBriefcase={beat.verb==='walk'}/>:null}
  {agent?<OfficeWomanRig x={beat.shotKind==='split'?420:390} y={305} scale={.77} action={beat.verb==='point'?'point':'idle'} talking={beat.verb==='speak'} suitColor="#596a78" pantsColor="#424c55" mirror={false}/>:null}
  {beat.verb==='wait'?<div style={{position:'absolute',left:930,top:550,width:18,height:18,borderRadius:20,background:K.gold,boxShadow:'0 0 0 '+(20+30*Math.abs(Math.sin(t*2)))+'px rgba(200,161,93,.14)'}}/>:null}
 </>;
};

const VerbLayer=({beat,p}:{beat:Beat;p:number})=>{
 const e=ease(p),seed=hash(beat.action),x=1120+(seed%160);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}>
  {(beat.verb==='transfer'||beat.verb==='shift'||beat.verb==='swap')?<g><line x1="330" y1="790" x2={330+1180*e} y2="790" stroke={K.red} strokeWidth="15"/><circle cx={330+1180*e} cy="790" r="25" fill={K.red}/></g>:null}
  {beat.verb==='split'?<g><line x1="960" y1="160" x2="960" y2="870" stroke={K.paper} strokeWidth="8" opacity=".55"/><circle cx="720" cy="790" r={80+75*e} fill="none" stroke={K.blue} strokeWidth="12"/><circle cx="1200" cy="790" r={80+75*e} fill="none" stroke={K.red} strokeWidth="12"/></g>:null}
  {beat.verb==='rise'?<g>{[0,1,2,3].map(i=><rect key={i} x={1120+i*130} y={790-(i+1)*98*e} width="76" height={(i+1)*98*e} rx="10" fill={i===3?K.gold:K.teal}/>)}</g>:null}
  {beat.verb==='fall'?<path d={'M1080 310 C1240 390 1380 480 1540 '+(520+220*e)} fill="none" stroke={K.red} strokeWidth="18"/>:null}
  {beat.verb==='erase'||beat.verb==='detach'?<g opacity={1-e}><rect x={x} y="250" width="500" height="330" rx="25" fill={K.paper}/><rect x={x+70} y="330" width="360" height="22" fill={K.gray}/><rect x={x+70} y="390" width="290" height="22" fill={K.gray}/></g>:null}
  {beat.verb==='compare'||beat.verb==='measure'?<g><rect x="1070" y="680" width={220+180*e} height="68" rx="15" fill={K.blue}/><rect x="1070" y="785" width={220+430*e} height="68" rx="15" fill={K.gold}/></g>:null}
  {beat.verb==='filter'?<g>{['会社','役職','勤続','人脈'].map((s,i)=><g key={s} opacity={q(1-e+i*.14)}><rect x={1100+i*120} y={690+i*32} width="105" height="105" rx="16" fill={K.gray}/><text x={1152+i*120} y={752+i*32} textAnchor="middle" fontFamily="Noto Sans JP" fontSize="23" fill={K.paper}>{s}</text></g>)}</g>:null}
  {beat.verb==='route'?<path d={'M1070 810 C1190 '+(760-120*e)+' 1280 '+(680+70*e)+' 1400 600 S1580 '+(450-90*e)+' 1710 350'} fill="none" stroke={K.gold} strokeWidth="15" strokeLinecap="round"/>:null}
  {beat.verb==='translate'?<g><rect x="1090" y="690" width="260" height="110" rx="18" fill={K.gray}/><rect x="1430" y="690" width="320" height="110" rx="18" fill={K.teal}/><line x1="1355" y1="745" x2={1420} y2="745" stroke={K.gold} strokeWidth="13"/><circle cx={1355+65*e} cy="745" r="14" fill={K.gold}/></g>:null}
  {beat.verb==='connect'?<g>{[0,1,2,3].map(i=><line key={i} x1="1030" y1={650+i*75} x2={1700} y2={600+(3-i)*80} stroke={i%2?K.teal:K.gold} strokeWidth="8" opacity={.25+.7*e}/>)}</g>:null}
  {beat.verb==='save'?<g><rect x="1510" y="720" width="230" height="90" rx="18" fill={K.teal}/><text x="1625" y="778" textAnchor="middle" fontFamily="Noto Sans JP" fontSize="32" fontWeight="760" fill={K.paper}>保存</text></g>:null}
  {beat.verb==='close'?<g opacity={1-e}><rect x="1480" y="650" width="280" height="180" rx="20" fill={K.paper}/></g>:null}
  {beat.mode==='append'?<circle cx={1710} cy={845} r={38+55*e} fill={K.gold} opacity=".32"/>:<rect x={1660} y="805" width={70*e} height={70*e} rx="14" fill={K.red} opacity=".34"/>}
 </svg>;
};

export const SceneVisual=({beat,progress}:{beat:Beat;progress:number})=>{
 const seed=hash(beat.action),scale=beat.shotKind==='detail'?1.10:beat.shotKind==='macro'?1.18:beat.shotKind==='establish'?.9:1;
 const sx=beat.shotKind==='split'?560:beat.shotKind==='profile'?625:650+(seed%140),sy=beat.shotKind==='overhead'?395:485+(seed%65);
 const camX=(seed%5-2)*6*Math.sin(progress*Math.PI),camY=((seed>>3)%5-2)*4*Math.sin(progress*Math.PI*.8);
 return <div style={{position:'absolute',inset:0,overflow:'hidden',background:'#09131b'}}>
  <div style={{position:'absolute',inset:0,transform:`translate(${camX}px,${camY}px)`}}><Backdrop family={beat.family} environment={beat.environment} p={progress}/></div>
  <div style={{position:'absolute',left:70,top:55,padding:'9px 18px',border:'1px solid rgba(255,255,255,.16)',borderRadius:18,background:'rgba(5,13,18,.72)',fontFamily:'Noto Sans JP,sans-serif',fontWeight:760,fontSize:24,color:'#d9d4c9'}}>{title[beat.phase]||''}</div>
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0}}><g transform={'translate('+sx+' '+sy+') scale('+scale+')'}><CareerSubject kind={beat.primary} p={progress} variant={beat.variant}/></g></svg>
  <VerbLayer beat={beat} p={progress}/>
  <CharacterLayer beat={beat} p={progress}/>
 </div>;
};