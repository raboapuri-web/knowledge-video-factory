import {Circle,Line,Node,Rect,Txt} from '@motion-canvas/2d';
import {type SimpleSignal} from '@motion-canvas/core';

type S=SimpleSignal<number>;
const P={ink:'#0B121C',sky:'#152A3B',deep:'#111C29',chalk:'#F0EADF',muted:'#B6C1C4',amber:'#F1B76C',warm:'#C27D61',blue:'#66889C',cyan:'#91B9C6',red:'#C44E55',pale:'#D1BBA5',grass:'#54756A',slate:'#536976',black:'#07080C'};
const F='Noto Sans JP';
const bound=(v:number)=>Math.max(0,Math.min(1,v));
const reveal=(p:S,n:number,segments=8)=>bound((p()-n/segments)*segments*3);
const drift=(p:S,k=1)=>p()*k;
const title=(s:string,y=-350,x=0,size=43)=><Txt x={x} y={y} text={s} fontFamily={F} fontWeight={700} fontSize={size} fill={P.chalk} width={1600} textAlign={'center'}/>;
const backdrop=(color=P.sky)=><Node><Rect width={1920} height={915} y={-89} fill={color}/><Rect width={1920} height={2} y={360} fill={P.amber} opacity={0.12}/></Node>;
function stars(n=20){return <Node>{Array.from({length:n},(_,i)=><Circle key={String(i)} x={((i*241)%1740)-870} y={((i*137)%590)-380} width={i%3===0?5:3} height={i%3===0?5:3} fill={'#EFF4EC'} opacity={0.12+(i%5)*0.07}/>)}</Node>;}
function moon(p:S,x=480,y=-220,r=175){
 return <Node><Circle x={x} y={y} width={r*2} height={r*2} fill={P.red} shadowColor={P.red} shadowBlur={36} opacity={()=>0.65+reveal(p,2)*0.27}/>
 <Circle x={x-24} y={y-23} width={r*1.64} height={r*1.64} stroke={P.warm} lineWidth={5} opacity={0.21}/>
 <Circle x={x+45} y={y-55} width={42} height={42} fill={'#743941'} opacity={0.28}/><Circle x={x-65} y={y+55} width={29} height={29} fill={'#6F333E'} opacity={0.25}/></Node>;
}
function human(x:number,y:number,color:string,p:S,scale=1,travel=0){
 return <Node x={()=>x+travel*bound(p())} y={y} scale={scale}>
  <Circle y={-100} width={79} height={81} fill={'#D7B394'}/>
  <Rect x={0} y={-129} width={82} height={25} fill={'#202C36'} radius={12}/>
  <Rect y={-12} width={97} height={151} radius={18} fill={color}/>
  <Line points={[[-30,35],[-34,174]]} stroke={'#293644'} lineWidth={24}/>
  <Line points={[[30,35],[37,174]]} stroke={'#293644'} lineWidth={24}/>
  <Line points={[[-45,-41],[-80+12*bound(p()),40]]} stroke={'#D7B394'} lineWidth={19}/>
  <Line points={[[46,-41],[77-12*bound(p()),25]]} stroke={'#D7B394'} lineWidth={19}/>
  <Circle x={-17} y={-99} width={5} height={5} fill={'#2A3038'}/><Circle x={18} y={-99} width={5} height={5} fill={'#2A3038'}/>
 </Node>;
}
function childPair(p:S,left=-330,right=335,y=85,shift=0,fadeRight=false){
 return <Node>{human(left,y,'#B7896A',p,0.66,shift)}<Node opacity={()=>fadeRight?1-reveal(p,5):1}>{human(right,y,'#748DA0',p,0.66,shift*.8)}</Node></Node>;
}
function path(p:S,dark=false){
 return <Node>{backdrop(dark?'#1B2C3A':'#385164')}
  <Circle x={620} y={-255} width={255} height={255} fill={P.amber} opacity={dark?0.22:0.86}/>
  {[-710,-370,100,520,810].map((x,i)=><Node key={String(i)}><Rect x={x} y={60-i%2*48} width={210} height={385} fill={'#253D4B'} opacity={0.88}/><Rect x={x-40} y={-40} width={36} height={55} fill={P.amber} opacity={()=>reveal(p,i+1)*0.26}/></Node>)}
  <Rect y={278} width={1920} height={160} fill={'#243442'}/>
  <Line points={[[-910,265],[910,265]]} stroke={P.pale} lineWidth={4} opacity={0.44}/>
  {Array.from({length:9},(_,i)=><Line key={String(i)} points={[[i*220-840,-370],[i*220-840,190]]} stroke={'#243441'} lineWidth={i%3===0?7:2} opacity={0.4}/>)}
 </Node>;
}
function room(p:S){
 return <Node>{backdrop('#23313C')}
  <Rect y={300} height={140} width={1920} fill={'#5B564F'}/>
  <Rect x={500} y={-200} width={450} height={300} fill={'#85A1AA'} stroke={'#536C76'} lineWidth={24}/>
  <Line points={[[500,-345],[500,-50]]} stroke={'#536C76'} lineWidth={12}/>
  <Rect x={-620} y={-230} width={280} height={160} fill={'#2A4549'}/>
  <Rect x={-15} y={125} width={730} height={34} fill={'#AB9477'} radius={8}/>
  <Rect x={-270} y={230} width={25} height={205} fill={'#52483E'}/><Rect x={250} y={230} width={25} height={205} fill={'#52483E'}/>
  <Circle x={400} y={-280} width={20} height={20} fill={P.amber} opacity={()=>0.15+reveal(p,4)*0.5}/>
 </Node>;
}
function paper(x:number,y:number,p:S,label:string,variant=0){
 return <Node x={()=>x+12*bound(p())} y={()=>y+18*bound(p())} rotation={variant%2?5:-5} opacity={()=>0.08+reveal(p,variant+1,8)*0.92}>
 <Rect width={285} height={191} radius={6} fill={'#E8DEC8'} stroke={'#A3A198'} lineWidth={7}/>
 <Rect y={-22} width={220} height={6} fill={'#A8A8A4'} opacity={0.72}/>
 <Rect y={13} width={172} height={6} fill={'#A8A8A4'} opacity={0.5}/>
 <Txt text={label} y={67} width={250} fontFamily={F} fontSize={24} fontWeight={700} fill={'#243440'} textAlign={'center'}/>
 </Node>;
}
function school(p:S){
 return <Node>{room(p)}
 <Rect x={-560} y={-227} width={440} height={190} fill={'#304D46'} stroke={'#9E8669'} lineWidth={12}/>
 <Txt text={'教室'} x={-560} y={-265} fontFamily={F} fontSize={42} fill={'#D2CAB5'}/>
 {[-660,-300,150,520].map((x,i)=><Node key={String(i)} x={x} y={190}><Rect width={235} height={24} radius={4} fill={'#AA8A65'}/><Rect y={80} x={-92} width={19} height={134} fill={'#50463C'}/><Rect y={80} x={92} width={19} height={134} fill={'#50463C'}/></Node>)}
 </Node>;
}
function pool(p:S,cracked=false){
 return <Node><Rect width={520} height={330} fill={'#315B6A'} stroke={'#A9D3D5'} lineWidth={19} radius={10} opacity={0.94}/>
 {Array.from({length:6},(_,i)=><Node key={String(i)} x={()=>-185+(i*71)+drift(p,48*(i%2?-1:1))} y={-95+(i%3)*80}><Circle width={32} height={17} fill={P.amber} opacity={0.82}/><Line points={[[20,0],[39,14],[39,-14],[20,0]]} stroke={P.amber} lineWidth={3}/></Node>)}
 {cracked&&<Node opacity={()=>reveal(p,5)}><Line points={[[0,-165],[45,-40],[-30,25],[90,164]]} stroke={'#F3ECE4'} lineWidth={9}/><Line points={[[42,-40],[159,-5],[230,94]]} stroke={'#F3ECE4'} lineWidth={7}/></Node>}</Node>;
}
function seesaw(p:S,imbalance=false){
 const tilt=()=>imbalance?bound(p())*15:3*Math.sin(Math.PI*bound(p())*2);
 return <Node>{backdrop('#2A4351')}<Rect y={260} width={1920} height={220} fill={'#3D5D5A'}/>
 <Line points={[[0,210],[0,52]]} stroke={P.pale} lineWidth={18}/>
 <Node rotation={tilt}><Rect width={1090} height={29} y={43} radius={5} fill={P.amber}/>
 {human(-420,-42,'#B88968',p,0.56)}{human(420,-42,'#6F91A7',p,0.56)}</Node>
 <Line points={[[-700,217],[700,217]]} stroke={'#99AD9E'} lineWidth={4} opacity={0.53}/>
 </Node>;
}
function roadCars(p:S,split=false){
 const sep=()=>split?bound(p())*370:0;
 return <Node>{backdrop('#172538')}{stars(16)}
 <Line points={[[-850,300],[-680,-230]]} stroke={'#5A6875'} lineWidth={240}/>
 <Line points={[[850,300],[680,-230]]} stroke={'#5A6875'} lineWidth={240}/>
 <Line points={[[-850,300],[-680,-230]]} stroke={P.pale} lineWidth={4} lineDash={[25,36]}/>
 <Line points={[[850,300],[680,-230]]} stroke={P.pale} lineWidth={4} lineDash={[25,36]}/>
 <Node x={()=>-350-sep()} y={()=>120-bound(p())*115}><Rect width={295} height={108} radius={18} fill={'#517F9A'}/><Rect y={-53} width={175} height={80} radius={20} fill={'#A8C8D2'}/><Circle x={-104} y={61} width={49} height={49} fill={'#1C252C'}/><Circle x={99} y={61} width={49} height={49} fill={'#1C252C'}/></Node>
 <Node x={()=>350+sep()} y={()=>120-bound(p())*115}><Rect width={304} height={110} radius={18} fill={'#E2B851'}/><Rect y={-53} width={180} height={77} radius={20} fill={'#C8DBD5'}/><Circle x={-105} y={61} width={51} height={51} fill={'#1C252C'}/><Circle x={103} y={61} width={51} height={51} fill={'#1C252C'}/></Node>
 </Node>;
}
function ladder(p:S){
 return <Node>{backdrop('#17293A')}
 {Array.from({length:6},(_,i)=><Rect key={String(i)} x={-450+i*160} y={270-i*85} width={190} height={36} fill={'#6A7280'} opacity={0.65}/>)}
 {human(-515,-175,'#B8886D',p,0.9,210)}
 {human(530,220,'#6688A0',p,0.77,-120)}
 <Line points={[[-700,-245],[700,-245]]} stroke={P.red} lineWidth={4} opacity={()=>reveal(p,5)*0.72}/>
 </Node>;
}
function memory(p:S,both=false){
 return <Node>{backdrop('#172635')}{stars(16)}
 <Rect x={-465} y={-10} width={710} height={580} fill={'#3D505B'} radius={18} stroke={P.amber} lineWidth={4}/>
 <Rect x={465} y={-10} width={710} height={580} fill={'#354B5A'} radius={18} stroke={P.red} lineWidth={4}/>
 {human(-465,130,'#B98C70',p,.92,0)}{human(465,130,'#71899B',p,.92,0)}
 <Circle x={-465} y={-198} width={()=>75+reveal(p,2)*95} height={()=>75+reveal(p,2)*95} stroke={P.amber} lineWidth={8}/>
 <Circle x={465} y={-198} width={()=>75+reveal(p,4)*175} height={()=>75+reveal(p,4)*175} stroke={P.red} lineWidth={8}/>
 {both&&<Line points={[[-210,-260],[210,-260]]} stroke={P.pale} lineWidth={5} opacity={()=>reveal(p,6)}/>}
 </Node>;
}
function textPanel(left:string,right:string,p:S){
 return <Node>{backdrop('#152638')}
 <Rect x={-442} width={800} height={540} y={-10} radius={22} fill={'#263D4A'} stroke={P.amber} lineWidth={5}/>
 <Rect x={442} width={800} height={540} y={-10} radius={22} fill={'#263743'} stroke={P.red} lineWidth={5}/>
 <Txt text={left} x={-442} y={0} width={700} fontFamily={F} fontSize={64} fontWeight={700} textAlign={'center'} fill={P.amber}/>
 <Txt text={right} x={442} y={0} width={700} fontFamily={F} fontSize={64} fontWeight={700} textAlign={'center'} fill={P.red}/>
 <Line points={[[-150,260],[150,260]]} stroke={P.muted} lineWidth={7} opacity={()=>reveal(p,4)}/>
 </Node>;
}
function dino(p:S,night=false){
 return <Node>{backdrop(night?'#141C30':'#304B52')}{stars(night?24:8)}
 <Rect y={300} width={1920} height={155} fill={'#526454'}/>
 <Node x={-80} y={36} opacity={()=>night?0.7:1}>
 <Rect x={0} y={100} width={500} height={166} radius={80} fill={'#648D74'}/>
 <Line points={[[185,60],[280,-185]]} stroke={'#648D74'} lineWidth={77}/>
 <Circle x={281} y={-204} width={107} height={96} fill={'#648D74'}/>
 <Circle x={315} y={-219} width={11} height={11} fill={'#182B32'}/>
 <Line points={[[-164,165],[-175,286]]} stroke={'#4D7362'} lineWidth={44}/>
 <Line points={[[144,165],[154,288]]} stroke={'#4D7362'} lineWidth={44}/>
 </Node>
 <Node x={()=>460+bound(p())*175} y={90}>{human(0,0,'#697A88',p,0.9)}</Node>
 {night&&<Txt text={'……名前が出てこない'} x={60} y={-332} fill={P.chalk} fontFamily={F} fontSize={46} opacity={()=>reveal(p,4)}/>}
 </Node>;
}
function flipBook(p:S){
 return <Node>{backdrop('#1A2B3D')}
 {Array.from({length:9},(_,i)=><Node key={String(i)} x={()=>-550+i*120+(i%2)*26} y={()=>-68+(i%3)*40+reveal(p,i,10)*48} rotation={i%2?5:-4} opacity={()=>0.13+reveal(p,i,10)*0.86}>
  <Rect width={370} height={310} fill={i%2?'#D7CBB3':'#9FAAB1'} stroke={P.chalk} lineWidth={10}/>
  <Rect width={165} height={123} y={-36} fill={i%2?'#607B84':'#A88173'} radius={12}/><Circle width={38} height={38} x={27} y={-36} fill={P.amber}/>
 </Node>)}
 </Node>;
}
function curtain(p:S){
 return <Node>{backdrop('#17222D')}
 <Rect x={-760} y={-80} width={()=>120+bound(p())*680} height={760} fill={'#6B383B'} opacity={0.53}/>
 <Rect x={760} y={-80} width={()=>120+bound(p())*680} height={760} fill={'#414D62'} opacity={0.63}/>
 <Line points={[[0,-410],[0,300]]} stroke={P.pale} lineWidth={5}/>
 <Circle x={0} y={-145} width={()=>165+bound(p())*170} height={()=>165+bound(p())*170} fill={P.red} opacity={0.6}/>
 </Node>;
}
function crossroads(p:S){
 return <Node>{path(p,true)}
 <Line points={[[0,325],[0,90],[-500,-235]]} stroke={'#8F9B9F'} lineWidth={170}/>
 <Line points={[[0,325],[0,90],[500,-235]]} stroke={'#768D96'} lineWidth={170}/>
 <Line points={[[0,325],[0,90],[-500,-235]]} stroke={P.amber} lineWidth={5} lineDash={[15,25]}/>
 <Line points={[[0,325],[0,90],[500,-235]]} stroke={P.amber} lineWidth={5} lineDash={[15,25]}/>
 <Node x={()=>-85-400*bound(p())} y={()=>110-170*bound(p())} rotation={()=>-8*bound(p())}>
   {human(0,0,'#B98D6D',p,0.58)}
 </Node>
 <Node x={()=>90+400*bound(p())} y={()=>110-170*bound(p())} rotation={()=>8*bound(p())}>
   {human(0,0,'#6E90A5',p,0.58)}
 </Node>
 </Node>;
}

