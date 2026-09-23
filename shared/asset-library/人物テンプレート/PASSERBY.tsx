import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';

/** Five anonymous adults, independent jointed limbs. Faces have NO eyes/nose/mouth. */
export type PasserbyAction='idle'|'walk'|'photoFlash';
export type PasserbyJoint='leftShoulder'|'leftElbow'|'rightShoulder'|'rightElbow'|'leftHip'|'leftKnee'|'rightHip'|'rightKnee'|'bodyLean'|'headTilt';
export type PASSERBYProps={
  x?:number;y?:number;scale?:number;action?:PasserbyAction;
  pose?:Partial<Record<PasserbyJoint,number>>;walkSpeed?:number;
  /** Index of the sole phone photographer (other four do not flash). */
  photographerIndex?:0|1|2|3|4;
  photoStartFrame?:number;flashEnabled?:boolean;
};
type Look={sex:'man'|'woman';hairStyle:'short'|'swept'|'bob'|'long';
  top:string;shirt:string;pants:string;hair:string;skin:string;shoes:string;
  outfit:'jacket'|'hoodie'|'cardigan'|'shirt';x:number;y:number;size:number;phase:number};
const PEOPLE:Look[]=[
  {sex:'man',hairStyle:'short',top:'#546e86',shirt:'#dbe4ed',pants:'#2e4053',hair:'#34383f',skin:'#dcb39b',shoes:'#252f38',outfit:'jacket',x:575,y:458,size:.89,phase:.14},
  {sex:'woman',hairStyle:'bob',top:'#c17c79',shirt:'#f3d8c7',pants:'#5c5268',hair:'#493b42',skin:'#e9bda3',shoes:'#483a43',outfit:'cardigan',x:765,y:437,size:.95,phase:.42},
  {sex:'man',hairStyle:'swept',top:'#7f8a63',shirt:'#d5dfc5',pants:'#384c4e',hair:'#282e36',skin:'#bf9075',shoes:'#222932',outfit:'hoodie',x:955,y:412,size:1.08,phase:.03},
  {sex:'woman',hairStyle:'long',top:'#9c83aa',shirt:'#ede3f0',pants:'#353d56',hair:'#473743',skin:'#dcb69f',shoes:'#30313c',outfit:'jacket',x:1160,y:442,size:.94,phase:.75},
  {sex:'man',hairStyle:'short',top:'#659d99',shirt:'#f5ede1',pants:'#484d5a',hair:'#393440',skin:'#ebc4a8',shoes:'#30333b',outfit:'shirt',x:1342,y:452,size:.90,phase:.34}
];
const Hinge=({x,y,angle,children}:{x:number;y:number;angle:number;children:React.ReactNode})=>
  <g transform={'translate('+x+' '+y+') rotate('+angle+')'}>{children}</g>;
const Leg=({x,hip,knee,color,shoe}:{x:number;hip:number;knee:number;color:string;shoe:string})=>
  <Hinge x={x} y={200} angle={hip}>
    <rect x={-13} width={26} height={112} rx={12} fill={color} stroke="#26313e" strokeWidth={2.5}/>
    <circle cy={103} r={13} fill={color} stroke="#26313e" strokeWidth={2}/>
    <Hinge x={0} y={103} angle={knee}>
      <rect x={-11} width={22} height={98} rx={10} fill={color} stroke="#26313e" strokeWidth={2}/>
      <path d="M-12 91 H11 L31 106 Q37 121 17 124 H-16 Q-28 123 -24 110Z"
        fill={shoe} stroke="#252932" strokeWidth={2.4}/>
    </Hinge>
  </Hinge>;
const Arm=({x,shoulder,elbow,top,skin,phone=false,flash=false}:{
  x:number;shoulder:number;elbow:number;top:string;skin:string;phone?:boolean;flash?:boolean;
})=><Hinge x={x} y={57} angle={shoulder}>
  <rect x={-13} width={26} height={83} rx={12} fill={top} stroke="#37404b" strokeWidth={2.6}/>
  <circle cy={76} r={13} fill={top} stroke="#37404b" strokeWidth={2}/>
  <Hinge x={0} y={76} angle={elbow}>
    <rect x={-11} width={22} height={78} rx={11} fill={top} stroke="#37404b" strokeWidth={2.6}/>
    {/* Phone moves WITH the wrist: it is nested in shoulder and elbow hinges. */}
    {phone&&<g transform="translate(0 72) rotate(-9)">
      <rect x={-20} y={-46} width={40} height={63} rx={6}
        fill="#272c38" stroke="#141a24" strokeWidth={2.8}/>
      <rect x={-16} y={-42} width={32} height={53} rx={3} fill="#657c8d"/>
      <circle cx={9} cy={-35} r={3.1} fill="#d3e0e7"/>
      {/* Emit exclusively from the phone camera lens, following wrist movement. */}
      {flash&&<g transform="translate(9 -35)" style={{mixBlendMode:'screen'}}>
        <circle r={32} fill="#fffbe8" opacity={.76}/>
        <circle r={13} fill="#ffffff"/>
        <path d="M0 -48 L6 -17 L44 -29 L16 -6 L48 0 L16 6
                 L44 29 L6 17 L0 48 L-6 17 L-44 29 L-16 6
                 L-48 0 L-16 -6 L-44 -29 L-6 -17Z" fill="#fff7d0" opacity={.9}/>
      </g>}
    </g>}
    <ellipse cy={84} rx={10} ry={13} fill={skin} stroke="#9e7a68" strokeWidth={1.7}/>
    {phone&&<path d="M-9 79 Q0 65 11 75 L9 91 Q0 96 -8 88Z"
      fill={skin} stroke="#9e7a68" strokeWidth={1.4}/>}
  </Hinge>
