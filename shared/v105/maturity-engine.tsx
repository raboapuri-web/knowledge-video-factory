import React from 'react';
import {C,R,L,P,Person,Ring,House,Coin,q,lerp} from './primitives';
import {Backdrop,Subject,Text,K,easing,supportedFamilies,supportedObjects} from './maturity-art';
import beats from './scene-data.json';
export type MatureBeat={id:string;phase:string;variant:number;actionId:string;action:string;family:string;environment:string;primary:string;verb:string;narration:string;sceneKey:string};
const data=beats as MatureBeat[];
const groups={
 movement:new Set('drop return deliver receive escort walk rise lower setdown carry advance help revisit'.split(' ')),
 decision:new Set('point reach pause sort notice choose catch listen offer write wash open schedule stamp fill pack hold'.split(' ')),
 complex:new Set('stack distribute unfold collate accumulate arrange coordinate organize sequence hoard reassign build assemble'.split(' ')),
 compare:new Set('separate divide contrast compare mirror qualify diverge redistribute share stabilize weigh tilt subtract cross'.split(' ')),
 abstract:new Set('lag grow notify hover call connect converge release stir transform reveal crack fragment cover hide merge consume'.split(' '))
};
const verbs=new Set(Object.values(groups).flatMap(x=>[...x]));
export const supportedVerbs=verbs;
const motionTransform=(v:string,e:number,n:number)=>{
 const alt=n%2?-1:1,wiggle=Math.sin(e*Math.PI*2);
 if(groups.movement.has(v))return {dx:v==='drop'?0:alt*lerp(-190,25,e),dy:v==='drop'?lerp(-290,60,e):v==='lower'?lerp(-115,95,e):v==='rise'?lerp(140,-25,e):lerp(55,0,e),rot:v==='drop'?lerp(-13,7,e):v==='setdown'?lerp(-17,0,e):0,scale:1};
 if(groups.decision.has(v))return {dx:v==='reach'||v==='offer'?lerp(-110,40,e):0,dy:v==='notice'||v==='pause'?0:lerp(25,0,e),rot:v==='open'?lerp(-15,4,e):v==='wash'?wiggle*4:0,scale:v==='notice'?lerp(.83,1.04,e):1};
 if(groups.complex.has(v))return {dx:lerp(-70,20,e),dy:lerp(36,-12,e),rot:v==='arrange'||v==='organize'?lerp(-7,0,e):0,scale:v==='build'?lerp(.77,1,e):1};
 if(groups.compare.has(v))return {dx:alt*lerp(-44,0,e),dy:0,rot:v==='tilt'||v==='weigh'?lerp(-13,10,e):0,scale:1};
 if(groups.abstract.has(v))return {dx:v==='hover'?wiggle*58:0,dy:v==='hover'?wiggle*23:v==='lag'?lerp(60,0,e):0,rot:v==='stir'?wiggle*10:v==='transform'?lerp(-8,6,e):0,scale:v==='grow'||v==='reveal'||v==='merge'?lerp(.69,1.03,e):1};
 throw Error('V105 unsupported physical animation '+v);
};
const Arrow=({x,y,X,Y,p=1,c=K.gold}:{x:number;y:number;X:number;Y:number;p?:number;c?:string})=><g><L x={x} y={y} X={X} Y={Y} c={c} sw={12} p={p}/>{p>.3&&<P d={'M'+(X-26)+' '+(Y-20)+' L'+X+' '+Y+' L'+(X-26)+' '+(Y+20)} c="none" stroke={c} sw={9}/>}</g>;
const MovingText=({x,y,txt,p,c=K.paper}:{x:number;y:number;txt:string;p:number;c?:string})=><g opacity={q((p-.11)*2.2)} transform={'translate(0 '+lerp(37,0,p)+')'}><Text x={x} y={y} t={txt} s={45} c={c}/></g>;
const heroPosition=(b:MatureBeat)=>{
 if(['data','theory','research','causality','document','audit','detail','planner'].includes(b.family))return {x:1280,y:490,scale:.9};
 if(['comparison','split','two-worlds','balance','scale'].includes(b.family))return {x:1360,y:485,scale:.74};
 if(['map','city','commute','street','park','architecture','finale'].includes(b.family))return {x:1200,y:525,scale:.82};
 if(['metaphor','silhouette','emotion','symbolic','mosaic','diagram','timeline'].includes(b.family))return {x:1030,y:485,scale:1.05};
 return {x:1270,y:515,scale:.88};
};
const familyTitle=(phase:string)=>phase==='01-adulthood'?'第1章　人はいつ大人になるのか':phase==='02-overprotection'?'第2章　保護と自律':phase==='03-social-roles'?'第3章　家庭と社会の役割':phase==='04-masculinity'?'第4章　強さと弱さ':phase==='05-epilogue'?'エピローグ':'心理的成熟';
const Accent=({b,p}:{b:MatureBeat;p:number})=>{
 const e=easing(p),v=b.verb,a=b.action;
 const panel=(x:number,y:number,i:number,w=210,h=112)=><g key={i} opacity={q((e-i*.14)*3)} transform={'translate('+lerp(x-140,x,e)+' '+lerp(y+35,y,e)+')'}><R x={0} y={0} w={w} h={h} rx={13} c={i%2?K.gold:K.teal}/><R x={28} y={27} w={w-56} h={13} rx={7} c={K.ink} o={.57}/><R x={28} y={58} w={w-80} h={10} rx={5} c={K.paper} o={.55}/></g>;
 if(groups.movement.has(v))return <g>{[0,1,2].map(i=><circle key={i} cx={lerp(370+i*85,670+i*85,e)} cy={770-70*Math.sin(e*Math.PI)} r={14-i*3} fill={i%2?K.gold:K.teal} opacity={.7})}<Arrow x={485} y={785} X={930} Y={785} p={e}/></g>;
 if(groups.decision.has(v))return <g><Ring x={760} y={390} p={e} r={152} c={K.gold}/>{[0,1].map(i=>panel(220+i*295,585+i*53,i,245,114))}<L x={660} y={430} X={840} Y={285} c={K.red} sw={9} p={e}/></g>;
 if(groups.complex.has(v))return <g>{[0,1,2,3].map(i=>panel(190+(i%2)*270,315+Math.floor(i/2)*215,i,224,150))}<Arrow x={700} y={520} X={925} Y={520} p={e}/></g>;
 if(groups.compare.has(v))return <g><R x={140} y={270} w={310} h={420} rx={18} c="#5e7884" o={.7}/><R x={490} y={270} w={310} h={420} rx={18} c="#8b7069" o={.7}/><L x={470} y={250} X={470} Y={790} c={K.gold} sw={8}/><Arrow x={360} y={835} X={680} Y={835} p={e}/></g>;
 if(groups.abstract.has(v))return <g>{[0,1,2].map(i=><g key={i}><circle cx={205+i*225} cy={365+(i%2)*170} r={52+38*e} fill={i%2?K.teal:K.gold} opacity={.73}/>{i<2&&<L x={256+i*225} y={365+(i%2)*170} X={380+i*225} Y={535-((i+1)%2)*170} c={K.paper} sw={8} p={e}/>}</g>)}<Ring x={590} y={555} p={e} r={130} c={K.red}/></g>;
 throw Error('V105 missing dedicated animation FX '+a);
};
const Detail=({b,p}:{b:MatureBeat;p:number})=>{
 const e=easing(p),a=b.action;
 switch(a){
 case'child-drops-pencil-case':return <g><R x={220} y={780} w={1400} h={42} c="#705948"/>{[0,1,2].map(i=><R key={i} x={380+i*112} y={lerp(255,720-i*25,e)} w={25} h={140} c={[K.gold,K.red,K.teal][i]}/>)}</g>;
 case'teacher-asks-apology':return <g><Person x={510} y={500} role="child" s={.78} p={p} pose="stand"/><Person x={950} y={455} role="teacher" s={.77} p={p} pose="point"/><Ring x={760} y={750} p={e} r={72} c={K.red}/></g>;
 case'adult-excuses-sales-failure':return <g>{[0,1,2].map(i=><g key={i} transform={'translate('+lerp(-160,250+i*145,e)+' '+(535+i*95)+') rotate('+(-12+i*10)+')'}><R x={0} y={0} w={245} h={128} c={K.paper} stroke={K.wood} sw={5}/></g>)}</g>;
 case'arnett-student-survey':return <g><Text x={420} y={380} t="1994年" s={75} c={K.gold}/><Text x={420} y={475} t="大学生 346人" s={48}/><R x={200} y={545} w={440*e} h={13} c={K.teal}/></g>;
 case'twenty-three-percent-survey':return <g><Text x={390} y={425} t="23%" s={125} c={K.gold}/><Text x={420} y={503} t="大人になったと回答" s={32}/><R x={220} y={565} w={500} h={66} c={K.paper} o={.26}/><R x={220} y={565} w={115*e} h={66} c={K.gold}/></g>;
 case'child-reaches-for-toy':return <g><Person x={540} y={500} s={.7} role="child" p={p} pose="carry"/><circle cx={lerp(910,665,e)} cy={690} r={70} fill={K.gold}/></g>;
 case'delay-train-notify-client':return <g><R x={150} y={275} w={715} h={460} c="#708b93"/>{[0,1,2].map(i=><R key={i} x={230+i*210} y={360} w={158} h={250} c={K.blue}/>) }<Subject kind="phone" p={p}/><MovingText x={515} y={235} txt="遅延 → 連絡" p={e}/></g>;
 case'child-returns-wet-then-prepares':return <g><Person x={470} y={430} role="child" s={.72} p={p} pose="walk"/>{[0,1,2].map(i=><L key={i} x={250+i*155} y={175} X={220+i*155} Y={640} c={K.blue} sw={9} p={e}/>)}</g>;
 case'parent-delivers-forgotten-book':return <g><Person x={390} y={440} s={.73} role="modern" pose="carry" p={p}/><g transform={'translate('+lerp(240,730,e)+' 625) scale(.44)'}><Subject kind="textbook" p={p}/></g></g>;
 case'helicopter-hover-over-child':return <g><g transform={'translate(490 '+(390+33*Math.sin(e*Math.PI*3))+') scale(.75)'}><Subject kind="helicopter" p={p}/><g transform={'rotate('+(e*690)+')'}><L x={-270} y={-155} X={270} Y={-155} c={K.paper} sw={12}/></g></g><Person x={490} y={725} s={.6} role="child" pose="stand" p={p}/></g>;
 case'display-overparenting-studies':return <g><MovingText x={425} y={300} txt="53研究" p={e} c={K.gold}/><Text x={425} y={380} t="関連を検討" s={34}/></g>;
 case'three-needs-balance':return <g>{['自律性','有能感','関係性'].map((t,i)=><g key={t} transform={'translate('+(230+i*215)+' '+(315+i%2*75)+')'}><circle cx={0} cy={0} r={100+15*e} fill={[K.teal,K.gold,K.blue][i]} opacity={.83}/><Text x={0} y={15} t={t} s={34} c={K.ink}/></g>)}</g>;
 case'wife-cleans-shops-pays':return <g>{[0,1,2].map(i=><g key={i} transform={'translate('+(215+i*205)+' '+(330+(i%2)*185)+') scale(.48)'}><Subject kind={['dishes','schoolbag','bill'][i]} p={q((e-i*.15)*1.8)}/></g>)}</g>;
 case'housework-seventy-seven-share':return <g><MovingText x={430} y={320} txt="妻 77.4%" p={e} c={K.gold}/><Text x={430} y={380} t="2021年／6歳未満・共働き" s={29}/><R x={230} y={500} w={570} h={65} c={K.paper} o={.25}/><R x={230} y={500} w={441.18*e} h={65} c={K.gold}/></g>;
 case'oecd-young-adult-living-arrangements':return <g><Text x={410} y={315} t="OECD 2024" s={58} c={K.gold}/><Text x={410} y={400} t="20代のおよそ半数" s={44}/><Text x={410} y={455} t="親と同居" s={42}/></g>;
 case'father-comforts-fallen-boy':return <g><Person x={430} y={480} role="modern" pose="point" s={.76} p={p}/><Person x={640} y={650+lerp(40,-35,e)} role="child" s={.58} p={p} pose="rise"/></g>;
 case'speech-bubble-breaks-apart':return <g>{[0,1,2].map(i=><g key={i} transform={'translate('+(220+i*170+e*50*(i-1))+' '+(330+i*93+e*45*(i-1))+') rotate('+(e*11*(i-1))+')'}><R x={-65} y={-47} w={143} h={75} rx={30} c={[K.blue,K.gold,K.teal][i]}/><Text x={9} y={0} t="…" s={45} c={K.ink}/></g>)}</g>;
 case'masculinity-meta-analysis-studies':return <g><Text x={480} y={320} t="78研究" s={66} c={K.gold}/><Text x={480} y={405} t="19,453人" s={62}/><R x={250} y={490} w={460*e} h={12} c={K.teal}/></g>;
 case'worker-hoards-documents':return <g><Person x={390} y={445} s={.76} role="worker" pose="carry" p={p}/>{[0,1,2,3].map(i=><R key={i} x={250+i*90} y={lerp(740,550-i*70,e)} w={160} h={26} c={i%2?K.gold:K.paper}/>)}</g>;
 case'colleagues-split-work':return <g><Person x={285} y={470} s={.68} role="worker" pose="carry" p={p}/><Person x={715} y={470} s={.68} role="modern" pose="carry" p={p}/><Arrow x={350} y={720} X={650} Y={720} p={e}/></g>;
 case'epilogue-man-sets-down-controller':return <g><Person x={520} y={450} role="modern" pose="sit" s={.72} p={p}/><g transform={'translate(680 '+lerp(360,705,e)+') scale(.52)'}><Subject kind="gamepad" p={p}/></g></g>;
 case'epilogue-wash-and-schedule':return <g><g transform="translate(390 550) scale(.58)"><Subject kind="dishes" p={p}/></g>{[0,1,2,3,4].map(i=><circle key={i} cx={260+i*78} cy={410+i%2*49+60*e} r={13+i%3*4} fill={K.blue} opacity={1-.75*e}/>)}<g transform="translate(725 485) scale(.45)"><Subject kind="calendar" p={p}/></g></g>;
 case'epilogue-listen-without-interrupting':return <g><Person x={370} y={490} s={.76} role="teacher" pose="point" p={p}/><Person x={760} y={500} s={.73} role="modern" pose="read" p={p}/><L x={485} y={300} X={675} Y={300} c={K.teal} sw={10} p={e}/></g>;
 case'epilogue-man-walks-into-morning':return <g><Person x={lerp(330,665,e)} y={560} role="modern" s={.78} pose="walk" p={p}/><Arrow x={720} y={730} X={1050} Y={730} p={e} c={K.gold}/></g>;
 default:return null;
 }
};
const stageActor=(b:MatureBeat,p:number)=>{
 if(['research','data','document','theory','symbolic','silhouette','emotion','metaphor','mosaic','balance','scale','timeline','causality','diagram','history'].includes(b.family))return null;
 if(['classroom','nursery','school','park'].includes(b.family))return <Person x={430} y={495} s={.71} role="child" p={p} pose="stand"/>;
 if(['home','household','kitchen','planning','relationship','dialogue','argument','nightroom'].includes(b.family))return <g><Person x={330} y={480} s={.65} role="modern" pose="read" p={p}/>{['relationship','dialogue','argument','household'].includes(b.family)&&<Person x={570} y={490} s={.64} role="teacher" pose="point" p={p}/>}</g>;
 if(['commute','street','city','architecture','finale','transition'].includes(b.family))return <Person x={475} y={520} s={.67} role="modern" pose="walk" p={p}/>;
 return <Person x={360} y={485} s={.7} role={b.phase==='03-social-roles'?'worker':'modern'} pose="point" p={p}/>;
};
const topLabel=(b:MatureBeat,n:number)=> <g opacity={.73}><R x={62} y={45} w={16} h={57} c={K.red}/><Text x={95} y={88} t={familyTitle(b.phase)} s={27} anchor="start"/><Text x={1790} y={88} t={String(n).padStart(3,'0')} s={24} c={K.gold}/></g>;
export const ExtendedScene=({n,progress}:{n:number;progress:number})=>{
 if(!(n>=25&&n<=data.length))throw Error('V105 extended original scene outside range '+n);
 const b=data[n-1];if(!b||!supportedFamilies.has(b.family)||!supportedObjects.has(b.primary)||!verbs.has(b.verb))
  throw Error('V105 missing authored scene object/family/verb '+n+' '+b?.action);
 const p=q(progress),e=easing(p),m=motionTransform(b.verb,e,n),h=heroPosition(b);
 return <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,overflow:'hidden'}}><g data-scene={b.sceneKey} data-original-action={b.actionId} data-family={b.family} data-setting={b.environment}>
   <Backdrop family={b.family} environment={b.environment} p={p}/>
   {stageActor(b,p)}
   <Accent b={b} p={p}/>
   <g transform={'translate('+(h.x+m.dx)+' '+(h.y+m.dy)+') rotate('+m.rot+') scale('+(h.scale*m.scale)+')'}><Subject kind={b.primary} p={p}/></g>
   <Detail b={b} p={p}/>
   {topLabel(b,n)}
  </g></svg>;
};