// Forty-two story-specific continuous spaces. Each uses progress-driven
// actions rather than a generic random icon/card deck. Original vector art only.
export function analysisVisual(ch:number,g:number,p:S){
 const id=ch*6+g;
 switch(id){
 // PROLOGUE
 case 0:return <Node>{path(p)}{childPair(p,-420,-160,115,470)}{title('あの帰り道の、最後の一回',-348,0,52)}<Circle x={()=>-610+bound(p())*600} y={290} width={27} height={27} fill={P.amber}/></Node>;
 case 1:return <Node>{crossroads(p)}{title('最後の「じゃあね」はいつだった？',-362,0,49)}</Node>;
 case 2:return <Node>{flipBook(p)}{title('記憶の中に、埋まっている',-357,0,52)}</Node>;
 case 3:return <Node>{backdrop(P.ink)}{stars(35)}{moon(p,25,-70,217)}<Txt text={'照れている？'} x={-445} y={195} fontFamily={F} fontSize={54} fill={P.amber} opacity={()=>reveal(p,3)}/><Txt text={'怒っている？'} x={462} y={195} fontFamily={F} fontSize={54} fill={P.red} opacity={()=>reveal(p,5)}/></Node>;
 case 4:return <Node>{memory(p,true)}{title('同じ時間、異なる記憶',-351,0,52)}</Node>;
 case 5:return <Node>{textPanel('位置関係','記憶と倫理',p)}<Txt text={'5つの解釈から、関係を読み解く'} fontFamily={F} fontSize={41} fill={P.chalk} y={295}/></Node>;
 // CHAPTER 1
 case 6:return <Node>{backdrop('#244A56')}<Rect x={-470} y={-190} width={830} height={33} fill={'#9AA59F'}/><Rect x={-470} y={-70} width={33} height={280} fill={'#7E918C'}/><Rect y={260} width={1920} height={205} fill={'#357382'}/>{human(-530,-217,'#BC8B6E',p,.64,130)}{human(400,160,'#628698',p,.60,-90)}<Node x={()=>-250+bound(p())*480} y={()=>-190+bound(p())*345} rotation={()=>bound(p())*180}><Rect width={90} height={12} fill={P.amber}/><Rect width={12} height={91} fill={P.amber}/></Node>{title('捨てた手裏剣を、拾った少年',-355,0,43)}</Node>;
 case 7:return <Node>{seesaw(p)}{title('二人が釣り合っていた',-360,0,50)}<Circle x={0} y={210} width={30} height={30} fill={P.red}/></Node>;
 case 8:return <Node>{path(p,true)}<Rect x={0} y={60} width={920} height={560} fill={'#152638'} opacity={0.47}/><Circle x={0} y={-50} width={380} height={380} stroke={P.muted} lineWidth={12} opacity={0.41}/>{childPair(p,-330,180,96,410)}{title('二人だけの歩き方',-350,0,52)}</Node>;
 case 9:return <Node>{school(p)}{Array.from({length:7},(_,i)=><Node key={String(i)} opacity={()=>i%3?1-reveal(p,5):1}>{human(-620+i*205,20,i%2?'#64899D':'#AC886D',p,.48)}</Node>)}{title('人気者が、教室で孤立するまで',-355,0,43)}</Node>;
 case 10:return <Node>{ladder(p)}<Txt text={'見る側'} x={-480} y={-340} fontFamily={F} fontSize={48} fill={P.amber}/><Txt text={'見られる側'} x={500} y={325} fontFamily={F} fontSize={48} fill={P.red}/></Node>;
 case 11:return <Node>{school(p)}<Node x={310} y={-25}>{pool(p)}</Node><Node x={-520} y={105}>{human(0,0,'#B78C70',p,.85)}</Node><Rect x={335} y={-15} width={()=>35+bound(p())*580} height={()=>35+bound(p())*320} stroke={P.amber} lineWidth={8} fill={'#00000000'} opacity={()=>reveal(p,4)*0.9}/>{title('観察と理解は、違う',-355,0,49)}</Node>;
 // CHAPTER 2
 case 12:return <Node>{room(p)}{human(-520,115,'#6C90A4',p,.8)}{human(430,115,'#BC8E70',p,.8)}<Line points={[[0,-210],[0,190]]} stroke={P.amber} lineWidth={15} opacity={()=>1-reveal(p,4)}/><Rect x={-30} y={-230} width={24} height={225} rotation={()=>bound(p())*90} fill={P.red}/>{title('遊びの代償は、同じではない',-345,0,47)}</Node>;
 case 13:return <Node>{school(p)}<Rect x={0} y={-80} width={310} height={430} radius={50} fill={'#677F93'}/><Node x={-70} y={-125}>{paper(0,0,p,'ごめんね',2)}</Node><Rect x={460} y={-70} width={310} height={360} stroke={P.red} lineWidth={9} fill={'#00000000'} opacity={()=>reveal(p,5)}/>{title('同じ行動を、盗みと誤解した',-353,0,45)}</Node>;
 case 14:return <Node>{school(p)}{paper(-520,-55,p,'小夏より',1)}{human(390,143,'#718B9E',p,.78)}<Circle x={415} y={-100} width={()=>130+bound(p())*250} height={()=>130+bound(p())*250} stroke={P.red} lineWidth={10} opacity={()=>reveal(p,4)}/>{title('偽の手紙',-357,0,55)}</Node>;
 case 15:return <Node>{school(p)}<Node x={270} y={-45}>{pool(p,true)}</Node>{human(-535,-80,'#B98D6D',p,.82)}{human(-450,218,'#688A9C',p,.7)}<Rect x={600} y={-235} width={60} height={60} rotation={()=>bound(p())*230} fill={P.amber} opacity={()=>1-reveal(p,6)}/>{title('割れた水槽、引き受けなかった責任',-357,0,45)}</Node>;
 case 16:return <Node>{backdrop('#1A2838')}<Rect x={-495} y={-28} width={695} height={545} fill={'#DED7C5'} radius={18}/><Txt text={'Bandura · 1999'} x={-500} y={-233} fontFamily={F} fontSize={39} fontWeight={700} fill={'#33414C'}/><Txt text={'道徳的離脱'} x={-495} y={-75} fontFamily={F} fontSize={64} fontWeight={700} fill={'#33414C'}/><Txt text={'責任の分散・結果の軽視'} x={-495} y={80} fontFamily={F} fontSize={34} fill={'#56646B'}/><Node x={340} y={-60}><Circle width={320} height={320} stroke={P.amber} lineWidth={11}/><Circle width={()=>40+bound(p())*220} height={()=>40+bound(p())*220} fill={P.red} opacity={0.38}/><Txt text={'悪いと知る'} y={-220} fill={P.pale} fontFamily={F} fontSize={39}/><Txt text={'行動する'} y={220} fill={P.chalk} fontFamily={F} fontSize={39}/></Node></Node>;
 case 17:return <Node>{memory(p)}<Rect y={270} width={()=>120+bound(p())*1250} height={13} fill={P.red}/>{title('その瞬間の沈黙は、何年も残る',-359,0,46)}</Node>;
 // CHAPTER 3
 case 18:return <Node>{backdrop(P.ink)}{stars(42)}{moon(p,0,-75,210)}<Txt x={-500} y={215} text={'照れ'} fontFamily={F} fontSize={90} fontWeight={700} fill={P.amber} opacity={()=>reveal(p,3)}/><Txt x={500} y={215} text={'怒り'} fontFamily={F} fontSize={90} fontWeight={700} fill={P.red} opacity={()=>reveal(p,5)}/></Node>;
 case 19:return <Node>{school(p)}{human(-560,115,'#B98C6B',p,.76)}{human(525,115,'#7092A0',p,.76)}{paper(0,-95,p,'謝りたい',1)}<Line points={[[-290,-210],[310,-210]]} stroke={P.amber} lineWidth={6} opacity={()=>reveal(p,6)}/>{title('一つの行動、二つの解釈',-359,0,48)}</Node>;
 case 20:return <Node>{textPanel('事実','解釈',p)}<Rect x={-450} y={-195} width={460} height={6} fill={P.amber} opacity={()=>reveal(p,2)}/><Rect x={450} y={205} width={460} height={6} fill={P.red} opacity={()=>reveal(p,6)}/></Node>;
 case 21:return <Node>{flipBook(p)}<Rect x={-450} y={270} width={()=>bound(p())*950} height={15} fill={P.amber}/>{title('思い出すたびに、意味が変わる',-367,0,48)}</Node>;
 case 22:return <Node>{memory(p,true)}<Txt text={'懐かしさ'} x={-460} y={-320} fill={P.amber} fontSize={46} fontFamily={F}/><Txt text={'怒り'} x={450} y={-320} fill={P.red} fontSize={46} fontFamily={F}/></Node>;
 case 23:return <Node>{curtain(p)}{title('幸せだったからこそ、傷になった',-349,0,49)}<Circle x={0} y={210} width={94} height={94} stroke={P.amber} lineWidth={8} opacity={()=>reveal(p,6)}/></Node>;
 // CHAPTER 4
 case 24:return <Node>{dino(p)}{paper(545,-130,p,'恐竜の図鑑',1)}{title('少年が知っていた、無数の名前',-351,0,45)}</Node>;
 case 25:return <Node>{dino(p,true)}<Circle x={30} y={-110} width={()=>bound(p())*630} height={()=>bound(p())*630} stroke={P.red} lineWidth={7} opacity={0.17}/></Node>;
 case 26:return <Node>{flipBook(p)}<Rect x={-320} y={200} width={()=>250+bound(p())*1070} height={17} fill={P.amber}/>{title('忘れた場所に、新しい人生が入る',-360,0,45)}</Node>;
 case 27:return <Node>{room(p)}
  <Node x={()=>-740+310*bound(p()/0.46)} y={112} rotation={()=>-8+8*bound(p()/0.45)}>
   {human(0,0,'#B7896C',p,1.13)}
  </Node>
  <Node x={()=>760-325*bound(p()/0.52)} y={112} rotation={()=>7-7*bound(p()/0.52)}>
   {human(0,0,'#728D9F',p,1.13)}
  </Node>
  <Rect x={0} y={163} width={865} height={32} fill={P.amber} opacity={0.84}/>
  <Node x={()=>430-360*bound((p()-0.32)/0.32)} y={70} opacity={()=>reveal(p,3,9)}>
   <Rect width={95} height={13} fill={P.chalk}/><Circle y={-20} width={52} height={23} fill={P.pale}/>
  </Node>
  <Node x={()=>-430+370*bound((p()-0.46)/0.35)} y={70} opacity={()=>reveal(p,4,9)}>
   <Rect width={95} height={13} fill={P.chalk}/><Circle y={-20} width={52} height={23} fill={P.pale}/>
  </Node>
  <Node x={()=>-210+420*bound((p()-0.57)/0.42)} y={()=>-140-110*bound((p()-0.57)/0.42)} rotation={()=>-14+23*bound((p()-0.57)/0.42)} opacity={()=>reveal(p,5,9)}>
   <Rect width={340} height={210} radius={11} fill={'#D9C7AC'} stroke={P.chalk} lineWidth={10}/>
   <Txt text={'あの頃の相棒'} fontSize={31} fontWeight={700} fontFamily={F} fill={'#294255'} y={50}/>
  </Node>
  <Txt text={'自分は覚えていない。相手は覚えていた。'} y={-343} fill={P.chalk} fontFamily={F} fontSize={42} opacity={()=>reveal(p,6,9)}/>
 </Node>;
 case 28:return <Node>{memory(p,true)}<Txt text={'傷つけられた記憶'} x={-440} y={-337} fontFamily={F} fontSize={41} fill={P.amber}/><Txt text={'救われた記憶'} x={465} y={-337} fontFamily={F} fontSize={41} fill={P.red}/></Node>;
 case 29:return <Node>{backdrop('#182935')}{Array.from({length:9},(_,i)=><Node key={String(i)} x={-640+i%3*630} y={-260+Math.floor(i/3)*220} opacity={()=>reveal(p,i,10)}><Rect width={410} height={188} radius={12} fill={i%2?'#465967':'#4A6E70'} stroke={'#879B9E'} lineWidth={5}/><Circle x={-112} width={73} height={73} fill={P.amber} opacity={0.5}/><Line points={[[-35,12],[145,12]]} stroke={P.pale} lineWidth={7}/></Node>)}{title('誰かの記憶に、知らない自分がいる',-361,0,44)}</Node>;
 // CHAPTER 5
 case 30:return <Node>{path(p,true)}{human(-500,70,'#B8876E',p,1.05,140)}{human(520,70,'#788F9F',p,1.05,-140)}<Line points={[[0,-320],[0,320]]} stroke={P.pale} lineWidth={9} opacity={0.25}/>{title('同じ学校から、別々の生活へ',-360,0,46)}</Node>;
 case 31:return <Node>{roadCars(p)}{title('最後の再会は、同じ高さだった',-362,0,46)}</Node>;
 case 32:return <Node>{backdrop('#1A2B3A')}<Node x={-480} y={-40}>{seesaw(p,true)}</Node><Line points={[[-630,-280],[630,155]]} stroke={P.red} lineWidth={10} opacity={()=>reveal(p,3)}/><Line points={[[-610,150],[610,150]]} stroke={P.amber} lineWidth={10} opacity={()=>reveal(p,5)}/>{title('上下から、水平へ',-358,0,62)}</Node>;
 case 33:return <Node>{roadCars(p,true)}{title('対等でも、同じ道を歩くとは限らない',-358,0,44)}</Node>;
 case 34:return <Node>{backdrop('#192632')}{['赦し','和解','信頼'].map((name,i)=><Node key={String(i)} x={-570+i*570} y={-65} opacity={()=>reveal(p,i+1,7)}><Circle width={295} height={295} stroke={[P.red,P.amber,P.cyan][i]} lineWidth={11}/><Txt text={name} fill={P.chalk} fontSize={60} fontWeight={700} fontFamily={F}/></Node>)}<Line points={[[-510,190],[560,190]]} lineWidth={8} stroke={P.pale} opacity={()=>reveal(p,6)}/>{title('三つは、同じではない',-355,0,50)}</Node>;
 case 35:return <Node>{backdrop(P.deep)}{stars(25)}
  <Circle x={()=>-595+350*bound(p())} y={()=>-95+60*bound(p())} width={()=>440+75*bound(p())} height={()=>440+75*bound(p())} stroke={P.amber} lineWidth={10}/>
  <Circle x={()=>595-350*bound(p())} y={()=>10-45*bound(p())} width={()=>530-25*bound(p())} height={()=>530-25*bound(p())} stroke={P.blue} lineWidth={10}/>
  <Node x={()=>-590+350*bound(p())} y={()=>64-30*bound(p())} rotation={()=>8-8*bound(p())}>
   {human(0,0,'#B8876E',p,1.15)}
  </Node>
  <Node x={()=>590-350*bound(p())} y={()=>52+20*bound(p())} rotation={()=>-9+9*bound(p())}>
   {human(0,0,'#758D9E',p,1.15)}
  </Node>
  <Line points={()=>[[-315+170*bound(p()),-35],[315-170*bound(p()),-35]]} stroke={P.red} lineWidth={10} opacity={()=>0.2+reveal(p,3,8)*0.78}/>
  <Txt text={'あいつは宇宙人'} x={()=>-400+170*bound(p())} y={-339} fontFamily={F} fontSize={48} fill={P.amber} opacity={()=>1-reveal(p,4,9)}/>
  <Txt text={'我々は宇宙人'} x={()=>310-300*bound(p())} y={-340} fontFamily={F} fontWeight={700} fontSize={59} fill={P.chalk} opacity={()=>reveal(p,4,9)}/>
  <Rect x={0} y={285} width={()=>20+850*bound(p())} height={9} fill={P.pale} opacity={0.73}/>
  <Txt text={'理解できないまま、同じ高さに立つ'} y={333} fontFamily={F} fontSize={31} fill={P.chalk} opacity={()=>reveal(p,6,9)}/>
 </Node>;
 // EPILOGUE
 case 36:return <Node>{seesaw(p)}{title('釣り合っていた時間は、確かにあった',-358,0,46)}</Node>;
 case 37:return <Node>{memory(p,true)}<Rect y={260} width={()=>200+bound(p())*1190} height={12} fill={P.red}/>{title('一人は傷つけ、一人は誰かを救った',-364,0,46)}</Node>;
 case 38:return <Node>{backdrop(P.ink)}{stars(27)}{moon(p,0,-85,200)}<Txt x={-510} y={220} text={'照れている'} fontSize={58} fill={P.amber} fontFamily={F} opacity={()=>reveal(p,2)}/><Txt x={520} y={220} text={'怒っている'} fontSize={58} fill={P.red} fontFamily={F} opacity={()=>reveal(p,5)}/></Node>;
 case 39:return <Node>{curtain(p)}{childPair(p,-340,340,130,0)}{title('完全に理解できなくても',-358,0,53)}</Node>;
 case 40:return <Node>{roadCars(p,true)}{title('同じ高さで、それぞれの人生へ',-355,0,46)}</Node>;
 case 41:return <Node>{crossroads(p)}
  <Circle x={()=>490-220*bound(p())} y={-250} width={()=>125+75*bound(p())} height={()=>125+75*bound(p())} fill={P.red} opacity={()=>0.04+0.13*bound(p())}/>
  <Txt text={'最後の「じゃあね」'} y={-363} fontFamily={F} fontWeight={700} fontSize={79} fill={P.chalk}/>
  <Txt text={'和解か、決別か。'} y={225} fontFamily={F} fontSize={40} fill={P.chalk} opacity={()=>reveal(p,4,9)}/>
  <Line points={()=>[[-680+480*bound(p()),308],[680-480*bound(p()),308]]} stroke={P.amber} lineWidth={7} opacity={()=>0.2+0.65*bound(p())}/>
 </Node>;
 default:return <Node>{backdrop()} {title('我々は宇宙人')}</Node>;
 }
}
