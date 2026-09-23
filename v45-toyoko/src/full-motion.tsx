import React from 'react';
import {Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {HoodieGirlRig} from '../../shared/asset-library/人物テンプレート/hoodie-girl-rig';
import {HoodieBoyRig} from '../../shared/asset-library/人物テンプレート/hoodie-boy-rig';
import {OfficeWorkerRig} from '../../shared/asset-library/人物テンプレート/office-worker-rig';
import {OfficeWomanRig} from '../../shared/asset-library/人物テンプレート/office-woman-rig';
import {RESEARCHER_MAN} from '../../shared/asset-library/人物テンプレート/RESEARCHER_MAN';
import {RESEARCHER_WOMAN} from '../../shared/asset-library/人物テンプレート/RESEARCHER_WOMAN';
import {ParentFatherRig} from '../../shared/asset-library/人物テンプレート/PARENT_FATHER';
import {PASSERBY} from '../../shared/asset-library/人物テンプレート/PASSERBY';

export type Shot={
 shotId:string;visual:string;narrationCue:string;camera:string;background:string;
 characters:string[];props:string[];requiredRigActions:string[];
 template:string|null;weatherEffect?:{type:string};
 timing:{targetDurationSeconds:number};
};
export const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const smooth=(n:number)=>{const t=clamp(n);return t*t*(3-2*t);};
export const lerp=(a:number,b:number,t:number)=>a+(b-a)*clamp(t);
const characterColors={
 GIRL_16:['#7764ac','#715da4'],FRIEND_GIRL:['#b97382','#ad6577'],
 FRIEND_BOY:['#438b90','#357c83'],OTHER_YOUTH:['#69788c','#5b697d'],
 ABROAD_YOUTH:['#9e8879','#89776b']
} as Record<string,string[]>;
const mobile=['phone_use','connect_charger'];
const armEvents=['reach','receive','point','withdraw_hand','search_wallet','search_bag','pack_bag','clasp_hands'];
const leanEvents=['look_down','look_up','look_around','look_left','look_right','head_tilt','turn','step_back','listen','wake_up'];

export const MovingActors=({shot,p,seconds}:{shot:Shot;p:number;seconds:number})=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const actors=shot.characters;
 const actionList=shot.requiredRigActions;
 const visual=shot.visual;
 if(!actors.every(id=>['GIRL_16','FRIEND_BOY','FRIEND_GIRL','OTHER_YOUTH','SUPPORTER',
   'OLDER_MAN','PASSERBY','RESEARCHER','ABROAD_STAFF','ABROAD_YOUTH','PARENT'].includes(id)))
   throw Error('Unregistered character in '+shot.shotId);
 const walking=actionList.some(a=>['walk','stop','step_back','turn'].includes(a));
 const seated=actionList.some(a=>['sit','shift_seat','wake_up'].includes(a));
 const standing=actionList.includes('stand');
 const usingPhone=actionList.some(a=>mobile.includes(a))||visual.includes('スマホ')||visual.includes('スマートフォン');
 const talking=actionList.includes('talk');
 const isDoor=shot.props.includes('DOOR')||shot.camera.includes('door');
 const actionIndex=p<.33?0:p<.68?1:2;
 const sceneDirection=shot.shotId.charCodeAt(1)%2===0?1:-1;
 return <>
 {actors.map((id,i)=>{
   if(id==='PASSERBY')return <PASSERBY key={id+i}
      x={-110+sceneDirection*120*p} y={280} scale={actors.length>1?.43:.65}
      action={walking?'walk':'idle'} flashEnabled={false}/>;
   const z=actors.length>=3?.61:actors.length===2?.76:.87;
   const y=actors.length>=3?475:actors.length===2?382:336;
   const baseX=actors.length===1?785:actors.length===2?380+i*775:130+i*550;
   const progress=walking?smooth((p-(i*.07))/.88):0;
   const dx=walking?lerp(-145,140,progress)*sceneDirection:0;
   const x=baseX+dx+(i===1&&visual.includes('位置をずらす')?smooth((p-.25)/.25)*140:0);
   const walkAction=walking&&(p<.78&&!visual.includes('止め')||p<.45);
   const actorSits=seated&&(id==='GIRL_16'||id==='FRIEND_BOY'||id==='FRIEND_GIRL'||id.includes('YOUTH'));
   const sitStart=Math.round(seconds*fps*.42);
   const action=usingPhone&&actorSits?(p<.45?'sit':'sitPhone'):
    actorSits&&p>.33?'sit':standing&&p<.38?'standUp':
    walkAction?(usingPhone?'walkPhone':'walk'):'idle';
   const reach=armEvents.some(a=>actionList.includes(a));
   const pose:Record<string,number>={};
   if(leanEvents.some(a=>actionList.includes(a)))pose.headTilt=actionList.includes('look_down')?15:
     actionList.includes('look_up')?-14:actionList.includes('look_left')?-11:actionList.includes('look_right')?11:7;
   if(actionList.includes('step_back')||actionList.includes('withdraw_hand'))pose.bodyLean=lerp(0,-13,smooth((p-.3)/.45));
   if(actionList.includes('clasp_hands')){pose.leftShoulder=33;pose.rightShoulder=-33;pose.leftElbow=-88;pose.rightElbow=88;}
   if(reach){
      const motion=actionList.includes('withdraw_hand')?1-smooth((p-.4)/.4):smooth((p-.13)/.4);
      pose.rightShoulder=lerp(-8,-65,motion);
      pose.rightElbow=lerp(9,83,motion);
      if(actionList.includes('receive')){pose.leftShoulder=lerp(7,51,motion);pose.leftElbow=lerp(-6,-72,motion);}
   }
   if(actionList.includes('head_tilt')||visual.includes('肩にもたれ')){pose.headTilt=12;pose.bodyLean=7;}
   if(visual.includes('一歩引く')||visual.includes('ためらい'))pose.bodyLean=lerp(0,-10,smooth((p-.3)/.4));
   if(id==='GIRL_16'||id==='FRIEND_GIRL'||id==='OTHER_YOUTH'||id==='ABROAD_YOUTH'&&i%2===0){
     const colors=characterColors[id]||characterColors.OTHER_YOUTH;
     return <HoodieGirlRig key={id+i} x={x} y={y} scale={z}
       action={action as any} actionStartFrame={action==='sit'?p>.33?sitStart:-90:0}
       showChair={false} hideFaceFeatures={id==='OTHER_YOUTH'}
       hoodieColor={colors[0]} sleeveColor={colors[1]}
       hairColor={id==='ABROAD_YOUTH'?'#a47a52':'#3d3544'}
       mirror={i%2===1} talking={talking&&i%2===0} pose={pose}/>;
   }
   if(id==='FRIEND_BOY'||id==='ABROAD_YOUTH'){
     const colors=characterColors[id];
     return <HoodieBoyRig key={id+i} x={x} y={y} scale={z}
       action={action as any} actionStartFrame={action==='sit'?p>.33?sitStart:-90:0}
       showChair={false} hideFaceFeatures={false} hoodieColor={colors[0]}
       sleeveColor={colors[1]} hairColor={id==='ABROAD_YOUTH'?'#9a7049':'#2e3443'}
       mirror={i%2===1} talking={talking&&i%2===0} pose={pose}/>;
   }
   if(id==='RESEARCHER')return i%2===1?
     <RESEARCHER_WOMAN key={id+i} x={x} y={y} scale={z}
        showFlask={false} action={walkAction?'walk':'idle'} talking={talking} pose={pose}/>:
     <RESEARCHER_MAN key={id+i} x={x} y={y} scale={z}
        showFlask={false} action={walkAction?'walk':'idle'} talking={talking} pose={pose}/>;
   if(id==='PARENT')return <ParentFatherRig key={id+i} x={x} y={y} scale={z}
      showBag={false} action={walkAction?'walk':'idle'} pose={pose}
      mirror={i%2===1}/>;
   if(id==='ABROAD_STAFF')return <OfficeWomanRig key={id+i} x={x} y={y} scale={z}
      action={walkAction?'walk':'idle'} talking={talking} pose={pose}
      showBriefcase={false} suitColor='#658190' pantsColor='#404f5f'/>;
   if(id==='OLDER_MAN')return <OfficeWorkerRig key={id+i} x={x} y={y} scale={z}
      action={walkAction?'walk':'idle'} talking={talking} pose={pose}
      showBriefcase={false} suitColor='#635f60' pantsColor='#35383e' shirtColor='#e5d8cf'/>;
   return <OfficeWorkerRig key={id+i} x={x} y={y} scale={z}
      action={walkAction?'walk':'idle'} talking={talking} pose={pose}
      showBriefcase={false} suitColor='#718081' pantsColor='#414b55' shirtColor='#e8e5d9'/>;
 })}
 </>;
};

