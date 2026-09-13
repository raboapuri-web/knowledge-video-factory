import React from 'react';
import {AbsoluteFill,interpolate,spring,useCurrentFrame,useVideoConfig} from 'remotion';

const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const font='"Noto Sans CJK JP",sans-serif';
const C={paper:'#f3eee5',ink:'#050608',muted:'#969da6',red:'#c94f58',amber:'#d4a34d',cyan:'#65c4c9',violet:'#8c7bd1',green:'#7eaa88',steel:'#3c4550'};
const prog=(f:number,a=0,b=30)=>interpolate(f,[a,b],[0,1],clamp);

const Bg=({children,tone='dark'}:{children:React.ReactNode;tone?:'dark'|'red'|'blue'|'gold'})=>{
  const f=useCurrentFrame();
  const bg=tone==='red'?'linear-gradient(145deg,#150607,#2b0f13 56%,#020304)':tone==='blue'?'linear-gradient(145deg,#031018,#0b2630 56%,#020304)':tone==='gold'?'linear-gradient(145deg,#140f08,#2b2112 56%,#020304)':'linear-gradient(145deg,#040608,#121820 56%,#020304)';
  return <AbsoluteFill style={{background:bg,color:C.paper,fontFamily:font,overflow:'hidden'}}><AbsoluteFill style={{transform:`scale(${1.006+Math.sin(f/170)*.006})`}}>{children}</AbsoluteFill><AbsoluteFill style={{background:'radial-gradient(circle at 50% 45%,transparent 24%,rgba(0,0,0,.25) 68%,rgba(0,0,0,.86) 100%)'}}/></AbsoluteFill>;
};

export const MoralDualMeter=({headline='善悪と魅力は同じ軸ではない',moral=-75,appeal=78,leftLabel='道徳評価',rightLabel='魅力評価'}:{headline?:string;moral?:number;appeal?:number;leftLabel?:string;rightLabel?:string})=>{
  const f=useCurrentFrame();
  const q=spring({frame:f,fps:30,config:{damping:15,stiffness:90}});
  const needle=(v:number)=>interpolate(q,[0,1],[0,v],clamp);
  const Meter=({x,label,value,color}:{x:number;label:string;value:number;color:string})=>{
    const angle=-105+(needle(value)+100)/200*210;
    return <div style={{position:'absolute',left:x,top:330,width:560,height:430}}><div style={{fontSize:36,fontWeight:950,textAlign:'center',marginBottom:20}}>{label}</div><svg width="560" height="340"><path d="M80 270 A200 200 0 0 1 480 270" fill="none" stroke="#2a3037" strokeWidth="34" strokeLinecap="round"/><path d="M80 270 A200 200 0 0 1 480 270" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" opacity=".55"/><line x1="280" y1="270" x2={280+145*Math.cos(angle*Math.PI/180)} y2={270+145*Math.sin(angle*Math.PI/180)} stroke={C.paper} strokeWidth="10" strokeLinecap="round"/><circle cx="280" cy="270" r="21" fill={color}/></svg><div style={{position:'absolute',left:0,right:0,bottom:18,textAlign:'center',fontSize:54,fontWeight:950,color}}>{Math.round(needle(value))>0?'+':''}{Math.round(needle(value))}</div></div>;
  };
  return <Bg tone="dark"><div style={{position:'absolute',left:100,right:100,top:75,textAlign:'center',fontSize:56,fontWeight:950}}>{headline}</div><Meter x={250} label={leftLabel} value={moral} color={C.red}/><Meter x={1110} label={rightLabel} value={appeal} color={C.amber}/><div style={{position:'absolute',left:770,top:505,fontSize:82,fontWeight:950,color:C.muted,opacity:.7}}>≠</div></Bg>;
};

