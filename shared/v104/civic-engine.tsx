import React from 'react';
import {C,R,L,P,Ring,Person,Vehicle,Paper,Coin,House,Hospital,Factory,q,lerp} from './primitives';
import {Backdrop} from './civic-backgrounds';
import {CivicProp,CivicPerson,TXT,ease} from './civic-art';

export type V104Beat={id:string;phase:string;variant:number;narration:string;family:string;actionId:string;action:string;environment:string;primary:string;verb:string;bgGroup:string;sceneKey:string;visual:string;shotKind:string};
export const AllCivicFamilies='archive cinematic comparison corporate courtroom crowd data debate diagram document election historical history human interaction macro manuscript map meeting montage parliament philosophy question receipt-macro research scholar simulation split symbolic tax-flow timeline tracking transition'.split(' ');
export const AllCivicVerbs='advance affirm align analyze arrange arrive assign balance board branch calculate check close compare connect continue contrast converge count debate decline distribute divide drop enter equalize examine flow fluctuate fold grow hand handover highlight hold illuminate multiply open operate oscillate overlap overlay pass pay prepare present propagate queue radiate read receive reveal rewind rewrite rotate seal separate slide speak split stabilize stack stamp stop transform travel turn uncover unfold unroll update vanish walk wash watch weigh write'.split(' ');
const moving=new Set('advance arrive board continue enter pass queue travel walk'.split(' '));
const paperAction=new Set('affirm check close fold hand handover highlight open prepare read receive rewrite seal stamp turn unfold unroll update write'.split(' '));
const network=new Set('assign branch connect converge distribute flow overlap propagate radiate'.split(' '));
const compare=new Set('align balance compare contrast divide equalize oscillate separate split stabilize weigh'.split(' '));
const process=new Set('analyze calculate count decline examine fluctuate grow illuminate multiply operate pay present reveal slide transform uncover vanish'.split(' '));
const staticPose=(v:string):'stand'|'sit'|'walk'|'point'|'read'|'write'|'carry'|'hold'=> moving.has(v)?'walk':v==='read'||v==='check'||v==='watch'?'read':v==='write'||v==='rewrite'||v==='calculate'?'write':v==='speak'||v==='present'||v==='debate'?'point':v==='hand'||v==='receive'||v==='handover'?'carry':'stand';
const accent=(phase:string)=>phase==='history'?C.gold:phase==='plural_vote'?C.blue2:phase==='state_company'?C.teal:phase==='contribution'?C.orange:phase==='epilogue'?C.gold:C.red;
const primaryIsHuman=(s:string)=>['executive','worker','senior','mother','caregiver','nurse','professor','scholar','landowner','crowd'].includes(s);
const actorFor=(b:V104Beat)=>primaryIsHuman(b.primary)?b.primary:/senior|elder|pension/.test(b.action)?'senior':/worker|factory|labor|labour|supermarket/.test(b.action)?'worker':/caregiver|care-|mother|women|female/.test(b.action)?'caregiver':/nurse|hospital|medical/.test(b.action)?'nurse':/professor|mill-|scholar|university/.test(b.action)?'professor':/landowner|property|victorian/.test(b.action)?'landowner':'executive';
const targetFor=(b:V104Beat)=>/tax|income|money|fee|revenue/.test(b.action)?'taxcoin':/poll|vote|ballot|franchise|voter/.test(b.action)?'ballot':/doctor|care|medical|nurse/.test(b.action)?'hospital':/company|stock|share/.test(b.action)?'sharecert':/law|constitution|court|judgment/.test(b.action)?'constitution':/worker|factory/.test(b.action)?'factory':/senior|household|family/.test(b.action)?'house':'ledger';
const periodLabel=(phase:string)=>phase==='history'?'選挙制度の歴史':phase==='plural_vote'?'複数投票と平等':phase==='state_company'?'国家と株式会社':phase==='contribution'?'納税と社会参加':phase==='epilogue'?'結論':'プロローグ';
const yearOf=(b:V104Beat)=>{
 const t=b.narration;
 const year=t.match(/一八九〇|一八三二|一八四八|一七九一|一九二五|一九二八|一九四五|一九四六|一九四八|一九六四|一九六六|一八六一/);
 return year?year[0]:b.phase==='history'?'1890–1946':b.phase==='plural_vote'?'1861–1966':'';
};
const Hero=({kind,x,y,s=1,p=0,dx=0,dy=0,rotate=0}:{kind:string;x:number;y:number;s?:number;p?:number;dx?:number;dy?:number;rotate?:number})=><g transform={'translate('+(x+dx)+' '+(y+dy)+') rotate('+rotate+') scale('+s+')'}><CivicProp kind={kind} p={p}/></g>;
const Motion=({b,p,x=960,y=510}:{b:V104Beat;p:number;x?:number;y?:number})=>{
 const e=ease(p),v=b.verb,c=accent(b.phase),a=b.action;
 if(!AllCivicVerbs.includes(v))throw Error('Missing physical animation for V104 '+b.id+' '+v);
 return <g data-unique-action={b.actionId}>
 {moving.has(v)&&<g><path d={'M'+(x-335)+' '+(y+215)+' Q'+x+' '+(y+285)+' '+(x+335)+' '+(y+215)} fill="none" stroke={c} strokeWidth={9} strokeDasharray="28 22" opacity={.5}/><circle cx={lerp(x-310,x+300,e)} cy={y+236-23*Math.sin(e*Math.PI)} r={22} fill={c}/></g>}
 {paperAction.has(v)&&<g><g transform={'translate('+(x-260+300*e)+' '+(y-175+190*e)+') rotate('+lerp(-24,18,e)+')'}><R x={-11} y={-120} w={22} h={220} rx={7} c="#4c5960"/><P d="M-11 105 L0 146 L11 105Z" c={C.gold}/></g><path d={'M'+(x-150)+' '+(y+90)+' Q'+(x-20)+' '+(y+125)+' '+(x+168*e)+' '+(y+90)} fill="none" stroke={v==='stamp'||v==='seal'?C.red:C.ink} strokeWidth={v==='stamp'?18:7} strokeDasharray="1300" strokeDashoffset={1300*(1-e)}/></g>}
 {network.has(v)&&<g>{[0,1,2].map((i)=><g key={i}><path d={'M'+(x-380)+' '+(y-220+i*205)+' Q'+(x-40+i*75)+' '+(y-300+i*130)+' '+(x+340)+' '+(y-135+i*135)} fill="none" stroke={i%2?c:C.teal} strokeWidth={8} strokeDasharray="1300" strokeDashoffset={1300*(1-e)}/><circle cx={lerp(x-380,x+340,e)} cy={lerp(y-220+i*205,y-135+i*135,e)} r={13+i*4} fill={i%2?c:C.gold}/></g>)}</g>}
 {compare.has(v)&&<g><L x={x} y={y-300} X={x} Y={y+320} c={c} sw={6} o={.36}/><g transform={'rotate('+lerp(-10,12,e)+' '+x+' '+y+')'}><L x={x-320} y={y+250} X={x+320} Y={y+250} c={c} sw={12}/></g>{[0,1,2].map(i=><circle key={i} cx={x} cy={y} r={lerp(18,95+i*64,e)} fill="none" stroke={i%2?C.teal:c} strokeWidth={7} opacity={.55-.36*e}/>)}</g>}
 {process.has(v)&&<g><Ring x={x} y={y} p={e} r={290} c={c}/><L x={x-240} y={y+224} X={x-240+480*e} Y={y+224} c={c} sw={14} o={.73}/>{v==='multiply'&&Array.from({length:8},(_,i)=><R key={i} x={x-350+(i%4)*188} y={y-230+Math.floor(i/4)*160} w={120} h={18} c={i%2?C.teal:C.gold} o={q((e-i*.05)*2)}/>)}</g>}
 {v==='drop'&&<g><Hero kind="ballot" x={x} y={lerp(y-410,y-30,e)} s={.34} p={e} rotate={lerp(-17,0,e)}/><R x={x-92} y={y+105} w={188} h={11} rx={6} c={C.ink}/></g>}
 {v==='wash'&&<g>{Array.from({length:9},(_,i)=><circle key={i} cx={x-210+i*55} cy={y-160+i%3*43+e*150} r={8+i%3*3} fill={C.sky} opacity={1-.8*e}/>)}</g>}
 {v==='watch'&&<g><Ring x={x+120} y={y-130} p={e} c={c}/><L x={x+120} y={y-130} X={x+300} Y={y-220} c={c} sw={7} p={e}/></g>}
 {v==='stop'&&<g><L x={x-260} y={y-245} X={x+265} Y={y+220} c={C.red} sw={20} p={e}/><L x={x+260} y={y-245} X={x-265} Y={y+220} c={C.red} sw={20} p={e}/></g>}
 {v==='rotate'&&<g transform={'rotate('+(e*300)+' '+x+' '+y+')'}><circle cx={x} cy={y} r={155} fill="none" stroke={c} strokeWidth={8} strokeDasharray="32 18"/></g>}
 {v==='speak'&&[0,1,2].map(i=><path key={i} d={'M'+(x+120+i*55)+' '+(y-120)+' Q'+(x+290+i*65)+' '+(y-180)+' '+(x+350+i*45)+' '+(y-70)} fill="none" stroke={c} strokeWidth={7} opacity={q((e-i*.16)*2)*.72}/>)}
 {v==='overlay'&&<g><R x={x-260} y={y-200} w={520} h={410} c={C.blue} o={.16*e}/><R x={x-130} y={y-130} w={520} h={410} c={C.gold} o={.14*e}/></g>}
 {v==='seal'&&<g opacity={q((e-.5)*2)}><R x={x-130} y={y+85} w={260} h={120} rx={10} c={C.red} o={.8}/><TXT x={x} y={y+162} t="確認" size={51} c={C.paper}/></g>}
 {v==='stamp'&&<g opacity={q((e-.5)*2)}><circle cx={x} cy={y+135} r={125} fill="none" stroke={C.red} strokeWidth={15}/><TXT x={x} y={y+153} t="改正" size={58} c={C.red}/></g>}
 {v==='pay'&&Array.from({length:4},(_,i)=><Coin key={i} x={lerp(x-265,x+210,e)+i*36} y={y+160-i*30} p={e} r={28}/>)}
 {v==='grow'&&<g>{[0,1,2].map(i=><R key={i} x={x-260+i*195} y={y+190-(i+1)*115*e} w={126} h={(i+1)*115*e} c={i%2?C.teal:c}/>)}</g>}
 {/poll|ballot/.test(a)&&v!=='drop'&&v!=='hand'&&v!=='count'&&<g opacity={.55*e}><Hero kind="ballot" x={x+315} y={y-235} s={.23} p={e}/></g>}
 {/nurse|care|hospital/.test(a)&&<g opacity={.38*e}><P d={'M'+(x-280)+' '+(y-280)+' H'+(x-240)+' V'+(y-320)+' H'+(x-180)+' V'+(y-280)+' H'+(x-140)+' V'+(y-220)+' H'+(x-180)+' V'+(y-180)+' H'+(x-240)+' V'+(y-220)+' H'+(x-280)+'Z'} c={C.teal}/></g>}
 {/tax/.test(a)&&!process.has(v)&&<g opacity={.46*e}><Hero kind="taxcoin" x={x-330} y={y+185} s={.29} p={e}/></g>}
 </g>;
};
const FrameText=({b,small=false}:{b:V104Beat;small?:boolean})=><g opacity={small?.52:.7}><R x={70} y={62} w={20} h={62} c={accent(b.phase)}/><TXT x={108} y={106} t={periodLabel(b.phase)} size={30} c={C.cream} anchor="start"/></g>;
const stage=(b:V104Beat,p:number,mode:'wide'|'detail'|'human'|'gather'='wide')=>{
 const who=actorFor(b),v=b.verb,e=ease(p),isHuman=primaryIsHuman(b.primary),x=mode==='detail'?940:mode==='human'?1115:1160,y=mode==='detail'?495:mode==='human'?470:505;
 const mainScale=mode==='detail'?1.19:mode==='human'?1.0:isHuman?.83:1;
 return <g><Backdrop environment={b.environment} p={p}/>
  {mode!=='detail'&&<g transform={'translate('+(mode==='gather'?260:300+(b.variant%3)*75)+' '+(mode==='human'?490:535)+') scale('+(mode==='gather'?.59:.66)+')'}><CivicPerson kind={who} pose={staticPose(v)} p={p}/></g>}
  {mode==='gather'&&[0,1,2].map(i=><g key={i} transform={'translate('+(520+i*300)+' '+(540+(i%2)*70)+') scale(.38)'}><CivicPerson kind={i===1?'worker':i===2?'senior':'executive'} pose={staticPose(v)} p={q(p-i*.06)}/></g>)}
  <Hero kind={b.primary} x={x} y={y} s={mainScale} p={p} dx={moving.has(v)?lerp(-185,0,e):0} dy={v==='drop'?lerp(-120,100,e):0} rotate={v==='turn'?lerp(-9,12,e):0}/>
  <Motion b={b} p={p} x={x} y={y}/><FrameText b={b}/>
 </g>;
};
const splitScreen=(b:V104Beat,p:number,comparisonMode=false)=>{
 const a=actorFor(b),left=targetFor(b),right=b.primary;
 return <g><R x={0} y={0} w={960} h={1080} c={comparisonMode?'#5a6971':'#50646b'}/><R x={960} y={0} w={960} h={1080} c={comparisonMode?'#77685a':'#868478'}/>
  <L x={960} y={0} X={960} Y={1080} c={C.paper} sw={17}/>
  {comparisonMode&&<g><R x={100} y={120} w={760} h={125} c={C.slate} o={.58}/><R x={1060} y={120} w={760} h={125} c={C.wood} o={.6}/></g>}
  <Hero kind={left} x={465} y={505} s={left==='taxcoin'?.85:1.07} p={p} dx={lerp(-60,15,p)}/>
  <Hero kind={right} x={1455} y={495} s={primaryIsHuman(right)?.84:1.02} p={p} dx={lerp(70,-15,p)}/>
  <g transform="translate(700 765) scale(.42)"><CivicPerson kind={a} p={p} pose={staticPose(b.verb)}/></g>
  <Motion b={b} p={p} x={960} y={500}/><FrameText b={b}/>
 </g>;
};
const documentStage=(b:V104Beat,p:number,mode:'paper'|'archive'|'manuscript'|'macro'|'receipt')=>{
 const d=mode==='manuscript'?'#624e41':mode==='archive'?'#4b5357':mode==='receipt'?'#5a625f':'#6a5b4e',e=ease(p);
 return <g><R x={0} y={0} w={1920} h={1080} c={d}/><R x={110} y={125} w={1700} h={790} rx={20} c={mode==='archive'?'#726a5c':'#846c54'}/>
  {mode==='archive'&&[0,1,2].map(i=><R key={i} x={185+i*605} y={150+(i%2)*45} w={480} h={700} c={i%2?'#a38b70':'#bbac92'}/>)}
  {mode==='manuscript'&&<g><R x={145} y={185} w={490} h={640} c="#a38a6b"/><R x={1275} y={150} w={490} h={680} c="#b59c79"/></g>}
  <Hero kind={b.primary} x={920} y={mode==='macro'?470:520} s={mode==='macro'?1.66:mode==='receipt'?1.52:1.26} p={p} rotate={lerp(-9,5,p)}/>
  <g opacity={mode==='macro'?.15:.54} transform="translate(1450 560) scale(.53)"><CivicProp kind={targetFor(b)} p={1-p}/></g>
  <Motion b={b} p={p} x={940} y={520}/>
  {mode==='manuscript'&&<L x={420} y={770} X={lerp(420,1470,e)} Y={770} c={C.gold} sw={9}/>}
  <FrameText b={b}/>
 </g>;
};
const researchStage=(b:V104Beat,p:number)=> <g><Backdrop environment={b.environment} p={p}/>
 <R x={160} y={160} w={900} h={560} rx={16} c="#d1c6af"/>
 <g transform="translate(170 160) scale(.82)"><CivicProp kind={b.primary==='bargraph'?'bargraph':b.primary==='exam'?'exam':'ledger'} p={p}/></g>
 <Hero kind={b.primary} x={1290} y={495} s={.95} p={p}/>
 <g transform="translate(490 470) scale(.55)"><CivicPerson kind="professor" pose="point" p={p}/></g>
 <Motion b={b} p={p} x={1250} y={525}/><FrameText b={b}/></g>;
