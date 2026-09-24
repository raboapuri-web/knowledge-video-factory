import React from 'react';
import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';

/** Editable, front-view 2D child rig with independent joints; no bitmap parts. */
export type ChildGirlAction='front'|'run'|'play'|'cry';
export type ChildGirlJoints={
  leftShoulder:number;leftElbow:number;rightShoulder:number;rightElbow:number;
  leftHip:number;leftKnee:number;rightHip:number;rightKnee:number;
  headTilt:number;bodyLean:number;
};
export type ChildGirlProps={
  x?:number;y?:number;scale?:number;mirror?:boolean;
  action?:ChildGirlAction;walkSpeed?:number;
  pose?:Partial<ChildGirlJoints>;
  skinColor?:string;hairColor?:string;topColor?:string;
  pantsColor?:string;shoeColor?:string;ballColor?:string;
};
const base:ChildGirlJoints={
  leftShoulder:8,leftElbow:-6,rightShoulder:-8,rightElbow:6,
  leftHip:0,leftKnee:5,rightHip:0,rightKnee:5,headTilt:0,bodyLean:0
};
const clamp=(n:number)=>Number.isFinite(n)?Math.max(-165,Math.min(165,n)):0;
export const getChildGirlPose=(
  action:ChildGirlAction,t:number,speed=1.35,overrides:Partial<ChildGirlJoints>={}
):ChildGirlJoints=>{
  const p:ChildGirlJoints={...base};
  const v=Math.sin(t*Math.PI*2*Math.max(.1,speed));
  if(action==='run'){
    p.leftShoulder=-v*55;p.rightShoulder=v*55;
    p.leftElbow=-42;p.rightElbow=42;
    p.leftHip=v*35;p.rightHip=-v*35;
    p.leftKnee=6+Math.max(0,-v)*55;p.rightKnee=6+Math.max(0,v)*55;
    p.bodyLean=7;p.headTilt=-4;
  }else if(action==='play'){
    // Actually holding a toy ball, not merely waving arms.
    p.leftShoulder=22+v*14;p.leftElbow=-20;
    p.rightShoulder=-115+v*9;p.rightElbow=70;
    p.leftHip=v*8;p.rightHip=-v*8;
    p.leftKnee=9;p.rightKnee=8;p.bodyLean=v*3;p.headTilt=-3+v*3;
  }else if(action==='cry'){
    p.leftShoulder=32+Math.sin(t*13)*3;p.leftElbow=-97;
    p.rightShoulder=-32-Math.sin(t*13)*3;p.rightElbow=97;
    p.headTilt=6+Math.sin(t*8)*2;p.bodyLean=Math.sin(t*12)*2;
    p.leftHip=4;p.rightHip=-4;
  }else{
    p.headTilt=Math.sin(t*1.3)*1.5;
    p.leftShoulder+=Math.sin(t*.9);
    p.rightShoulder-=Math.sin(t*.9);
  }
  for(const k of Object.keys(overrides) as (keyof ChildGirlJoints)[]){
    const val=overrides[k];if(typeof val==='number'&&Number.isFinite(val))p[k]=val;
  }
  for(const k of Object.keys(p) as (keyof ChildGirlJoints)[])p[k]=clamp(p[k]);
  return p;
};
const Hinge=({x,y,angle,children}:{x:number;y:number;angle:number;children:React.ReactNode})=>
  <g transform={'translate('+x+' '+y+') rotate('+angle+')'}>{children}</g>;
const Leg=({x,hip,knee,pants,shoe}:{x:number;hip:number;knee:number;pants:string;shoe:string})=>
  <Hinge x={x} y={348} angle={hip}>
    <rect x={-13} width={26} height={104} rx={12} fill={pants} stroke="#394354" strokeWidth={2.5}/>
    <circle cy={96} r={13} fill={pants} stroke="#394354" strokeWidth={2}/>
    <Hinge x={0} y={96} angle={knee}>
      <rect x={-12} width={24} height={111} rx={11} fill={pants} stroke="#394354" strokeWidth={2.5}/>
      <path d="M-13 98 L12 98 L29 112 Q32 123 19 125 H-18 Q-27 123 -24 115Z"
        fill={shoe} stroke="#303543" strokeWidth={2.6}/>
    </Hinge>
  </Hinge>;
