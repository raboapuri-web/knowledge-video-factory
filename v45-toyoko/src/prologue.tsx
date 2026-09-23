import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {HoodieGirlRig, type HoodieGirlAction} from '../../shared/asset-library/人物テンプレート/hoodie-girl-rig';
import {HoodieBoyRig, type HoodieBoyAction} from '../../shared/asset-library/人物テンプレート/hoodie-boy-rig';
import {OfficeWorkerRig} from '../../shared/asset-library/人物テンプレート/office-worker-rig';
import {RESEARCHER_MAN} from '../../shared/asset-library/人物テンプレート/RESEARCHER_MAN';

export type ToyokoShot={
  shotId:string;
  background:string;
  characters:string[];
  props:string[];
  visual:string;
  timing:{targetDurationSeconds:number};
};

const clamp=(v:number)=>Math.min(1,Math.max(0,v));
const tween=(a:number,b:number,p:number)=>a+(b-a)*clamp(p);
const smooth=(p:number)=>{const x=clamp(p);return x*x*(3-2*x);};
const lib=(dir:string,file:string)=>staticFile('assets/library/'+dir+'/'+file);
const C={hero:'#7764ac',heroSleeve:'#715da4',friend:'#c27c84',friendSleeve:'#b96b78',boy:'#438b90'};

const Backdrop=({file,shotId,p,children}:{
  file:string;shotId:string;p:number;children:React.ReactNode
})=>{
  // The source PNG stays still; only the camera transforms the plate.
  const crane=shotId==='P01-01';
  const track=/^(P01-02|P03-03|P04-01|P06-02)$/.test(shotId);
  const zoom=/^(P01-03|P02-01|P04-03|P05-03|P06-03)$/.test(shotId);
  const x=track?tween(-26,24,p):0;
  const y=crane?tween(-52,22,p):0;
  const scale=zoom?tween(1.035,1.095,p):crane?tween(1.13,1.04,p):1.07;
  return <AbsoluteFill style={{background:'#0a101a',overflow:'hidden'}}>
    <Img src={lib('背景',file)} style={{position:'absolute',width:'100%',height:'100%',
      objectFit:'cover',transform:'translate('+x+'px,'+y+'px) scale('+scale+')'}}/>
    {children}
  </AbsoluteFill>;
};

const Girl=({x,y=340,z=.82,action='idle',friend=false,faceless=false,
  pose={},actionStartFrame=0,mirror=false,talking=false}:{
  x:number;y?:number;z?:number;action?:HoodieGirlAction;friend?:boolean;faceless?:boolean;
  pose?:{headTilt?:number;leftShoulder?:number;rightShoulder?:number;leftElbow?:number;rightElbow?:number;bodyLean?:number};
  actionStartFrame?:number;mirror?:boolean;talking?:boolean;
})=><HoodieGirlRig x={x} y={y} scale={z} action={action} pose={pose}
    actionStartFrame={actionStartFrame} showChair={false} hideFaceFeatures={faceless}
    talking={talking} mirror={mirror}
    hoodieColor={friend?C.friend:C.hero} sleeveColor={friend?C.friendSleeve:C.heroSleeve}/>;

const Boy=({x,y=345,z=.82,action='idle',faceless=false,pose={},actionStartFrame=0,
  mirror=false,talking=false}:{
  x:number;y?:number;z?:number;action?:HoodieBoyAction;faceless?:boolean;
  pose?:{headTilt?:number;leftShoulder?:number;rightShoulder?:number;leftElbow?:number;rightElbow?:number;bodyLean?:number};
  actionStartFrame?:number;mirror?:boolean;talking?:boolean;
})=><HoodieBoyRig x={x} y={y} scale={z} action={action} pose={pose}
    actionStartFrame={actionStartFrame} showChair={false} hideFaceFeatures={faceless}
    mirror={mirror} talking={talking} hoodieColor={C.boy}/>;

const Adult=({x,y=280,z=.87,walk=false,talk=false,pose={}}:{
  x:number;y?:number;z?:number;walk?:boolean;talk?:boolean;
  pose?:{rightShoulder?:number;rightElbow?:number;leftShoulder?:number;headTilt?:number};
})=><OfficeWorkerRig x={x} y={y} scale={z} action={walk?'walk':'idle'}
  showBriefcase={false} talking={talk} pose={pose} suitColor='#718081'
  shirtColor='#e8e5d9' pantsColor='#414b55'/>;

