import React from 'react';
import {R,L,P,Ring,q,lerp} from './primitives';
import {Backdrop} from './backgrounds';
import {MythSubject,categoryFor,K,TXT,ease} from './myth-art';
export type Beat={id:string;phase:string;variant:number;narration:string;environment:string;family:string;action:string;primary:string;verb:string;mode:string;actionId:string;sceneKey:string;visual:string;shotKind:string};
const verbGroups:Record<string,string>={
 kinetic:'strike sever dance subdue descend flee turn migrate search read move approach',
 transform:'regrow burn reveal vanish transform poison flow open block build branch',
 relational:'compare connect transmit narrate converge diverge align weigh separate',
 cognitive:'inspect doubt remember select highlight imagine test question',
 temporal:'wait persist repeat survive inherit'
};
const inverse=new Map<string,string>();for(const [g,s] of Object.entries(verbGroups))for(const v of s.split(/\s+/))inverse.set(v,g);
const vf=(v:string)=>{const g=inverse.get(v);if(!g)throw Error('V108 unsupported physical verb '+v);return g};
const hash=(s:string)=>[...s].reduce((a,c)=>((a*31)^c.charCodeAt(0))>>>0,719);
const chapter=(p:string)=>p==='prologue'?'プロローグ':p==='ancestor'?'第1章　共通の祖先':p==='counter'?'第2章　似ているという罠':p==='travel'?'第3章　物語の旅':p==='cognition'?'第4章　記憶が選ぶ神話':'エピローグ';
const SubjectMove=({b,p}:{b:Beat;p:number})=>{const e=ease(p),g=vf(b.verb),seed=hash(b.action),cat=categoryFor(b.primary);let x=1100+(seed%280)-140,y=510+(seed%100)-50,dx=0,dy=0,rot=0,sc=cat==='serpent'?.92:cat==='hero'?.9:cat==='diagram'?.88:.82;
 if(g==='kinetic'){dx=lerp(seed%2?-210:210,0,e);dy=b.verb==='descend'?lerp(-160,40,e):b.verb==='dance'?35*Math.sin(e*Math.PI*4):lerp(55,0,e);rot=b.verb==='turn'?lerp(-25,18,e):0}
 if(g==='transform'){sc*=lerp(.72,1.02,e);rot=6*Math.sin(e*Math.PI*2);dy=b.verb==='vanish'?-80*e:0}
 if(g==='relational')dx=lerp(seed%2?-80:80,0,e);
 if(g==='cognitive')sc*=lerp(.84,1,e);
 if(g==='temporal')dy=12*Math.sin(e*Math.PI*2);
 return <g transform={'translate('+(x+dx)+' '+(y+dy)+') rotate('+rot+') scale('+sc+')'} data-primary={b.primary}><MythSubject kind={b.primary} p={p}/></g>};
const FX=({b,p}:{b:Beat;p:number})=>{const e=ease(p),g=vf(b.verb),accent=b.phase==='counter'?K.red:b.phase==='cognition'?K.teal:b.phase==='ancestor'?K.gold:K.blue;return <g data-verb={b.verb} data-action={b.actionId}>
 {g==='kinetic'&&<g><path d="M150 760 Q620 560 980 700 T1780 540" fill="none" stroke={accent} strokeWidth={9} strokeDasharray="30 18" opacity=".4"/><circle cx={lerp(210,1650,e)} cy={690-70*Math.sin(e*Math.PI)} r={18} fill={accent}/></g>}
 {g==='transform'&&<g>{[0,1,2].map(i=><Ring key={i} x={560} y={480} p={q((e-i*.12)*1.5)} r={120+i*90} c={i%2?accent:K.gold}/>)}<L x={210} y={770} X={770} Y={770} c={accent} sw={10} p={e}/></g>}
 {g==='relational'&&<g><R x={155} y={300} w={300} h={330} rx={18} c="#526775" o={.56}/><R x={520} y={300} w={300} h={330} rx={18} c="#735e62" o={.56}/><L x={455} y={465} X={520} Y={465} c={accent} sw={12} p={e}/></g>}
 {g==='cognitive'&&<g><Ring x={500} y={470} p={e} r={210} c={accent}/>{[0,1,2,3].map(i=><R key={i} x={220+i*145} y={720-i%2*48} w={110} h={32} c={i%2?K.gold:accent} o={q((e-i*.1)*2)}/>)}</g>}
 {g==='temporal'&&<g><L x={180} y={760} X={820} Y={760} c={K.paper} sw={7} p={e}/>{[0,1,2,3].map(i=><circle key={i} cx={220+i*185} cy={760} r={18} fill={i%2?K.gold:accent} opacity={q((e-i*.15)*3)}/>)}</g>}
 </g>};