export const SafeDangerGlass=({headline='危険は消え、刺激だけが残る',dangerLabel='DANGER',safeLabel='SAFE DISTANCE'}:{headline?:string;dangerLabel?:string;safeLabel?:string})=>{
  const f=useCurrentFrame();
  const pulse=.65+.35*Math.sin(f/12);
  const glass=interpolate(f,[0,50],[0,1],clamp);
  return <Bg tone="red"><div style={{position:'absolute',left:110,right:110,top:70,textAlign:'center',fontSize:55,fontWeight:950}}>{headline}</div><div style={{position:'absolute',left:210,top:250,width:650,height:600,borderRadius:40,background:'radial-gradient(circle at 50% 40%,rgba(201,79,88,.45),rgba(8,8,10,.9) 66%)',border:`3px solid ${C.red}66`,boxShadow:`0 0 ${80+40*pulse}px rgba(201,79,88,.28)`}}><div style={{position:'absolute',left:0,right:0,top:80,textAlign:'center',fontSize:92,fontWeight:950,color:C.red,letterSpacing:8}}>{dangerLabel}</div><div style={{position:'absolute',left:180,top:230,width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle at 40% 32%,#8d3037,#111 73%)',border:'4px solid rgba(255,255,255,.12)'}}/><div style={{position:'absolute',left:115,right:115,bottom:80,height:120,borderRadius:60,background:'linear-gradient(180deg,#8b3036,#0d1013)'}}/></div><div style={{position:'absolute',left:930,top:250,width:760,height:600,borderRadius:40,background:'linear-gradient(180deg,rgba(79,191,197,.10),rgba(3,7,10,.76))',border:`4px solid rgba(170,230,235,${.18+.42*glass})`,boxShadow:'inset 0 0 80px rgba(120,210,220,.08)'}}><div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(90deg,transparent 0 72px,rgba(255,255,255,.035) 72px 74px)'}}/><div style={{position:'absolute',left:0,right:0,top:240,textAlign:'center',fontSize:70,fontWeight:950,color:C.cyan,opacity:glass}}>{safeLabel}</div><div style={{position:'absolute',left:0,right:0,bottom:120,textAlign:'center',fontSize:34,color:C.muted}}>見ることはできる。傷つけられない。</div></div></Bg>;
};

export const DominancePrestigeLadder=({headline='地位には二つの登り方がある',dominance='支配',prestige='威信'}:{headline?:string;dominance?:string;prestige?:string})=>{
  const f=useCurrentFrame();
  const {fps}=useVideoConfig();
  const q1=spring({frame:f,fps,config:{damping:16,stiffness:85}});
  const q2=spring({frame:f-10,fps,config:{damping:16,stiffness:85}});
  const side=(x:number,label:string,color:string,q:number,items:string[])=><div style={{position:'absolute',left:x,top:245,width:690,height:650}}><div style={{fontSize:52,fontWeight:950,textAlign:'center',color}}>{label}</div>{items.map((t,i)=><div key={t} style={{position:'absolute',left:110+i*35,top:510-i*112,width:470,height:76,borderRadius:18,background:`linear-gradient(90deg,${color}aa,#12161a)`,border:`2px solid ${color}55`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:900,opacity:prog(f,i*8,i*8+24)*q,transform:`translateX(${(1-prog(f,i*8,i*8+24))*70}px)`}}>{t}</div>)}</div>;
  return <Bg tone="gold"><div style={{position:'absolute',left:100,right:100,top:70,textAlign:'center',fontSize:56,fontWeight:950}}>{headline}</div>{side(170,prestige,C.cyan,q1,['技能','知識','尊敬','自発的な追随'])}{side(1060,dominance,C.red,q2,['威圧','恐怖','強制','従わせる力'])}<div style={{position:'absolute',left:900,top:315,width:4,height:500,background:'rgba(255,255,255,.14)'}}/></Bg>;
};

export const ForbiddenSelfMirror=({headline='似ている。だから現実では怖い。',realLabel='現実の悪人',fictionLabel='架空の悪役'}:{headline?:string;realLabel?:string;fictionLabel?:string})=>{
  const f=useCurrentFrame();
  const q=prog(f,10,55);
  const person=(x:number,color:string,mirror=false)=><div style={{position:'absolute',left:x,top:300,width:390,height:500,transform:`scaleX(${mirror?-1:1})`}}><div style={{position:'absolute',left:105,top:25,width:180,height:180,borderRadius:'50%',background:`radial-gradient(circle at 42% 32%,${color},#0a0d11 74%)`,border:`4px solid ${color}66`}}/><div style={{position:'absolute',left:35,top:190,width:320,height:300,borderRadius:'85px 85px 28px 28px',background:`linear-gradient(180deg,${color}b8,#0b0f13)`}}/></div>;
  return <Bg tone="blue"><div style={{position:'absolute',left:100,right:100,top:70,textAlign:'center',fontSize:55,fontWeight:950}}>{headline}</div>{person(330,C.steel)}{person(1200,C.violet,true)}<div style={{position:'absolute',left:905,top:220,width:8,height:680,background:'linear-gradient(180deg,transparent,#dbe8f0aa,transparent)',boxShadow:'0 0 42px rgba(180,220,240,.35)',opacity:q}}/><div style={{position:'absolute',left:250,top:810,width:560,textAlign:'center',fontSize:35,fontWeight:900,color:C.red}}>{realLabel}<div style={{fontSize:24,color:C.muted,marginTop:10}}>自己イメージを脅かす</div></div><div style={{position:'absolute',left:1110,top:810,width:560,textAlign:'center',fontSize:35,fontWeight:900,color:C.violet}}>{fictionLabel}<div style={{fontSize:24,color:C.muted,marginTop:10}}>安全に自分の暗い部分を眺められる</div></div></Bg>;
};

export const PredictionUncertainty=({headline='ヒーローは予測できる。悪役は読めない。',hero='HERO',villain='VILLAIN'}:{headline?:string;hero?:string;villain?:string})=>{
  const f=useCurrentFrame();
  const stable=interpolate(f,[0,120],[0,1],clamp);
  const jitter=Math.sin(f*.63)*26+Math.sin(f*.17)*18;
  return <Bg tone="dark"><div style={{position:'absolute',left:100,right:100,top:70,textAlign:'center',fontSize:54,fontWeight:950}}>{headline}</div><div style={{position:'absolute',left:170,top:270,width:650,height:560,borderRadius:34,border:`2px solid ${C.cyan}55`,background:'rgba(5,12,16,.76)'}}><div style={{position:'absolute',left:0,right:0,top:40,textAlign:'center',fontSize:48,fontWeight:950,color:C.cyan}}>{hero}</div><svg width="650" height="430" style={{position:'absolute',left:0,top:120}}><path d="M80 300 C180 250 270 210 360 165 S520 95 580 70" fill="none" stroke={C.cyan} strokeWidth="8" strokeLinecap="round" opacity={.85}/><circle cx={80+500*stable} cy={300-230*stable} r="17" fill={C.paper}/></svg><div style={{position:'absolute',left:0,right:0,bottom:35,textAlign:'center',fontSize:28,color:C.muted}}>助ける → 守る → 戦う</div></div><div style={{position:'absolute',left:1100,top:270,width:650,height:560,borderRadius:34,border:`2px solid ${C.red}55`,background:'rgba(18,6,8,.76)'}}><div style={{position:'absolute',left:0,right:0,top:40,textAlign:'center',fontSize:48,fontWeight:950,color:C.red}}>{villain}</div><svg width="650" height="430" style={{position:'absolute',left:0,top:120}}><path d={`M70 280 C150 ${100+jitter} 210 ${360-jitter} 295 ${175+jitter} S470 ${90-jitter} 590 ${230+jitter}`} fill="none" stroke={C.red} strokeWidth="8" strokeLinecap="round" opacity={.9}/><circle cx={300+jitter*2.1} cy={205-jitter} r="18" fill={C.paper}/></svg><div style={{position:'absolute',left:0,right:0,bottom:35,textAlign:'center',fontSize:28,color:C.muted}}>次に何をするか分からない</div></div></Bg>;
};