const timeline=(b:V104Beat,p:number)=> <g><R x={0} y={0} w={1920} h={1080} c="#23323d"/><L x={150} y={575} X={1765} Y={575} c={C.steel} sw={13} p={p}/>
 {['1791','1832','1848','1890','1925','1928','1946','1948','1966'].map((y,i)=><g key={y}><circle cx={210+i*189} cy={575} r={20} fill={i%2?C.teal:C.gold}/>{i<8&&<L x={210+i*189} y={545} X={210+i*189} Y={390+(i%2)*165} c={C.paper} sw={3}/>}<TXT x={210+i*189} y={360+(i%2)*168} t={y} size={32} c={i===6?C.gold:C.paper} opacity={q((p-i*.065)*2)}/></g>)}
 <Hero kind={b.primary} x={1060} y={800} s={.57} p={p}/>
 <Motion b={b} p={p} x={1000} y={560}/><FrameText b={b}/></g>;
const mapStage=(b:V104Beat,p:number)=><g><R x={0} y={0} w={1920} h={1080} c="#b7b09d"/><Hero kind="map" x={970} y={525} s={2.7} p={p}/>
 {Array.from({length:8},(_,i)=><circle key={i} cx={390+i*160} cy={350+(i%3)*120} r={18} fill={i%2?C.gold:C.red} opacity={q(p-i*.075)}/>)}
 <Motion b={b} p={p}/><FrameText b={b}/></g>;
