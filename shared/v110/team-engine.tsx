import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {Backdrop} from './backgrounds';
import {OfficeWorkerRig} from './office-worker-rig';
import {OfficeWomanRig} from './office-woman-rig';
import {TeamSubject,categoryFor,K,TXT,ease} from './team-art';
import {R,L,Ring,q,lerp} from './primitives';

export type Beat={id:string;phase:string;variant:number;narration:string;environment:string;family:string;action:string;primary:string;verb:string;mode:string;actionId:string;sceneKey:string;visual:string;shotKind:string;continuity:string};

const verbGroups:Record<string,string>={
 character:'enter handover grab type correct point listen wait speak walk open close lean',
 work:'call rewrite reorder approve reply submit check block release rotate document share notify',
 diagram:'compare own expand delegate loop spawn route centralize distribute cross-train branch bound exchange grow shrink audit reveal question',
 temporal:'repeat sick return'
};
const inverse=new Map<string,string>();for(const [g,s] of Object.entries(verbGroups))for(const v of s.split(/\s+/))inverse.set(v,g);
const vf=(v:string)=>{const g=inverse.get(v);if(!g)throw Error('V110 unsupported physical verb '+v);return g};
const chapter=(p:string)=>p==='prologue'?'プロローグ　善意の抱え込み':p==='ownership'?'第1章　責任から所有へ':p==='delegation'?'第2章　任せないほど育たない':p==='bottleneck'?'第3章　優秀なボトルネック':p==='failure'?'第4章　失敗する権利':'エピローグ　自分がいなくても回る';
const hash=(s:string)=>[...s].reduce((a,c)=>((a*31)^c.charCodeAt(0))>>>0,110);

const Characters=({beat,p}:{beat:Beat;p:number})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps,e=ease(p);
 const sasaki=/sasaki|control-web|central-node|bottleneck-gate|single-point-failure|quality-shield/.test(beat.primary)||/佐々木|自分が|俺が|責任者/.test(beat.narration);
 const tanaka=/tanaka|mouse-grab|answer-drop|presentation/.test(beat.primary)||/田中|部下|若手|新人/.test(beat.narration);
 const client=/client|client-call/.test(beat.primary)||/顧客/.test(beat.narration);
 const act=(beat.verb==='point'||beat.verb==='grab')?'point':beat.verb==='walk'||beat.verb==='enter'?'walk':'idle';
 return <>
 {sasaki?<OfficeWorkerRig x={tanaka?1110:1220+Math.sin(t*.7)*3} y={250} scale={.87} action={act} talking={['speak','call','reply'].includes(beat.verb)} suitColor="#324f68" pantsColor="#263b4d" pose={beat.verb==='lean'?{bodyLean:-9,rightShoulder:-45}:{}}/>:null}
 {tanaka?<OfficeWorkerRig x={sasaki?520:820} y={275} scale={.82} action={beat.verb==='walk'?'walk':'idle'} talking={beat.verb==='speak'} suitColor="#66727b" pantsColor="#4e5960" mirror={sasaki}/>:null}
 {client?<OfficeWomanRig x={beat.shotKind==='split'?1520:840} y={270} scale={.82} action="idle" talking={beat.verb==='speak'} suitColor="#66566c" pantsColor="#504454"/>:null}
 {beat.primary==='team'?<><OfficeWorkerRig x={270} y={330} scale={.66} action="idle" suitColor="#4e6376"/><OfficeWomanRig x={690} y={330} scale={.66} action="idle" suitColor="#655870"/><OfficeWorkerRig x={1110} y={330} scale={.66} action="idle" suitColor="#665a47"/><OfficeWomanRig x={1510} y={330} scale={.66} action="idle" suitColor="#4f6b61"/></>:null}
 <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
 {beat.verb==='handover'?<g><R x={760} y={510} w={330} h={210} rx={12} c="#d8cfbb"/><L x={740} y={610} X={1110} Y={610} c={K.gold} sw={12} p={e}/></g>:null}
 {beat.verb==='grab'?<g><Ring x={930} y={590} p={p} r={95} c={K.red}/><TXT x={930} y={735} t="マウスを取る" s={28} c={K.red}/></g>:null}
 {beat.verb==='wait'?<g><TXT x={960} y={260} t="口を挟まない" s={34} c={K.gold}/><L x={760} y={300} X={1160} Y={300} c={K.gold} sw={7} p={e}/></g>:null}
 </svg>
 </>;
};

