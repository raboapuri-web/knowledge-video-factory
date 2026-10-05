import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {Backdrop} from './backgrounds';
import {V46_ADULT_MAN_RIG} from './adult-man-rig';
import {OfficeWomanRig} from './office-woman-rig';
import {PASSERBY} from './passerby';
import {WelfareSubject,categoryFor,K,TXT,ease} from './welfare-art';
import {R,L,Ring,q,lerp} from './primitives';

export type Beat={id:string;phase:string;variant:number;narration:string;environment:string;family:string;action:string;primary:string;verb:string;mode:string;actionId:string;sceneKey:string;visual:string;shotKind:string;continuity:string};

const verbGroups:Record<string,string>={
 character:'sit hold walk look point speak sleep open close',
 work:'apply interview call pay cut charge evict erase pack rescue treat transfer respond spend save tax',
 diagram:'compare reduce cascade vanish connect shift branch split ripple buffer loop narrow stabilize insure reveal question sink rise',
 temporal:'wait repeat return'
};
const inverse=new Map<string,string>();for(const [g,s] of Object.entries(verbGroups))for(const v of s.split(/\s+/))inverse.set(v,g);
const vf=(v:string)=>{const g=inverse.get(v);if(!g)throw Error('V111 unsupported physical verb '+v);return g};
const chapter=(p:string)=>p==='prologue'?'プロローグ　もし生活保護が消えたら':p==='floor'?'第1章　社会の底にある床':p==='cost'?'第2章　消えないコスト':p==='crime'?'第3章　貧困と犯罪':p==='protected'?'第4章　本当は誰を守るのか':'エピローグ　船は下から沈む';
const hash=(s:string)=>[...s].reduce((a,c)=>((a*31)^c.charCodeAt(0))>>>0,111);

const Characters=({beat,p}:{beat:Beat;p:number})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps,e=ease(p);
 const man=/unemployed-man|eviction|job-search|interview|address-loss|station-sleep|collapse|welfare-application/.test(beat.primary)||/男|彼は|彼を|失業した/.test(beat.narration);
 const woman=/taxpayer-woman|company-failure|illness|divorce|home-sale/.test(beat.primary)||/会社員の女性|彼女/.test(beat.narration);
 const crowd=/crowd|社会|我々全員|全員/.test(beat.primary+' '+beat.narration);
 const manAction=beat.verb==='walk'?'walk':beat.verb==='point'?'point':beat.verb==='sit'||beat.verb==='sleep'?'idle':'idle';
 return <>
  {man?<V46_ADULT_MAN_RIG x={beat.shotKind==='split'?1060:1120+Math.sin(t*.7)*2} y={270} scale={.82} action={manAction as any} talking={beat.verb==='speak'} suitColor="#4f5963" pantsColor="#41484d" pose={beat.verb==='sleep'?{bodyLean:16,headTilt:12,rightShoulder:14,leftShoulder:-12}:beat.verb==='hold'?{rightShoulder:-40,rightElbow:85}:{}}/>:null}
  {woman?<OfficeWomanRig x={beat.shotKind==='split'?430:790} y={260} scale={.84} action={beat.verb==='walk'?'walk':'idle'} talking={beat.verb==='speak'} suitColor="#556679" pantsColor="#414d5a" mirror={man}/>:null}
  {crowd?<PASSERBY action={beat.verb==='walk'?'walk':'idle'} x={-70} y={110} scale={.78}/>:null}
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
   {beat.verb==='sleep'?<g><TXT x={1280} y={720} t="眠れる場所" s={30} c={K.gold}/><L x={1180} y={690} X={1430} Y={690} c={K.gold} sw={7} p={e}/></g>:null}
   {beat.verb==='hold'?<Ring x={1320} y={500} p={p} r={100} c={K.gold}/>:null}
  </svg>
 </>;
};