const diagramStage=(b:V104Beat,p:number,mode:'diagram'|'data'|'tax-flow')=><g><R x={0} y={0} w={1920} h={1080} c={mode==='data'?'#203139':'#172935'}/>
 {mode==='data'?<g><L x={245} y={820} X={1750} Y={820} c={C.paper} sw={11}/>{[180,540,130,680,345,620].map((h,i)=><R key={i} x={260+i*250} y={820-h*q(p+.1)} w={170} h={h*q(p+.1)} c={i%2?C.gold:C.teal}/>)}</g>:
 mode==='tax-flow'?<g>{[0,1,2].map(i=><g key={i}><circle cx={400+i*565} cy={465} r={155} fill={i%2?C.gold:C.teal}/><Hero kind={i===0?'receipt':i===1?'sharecert':'parliament'} x={400+i*565} y={465} s={.46} p={p}/>{i<2&&<L x={550+i*565} y={465} X={825+i*565} Y={465} c={C.paper} sw={13} p={p}/>}</g>)}</g>:
 <g>{[0,1,2,3].map(i=><g key={i}><R x={185+i*390} y={190+(i%2)*90} w={290} h={280} rx={22} c={i%2?'#3d6670':'#655f57'}/><Hero kind={i===0?targetFor(b):i===1?'taxcoin':i===2?b.primary:'ballot'} x={330+i*390} y={340+(i%2)*90} s={.52} p={p}/>{i<3&&<L x={330+i*390} y={480+(i%2)*90} X={560+i*390} Y={620} c={C.gold} sw={8} p={p}/>}</g>)}</g>}
 <Motion b={b} p={p} x={mode==='tax-flow'?950:1000} y={625}/><FrameText b={b}/></g>;