const Detail=({b,p}:{b:Beat;p:number})=>{const e=ease(p);
 if(b.primary==='orochi')return <g>{[0,1,2,3].map(i=><circle key={i} cx={260+i*140} cy={720+(i%2)*65} r={38} fill="#8f7256" stroke={K.gold} strokeWidth={6}/>)}{b.verb==='sever'&&<P d="M420 280 L520 470 465 470 560 650 350 450 420 450Z" c={K.paper} o={.8}/>}</g>;
 if(b.primary==='hydra')return <g>{b.verb==='regrow'&&[0,1,2].map(i=><path key={i} d={'M'+(260+i*160)+' 650 q60 -190 120 -40'} fill="none" stroke="#728063" strokeWidth="35" strokeLinecap="round" opacity={q((e-i*.14)*2)}/>)}{b.verb==='burn'&&<P d="M350 770 Q450 520 550 770 Q450 680 350 770Z" c={K.red}/>}</g>;
 if(b.primary==='kaliya')return <g>{b.verb==='poison'&&<P d="M120 740 Q430 640 780 735 T1160 710 L1160 940 H120Z" c="#345b58" o={.72}/>}<Ring x={650} y={500} p={p} r={270} c={K.teal}/></g>;
 if(b.primary==='izanagi'&&b.verb==='reveal')return <g><g transform="translate(410 510) scale(.52)"><MythSubject kind="torch" p={p}/></g><R x={600} y={250} w={300} h={420} c="#191b22" o={1-e}/></g>;
 if(b.primary==='orpheus'&&b.verb==='turn')return <g><L x={300} y={715} X={850} Y={360} c={K.gold} sw={8} p={e}/><g transform={'translate('+lerp(500,700,e)+' 470) scale(.55)'}><MythSubject kind="eurydice" p={1-e*.65}/></g></g>;
 if(b.primary==='etymology-tree'||b.primary==='language-tree'||b.primary==='phylo-tree'||b.primary==='trade-route'||b.primary==='attention-grid'||b.primary==='memory-cards')return <g transform="translate(510 490) scale(.62)"><MythSubject kind={b.primary} p={p}/></g>;
 if(b.primary==='child')return <g><g transform="translate(510 480) scale(.55)"><MythSubject kind="book" p={p}/></g><Ring x={510} y={480} p={p} r={230} c={K.gold}/></g>;
 return null;};
export const SceneVisual=({beat,progress}:{beat:Beat;progress:number})=>{const p=q(progress);vf(beat.verb);categoryFor(beat.primary);return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,overflow:'hidden',background:'#0a121a'}}>
 <Backdrop environment={beat.environment} family={beat.family}/><SubjectMove b={beat} p={p}/><FX b={beat} p={p}/><Detail b={beat} p={p}/>
 <g opacity=".86"><R x={84} y={858} w={14} h={68} c={K.gold}/><TXT x={116} y={902} t={chapter(beat.phase)} s={30} a="start"/></g>
 <g opacity=".62"><R x={1360} y={86} w={470} h={52} rx={7} c="#0d1820" o={.6}/><TXT x={1595} y={121} t={beat.action.replaceAll('-','・').slice(0,30)} s={19}/></g>
 </svg>};