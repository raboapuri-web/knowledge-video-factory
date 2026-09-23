import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';

/** Independent 2D SVG rig for a female laboratory researcher. */
export type ResearcherWomanAction='idle'|'walk'|'inspectFlask'|'point';
export type ResearcherWomanJoints={
  leftShoulder:number;leftElbow:number;rightShoulder:number;rightElbow:number;
  leftHip:number;leftKnee:number;rightHip:number;rightKnee:number;
  headTilt:number;bodyLean:number;
};
export type RESEARCHER_WOMANProps={
  x?:number;y?:number;scale?:number;action?:ResearcherWomanAction;
  walkSpeed?:number;pose?:Partial<ResearcherWomanJoints>;mirror?:boolean;
  talking?:boolean;showFlask?:boolean;
  labCoatColor?:string;shirtColor?:string;pantsColor?:string;
  skinColor?:string;hairColor?:string;shoeColor?:string;flaskLiquidColor?:string;
};
const base:ResearcherWomanJoints={
  leftShoulder:7,leftElbow:-8,rightShoulder:-7,rightElbow:8,
  leftHip:0,leftKnee:5,rightHip:0,rightKnee:5,headTilt:0,bodyLean:0
};
const clampAngle=(v:number)=>Number.isFinite(v)?Math.max(-165,Math.min(165,v)):0;
/** Deterministic poses. Explicit pose overrides take priority for composition. */
export const getResearcherWomanPose=(
  action:ResearcherWomanAction,seconds:number,walkSpeed=1.05,
  overrides:Partial<ResearcherWomanJoints>={}
):ResearcherWomanJoints=>{
  const t=Number.isFinite(seconds)?seconds:0;
  const cycle=Math.sin(t*Math.PI*2*Math.max(.05,walkSpeed));
  const j:ResearcherWomanJoints={...base};
  switch(action){
    case 'walk':
      j.leftShoulder=cycle*22;j.rightShoulder=-cycle*22;
      j.leftElbow=-7-Math.max(0,cycle)*13;
      j.rightElbow=7+Math.max(0,-cycle)*13;
      j.leftHip=-cycle*28;j.rightHip=cycle*28;
      j.leftKnee=5+Math.max(0,cycle)*33;
      j.rightKnee=5+Math.max(0,-cycle)*33;
      j.bodyLean=2;break;
    case 'inspectFlask':
      // Raise the flask close to the face while leaving the free arm relaxed.
      // The held flask is attached to the right FOREARM rather than screen space.
      j.leftShoulder=3;j.leftElbow=0;
      j.rightShoulder=-38;j.rightElbow=119;
      j.headTilt=6;j.bodyLean=2;break;
    case 'point':
      j.rightShoulder=-92;j.rightElbow=0;
      j.leftShoulder=5;j.headTilt=-2;j.bodyLean=-2;break;
    default:
      j.leftShoulder+=Math.sin(t*1.2)*1.3;
      j.rightShoulder-=Math.sin(t*1.2)*1.3;
      j.headTilt=Math.sin(t*.8);
  }
  for(const key of Object.keys(overrides) as (keyof ResearcherWomanJoints)[]){
    const v=overrides[key];
    if(typeof v==='number'&&Number.isFinite(v))j[key]=v;
  }
  for(const key of Object.keys(j) as (keyof ResearcherWomanJoints)[])j[key]=clampAngle(j[key]);
  return j;
};
const Hinge=({x,y,angle,children}:{x:number;y:number;angle:number;children:React.ReactNode})=>
  <g transform={'translate('+x+' '+y+') rotate('+angle+')'}>{children}</g>;
const Leg=({x,hip,knee,pants,shoe}:{
  x:number;hip:number;knee:number;pants:string;shoe:string
})=><Hinge x={x} y={360} angle={hip}>
  <rect x={-16} width={32} height={127} rx={13} fill={pants} stroke="#28313b" strokeWidth={3}/>
  <circle cy={116} r={16} fill={pants} stroke="#28313b" strokeWidth={2.5}/>
  <Hinge x={0} y={116} angle={knee}>
    <rect x={-14} width={28} height={117} rx={12} fill={pants} stroke="#28313b" strokeWidth={3}/>
    <circle cy={108} r={13} fill={pants} stroke="#28313b" strokeWidth={2}/>
    <path d="M-13 107 H14 L32 125 Q36 137 21 141 H-18 Q-27 138 -23 127Z"
      fill={shoe} stroke="#202632" strokeWidth={3}/>
  </Hinge>
</Hinge>;
const Flask=({liquid,rotation}:{liquid:string;rotation:number})=>
  <g transform={'translate(0 103) rotate('+rotation+') scale(1.15)'}>
  {/* The flask neck sits between thumb and fingers; entire flask follows hand. */}
  <path d="M-8 -57 H8 V-34 L24 -7 Q30 8 15 12 H-15 Q-30 8 -24 -7 L-8 -34Z"
    fill="#e0f8fa" fillOpacity={.62} stroke="#2a7385" strokeWidth={3} strokeLinejoin="round"/>
  <path d="M-19 -6 Q0 -2 19 -6 L23 2 Q25 8 15 9 H-15 Q-25 8 -23 2Z"
    fill={liquid} opacity={.97}/>
  <path d="M-11 -58 H11" stroke="#427c8f" strokeWidth={3} strokeLinecap="round"/>
  <path d="M-4 -41 V-22" stroke="#ffffff" strokeWidth={3} opacity={.85}/>
