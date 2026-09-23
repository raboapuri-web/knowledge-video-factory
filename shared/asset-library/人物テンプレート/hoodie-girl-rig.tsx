import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';

/** 2D hoodie-wearing girl built as editable SVG limbs, not a flattened image. */
export type HoodieGirlAction='idle'|'walk'|'wave'|'point';
export type HoodieGirlJoints={
  leftShoulder:number;leftElbow:number;rightShoulder:number;rightElbow:number;
  leftHip:number;leftKnee:number;rightHip:number;rightKnee:number;
  headTilt:number;bodyLean:number;
};
export type HoodieGirlRigProps={
  x?:number;y?:number;scale?:number;action?:HoodieGirlAction;
  walkSpeed?:number;pose?:Partial<HoodieGirlJoints>;
  talking?:boolean;mirror?:boolean;
  hoodieColor?:string;sleeveColor?:string;pantsColor?:string;
  skinColor?:string;hairColor?:string;shoeColor?:string;
};
const base:HoodieGirlJoints={
  leftShoulder:7,leftElbow:-6,rightShoulder:-7,rightElbow:6,
  leftHip:0,leftKnee:4,rightHip:0,rightKnee:4,headTilt:0,bodyLean:0
};
const limit=(n:number)=>Number.isFinite(n)?Math.max(-165,Math.min(165,n)):0;

/** Pure frame-time pose: overrides win over procedural walking or gestures. */
export const getHoodieGirlPose=(
  action:HoodieGirlAction,seconds:number,walkSpeed=1.1,
  overrides:Partial<HoodieGirlJoints>={}
):HoodieGirlJoints=>{
  const t=Number.isFinite(seconds)?seconds:0;
  const v=Math.sin(t*Math.PI*2*Math.max(.05,walkSpeed));
  const p={...base};
  switch(action){
    case 'walk':
      p.leftShoulder=v*24;p.rightShoulder=-v*24;
      p.leftElbow=-6-Math.max(0,v)*14;
      p.rightElbow=6+Math.max(0,-v)*14;
      p.leftHip=-v*30;p.rightHip=v*30;
      p.leftKnee=5+Math.max(0,v)*38;
      p.rightKnee=5+Math.max(0,-v)*38;
      p.bodyLean=2;break;
    case 'wave':
      p.rightShoulder=-141+Math.sin(t*7)*4;
      p.rightElbow=28+Math.sin(t*11)*20;
      p.leftShoulder=5;p.headTilt=-4;break;
    case 'point':
      p.rightShoulder=-90;p.rightElbow=0;
      p.headTilt=-2;break;
    default:
      p.headTilt=Math.sin(t*.8);
      p.leftShoulder+=Math.sin(t*1.25)*1.5;
      p.rightShoulder-=Math.sin(t*1.25)*1.5;
  }
  for(const k of Object.keys(overrides) as (keyof HoodieGirlJoints)[]){
    const a=overrides[k];
    if(typeof a==='number'&&Number.isFinite(a))p[k]=a;
  }
  for(const k of Object.keys(p) as (keyof HoodieGirlJoints)[])p[k]=limit(p[k]);
  return p;
};
const Hinge=({x,y,angle,children}:{x:number;y:number;angle:number;children:React.ReactNode})=>
  <g transform={'translate('+x+' '+y+') rotate('+angle+')'}>{children}</g>;

const Leg=({x,y,hip,knee,pants,shoe}:{
  x:number;y:number;hip:number;knee:number;pants:string;shoe:string
})=><Hinge x={x} y={y} angle={hip}>
  <rect x={-16} width={32} height={129} rx={13} fill={pants} stroke="#273040" strokeWidth={3}/>
  <circle cy={117} r={16} fill={pants} stroke="#273040" strokeWidth={3}/>
  <Hinge x={0} y={117} angle={knee}>
    <rect x={-14} width={28} height={115} rx={12} fill={pants} stroke="#273040" strokeWidth={3}/>
    <circle cy={105} r={13} fill={pants} stroke="#273040" strokeWidth={2}/>
    <path d="M-12 106 H13 L36 123 Q40 139 21 141 H-19 Q-28 137 -25 126 Z"
      fill={shoe} stroke="#29313d" strokeWidth={3} strokeLinejoin="round"/>
    <path d="M-17 129 H33" stroke="#c9d0df" strokeWidth={3}/>
  </Hinge>
</Hinge>;
const Arm=({x,y,shoulder,elbow,sleeve,skin}:{
  x:number;y:number;shoulder:number;elbow:number;sleeve:string;skin:string
})=><Hinge x={x} y={y} angle={shoulder}>
  <rect x={-17} width={34} height={104} rx={17} fill={sleeve} stroke="#43405d" strokeWidth={3}/>
  <circle cy={95} r={18} fill={sleeve} stroke="#43405d" strokeWidth={3}/>
  <Hinge x={0} y={95} angle={elbow}>
    <rect x={-14} width={28} height={91} rx={13} fill={sleeve} stroke="#43405d" strokeWidth={3}/>
    <rect x={-14} y={79} width={28} height={13} rx={5} fill="#56486f"/>
    <ellipse cy={102} rx={13} ry={16} fill={skin} stroke="#a77d6b" strokeWidth={2}/>
  </Hinge>
</Hinge>;

