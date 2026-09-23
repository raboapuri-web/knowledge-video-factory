import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * 2D contemporary father. The drawing is original React SVG, not a bitmap.
 * Each limb is nested at its anatomical hinge: shoulder -> elbow -> wrist,
 * hip -> knee -> ankle. A pose angle controls the child as well as its descendants.
 * Angles are degrees; 0 = downward, positive = clockwise in the SVG viewport.
 */
export type ParentFatherAction='idle'|'walk'|'wave'|'point';
export type ParentFatherJoints={
  leftShoulder:number;leftElbow:number;rightShoulder:number;rightElbow:number;
  leftHip:number;leftKnee:number;rightHip:number;rightKnee:number;
  headTilt:number;bodyLean:number;
};
export type ParentFatherRigProps={
  /** Top-left of the 360 x 640 character in a 1920 x 1080 scene. */
  x?:number;y?:number;scale?:number;
  action?:ParentFatherAction;
  /** Walking cycles per second. All animation derives from Remotion frame/fps. */
  walkSpeed?:number;
  /** Override individual joint angles after the automatic action pose is computed. */
  pose?:Partial<ParentFatherJoints>;
  talking?:boolean;showBag?:boolean;mirror?:boolean;
  topColor?:string;pantsColor?:string;shirtColor?:string;
  skinColor?:string;hairColor?:string;shoeColor?:string;
};
const clampAngle=(n:number)=>Number.isFinite(n)?Math.max(-165,Math.min(165,n)):0;
const base:ParentFatherJoints={
  leftShoulder:7,leftElbow:-8,rightShoulder:-7,rightElbow:8,
  leftHip:0,leftKnee:4,rightHip:0,rightKnee:4,headTilt:0,bodyLean:0
};

/** Public pure function: test or storyboard a pose without running a React render. */
export const getParentFatherPose=(
  action:ParentFatherAction,seconds:number,walkSpeed=1.05,
  overrides:Partial<ParentFatherJoints>={}
):ParentFatherJoints=>{
  const t=Number.isFinite(seconds)?seconds:0;
  const wave=Math.sin(t*Math.PI*2*Math.max(.05,walkSpeed));
  const p:ParentFatherJoints={...base};
  if(action==='walk'){
    p.leftShoulder=wave*23;p.rightShoulder=-wave*23;
    p.leftElbow=-6-Math.max(0,wave)*14;
    p.rightElbow=6+Math.max(0,-wave)*14;
    p.leftHip=-wave*29;p.rightHip=wave*29;
    // These are localized knee bends, rather than rotation of the whole leg.
    p.leftKnee=5+Math.max(0,wave)*35;
    p.rightKnee=5+Math.max(0,-wave)*35;
    p.bodyLean=2;
  }else if(action==='wave'){
    p.rightShoulder=-142+Math.sin(t*7)*5;
    p.rightElbow=30+Math.sin(t*11)*22;
    p.leftShoulder=5;p.headTilt=-3;p.bodyLean=-2;
  }else if(action==='point'){
    p.rightShoulder=-92;p.rightElbow=0;
    p.leftShoulder=9;p.headTilt=-2;p.bodyLean=-2;
  }else{
    p.leftShoulder+=Math.sin(t*1.25)*1.5;
    p.rightShoulder-=Math.sin(t*1.25)*1.5;
    p.headTilt=Math.sin(t*.8)*1;
  }
  for(const key of Object.keys(overrides) as (keyof ParentFatherJoints)[]){
    const value=overrides[key];
    if(typeof value==='number'&&Number.isFinite(value))p[key]=value;
  }
  for(const key of Object.keys(p) as (keyof ParentFatherJoints)[])p[key]=clampAngle(p[key]);
  return p;
};

const Hinge=({x,y,angle,children}:{x:number;y:number;angle:number;children:React.ReactNode})=>
  <g transform={'translate('+x+' '+y+') rotate('+angle+')'}>{children}</g>;

