import React from 'react';
import {C,R,L,P,Person,Vehicle,Paper,House,Hospital,School,Factory,q,lerp} from './primitives';

const stone='#a59a89',brick='#80685c',wood='#76634f',pale='#e7dac1',sky='#a5bdc4',night='#202f3c',floor='#786c61',gold='#d2af70';
const hash=(v:string)=>[...v].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,116);
const CourtSeats=({green=false}:{green?:boolean})=><g>{Array.from({length:4},(_,i)=><g key={i}><R x={85+i*440} y={500+(i%2)*62} w={360} h={130} c={green?'#42604d':'#86684e'}/><R x={85+i*440} y={680+(i%2)*62} w={360} h={92} c={green?'#2f5142':'#725441'}/></g>)}</g>;
const Building=({x,y,w=360,h=520,colour=stone,era='modern',windows=4}:{x:number;y:number;w?:number;h?:number;colour?:string;era?:'modern'|'old';windows?:number})=><g><R x={x} y={y} w={w} h={h} c={colour}/>{Array.from({length:windows},(_,i)=><R key={i} x={x+32+(i%3)*((w-96)/3)} y={y+62+Math.floor(i/3)*140} w={(w-145)/3} h={era==='old'?115:105} c={era==='old'?'#5a6267':'#adc2c9'} stroke={era==='old'?'#c4af92':'#d8d6c7'} sw={9}/>)}{era==='old'&&<P d={'M'+(x-18)+' '+y+' L'+(x+w/2)+' '+(y-95)+' L'+(x+w+18)+' '+y+'Z'} c="#645349"/>}</g>;
const Desk=({x,y,w=750,c=wood}:{x:number;y:number;w?:number;c?:string})=><g><R x={x} y={y} w={w} h={75} rx={9} c={c}/><R x={x+70} y={y+72} w={25} h={260} c={c}/><R x={x+w-90} y={y+72} w={25} h={260} c={c}/></g>;
export const Backdrop=({environment,p=0}:{environment:string;p?:number})=>{
 const s=environment.toLowerCase(),h=hash(s),shift=(h%4)*37,variant=h%5;
 const modern=/school|poll|election|worker|grocery|senior|family|modern|university|hospital|office|business|shareholder|station|labor|research|commuter|knowledge|stock|company|time-budget|contribution|care|career|tax|electoral/.test(s);
 const meiji=/meiji|1890|rickshaw/.test(s),victorian=/victorian|britain|mill|1830/.test(s),oldJapan=/taisho|1928|1946|historic|reform/.test(s);
 const historical=meiji||victorian||oldJapan||/french|1791|1948|virginia|1960|supreme|mill-study|manuscript/.test(s);
 const canvas=/diagram|symbolic|abstract|thesis|question|impact|compared|axes|flow|feedback|scales|criterion|criteria|scenario|simulation|transition|mapping|equal|ability|volatility|boundary|overlap|tax-vote|vote-weight|citizen|definition|franchise-venn|philosophy|comparison|corridor|two-eras|education-versus|montage|branches|calendar|wheel|independent|panels|valuation|district-map|history-bridge|state-corporation|budget-election|ballot-ending|split/.test(s);
 if(canvas)return <g data-environment={environment}>
   <R x={0} y={0} w={1920} h={1080} c={variant%2?'#172735':'#223746'}/>
   <R x={80+shift} y={65} w={1760-shift*1.5} h={930} rx={32} c={variant%2?'#263c46':'#2d414c'} o={.78}/>
   {Array.from({length:5},(_,i)=><g key={i}><L x={105+i*320} y={90} X={105+i*320} Y={975} c={i%2?'#6d8d8a':'#786c67'} sw={2} o={.21}/><L x={135} y={170+i*155} X={1770} Y={170+i*155} c="#a2aba5" sw={2} o={.11}/></g>)}
   <circle cx={1550-shift} cy={250} r={160} fill="none" stroke={variant%2?'#c4a070':'#82a39d'} strokeWidth={7} opacity={.15}/></g>;
 if(/school-gate|poll-gate|street|rickshaw|town|city|voting-evolution|station-election/.test(s)&&!/study|office|desk|historical-register/.test(s))
 return <g data-environment={environment}>
  <R x={0} y={0} w={1920} h={1080} c={historical?'#a9a18c':sky}/><R x={0} y={770} w={1920} h={310} c={historical?'#8c7965':'#788886'}/>
  {Array.from({length:4},(_,i)=><Building key={i} x={-60+i*505+(variant%2)*95} y={210+(i%2)*105} w={425} h={565} colour={historical?['#938575','#ac9980','#8e806e'][i%3]:['#a8b4b0','#94a8ac','#bcb6a9'][i%3]} era={historical?'old':'modern'} windows={6}/>)}
  {modern&&<g><R x={1370} y={580} w={420} h={55} c="#6a8790"/><R x={1550} y={625} w={24} h={160} c="#768b87"/></g>}
  {meiji&&<Vehicle x={400} y={895} p={p} kind="wagon"/>}
  {oldJapan&&<g><Person x={330} y={540} s={.48} p={p} pose="walk" role="worker"/><Person x={1490} y={545} s={.44} p={p} pose="walk" role="teacher"/></g>}
  {modern&&<Vehicle x={650} y={905} p={p} kind="car"/>}
 </g>;
 if(/cotton|factory|working-class|britain-mill/.test(s))return <g data-environment={environment}>
  <R x={0} y={0} w={1920} h={1080} c="#96a3a0"/><R x={0} y={805} w={1920} h={275} c="#665e57"/>
  <Building x={120} y={240} w={700} h={570} colour="#80695d" era="old" windows={6}/>
  <Building x={1070} y={170} w={680} h={640} colour="#716763" era="old" windows={6}/>
  <R x={635} y={-90} w={105} h={430} c="#615953"/><R x={1400} y={-140} w={110} h={430} c="#625e58"/>
  {Array.from({length:4},(_,i)=><ellipse key={i} cx={610+i*180} cy={120+i*24-p*21} rx={145} ry={48} fill="#c1c2b6" opacity={.2+(i*.09)}/> )}
  {variant%2===0&&<Factory x={790} y={515} s={.68}/>}
 </g>;
 if(/french|assembly|revolution/.test(s))return <g data-environment={environment}>
  <R x={0} y={0} w={1920} h={1080} c="#736f66"/><R x={0} y={760} w={1920} h={320} c="#62564c"/>
  {Array.from({length:7},(_,i)=><g key={i}><R x={100+i*265} y={110} w={78} h={655} c="#bcb19d"/><R x={80+i*265} y={90} w={116} h={38} c="#e3ccaa"/></g>)}
  <P d="M125 350 Q960 -100 1795 350 V420 H125Z" c="#c4ae89" o={.65}/>
  <Desk x={560} y={680} w={800} c="#705044"/>
  {variant%2===0&&<P d="M770 175 L1000 175 L915 560 L690 550Z" c="#8e5156"/>}
 </g>;
 if(/commons|parliament|debate-1948|uk-parliament/.test(s))return <g data-environment={environment}>
  <R x={0} y={0} w={1920} h={1080} c="#374c3d"/><R x={0} y={785} w={1920} h={295} c="#415041"/>
  <CourtSeats green/><R x={800} y={540} w={320} h={160} c="#86664a"/><R x={925} y={390} w={90} h={200} c="#a48b65"/>
  {Array.from({length:4},(_,i)=><Person key={i} x={245+i*470} y={545+(i%2)*120} s={.34} p={p} pose="sit" role="diplomat"/>)}
 </g>;
 if(/court|supreme|judgment|tribunal/.test(s))return <g data-environment={environment}>
  <R x={0} y={0} w={1920} h={1080} c="#6c6970"/><R x={0} y={730} w={1920} h={350} c="#8a817b"/>
  {Array.from({length:6},(_,i)=><g key={i}><R x={105+i*325} y={100} w={90} h={660} c="#c8c0b2"/><R x={80+i*325} y={80} w={142} h={36} c="#e0d7c4"/></g>)}
  <Desk x={560} y={570} w={850} c="#775943"/><R x={830} y={330} w={280} h={255} c="#654e49"/>
 </g>;
 if(/university|campus|college|graduate|victorian-two-classrooms/.test(s))return <g data-environment={environment}>
  <R x={0} y={0} w={1920} h={1080} c="#a6b0a8"/><R x={0} y={785} w={1920} h={295} c="#918574"/>
  <Building x={140} y={210} w={1550} h={580} colour="#968671" era="old" windows={8}/>
  <R x={220} y={560} w={490} h={180} c="#b4a18a"/><R x={1340} y={560} w={220} h={180} c="#6a6e6c"/>
  {variant%2===0&&<g><R x={800} y={420} w={240} h={300} c="#66594b"/><P d="M750 420 L920 275 L1090 420Z" c="#5a4d43"/></g>}
 </g>;
 if(/school-poll|poll-hall|poll-booths|poll-reception|poll-counting|poll-counter|accessible-poll|polling|election-office|election-school|1928-poll|1946-election|virginia-poll|ballot-counting/.test(s))return <g data-environment={environment}>
  <R x={0} y={0} w={1920} h={1080} c={historical?'#aca696':'#b6c5c5'}/><R x={0} y={755} w={1920} h={325} c={historical?'#977f68':'#a68b6f'}/>
  <R x={160} y={135} w={1600} h={510} c={historical?'#8b7c6a':'#d1d9d6'}/>
  {Array.from({length:5},(_,i)=><R key={i} x={238+i*302} y={190} w={210} h={230} c={historical?'#746c66':'#a8c5cc'} stroke={historical?'#b6a183':'#e6e4d6'} sw={13}/>)}
  <Desk x={370+shift} y={610} w={1140} c={historical?'#8f765b':'#827467'}/>
  {variant%2===0&&<g><R x={1010} y={320} w={170} h={290} c={historical?'#958574':'#aeb7b4'}/><R x={1033} y={342} w={130} h={247} c={historical?'#5e5c57':'#7d8584'}/></g>}
  {variant%2===1&&<g><R x={1540} y={185} w={142} h={335} c="#76877a"/><R x={1548} y={216} w={125} h={136} c={gold}/></g>}
 </g>;
 if(/shareholder|corporate|stock|office|business|company|boardroom|tax-committee/.test(s))return <g data-environment={environment}>
  <R x={0} y={0} w={1920} h={1080} c={/night|downturn/.test(s)?'#3e5360':'#91a6ae'}/><R x={0} y={775} w={1920} h={305} c="#6f7472"/>
  {Array.from({length:6},(_,i)=><R key={i} x={95+i*306} y={95+(i%2)*42} w={230} h={430} c={i%2?'#b8cccf':'#849eab'} stroke="#d2d9d4" sw={15}/>)}
  <Desk x={200} y={585} w={1520} c="#76675d"/><R x={890} y={420} w={350} h={176} c="#364955"/><R x={908} y={439} w={313} h={133} c="#a5c3cb"/>
  {variant%2===1&&<R x={290} y={465} w={300} h={120} c="#b7c3ba"/>}
 </g>;
 if(/hospital|nurse|medical/.test(s))return <g data-environment={environment}>
  <R x={0} y={0} w={1920} h={1080} c={/night/.test(s)?'#637985':'#c1d0cc'}/><R x={0} y={790} w={1920} h={290} c="#89948f"/>
  <R x={190} y={115} w={540} h={450} c="#95b8bd" stroke="#f4f0e2" sw={25}/>
  {Array.from({length:3},(_,i)=><g key={i}><R x={890+i*305} y={450} w={245} h={230} c="#d4dfdb"/><R x={920+i*305} y={540} w={185} h={65} c="#8aafaa"/></g>)}
  <Hospital x={1430} y={145} s={.54}/><R x={185} y={650} w={555} h={45} c="#718889"/>
 </g>;
 if(/family|care|senior|kitchen|two-households|worker-home|working-class-kitchen|living-room|households/.test(s))return <g data-environment={environment}>
  <R x={0} y={0} w={1920} h={1080} c={/night|evening/.test(s)?'#68777a':'#bbb9a7'}/><R x={0} y={760} w={1920} h={320} c="#948474"/>
  <R x={120+shift} y={130} w={680} h={440} c={/night|evening/.test(s)?'#314653':'#99b8bd'} stroke="#eee5d2" sw={24}/>
  <R x={960} y={650} w={710} h={90} rx={9} c="#816d5c"/><R x={1040} y={725} w={27} h={280} c="#675847"/><R x={1560} y={725} w={27} h={280} c="#675847"/>
  <R x={260} y={700} w={550} h={85} rx={19} c="#718479"/><R x={1390} y={290} w={275} h={330} c="#a5aa9e"/>
  {variant%2===0&&<R x={1130} y={560} w={190} h={90} c="#d8c9b7"/>}
 </g>;
 if(/grocery|supermarket|receipt|consumption/.test(s))return <g data-environment={environment}>
  <R x={0} y={0} w={1920} h={1080} c="#ced0c3"/><R x={0} y={785} w={1920} h={295} c="#858b87"/>
  {Array.from({length:5},(_,i)=><g key={i}><R x={70+i*365} y={130} w={290} h={585} c="#8a958e"/>{Array.from({length:4},(_,j)=><R key={j} x={99+i*365} y={190+j*124} w={215} h={70} c={j%2?'#d0ac69':'#7b9d85'}/>)}</g>)}
  <Desk x={470} y={688} w={1040} c="#6e7b76"/><R x={1210} y={565} w={220} h={130} c="#394d52"/>
 </g>;
 if(/station|train|railway|commuter|campaign/.test(s))return <g data-environment={environment}>
  <R x={0} y={0} w={1920} h={1080} c="#8da3ae"/><R x={0} y={760} w={1920} h={320} c="#7c7c77"/>
  <R x={60} y={125} w={1800} h={480} c="#6b7e83"/><R x={90} y={185} w={1720} h={335} c="#aec7ce"/>
  <R x={110} y={670} w={1710} h={28} c="#c3aa74"/><L x={110} y={825} X={1810} Y={825} c="#393c40" sw={18}/>
  <Vehicle x={1150} y={738} p={p} kind="bus"/><R x={390} y={600} w={350} h={65} c="#5c6b6d"/>
 </g>;
 if(/archive|desk|manuscript|legal|legislation|statute|register|historic|reform|constitution|tax-definition|electoral-code|history-election|research|political-club|knowledge-test-board|mill-study|big-ledger/.test(s))return <g data-environment={environment}>
  <R x={0} y={0} w={1920} h={1080} c={historical?'#615348':'#465a62'}/><R x={0} y={790} w={1920} h={290} c={historical?'#705b49':'#6b6b64'}/>
  {Array.from({length:4},(_,i)=><g key={i}><R x={95+i*440} y={105} w={370} h={510} c={historical?'#78634c':'#6e7a79'}/>{Array.from({length:6},(_,j)=><R key={j} x={132+i*440} y={165+j*76} w={275} h={45} c={j%2?'#bfad8d':'#9f8f74'}/>)}</g>)}
  <Desk x={220} y={615} w={1500} c={historical?'#6c4e3d':'#70665a'}/><R x={825} y={500} w={300} h={110} c="#b9af9d"/>
 </g>;
 throw Error('V104 has no bespoke backdrop: '+environment);
};
