// V150 V2: narration-locked cinematic infographic film.
import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import '@fontsource/noto-serif-jp/700.css';
import {all, createRef, delay, waitFor} from '@motion-canvas/core';
import {Circle, Line, Node, Rect, Txt, makeScene2D} from '@motion-canvas/2d';
import {buildDesign,C} from './visuals-v2';

const SF='Noto Sans JP';
const TITLES:Record<string,string> = {
  prologue:'問いの始まり',chapter1:'なぜ、知人が情報を運ぶのか',
  chapter2:'ネットワークに隠された橋',chapter3:'2,000万人の実験',
  chapter4:'それでも親友が必要な理由',epilogue:'もう一度、世界を見る'
};
const FIRST=[1,8,18,29,34,52];
function splitJapanese(value:string,step=29,maxLines=3){
  const s=String(value||'').replace(/\n/g,'');if(s.length<=step)return s;
  const out:string[]=[];for(let i=0;i<s.length;i+=step)out.push(s.slice(i,i+step));
  if(out.length>maxLines)return out.slice(0,maxLines-1).concat([out.slice(maxLines-1).join('')]).join('\n');
  return out.join('\n');
}
type Stage={
 s:any,layer:any,cam:any,art:any,visual:ReturnType<typeof buildDesign>
};
export function createChapterScene(chapter:string,data:any,timing:any){
  const slides:any[]=(data.slides||[]).filter((s:any)=>s.ch===chapter);
  const measured:any[]=(timing&&timing.slides)||[];
  return makeScene2D(function* (view){
    view.add(<Rect width={1920} height={1080} fill={C.bg}/>);
    // Only one restrained signature line; no repetitive framed slides.
    const stages:Stage[]=[];
    for(const s of slides){
      const id=Number(s.id);
      const layer=createRef<Node>(),cam=createRef<Node>();
      const visual=buildDesign(s);
      view.add(
        <Node ref={layer} opacity={0}>
          <Rect width={1920} height={1080} fill={id%7===0?'#111820':id%3===0?'#0D131B':C.bg}/>
          <Node opacity={.16}>
            <Circle x={id%2?-640:660} y={-325} width={760} height={760} fill={id%4===0?C.rust:C.blue}/>
            <Circle x={id%2?700:-690} y={390} width={830} height={830} fill={id%3===0?C.teal:C.gold} opacity={.48}/>
          </Node>
          <Node ref={cam}>
            {visual.node}
          </Node>
          <Rect x={-838} y={-477} width={74} height={4} fill={C.gold}/>
          <Txt text={'考える夜'} x={-755} y={-476} width={310} textAlign={'left'} fontFamily={SF} fontSize={24} fontWeight={700} fill={C.secondary} />
          <Txt text={String(s.id).padStart(2,'0')+'/58'} x={819} y={-476} width={210} textAlign={'right'} fontFamily={SF} fontSize={25} fill={C.secondary}/>
          <Rect width={Number(s.id)/58*1775} height={3} x={-887+Number(s.id)/58*1775/2} y={-513} fill={C.gold} opacity={.50}/>
        </Node>);
      stages.push({s,layer,cam,art:null,visual});
    }
    const cc=createRef<Node>(),sub=createRef<Txt>(),rule=createRef<Rect>();
    view.add(<Node ref={cc} opacity={0}>
      <Rect y={432} height={185} width={1810} fill={'#090D12'} opacity={.90} radius={10}/>
      <Rect y={339} height={4} width={1810} fill={C.line}/>
      <Rect ref={rule} x={-905} y={339} height={4} width={0} fill={C.gold}/>
      <Txt ref={sub} y={432} width={1665} textAlign={'center'} fontFamily={SF}
        fontSize={39} fontWeight={700} fill={C.paper}/>
    </Node>);
    // Small bespoke chapter changes are timed to the first narrated scene only.
    const chapLayer=createRef<Node>(),chapTitle=createRef<Txt>();
    view.add(<Node ref={chapLayer} opacity={0}>
      <Rect width={1920} height={1080} fill={C.bg} opacity={.97}/>
      <Rect y={-80} width={600} height={5} fill={C.gold}/>
      <Txt text={chapter.toUpperCase()} y={-190} fontFamily={SF} fontSize={32} fill={C.gold} letterSpacing={7}/>
      <Txt ref={chapTitle} text={TITLES[chapter]||''} y={30} fontFamily={'Noto Serif JP'} fontWeight={700} fontSize={81} fill={C.paper}/>
      <Rect y={174} width={600} height={3} fill={C.gold}/>
    </Node>);
    for(let k=0;k<stages.length;k++){
      const st=stages[k],t=measured[k]||{duration:6,subs:[]};
      const d=Math.max(2,Number(t.duration||6));
      const layer=st.layer(),cam=st.cam();
      const shift= k%4===0?76:k%4===1?-65:k%4===2?0:45;
      const enter=(function*(){
        layer.opacity(0);
        layer.position([shift,k%3===0?25:-15]);
        layer.scale(k%2===0?.955:1.03);
        yield* all(layer.opacity(1,.65),layer.position([0,0],.72),layer.scale(1,.85));
        if(st.visual.reveals.length){
          yield* all(...st.visual.reveals.map((r:any,i:number)=>delay(Math.min(i*.12,.50),all(r().opacity(1,.55),r().y(0,.70)))));
        }
        if(st.visual.strokes.length)
          yield* all(...st.visual.strokes.map((r:any,i:number)=>delay(i*.14,r().end(1,1.15))));
        if(st.visual.bars.length)
          yield* all(...st.visual.bars.map((b:any,i:number)=>delay(i*.17,all(b.ref().width(b.w,.95),b.ref().x(b.x,.95)))));
        if(st.visual.numbers.length)
          yield* all(...st.visual.numbers.map((q:any)=>q.sig(q.target,1.45)));
      })();
      const drift=(function*(){
        cam.position([-20,k%2===0?-8:9]);cam.scale(.995);
        yield* all(cam.position([20,k%2===0?9:-8],d),cam.scale(1.035,d));
      })();
      const captions=(function*(){
        let cursor=0;cc().opacity(1);
        for(const utterance of (t.subs||[])){
          const start=Math.max(0,Number(utterance.start||0));
          if(start>cursor)yield* waitFor(start-cursor);
          const sentence=String(utterance.text||'');
          sub().text(splitJapanese(sentence,29,3));
          rule().width(0);rule().x(-905);
          const td=Math.max(.03,Number(utterance.duration||0));
          yield* all(rule().width(600,td),rule().x(-605,td));
          cursor=start+td;
        }
        if(d>cursor)yield* waitFor(d-cursor);
        cc().opacity(0);sub().text('');
      })();
      const exit=(function*(){
        yield* waitFor(Math.max(.3,d-.50));
        yield* all(layer.opacity(0,.47),layer.scale(1.045,.50));
      })();
      const title=(function*(){
        if(FIRST.includes(Number(st.s.id)) && chapter!=='prologue'){
          chapLayer().opacity(1);
          yield* waitFor(.90);
          yield* chapLayer().opacity(0,.65);
        }
      })();
      yield* all(enter,drift,captions,exit,title);
    }
  });
}