const Semantic=({beat,p}:{beat:Beat;p:number})=>{
 const g=categoryFor(beat.primary),e=ease(p),group=vf(beat.verb),seed=hash(beat.action);
 let x=beat.shotKind==='split'?960:beat.shotKind==='detail'?620:560+(seed%160),y=480+(seed%90)-45,sc=g==='charts'?1.05:g==='docs'?.82:.9;
 if(group==='diagram')x=960;
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
 <g transform={'translate('+x+' '+y+') scale('+sc+')'}><TeamSubject kind={beat.primary} p={p}/></g>
 {group==='diagram'?<g>{[0,1,2].map(i=><Ring key={i} x={960} y={500} p={q((e-i*.13)*1.45)} r={220+i*82} c={i%2?K.teal:K.gold}/>)}</g>:null}
 {beat.verb==='rewrite'?<g>{[0,1,2,3].map(i=><R key={i} x={1040} y={380+i*70} w={lerp(40,420-(i*35),e)} h={17} c={i%2?K.red:K.gold}/>)}</g>:null}
 {beat.verb==='reorder'?<g>{[0,1,2].map(i=><R key={i} x={1120+i*100*e} y={370+i*100} w={250} h={54} rx={8} c={i%2?K.teal:K.blue}/>)}</g>:null}
 {beat.verb==='spawn'?<g>{[0,1,2,3].map(i=><g key={i} opacity={q(e-i*.16)}><R x={1150+i*70} y={350+i*90} w={300} h={68} rx={14} c={i%2?'#425b66':'#674f56'}/><TXT x={1300+i*70} y={393+i*90} t="確認お願いします" s={18}/></g>)}</g>:null}
 {beat.verb==='centralize'?<g>{[-2,-1,0,1,2].map(i=><L key={i} x={350+i*240} y={250} X={960} Y={680} c={K.red} sw={8} p={e}/>)}</g>:null}
 {beat.verb==='distribute'?<g>{[-2,-1,0,1,2].map(i=><L key={i} x={960} y={520} X={350+i*240} Y={760} c={K.teal} sw={8} p={e}/>)}</g>:null}
 {beat.verb==='bound'?<g><R x={180} y={700} w={450} h={80} rx={15} c={K.green} o={.8}/><R x={735} y={700} w={450} h={80} rx={15} c={K.gold} o={.8}/><R x={1290} y={700} w={450} h={80} rx={15} c={K.red} o={.8}/></g>:null}
 {beat.verb==='exchange'?<g><TXT x={960} y={790} t="今日の効率 ↔ 未来の組織能力" s={40} c={K.gold}/></g>:null}
 {beat.verb==='shrink'?<g><Ring x={960} y={500} p={1-p} r={260} c={K.red}/><Ring x={960} y={500} p={p} r={150} c={K.teal}/></g>:null}
 </svg>;
};

export const SceneVisual=({beat,progress}:{beat:Beat;progress:number})=>{
 vf(beat.verb);categoryFor(beat.primary);const p=q(progress);
 return <AbsoluteFill style={{background:'#0a141b',overflow:'hidden'}}>
 <Backdrop environment={beat.environment} family={beat.family}/>
 <Semantic beat={beat} p={p}/>
 <Characters beat={beat} p={p}/>
 <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
 <R x={72} y={75} w={13} h={62} c={K.gold}/><TXT x={105} y={118} t={chapter(beat.phase)} s={28} a="start" o={.86}/>
 <R x={1450} y={75} w={390} h={48} rx={8} c="#101a21" o={.58}/><TXT x={1645} y={107} t={beat.action.replaceAll('-','・').slice(0,28)} s={18} o={.58}/>
 </svg>
 </AbsoluteFill>;
};