const philosophyStage=(b:V104Beat,p:number,mode:'symbolic'|'philosophy'|'question')=><g><R x={0} y={0} w={1920} h={1080} c={mode==='question'?'#0b1824':mode==='philosophy'?'#152735':'#1f313b'}/>
 <g opacity={.4}>{[0,1,2,3].map(i=><circle key={i} cx={300+i*420} cy={160+(i%2)*130} r={70+i*19} fill="none" stroke={i%2?C.teal:C.gold} strokeWidth={8}/>)}</g>
 <Hero kind={b.primary} x={980} y={490} s={mode==='question'?1.22:1.1} p={p}/>
 {mode==='question'&&<TXT x={1460} y={645} t="?" size={280} c={C.gold} opacity={q(p*2)}/>}
 {mode==='philosophy'&&<g><L x={400} y={880} X={1520} Y={880} c={C.gold} sw={9}/>{Array.from({length:5},(_,i)=><circle key={i} cx={490+i*220} cy={880} r={42} fill={i%2?C.teal:C.gold}/>)}</g>}
 <Motion b={b} p={p}/><FrameText b={b}/></g>;
const simulationStage=(b:V104Beat,p:number)=> <g><R x={0} y={0} w={1920} h={1080} c="#293b48"/>
 <R x={100} y={105} w={750} h={805} rx={25} c="#546a70"/><R x={1070} y={105} w={750} h={805} rx={25} c="#6a5f58"/>
 <TXT x={470} y={230} t="納税額 100万円" size={46}/><TXT x={1440} y={230} t="納税額 10万円" size={46}/>
 {Array.from({length:10},(_,i)=><g key={i} opacity={q((p-i*.055)*2)}><Hero kind="ballot" x={260+(i%5)*125} y={380+Math.floor(i/5)*270} s={.27} p={p}/></g>)}
 <Hero kind="ballot" x={1430} y={520} s={.9} p={p}/>
 <Motion b={b} p={p} x={960} y={600}/><FrameText b={b}/></g>;
