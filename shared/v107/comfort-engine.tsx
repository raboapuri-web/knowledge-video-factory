import React from 'react';
import {R,L,P,Ring,Person,House,q,lerp} from './primitives';
import {Backdrop} from './backgrounds';
import {ComfortSubject,categoryFor,K,TXT,ease} from './comfort-art';

export type Beat={id:string;phase:string;variant:number;narration:string;environment:string;family:string;action:string;primary:string;verb:string;mode:string;actionId:string;sceneKey:string;bgGroup:string;visual:string;shotKind:string};
export const verbGroups:Record<string,string>={
 kinetic:'approach carry rise route advance climb walk slow step detour raise push switch chase continue recline',
 temporal:'delay postpone loop pulse fade remain pause replay sequence accumulate',
 transform:'cool discard invert transform compress remove ignite unfold unroll unpack complete shrink relieve reinforce grow increase lower refresh darken adapt shift center ground satisfy open close undo preserve reveal',
 relational:'surround compare contrast converge connect separate sever align balance weigh stabilize collaborate speak commit protect choose qualify clarify transfer bypass',
 cognitive:'swipe scroll observe persist highlight draw illuminate expand inflate rehearse work cook stand',
 structural:'stack build route flow rotate increase complete advance',
 exertion:'overload climb increase persist work carry stand'
};
const inverse=new Map<string,string>();
for(const [fam,words] of Object.entries(verbGroups))for(const v of words.split(/\s+/))if(!inverse.has(v))inverse.set(v,fam);
export const allVerbs=new Set([...inverse.keys()]);
const verbFamily=(verb:string)=>{const f=inverse.get(verb);if(!f)throw Error('V107 unsupported physical verb '+verb);return f};
const hash=(s:string)=>[...s].reduce((a,c)=>((a*31)^c.charCodeAt(0))>>>0,557);
const chapter=(p:string)=>p==='prologue'?'プロローグ':p==='civilization'?'第1章　文明と摩擦':p==='avoidance'?'第2章　回避学習':p==='philosophy'?'第3章　快適さを疑った哲学':p==='friction'?'第4章　意味のある摩擦':'エピローグ';
const Arrow=({x,y,X,Y,p=1,c=K.gold}:{x:number;y:number;X:number;Y:number;p?:number;c?:string})=><g><L x={x} y={y} X={X} Y={Y} c={c} sw={11} p={p}/>{p>.25&&<P d={'M'+(X-28)+' '+(Y-22)+' L'+X+' '+Y+' L'+(X-28)+' '+(Y+22)} c="none" stroke={c} sw={8}/>}</g>;

const MoveSubject=({b,p}:{b:Beat;p:number})=>{
 const e=ease(p),seed=hash(b.action),vf=verbFamily(b.verb),cat=categoryFor(b.primary);
 let x=1080+(seed%320)-160,y=500+((seed>>5)%120)-60,dx=0,dy=0,rot=0,scale=cat==='human'?.82:cat==='document'?.83:cat==='data'?.9:.88;
 if(vf==='kinetic'){dx=lerp((seed%2?-220:220),0,e);dy=b.verb==='rise'?lerp(130,-35,e):b.verb==='climb'?lerp(120,-70,e):lerp(40,0,e)}
 if(vf==='temporal'){rot=Math.sin(e*Math.PI*2)*3;scale*=lerp(.95,1.03,e)}
 if(vf==='transform'){scale*=lerp(.72,1.03,e);rot=lerp(-8,3,e)}
 if(vf==='relational'){dx=lerp(seed%2?-65:65,0,e)}
 if(vf==='cognitive'){scale*=lerp(.84,1,e)}
 if(vf==='structural'){dy=lerp(70,0,e);scale*=lerp(.76,1,e)}
 if(vf==='exertion'){dy=18*Math.sin(e*Math.PI*4);rot=3*Math.sin(e*Math.PI*4)}
 return <g transform={'translate('+(x+dx)+' '+(y+dy)+') rotate('+rot+') scale('+scale+')'} data-object={b.primary}><ComfortSubject kind={b.primary} p={p}/></g>;
};