const propsLibrary:Record<string,string>={
 BAG:'BAG.png',BEDDING:'BEDDING.png',CHARGER:'CHARGER.png',DRINK:'DRINK.png',
 FOOD:'pan.png',TABLE:'TABLE.png',WALLET:'WALLET.png',PHONE:'phone.svg',CLOCK:'clock.svg'
};
const Door=({p,close=false}:{p:number;close?:boolean})=>{
 const t=smooth((p-.21)/.56),open=close?1-t:t;
 return <svg viewBox='0 0 255 580' style={{position:'absolute',left:1500,top:185,
 width:255,height:580,filter:'drop-shadow(0 14px 22px rgba(0,0,0,.43))'}}>
  <rect x={8} y={6} width={240} height={557} stroke='#b4adb0' strokeWidth={9} fill='#1b2636'/>
  <rect x={23} y={17} width={212} height={532} fill='#687e86'/>
  <g transform={'translate(20 12) scale('+(1-.88*open)+' 1)'}>
   <rect x={0} y={0} width={215} height={537} stroke='#e0d6c5' strokeWidth={5} fill='#60707a'/>
   <rect x={18} y={23} width={173} height={193} fill='#293b49' opacity={.54}/>
   <circle cx={177} cy={319} r={10} fill='#dfcc97'/>
  </g>
 </svg>;
};
const Form=({p}:{p:number})=><svg style={{position:'absolute',
 left:lerp(1055,830,smooth((p-.2)/.5)),top:700,width:92,height:119,
 transform:'rotate(-5deg)',filter:'drop-shadow(0 4px 10px #12151d)'}} viewBox='0 0 92 119'>
 <rect x={2} y={2} width={87} height={114} rx={2} fill='#f4f0e4'/>
 <path d='M13 24 H77 M13 39 H66 M13 54 H77 M13 69 H60' stroke='#aaa99e' strokeWidth={4}/>
 </svg>;