const Arm=({x,shoulder,elbow,top,skin,play,ball}:{
  x:number;shoulder:number;elbow:number;top:string;skin:string;play:boolean;ball:string;
})=><Hinge x={x} y={228} angle={shoulder}>
    <rect x={-14} width={28} height={81} rx={13} fill={top} stroke="#576176" strokeWidth={2.5}/>
    <circle cy={73} r={14} fill={top} stroke="#576176" strokeWidth={2}/>
    <Hinge x={0} y={73} angle={elbow}>
      <rect x={-11} width={22} height={77} rx={10} fill={top} stroke="#576176" strokeWidth={2}/>
      {play&&<g transform="translate(0 104)">
        <circle r={26} fill={ball} stroke="#65748b" strokeWidth={3}/>
        <path d="M-23 -9 Q0 -2 21 10 M-12 -22 Q-2 -3 3 24"
          stroke="#fff9f4" strokeWidth={3} fill="none"/>
      </g>}
      <ellipse cy={83} rx={11} ry={12} fill={skin} stroke="#ba9380" strokeWidth={1.8}/>
      {play&&<path d="M-8 79 Q0 71 10 79 L11 87 Q0 91 -7 87Z"
        fill={skin} stroke="#ba9380" strokeWidth={1.6}/>}
    </Hinge>
  </Hinge>;