const Semantic=({beat,p}:{beat:Beat;p:number})=>{
 const g=categoryFor(beat.primary),group=vf(beat.verb),e=ease(p),seed=hash(beat.action);
 let x=beat.shotKind==='split'?960:beat.shotKind==='detail'?600:540+(seed%170),y=485+(seed%80)-40,sc=g==='charts'?1.05:g==='docs'?0.82:0.9;
 if(group==='diagram')x=960;
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
  <g transform={'translate('+x+' '+y+') scale('+sc+')'}><WelfareSubject kind={beat.primary} p={p}/></g>

  {group==='diagram'?<g>{[0,1,2].map(i=><Ring key={i} x={960} y={505} p={q((e-i*.13)*1.45)} r={220+i*82} c={i%2?K.teal:K.gold}/>)}</g>:null}
  {beat.verb==='cascade'?<g>{[0,1,2,3,4].map(i=><g key={i} opacity={q((e-i*.13)*1.7)}><L x={360+i*240} y={330+i*65} X={480+i*240} Y={440+i*65} c={K.red} sw={10} p={e}/><circle cx={520+i*240} cy={465+i*65} r={25} fill={K.red}/></g>)}</g>:null}
  {beat.verb==='vanish'?<g opacity={1-e}>{[0,1,2,3].map(i=><R key={i} x={300+i*340} y={700-(i%2)*90} w={250} h={70} rx={12} c={i%2?K.gold:K.teal}/>)}</g>:null}
  {beat.verb==='shift'||beat.verb==='transfer'?<g><L x={360} y={720} X={1500} Y={720} c={K.red} sw={13} p={e}/><TXT x={930} y={680} t="費用の移動" s={34} c={K.gold}/></g>:null}
  {beat.verb==='ripple'?<g>{[0,1,2,3].map(i=><Ring key={i} x={960} y={520} p={q((e-i*.14)*1.45)} r={120+i*110} c={i%2?K.red:K.gold}/>)}</g>:null}
  {beat.verb==='buffer'?<g><L x={320} y={770} X={1550} Y={770} c={K.paper} sw={8} p={1}/><R x={700} y={700} w={520*e} h={90} rx={16} c={K.teal}/><TXT x={960} y={758} t="ショックを吸収" s={30}/></g>:null}
  {beat.verb==='narrow'?<g>{[-2,-1,0,1,2].map((i,j)=><L key={i} x={420} y={520} X={lerp(1250,900,j/5)} Y={370+i*70} c={j<Math.floor(e*6)?K.red:'#56646a'} sw={7} p={e}/>)}</g>:null}
  {beat.verb==='sink'?<g><rect x="0" y={lerp(980,600,e)} width="1920" height={480} fill="#315b70" opacity=".55"/><TXT x={960} y={570} t="下から沈む" s={42} c={K.gold}/></g>:null}
  {beat.verb==='rise'?<g><L x={350} y={760} X={1500} Y={300} c={K.teal} sw={13} p={e}/><TXT x={1330} y={280} t="再び社会へ" s={32} c={K.gold}/></g>:null}

  {beat.verb==='erase'?<g><L x={430} y={350} X={1450} Y={720} c={K.red} sw={18} p={e}/><L x={1450} y={350} X={430} Y={720} c={K.red} sw={18} p={e}/></g>:null}
  {beat.verb==='cut'?<g><L x={500} y={700} X={1420} Y={700} c={K.paper} sw={12} p={1}/><L x={950} y={625} X={950} Y={775} c={K.red} sw={24} p={e}/></g>:null}
  {beat.verb==='evict'?<g><R x={1280} y={350} w={260} h={360} rx={20} c="#4c3d38"/><L x={1190} y={520} X={1270} Y={520} c={K.red} sw={14} p={e}/><TXT x={1410} y={550} t="退去" s={36}/></g>:null}
  {beat.verb==='rescue'?<g><circle cx={1380} cy={470} r={90} fill={K.red}/><TXT x={1380} y={485} t="救急" s={30}/><L x={1180} y={640} X={1360} Y={550} c={K.gold} sw={10} p={e}/></g>:null}
  {beat.verb==='treat'?<g><path d="M1320 370 V650 M1180 510 H1460" stroke={K.red} strokeWidth="36"/><TXT x={1320} y={720} t="医療" s={30}/></g>:null}
  {beat.verb==='pay'||beat.verb==='spend'||beat.verb==='tax'?<g><TXT x={1260} y={700} t={beat.verb==='tax'?'税・保険料':beat.verb==='pay'?'支払い':'支出'} s={32} c={K.gold}/><R x={1120} y={730} w={lerp(40,420,e)} h={35} rx={8} c={K.red}/></g>:null}
  {beat.verb==='save'?<g><R x={1160} y={680} w={380} h={55} rx={10} c={K.teal}/><R x={1160} y={680} w={380*(1-e)} h={55} rx={10} c={K.red}/><TXT x={1350} y={650} t="貯金" s={28}/></g>:null}
  {beat.verb==='apply'?<g><TXT x={1270} y={690} t="申請" s={32} c={K.gold}/><L x={1110} y={715} X={1450} Y={715} c={K.gold} sw={9} p={e}/></g>:null}
  {beat.verb==='interview'?<g><R x={1120} y={340} w={390} h={220} rx={20} c="#43545c"/><TXT x={1315} y={465} t="面接" s={42}/></g>:null}
 </svg>;
};

export const SceneVisual=({beat,progress}:{beat:Beat;progress:number})=>{
 vf(beat.verb);categoryFor(beat.primary);const p=q(progress);
 return <AbsoluteFill style={{background:'#09131a',overflow:'hidden'}}>
  <Backdrop environment={beat.environment} family={beat.family}/>
  <Semantic beat={beat} p={p}/>
  <Characters beat={beat} p={p}/>
  <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,pointerEvents:'none'}}>
   <R x={72} y={75} w={13} h={62} c={K.gold}/><TXT x={105} y={118} t={chapter(beat.phase)} s={28} a="start" o={.86}/>
   <R x={1430} y={75} w={410} h={48} rx={8} c="#101a21" o={.58}/><TXT x={1635} y={107} t={beat.action.replaceAll('-','・').slice(0,30)} s={18} o={.58}/>
  </svg>
 </AbsoluteFill>;
};