</g>;
const Arm=({x,shoulder,elbow,coat,skin,liquid,holdFlask=false,flaskRotation=0}:{
  x:number;shoulder:number;elbow:number;coat:string;skin:string;
  liquid:string;holdFlask?:boolean;flaskRotation?:number;
})=><Hinge x={x} y={204} angle={shoulder}>
  <rect x={-18} width={36} height={104} rx={17} fill={coat} stroke="#83969f" strokeWidth={3}/>
  <circle cy={94} r={19} fill={coat} stroke="#83969f" strokeWidth={3}/>
  <Hinge x={0} y={94} angle={elbow}>
    <rect x={-15} width={30} height={91} rx={14} fill={coat} stroke="#83969f" strokeWidth={3}/>
    <rect x={-15} y={78} width={30} height={12} rx={3} fill="#d9eaf0"/>
    <ellipse cy={97} rx={13} ry={15} fill={skin} stroke="#af826b" strokeWidth={2}/>
    {/* Glass is in FRONT of palm, fingers draw over its neck. Its wrist correction
        preserves a recognizable upright flask while shoulder/elbow change. */}
    {holdFlask&&<Flask liquid={liquid} rotation={flaskRotation}/>}
    {holdFlask&&<path d="M-13 91 Q-4 82 7 90 L7 105 Q-2 108 -12 101Z"
      fill={skin} stroke="#af826b" strokeWidth={1.4}/>}
  </Hinge>
</Hinge>;

