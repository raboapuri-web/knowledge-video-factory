import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';

/** 2D hoodie-wearing boy built as editable SVG limbs, not a flattened image. */
export type HoodieBoyAction='idle'|'walk'|'wave'|'point'|'sit'|'standUp'|'sitPhone'|'walkPhone';
export type HoodieBoyJoints={
  leftShoulder:number;leftElbow:number;rightShoulder:number;rightElbow:number;
  leftHip:number;leftKnee:number;rightHip:number;rightKnee:number;
  headTilt:number;bodyLean:number;
};
export type HoodieBoyRigProps={
  x?:number;y?:number;scale?:number;action?:HoodieBoyAction;
  walkSpeed?:number;pose?:Partial<HoodieBoyJoints>;
  talking?:boolean;mirror?:boolean;
  /** Absolute frame where sit/standUp starts. Defaults to 0 in a Remotion Sequence. */
  actionStartFrame?:number;
  /** Hide the simple SVG chair when the scene already has a matching seat. */
  showChair?:boolean;
  hoodieColor?:string;sleeveColor?:string;pantsColor?:string;
  skinColor?:string;hairColor?:string;shoeColor?:string;
};
const base:HoodieBoyJoints={
  leftShoulder:7,leftElbow:-6,rightShoulder:-7,rightElbow:6,
  leftHip:0,leftKnee:4,rightHip:0,rightKnee:4,headTilt:0,bodyLean:0
};
const limit=(n:number)=>Number.isFinite(n)?Math.max(-165,Math.min(165,n)):0;
const clamp01=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(n:number)=>{const p=clamp01(n);return p*p*(3-2*p);};
const blend=(a:number,b:number,p:number)=>a+(b-a)*p;
const seated:Partial<HoodieBoyJoints>={
  leftHip:74,leftKnee:-74,rightHip:-74,rightKnee:74,
  leftShoulder:9,leftElbow:-9,rightShoulder:-9,rightElbow:9,
  bodyLean:2,headTilt:0
};
const phonePose:Partial<HoodieBoyJoints>={
  rightShoulder:-45,rightElbow:120,leftShoulder:21,leftElbow:-52,
  headTilt:9,bodyLean:4
};

