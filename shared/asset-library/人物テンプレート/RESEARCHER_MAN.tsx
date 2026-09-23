import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';

/** Independent 2D SVG rig for a male laboratory researcher. */
export type ResearcherAction='idle'|'walk'|'inspectFlask'|'point';
export type ResearcherJoints={
  leftShoulder:number;leftElbow:number;rightShoulder:number;rightElbow:number;
  leftHip:number;leftKnee:number;rightHip:number;rightKnee:number;
  headTilt:number;bodyLean:number;
};
export type RESEARCHER_MANProps={
  x?:number;y?:number;scale?:number;action?:ResearcherAction;
  walkSpeed?:number;pose?:Partial<ResearcherJoints>;mirror?:boolean;
  talking?:boolean;showFlask?:boolean;
  labCoatColor?:string;shirtColor?:string;pantsColor?:string;
  skinColor?:string;hairColor?:string;shoeColor?:string;flaskLiquidColor?:string;
};
const base:ResearcherJoints={
  leftShoulder:7,leftElbow:-8,rightShoulder:-7,rightElbow:8,
  leftHip:0,leftKnee:5,rightHip:0,rightKnee:5,headTilt:0,bodyLean:0
};
const clampAngle=(v:number)=>Number.isFinite(v)?Math.max(-165,Math.min(165,v)):0;
/** Deterministic poses. Explicit pose overrides take priority for composition. */
export const getResearcherPose=(
  action:ResearcherAction,seconds:number,walkSpeed=1.05,
  overrides:Partial<ResearcherJoints>={}
):ResearcherJoints=>{
  const t=Number.isFinite(seconds)?seconds:0;
  const cycle=Math.sin(t*Math.PI*2*Math.max(.05,walkSpeed));
  const j:ResearcherJoints={...base};
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
  for(const key of Object.keys(overrides) as (keyof ResearcherJoints)[]){
    const v=overrides[key];
    if(typeof v==='number'&&Number.isFinite(v))j[key]=v;
  }
  for(const key of Object.keys(j) as (keyof ResearcherJoints)[])j[key]=clampAngle(j[key]);
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
const Flask=({liquid}:{liquid:string})=><g transform="translate(0 103)">
  {/* The flask neck sits between thumb and fingers; entire flask follows hand. */}
  <path d="M-8 -57 H8 V-34 L24 -7 Q30 8 15 12 H-15 Q-30 8 -24 -7 L-8 -34Z"
    fill="#d5f2f3" fillOpacity={.38} stroke="#427c8f" strokeWidth={3} strokeLinejoin="round"/>
  <path d="M-19 -6 Q0 -2 19 -6 L23 2 Q25 8 15 9 H-15 Q-25 8 -23 2Z"
    fill={liquid} opacity={.78}/>
  <path d="M-11 -58 H11" stroke="#427c8f" strokeWidth={3} strokeLinecap="round"/>
  <path d="M-4 -41 V-22" stroke="#ffffff" strokeWidth={3} opacity={.85}/>
</g>;
const Arm=({x,shoulder,elbow,coat,skin,liquid,holdFlask=false}:{
  x:number;shoulder:number;elbow:number;coat:string;skin:string;
  liquid:string;holdFlask?:boolean;
})=><Hinge x={x} y={204} angle={shoulder}>
  <rect x={-18} width={36} height={104} rx={17} fill={coat} stroke="#83969f" strokeWidth={3}/>
  <circle cy={94} r={19} fill={coat} stroke="#83969f" strokeWidth={3}/>
  <Hinge x={0} y={94} angle={elbow}>
    <rect x={-15} width={30} height={91} rx={14} fill={coat} stroke="#83969f" strokeWidth={3}/>
    <rect x={-15} y={78} width={30} height={12} rx={3} fill="#d9eaf0"/>
    {/* Controlled by both shoulder and elbow; not an absolute-position prop. */}
    {holdFlask&&<Flask liquid={liquid}/>}
    <ellipse cy={97} rx={13} ry={15} fill={skin} stroke="#af826b" strokeWidth={2}/>
    {holdFlask&&<path d="M-13 91 Q-4 82 7 90 L7 105 Q-2 108 -12 101Z"
      fill={skin} stroke="#af826b" strokeWidth={1.4}/>}
  </Hinge>
</Hinge>;

/** 360x640 transparent character overlay; does not flatten the laboratory background. */
export const RESEARCHER_MAN=({
  x=780,y=180,scale=1,action='idle',walkSpeed=1.05,pose,
  mirror=false,talking=false,showFlask=false,
  labCoatColor='#f5f8f9',shirtColor='#b5d7df',pantsColor='#35465b',
  skinColor='#ddb093',hairColor='#303945',shoeColor='#263443',
  flaskLiquidColor='#7bccb0'
}:RESEARCHER_MANProps)=>{
  const frame=useCurrentFrame();const {fps}=useVideoConfig();const t=frame/fps;
  const j=getResearcherPose(action,t,walkSpeed,pose);
  const bob=action==='walk'?-Math.abs(Math.sin(t*Math.PI*2*walkSpeed))*4:Math.sin(t*1.4)*1.2;
  const open=talking&&Math.sin(t*23)>0;
  const s=Number.isFinite(scale)&&scale>0?scale:1;
  const holdFlask=showFlask||action==='inspectFlask';
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640"
    aria-label="可動関節を備えた白衣姿の男性研究員"
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
          {/* Shirt, straight white open lab coat, lapels and stitched front pockets. */}
          <path d="M137 175 Q180 160 223 175 L250 220 L236 383
                   Q180 402 124 383 L110 220Z"
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
            holdFlask={holdFlask}/>
          {/* Skin neck lies under chin and overlaps the upper shirt collar. */}
          <Hinge x={180} y={169} angle={j.headTilt}>
            <rect x={-13} y={-30} width={26} height={47} rx={9} fill={skinColor}/>
            <ellipse cx={-43} cy={-67} rx={9} ry={14} fill={skinColor}/>
            <ellipse cx={43} cy={-67} rx={9} ry={14} fill={skinColor}/>
            <path d="M-44 -91 Q-44 -144 0 -147 Q44 -144 44 -91
                     L40 -59 Q30 -28 0 -23 Q-30 -28 -40 -59Z"
              fill={skinColor} stroke="#ac816d" strokeWidth={2}/>
            {/* Short professional haircut, forehead visible. */}
            <path d="M-45 -91 Q-52 -141 -24 -152 L-18 -160 L-4 -155
                     Q20 -161 36 -146 Q50 -132 46 -91
                     L35 -109 Q13 -101 -10 -117 Q-23 -105 -44 -102Z"
              fill={hairColor}/>
            {/* Friendly adult facial details, no added symbols or logos. */}
            <path d="M-29 -81 H-13 M13 -81 H29" stroke="#34323a" strokeWidth={3.6}
              strokeLinecap="round"/>
            <ellipse cx={-20} cy={-73} rx={3} ry={4} fill="#2b3542"/>
            <ellipse cx={20} cy={-73} rx={3} ry={4} fill="#2b3542"/>
            <path d="M0 -69 L-2 -56 L3 -54" stroke="#bb8c74" strokeWidth={2}
              fill="none" strokeLinecap="round"/>
            {open?<ellipse cx={0} cy={-43} rx={6} ry={5} fill="#92594d"/>
              :<path d="M-8 -42 Q0 -37 8 -42" stroke="#92594d" strokeWidth={2}
                fill="none" strokeLinecap="round"/>}
          </Hinge>
        </g>
      </g>
    </g>
  </svg>;
};

/** 4 motions, each 2 seconds. Pure neutral preview needs no external image. */
export const RESEARCHER_MANPreview=()=>{
  const frame=useCurrentFrame();
  const action:ResearcherAction=
    frame<60?'idle':frame<120?'walk':frame<180?'inspectFlask':'point';
  return <AbsoluteFill style={{background:'#e6eff3',overflow:'hidden'}}>
    <div style={{position:'absolute',left:0,right:0,top:820,bottom:0,background:'#c5d5da'}}/>
    <RESEARCHER_MAN x={780} y={181} action={action} talking={action==='point'}/>
  </AbsoluteFill>;
};