/** Transparent foreground, local artboard 360x640. Render in any Remotion scene. */
export const HoodieGirlRig=({
  x=780,y=180,scale=1,action='idle',walkSpeed=1.1,pose,
  talking=false,mirror=false,
  hoodieColor='#7764ac',sleeveColor='#715da4',pantsColor='#354052',
  skinColor='#edbeaa',hairColor='#3d3544',shoeColor='#eff0f2'
}:HoodieGirlRigProps)=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const t=frame/fps,j=getHoodieGirlPose(action,t,walkSpeed,pose);
  const bob=action==='walk'?-Math.abs(Math.sin(t*Math.PI*2*walkSpeed))*4:Math.sin(t*1.5)*1.2;
  const s=Number.isFinite(scale)&&scale>0?scale:1;
  const talkingNow=talking&&Math.sin(t*23)>0;
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640"
    aria-label="関節付きパーカー姿の少女"
    style={{position:'absolute',left:x,top:y,width:360*s,height:640*s,
      overflow:'visible',pointerEvents:'none'}}>
    <g transform={mirror?'translate(360 0) scale(-1 1)':undefined}>
      <g transform={'translate(0 '+bob+')'}>
        <g transform={'rotate('+j.bodyLean+' 180 355)'}>
          <Leg x={153} y={350} hip={j.leftHip} knee={j.leftKnee} pants={pantsColor} shoe={shoeColor}/>
          <Leg x={207} y={350} hip={j.rightHip} knee={j.rightKnee} pants={pantsColor} shoe={shoeColor}/>
          <Arm x={123} y={205} shoulder={j.leftShoulder} elbow={j.leftElbow}
            sleeve={sleeveColor} skin={skinColor}/>
          {/* Back of hood, followed by neck and torso so there is no detached head. */}
          <path d="M135 130 Q132 74 180 69 Q229 73 226 130 L243 210
                   Q180 221 117 210 Z" fill="#594a80" stroke="#3f355d" strokeWidth={4}/>
          <rect x={166} y={133} width={28} height={58} rx={10} fill={skinColor}/>
          <path d="M132 178 Q180 159 228 178 L248 224 L235 358
                   Q180 379 125 358 L112 224 Z"
            fill={hoodieColor} stroke="#43395f" strokeWidth={4} strokeLinejoin="round"/>
          {/* Hood collar, drawstrings, pocket and ribbed hem. */}
          <path d="M139 179 Q180 211 221 179" fill="none" stroke="#554575" strokeWidth={12} strokeLinecap="round"/>
          <path d="M169 197 V226 M191 197 V226" stroke="#e6dfed" strokeWidth={4} strokeLinecap="round"/>
          <circle cx={169} cy={226} r={3} fill="#e6dfed"/><circle cx={191} cy={226} r={3} fill="#e6dfed"/>
          <path d="M145 281 Q180 268 215 281 L205 320 Q180 333 155 320 Z"
            fill="#66548f" stroke="#483b70" strokeWidth={3}/>
          <path d="M127 355 Q180 373 233 355" fill="none" stroke="#554675" strokeWidth={8}/>
          <Arm x={237} y={205} shoulder={j.rightShoulder} elbow={j.rightElbow}
            sleeve={sleeveColor} skin={skinColor}/>
          {/* Face / hair pivot with neck behind jaw. The neck ends below the hood collar. */}
          <Hinge x={180} y={142} angle={j.headTilt}>
            <path d="M-44 -50 Q-50 -105 -10 -115 Q20 -118 39 -100
                     Q54 -80 44 -29 L46 24 Q23 48 0 44 Q-25 45 -46 21 Z"
              fill={hairColor}/>
            <ellipse cx={-42} cy={-27} rx={8} ry={12} fill={skinColor}/>
            <ellipse cx={42} cy={-27} rx={8} ry={12} fill={skinColor}/>
            <path d="M-43 -54 Q-39 -96 0 -96 Q38 -96 43 -54 L40 -15
                     Q34 29 0 37 Q-34 29 -40 -15 Z"
              fill={skinColor} stroke="#ac806f" strokeWidth={2}/>
            <path d="M-46 -63 Q-51 -116 -6 -120 Q35 -120 46 -86 L44 -51
                     Q30 -73 12 -73 Q-9 -67 -19 -86 Q-24 -68 -43 -55 Z"
              fill={hairColor}/>
            <path d="M-26 -26 Q-19 -32 -11 -26 M11 -26 Q19 -32 26 -26"
              stroke="#43313d" strokeWidth={3} fill="none" strokeLinecap="round"/>
            <circle cx={-19} cy={-23} r={3} fill="#43313d"/>
            <circle cx={19} cy={-23} r={3} fill="#43313d"/>
            <ellipse cx={-29} cy={-7} rx={7} ry={3} fill="#d99196" opacity={.45}/>
            <ellipse cx={29} cy={-7} rx={7} ry={3} fill="#d99196" opacity={.45}/>
            <path d="M0 -18 L-2 -8 L2 -7" stroke="#c39080" strokeWidth={2} fill="none"/>
            {talkingNow
              ?<ellipse cx={0} cy={13} rx={7} ry={5} fill="#8b4f58"/>
              :<path d="M-8 12 Q0 17 8 12" stroke="#88545a" strokeWidth={2} fill="none"/>}
          </Hinge>
        </g>
      </g>
    </g>
  </svg>;
};

/** Standalone preview on a neutral background. */
export const HoodieGirlRigPreview=()=>{
  const frame=useCurrentFrame();
  const action:HoodieGirlAction=frame<60?'idle':frame<120?'walk':frame<180?'wave':'point';
  return <AbsoluteFill style={{background:'#dde4ed'}}>
    <div style={{position:'absolute',left:0,right:0,top:824,bottom:0,background:'#b0bac9'}}/>
    <HoodieGirlRig x={780} y={185} action={action} talking={action==='point'}/>
  </AbsoluteFill>;
};