const montageStage=(b:V104Beat,p:number)=> <g><R x={0} y={0} w={1920} h={1080} c="#182c35"/>
 {['nurse','caregiver','executive'].map((who,i)=><g key={who}><R x={45+i*630} y={105} w={585} h={790} rx={26} c={i===0?'#698486':i===1?'#8d8071':'#637584'}/><g transform={'translate('+(337+i*630)+' '+540+') scale(.82)'}><CivicPerson kind={who} p={q(p-i*.12)} pose={i===1?'carry':i===0?'read':'write'}/></g><R x={130+i*630} y={680} w={420} h={60} c={i===0?'#d3dfde':i===1?'#bda98d':'#a6b8c0'}/></g>)}
 <Motion b={b} p={p}/><FrameText b={b}/></g>;
export const V104Visual=({beat,progress}:{beat:V104Beat;progress:number})=>{
 const b=beat,p=q(progress);
 if(!AllCivicFamilies.includes(b.family))throw Error('V104 has no authored visual family '+b.family);
 if(!AllCivicVerbs.includes(b.verb))throw Error('V104 missing dedicated action motion '+b.id);
 switch(b.family){
 case'cinematic':case'historical':case'election':case'interaction':return stage(b,p,'wide');
 case'human':return stage(b,p,'human');
 case'tracking':return stage(b,p,'wide');
 case'crowd':case'meeting':case'debate':return stage(b,p,'gather');
 case'corporate':case'parliament':case'courtroom':case'scholar':return stage(b,p,'wide');
 case'research':return researchStage(b,p);
 case'document':return documentStage(b,p,'paper');
 case'archive':case'history':return documentStage(b,p,'archive');
 case'manuscript':return documentStage(b,p,'manuscript');
 case'macro':return documentStage(b,p,'macro');
 case'receipt-macro':return documentStage(b,p,'receipt');
 case'split':return splitScreen(b,p);
 case'comparison':return splitScreen(b,p,true);
 case'timeline':return timeline(b,p);
 case'map':return mapStage(b,p);
 case'diagram':return diagramStage(b,p,'diagram');
 case'data':return diagramStage(b,p,'data');
 case'tax-flow':return diagramStage(b,p,'tax-flow');
 case'symbolic':return philosophyStage(b,p,'symbolic');
 case'philosophy':return philosophyStage(b,p,'philosophy');
 case'question':return philosophyStage(b,p,'question');
 case'simulation':return simulationStage(b,p);
 case'montage':return montageStage(b,p);
 case'transition':return <g><R x={0} y={0} w={1920} h={1080} c="#253742"/><Hero kind={targetFor(b)} x={550} y={500} s={1.05} p={1-p} dx={lerp(0,-250,p)}/><Hero kind={b.primary} x={1340} y={520} s={1.1} p={p} dx={lerp(280,0,p)}/><L x={760} y={510} X={1200} Y={510} c={accent(b.phase)} sw={14} p={p}/><Motion b={b} p={p}/><FrameText b={b}/></g>;
 default:throw Error('No V104 scene renderer '+b.family);
 }
};