/** 360x640 transparent character overlay; does not flatten the laboratory background. */
export const RESEARCHER_WOMAN=({
  x=780,y=180,scale=1,action='idle',walkSpeed=1.05,pose,
  mirror=false,talking=false,showFlask=false,
  labCoatColor='#f6f9f9',shirtColor='#cfbfdb',pantsColor='#424b60',
  skinColor='#edbfa7',hairColor='#403640',shoeColor='#2e323e',
  flaskLiquidColor='#7dbbc6'
}:RESEARCHER_WOMANProps)=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
  const j=getResearcherWomanPose(action,t,walkSpeed,pose);
  const bob=action==='walk'?-Math.abs(Math.sin(t*Math.PI*2*walkSpeed))*4:Math.sin(t*1.4)*1.2;
  const open=talking&&Math.sin(t*23)>0;
  const s=Number.isFinite(scale)&&scale>0?scale:1;
  const holdFlask=showFlask||action==='inspectFlask';
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640"
    aria-label="可動関節を備えた白衣姿の女性研究員"
    style={{position:'absolute',left:x,top:y,width:360*s,height:640*s,
      overflow:'visible',pointerEvents:'none'}}>
    <g transform={mirror?'translate(360 0) scale(-1 1)':undefined}>
      <g transform={'translate(0 '+bob+')'}>
        <g transform={'rotate('+j.bodyLean+' 180 371)'}>
          <Leg x={151} hip={j.leftHip} knee={j.leftKnee} pants={pantsColor} shoe={shoeColor}/>
          <Leg x={209} hip={j.rightHip} knee={j.rightKnee} pants={pantsColor} shoe={shoeColor}/>
          {/* Far arm behind the white coat. */}
          <Arm x={121} shoulder={j.leftShoulder} elbow={j.leftElbow}
            coat={labCoatColor} skin={skinColor} liquid={flaskLiquidColor}/>
          {/* White lab coat with slightly fitted waist; the shirt underneath
              stays a plain front-buttoned shirt, never a decorative bow/heart. */}
          <path d="M137 175 Q180 160 223 175 L250 220 L230 296 L236 383
                   Q180 402 124 383 L130 296 L110 220Z"
            fill={labCoatColor} stroke="#869ca6" strokeWidth={4} strokeLinejoin="round"/>
          <path d="M156 180 Q180 170 204 180 L204 367
                   Q180 372 156 367Z" fill={shirtColor}/>
          {/* Simple narrow collar and darker vertical shirt placket. */}
          <path d="M157 181 L175 197 L170 213 L155 194Z
                   M203 181 L185 197 L190 213 L205 194Z"
            fill="#d7e9ee" stroke="#9bbcc7" strokeWidth={2}/>
          <path d="M180 202 V363" stroke="#92b4c0" strokeWidth={2}/>
          <circle cx={180} cy={239} r={2.5} fill="#7194a2"/>
          <circle cx={180} cy={266} r={2.5} fill="#7194a2"/>
          <path d="M146 175 Q155 204 170 279 L142 243 L151 221 L140 209Z
                   M214 175 Q205 204 190 279 L218 243 L209 221 L220 209Z"
            fill="#ffffff" stroke="#9aabb3" strokeWidth={2}/>
          {/* Lab coat covers the shirt toward the waist but remains visibly open. */}
          <path d="M128 268 L153 283 L156 368 L181 389 L126 378Z
                   M232 268 L207 283 L204 368 L179 389 L234 378Z"
            fill="#f2f5f6" stroke="#9aabb3" strokeWidth={2}/>
          <path d="M129 297 H156 V335 H129Z M204 297 H231 V335 H204Z"
            fill="none" stroke="#9aaeb7" strokeWidth={2.5}/>
          <path d="M129 301 H156 M204 301 H231" stroke="#9aaeb7" strokeWidth={2}/>
          {/* ID badge at chest, tiny color stripes but no text. */}
          <rect x={211} y={233} width={25} height={34} rx={3}
            fill="#eaf3f4" stroke="#7b949e" strokeWidth={2}/>
          <circle cx={219} cy={244} r={4} fill="#8eb7c4"/>
          <path d="M215 254 H232 M215 258 H228" stroke="#9db3b9" strokeWidth={2}/>
          <circle cx={197} cy={315} r={3} fill="#879ba7"/>
          <circle cx={197} cy={344} r={3} fill="#879ba7"/>
          {/* Right arm and actual carried flask render in front of coat. */}
          <Arm x={239} shoulder={j.rightShoulder} elbow={j.rightElbow}
            coat={labCoatColor} skin={skinColor} liquid={flaskLiquidColor}
            holdFlask={holdFlask} flaskRotation={-j.rightShoulder-j.rightElbow}/>
          {/* Female researcher: shoulder-length bob rendered behind the neck
              and face, so the chin remains connected to the white coat collar. */}
          <Hinge x={180} y={169} angle={j.headTilt}>
            {/* Medium bob behind the face with soft outward-curving ends. */}
            <path d="M-47 -91 Q-57 -138 -28 -153 Q0 -169 30 -152
                     Q54 -135 49 -91 L54 5 Q41 26 27 14
                     Q13 3 0 8 Q-13 3 -27 14 Q-43 26 -54 5Z"
              fill={hairColor} stroke="#332c35" strokeWidth={2}/>
            {/* This skin neck is in FRONT of the back hair; overlap ensures no gap. */}
            <rect x={-12} y={-31} width={24} height={49} rx={9} fill={skinColor}/>
            <ellipse cx={-43} cy={-68} rx={8} ry={12} fill={skinColor}/>
            <ellipse cx={43} cy={-68} rx={8} ry={12} fill={skinColor}/>
            {/* A rounded but adult face with a softly tapered chin. */}
            <path d="M-43 -92 Q-43 -140 0 -146 Q43 -140 43 -92
                     L40 -58 Q29 -27 0 -22 Q-29 -27 -40 -58Z"
              fill={skinColor} stroke="#b18774" strokeWidth={2}/>
            {/* Natural side part and bangs, no ponytail, hair accessories or ribbons. */}
            <path d="M-45 -98 Q-49 -137 -28 -153 Q0 -170 29 -153
                     Q49 -142 46 -98 Q31 -118 20 -125
                     Q1 -105 -21 -114 Q-31 -103 -45 -98Z"
              fill={hairColor}/>
            <path d="M-44 -95 Q-52 -61 -44 -34 L-38 -29 Q-44 -50 -39 -77Z
                     M44 -95 Q52 -61 44 -34 L38 -29 Q44 -50 39 -77Z"
              fill={hairColor}/>
            <path d="M-28 -80 Q-21 -84 -14 -81 M14 -81 Q21 -84 28 -80"
              stroke="#65515a" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
            <ellipse cx={-20} cy={-73} rx={3.5} ry={4.5} fill="#34313b"/>
            <ellipse cx={20} cy={-73} rx={3.5} ry={4.5} fill="#34313b"/>
            <circle cx={-19} cy={-75} r={1.1} fill="#ffffff"/>
            <circle cx={21} cy={-75} r={1.1} fill="#ffffff"/>
            <path d="M0 -68 L-2 -57 L2 -56" stroke="#c0907f" strokeWidth={1.7}
              fill="none" strokeLinecap="round"/>
            {open?<ellipse cx={0} cy={-43} rx={6} ry={4.5} fill="#995c62"/>
              :<path d="M-7 -43 Q0 -38 7 -43" stroke="#995c62"
                strokeWidth={2} fill="none" strokeLinecap="round"/>}
          </Hinge>
        </g>
      </g>
    </g>
  </svg>;
};

/** 4 motions, each 2 seconds. Pure neutral preview needs no external image. */
export const RESEARCHER_WOMANPreview=()=>{
  const frame=useCurrentFrame();
  const action:ResearcherWomanAction=
    frame<60?'idle':frame<120?'walk':frame<180?'inspectFlask':'point';
  return <AbsoluteFill style={{background:'#e6eff3',overflow:'hidden'}}>
    <div style={{position:'absolute',left:0,right:0,top:820,bottom:0,background:'#c5d5da'}}/>
    <RESEARCHER_WOMAN x={780} y={181} action={action} talking={action==='point'}/>
  </AbsoluteFill>;
};