const MealTray=({p}:{p:number})=><svg style={{position:'absolute',
 left:lerp(1050,870,smooth((p-.25)/.45)),top:748,width:250,height:116}}
 viewBox='0 0 250 116'>
 <rect x={4} y={44} width={242} height={66} rx={16} fill='#abb7b9' stroke='#536978' strokeWidth={4}/>
 <ellipse cx={83} cy={51} rx={54} ry={31} fill='#ede5d9'/>
 <ellipse cx={83} cy={51} rx={34} ry={18} fill='#d8bf83'/>
 <ellipse cx={186} cy={46} rx={37} ry={29} fill='#f6f1df'/>
 <path d='M174 37 L196 56' stroke='#6b927a' strokeWidth={9} strokeLinecap='round'/>
 </svg>;
const PhoneScreen=({p}:{p:number})=><svg viewBox='0 0 88 170' style={{
 position:'absolute',left:1210,top:500,width:88,height:170,
 transform:'rotate('+lerp(-14,2,smooth(p))+'deg)',
 filter:'drop-shadow(0 5px 12px rgba(0,0,0,.45))'}}>
 <rect width={85} height={165} rx={13} fill='#20252f' stroke='#a9b4b8' strokeWidth={4}/>
 <rect x={8} y={16} width={69} height={128} rx={6} fill='#172f47'/>
 <circle cx={43} cy={154} r={5} fill='#aebfc7'/>
 <circle cx={23} cy={50} r={8} fill='#789bad'/>
 <path d='M39 46 H62 M39 57 H58' stroke='#789bad' strokeWidth={5} strokeLinecap='round'/>
 </svg>;