const Leg=({x,y,hip,knee,color,shoe}:{x:number;y:number;hip:number;knee:number;color:string;shoe:string})=>
  <Hinge x={x} y={y} angle={hip}>
    <rect x={-17} y={0} width={34} height={126} rx={13} fill={color} stroke="#19202c" strokeWidth={3}/>
    <circle cx={0} cy={116} r={17} fill={color} stroke="#19202c" strokeWidth={3}/>
    <Hinge x={0} y={116} angle={knee}>
      <rect x={-15} y={0} width={30} height={117} rx={12} fill={color} stroke="#19202c" strokeWidth={3}/>
      <circle cx={0} cy={108} r={14} fill={color} stroke="#19202c" strokeWidth={2}/>
      <path d="M-13 107 L15 107 L36 123 Q41 138 22 141 L-20 141 Q-28 138 -25 127Z"
        fill={shoe} stroke="#131923" strokeWidth={3} strokeLinejoin="round"/>
    </Hinge>
  </Hinge>;

const Arm=({
  x,y,shoulder,elbow,suit,skin,briefcase=false
}:{
  x:number;y:number;shoulder:number;elbow:number;suit:string;skin:string;briefcase?:boolean
})=>
  <Hinge x={x} y={y} angle={shoulder}>
    <rect x={-18} y={0} width={36} height={105} rx={17} fill={suit} stroke="#192737" strokeWidth={3}/>
    <circle cx={0} cy={94} r={19} fill={suit} stroke="#192737" strokeWidth={3}/>
    <Hinge x={0} y={94} angle={elbow}>
      <rect x={-15} y={0} width={30} height={91} rx={14} fill={suit} stroke="#192737" strokeWidth={3}/>
      <rect x={-15} y={78} width={30} height={12} rx={3} fill="#e3e9ef"/>
      <circle cx={0} cy={98} r={14} fill={skin} stroke="#916b57" strokeWidth={2}/>
      {briefcase&&<g transform="translate(12 106)">
        {/* Optional canvas tote parented to the wrist, not a formal briefcase. */}
        <path d="M-3 5 V20 H18 V5" stroke="#9f896d" strokeWidth={5} fill="none"/>
        <path d="M-16 18 H37 L33 72 Q10 80 -13 72Z"
          fill="#d6c5a8" stroke="#97866c" strokeWidth={3}/>
        <path d="M-7 30 H27" stroke="#b29b78" strokeWidth={2}/>
      </g>}
    </Hinge>
  </Hinge>;

