import {Circle, Line, Node, Rect, Txt} from '@motion-canvas/2d';
import {type SimpleSignal} from '@motion-canvas/core';

const C={ink:'#111820',night:'#0D1820',fog:'#93A3AB',paper:'#ECE8DD',warm:'#E5B36A',ochre:'#BA785A',navy:'#253847',moss:'#65736C',slate:'#5E7180',red:'#B55F59',yellow:'#DDC18D',brick:'#7D5452'};
const F='Noto Sans JP';
const fade=(p:number,index:number,total=7)=>Math.min(1,Math.max(0,(p/Math.max(1,total)-index/total)*6));
const gentle=(n:number)=>Math.min(1,Math.max(0,n));
const person=(x:number,y:number,shirt:string,k=1,offset=0)=>
  <Node x={x} y={y} scale={k}>
    <Circle x={()=>Math.sin(offset)*2} y={-78} width={63} height={63} fill={'#D2AF92'}/>
    <Rect y={7} width={80} height={128} radius={18} fill={shirt}/>
    <Rect x={-19} y={121} width={27} height={88} radius={10} fill={'#26343E'}/>
    <Rect x={20} y={121} width={27} height={88} radius={10} fill={'#26343E'}/>
  </Node>;

function landscape(p:SimpleSignal<number>,variant:number){
  return <Node>
    <Rect width={1920} height={920} y={-96} fill={variant%2===0?'#263F51':'#314654'}/>
    <Circle x={640} y={()=>-270+p()*6} width={260} height={260} fill={'#E4B170'} opacity={0.86}/>
    {Array.from({length:8},(_,i)=><Rect key={String(i)} x={-840+i*250} y={-110+(i%3)*20} width={210} height={230+i%3*42} fill={i%2===0?'#253341':'#384650'} opacity={0.8}><Rect x={-40} y={-5} width={34} height={54} fill={'#C6AD7E'} opacity={0.23}/><Rect x={30} y={-10} width={34} height={54} fill={'#C6AD7E'} opacity={()=>0.16+fade(p(),i,12)*0.25}/></Rect>)}
    <Rect y={282} width={1920} height={320} fill={'#202A32'}/>
    <Line points={[[-850,280],[850,280]]} stroke={'#6D6D65'} lineWidth={5}/>
    {[-560,-200,200,580].map((x,i)=><Rect key={String(i)} x={x} y={318} width={140} height={9} radius={2} fill={'#D3C9B4'} opacity={0.22}/>) }
    <Line points={[[ -650,-430],[-650,260]]} stroke={'#142530'} lineWidth={10}/>
    <Line points={[[ -650,-350],[560,-320]]} stroke={'#152631'} lineWidth={3}/>
    <Node x={()=>-340+Math.min(1,p()/12)*390} y={150}>{person(0,0,'#B58D6F',0.75)}</Node>
    <Node x={()=>100+Math.min(1,p()/12)*(-115)} y={155} opacity={()=>variant%3===0?1:1-gentle((p()-6)/7)}>{person(0,0,'#677885',0.74)}</Node>
    <Rect x={0} y={-405} width={1640} height={3} fill={C.paper} opacity={0.1}/>
  </Node>;
}
function classroom(p:SimpleSignal<number>,variant:number){
  return <Node>
    <Rect width={1920} height={900} y={-98} fill={'#253640'}/>
    {[-640,-260,120,500].map((x,i)=><Rect key={String(i)} x={x} y={-210} width={285} height={320} fill={'#8BA4AA'} stroke={'#61737A'} lineWidth={16}>
      <Rect width={12} height={300} fill={'#3A4D56'}/>
      <Rect width={260} height={9} fill={'#3A4D56'}/>
    </Rect>)}
    <Rect width={1920} height={280} y={296} fill={'#6E6558'}/>
    <Rect x={-620} y={-265} width={450} height={208} fill={'#233B38'} stroke={'#957F65'} lineWidth={12}/>
    {Array.from({length:5},(_,i)=><Node key={String(i)} x={-520+i*270} y={90+((i%2)*135)}>
      <Rect width={195} height={22} radius={3} fill={'#B6956B'}/>
      <Rect y={80} width={14} height={156} x={-80} fill={'#5E524A'}/><Rect y={80} width={14} height={156} x={80} fill={'#5E524A'}/>
      <Node opacity={()=>variant===3 && i>1?1-gentle(p()/9):1}>{person(0,-38,i===2?'#A77D64':'#6D8390',0.52)}</Node>
    </Node>)}
    <Circle x={()=> -540+Math.min(1,p()/11)*960} y={-280} width={30} height={30} fill={C.warm} opacity={0.7}/>
  </Node>;
}
function paperMemory(p:SimpleSignal<number>,variant:number){
 const items=['目覚まし時計','たくさんの置き傘','電球の紐','あの頃のシール','隠れたゲーム'];
 return <Node>
   <Rect width={1920} height={900} y={-100} fill={'#262C34'}/>
   <Rect width={1640} height={680} y={-64} fill={'#CABAA0'} rotation={-2}/>
   <Rect width={1605} height={670} x={18} y={-80} fill={'#D7C9AD'} rotation={1}/>
   {items.map((label,i)=><Node key={String(i)} x={-610+(i%3)*610} y={-242+Math.floor(i/3)*360} opacity={()=>0.15+0.85*fade(p(),i,5)} rotation={(i%2?1:-1)*3}>
      <Rect width={445} height={265} fill={i%2?'#52636C':'#7B6E63'} stroke={'#E8E1D2'} lineWidth={13}/>
      <Circle y={-30} width={92} height={92} fill={'#D2BE97'} opacity={0.65}/>
      <Line points={[[-100,32],[95,32]]} stroke={C.paper} lineWidth={6}/>
      <Txt text={label} y={84} fontFamily={F} fontSize={30} fontWeight={700} fill={C.paper}/>
    </Node>)}
 </Node>;
}
function body(p:SimpleSignal<number>,variant:number){
 const swing=()=>Math.sin(p()*0.6);
 return <Node>
   <Rect width={1920} height={900} y={-100} fill={'#172733'}/>
   <Rect x={-565} y={-8} width={760} height={670} fill={'#263C46'} radius={30}/>
   <Rect x={565} y={-8} width={760} height={670} fill={'#263C46'} radius={30}/>
   <Txt x={-570} y={-330} text={'観察：身体の重心'} fontFamily={F} fontSize={43} fontWeight={700} fill={C.paper}/>
   <Txt x={565} y={-330} text={'視線は一瞬も止まらない'} fontFamily={F} fontSize={39} fontWeight={700} fill={C.paper}/>
   <Node x={()=>-610+p()*13} y={145} rotation={()=>swing()*5}>
     <Circle y={-250} width={110} height={110} fill={'#D6BA98'}/>
     <Line points={[[0,-180],[0,-10]]} stroke={C.paper} lineWidth={34}/>
     <Line points={[[0,-10],[-85,145]]} stroke={C.paper} lineWidth={27}/>
     <Line points={[[0,-10],[80,130]]} stroke={C.paper} lineWidth={27}/>
     <Line points={[[-6,-110],[-120,-40]]} stroke={C.paper} lineWidth={24}/>
     <Line points={[[5,-110],[116,-95]]} stroke={C.paper} lineWidth={24}/>
     <Circle x={()=>-10+swing()*20} y={-15} width={33} height={33} fill={C.red}/>
   </Node>
   <Node x={500} y={70}>
      <Circle y={-180} width={135} height={135} fill={'#D8B99B'}/>
      <Circle x={()=>30+swing()*28} y={-194} width={20} height={20} fill={C.ink}/>
      <Circle x={()=>-26+swing()*28} y={-194} width={20} height={20} fill={C.ink}/>
      <Rect y={20} width={180} height={200} radius={45} fill={'#7D888D'}/>
      <Line points={[[110,-210],[250,-240]]} stroke={C.warm} lineWidth={5}/>
   </Node>
 </Node>;
}
function office(p:SimpleSignal<number>){
 return <Node>
  <Rect width={1920} height={900} y={-94} fill={'#1C2C36'}/>
  {[-710,-350,10,370,730].map((x,i)=><Rect key={String(i)} x={x} y={-270} width={270} height={290} radius={8} fill={'#344D5B'} stroke={'#687880'} lineWidth={8}/>)}
  <Rect y={245} width={1500} height={20} fill={'#816F5C'}/>
  <Node x={-440} y={124}>{person(0,0,'#AD8A77',1)}</Node>
  <Node x={415} y={124}>{person(0,0,'#6A8292',1)}</Node>
  <Rect x={-30} y={-64} width={410} height={275} fill={'#293843'} radius={12} stroke={'#5F7383'} lineWidth={7}/>
  <Txt x={-30} y={-78} text={'定例会議'} fontFamily={F} fontSize={54} fill={C.paper} fontWeight={700}/>
  <Circle x={()=>-410+Math.min(p()*17,290)} y={-100} width={28} height={28} fill={C.red}/>
  <Txt x={-350} y={310} text={'普通　／　特別'} fontFamily={F} fontWeight={700} fontSize={50} fill={C.paper}/>
 </Node>;
}
function absent(p:SimpleSignal<number>,variant:number){
 return <Node>
  <Rect width={1920} height={910} y={-96} fill={'#1B2C37'}/>
  <Rect x={-450} y={150} width={1160} height={26} fill={'#AC8C6A'}/>
  <Rect x={-450} y={240} width={55} height={190} fill={'#605248'}/>
  <Rect x={-80} y={240} width={55} height={190} fill={'#605248'}/>
  {[-710,-370].map((x,i)=><Node key={String(i)} x={x} y={0} opacity={()=>i===0?1:1-gentle((p()-2)/6)}><Circle y={80} width={95} height={24} fill={'#D2C8B6'}/><Rect y={105} width={85} height={62} fill={'#DDD5C4'}/></Node>)}
  <Rect x={390} y={0} width={500} height={545} fill={'#32424B'} radius={16}/>
  <Rect x={390} y={0} width={390} height={430} fill={'#65808A'} opacity={0.5}/>
  <Txt x={390} y={285} text={'そこにいない誰か'} fontFamily={F} fontSize={46} fill={C.paper}/>
  <Line points={[[50,-240],[720,-240]]} stroke={C.warm} lineWidth={4} opacity={0.3}/>
 </Node>;
}
function solstice(p:SimpleSignal<number>,variant:number){
 return <Node>
  <Rect width={1920} height={920} y={-90} fill={'#16283B'}/>
  <Circle x={()=>-710+Math.min(1,p()/12)*1420} y={()=>-280-120*Math.sin(Math.min(1,p()/12)*Math.PI)} width={172} height={172} fill={C.warm}/>
  <Line points={[[-790,170],[790,170]]} stroke={'#E0C8A1'} lineWidth={6}/>
  {Array.from({length:13},(_,i)=><Rect key={String(i)} x={-715+i*120} y={198} width={7} height={42} fill={'#9DA4A3'}/>) }
  <Txt x={-650} y={275} text={'夏至'} fontFamily={F} fontSize={74} fill={C.paper} fontWeight={700}/>
  <Txt x={650} y={275} text={'冬至'} fontFamily={F} fontSize={74} fill={C.paper} fontWeight={700}/>
  <Txt x={0} y={-388} text={variant===4?'もう一度、日は長くなる':'人生の光が最も長い日'} fontFamily={F} fontSize={48} fill={C.paper}/>
  <Line points={Array.from({length:24},(_,i)=>[-700+i*60,-180+Math.cos((i/23)*Math.PI*2)*75])} stroke={C.red} lineWidth={5} opacity={0.65}/>
 </Node>;
}
function lifeNetwork(p:SimpleSignal<number>,variant:number){
 return <Node>
  <Rect width={1920} height={900} y={-100} fill={'#152732'}/>
  <Circle width={()=>330+Math.min(p()*35,540)} height={()=>330+Math.min(p()*35,540)} lineWidth={6} stroke={'#4A6372'} fill={'#00000000'}/>
  <Circle width={250} height={250} fill={'#9A7869'} opacity={()=>1-Math.min(p()/30,0.65)}/>
  <Txt text={'少年時代'} fontFamily={F} fontSize={43} fontWeight={700} fill={C.paper}/>
  {['仕事','家族','新しい友人','未来','記憶','選択'].map((s,i)=>{
    const t=i*Math.PI/3; const x=Math.cos(t)*630,y=Math.sin(t)*280;
    return <Node key={String(i)} x={x} y={y} opacity={()=>fade(p(),i,7)}>
      <Line points={[[0,0],[-x*0.42,-y*0.4]]} stroke={'#7C918E'} lineWidth={4}/>
      <Circle width={130} height={130} fill={i%2?C.slate:C.moss}/>
      <Txt text={s} fontFamily={F} fontWeight={700} fontSize={27} fill={C.paper}/>
    </Node>;
  })}
 </Node>;
}
function research(p:SimpleSignal<number>){
 return <Node>
  <Rect width={1920} height={900} y={-92} fill={'#14202A'}/>
  <Rect x={-500} y={-40} width={720} height={630} radius={28} fill={'#D9D1BC'}/>
  <Txt x={-510} y={-242} text={'SCIENCE · 2013'} fontFamily={F} fontSize={45} fontWeight={700} fill={'#2A3842'}/>
  <Txt x={-510} y={-135} text={'歴史の終わりの錯覚'} fontFamily={F} fontSize={52} fontWeight={700} fill={'#2A3842'}/>
  <Txt x={-510} y={-38} text={'Quoidbach / Gilbert / Wilson'} fontFamily={F} fontSize={28} fill={'#56626D'}/>
  <Txt x={450} y={-333} text={'過去の変化　≠　未来の予測'} fontFamily={F} fontSize={49} fill={C.paper}/>
  <Rect x={430} y={105} width={700} height={400} fill={'#253B47'} radius={24}/>
  <Rect x={255} y={()=>220-Math.min(p()/11,1)*175} width={92} height={()=>145+Math.min(p()/11,1)*350} fill={C.warm}/>
  <Rect x={600} y={()=>150-Math.min(p()/11,1)*65} width={92} height={()=>290+Math.min(p()/11,1)*130} fill={C.red}/>
  <Txt x={260} y={310} text={'過去'} fill={C.paper} fontFamily={F} fontSize={34}/>
  <Txt x={600} y={310} text={'未来予想'} fill={C.paper} fontFamily={F} fontSize={34}/>
  <Txt x={450} y={319} text={'数値軸を持たない模式図'} fill={C.fog} fontFamily={F} fontSize={23}/>
 </Node>;
}
function fork(p:SimpleSignal<number>,variant:number){
 return <Node>
  <Rect width={1920} height={900} y={-95} fill={'#1C2B36'}/>
  <Line points={[[0,380],[0,60],[-100,-50],[-600,-300]]} lineWidth={180} stroke={'#455057'}/>
  <Line points={[[0,380],[0,60],[100,-50],[600,-300]]} lineWidth={180} stroke={'#48565E'}/>
  <Line points={[[0,380],[0,60],[-100,-50],[-600,-300]]} lineWidth={5} stroke={'#D8C7AA'} lineDash={[30,35]}/>
  <Line points={[[0,380],[0,60],[100,-50],[600,-300]]} lineWidth={5} stroke={'#D8C7AA'} lineDash={[30,35]}/>
  <Node x={()=>-160-Math.min(p()*33,480)} y={()=>60-Math.min(p()*19,330)}>{person(0,0,'#BD8767',0.74)}</Node>
  <Node x={()=>160+Math.min(p()*34,480)} y={()=>60-Math.min(p()*19,330)}>{person(0,0,'#738A9B',0.74)}</Node>
  <Txt text={'同じ道を歩いた時間は、消えない'} y={-370} fontFamily={F} fontSize={50} fill={C.paper}/>
 </Node>;
}
function cinema(p:SimpleSignal<number>,variant:number){
 return <Node>
  <Rect width={1920} height={900} y={-90} fill={'#0D1722'}/>
  <Rect width={1400} height={620} y={-100} radius={14} fill={'#677D83'} stroke={'#D0B59D'} lineWidth={14}/>
  <Circle width={330} height={330} x={()=> -440+p()*20} y={-165} fill={C.warm} opacity={0.7}/>
  <Line points={[[-650,180],[650,180]]} lineWidth={9} stroke={'#DBD1BD'}/>
  <Node x={0} y={40} opacity={()=>0.45+Math.min(0.5,p()/30)}>
   {person(-270,0,'#627E83',0.7)}{person(200,0,'#BE8467',0.7)}
  </Node>
  <Txt text={'記憶は、観るたびに違う表情を見せる'} y={320} fontFamily={F} fontSize={48} fill={C.paper}/>
 </Node>;
}
function mirror(p:SimpleSignal<number>,variant:number){
 return <Node>
  <Rect width={1920} height={900} y={-90} fill={'#172631'}/>
  <Rect x={-445} y={-15} width={820} height={610} fill={'#304854'} radius={25} stroke={'#647E87'} lineWidth={7}/>
  <Rect x={445} y={-15} width={820} height={610} fill={'#293B4B'} radius={25} stroke={'#617586'} lineWidth={7}/>
  <Node x={()=>-460-p()*8} y={30}>{person(0,0,'#B48A70',1.45)}</Node>
  <Node x={()=>440+p()*8} y={30}>{person(0,0,'#728794',1.45)}</Node>
  <Txt x={-430} y={325} text={'私が覚えていること'} fontFamily={F} fontSize={43} fill={C.paper}/>
  <Txt x={440} y={325} text={'相手が覚えていること'} fontFamily={F} fontSize={43} fill={C.paper}/>
  <Line points={[[0,-330],[0,390]]} stroke={C.red} lineWidth={4} opacity={0.7}/>
 </Node>;
}

export const kinds: string[][] = [
 ['cinema','street','school','network','mirror','fork'],
 ['cinema','school','street','office','school','mirror'],
 ['memory','street','body','body','cinema','street'],
 ['school','cinema','absent','street','cinema','mirror'],
 ['solstice','memory','street','network','solstice','mirror'],
 ['research','mirror','solstice','absent','fork','network'],
 ['street','fork','memory','solstice','network','fork'],
];

export function visual(type:string,p:SimpleSignal<number>,variant:number){
  switch(type){
    case 'street':return landscape(p,variant);
    case 'school':return classroom(p,variant);
    case 'memory':return paperMemory(p,variant);
    case 'body':return body(p,variant);
    case 'office':return office(p);
    case 'absent':return absent(p,variant);
    case 'solstice':return solstice(p,variant);
    case 'network':return lifeNetwork(p,variant);
    case 'research':return research(p);
    case 'fork':return fork(p,variant);
    case 'mirror':return mirror(p,variant);
    default:return cinema(p,variant);
  }
}