const AnimatedClock=({p}:{p:number})=><svg viewBox='0 0 190 190'
 style={{position:'absolute',left:1475,top:164,width:190,height:190,
 filter:'drop-shadow(0 4px 11px #151b24)'}}>
 <circle cx={95} cy={95} r={86} fill='#f5f1df' stroke='#516171' strokeWidth={10}/>
 <path d={'M95 95 L'+(95+Math.cos(Math.PI*2*p-Math.PI/2)*63)+' '+(95+Math.sin(Math.PI*2*p-Math.PI/2)*63)}
  stroke='#687788' strokeWidth={6} strokeLinecap='round'/>
 <path d='M95 95 L95 43' stroke='#222b3b' strokeWidth={9} strokeLinecap='round'/>
 <circle cx={95} cy={95} r={7} fill='#222b3b'/>
 </svg>;
export const ShotProps=({shot,p}:{shot:Shot;p:number})=>{
 const props=shot.props,ids=shot.characters;
 const primaryX=ids.length<=1?910:ids.length===2?510:300;
 const reach=smooth((p-.23)/.48),rightX=ids.length>1?lerp(primaryX+370,primaryX+565,reach):primaryX+260;
 return <>
 {props.includes('TABLE')&&<Img src={staticFile('assets/library/パーツ/TABLE.png')}
 style={{position:'absolute',left:660,top:738,width:630,opacity:.96}}/>}
 {props.includes('BEDDING')&&<Img src={staticFile('assets/library/パーツ/BEDDING.png')}
 style={{position:'absolute',left:945,top:750,width:320}}/>}
 {props.includes('DOOR')&&<Door p={p} close={shot.requiredRigActions.includes('close_door')||shot.visual.includes('閉じる')}/>}
 {props.includes('FORM')&&<Form p={p}/>}
 {props.includes('MEAL_TRAY')&&<MealTray p={p}/>}
 {props.includes('CLOCK')&&<AnimatedClock p={p}/>}
 {props.includes('PHONE')&&<PhoneScreen p={p}/>}
 {props.includes('CHARGER')&&<svg style={{position:'absolute',left:890,top:630,width:340,height:210}} viewBox='0 0 340 210'>
   <path d={'M10 40 Q140 '+lerp(115,195,reach)+' 230 65 L'+lerp(254,292,reach)+' 19'}
      stroke='#e1dfcf' strokeWidth={6} fill='none' strokeLinecap='round'/>
   <rect x={3} y={25} width={25} height={26} rx={3} fill='#c4cbd0'/></svg>}
 {(['BAG','DRINK','FOOD','WALLET'] as const).filter(id=>props.includes(id)).map((id,i)=>{
   const filename=propsLibrary[id],hand=shot.requiredRigActions.some(a=>['reach','receive','search_wallet','search_bag','pack_bag'].includes(a));
   const x=id==='BAG'?primaryX+275:id==='WALLET'?primaryX+335:
     hand?rightX:primaryX+340;
   const y=id==='BAG'?790:id==='WALLET'?720:id==='DRINK'?640:690;
   const width=id==='BAG'?130:id==='WALLET'?128:id==='DRINK'?85:115;
   return <Img key={id+i} src={staticFile('assets/library/パーツ/'+filename)}
    style={{position:'absolute',left:x+i*55,top:y-i*20,width,
     transform:'rotate('+lerp(-6,5,p)+'deg)',
     filter:'drop-shadow(0 5px 14px rgba(0,0,0,.35))'}}/>;
 })}
 </>;
};
