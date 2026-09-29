import React from 'react';
import {C,R,L,P,Ring,Person,Vehicle,Paper,Coin,House,School,Hospital,Factory,MapBlob,q,lerp} from './primitives';

const Ink='#1b2833',Cream='#eee8d7',Gold='#d7b477',Red='#b25d5b',Teal='#78aaa3',Blue='#668b9d',PaperBg='#eee1cb';
export const TXT=({x,y,t,size=45,c=C.cream,anchor='middle',opacity=1}:{x:number;y:number;t:string;size?:number;c?:string;anchor?:'start'|'middle'|'end';opacity?:number})=><text x={x} y={y} textAnchor={anchor} fill={c} opacity={opacity} fontSize={size} fontWeight="750" fontFamily="Noto Sans JP,sans-serif">{t}</text>;
export const Sine=(p:number)=>Math.sin(p*Math.PI*2);
export const ease=(p:number)=>q(p)*q(p)*(3-2*q(p));
const clean=(kind:string)=>kind.trim();

export const CivicPerson=({kind,p=0,pose='stand',scale=1}:{kind:string;p?:number;pose?:'stand'|'sit'|'walk'|'point'|'read'|'write'|'carry'|'hold';scale?:number})=>{
 const role=kind==='worker'||kind==='caregiver'?'worker':kind==='nurse'?'nurse':kind==='mother'?'teacher':kind==='landowner'?'lord':kind==='professor'||kind==='scholar'?'teacher':'modern';
 const coat=kind==='executive'?'#344958':kind==='senior'?'#716b8a':kind==='landowner'?'#775946':kind==='mother'?'#69867b':kind==='professor'?'#456676':undefined;
 return <g transform={'scale('+scale+')'}>
  <Person x={0} y={50} s={1} pose={pose} role={role} p={p}/>
  {coat&&<P d="M-54 103 L52 103 L62 238 Q0 251 -62 237Z" c={coat}/>}
  {kind==='executive'&&<P d="M-19 108 L0 153 L19 108 L0 102Z" c={Red}/>}
  {kind==='senior'&&<g><P d="M-42 43 Q-45 -3 0 -6 Q45 -3 42 40Z" c="#c4c9c3"/><L x={106} y={186} X={103} Y={395} c={C.wood} sw={11}/></g>}
  {kind==='professor'&&<g><R x={-45} y={44} w={35} h={9} c={C.ink}/><R x={10} y={44} w={35} h={9} c={C.ink}/><L x={-10} y={48} X={10} Y={48} c={C.ink} sw={5}/></g>}
  {kind==='landowner'&&<P d="M-64 10 L-43 -65 L43 -65 L64 10Z" c="#3e3c36"/>}
  {kind==='worker'&&<R x={-55} y={18} w={110} h={22} rx={8} c="#b08c64"/>}
  {kind==='nurse'&&<P d="M-52 118 L52 118 L48 246 L-48 246Z" c="#e4e9e4"/>}
 </g>;
};
const Book=({x=0,y=0,p=0,title='法'}:{x?:number;y?:number;p?:number;title?:string})=><g transform={'translate('+x+' '+y+') rotate('+lerp(-10,2,p)+')'}><R x={-170} y={-215} w={340} h={440} rx={12} c="#674d49" stroke={Gold} sw={10}/><R x={-150} y={-193} w={300} h={398} rx={7} c="#b3a486" o={.38}/><R x={-148} y={-178} w={292} h={380} c="#554c45"/><TXT x={0} y={30} t={title} size={108} c={Gold}/><L x={-95} y={130} X={95} Y={130} c={Gold} sw={7}/></g>;
const Doc=({x=0,y=0,p=0,title='資料',historic=false}:{x?:number;y?:number;p?:number;title?:string;historic?:boolean})=><g transform={'translate('+x+' '+y+') rotate('+lerp(-5,3,p)+')'}><R x={-165} y={-215} w={330} h={430} rx={historic?2:9} c={historic?'#d8c5a5':C.paper} stroke={historic?'#806349':'#8c7b69'} sw={6}/><TXT x={0} y={-128} t={title} size={36} c={C.ink}/>{Array.from({length:7},(_,i)=><R key={i} x={-116} y={-80+i*43} w={220-(i%3)*35} h={6} c={i===3?Red:C.slate} o={i===3?1:.43}/>)}</g>;
const Ballot=({p=0,old=false}:{p?:number;old?:boolean})=><g transform={'rotate('+lerp(-8,5,p)+')'}><R x={-135} y={-195} w={270} h={390} rx={old?0:4} c={old?'#e0c89e':C.paper} stroke="#8e8270" sw={6}/><TXT x={0} y={-125} t={old?'選挙人':'投票用紙'} size={old?38:42} c={C.ink}/><R x={-103} y={-90} w={206} h={6} c={C.slate}/><L x={-88} y={25} X={lerp(-80,75,p)} Y={55} c={C.ink} sw={8}/><R x={-100} y={118} w={200} h={6} c={C.slate} o={.7}/></g>;
const Box=({p=0}:{p?:number})=><g><R x={-155} y={-45} w={310} h={270} rx={12} c="#526c70" stroke="#d9d7c8" sw={6}/><P d="M-178 -55 L0 -120 L178 -55 L145 -25 L-145 -25Z" c="#a7b7b8"/><R x={-72} y={-75} w={145} h={11} rx={4} c={C.ink}/><g opacity={1-q((p-.65)*2.8)} transform={'translate(0 '+lerp(-260,-65,p)+') rotate('+lerp(-13,0,p)+') scale(.3)'}><Ballot p={p}/></g></g>;
const TaxStack=({p=0}:{p?:number})=><g>{Array.from({length:8},(_,i)=><g key={i} opacity={q((p+.4)*3-i*.19)}><R x={-175+i*17} y={130-i*37} w={125} h={30} rx={6} c={i%2?Gold:'#c99750'} stroke="#66533e" sw={4}/><circle cx={-112+i*17} cy={145-i*37} r={10} fill={C.paper}/></g>)}</g>;
const FactoryObject=({p=0}:{p?:number})=><g transform="translate(-195 -150)"><Factory x={0} y={0} s={1.03}/><g transform={'rotate('+(p*190)+' 185 158)'}><circle cx={185} cy={158} r={48} fill="none" stroke={Gold} strokeWidth={16}/>{[0,1,2].map(i=><L key={i} x={185} y={158} X={185+Math.cos(i*Math.PI*2/3)*42} Y={158+Math.sin(i*Math.PI*2/3)*42} c={Gold} sw={9}/>)}</g></g>;
const Gavel=({p=0}:{p?:number})=><g transform={'rotate('+lerp(-38,15,p)+')'}><R x={-25} y={-35} w={50} h={265} rx={8} c={C.wood}/><R x={-130} y={-105} w={260} h={94} rx={20} c="#86694f" stroke={Gold} sw={6}/><R x={-165} y={220} w={330} h={35} rx={16} c="#7b624b"/></g>;
const Ledger=({p=0}:{p?:number})=><g><R x={-235} y={-225} w={470} h={450} rx={9} c={C.paper} stroke={C.wood}/>{Array.from({length:7},(_,i)=><g key={i}><L x={-195} y={-158+i*55} X={196} Y={-158+i*55} c={C.slate} sw={3} o={.62}/><R x={-185} y={-147+i*55} w={105+(i%3)*24} h={8} c={C.blue2} o={.55}/><R x={83} y={-147+i*55} w={76} h={8} c={i===5?Red:C.gold} o={i/7+.17}/></g>)}<L x={43} y={-194} X={43} Y={194} c={C.wood} sw={4}/><L x={-150} y={125} X={lerp(-150,163,p)} Y={126} c={Red} sw={8}/></g>;
const Scales=({p=0}:{p?:number})=><g><L x={0} y={-240} X={0} Y={235} c={Gold} sw={18}/><g transform={'rotate('+lerp(-14,10,p)+')'}><L x={-310} y={-130} X={310} Y={-130} c={Gold} sw={13}/>{[-230,230].map((x,i)=><g key={i}><L x={x} y={-130} X={x} Y={80+(i?16:-16)*p} c={C.paper} sw={5}/><P d={'M'+(x-120)+' '+(86+(i?16:-16)*p)+' Q'+x+' '+(145+(i?16:-16)*p)+' '+(x+120)+' '+(86+(i?16:-16)*p)+'Z'} c={i?Teal:Gold}/></g>)}</g><R x={-125} y={245} w={250} h={34} rx={8} c={C.wood}/></g>;
const CityMap=({p=0}:{p?:number})=><g><R x={-480} y={-300} w={960} h={610} c="#d0c39f" rx={19}/>{Array.from({length:5},(_,i)=><L key={i} x={-450} y={-195+i*115} X={450} Y={-195+i*115} c="#8b896f" sw={10} o={.8}/>) }{Array.from({length:7},(_,i)=><L key={i} x={-380+i*120} y={-280} X={-380+i*120} Y={280} c="#879178" sw={8} o={.7}/>) }{Array.from({length:28},(_,i)=><R key={i} x={-415+(i%7)*125} y={-245+Math.floor(i/7)*122} w={70} h={67} c={i%8===0?Red:i%3?C.blue2:C.green} o={q((p+.1)*2-i*.035)}/>)}</g>;
const Chair=({p=0}:{p?:number})=><g><R x={-88} y={25} w={176} h={28} c={C.wood}/><R x={-82} y={-144} w={25} h={170} c={C.wood}/><R x={58} y={-144} w={25} h={170} c={C.wood}/><L x={-63} y={53} X={-63} Y={230} c={C.wood} sw={16}/><L x={63} y={53} X={63} Y={230} c={C.wood} sw={16}/></g>;
export const CivicProp=({kind,p=0}:{kind:string;p?:number}):React.ReactNode=>{
 switch(clean(kind)){
 case'ballot':return <Ballot p={p}/>;
 case'oldballot':return <Ballot p={p} old/>;
 case'pollbox':return <Box p={p}/>;
 case'taxcoin':return <TaxStack p={p}/>;
 case'sharecert':return <g><Doc x={-40} y={-15} p={p} title="株式" /><g opacity={q(p*1.7)} transform="translate(130 -30) scale(.7)"><Doc p={p} title="議決権"/></g></g>;
 case'constitution':return <Book p={p} title="憲法"/>;
 case'lawbook':return <Book p={p} title="法律"/>;
 case'treaty':return <Book p={p} title="人権"/>;
 case'parchment':return <Doc p={p} title="宣言" historic/>;
 case'taxcert':return <Doc p={p} title="納税証明" historic/>;
 case'polltax':return <Doc p={p} title="人頭税" historic/>;
 case'register':return <Doc p={p} title="選挙人名簿" historic/>;
 case'paystub':return <Doc p={p} title="給与明細"/>;
 case'receipt':return <Doc p={p} title="領収書"/>;
 case'ledger':return <Ledger p={p}/>;
 case'diploma':return <Doc p={p} title="卒業証書" historic/>;
 case'exam':return <Doc p={p} title="資格試験"/>;
 case'calendar':return <g><R x={-170} y={-160} w={340} h={340} c={C.paper}/><R x={-170} y={-160} w={340} h={92} c={Red}/><TXT x={0} y={80} t={p>.66?'1946':p>.33?'1928':'1890'} size={72} c={Ink}/></g>;
 case'bargraph':return <g><L x={-290} y={220} X={300} Y={220} c={C.paper} sw={9}/>{[180,270,340,230,425].map((h,i)=><R key={i} x={-245+i*118} y={220-h*q(p+.2)} w={74} h={h*q(p+.2)} c={i%2?Teal:Gold}/>)}</g>;
 case'threshold':return <g><L x={-290} y={100} X={310} Y={100} c={C.paper} sw={9}/><L x={lerp(-260,230,p)} y={-185} X={lerp(-260,230,p)} Y={245} c={Red} sw={14}/>{Array.from({length:5},(_,i)=><circle key={i} cx={-240+i*115} cy={90} r={26} fill={i<3?Teal:Gold}/>)}</g>;
 case'circle':return <g>{[0,1,2].map(i=><circle key={i} cx={0} cy={0} r={100+i*100*q(p)} fill="none" stroke={i%2?Teal:Gold} strokeWidth={15}/>)}</g>;
 case'cycle':return <g>{[0,1,2].map((i)=><g key={i}><circle cx={Math.cos((i/3)*Math.PI*2)*180} cy={Math.sin((i/3)*Math.PI*2)*170} r={74} fill={i%2?Teal:Gold}/><path d="M0 -260 C260 -260 330 70 165 190" fill="none" stroke={Red} strokeWidth={10} strokeDasharray="1800" strokeDashoffset={1800*(1-q(p))}/></g>)}</g>;
 case'scales':return <Scales p={p}/>;
 case'factory':return <FactoryObject p={p}/>;
 case'house':return <House x={-155} y={-150} s={1.3}/>;
 case'hospital':return <Hospital x={-170} y={-135} s={1.1}/>;
 case'gate':return <g><R x={-210} y={-210} w={75} h={460} c={C.wood}/><R x={160} y={-210} w={75} h={460} c={C.wood}/><g transform={'rotate('+lerp(0,-86,p)+' -128 -180)'}><R x={-135} y={-200} w={350} h={28} c={Gold}/></g></g>;
 case'gavel':return <Gavel p={p}/>;
 case'map':return <g transform="translate(-325 -150) scale(.35)"><MapBlob seed={4} p={p} overlay/></g>;
 case'megaphone':return <g transform={'rotate('+lerp(-16,7,p)+')'}><P d="M-130 -70 L130 -180 L130 60 L-130 -10Z" c={C.paper} stroke={Gold} sw={9}/><R x={-165} y={-66} w={55} h={62} c={C.wood}/><L x={-80} y={0} X={-10} Y={210} c={C.wood} sw={20}/></g>;
 case'parliament':return <g><R x={-285} y={-45} w={570} h={300} c="#9a8b76"/><P d="M-335 -45 L0 -220 L335 -45Z" c="#8d806c"/>{[-180,-60,60,180].map(x=><R key={x} x={x-22} y={-10} w={44} h={240} c={C.paper}/>)}</g>;
 case'passport':return <g><R x={-152} y={-205} w={304} h={420} rx={20} c="#334e65" stroke={Gold} sw={8}/><circle cx={0} cy={-55} r={74} fill="none" stroke={Gold} strokeWidth={9}/><TXT x={0} y={128} t="国籍" size={45} c={Gold}/></g>;
 case'courtroom':return <Gavel p={p}/>;
 case'clock':return <g><circle r="230" fill={C.paper} stroke={Gold} strokeWidth={19}/><L x={0} y={0} X={0} Y={-160} c={Ink} sw={15}/><g transform={'rotate('+(p*240)+')'}><L x={0} y={0} X={135} Y={60} c={Red} sw={12}/></g></g>;
 case'rickshaw':return <g><R x={-160} y={-88} w={250} h={175} c="#7d6050"/><P d="M-180 -90 L-30 -190 L100 -80Z" c="#5b4b45"/><circle cx={-105} cy={95} r={82} fill="none" stroke={Gold} strokeWidth={17}/><L x={95} y={-40} X={265} Y={-120} c={C.wood} sw={10}/></g>;
 case'professor':case'scholar':case'executive':case'worker':case'senior':case'nurse':case'caregiver':case'mother':case'landowner':return <CivicPerson kind={kind} p={p} pose={kind==='worker'?'walk':kind==='scholar'||kind==='professor'?'write':kind==='senior'?'read':'stand'} scale={.75}/>;
 case'crowd':return <g>{Array.from({length:6},(_,i)=><g key={i} transform={'translate('+(-310+i*115)+' '+((i%2)*55)+') scale(.45)'}><CivicPerson kind={i%3===0?'worker':i%3===1?'mother':'executive'} p={p} pose="walk"/></g>)}</g>;
 default:throw Error('V104 unsupported original object '+kind);
 }
};
export const AllCivicObjects=['ballot','oldballot','pollbox','taxcoin','sharecert','constitution','lawbook','treaty','parchment','taxcert','polltax','register','paystub','receipt','ledger','diploma','exam','calendar','bargraph','threshold','circle','cycle','scales','factory','house','hospital','gate','gavel','map','megaphone','parliament','passport','clock','rickshaw','professor','scholar','executive','worker','senior','nurse','caregiver','mother','landowner','crowd'] as const;