export const V46_CHILD_RIG_GIRL=({
  x=780,y=240,scale=1,mirror=false,action='front',walkSpeed=1.35,pose,
  skinColor='#efc2aa',hairColor='#4a3542',
  topColor='#df8ba6',pantsColor='#666489',
  shoeColor='#55445a',ballColor='#e8b34e'
}:ChildGirlProps)=>{
  const frame=useCurrentFrame(),{fps}=useVideoConfig(),t=frame/fps;
  const j=getChildGirlPose(action,t,walkSpeed,pose);
  const bounce=action==='run'?-Math.abs(Math.sin(t*Math.PI*2*walkSpeed))*9:
    action==='cry'?Math.sin(t*13)*2:action==='play'?Math.sin(t*6)*2:Math.sin(t*1.4);
  const s=Number.isFinite(scale)&&scale>0?scale:1;
  const tearOffset=((frame%26)/26)*22;
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 640"
    aria-label="可動関節付きの女の子"
    style={{position:'absolute',left:x,top:y,width:360*s,height:640*s,
      overflow:'visible',pointerEvents:'none'}}>
    <g transform={mirror?'translate(360 0) scale(-1 1)':undefined}>
      <g transform={'translate(0 '+bounce+')'}>
        <g transform={'rotate('+j.bodyLean+' 180 345)'}>
          <Leg x={157} hip={j.leftHip} knee={j.leftKnee} pants={pantsColor} shoe={shoeColor}/>
          <Leg x={203} hip={j.rightHip} knee={j.rightKnee} pants={pantsColor} shoe={shoeColor}/>
          <Arm x={131} shoulder={j.leftShoulder} elbow={j.leftElbow}
            top={topColor} skin={skinColor} play={false} ball={ballColor}/>
          {/* Girl's loose sweatshirt and A-line skirt over leggings. */}
          <path d="M145 203 Q180 190 215 203 L232 240 L220 355
                   Q180 368 140 355 L128 240Z"
            fill={topColor} stroke="#576176" strokeWidth={3.5} strokeLinejoin="round"/>
          <path d="M161 206 Q180 219 199 206"
            stroke="#f9d5de" strokeWidth={4}
            fill="none" strokeLinecap="round"/>
          <path d="M144 326 H216 L239 385 Q180 399 121 385Z"
            fill="#b26b98" stroke="#8b587a" strokeWidth={3}/>
          <path d="M139 370 Q180 386 221 370" fill="none" stroke="#cf95b6" strokeWidth={2.5}/>
          <Arm x={229} shoulder={j.rightShoulder} elbow={j.rightElbow}
            top={topColor} skin={skinColor} play={action==='play'} ball={ballColor}/>
          {/* Move head down 8px. The neck begins behind the jaw and ends just inside
              the shirt neckline, avoiding both a floating face and a long skin strip. */}
          <Hinge x={180} y={206} angle={j.headTilt}>
            {/* Ponytail behind a round child's face. */}
            <path d="M32 -109 Q73 -118 81 -81 Q78 -55 55 -56
              Q70 -82 40 -91Z" fill={hairColor} stroke="#3e303d" strokeWidth={2}/>
            <circle cx={43} cy={-104} r={7} fill="#f1c4a9"/>
            <rect x={-12} y={-48} width={24} height={35} rx={9} fill={skinColor}/>
            <ellipse cx={-43} cy={-72} rx={8} ry={12} fill={skinColor}/>
            <ellipse cx={43} cy={-72} rx={8} ry={12} fill={skinColor}/>
            <circle cx={0} cy={-83} r={47} fill={skinColor}
              stroke="#be9380" strokeWidth={2.2}/>
            <path d="M-46 -94 Q-49 -133 -17 -139 L-2 -151
              L13 -142 Q41 -146 47 -102 L43 -89 Q26 -111 12 -117
              Q-4 -103 -22 -108 Q-29 -92 -46 -94Z" fill={hairColor}/>
            {/* Distinct expressions are used only during cry action. */}
            <path d={action==='cry'
              ?"M-33 -85 L-17 -91 M17 -91 L33 -85"
              :"M-31 -94 Q-24 -97 -17 -94 M17 -94 Q24 -97 31 -94"}
              stroke="#59444a" strokeWidth={3} fill="none" strokeLinecap="round"/>
            <ellipse cx={-23} cy={-80} rx={action==='cry'?3.5:4.5} ry={action==='cry'?2.5:5.5}
              fill="#2d303b"/>
            <ellipse cx={23} cy={-80} rx={action==='cry'?3.5:4.5} ry={action==='cry'?2.5:5.5}
              fill="#2d303b"/>
            <circle cx={-21} cy={-82} r={1.4} fill="#ffffff" opacity={action==='cry' ? 0.3 : 1}/>
            <circle cx={25} cy={-82} r={1.4} fill="#ffffff" opacity={action==='cry' ? 0.3 : 1}/>
            <path d="M0 -75 L-2 -65 L2 -64" stroke="#bf937d" strokeWidth={1.7}
              fill="none" strokeLinecap="round"/>
            {action==='cry'
              ?<g>
                <ellipse cx={0} cy={-48} rx={8} ry={10} fill="#9b5b63"/>
                <path d="M-25 -73 L-29 -59 L-27 -38
                         M25 -73 L29 -59 L27 -38"
                  stroke="#7bbfe7" strokeWidth={4} fill="none" strokeLinecap="round"/>
                <ellipse cx={-27} cy={-57+tearOffset} rx={2.5} ry={5}
                  fill="#89d4f0" opacity={.8}/>
                <ellipse cx={27} cy={-57+tearOffset} rx={2.5} ry={5}
                  fill="#89d4f0" opacity={.8}/>
              </g>
              :<path d="M-9 -53 Q0 -43 9 -53" stroke="#9c6066"
                strokeWidth={2.4} fill="none" strokeLinecap="round"/>}
          </Hinge>
        </g>
      </g>
    </g>
  </svg>;
};
export const V46_CHILD_RIG_GIRL_PREVIEW=()=>{
  const frame=useCurrentFrame();
  const action:ChildGirlAction=frame<60?'front':frame<120?'run':frame<180?'play':'cry';
  return <AbsoluteFill style={{background:'#f6eef3',overflow:'hidden'}}>
    <div style={{position:'absolute',left:0,right:0,top:820,bottom:0,background:'#c6d1d5'}}/>
    <V46_CHILD_RIG_GIRL x={780} y={170} action={action}/>
  </AbsoluteFill>;
};
