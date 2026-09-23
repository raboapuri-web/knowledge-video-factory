import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';

/**
 * 2D contemporary office woman. The drawing is original React SVG, not a bitmap.
 * Each limb is nested at its anatomical hinge: shoulder -> elbow -> wrist,
 * hip -> knee -> ankle. A pose angle controls the child as well as its descendants.
 * Angles are degrees; 0 = downward, positive = clockwise in the SVG viewport.
 */
export type OfficeWomanAction='idle'|'walk'|'wave'|'point';
export type OfficeWomanJoints={
  leftShoulder:number;leftElbow:number;rightShoulder:number;rightElbow:number;
  leftHip:number;leftKnee:number;rightHip:number;rightKnee:number;
  headTilt:number;bodyLean:number;
};
export type OfficeWomanRigProps={
  /** Top-left of the 360 x 640 character in a 1920 x 1080 scene. */
  x?:number;y?:number;scale?:number;
  action?:OfficeWomanAction;
  /** Walking cycles per second. All animation derives from Remotion frame/fps. */
  walkSpeed?:number;
  /** Override individual joint angles after the automatic action pose is computed. */
  pose?:Partial<OfficeWomanJoints>;
  talking?:boolean;showBriefcase?:boolean;mirror?:boolean;
  suitColor?:string;pantsColor?:string;shirtColor?:string;
  skinColor?:string;hairColor?:string;shoeColor?:string;
};
const clampAngle=(n:number)=>Number.isFinite(n)?Math.max(-165,Math.min(165,n)):0;
const base:OfficeWomanJoints={
  leftShoulder:7,leftElbow:-8,rightShoulder:-7,rightElbow:8,
  leftHip:0,leftKnee:4,rightHip:0,rightKnee:4,headTilt:0,bodyLean:0
};

/** Public pure function: test or storyboard a pose without running a React render. */
export const getOfficeWomanPose=(
  action:OfficeWomanAction,seconds:number,walkSpeed=1.05,
  overrides:Partial<OfficeWomanJoints>={}
):OfficeWomanJoints=>{
  const t=Number.isFinite(seconds)?seconds:0;
  const wave=Math.sin(t*Math.PI*2*Math.max(.05,walkSpeed));
  const p:OfficeWomanJoints={...base};
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
  for(const key of Object.keys(overrides) as (keyof OfficeWomanJoints)[]){
    const value=overrides[key];
    if(typeof value==='number'&&Number.isFinite(value))p[key]=value;
  }
  for(const key of Object.keys(p) as (keyof OfficeWomanJoints)[])p[key]=clampAngle(p[key]);
  return p;
};

const Hinge=({x,y,angle,children}:{x:number;y:number;angle:number;children:React.ReactNode})=>
  <g transform={'translate('+x+' '+y+') rotate('+angle+')'}>{children}</g>;

const Leg=({x,y,hip,knee,color,shoe}:{x:number;y:number;hip:number;knee:number;color:string;shoe:string})=>
  <Hinge x={x} y={y} angle={hip}>
    <rect x={-15} y={0} width={30} height={126} rx={12} fill={color} stroke="#19202c" strokeWidth={3}/>
    <circle cx={0} cy={116} r={15} fill={color} stroke="#19202c" strokeWidth={3}/>
    <Hinge x={0} y={116} angle={knee}>
      <rect x={-13} y={0} width={26} height={117} rx={12} fill={color} stroke="#19202c" strokeWidth={3}/>
      <circle cx={0} cy={108} r={12} fill={color} stroke="#19202c" strokeWidth={2}/>
      <path d="M-12 110 L10 110 L23 131 Q29 140 14 141 L-13 141 Q-26 137 -22 129Z"
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
        <path d="M-3 5 V15 H18 V5" fill="none" stroke="#303340" strokeWidth={5}/>
        <rect x={-16} y={15} width={53} height={48} rx={5}
          fill="#584234" stroke="#2f2826" strokeWidth={3}/>
        <path d="M-15 39 H36" stroke="#8a6b4e" strokeWidth={3}/>
        <rect x={6} y={34} width={8} height={11} rx={2} fill="#d6b16d"/>
      </g>}
    </Hinge>
  </Hinge>;

