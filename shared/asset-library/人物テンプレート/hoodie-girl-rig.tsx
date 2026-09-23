import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';

/** 2D hoodie-wearing girl built as editable SVG limbs, not a flattened image. */
export type HoodieGirlAction='idle'|'walk'|'wave'|'point'|'sit'|'standUp'|'sitPhone'|'walkPhone';
export type HoodieGirlJoints={
  leftShoulder:number;leftElbow:number;rightShoulder:number;rightElbow:number;
  leftHip:number;leftKnee:number;rightHip:number;rightKnee:number;
  headTilt:number;bodyLean:number;
};
export type HoodieGirlRigProps={
  x?:number;y?:number;scale?:number;action?:HoodieGirlAction;
  walkSpeed?:number;pose?:Partial<HoodieGirlJoints>;
  talking?:boolean;mirror?:boolean;
  /** Absolute frame where sit/standUp starts. Defaults to 0 in a Remotion Sequence. */
  actionStartFrame?:number;
  /** Hide the simple SVG chair when the scene already has a matching seat. */
  showChair?:boolean;
  /** Anonymous background youths: omit eyes, eyebrows, nose, mouth and cheeks. */
  hideFaceFeatures?:boolean;
  hoodieColor?:string;sleeveColor?:string;pantsColor?:string;
  skinColor?:string;hairColor?:string;shoeColor?:string;
};
const base:HoodieGirlJoints={
  leftShoulder:7,leftElbow:-6,rightShoulder:-7,rightElbow:6,
  leftHip:0,leftKnee:4,rightHip:0,rightKnee:4,headTilt:0,bodyLean:0
};
const limit=(n:number)=>Number.isFinite(n)?Math.max(-165,Math.min(165,n)):0;
const clamp01=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(n:number)=>{const p=clamp01(n);return p*p*(3-2*p);};
const blend=(a:number,b:number,p:number)=>a+(b-a)*p;
const seated:Partial<HoodieGirlJoints>={
  leftHip:74,leftKnee:-74,rightHip:-74,rightKnee:74,
  leftShoulder:9,leftElbow:-9,rightShoulder:-9,rightElbow:9,
  bodyLean:2,headTilt:0
};
const phonePose:Partial<HoodieGirlJoints>={
  rightShoulder:-45,rightElbow:120,leftShoulder:21,leftElbow:-52,
  headTilt:9,bodyLean:4
};