</Hinge>;
const BlankFace=({person:p}:{person:Look})=><g>
  {p.hairStyle==='long'&&<path d="M-39 -49 Q-54 -87 -23 -112 Q9 -129 33 -103
    Q49 -87 41 -45 L44 22 Q21 38 13 21 L-12 21 Q-28 40 -43 21Z" fill={p.hair}/>}
  {p.hairStyle==='bob'&&<path d="M-40 -46 Q-51 -92 -18 -107 Q11 -116 35 -95
    Q52 -76 39 -38 L40 9 Q20 24 11 10 L-14 10 Q-29 23 -41 8Z" fill={p.hair}/>}
  <ellipse cx={-36} cy={-49} rx={8} ry={11} fill={p.skin}/>
  <ellipse cx={36} cy={-49} rx={8} ry={11} fill={p.skin}/>
  {/* Draw neck ABOVE back hair and UNDER blank face, connecting collar and chin. */}
  <rect x={-10} y={-20} width={20} height={73} rx={8} fill={p.skin}/>
  {/* Completely featureless face. */}
  <ellipse cx={0} cy={-54} rx={36} ry={41} fill={p.skin} stroke="#aa836f" strokeWidth={2}/>
  {p.hairStyle==='short'&&<path d="M-38 -65 Q-45 -101 -16 -105 Q8 -118 31 -101
    Q43 -87 38 -64 L32 -82 Q14 -73 0 -81 Q-22 -69 -37 -74Z" fill={p.hair}/>}
  {p.hairStyle==='swept'&&<path d="M-39 -62 Q-43 -105 -13 -112 L-4 -119 L8 -111
    Q30 -116 40 -84 L39 -59 Q23 -77 12 -87 Q-3 -70 -23 -73 Q-33 -62 -39 -62Z"
    fill={p.hair}/>}
  {p.hairStyle==='bob'&&<path d="M-38 -63 Q-42 -99 -15 -106 Q17 -117 39 -77
    L37 -58 Q19 -74 8 -82 Q-9 -65 -27 -68Z" fill={p.hair}/>}
  {p.hairStyle==='long'&&<path d="M-39 -66 Q-45 -105 -11 -115 Q21 -123 40 -89
    L40 -59 Q31 -70 20 -83 Q0 -66 -25 -75Z" fill={p.hair}/>}
</g>;
type Pose=Record<PasserbyJoint,number>;
const getPose=(action:PasserbyAction,t:number,p:Look,photographer:boolean,
  overrides:PASSERBYProps['pose'],speed:number):Pose=>{
  const v=Math.sin(t*Math.PI*2*speed+p.phase*Math.PI*2);
  const a:Pose={leftShoulder:6,leftElbow:-6,rightShoulder:-6,rightElbow:6,
    leftHip:0,leftKnee:4,rightHip:0,rightKnee:4,bodyLean:0,headTilt:0};
  if(action==='walk'){
    a.leftShoulder=v*23;a.rightShoulder=-v*23;
    a.leftHip=-v*22;a.rightHip=v*22;
    a.leftKnee=4+Math.max(0,v)*31;a.rightKnee=4+Math.max(0,-v)*31;
    a.bodyLean=2;
  }else if(action==='photoFlash'&&photographer){
    a.rightShoulder=-146;a.rightElbow=119;
    a.leftShoulder=146;a.leftElbow=-119;a.headTilt=2;
  }
  for(const k of Object.keys(overrides??{}) as PasserbyJoint[]){
    const v=overrides?.[k];if(typeof v==='number'&&Number.isFinite(v))
      a[k]=Math.max(-160,Math.min(160,v));
  }
  return a;
};
const Person=({p,index,action,frame,t,photoStartFrame,photographerIndex,pose,
  walkSpeed,flashEnabled}:{p:Look;index:number;action:PasserbyAction;frame:number;
  t:number;photoStartFrame:number;photographerIndex:number;pose:PASSERBYProps['pose'];
  walkSpeed:number;flashEnabled:boolean})=>{
  const photographer=action==='photoFlash'&&index===photographerIndex;
  const j=getPose(action,t,p,photographer,pose,walkSpeed);
  const v=Math.sin(t*Math.PI*2*walkSpeed+p.phase*Math.PI*2);
  const bob=action==='walk'?-Math.abs(v)*3:Math.sin(t*1.2+p.phase)*.6;
  const elapsed=frame-photoStartFrame;
  const flash=photographer&&flashEnabled&&elapsed>=0&&elapsed%45>=21&&elapsed%45<=23;
  const travel=action==='walk'?Math.min(Math.max(t,0),4)*9:0;
  return <g transform={'translate('+(p.x+travel)+' '+p.y+') scale('+p.size+')'}>
    <g transform={'translate(0 '+bob+')'}>
      <g transform={'rotate('+j.bodyLean+' 0 200)'}>
        <Leg x={-19} hip={j.leftHip} knee={j.leftKnee} color={p.pants} shoe={p.shoes}/>
        <Leg x={19} hip={j.rightHip} knee={j.rightKnee} color={p.pants} shoe={p.shoes}/>
        <Arm x={-44} shoulder={j.leftShoulder} elbow={j.leftElbow} top={p.top} skin={p.skin}/>
        <path d="M-37 44 Q0 35 37 44 L48 83 L38 209
                 Q0 218 -38 209 L-48 83Z" fill={p.top}
          stroke="#394653" strokeWidth={3} strokeLinejoin="round"/>
        {p.outfit==='jacket'&&<g>
          <path d="M-18 44 L0 69 L18 44 L16 137 Q0 142 -16 137Z" fill={p.shirt}/>
          <path d="M-21 44 L-4 120 L-30 87 L-18 69 L-29 61Z
                   M21 44 L4 120 L30 87 L18 69 L29 61Z"
            fill={p.top} stroke="#475364" strokeWidth={2}/>
          <circle cy={149} r={2.5} fill="#d8dee2"/>
        </g>}
        {p.outfit==='cardigan'&&<g>
          <path d="M-19 45 H19 V208 H-19Z" fill={p.shirt}/>
          <path d="M-24 45 L-14 44 L-12 208 L-38 207Z
                   M24 45 L14 44 L12 208 L38 207Z" fill={p.top}/>
          <circle cx={-13} cy={130} r={2.5} fill="#f0e2de"/>
        </g>}
        {p.outfit==='hoodie'&&<g>
          <path d="M-23 44 Q0 72 23 44" fill="none" stroke="#626f53" strokeWidth={9}/>
          <path d="M-11 61 L-12 85 M11 61 L12 85" stroke="#ebe7d1" strokeWidth={2.5}/>
          <path d="M-22 148 Q0 136 22 148 L17 176 Q0 184 -17 176Z"
            fill="#737f58" stroke="#5e694c" strokeWidth={2}/>
        </g>}
        {p.outfit==='shirt'&&<g>
          <path d="M-18 45 L0 63 L18 45 L10 78 L-10 78Z" fill={p.shirt}/>
          <path d="M0 63 V204" stroke="#507d7a" strokeWidth={2}/>
          <circle cy={106} r={2} fill={p.shirt}/>
          <circle cy={144} r={2} fill={p.shirt}/>
        </g>}
        <Arm x={44} shoulder={j.rightShoulder} elbow={j.rightElbow}
          top={p.top} skin={p.skin} phone={photographer} flash={flash}/>
        <Hinge x={0} y={2} angle={j.headTilt}><BlankFace person={p}/></Hinge>
      </g>
    </g>
  </g>;
};
export const PASSERBY=({x=0,y=0,scale=1,action='idle',pose={},
  walkSpeed=1.05,photographerIndex=2,photoStartFrame=0,flashEnabled=true}:PASSERBYProps)=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"
    aria-label="顔の特徴を描かない男女五人の通行人"
    style={{position:'absolute',inset:0,width:'100%',height:'100%',overflow:'visible',pointerEvents:'none'}}>
    <g transform={'translate('+x+' '+y+') scale('+scale+')'}>
      {PEOPLE.map((p,index)=><Person key={index} p={p} index={index}
        action={action} frame={frame} t={t} photoStartFrame={photoStartFrame}
        photographerIndex={photographerIndex} pose={pose}
        walkSpeed={walkSpeed} flashEnabled={flashEnabled}/>)}
    </g>
  </svg>;
};
export const PASSERBYPreview=()=>{
  const frame=useCurrentFrame();
  const action:PasserbyAction=frame<90?'idle':frame<180?'walk':'photoFlash';
  return <AbsoluteFill style={{background:'#dbe5ef'}}>
    <div style={{position:'absolute',left:0,right:0,top:820,bottom:0,background:'#bdc7d2'}}/>
    <PASSERBY action={action} photoStartFrame={180}/>
  </AbsoluteFill>;
};
