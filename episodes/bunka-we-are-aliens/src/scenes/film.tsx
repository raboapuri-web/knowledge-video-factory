import {Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {all, createRef, createSignal, easeInOutCubic, easeOutCubic, waitFor} from '@motion-canvas/core';
import ch0 from '../generated/chapter-0.json';
import ch1 from '../generated/chapter-1.json';
import ch2 from '../generated/chapter-2.json';
import ch3 from '../generated/chapter-3.json';
import ch4 from '../generated/chapter-4.json';
import ch5 from '../generated/chapter-5.json';
import ch6 from '../generated/chapter-6.json';
import {kinds,visual} from './visuals';

const allChapters=[ch0,ch1,ch2,ch3,ch4,ch5,ch6];
const chapterNumber=Number(import.meta.env.VITE_CHAPTER || '0');
const chapter=allChapters[chapterNumber]??allChapters[0];
const FONT='Noto Sans JP';

export default makeScene2D(function*(view){
  view.fill('#111923');
  const contentLayer=createRef<Node>();
  const subtitleLayer=createRef<Node>();
  const subtitleText=createRef<Txt>();
  const chapterHeader=createRef<Txt>();
  const visualRefs=Array.from({length:6},()=>createRef<Node>());
  const phase=Array.from({length:6},()=>createSignal(0));
  const subtitleBg='#091017';
  view.add(<>
    <Node ref={contentLayer}>
      {kinds[chapterNumber].map((kind,i)=><Node key={`${i}-${kind}`} ref={visualRefs[i]} opacity={i===0?1:0}>
         {visual(kind,phase[i],i)}
      </Node>)}
      <Rect width={1920} height={8} y={-531} fill={'#B38164'} opacity={0.65}/>
      <Txt ref={chapterHeader} text={chapter.title} x={-895} y={-469} fontSize={29} fontWeight={700} fontFamily={FONT} fill={'#D3C9B9'} textAlign={'left'} offsetX={-1} opacity={0.85}/>
    </Node>
    <Node ref={subtitleLayer}>
      <Rect width={1920} height={170} y={455} fill={subtitleBg} opacity={0.90}/>
      <Txt ref={subtitleText} text={''} y={451} width={1660} fontFamily={FONT} fontSize={41} fontWeight={700} lineHeight={61} fill={'#F5F2E9'} textAlign={'center'} textWrap/>
    </Node>
  </>);

  // contentLayer and subtitleLayer are permanent. Never append a visual to view after them.
  let lastGroup=0;
  const events=chapter.cues.flatMap(cue=>{
    const duration=cue.duration / cue.subs.length;
    return cue.subs.map((caption,i)=>({caption, duration, group:cue.group,first:i===0}));
  });
  const perGroup=Array.from({length:6},(_,g)=>events.filter(e=>e.group===g).length);
  const step=Array(6).fill(0);
  for(const event of events){
    const d=Math.max(0.1,event.duration);
    const curr=event.group;
    const changed=curr!==lastGroup;
    const i=step[curr]++;
    subtitleText().text(event.caption);
    const startPhase=i/Math.max(1,perGroup[curr])*13;
    const endPhase=(i+1)/Math.max(1,perGroup[curr])*13;
    const updates=Math.max(1,Math.ceil(d/3.5));
    const slice=d/updates;
    for(let k=0;k<updates;k++){
      const target=startPhase+(endPhase-startPhase)*(k+1)/updates;
      const move=Math.min(0.95,slice*0.5);
      if(changed && k===0){
        // Fade once at semantic transition; inside the scene, the world keeps evolving.
        const prev=lastGroup;
        yield* all(
          visualRefs[prev]().opacity(0,Math.min(0.45,slice*0.35)),
          visualRefs[curr]().opacity(1,Math.min(0.65,slice*0.5)),
          phase[curr](target,move,easeOutCubic),
        );
        lastGroup=curr;
      }else{
        yield* phase[curr](target,move,easeInOutCubic);
      }
      yield* waitFor(Math.max(0.05,slice-move));
    }
  }
  subtitleText().text('');
  yield* waitFor(0.1);
});