const Passerby=({x,y=260,z=.8}:{
  x:number;y?:number;z?:number;
})=><RESEARCHER_MAN x={x} y={y} scale={z} action='walk'
  showFlask={false} labCoatColor='#465463' shirtColor='#9da7af'
  pantsColor='#303e4e'/>;

const Part=({name,x,y,w,rotation=0,opacity=1}:{
  name:string;x:number;y:number;w:number;rotation?:number;opacity?:number;
})=><Img src={lib('パーツ',name)} style={{position:'absolute',left:x,top:y,
  width:w,height:'auto',opacity,transform:'rotate('+rotation+'deg)',
  filter:'drop-shadow(0 6px 12px rgba(0,0,0,.3))'}}/>;

const Bag=({x,y,z=.32,opacity=1}:{x:number;y:number;z?:number;opacity?:number})=>
  <Part name='BAG.png' x={x} y={y} w={270*z} opacity={opacity}/>;

const Bread=({x,y,z=.3,opacity=1}:{x:number;y:number;z?:number;opacity?:number})=>
  <Part name='pan.png' x={x} y={y} w={280*z} opacity={opacity}/>;

const Wallet=({x,y}:{x:number;y:number})=>
  <Part name='WALLET.png' x={x} y={y} w={125}/>;

const Door=({p,x=1390,y=196,exit=false}:{
  p:number;x?:number;y?:number;exit?:boolean;
})=>{
  const open=smooth((p-.18)/.48);
  return <svg style={{position:'absolute',left:x,top:y,width:335,height:670,
    overflow:'visible',filter:'drop-shadow(0 8px 16px rgba(0,0,0,.42))'}}
    viewBox='0 0 335 670'>
    <rect x={13} y={8} width={298} height={637} fill='#18202b' stroke='#c4bec0' strokeWidth={12}/>
    <rect x={26} y={23} width={270} height={606} fill={exit?'#1d2839':'#aab8b9'}/>
    <g transform={'translate(24 20) scale('+(1-open*.84)+' 1)'}>
      <rect width={274} height={608} rx={3} fill={exit?'#5c6979':'#718181'}
        stroke='#d6d2c6' strokeWidth={5}/>
      <rect x={26} y={30} width={216} height={220} rx={4} fill='#31404c' opacity={.46}/>
      <circle cx={228} cy={354} r={10} fill='#e7dbb5'/>
      <rect x={220} y={345} width={38} height={8} rx={4} fill='#e7dbb5'/>
    </g>
  </svg>;
};

const FoodHandover=({p,fromX,fromY,toX,toY}:{
  p:number;fromX:number;fromY:number;toX:number;toY:number;
})=>{
  const t=smooth((p-.36)/.42);
  const x=tween(fromX,toX,t),y=tween(fromY,toY,t);
  return <><svg style={{position:'absolute',left:fromX-24,top:fromY-35,width:104,height:102}}
      viewBox='0 0 104 102'>
      <path d={'M15 17 L85 12 L91 88 L11 88 Z'} fill='#e5d5ba'
        stroke='#a99a82' strokeWidth={4}/>
      <path d={'M15 17 L'+(15+t*13)+' '+(3-t*2)+' L85 12'} fill='none'
        stroke='#f7ede0' strokeWidth={5}/>
    </svg>
    <Bread x={x} y={y} z={.34}/></>;
};

const TimeShade=({amount}:{amount:number})=><AbsoluteFill style={{
  background:'#071025',opacity:clamp(amount)*.48,pointerEvents:'none'
}}/>;

/**
 * The 18 cases below deliberately follow storyboard shots one-for-one.
 * No narration/subtitles: the original approved full text is not in the repository.
 * This is a VISUAL REVIEW cut only; it must not be mistaken for the voiced episode.
 */