const FX=({b,p}:{b:Beat;p:number})=>{
 const e=ease(p),vf=verbFamily(b.verb),seed=hash(b.action),accent=b.phase==='avoidance'?K.red:b.phase==='philosophy'?K.gold:b.phase==='friction'?K.teal:K.blue;
 return <g data-motion-family={vf} data-action={b.actionId}>
 {vf==='kinetic'&&<g><path d={'M180 '+(760-seed%80)+' Q700 '+(610-seed%70)+' 970 '+(730-seed%50)+' T1740 '+(690+seed%60)} fill="none" stroke={accent} strokeWidth={8} strokeDasharray="25 17" opacity=".48"/><circle cx={lerp(240,1660,e)} cy={700-45*Math.sin(e*Math.PI)} r={15} fill={accent}/></g>}
 {vf==='temporal'&&<g>{[0,1,2,3].map(i=><circle key={i} cx={330+i*210} cy={770} r={18} fill={i%2?K.gold:accent} opacity={q((e-i*.16)*2.5)}/>) }<L x={260} y={825} X={1120} Y={825} c={K.paper} sw={7} p={e}/></g>}
 {vf==='transform'&&<g>{[0,1,2].map(i=><Ring key={i} x={680} y={480} p={q((e-i*.12)*1.5)} r={120+i*85} c={i%2?accent:K.gold}/>)}<Arrow x={250} y={770} X={760} Y={770} p={e} c={accent}/></g>}
 {vf==='relational'&&<g><R x={150} y={290} w={310} h={370} rx={20} c="#536c78" o={.58}/><R x={520} y={290} w={310} h={370} rx={20} c="#746360" o={.58}/><Arrow x={420} y={725} X={610} Y={725} p={e} c={accent}/>{['separate','sever','contrast'].includes(b.verb)&&<L x={485} y={260} X={485} Y={750} c={K.red} sw={12} p={e}/>}</g>}
 {vf==='cognitive'&&<g><Ring x={520} y={450} p={e} r={200} c={accent}/>{[0,1,2].map(i=><R key={i} x={225+i*180} y={720-i*30} w={145} h={38} c={i%2?K.gold:K.teal} o={q((e-i*.14)*3)}/>)}</g>}
 {vf==='structural'&&<g>{[0,1,2,3].map(i=><R key={i} x={200+i*135} y={700-(i+1)*85*e} w={110} h={(i+1)*85*e} c={i%2?accent:K.gold}/>)}</g>}
 {vf==='exertion'&&<g><L x={190} y={780} X={810} Y={780} c={accent} sw={17} p={e}/><TXT x={500} y={735} t="負荷" s={34} c={K.paper}/>{[0,1,2].map(i=><circle key={i} cx={270+i*190} cy={520-45*Math.sin(e*Math.PI*2+i)} r={28+i*5} fill={i%2?K.red:K.gold} opacity=".65"/>)}</g>}
 </g>;
};