/** Transparent character layer. Place above the chosen scene background, below subtitles. */
export const ParentFatherRig=({
  x=780,y=180,scale=1,action='idle',walkSpeed=1.05,pose,
  talking=false,showBag=false,mirror=false,
  topColor='#67816c',pantsColor='#434b52',shirtColor='#eee4d1',
  skinColor='#e5b998',hairColor='#48434a',shoeColor='#414045'
}:ParentFatherRigProps)=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const t=frame/fps;
  const j=getParentFatherPose(action,t,walkSpeed,pose);
  const bob=action==='walk'?-Math.abs(Math.sin(t*Math.PI*2*walkSpeed))*4:Math.sin(t*1.6)*1.2;
  const mouthOpen=talking&&Math.sin(t*26)>0;
  const uniformScale=Number.isFinite(scale)&&scale>0?scale:1;
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640"
    aria-label="関節可動式の現代の父親（2Dベクター）"
    style={{position:'absolute',left:x,top:y,width:360*uniformScale,height:640*uniformScale,
      overflow:'visible',pointerEvents:'none'}}>
    <g transform={mirror?'translate(360 0) scale(-1 1)':undefined}>
      <g transform={'translate(0 '+bob+')'}>
        <g transform={'rotate('+j.bodyLean+' 180 370)'}>
          <Leg x={150} y={360} hip={j.leftHip} knee={j.leftKnee} color={pantsColor} shoe={shoeColor}/>
          <Leg x={210} y={360} hip={j.rightHip} knee={j.rightKnee} color={pantsColor} shoe={shoeColor}/>
          <Arm x={122} y={205} shoulder={j.leftShoulder} elbow={j.leftElbow}
            suit={topColor} skin={skinColor}/>
          {/* Everyday father's open knitted cardigan + flat cream crew-neck shirt. */}
          <path d="M137 177 Q180 158 223 177 L244 223 L232 365 Q180 383 128 365 L116 223Z"
            fill={topColor} stroke="#475c49" strokeWidth={4} strokeLinejoin="round"/>
          <path d="M156 180 Q180 172 204 180 L204 355 Q180 363 156 355Z"
            fill={shirtColor} stroke="#d1c5ad" strokeWidth={2}/>
          <path d="M157 181 Q180 203 203 181" stroke="#d0bba0"
            fill="none" strokeWidth={4} strokeLinecap="round"/>
          <path d="M145 180 L158 355 L129 365 L120 225 L138 185Z
                   M215 180 L202 355 L231 365 L240 225 L222 185Z"
            fill="#789277" stroke="#526d55" strokeWidth={2}/>
          <path d="M156 186 L163 347 M204 186 L197 347"
            stroke="#4e6751" strokeWidth={3} fill="none"/>
          <circle cx={202} cy={267} r={3} fill="#e7d4b8"/>
          <circle cx={202} cy={308} r={3} fill="#e7d4b8"/>
          <path d="M128 365 Q180 382 232 365" stroke="#475c49" strokeWidth={5} fill="none"/>
          <Arm x={238} y={205} shoulder={j.rightShoulder} elbow={j.rightElbow}
            suit={topColor} skin={skinColor} briefcase={showBag&&action!=='wave'&&action!=='point'}/>
          {/* Tilt only the head, pivoting at the neck. */}
          <Hinge x={180} y={169} angle={j.headTilt}>
            {/* Neck reaches under the chin and overlaps the shirt collar: no transparent gap during head tilt. */}
            <rect x={-14} y={-30} width={28} height={45} rx={9} fill={skinColor}/>
            <ellipse cx={-48} cy={-67} rx={9} ry={15} fill={skinColor}/>
            <ellipse cx={48} cy={-67} rx={9} ry={15} fill={skinColor}/>
            <path d="M-48 -91 Q-47 -145 0 -148 Q47 -145 48 -91 L44 -58 Q34 -27 0 -22 Q-34 -27 -44 -58Z"
              fill={skinColor} stroke="#916b57" strokeWidth={2}/>
            <path d="M-49 -91 Q-57 -146 -19 -154 Q10 -165 35 -149 Q56 -138 49 -91
                     L37 -106 Q8 -99 -17 -118 Q-29 -104 -48 -101Z" fill={hairColor}/>
            {/* Subtle gray temples give the father an adult everyday look. */}
            <path d="M-44 -99 L-31 -121 L-29 -100Z M44 -99 L31 -121 L29 -100Z"
              fill="#a19b9b" opacity={.78}/>
            <path d="M-31 -81 H-14 M14 -81 H31" stroke="#26313b" strokeWidth={4} strokeLinecap="round"/>
            <circle cx={-21} cy={-77} r={3} fill="#26313b"/>
            <circle cx={21} cy={-77} r={3} fill="#26313b"/>
            <path d="M0 -72 L-3 -58 L3 -57" fill="none" stroke="#af7f66" strokeWidth={2} strokeLinecap="round"/>
            {mouthOpen
              ?<ellipse cx={0} cy={-43} rx={7} ry={5} fill="#74443b"/>
              :<path d="M-8 -43 Q0 -39 8 -43" fill="none" stroke="#74443b" strokeWidth={2}/>}
          </Hinge>
        </g>
      </g>
    </g>
  </svg>;
};

/** Distinct parent preview: idle → walk → wave → point (2s each). */
export const ParentFatherRigPreview=()=>{
  const frame=useCurrentFrame();
  const action:ParentFatherAction=frame<60?'idle':frame<120?'walk':frame<180?'wave':'point';
  return <AbsoluteFill style={{background:'#e7eee8'}}>
    <div style={{position:'absolute',left:0,right:0,top:820,bottom:0,background:'#cad6cf'}}/>
    <ParentFatherRig x={780} y={181} action={action} talking={action==='point'}/>
  </AbsoluteFill>;
};
