import React from 'react';
import {C,R,L,P,Ring,q,lerp} from './primitives';
import {Backdrop} from './backgrounds';
import {SwissSubject,categoryFor} from './swiss-art';

export type Beat={id:string;phase:string;variant:number;narration:string;family:string;action:string;actionId:string;environment:string;primary:string;verb:string;mode:'append'|'replace';shotKind:string;bgGroup:string;sceneKey:string};
const gold='#dac08b',white='#f2eee3',red='#af6061',teal='#76a5a2',blue='#80a6bd',dark='#15212d';
const verbFamilies:Record<string,string>={
  kinetic:'advance approach enter march travel walk relocate retreat reverse queue unload divert join transfer relay receive exchange meet gather',
  constructive:'assemble form prepare insert stack accumulate collect populate distribute mark place stamp seal record redraw label sort arrange collate block',
  document:'open unfold unfurl unroll unpack unveil reveal appear highlight focus illuminate examine review present trace overlay',
  relational:'compare contrast separate partition divide isolate reconcile bridge branch connect converge weigh balance evaluate qualify disagree sever',
  dramatic:'simulate spread extend transform rise expand fade shade intrude halt pause constrain delay obscure clarify replace',
  observational:'look notice question hold operate point allocate sequence rewind',
};
const familyFor=(verb:string)=>{
 for(const [family,s] of Object.entries(verbFamilies))if(s.split(' ').includes(verb))return family;
 throw Error('V106 physical action must have hand-coded motion family: '+verb);
};
const easing=(p:number)=>{const s=q(p);return s*s*(3-2*s);};
const chapter=(phase:string)=>phase==='prologue'?'プロローグ':phase==='history'?'第1章｜大国が認めた中立':phase==='reduit'?'第2章｜戦う準備':phase==='economy'?'第3章｜戦争の影':phase==='modern'?'第4章｜現代の中立':'エピローグ';
const MoveSubject=({b,p}:{b:Beat;p:number})=>{
 const e=easing(p),kind=categoryFor(b.primary),family=familyFor(b.verb);
 const x0=kind==='people'?1050:kind==='maps'||kind==='simulations'?960:kind==='documents'?1060:kind==='diagrams'?960:kind==='landscapes'?975:1100;
 const y0=kind==='people'?520:kind==='maps'||kind==='simulations'?475:kind==='documents'?495:kind==='diagrams'?475:kind==='landscapes'?510:495;
 let dx=0,dy=0,scale=1,rotation=0,opacity=1;
 if(family==='kinetic'){dx=lerp(-260,32,e);dy=lerp(45,0,e);rotation=b.verb==='exchange'?lerp(-8,0,e):0;}
 if(family==='constructive'){dy=lerp(105,0,e);dx=lerp(-68,0,e);scale=lerp(.85,1,e);}
 if(family==='document'){opacity=lerp(.25,1,e);rotation=b.verb==='unfold'?lerp(-13,0,e):lerp(-7,0,e);scale=lerp(.86,1.02,e);}
 if(family==='relational'){dx=lerp(-25,0,e);scale=lerp(.92,1,e);}
 if(family==='dramatic'){scale=b.verb==='fade'?lerp(1,.78,e):b.verb==='expand'?lerp(.65,1.06,e):lerp(.84,1,e);opacity=b.verb==='fade'?lerp(1,.22,e):1;rotation=b.verb==='reverse'?lerp(-12,9,e):0;}
 if(family==='observational'){scale=b.verb==='notice'?lerp(.87,1.08,e):1;}
 const visualSize=(kind==='maps'||kind==='simulations')?.97:kind==='people'?.85:kind==='documents'?.89:kind==='landscapes'?.99:kind==='diagrams'?.92:.91;
 return <g transform={'translate('+(x0+dx)+' '+(y0+dy)+') rotate('+rotation+') scale('+(visualSize*scale)+')'} opacity={opacity} data-original-object={b.primary}><SwissSubject kind={b.primary} p={p} verb={b.verb}/></g>;
};
const Persistent=({items}:{items:Beat[]})=><g>{items.map((p,i)=><g key={p.id} opacity={.6-i*.13} transform={'translate('+(360+i*245)+' '+(540+i*28)+') scale('+(categoryFor(p.primary)==='maps'?.32:.45)+')'}><SwissSubject kind={p.primary} p={1} verb={p.verb}/></g>)}</g>;
const FX=({b,p}:{b:Beat;p:number})=>{
 const e=easing(p),family=familyFor(b.verb),v=b.verb,accent=b.phase==='modern'?teal:b.phase==='history'?gold:b.phase==='economy'?'#b5a582':blue;
 const x=1050,y=495;
 return <g data-action={b.actionId}>
 {family==='kinetic'&&<g>
  <path d={'M150 765 Q580 '+(770-30*e)+' 870 750 L1510 750'} stroke={accent} strokeWidth="8" fill="none" strokeDasharray="24 17" opacity=".44"/>
  <circle cx={lerp(250,1560,e)} cy={750-54*Math.sin(e*Math.PI)} r={13} fill={accent}/>
  {v==='relocate'&&[0,1,2].map(i=><g key={i}><R x={200+i*116+450*e} y={365+i*120-40*e} w={90} h={47} c={accent} rx={7}/><L x={245+i*116+450*e} y={365+i*120-40*e} X={450+i*116+450*e} Y={300+i*100-40*e} c={accent} sw={5}/></g>)}
  {(v==='march'||v==='walk')&&[0,1,2,3].map(i=><circle key={i} cx={lerp(160+i*105,640+i*105,e)} cy={685+i%2*20} r={10} fill={accent} opacity=".8"/>)}
  {v==='exchange'&&<g><path d={'M390 375 Q680 270 925 375 M930 595 Q1250 715 1510 570'} stroke={accent} fill="none" strokeWidth="9" strokeDasharray="28 18" opacity=".6"/></g>}
  {(v==='queue'||v==='delay')&&[0,1,2,3].map(i=><R key={i} x={190+i*154} y={780} w={115} h={44} c={accent} rx={10} o={q((e-i*.13)*3)}/>)}
 </g>}
 {family==='constructive'&&<g>
  {[0,1,2].map(i=><g key={i} opacity={q(e*2-i*.34)} transform={'translate('+(260+i*120+e*190)+' '+(280+i*180+35*(1-e))+')'}><R x={0} y={0} w={112} h={64} c={i%2?accent:'#798e90'} rx={7}/><R x={14} y={14} w={84} h={9} c={white} o={.54}/></g>)}
  {(v==='stamp'||v==='seal'||v==='mark')&&<g opacity={q((p-.5)*4)} transform={'translate(1430 730) rotate(-12)'}><circle r={70} stroke={v==='mark'?gold:red} strokeWidth="12" fill="none"/><text y={12} fontSize={28} textAnchor="middle" fontFamily="Noto Sans JP" fill={v==='mark'?gold:red}>記録</text></g>}
  {v==='redraw'&&<path d={'M380 670 Q800 320 1500 420'} fill="none" stroke={accent} strokeWidth="9" strokeDasharray="1500" strokeDashoffset={1500*(1-e)}/>}
  {v==='insert'&&<path d={'M490 330 L610 330 L610 '+(330+300*e)} stroke={accent} strokeWidth="10" fill="none"/>}
 </g>}
 {family==='document'&&<g>
  <path d={'M250 700 Q780 '+(640-70*e)+' 1510 '+(620-90*e)} fill="none" stroke={accent} strokeWidth="7" strokeDasharray="1800" strokeDashoffset={1800*(1-e)} opacity=".52"/>
  {(v==='highlight'||v==='focus'||v==='examine')&&<g><circle cx={1060} cy={480} r={lerp(54,285,e)} fill="none" stroke={accent} strokeWidth="11" opacity={.85-.65*e}/><L x={830} y={270} X={930} Y={270} c={accent} sw={12}/><L x={1260} y={700} X={1360} Y={700} c={accent} sw={12}/></g>}
  {(v==='unfurl'||v==='unfold'||v==='unroll')&&<g><R x={104} y={710-120*e} w={460*e} h={15} c={accent}/><circle cx={104+460*e} cy={718-120*e} r={23} fill={accent}/></g>}
  {v==='illuminate'&&[0,1,2,3,4,5,6,7].map(i=><L key={i} x={1040+300*Math.cos(i*Math.PI/4)} y={470+290*Math.sin(i*Math.PI/4)} X={1040+380*Math.cos(i*Math.PI/4)} Y={470+375*Math.sin(i*Math.PI/4)} c={accent} sw={8} o={e*.65}/>)}
 </g>}
 {family==='relational'&&<g>
  <L x={963} y={245} X={963} Y={775} c={accent} sw={7} o={.32}/>
  {['compare','contrast','separate','partition','divide','balance','weigh'].includes(v)&&[0,1].map(i=><g key={i}><R x={160+i*1180} y={745-(i?25:-25)*e} w={340} h={38} c={i?teal:gold} o={.55}/><circle cx={330+i*1180} cy={736-(i?25:-25)*e} r={19} fill={i?teal:gold}/></g>)}
  {['connect','converge','bridge','reconcile','branch'].includes(v)&&[0,1,2].map(i=><path key={i} d={'M'+(120+i*110)+' '+(350+i*180)+' Q'+(630+i*110)+' '+(270+i*128)+' 1520 '+(410+i*75)} stroke={i%2?accent:teal} strokeWidth="8" fill="none" strokeDasharray="1800" strokeDashoffset={1800*(1-e)} opacity=".74"/>)}
  {v==='sever'&&<g><L x={650} y={305} X={1370} Y={720} c={red} sw={16} p={e}/><L x={1370} y={305} X={650} Y={720} c={red} sw={16} p={e}/></g>}
  {v==='qualify'&&<g><R x={330} y={775} w={1180} h={22} c={red} o={.4*e}/><text x={930} y={740} textAnchor="middle" fill={white} fontSize={29} fontFamily="Noto Sans JP" opacity={e}>単一の理由では説明できない</text></g>}
 </g>}
 {family==='dramatic'&&<g>
  {(v==='simulate')&&<g><R x={525} y={760} w={920} h={67} c="#543b3c" rx={13} o={.88}/><text x={990} y={805} textAnchor="middle" fontSize={35} fontFamily="Noto Sans JP" fontWeight={750} fill={white}>仮定のシミュレーション</text><path d="M370 320 Q800 235 1570 480" fill="none" stroke={red} strokeWidth="10" strokeDasharray="25 17" strokeDashoffset={500*(1-e)}/></g>}
  {v==='halt'&&<g><L x={490} y={285} X={1400} Y={725} c={red} sw={13} p={e}/><R x={1360} y={640} w={40} h={150} c={red}/></g>}
  {v==='delay'&&[0,1,2,3,4].map(i=><circle key={i} cx={330+i*170} cy={755} r={14} fill={i%2?gold:teal} opacity={q((e-i*.14)*2)}/>)}
  {v==='clarify'&&<g opacity={e}><R x={400} y={765} w={1120} h={11} c={teal}/><text x={960} y={739} textAnchor="middle" fontSize={28} fontFamily="Noto Sans JP" fill={white}>事実・解釈を区別</text></g>}
  {v==='shade'&&<R x={100} y={120} w={1720} h={620} c={dark} o={.38*e}/>}
  {v==='expand'&&[0,1,2].map(i=><circle key={i} cx={990} cy={470} r={lerp(30,210+i*65,e)} fill="none" stroke={accent} strokeWidth="7" opacity={.48-e*.29}/>)}
 </g>}
 {family==='observational'&&<g>
  {v==='question'&&<text x={420} y={600} fontFamily="Noto Sans JP" fontSize={250} textAnchor="middle" fontWeight={800} fill={accent} opacity={q(e*1.8)}>？</text>}
  {v==='look'||v==='notice'||v==='evaluate'?<g><circle cx={1100} cy={465} r={lerp(25,255,e)} fill="none" stroke={accent} strokeWidth="8" opacity=".65"/><path d="M970 210 h-55 v60 M1280 710 h55 v-60" fill="none" stroke={accent} strokeWidth="10"/></g>:null}
  {v==='sequence'&&[0,1,2].map(i=><g key={i} opacity={q((e-i*.24)*3)}><circle cx={350+i*330} cy={775} r={30} fill={i%2?teal:gold}/><L x={380+i*330} y={775} X={610+i*330} Y={775} c={accent} sw={9}/></g>)}
  {v==='rewind'&&<path d="M400 750 Q880 590 1470 780" fill="none" stroke={accent} strokeWidth="12" strokeDasharray="22 15" strokeDashoffset={500*e}/>}
 </g>}
 </g>;
};
export const SceneVisual=({beat,prior,progress}:{beat:Beat;prior:Beat[];progress:number})=>{
 const p=q(progress);
 if(beat.mode!=='replace'&&beat.mode!=='append')throw Error('V106 stage update mode unknown: '+beat.id);
 familyFor(beat.verb);categoryFor(beat.primary);
 const priorItems=beat.mode==='append'?prior.filter(b=>b.environment===beat.environment).slice(-2):[];
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,overflow:'hidden',background:'#111e29'}}>
  <Backdrop environment={beat.environment}/>
  {priorItems.length>0&&<Persistent items={priorItems}/>}
  <MoveSubject b={beat} p={p}/>
  <FX b={beat} p={p}/>
  <g opacity=".87"><R x={104} y={858} w={13} h={70} c={gold}/><text x={130} y={901} fontFamily="Noto Sans JP" fontSize={33} fontWeight={690} fill={white}>{chapter(beat.phase)}</text></g>
  <g opacity=".76"><R x={1360} y={91} w={450} h={52} c={dark} o={.45} rx={5}/><text x={1587} y={125} fill={white} textAnchor="middle" fontSize={22} fontFamily="Noto Sans JP">{beat.action.slice(0,24)}</text></g>
  <R x={0} y={0} w={1920} h={1080} c="#02090d" o={.025}/>
 </svg>;
};