/** Pure frame-time pose: overrides win over procedural walking or gestures. */
export const getHoodieBoyPose=(
  action:HoodieBoyAction,seconds:number,walkSpeed=1.1,
  overrides:Partial<HoodieBoyJoints>={},transition=1
):HoodieBoyJoints=>{
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
      for(const k of Object.keys(seated) as (keyof HoodieBoyJoints)[]){
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
  for(const k of Object.keys(overrides) as (keyof HoodieBoyJoints)[]){
    const a=overrides[k];
    if(typeof a==='number'&&Number.isFinite(a))p[k]=a;
  }
  for(const k of Object.keys(p) as (keyof HoodieBoyJoints)[])p[k]=limit(p[k]);
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
  <rect x={-17} width={34} height={104} rx={17} fill={sleeve} stroke="#2e5d65" strokeWidth={3}/>
  <circle cy={95} r={18} fill={sleeve} stroke="#2e5d65" strokeWidth={3}/>
  <Hinge x={0} y={95} angle={elbow}>
    <rect x={-14} width={28} height={91} rx={13} fill={sleeve} stroke="#2e5d65" strokeWidth={3}/>
    <rect x={-14} y={79} width={28} height={13} rx={5} fill="#255e69"/>
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
export const HoodieBoyRig=({
  x=780,y=180,scale=1,action='idle',walkSpeed=1.1,pose,
  talking=false,mirror=false,actionStartFrame=0,showChair=true,
  hoodieColor='#438b90',sleeveColor='#357c83',pantsColor='#334052',
  skinColor='#eab799',hairColor='#2e3443',shoeColor='#f1f3f4'
}:HoodieBoyRigProps)=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig();
  const t=frame/fps;
  const transition=smooth((frame-actionStartFrame)/(fps*1.1));
  const j=getHoodieBoyPose(action,t,walkSpeed,pose,transition);
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
    aria-label="関節付きパーカー姿の少年"
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
                   Q180 221 117 210 Z" fill="#255761" stroke="#19434e" strokeWidth={4}/>
          <rect x={168} y={162} width={24} height={26} rx={9} fill={skinColor}/>
          <path d="M132 178 Q180 159 228 178 L248 224 L235 358
                   Q180 379 125 358 L112 224 Z"
            fill={hoodieColor} stroke="#235760" strokeWidth={4} strokeLinejoin="round"/>
          {/* Hood collar, drawstrings, pocket and ribbed hem. */}
          <path d="M139 179 Q180 211 221 179" fill="none" stroke="#245b65" strokeWidth={12} strokeLinecap="round"/>
          <path d="M169 197 V226 M191 197 V226" stroke="#e1f0ed" strokeWidth={4} strokeLinecap="round"/>
          <circle cx={169} cy={226} r={3} fill="#e1f0ed"/><circle cx={191} cy={226} r={3} fill="#e1f0ed"/>
          <path d="M145 281 Q180 268 215 281 L205 320 Q180 333 155 320 Z"
            fill="#31747c" stroke="#225a63" strokeWidth={3}/>
          <path d="M127 355 Q180 373 233 355" fill="none" stroke="#20535e" strokeWidth={8}/>
          <Arm x={237} y={205} shoulder={j.rightShoulder} elbow={j.rightElbow}
            sleeve={sleeveColor} skin={skinColor} phone={usingPhone}/>
          {/* Boy-specific round face and short swept, slightly tousled hair.
              Everything stays under the same head rotation pivot as the girl's rig. */}
          <Hinge x={180} y={142} angle={j.headTilt}>
            {/* Back of a short haircut; no ponytail or hair tie. */}
            <path d="M-47 -38 Q-50 -80 -29 -96 L-35 -106 L-11 -102
                     L-4 -113 L14 -102 L29 -108 L33 -95
                     Q53 -80 48 -42 L44 -14 Q24 -22 0 -21 Q-24 -20 -44 -13Z"
              fill={hairColor} stroke="#222936" strokeWidth={2} strokeLinejoin="round"/>
            <ellipse cx={-43} cy={-11} rx={8} ry={11} fill={skinColor}
              stroke="#b78874" strokeWidth={1.5}/>
            <ellipse cx={43} cy={-11} rx={8} ry={11} fill={skinColor}
              stroke="#b78874" strokeWidth={1.5}/>
            <circle cx={0} cy={-18} r={44} fill={skinColor}
              stroke="#b78874" strokeWidth={2}/>
            {/* Side-swept fringe and small spiky tufts frame the circular face. */}
            <path d="M-44 -39 Q-44 -76 -21 -81 L-25 -89 L-9 -83
                     L-2 -94 L15 -84 L32 -88 L30 -78
                     Q47 -69 45 -40 Q29 -52 19 -61
                     Q4 -44 -11 -49 Q-26 -39 -44 -39Z"
              fill={hairColor}/>
            <path d="M-36 -39 Q-19 -29 -7 -42 M18 -59 Q30 -48 37 -43"
              fill="none" stroke="#4b5360" strokeWidth={2.5} strokeLinecap="round"/>
            {/* Friendly youthful eyes: round face retained, features distinct. */}
            <path d="M-26 -29 Q-18 -32 -10 -29 M10 -29 Q18 -32 26 -29"
              stroke="#393a43" strokeWidth={2.7} fill="none" strokeLinecap="round"/>
            <ellipse cx={-17} cy={-15} rx={5.5} ry={7} fill="#2b3540"/>
            <ellipse cx={17} cy={-15} rx={5.5} ry={7} fill="#2b3540"/>
            <circle cx={-15} cy={-18} r={2} fill="#fff"/>
            <circle cx={19} cy={-18} r={2} fill="#fff"/>
            <path d="M0 -10 Q-2 -4 2 -3" stroke="#ca9480" strokeWidth={1.8}
              fill="none" strokeLinecap="round"/>
            {talkingNow
              ?<ellipse cx={0} cy={11} rx={5.5} ry={4} fill="#965a52"/>
              :<path d="M-8 10 Q0 17 8 10" stroke="#965a52"
                strokeWidth={2} fill="none" strokeLinecap="round"/>}
          </Hinge>
        </g>
        </g>
      </g>
    </g>
  </svg>;
};

/** Eight motions on a neutral plate; transition segments use absolute startFrame. */
export const HoodieBoyRigPreview=()=>{
  const frame=useCurrentFrame();
  const action:HoodieBoyAction=
    frame<60?'idle':frame<120?'walk':frame<180?'wave':frame<240?'point':
    frame<300?'sit':frame<360?'sitPhone':frame<420?'standUp':'walkPhone';
  const actionStartFrame=action==='sit'?240:action==='standUp'?360:0;
  return <AbsoluteFill style={{background:'#dde4ed'}}>
    <div style={{position:'absolute',left:0,right:0,top:825,bottom:0,background:'#b0bac9'}}/>
    <HoodieBoyRig x={780} y={185} action={action}
      actionStartFrame={actionStartFrame} talking={action==='point'||action==='sitPhone'}/>
  </AbsoluteFill>;
};