/** Pure frame-time pose: overrides win over procedural walking or gestures. */
export const getHoodieGirlPose=(
  action:HoodieGirlAction,seconds:number,walkSpeed=1.1,
  overrides:Partial<HoodieGirlJoints>={},transition=1
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
    case 'sit':
    case 'standUp':{
      // Rotate thighs outward into a frontal seated pose, while shins rotate
      // in the opposite direction so the shoes remain near the floor.
      const q=action==='sit'?smooth(transition):1-smooth(transition);
      for(const k of Object.keys(seated) as (keyof HoodieGirlJoints)[]){
        p[k]=blend(base[k],seated[k] as number,q);
      }
      break;
    }
    case 'sitPhone':
      Object.assign(p,seated,phonePose);p.bodyLean=6;break;
    case 'walkPhone':
      p.leftShoulder=v*13;p.leftElbow=-12;
      p.rightShoulder=-45+v*2;p.rightElbow=120;
      p.leftHip=-v*28;p.rightHip=v*28;
      p.leftKnee=5+Math.max(0,v)*35;
      p.rightKnee=5+Math.max(0,-v)*35;
      p.headTilt=9;p.bodyLean=4;break;
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
const Arm=({x,y,shoulder,elbow,sleeve,skin,phone=false}:{
  x:number;y:number;shoulder:number;elbow:number;sleeve:string;skin:string;phone?:boolean
})=><Hinge x={x} y={y} angle={shoulder}>
  <rect x={-17} width={34} height={104} rx={17} fill={sleeve} stroke="#43405d" strokeWidth={3}/>
  <circle cy={95} r={18} fill={sleeve} stroke="#43405d" strokeWidth={3}/>
  <Hinge x={0} y={95} angle={elbow}>
    <rect x={-14} width={28} height={91} rx={13} fill={sleeve} stroke="#43405d" strokeWidth={3}/>
    <rect x={-14} y={79} width={28} height={13} rx={5} fill="#56486f"/>
    {/* The phone is parented to the right FOREARM's local coordinates,
        not positioned at a fixed scene x/y. Both elbow and shoulder rotations
        carry the phone and fingers together, including during walking. */}
    {phone&&<g transform="translate(3 75) rotate(-10)">
      <rect x={-14} y={-43} width={28} height={68} rx={5}
        fill="#252d39" stroke="#121820" strokeWidth={2.5}/>
      <rect x={-11} y={-38} width={22} height={52} rx={2}
        fill="#8cc0db"/>
      <path d="M-7 -29 H7 M-7 -22 H4 M-7 -15 H7" stroke="#e8f8ff"
        strokeWidth={2} strokeLinecap="round"/>
      <circle cx={0} cy={19} r={2} fill="#c6ced8"/>
    </g>}
    <ellipse cy={102} rx={13} ry={16} fill={skin} stroke="#a77d6b" strokeWidth={2}/>
    {phone&&<path d="M-5 92 Q6 84 11 91 L10 108 Q3 114 -4 108Z"
      fill={skin} stroke="#a77d6b" strokeWidth={1.5}/>}

  </Hinge>
</Hinge>;

/** Transparent foreground, local artboard 360x640. Render in any Remotion scene. */
export const HoodieGirlRig=({
  x=780,y=180,scale=1,action='idle',walkSpeed=1.1,pose,
  talking=false,mirror=false,actionStartFrame=0,showChair=true,hideFaceFeatures=false,
  hoodieColor='#7764ac',sleeveColor='#715da4',pantsColor='#354052',
  skinColor='#edbeaa',hairColor='#3d3544',shoeColor='#eff0f2'
}:HoodieGirlRigProps)=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const t=frame/fps;
  const transition=smooth((frame-actionStartFrame)/(fps*1.1));
  const j=getHoodieGirlPose(action,t,walkSpeed,pose,transition);
  const seatedAmount=action==='sitPhone'?1:
    action==='sit'?transition:action==='standUp'?1-transition:0;
  const sitOffset=seatedAmount*77;
  const walking=action==='walk'||action==='walkPhone';
  const bob=walking?-Math.abs(Math.sin(t*Math.PI*2*walkSpeed))*4:
    action==='sitPhone'?Math.sin(t*1.2)*.6:Math.sin(t*1.5)*1.2;
  const usingPhone=action==='sitPhone'||action==='walkPhone';
  const chairVisible=showChair&&(action==='sit'||action==='sitPhone'||action==='standUp');
  const s=Number.isFinite(scale)&&scale>0?scale:1;
  const talkingNow=talking&&Math.sin(t*23)>0;
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640"
    aria-label="関節付きパーカー姿の少女"
    style={{position:'absolute',left:x,top:y,width:360*s,height:640*s,
      overflow:'visible',pointerEvents:'none'}}>
    <g transform={mirror?'translate(360 0) scale(-1 1)':undefined}>
      <g transform={'translate(0 '+bob+')'}>
        {/* Simple front-view chair remains stationary while the person sits/stands.
            Drawn BEHIND the body; hide with showChair={false} for a scene sofa. */}
        {chairVisible&&<g opacity={action==='standUp'?Math.max(.18,1-transition):1}>
          <rect x={107} y={302} width={146} height={132} rx={14}
            fill="#758493" stroke="#47596b" strokeWidth={5}/>
          <rect x={100} y={430} width={160} height={17} rx={7} fill="#516477"/>
          <path d="M115 445 V597 M245 445 V597" stroke="#485a6d"
            strokeWidth={11} strokeLinecap="round"/>
        </g>}
        <g transform={'translate(0 '+sitOffset+')'}>
        <g transform={'rotate('+j.bodyLean+' 180 355)'}>
          <Leg x={153} y={350} hip={j.leftHip} knee={j.leftKnee} pants={pantsColor} shoe={shoeColor}/>
          <Leg x={207} y={350} hip={j.rightHip} knee={j.rightKnee} pants={pantsColor} shoe={shoeColor}/>
          <Arm x={123} y={205} shoulder={j.leftShoulder} elbow={j.leftElbow}
            sleeve={sleeveColor} skin={skinColor}/>
          {/* Back of hood, followed by neck and torso so there is no detached head. */}
          <path d="M135 130 Q132 74 180 69 Q229 73 226 130 L243 210
                   Q180 221 117 210 Z" fill="#594a80" stroke="#3f355d" strokeWidth={4}/>
          <rect x={168} y={162} width={24} height={26} rx={9} fill={skinColor}/>
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
            sleeve={sleeveColor} skin={skinColor} phone={usingPhone}/>
          {/* Round face, playful high ponytail and short overlapping neck. All move with the head joint. */}
          <Hinge x={180} y={142} angle={j.headTilt}>
            {/* Ponytail sits BEHIND the round head, tied at the upper right. */}
            <path d="M29 -54 Q53 -69 73 -51 Q92 -35 85 -7 Q83 11 99 19
                     Q77 45 53 25 Q45 7 48 -12 Q45 -36 29 -54Z"
              fill={hairColor} stroke="#352d3a" strokeWidth={2} strokeLinejoin="round"/>
            <path d="M76 -43 Q90 -18 79 7" stroke="#695b72" strokeWidth={3}
              fill="none" strokeLinecap="round"/>
            {/* Round back hair + ears + genuinely circular face, not a tapered oval. */}
            <circle cx={0} cy={-18} r={49} fill={hairColor}/>
            <ellipse cx={-42} cy={-14} rx={8} ry={11} fill={skinColor}/>
            <ellipse cx={42} cy={-14} rx={8} ry={11} fill={skinColor}/>
            <circle cx={0} cy={-18} r={44} fill={skinColor} stroke="#bd9281" strokeWidth={2}/>
            {/* Curved, asymmetrical bangs and side locks to soften the silhouette. */}
            <path d="M-46 -38 Q-43 -77 -11 -80 Q28 -83 45 -47
                     Q28 -51 13 -60 Q-4 -41 -20 -42 Q-35 -37 -46 -38Z"
              fill={hairColor}/>
            <path d="M-44 -34 Q-49 -4 -37 7 Q-42 -16 -36 -34Z
                     M44 -33 Q50 -4 36 7 Q42 -15 36 -33Z"
              fill={hairColor}/>
            <path d="M-22 -47 Q-7 -42 8 -60" fill="none" stroke="#5d5065"
              strokeWidth={3} strokeLinecap="round"/>
            {/* Hair tie (above the ponytail root, behind the face edge). */}
            <circle cx={46} cy={-47} r={7} fill="#e68da9" stroke="#c96c93" strokeWidth={2}/>
            <circle cx={46} cy={-47} r={2} fill="#fff0f5"/>
            {!hideFaceFeatures&&<>
            {/* Larger sparkling eyes, delicate eyebrows and visible rosy cheeks. */}
            <path d="M-26 -28 Q-18 -32 -10 -29 M10 -29 Q18 -32 26 -28"
              stroke="#604854" strokeWidth={2.2} fill="none" strokeLinecap="round"/>
            <ellipse cx={-17} cy={-14} rx={6.5} ry={8} fill="#342c3b"/>
            <ellipse cx={17} cy={-14} rx={6.5} ry={8} fill="#342c3b"/>
            <circle cx={-15} cy={-17} r={2.5} fill="#fff"/>
            <circle cx={19} cy={-17} r={2.5} fill="#fff"/>
            <circle cx={-19} cy={-10} r={1} fill="#fff" opacity={.75}/>
            <circle cx={15} cy={-10} r={1} fill="#fff" opacity={.75}/>
            <ellipse cx={-29} cy={3} rx={8} ry={4.5} fill="#e98d9f" opacity={.58}/>
            <ellipse cx={29} cy={3} rx={8} ry={4.5} fill="#e98d9f" opacity={.58}/>
            <path d="M0 -9 Q-2 -5 2 -4" stroke="#d69c8e" strokeWidth={1.5}
              fill="none" strokeLinecap="round"/>
            {talkingNow
              ?<ellipse cx={0} cy={10} rx={5.5} ry={4.5} fill="#a45d68"/>
              :<path d="M-7 10 Q0 16 7 10" stroke="#a45d68" strokeWidth={2}
                fill="none" strokeLinecap="round"/>}
</>}
          </Hinge>
        </g>
        </g>
      </g>
    </g>
  </svg>;
};

/** Eight motions on a neutral plate; transition segments use absolute startFrame. */
export const HoodieGirlRigPreview=()=>{
  const frame=useCurrentFrame();
  const action:HoodieGirlAction=
    frame<60?'idle':frame<120?'walk':frame<180?'wave':frame<240?'point':
    frame<300?'sit':frame<360?'sitPhone':frame<420?'standUp':'walkPhone';
  const actionStartFrame=action==='sit'?240:action==='standUp'?360:0;
  return <AbsoluteFill style={{background:'#dde4ed'}}>
    <div style={{position:'absolute',left:0,right:0,top:825,bottom:0,background:'#b0bac9'}}/>
    <HoodieGirlRig x={780} y={185} action={action}
      actionStartFrame={actionStartFrame} talking={action==='point'||action==='sitPhone'}/>
  </AbsoluteFill>;
};
