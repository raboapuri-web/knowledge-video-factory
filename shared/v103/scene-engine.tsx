import React from 'react';
import {R,L,P,q,lerp} from './primitives';
import {Backdrop} from './backgrounds';
import {VisualProp} from './codpiece-primitives';

export type Beat={
 id:string;phase:string;variant:number;narration:string;environment:string;
 actionId:string;actionLabel:string;primary:string;verb:string;family:string;
 bgGroup:string;sceneKey:string;visual:string;shotKind:string;
};
const gold='#d9b576',ruby='#96545c',cream='#ede0c7',ink='#111927',teal='#79a09d';
const movement=new Set('adjust approach arrange assemble attach break carry compare connect contrast converge cover cross cut diminish embroider enter erase exchange expand extract fade fit flow focus fold forge hammer highlight insert inspect lower magnify measure observe open overlay paint partition place point pose question raise react remove replace reveal rotate sew spin split thread tilt transfer transform turn unpack unroll unveil walk weigh'.split(' '));
const worker=new Set('adjust attach cover cut embroider extract fit fold forge hammer insert overlay paint sew thread unpack'.split(' '));
const diagram=new Set('compare connect contrast converge cross erase exchange expand flow partition split weigh'.split(' '));
const spotlight=new Set('highlight inspect magnify measure observe focus question'.split(' '));
const disappear=new Set('diminish erase fade remove'.split(' '));
const theme=(s:string)=>s.startsWith('03-greek')?'#8daaa1':s.startsWith('04-presentation')?'#c2a27e':gold;
const dual=(primary:string,phase:string)=>{
 if(['garment','belly-doublet','codpiece','metal-codpiece'].includes(primary))return primary==='belly-doublet'?'codpiece':primary==='codpiece'?'cloth':'garment';
 if(primary==='mannequin')return phase==='greek_ideal'?'statue':'garment';
 if(['statue','draped-statue'].includes(primary))return 'mannequin';
 if(primary==='armor')return 'garment';
 if(primary==='frames')return 'mannequin';
 if(primary==='ruler')return 'symbol-cards';
 if(primary==='masks')return 'symbol-cards';
 if(primary==='book')return 'garment';
 if(primary==='audience'||primary==='courtiers')return 'henry';
 return 'codpiece';
};
const ease=(t:number)=>{const p=q(t);return p*p*(3-2*p)};
const FX=({beat,p,x,y}:{beat:Beat;p:number;x:number;y:number})=>{
 const v=beat.verb,t=ease(p),c=theme(beat.environment),i=beat.variant;
 return <g data-fx={beat.actionId} pointerEvents="none">
  {worker.has(v)&&<g>
    {v==='cut'&&<g><path d={'M'+(x-210)+' '+(y+30)+' Q'+(x+100)+' '+(y-120)+' '+(x+200)+' '+(y-170)} fill="none" stroke={cream} strokeWidth="5" strokeDasharray="19 14" strokeDashoffset={220*(1-t)}/><g transform={'translate('+(x-120+220*t)+' '+(y+115-190*t)+') scale(.38)'}><VisualProp kind="scissors"/></g></g>}
    {(v==='sew'||v==='thread'||v==='embroider'||v==='attach')&&<g><path d={'M'+(x-260)+' '+(y+160)+' Q'+(x-40)+' '+(y-80)+' '+(x+230)+' '+(y+100)} fill="none" stroke={c} strokeWidth="7" strokeDasharray="2000" strokeDashoffset={1900*(1-t)}/><g transform={'translate('+(x-200+310*t)+' '+(y-195+160*t)+') scale(.35) rotate('+(24*t)+')'}><VisualProp kind="needle"/></g></g>}
    {(v==='hammer'||v==='forge')&&<g>{Array.from({length:21},(_,j)=>{const a=j*2.399;return <circle key={j} cx={x+Math.cos(a)*t*(45+j*12)} cy={y-20+Math.sin(a)*t*(50+j*10)} r={2+j%5} fill={j%2?'#e5ae63':cream} opacity={1-t}/>;})}<g transform={'translate('+(x+170)+' '+(y-90)+') rotate('+(-35+40*Math.sin(p*11))+') scale(.38)'}><VisualProp kind="hammer"/></g></g>}
    {v==='insert'&&<g>{Array.from({length:5},(_,j)=><path key={j} d={'M'+(x-230+j*30)+' '+(y-160)+' Q'+(x-40+j*19)+' '+(y-250)+' '+(x+25+j*8)+' '+(y+120*t)} fill="none" stroke={cream} strokeWidth="7" opacity={1-t*.65}/>)}</g>}
    {(v==='fit'||v==='cover'||v==='fold'||v==='overlay'||v==='adjust')&&<g><path d={'M'+(x-260)+' '+(y+150)+' L'+(x-260)+' '+(y-200)+' M'+(x+230)+' '+(y-200)+' L'+(x+230)+' '+(y+150)} stroke={c} strokeWidth="8" strokeDasharray="25 13" fill="none" opacity={.42*t}/><circle cx={x} cy={y+115} r={35+75*t} fill="none" stroke={c} strokeWidth="7" opacity={.8*(1-t)}/></g>}
    {(v==='paint'||v==='unpack')&&Array.from({length:9},(_,j)=><circle key={j} cx={x-180+j*42} cy={y-165+Math.sin(p*7+j)*18} r={8+j%3*3} fill={j%2?c:ruby} opacity={t}/>)}
  </g>}
  {diagram.has(v)&&<g>
    {(v==='compare'||v==='contrast'||v==='split'||v==='partition'||v==='weigh')&&<g><L x={960} y={130} X={960} Y={875} c={c} o={.26*t} sw={5}/><path d={'M340 760 Q620 '+(730-100*t)+' 810 760 M1100 760 Q1360 '+(690+100*t)+' 1610 760'} stroke={c} fill="none" strokeWidth="8" opacity=".5"/></g>}
    {(v==='connect'||v==='flow'||v==='exchange'||v==='converge'||v==='transfer')&&[0,1,2].map((j)=><g key={j}><path d={'M'+(200+j*210)+' '+(310+j*200)+' Q'+(600+j*85)+' '+(200+j*92)+' '+(x-75)+' '+(y-30)} fill="none" stroke={j%2?c:teal} strokeWidth="9" strokeDasharray="1800" strokeDashoffset={1800*(1-t)} opacity=".8"/><circle cx={lerp(200+j*210,x-75,t)} cy={lerp(310+j*200,y-30,t)} r={9+j*4} fill={c}/></g>)}
    {(v==='erase'||v==='cross'||v==='break')&&<g><L x={x-240} y={y-190} X={x+240} Y={y+210} c={ruby} sw={18} p={t}/><L x={x+220} y={y-195} X={x-220} Y={y+220} c={ruby} sw={18} p={t}/></g>}
    {(v==='expand'||v==='weigh')&&[0,1,2].map(j=><circle key={j} cx={x} cy={y} r={lerp(30,130+j*75,t)} fill="none" stroke={c} strokeWidth="8" opacity={.55-.4*t}/>)}
  </g>}
  {spotlight.has(v)&&<g>
    <circle cx={x} cy={y} r={lerp(60,275,t)} fill="none" stroke={c} strokeWidth="9" opacity={.7-.5*t}/>
    <path d={'M'+(x-230)+' '+(y-170)+' V'+(y-225)+' H'+(x-140)+' M'+(x+230)+' '+(y+170)+' V'+(y+225)+' H'+(x+140)} fill="none" stroke={c} strokeWidth="11" opacity=".9"/>
    {v==='question'&&<g><text x={x-345} y={y-210} fontSize={86} fontFamily="Noto Sans JP" fontWeight="bold" fill={c} opacity={t}>?</text></g>}
  </g>}
  {(v==='open'||v==='reveal'||v==='unveil'||v==='unroll')&&<g opacity={1-t}><path d={'M'+(x-290)+' '+(y-260)+' Q'+x+' '+(y-140)+' '+(x+260)+' '+(y-260)+' V'+(y+250)+' H'+(x-290)+'Z'} fill="#86525b"/><L x={x-278} y={y-260} X={x+260} Y={y-260} c={c} sw={13}/></g>}
  {(v==='transform'||v==='replace'||v==='turn'||v==='transfer')&&<path d={'M'+(x-370)+' '+(y+180)+' Q'+x+' '+(y+285)+' '+(x+330)+' '+(y+170)} fill="none" stroke={c} strokeWidth="8" strokeDasharray="17 14" opacity=".65"/>}
  {(v==='raise'||v==='lower'||v==='lift')&&<path d={'M'+(x+230)+' '+(y+170)+' V'+(y-180*t)} stroke={c} strokeWidth="14" strokeDasharray="22 13" strokeLinecap="round"/>}
  {['enter','arrange','place','react','pose','walk','carry','approach','point','spin','rotate','tilt'].includes(v)&&<g><ellipse cx={x} cy={y+215} rx={lerp(100,190,t)} ry={20} fill={c} opacity={.13*(1-t)}/>{['point','pose','react'].includes(v)&&<path d={'M'+(x-250)+' '+(y+160)+' Q'+x+' '+(y+250-65*Math.sin(p*3))+' '+(x+220)+' '+(y+160)} stroke={c} strokeWidth="7" fill="none" opacity=".3"/>}</g>}
  {disappear.has(v)&&<g opacity={t*.7}><rect x={x-275} y={y-300} width={570} height={610} fill={ink} opacity={.35*t}/>{[0,1,2,3].map(j=><L key={j} x={x-235+j*140} y={y-260} X={x-235+j*140} Y={y+280} c={ink} sw={12} o={.2+.15*t}/>)}</g>}
  {(v==='measure'||v==='focus'||v==='inspect')&&<g><L x={x-300} y={y-215} X={x-300} Y={y+240} c={c} o={t*.6} sw={4}/><L x={x+300} y={y-215} X={x+300} Y={y+240} c={c} o={t*.6} sw={4}/></g>}
  <g opacity={.55*t}>{[0,1,2,3].map((j)=><circle key={j} cx={x+(j%2?1:-1)*(190+j*32)} cy={y-240+j*72} r={2+j%3} fill={c}/>)}</g>
 </g>;
};
export const V103Visual=({beat,progress}:{beat:Beat;progress:number})=>{
 const p=q(progress),v=beat.verb;
 if(!movement.has(v))throw new Error('Missing narration-specific visual motion: '+beat.id+' '+v);
 const c=theme(beat.environment),t=ease(p);
 const anchorX=[1055,1115,960,1200,1040,1125,965,1090,1010,1180,970,1120,1050][beat.variant%13];
 const anchorY=[545,565,505,580,525,552,490][beat.variant%7];
 const isDual=diagram.has(v)||v==='transform'||v==='replace'||v==='turn'||v==='exchange'||v==='overlay';
 const isWork=worker.has(v),comp=dual(beat.primary,beat.phase);
 let dx=0,dy=0,rot=0,s=1,op=1;
 if(['enter','walk','carry','approach','place'].includes(v))dx=lerp(-165,40,t);
 if(['raise','lower','lift','insert','extract'].includes(v))dy=lerp(100,-35,t)*(v==='lower'?-1:1);
 if(['spin','rotate','turn'].includes(v))rot=lerp(-18,18,t);
 if(['tilt','weigh'].includes(v))rot=lerp(-12,12,t);
 if(['magnify','inspect','focus'].includes(v))s=lerp(.86,1.17,t);
 if(['expand','transform'].includes(v))s=lerp(.73,1.1,t);
 if(disappear.has(v)){op=lerp(1,.14,t);s=lerp(1,.88,t);}
 if(['open','unveil','reveal','unroll','enter'].includes(v))op=lerp(.35,1,t);
 const mainScale=beat.primary==='portrait'?1.13:beat.primary==='frames'||beat.primary==='courtiers'||beat.primary==='audience'?.95:beat.primary==='statues'?.92:1.13;
 return <g data-v103-action={beat.actionId} data-environment={beat.environment}>
   <Backdrop environment={beat.environment}/>
   <g opacity={.42} transform={'translate('+(beat.variant%2?160:310)+' 570) scale(.53)'}>{isWork?<VisualProp kind="worktable" p={p}/>:isDual?<VisualProp kind={comp} p={1-p}/>:beat.primary==='portrait'?<VisualProp kind="crown" p={p}/>:<VisualProp kind={beat.phase==='greek_ideal'?'statue':beat.phase==='social_presentation'?'mannequin':'curtain'} p={p}/>}</g>
   {isWork&&<g transform="translate(600 665) scale(.56)"><VisualProp kind="artisan" p={p}/></g>}
   {isDual&&<g transform={'translate(480 540) scale('+(beat.primary==='frames'?.76:.92)+')'} opacity={.85}><VisualProp kind={comp} p={p}/></g>}
   <g transform={'translate('+(anchorX+dx)+' '+(anchorY+dy)+') rotate('+rot+') scale('+(mainScale*s)+')'} opacity={op}><VisualProp kind={beat.primary} p={p}/></g>
   <FX beat={beat} p={p} x={anchorX} y={anchorY}/>
   <g opacity=".75"><R x={90} y={75} w={24} h={64} c={c}/><text x={130} y={114} fill={cream} fontSize={32} fontWeight={700} fontFamily="Noto Sans JP, sans-serif">{beat.phase==='prologue'?'プロローグ':beat.phase==='origins'?'第1章｜隠す布':beat.phase==='kingship'?'第2章｜王の威厳':beat.phase==='greek_ideal'?'第3章｜古代の美':beat.phase==='social_presentation'?'第4章｜男らしさ': 'エピローグ'}</text></g>
   {['book','scroll','research-paper','ledger','museum-label'].includes(beat.primary)&&<g><R x={780} y={830} w={860} h={69} c={ink} o={.64}/><text x={1210} y={875} textAnchor="middle" fontSize={29} fill={cream} fontFamily="Noto Sans JP" fontWeight={650}>{beat.actionLabel.length>31?beat.actionLabel.slice(0,31):beat.actionLabel}</text></g>}
   <R x={0} y={0} w={1920} h={1080} c={ink} o={.035}/>
 </g>;
};