/** Transparent character layer. Place above the chosen scene background, below subtitles. */
export const OfficeWomanRig=({
  x=780,y=180,scale=1,action='idle',walkSpeed=1.05,pose,
  talking=false,showBriefcase=false,mirror=false,
  suitColor='#535e78',pantsColor='#3d4b64',shirtColor='#f7f2f0',
  skinColor='#ebbea6',hairColor='#44373b',shoeColor='#232a36'
}:OfficeWomanRigProps)=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const t=frame/fps;
  const j=getOfficeWomanPose(action,t,walkSpeed,pose);
  const bob=action==='walk'?-Math.abs(Math.sin(t*Math.PI*2*walkSpeed))*4:Math.sin(t*1.6)*1.2;
  const mouthOpen=talking&&Math.sin(t*26)>0;
  const uniformScale=Number.isFinite(scale)&&scale>0?scale:1;
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640"
    aria-label="関節可動式の現代の女性会社員（2Dベクター）"
    style={{position:'absolute',left:x,top:y,width:360*uniformScale,height:640*uniformScale,
      overflow:'visible',pointerEvents:'none'}}>
    <g transform={mirror?'translate(360 0) scale(-1 1)':undefined}>
      <g transform={'translate(0 '+bob+')'}>
        <g transform={'rotate('+j.bodyLean+' 180 370)'}>
          <Leg x={150} y={360} hip={j.leftHip} knee={j.leftKnee} color={pantsColor} shoe={shoeColor}/>
          <Leg x={210} y={360} hip={j.rightHip} knee={j.rightKnee} color={pantsColor} shoe={shoeColor}/>
          <Arm x={122} y={205} shoulder={j.leftShoulder} elbow={j.leftElbow}
            suit={suitColor} skin={skinColor}/>
          {/* Short neck, behind the blouse and blazer. Head is lowered below
              to leave only a natural-sized visible neck above the collar. */}
          <rect x={168} y={160} width={24} height={42} rx={9} fill={skinColor}/>
          {/* Fitted contemporary blazer, blouse and modest waist shaping.
              This is independent artwork, not a tint of the male suit. */}
          <path d="M145 179 Q180 165 215 179 Q239 193 245 230
                   L224 288 Q229 326 234 367 Q180 385 126 367
                   Q131 326 136 288 L115 230 Q120 193 145 179Z"
            fill={suitColor} stroke="#303c53" strokeWidth={4} strokeLinejoin="round"/>
          {/* Straight-front white shirt: a flat lower hem, NOT the old pointed V shape. */}
          <path d="M157 181 Q180 176 203 181
                   L203 342 Q180 348 157 342 Z"
            fill={shirtColor} stroke="#c5bec1" strokeWidth={2}/>
          {/* Two restrained shirt collar leaves: the jacket lapels remain separate. */}
          <path d="M157 181 L175 195 L171 209 L157 196 Z"
            fill="#fffaf7" stroke="#d0c9cc" strokeWidth={1.8}/>
          <path d="M203 181 L185 195 L189 209 L203 196 Z"
            fill="#fffaf7" stroke="#d0c9cc" strokeWidth={1.8}/>
          {/* Plain white button-front blouse; no bow, ribbon, heart or necktie. */}
          <path d="M180 200 V341" stroke="#ded8d9" strokeWidth={1.8} fill="none"/>
          <circle cx={180} cy={219} r={2.1} fill="#c6bfc0"/>
          <circle cx={180} cy={248} r={2.1} fill="#c6bfc0"/>
          <circle cx={180} cy={277} r={2.1} fill="#c6bfc0"/>
          <circle cx={180} cy={306} r={2.1} fill="#c6bfc0"/>
          <circle cx={180} cy={335} r={2.1} fill="#c6bfc0"/>
          <path d="M146 179 Q150 207 164 254 L144 236 L153 220 L141 212 Z"
            fill="#64728f" stroke="#36445c" strokeWidth={2}/>
          <path d="M214 179 Q210 207 196 254 L216 236 L207 220 L219 212 Z"
            fill="#64728f" stroke="#36445c" strokeWidth={2}/>
          <path d="M136 287 Q180 302 224 287 M141 337 Q180 347 219 337"
            stroke="#344057" strokeWidth={2.5} fill="none"/>
          <circle cx={181} cy={321} r={3.4} fill="#303a4e"/>
          <path d="M126 367 Q180 381 234 367" fill="none"
            stroke="#303a4e" strokeWidth={4}/>
          <Arm x={238} y={205} shoulder={j.rightShoulder} elbow={j.rightElbow}
            suit={suitColor} skin={skinColor} briefcase={showBriefcase&&action!=='wave'&&action!=='point'}/>
          {/* Lower head 13 px so jaw overlaps the short neck at the shirt collar.
              The neck stays attached to torso while the head can rotate. */}
          <Hinge x={180} y={198} angle={j.headTilt}>
            {/* Hair back passes to shoulder height, beneath face and cheeks. */}
            <path d="M-49 -102 Q-54 -150 -19 -158 Q5 -170 31 -156
                     Q60 -140 53 -96 L56 6 Q44 28 31 29
                     L18 10 Q0 17 -18 10 L-31 29 Q-48 26 -56 6Z"
              fill={hairColor} stroke="#32282e" strokeWidth={2}/>
            {/* Neck is stationary behind the shirt; head tilts without a long exposed throat. */}
            <ellipse cx={-45} cy={-86} rx={8} ry={12} fill={skinColor}/>
            <ellipse cx={45} cy={-86} rx={8} ry={12} fill={skinColor}/>
            {/* Face: softer oval than the man's but still an adult. */}
            <path d="M-44 -104 Q-44 -143 0 -145 Q44 -143 44 -104
                     L41 -73 Q37 -39 0 -27 Q-37 -39 -41 -73Z"
              fill={skinColor} stroke="#b48677" strokeWidth={2}/>
            {/* Side part, soft bangs and cheek-framing ends. */}
            <path d="M-47 -107 Q-51 -157 -17 -161 Q10 -171 33 -153
                     Q53 -142 48 -105 Q40 -122 27 -133
                     Q1 -111 -25 -124 Q-31 -110 -47 -107Z"
              fill={hairColor}/>
            <path d="M-45 -106 Q-50 -66 -43 -44 Q-51 -52 -53 -77Z
                     M45 -108 Q50 -64 43 -43 Q51 -56 53 -81Z"
              fill={hairColor}/>
            <path d="M-30 -90 Q-23 -94 -14 -91 M14 -91 Q23 -94 30 -90"
              fill="none" stroke="#65474d" strokeWidth={2.5} strokeLinecap="round"/>
            <ellipse cx={-21} cy={-83} rx={4.5} ry={5.2} fill="#34313a"/>
            <ellipse cx={21} cy={-83} rx={4.5} ry={5.2} fill="#34313a"/>
            <circle cx={-19.5} cy={-85} r={1.5} fill="#fff"/>
            <circle cx={22.5} cy={-85} r={1.5} fill="#fff"/>
            <path d="M-27 -90 Q-21 -93 -15 -90 M15 -90 Q21 -93 27 -90"
              stroke="#342c32" strokeWidth={1.8} fill="none"/>
            <path d="M0 -77 L-2 -68 L2 -66" fill="none"
              stroke="#c39180" strokeWidth={1.7} strokeLinecap="round"/>
            <ellipse cx={-30} cy={-63} rx={5.5} ry={2.6} fill="#d89e9e" opacity={.32}/>
            <ellipse cx={30} cy={-63} rx={5.5} ry={2.6} fill="#d89e9e" opacity={.32}/>
            {mouthOpen
              ?<ellipse cx={0} cy={-53} rx={6} ry={4.5} fill="#995d62"/>
              :<path d="M-8 -52 Q0 -47 8 -52" fill="none"
                stroke="#985f65" strokeWidth={2} strokeLinecap="round"/>}
            <circle cx={-44} cy={-71} r={2.8} fill="#e1c58f"/>
            <circle cx={44} cy={-71} r={2.8} fill="#e1c58f"/>
          </Hinge>
        </g>
      </g>
    </g>
  </svg>;
};

/** Four actions in sequence. Add as a separate Remotion Composition to preview. */
export const OfficeWomanRigPreview=()=>{
  const frame=useCurrentFrame();
  const action:OfficeWomanAction=frame<60?'idle':frame<120?'walk':frame<180?'wave':'point';
  return <AbsoluteFill style={{background:'#e6ebf0',overflow:'hidden'}}>
    <AbsoluteFill style={{background:'linear-gradient(180deg,#e8eef4 0%,#e8eef4 76%,#b4bec8 76%,#b4bec8 100%)'}}/>
    <div style={{position:'absolute',left:0,right:0,top:822,height:4,background:'#738392'}}/>
    <OfficeWomanRig x={780} y={181} scale={1} action={action} talking={action==='point'}/>
  </AbsoluteFill>;
};