const NarrativeDetail=({b,p}:{b:Beat;p:number})=>{
 const e=ease(p),a=b.action;
 switch(a){
 case'auto-door-opens-before-touch':return <g><R x={600} y={190} w={350*(1-e)} h={590} c="#78909a" o={.45}/><R x={960+350*e} y={190} w={350*(1-e)} h={590} c="#78909a" o={.45}/></g>;
 case'delivery-route-forms-from-taps':return <g><path d="M260 740 Q510 390 860 520 T1510 300" fill="none" stroke={K.gold} strokeWidth={10} strokeDasharray="1600" strokeDashoffset={1600*(1-e)}/><circle cx={1510} cy={300} r={30} fill={K.red}/></g>;
 case'modern-comfort-network-surrounds-man':return <g>{[[320,300],[690,210],[410,650],[760,680]].map((pt,i)=><g key={i}><circle cx={pt[0]} cy={pt[1]} r={70} fill={i%2?K.gold:K.teal}/><L x={pt[0]} y={pt[1]} X={970} Y={500} c={K.paper} sw={6} p={e}/></g>)}</g>;
 case'past-house-and-modern-room-divide':return <g><L x={960} y={100} X={960} Y={860} c={K.gold} sw={10}/><House x={280} y={500} s={1}/><R x={1180} y={330} w={450} h={310} c="#8da0a3"/><TXT x={480} y={250} t="昔" s={48}/><TXT x={1410} y={250} t="現在" s={48}/></g>;
 case'furniture-box-explodes-into-parts':return <g>{[0,1,2,3,4].map(i=><R key={i} x={220+i*125+90*e*(i-2)} y={570+(i%2)*80-180*e} w={100} h={30+i*10} c={i%2?K.gold:K.wood}/>)}</g>;
 case'crooked-shelf-stands-as-man-smiles':return <g><g transform={'translate(510 500) rotate('+lerp(-8,2,e)+') scale(.52)'}><ComfortSubject kind="shelf" p={p}/></g><Person x={330} y={520} s={.63} pose="stand" role="modern" p={p}/></g>;
 case'cablecar-and-hiker-reach-same-summit':return <g><P d="M160 760 L580 250 L930 760Z" c="#5d717a"/><L x={185} y={680} X={560} Y={265} c={K.paper} sw={7}/><R x={lerp(250,530,e)} y={lerp(610,300,e)} w={110} h={65} c={K.red}/><Person x={lerp(850,620,e)} y={lerp(680,300,e)} s={.45} pose="walk" role="modern" p={p}/></g>;
 case'coworker-accepts-and-anxiety-drops':return <g><R x={240} y={300} w={410} h={180} rx={30} c={K.teal}/><TXT x={445} y={405} t="代わるよ" s={44} c={K.ink}/><Arrow x={420} y={570} X={420} Y={740} p={e} c={K.blue}/></g>;
 case'relief-reward-feeds-next-avoidance':return <g><circle cx={480} cy={470} r={210} fill="none" stroke={K.red} strokeWidth={16} strokeDasharray="40 20"/><Arrow x={620} y={610} X={365} Y={650} p={e} c={K.red}/><TXT x={480} y={485} t="回避→安心" s={42}/></g>;
 case'adversity-curve-draws-nonlinear-shape':return <g><L x={190} y={730} X={820} Y={730} c={K.paper} sw={8}/><L x={190} y={730} X={190} Y={260} c={K.paper} sw={8}/><path d="M220 380 Q470 720 790 330" fill="none" stroke={K.gold} strokeWidth={13} strokeDasharray="1000" strokeDashoffset={1000*(1-e)}/></g>;
 case'seneca-letter-unrolls-poverty-practice':return <g><g transform="translate(490 500) scale(.62)"><ComfortSubject kind="scroll" p={p}/></g><TXT x={500} y={650} t="「恐れていたのは、これか」" s={31}/></g>;
 case'lottery-winner-control-groups-align':return <g>{[0,1].map(i=><g key={i}><Person x={330+i*330} y={510} s={.58} role={i?'worker':'modern'} p={p}/><R x={240+i*330} y={690} w={180} h={35+(i?80:82)*e} c={i?K.teal:K.gold}/></g>)}</g>;
 case'comfort-baseline-rises-floor-by-floor':return <g>{[0,1,2,3].map(i=><R key={i} x={170+i*160} y={720-i*90} w={140} h={90+i*90} c={i%2?K.gold:K.teal} o={.75}/>) }<L x={170} y={720-270*e} X={800} Y={720-270*e} c={K.red} sw={10}/></g>;
 case'barbell-load-increases-in-safe-steps':return <g>{[0,1,2,3].map(i=><g key={i}><R x={190+i*155} y={690-(i+1)*80} w={110} h={(i+1)*80} c={i%2?K.teal:K.gold}/><TXT x={245+i*155} y={745} t={String(20+i*10)} s={27}/></g>)}</g>;
 case'human-outline-connects-to-ai-assist':return <g><R x={190} y={300} w={410} h={350} c={K.paper} o={.8}/>{[0,1,2].map(i=><L key={i} x={245} y={380+i*90} X={500} Y={380+i*90} c={K.ink} sw={10} p={q(e-i*.12)}/>) }<Arrow x={620} y={480} X={830} Y={480} p={e} c={K.teal}/></g>;
 case'man-turns-from-elevator-to-stairs':return <g><R x={150} y={220} w={260} h={500} c="#6f838a"/><TXT x={280} y={490} t="EV" s={58}/>{[0,1,2,3].map(i=><R key={i} x={520+i*80} y={660-i*85} w={100} h={85+i*85} c={i%2?K.gold:K.stone}/>)}</g>;
 case'finger-pauses-before-elevator-button':return <g><circle cx={460} cy={440} r={90} fill="#697c84" stroke={K.paper} strokeWidth={9}/><TXT x={460} y={460} t="10" s={46}/><g transform={'translate('+lerp(180,355,e)+' 460)'}><ComfortSubject kind="hand" p={p}/></g></g>;
 case'man-climbs-first-five-floors':return <g>{[0,1,2,3,4].map(i=><R key={i} x={170+i*125} y={720-i*90} w={140} h={90+i*90} c={i%2?K.stone:'#6a5e54'}/>) }<Person x={lerp(250,710,e)} y={lerp(600,260,e)} s={.52} pose="walk" role="modern" p={p}/></g>;
 default:return null;
 }
};

export const SceneVisual=({beat,prior,progress}:{beat:Beat;prior:Beat[];progress:number})=>{
 const p=q(progress);
 if(beat.mode!=='replace'&&beat.mode!=='append')throw Error('V107 invalid scene state '+beat.id);
 verbFamily(beat.verb);categoryFor(beat.primary);
 const priorItems=beat.mode==='append'?prior.filter(x=>x.environment===beat.environment).slice(-2):[];
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,overflow:'hidden',background:'#0d1821'}}>
  <Backdrop environment={beat.environment} family={beat.family}/>
  {priorItems.map((b,i)=><g key={b.id} transform={'translate('+(300+i*260)+' 560) scale(.34)'} opacity={.55-i*.12}><ComfortSubject kind={b.primary} p={1}/></g>)}
  <MoveSubject b={beat} p={p}/>
  <FX b={beat} p={p}/>
  <NarrativeDetail b={beat} p={p}/>
  <g opacity=".86"><R x={86} y={858} w={14} h={68} c={K.gold}/><TXT x={118} y={901} t={chapter(beat.phase)} s={31} anchor="start"/></g>
  <g opacity=".68"><R x={1325} y={86} w={500} h={54} rx={7} c="#0e1b24" o={.58}/><TXT x={1575} y={122} t={beat.action.replaceAll('-','・').slice(0,29)} s={20}/></g>
  <R x={0} y={0} w={1920} h={1080} c="#02080c" o={.025}/>
 </svg>;
};
