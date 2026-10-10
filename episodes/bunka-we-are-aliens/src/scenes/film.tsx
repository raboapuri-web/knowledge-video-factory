import {Node,Rect,Txt,makeScene2D} from '@motion-canvas/2d';
import {all,createRef,createSignal,easeInOutCubic,easeOutCubic,waitFor} from '@motion-canvas/core';
import ch0 from '../generated/chapter-0.json';
import ch1 from '../generated/chapter-1.json';
import ch2 from '../generated/chapter-2.json';
import ch3 from '../generated/chapter-3.json';
import ch4 from '../generated/chapter-4.json';
import ch5 from '../generated/chapter-5.json';
import ch6 from '../generated/chapter-6.json';
import {analysisVisual} from './analysis-visuals';

const chapters=[ch0,ch1,ch2,ch3,ch4,ch5,ch6];
const chapterNumber=Number(import.meta.env.VITE_CHAPTER||'0');
const chapter=chapters[chapterNumber]??chapters[0];
const FONT='Noto Sans JP';
const intro=chapterNumber===0?0:2.5;
const max2=(s:string)=>s.split('\n').slice(0,2).join('\n');

export default makeScene2D(function*(view){
 view.fill('#080B10');
 const contentLayer=createRef<Node>();
 const subtitleLayer=createRef<Node>();
 const subtitleText=createRef<Txt>();
 const titleLayer=createRef<Node>();
 const refs=Array.from({length:6},()=>createRef<Node>());
 const phase=Array.from({length:6},()=>createSignal(0));
 // A permanent paint order: contentLayer -> titleLayer -> subtitleLayer.
 // Once mounted, no later view.add() is permitted.
 const [chapterPrefix,chapterName]=chapter.title.split('｜');
 view.add(<>
  <Node ref={contentLayer}>
   {Array.from({length:6},(_,i)=><Node key={String(i)} ref={refs[i]} opacity={i===0?1:0}>
    {analysisVisual(chapterNumber,i,phase[i])}
   </Node>)}
   <Rect x={0} y={-527} width={1920} height={6} fill={'#BE8A66'} opacity={0.6}/>
   <Txt text={chapterPrefix} x={-890} y={-470} offsetX={-1} fontFamily={FONT} fontSize={34} fontWeight={700} fill={'#E5D6C5'}/>
   <Txt text={chapter.sceneTitles[0]} x={-670} y={-470} offsetX={-1} fontFamily={FONT} fontSize={28} fill={'#B0BEC1'} opacity={0.77}/>
  </Node>
  <Node ref={titleLayer} opacity={intro?1:0}>
   <Rect width={1920} height={1080} fill={'#020305'}/>
   <Rect width={200} height={8} y={-165} fill={'#AC4D52'}/>
   <Txt text={chapterPrefix} y={-251} width={1680} fontFamily={FONT} fontSize={54} fontWeight={700} fill={'#BFB5AB'} textAlign={'center'}/>
   <Txt text={chapterName||chapter.title} y={3} width={1620} height={280} textWrap fontFamily={FONT} fontSize={63} lineHeight={91} fontWeight={700} fill={'#FAF7F1'} textAlign={'center'}/>
  </Node>
  <Node ref={subtitleLayer} opacity={intro?0:1}>
   <Rect y={454} width={1920} height={172} fill={'#030A10'} opacity={0.92}/>
   <Rect y={368} width={1920} height={4} fill={'#7D8B8C'} opacity={0.45}/>
   <Txt ref={subtitleText} text={''} y={453} width={1700} height={154} textWrap fontFamily={FONT} fontSize={39} fontWeight={700} lineHeight={59} fill={'#F9F7F2'} textAlign={'center'}/>
  </Node>
 </>);
 if(intro){
  yield* waitFor(intro-0.35);
  yield* all(titleLayer().opacity(0,0.35),subtitleLayer().opacity(1,0.35));
 }
 type Event={caption:string;duration:number;group:number};
 const events:Event[]=chapter.cues.flatMap(cue=>{
  const weights=cue.subs.map(c=>c.replace(/\n/g,'').length);
  const total=weights.reduce((sum,n)=>sum+n,0)||1;
  return cue.subs.map((caption,i)=>({caption:max2(caption),duration:cue.duration*weights[i]/total,group:cue.group}));
 });
 const groupSeconds=Array.from({length:6},(_,group)=>events.filter(e=>e.group===group).reduce((a,e)=>a+e.duration,0));
 const elapsed=Array(6).fill(0);
 let currentGroup=0;
 for(const event of events){
  const group=event.group;
  const duration=Math.max(0.05,event.duration);
  subtitleText().text(event.caption);
  const slices=Math.max(1,Math.ceil(duration/3.0));
  const slice=duration/slices;
  const start=elapsed[group];
  for(let j=1;j<=slices;j++){
   const goal=Math.min(1,(start+duration*j/slices)/Math.max(0.1,groupSeconds[group]));
   const motion=Math.max(0.05,slice*0.80);
   if(currentGroup!==group&&j===1){
    const previous=currentGroup;
    yield* all(refs[previous]().opacity(0,Math.min(0.45,motion)),refs[group]().opacity(1,Math.min(0.65,motion)),phase[group](goal,motion,easeOutCubic));
    currentGroup=group;
   }else{
    yield* phase[group](goal,motion,easeInOutCubic);
   }
   yield* waitFor(Math.max(0,slice-motion));
  }
  elapsed[group]+=duration;
 }
 subtitleText().text('');
 yield* waitFor(0.1);
});