export const PrologueShot=({shot,file}:{shot:ToyokoShot;file:string})=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const p=clamp(frame/Math.max(1,Math.round(shot.timing.targetDurationSeconds*fps)-1));
  let actors:React.ReactNode=null;
  let foreground:React.ReactNode=null;
  let secondaryPlate:React.ReactNode=null;
  switch(shot.shotId){
    case 'P01-01':
      // Wide descending establishment; the next plate is already the ground-level square.
      break;
    case 'P01-02':
      actors=<>
        <Passerby x={tween(1320,170,p)} y={300} z={.78}/>
        <Boy x={1340} y={490} z={.54} action='idle' faceless/>
      </>;
      break;
    case 'P01-03':
      actors=<>
        <Boy x={390} y={468} z={.67} action='sit' faceless actionStartFrame={-60}/>
        <Girl x={780} y={458} z={.68} action='sit' faceless actionStartFrame={-60}/>
        <Boy x={1170} y={475} z={.64} action='sitPhone' faceless/>
      </>;
      break;
    case 'P02-01':
      actors=<Girl x={760} y={355} z={.95} action='sitPhone' faceless/>;
      break;
    case 'P02-02':
      actors=<>
        <Boy x={445} y={428} z={.8} action='sit' actionStartFrame={-60}
          pose={{rightShoulder:tween(-36,-77,smooth((p-.22)/.48)),rightElbow:74}}/>
        <Girl x={1000} y={435} z={.8} action='sit' friend actionStartFrame={-60}
          pose={{leftShoulder:tween(11,60,smooth((p-.38)/.38)),leftElbow:-66}}/>
      </>;
      foreground=<FoodHandover p={p} fromX={825} fromY={630} toX={1070} toY={620}/>;
      break;
    case 'P02-03':
      actors=<>
        <Passerby x={tween(1550,1270,p)} y={450} z={.56}/>
        <Boy x={540} y={490} z={.67} action='sit' faceless actionStartFrame={-60}/>
        <Girl x={740} y={500} z={.65} action='sit' faceless actionStartFrame={-60}
          pose={{headTilt:17,bodyLean:9}}/>
      </>;
      break;
    case 'P03-01': {
      const x=tween(680,1040,smooth(p));
      actors=<Girl x={x} y={360} z={.8} action={p<.13?'idle':'walk'}/>;
      foreground=<Bag x={x+212} y={710} z={.5}/>;
      break;
    }
    case 'P03-02':
      actors=<Girl x={760} y={355} z={.89} action='sitPhone'/>;
      foreground=<>
        <Bag x={1100} y={803} z={.5}/>
        <svg viewBox='0 0 140 112' style={{position:'absolute',left:1095,top:420,
          width:140,opacity:Math.min(1,Math.max(0,(p-.23)*5))}}>
          <rect x={2} y={6} width={136} height={98} rx={18} fill='#d8e6e1' stroke='#53766e' strokeWidth={4}/>
          <circle cx={37} cy={55} r={15} fill='#93afab'/>
          <circle cx={91} cy={49} r={8} fill='#93afab'/>
          <path d='M78 68 H115' stroke='#93afab' strokeWidth={7} strokeLinecap='round'/>
        </svg>
      </>;
      break;
    case 'P03-03': {
      const street=smooth((p-.69)/.25);
      secondaryPlate=<Img src={lib('背景','BG_TOWN_NIGHT_WIDE.png')} style={{
        position:'absolute',width:'100%',height:'100%',objectFit:'cover',opacity:street
      }}/>;
      const x=tween(880,1080,smooth(p));
      actors=<>
        <Girl x={x} y={300} z={.87} action={p<.45?'idle':'walk'}/>
        <Boy x={350} y={453} z={.55} action='idle' faceless/>
      </>;
      foreground=<Bag x={x+215} y={700} z={.47}/>;
      break;
    }
    case 'P04-01': {
      const dx=tween(-100,200,smooth(p));
      actors=<>
        <Girl x={460+dx} y={340} z={.8} action='walk'/>
        <Girl x={940+dx} y={365} z={.78} action='walk' friend/>
      </>;
      secondaryPlate=<TimeShade amount={smooth((p-.32)/.65)}/>;
      foreground=<Bag x={690+dx} y={695} z={.48}/>;
      break;
    }
    case 'P04-02':
      actors=<>
        <Girl x={430} y={350} z={.85} action='idle'
          pose={{rightShoulder:-55,rightElbow:75}}/>
        <Girl x={1030} y={356} z={.82} action='idle' friend
          pose={{leftShoulder:44,leftElbow:-74}}/>
      </>;
      foreground=<>
        <Wallet x={803} y={692}/>
        <Bread x={880} y={665} z={.44}/>
        <svg style={{position:'absolute',left:745,top:705,width:140,height:75}}>
          <circle cx={25+tween(0,33,p)} cy={32} r={17} fill='#b9b8a7' stroke='#827968' strokeWidth={3}/>
          <circle cx={74+tween(0,18,p)} cy={30} r={14} fill='#d4c48c' stroke='#827968' strokeWidth={3}/>
        </svg>
      </>;
      break;
    case 'P04-03':
      actors=<>
        <Girl x={430} y={465} z={.74} action='sit' actionStartFrame={-60}
          pose={{headTilt:tween(3,23,p)}}/>
        <Boy x={830} y={479} z={.70} action='sitPhone'/>
        <Girl x={1220} y={475} z={.70} action='sitPhone' friend/>
      </>;
      break;
    case 'P05-01':
      actors=<>
        <Girl x={360} y={352} z={.82} action='idle'
          pose={{headTilt:tween(-3,5,p)}}/>
        <Adult x={1100} y={296} z={.90} talk
          pose={{rightShoulder:tween(-10,-42,p),rightElbow:47}}/>
      </>;
      foreground=<Bag x={580} y={755} z={.45}/>;
      break;
    case 'P05-02': {
      const dx=tween(-170,100,smooth(p));
      actors=<>
        <Adult x={490+dx} y={325} z={.85} talk
          pose={{rightShoulder:tween(-24,-68,smooth((p-.16)/.42)),rightElbow:89}}/>
        <Girl x={920+dx} y={352} z={.80} action={p<.65?'walk':'idle'}/>
      </>;
      foreground=<><Bag x={1137+dx} y={755} z={.43}/>
        <Door p={p} x={1370} y={170}/></>;
      break;
    }
    case 'P05-03':
      actors=<Girl x={240} y={347} z={.83} action='idle'
        pose={{headTilt:tween(-7,9,p),bodyLean:tween(1,-2,p)}}/>;
      foreground=<Bag x={470} y={769} z={.47}/>;
      break;
    case 'P06-01': {
      const dx=tween(450,100,smooth(p));
      actors=<Girl x={dx} y={352} z={.84}
        action={p<.27?'idle':'walk'} mirror/>;
      foreground=<><Bag x={dx+220} y={747} z={.47}/>
        <Door p={p} exit x={1240} y={170}/></>;
      break;
    }
    case 'P06-02': {
      const dx=tween(240,1100,smooth(p));
      actors=<Girl x={dx} y={325} z={.85} action='walk'
        pose={{headTilt:tween(1,-8,p)}}/>;
      foreground=<Bag x={dx+220} y={744} z={.47}/>;
      break;
    }
    case 'P06-03':{
      const boyShift=smooth((p-.15)/.23);
      const girlX=tween(260,660,smooth((p-.16)/.44));
      const girlAction:HoodieGirlAction=p<.42?'walk':p<.59?'sit':'sitPhone';
      actors=<>
        <Boy x={930+boyShift*155} y={451} z={.75} action='sit'
          actionStartFrame={-60} pose={{headTilt:tween(8,-11,smooth((p-.05)/.2))}}/>
        <Girl x={1380} y={466} z={.73} action='sitPhone' friend/>
        <Girl x={girlX} y={435} z={.76} action={girlAction}
          actionStartFrame={Math.round(shot.timing.targetDurationSeconds*fps*.42)}/>
      </>;
      foreground=<Bag x={girlX+190} y={805} z={.45}/>;
      break;
    }
    default:
      throw Error('Missing explicitly staged prologue cut '+shot.shotId);
  }
  return <Backdrop file={file} shotId={shot.shotId} p={p}>
    {secondaryPlate}
    {actors}
    {foreground}
  </Backdrop>;
};
