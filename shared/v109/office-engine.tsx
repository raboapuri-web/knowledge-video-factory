import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {Backdrop} from './backgrounds';
import {OfficeWorkerRig} from './office-worker-rig';
import {OfficeWomanRig} from './office-woman-rig';
import {OfficeSubject,categoryFor,K,TXT,ease} from './office-art';
import {R,L,Ring,q,lerp} from './primitives';

export type Beat={id:string;phase:string;variant:number;narration:string;environment:string;family:string;action:string;primary:string;verb:string;mode:string;actionId:string;sceneKey:string;visual:string;shotKind:string;continuity:string};

const verbGroups:Record<string,string>={
 character:'enter raise-hand interrupt point boast listen speak lean watch walk',
 work:'call flag delay repair deliver write revise correct inspect calculate restart diagnose handoff prevent extinguish',
 diagram:'compare overestimate annotate branch regress calibrate assert hedge observe promote reward hide scatter credit loop audit separate measure reveal question',
 temporal:'rewind wait persist repeat'
};
const inverse=new Map<string,string>();for(const [g,s] of Object.entries(verbGroups))for(const v of s.split(/\s+/))inverse.set(v,g);
const vf=(v:string)=>{const g=inverse.get(v);if(!g)throw Error('V109 unsupported physical verb '+v);return g};
const chapter=(p:string)=>p==='prologue'?'プロローグ':p==='metacognition'?'第1章　メタ認知':p==='counter'?'第2章　ダニング＝クルーガー再考':p==='status'?'第3章　自信は地位になる':p==='expertise'?'第4章　能力と能力らしさ':'エピローグ';
const hash=(s:string)=>[...s].reduce((a,c)=>((a*31)^c.charCodeAt(0))>>>0,109);

const CharacterLayer=({beat,p}:{beat:Beat;p:number})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps,e=ease(p);
 const showConf=/confident-worker|status-signal|fire-crisis|promotion/.test(beat.primary)||/僕が|絶対|自信満々|エース|断言|手柄|中心人物/.test(beat.narration);
 const showQuiet=/quiet-worker|prevented-failure|forecast-tree|server-log|contribution-wheel/.test(beat.primary)||/黙って|修正|確認|ベテラン|静か|データを確認/.test(beat.narration);
 const showManager=/manager|上司|課長/.test(beat.primary+' '+beat.narration);
 const act=beat.verb==='point'||beat.verb==='interrupt'||beat.verb==='raise-hand'?'point':beat.verb==='walk'||beat.verb==='enter'?'walk':'idle';
 return <>
  {showConf?<OfficeWorkerRig x={showQuiet?1040:1180+Math.sin(t*.7)*3} y={250} scale={.88} action={act} talking={['speak','boast','interrupt','assert'].includes(beat.verb)} suitColor="#7b4650" pantsColor="#433b45" pose={beat.verb==='lean'?{bodyLean:-10,rightShoulder:-55}:{}}/>:null}
  {showQuiet?<OfficeWorkerRig x={showConf?520:820} y={270} scale={.84} action={beat.verb==='walk'?'walk':'idle'} talking={false} suitColor="#3e5f78" pantsColor="#304657" mirror={showConf}/>:null}
  {showManager?<OfficeWomanRig x={820} y={245} scale={.86} action={beat.verb==='point'?'point':'idle'} talking={beat.verb==='speak'} suitColor="#55664f" pantsColor="#3f4b3c"/>:null}
  {beat.primary==='team'?<><OfficeWorkerRig x={280} y={330} scale={.68} action="idle" suitColor="#4f6375"/><OfficeWomanRig x={740} y={330} scale={.68} action="idle" suitColor="#63566e"/><OfficeWorkerRig x={1200} y={330} scale={.68} action="idle" suitColor="#665a47"/></>:null}
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
   {beat.verb==='raise-hand'?<Ring x={1425} y={305} p={p} r={90} c={K.gold}/>:null}
   {beat.verb==='interrupt'?<g><L x={1210} y={350} X={850} Y={300} c={K.red} sw={12} p={e}/><TXT x={970} y={260} t="先に答える" s={30} c={K.red}/></g>:null}
  </svg>
 </>;
};

const SemanticLayer=({beat,p}:{beat:Beat;p:number})=>{
 const g=categoryFor(beat.primary),e=ease(p),group=vf(beat.verb),seed=hash(beat.action);
 let x=beat.shotKind==='detail'?620:beat.shotKind==='split'?960:530+(seed%180),y=480+(seed%90)-45,sc=g==='charts'?1.05:g==='docs'?.82:.9;
 if(group==='diagram')x=960;
 if(group==='work'&&/report|proposal|contract|old-data|checklist/.test(beat.primary))x=570;
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
  <g transform={'translate('+x+' '+y+') scale('+sc+')'}><OfficeSubject kind={beat.primary} p={p}/></g>
  {group==='diagram'?<g>{[0,1,2].map(i=><Ring key={i} x={960} y={500} p={q((e-i*.14)*1.5)} r={220+i*85} c={i%2?K.teal:K.gold}/>)}</g>:null}
  {beat.verb==='rewind'?<g><path d="M520 700 Q300 520 520 340" fill="none" stroke={K.gold} strokeWidth="15"/><path d="M500 330 L545 330 512 290Z" fill={K.gold}/><TXT x={320} y={760} t="先月へ巻き戻す" s={34} c={K.gold}/></g>:null}
  {beat.verb==='delay'?<g><L x={250} y={760} X={1350} Y={760} c={K.paper} sw={8} p={e}/><circle cx={lerp(300,1230,e)} cy={760} r={25} fill={K.red}/><TXT x={1110} y={720} t="1日遅れ" s={30} c={K.red}/></g>:null}
  {beat.verb==='repair'?<g>{[0,1,2,3].map(i=><R key={i} x={1020+i*120} y={690-i*55} w={85} h={28} c={i<Math.floor(e*5)?K.teal:K.red}/>)}</g>:null}
  {beat.verb==='correct'?<g><L x={850} y={690} X={1350} Y={420} c={K.red} sw={10} p={e}/><TXT x={1370} y={410} t="修正" s={34} c={K.red} a="start"/></g>:null}
  {beat.verb==='separate'?<g><R x={210} y={360} w={420} h={240} rx={20} c="#536c73" o={.65}/><R x={1290} y={360} w={420} h={240} rx={20} c="#795e5b" o={.65}/><TXT x={420} y={500} t="能力" s={54}/><TXT x={1500} y={500} t="能力らしさ" s={46}/></g>:null}
 </svg>;
};

export const SceneVisual=({beat,progress}:{beat:Beat;progress:number})=>{
 vf(beat.verb);categoryFor(beat.primary);const p=q(progress);
 return <AbsoluteFill style={{background:'#0b141b',overflow:'hidden'}}>
  <Backdrop environment={beat.environment} family={beat.family}/>
  <SemanticLayer beat={beat} p={p}/>
  <CharacterLayer beat={beat} p={p}/>
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
   <R x={72} y={75} w={13} h={62} c={K.gold}/><TXT x={105} y={118} t={chapter(beat.phase)} s={28} a="start" o={.86}/>
   <R x={1450} y={75} w={390} h={48} rx={8} c="#101a21" o={.58}/><TXT x={1645} y={107} t={beat.action.replaceAll('-','・').slice(0,28)} s={18} o={.6}/>
  </svg>
 </AbsoluteFill>;
};