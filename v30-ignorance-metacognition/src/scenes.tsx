import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export type Beat={id:string;visual:string;narration:string};

const font='"Noto Sans CJK JP",sans-serif';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const C={bg:'#05070b',paper:'#ece7da',muted:'#9aa3ad',cyan:'#72d8e8',gold:'#d6b36a',red:'#d96d68',blue:'#6f91e8',green:'#74c49a'};

type Meta={kind:string;title:string;sub?:string;words?:string[]};
const M:Record<string,Meta>={
  midnight_feed:{kind:'feed',title:'断言は、気持ちいい',sub:'午前0時47分',words:['簡単です','全部解決','答えは一つ']},
  expert_reply:{kind:'expert',title:'詳しい人ほど、断言しない',words:['条件による','断定できない','分からない']},
  confidence_paradox:{kind:'split',title:'知識 ↑  自信 ↓？',sub:'直感と逆の現象'},
  central_question:{kind:'question',title:'なぜ「知らない」と言えないのか',sub:'THE IGNORANCE PARADOX'},
  unknown_unknown:{kind:'void',title:'知らないことを、知らない',words:['KNOWN','UNKNOWN','UNKNOWN UNKNOWN']},
  foreign_city:{kind:'map',title:'初めての街は単純に見える',words:['駅','ホテル','カフェ','公園']},
  hidden_streets:{kind:'mapReveal',title:'住むほど、道は増える',words:['市場','地下道','裏路地','時間帯']},
  blank_map:{kind:'mapVoid',title:'空白すら、見えていない',sub:'未知の未知'},
  two_ignorances:{kind:'twoUnknowns',title:'無知には二種類ある',words:['知らない','知らないことを知らない']},
  metacognition_eye:{kind:'brain',title:'メタ認知',sub:'自分の思考を監視する'},
  dk_lab:{kind:'lab',title:'1999｜Kruger & Dunning',words:['論理','英文法','ユーモア']},
  dk_chart:{kind:'scatter',title:'実力と自己評価のズレ',sub:'下位群ほど校正が難しい'},
  ranking_jump:{kind:'ranking',title:'実際 12 → 自己評価 62',sub:'percentile'},
  bad_meme:{kind:'meme',title:'「バカほど自信満々」では浅すぎる',sub:'問題は、なぜ誤差を検出できないか'},
  grammar_mirror:{kind:'mirror',title:'答える知識と、間違いを見抜く知識',sub:'同じ能力を使う'},
  broken_alarm:{kind:'alarm',title:'壊れた火災報知器',sub:'鳴らない。だから安全？'},
  error_detector:{kind:'detector',title:'エラー検出器まで欠ける',sub:'無知の二重構造'},
  illusion_intro:{kind:'mechanism',title:'説明深度の錯覚',sub:'「分かる」は説明すると崩れる'},
  toilet_exploded:{kind:'toilet',title:'水洗トイレを説明できますか',words:['レバー','タンク','サイフォン','水位']},
  bicycle_physics:{kind:'bike',title:'自転車は、なぜ倒れにくい？',words:['操舵','重心','速度','カウンターステア']},
  knowledge_shell:{kind:'shell',title:'説明されない限り、理解は壊れない',sub:'ILLUSION OF EXPLANATORY DEPTH'},
  simple_answers:{kind:'simple',title:'浅い地図では、世界は一本線',words:['景気→減税','少子化→給付','犯罪→厳罰','売上→営業']},
  complex_web:{kind:'network',title:'学ぶほど、変数が増える',words:['副作用','時間差','制度','文化','交絡','反作用']},
  spider_causality:{kind:'web',title:'一本の因果が、蜘蛛の巣になる',sub:'EXPERT MODEL'},
  caveat_layers:{kind:'layers',title:'「ただし」が増える理由',words:['条件','短期','平均','例外']},
  learning_reverse:{kind:'reverse',title:'学ぶほど「分からない」が増える',sub:'知識の逆説'},
  cosmos_questions:{kind:'cosmos',title:'答えより、質問が増える',words:['ダークマター','量子重力','初期宇宙','情報問題']},
  question_expansion:{kind:'questions',title:'知識は「未知」を発見する',sub:'QUESTIONS EXPAND'},
  expert_uncertainty:{kind:'expert',title:'本当に詳しい人の「分からない」',words:['範囲','確率','条件','証拠']},
  research_caveat:{kind:'papers',title:'効果そのものにも議論がある',sub:'統計・測定・再解釈'},
  domain_reset:{kind:'domains',title:'専門家も、専門外では初心者',words:['医学','投資','政治','研究']},
  search_ai:{kind:'browser',title:'30秒で「分かった気」になれる時代',words:['検索','動画','AI','要約']},
  evidence_filter:{kind:'filter',title:'情報を読む ≠ 情報を評価する',words:['研究デザイン','統計','反証','再現性']},
  info_map:{kind:'mapVoid',title:'情報はある。地図がない。',sub:'最も危ない中間状態'},
  half_knowledge:{kind:'fog',title:'中途半端な知識は、無知を隠す',sub:'FALSE CLOSURE'},
  boundary_map:{kind:'boundary',title:'知識には国境線がある',words:['既知','推測','弱い証拠','専門外']},
  training_calibration:{kind:'calibration',title:'学習は「自信」より「校正」を改善する',sub:'TRAIN → TEST → RECALIBRATE'},
  past_self:{kind:'timeline',title:'学んだ後に、昔の無知が見える',sub:'PAST SELF'},
  black_history:{kind:'bed',title:'黒歴史は、メタ認知の成長記録',sub:'正常なアップデート'},
  knowledge_border:{kind:'island',title:'教養とは、境界線が見えること',sub:'KNOWLEDGE / UNKNOWN'},
  calibrated_words:{kind:'words',title:'「ここから先は怪しい」と言える',words:['知っている','要確認','専門家へ','判断材料なし']},
  world_complexity:{kind:'zoom',title:'世界は単純 → 複雑へ',sub:'LEARN MORE, SEE MORE'},
  two_unknowns:{kind:'twoUnknowns',title:'同じ「分からない」でも意味が違う',words:['無知の分からない','教養の分からない']},
  final_horizon:{kind:'final',title:'賢くなるとは',sub:'世界がどれほど分からないかを、正確に知ること'}
};

const fade=(p:number)=>interpolate(p,[0,.08,.9,1],[0,1,1,.82],clamp);
const ease=(p:number)=>interpolate(p,[0,1],[0,1],clamp);
const float=(frame:number,phase=0,amp=12)=>Math.sin(frame/24+phase)*amp;
const glow=(c:string)=>`0 0 34px ${c}55`;

const Backdrop=({accent=C.cyan,frame=0}:{accent?:string;frame?:number})=><AbsoluteFill style={{background:`radial-gradient(circle at ${52+Math.sin(frame/80)*5}% ${36+Math.cos(frame/90)*4}%, ${accent}18, transparent 35%),linear-gradient(135deg,#04060a 0%,#0a0d13 55%,#050608 100%)`,overflow:'hidden'}}>
  {Array.from({length:22}).map((_,i)=><div key={i} style={{position:'absolute',left:`${(i*47)%101}%`,top:`${(i*71)%103}%`,width:2+(i%3),height:2+(i%3),borderRadius:99,background:i%4===0?accent:'#ffffff',opacity:.08+(i%5)*.025,transform:`translate(${float(frame,i,.8)}px,${float(frame,i+3,1.2)}px)`}}/>)}
  <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,transparent 0%,rgba(0,0,0,.22) 70%,rgba(0,0,0,.55) 100%)'}}/>
</AbsoluteFill>;

const Header=({m,p}:{m:Meta;p:number})=><div style={{position:'absolute',left:92,top:70,width:1480,opacity:fade(p),transform:`translateY(${interpolate(p,[0,.12],[24,0],clamp)}px)`,fontFamily:font}}>
  <div style={{fontSize:22,letterSpacing:5,color:C.muted,fontWeight:700}}>{m.sub??'考える夜｜KNOWLEDGE & METACOGNITION'}</div>
  <div style={{marginTop:12,fontSize:58,lineHeight:1.18,fontWeight:900,color:C.paper,letterSpacing:1.2,textShadow:'0 8px 35px rgba(0,0,0,.7)'}}>{m.title}</div>
</div>;

const WordPills=({words=[],p,accent=C.cyan}:{words?:string[];p:number;accent?:string})=><div style={{position:'absolute',left:110,right:110,bottom:220,display:'flex',gap:18,flexWrap:'wrap',justifyContent:'center'}}>
  {words.map((w,i)=>{const q=interpolate(p,[i*.07,Math.min(1,i*.07+.22)],[0,1],clamp);return <div key={w} style={{padding:'16px 26px',borderRadius:999,border:`1px solid ${accent}55`,background:'rgba(8,12,17,.7)',boxShadow:glow(accent),fontFamily:font,fontSize:27,fontWeight:800,color:C.paper,opacity:q,transform:`translateY(${(1-q)*24}px) scale(${.94+.06*q})`}}>{w}</div>})}
</div>;

const Feed=({frame,p,m}:{frame:number;p:number;m:Meta})=><>
  <div style={{position:'absolute',left:180,top:250,width:700,height:580,perspective:1200,transform:`translateY(${float(frame,0,7)}px)`}}>
    {[0,1,2].map(i=><div key={i} style={{position:'absolute',top:i*150,left:i*24,width:620,padding:'28px 34px',borderRadius:24,background:i===0?'rgba(25,31,41,.96)':'rgba(17,21,29,.87)',border:`1px solid ${i===0?C.red:C.cyan}33`,boxShadow:'0 28px 65px rgba(0,0,0,.46)',transform:`translateX(${interpolate(p,[0,.25],[120+i*40,0],clamp)}px) rotateY(${-4+i*2}deg)`,opacity:fade(p)}}>
      <div style={{fontFamily:font,fontSize:18,color:C.muted}}>匿名アカウント · {i+1}分</div>
      <div style={{fontFamily:font,fontSize:35,fontWeight:900,color:C.paper,marginTop:10}}>{m.words?.[i]??'断言'}</div>
      <div style={{height:8,width:`${72-i*9}%`,marginTop:20,background:i===0?C.red:C.cyan,borderRadius:9,opacity:.55}}/>
    </div>)}
  </div>
  <div style={{position:'absolute',right:205,top:310,width:510,height:380,borderRadius:40,border:'1px solid rgba(255,255,255,.1)',background:'rgba(5,8,12,.65)',display:'grid',placeItems:'center',boxShadow:'0 30px 80px rgba(0,0,0,.5)'}}><div style={{fontFamily:font,fontSize:160,fontWeight:900,color:C.red,textShadow:glow(C.red),transform:`scale(${1+.03*Math.sin(frame/10)})`}}>!</div></div>
</>;

const Expert=({frame,p,m}:{frame:number;p:number;m:Meta})=><>
  <div style={{position:'absolute',left:210,top:250,width:520,height:540,display:'flex',alignItems:'end',justifyContent:'center'}}>
    <div style={{width:250,height:250,borderRadius:'50% 50% 44% 44%',background:'linear-gradient(145deg,#2c3542,#11161d)',boxShadow:'0 25px 60px rgba(0,0,0,.5)',transform:`translateY(${float(frame,2,5)}px)`}}/>
    <div style={{position:'absolute',bottom:0,width:470,height:290,borderRadius:'52% 52% 18% 18%',background:'linear-gradient(145deg,#18202a,#0e1218)'}}/>
  </div>
  <div style={{position:'absolute',right:160,top:250,width:830}}>{(m.words??['条件による','断定できない','分からない']).map((w,i)=>{const q=interpolate(p,[.05+i*.13,.3+i*.13],[0,1],clamp);return <div key={w} style={{marginBottom:22,padding:'25px 34px',borderLeft:`5px solid ${C.cyan}`,background:'rgba(20,28,36,.72)',borderRadius:'0 20px 20px 0',opacity:q,transform:`translateX(${(1-q)*80}px)`,fontFamily:font,fontSize:37,fontWeight:800,color:C.paper}}>{w}</div>})}</div>
</>;

const Split=({p}:{p:number})=><div style={{position:'absolute',left:150,right:150,top:290,bottom:200,display:'grid',gridTemplateColumns:'1fr 1fr',gap:70}}>
  {[['知識が少ない','自信 92%',C.red],['知識が多い','自信 58%',C.cyan]].map(([a,b,c],i)=><div key={String(a)} style={{borderRadius:34,background:'rgba(15,20,28,.82)',border:`1px solid ${c}44`,padding:42,opacity:fade(p),transform:`translateX(${(i?1:-1)*(1-ease(p))*80}px)`}}><div style={{fontFamily:font,fontSize:33,color:C.muted}}>{a}</div><div style={{fontFamily:font,fontSize:70,fontWeight:900,color:c as string,marginTop:18}}>{b}</div><div style={{height:22,background:'#171d26',borderRadius:20,marginTop:42,overflow:'hidden'}}><div style={{height:'100%',width:i?'58%':'92%',background:c as string,transform:`scaleX(${ease(p)})`,transformOrigin:'left'}}/></div></div>)}
</div>;

const Question=({frame,p}:{frame:number;p:number})=><div style={{position:'absolute',inset:0,display:'grid',placeItems:'center'}}><div style={{fontFamily:font,fontSize:270,fontWeight:900,color:C.gold,opacity:.13,transform:`rotate(${Math.sin(frame/50)*3}deg) scale(${1+.03*Math.sin(frame/22)})`}}>?</div><div style={{position:'absolute',width:860,height:860,borderRadius:'50%',border:`1px solid ${C.gold}33`,boxShadow:`inset ${glow(C.gold)}`,transform:`scale(${.72+.28*ease(p)})`}}/></div>;

const RoadMap=({frame,p,reveal=false,voidMode=false}:{frame:number;p:number;reveal?:boolean;voidMode?:boolean})=><svg width="1500" height="650" viewBox="0 0 1500 650" style={{position:'absolute',left:210,top:250,opacity:fade(p)}}>
  <rect width="1500" height="650" rx="42" fill="#0a0e14" stroke="#26313f"/>
  {Array.from({length:8}).map((_,i)=><path key={'h'+i} d={`M 40 ${70+i*70} C ${320+i*20} ${30+i*80}, ${800-i*15} ${100+i*55}, 1460 ${60+i*73}`} fill="none" stroke={i%3===0?C.cyan:'#273240'} strokeWidth={i%3===0?7:3} opacity={voidMode&&i>2?.1:.7} strokeDasharray={reveal?'18 12':'0'} strokeDashoffset={reveal?-frame*2:0}/>)}
  {Array.from({length:10}).map((_,i)=><path key={'v'+i} d={`M ${80+i*145} 30 C ${40+i*145} 220, ${140+i*130} 420, ${100+i*145} 620`} fill="none" stroke={i%4===0?C.gold:'#212b38'} strokeWidth={i%4===0?6:2.5} opacity={voidMode&&i>3?.08:.65}/>)}
  {[['駅',250,120],['ホテル',880,170],['カフェ',640,420],['公園',1160,470]].map(([t,x,y],i)=><g key={String(t)} opacity={interpolate(p,[i*.08,.25+i*.08],[0,1],clamp)}><circle cx={Number(x)} cy={Number(y)} r="14" fill={i===0?C.red:C.cyan}/><text x={Number(x)+24} y={Number(y)+8} fill={C.paper} fontFamily={font} fontSize="28" fontWeight="800">{t}</text></g>)}
  {reveal&&Array.from({length:14}).map((_,i)=><circle key={i} cx={100+(i*103)%1320} cy={70+(i*79)%520} r={7+(i%3)*4} fill={C.gold} opacity={interpolate(p,[.15+i*.02,.42+i*.02],[0,.65],clamp)}/>)}
  {voidMode&&<rect x="920" y="0" width="580" height="650" fill="url(#fog)"/>}
  <defs><linearGradient id="fog"><stop offset="0" stopColor="#080b10" stopOpacity=".1"/><stop offset=".65" stopColor="#05070b" stopOpacity=".88"/><stop offset="1" stopColor="#05070b"/></linearGradient></defs>
</svg>;

const Brain=({frame,p}:{frame:number;p:number})=><div style={{position:'absolute',left:530,top:290,width:860,height:520}}><div style={{position:'absolute',left:230,top:40,width:390,height:330,borderRadius:'48% 52% 46% 54%',border:`5px solid ${C.cyan}`,boxShadow:glow(C.cyan),transform:`scale(${.8+.2*ease(p)})`}}>{Array.from({length:14}).map((_,i)=><div key={i} style={{position:'absolute',left:40+(i*73)%300,top:35+(i*89)%245,width:10,height:10,borderRadius:99,background:i%3===0?C.gold:C.cyan,boxShadow:glow(i%3===0?C.gold:C.cyan)}}/>)}</div><div style={{position:'absolute',left:315,top:395,fontFamily:font,fontSize:86,fontWeight:900,color:C.paper}}>自分を見る</div><div style={{position:'absolute',left:30,top:20,width:760,height:430,border:`2px dashed ${C.gold}77`,borderRadius:'50%',transform:`rotate(${frame*.13}deg)`}}/><div style={{position:'absolute',left:385+Math.cos(frame/34)*380,top:225+Math.sin(frame/34)*210,width:34,height:34,borderRadius:99,background:C.gold,boxShadow:glow(C.gold)}}/></div>;

const Lab=({p,m}:{p:number;m:Meta})=><div style={{position:'absolute',left:150,right:150,top:285,bottom:200}}><div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:28}}>{(m.words??[]).map((w,i)=><div key={w} style={{height:260,borderRadius:30,background:'rgba(18,24,33,.9)',border:`1px solid ${[C.cyan,C.gold,C.red][i]}55`,display:'grid',placeItems:'center',opacity:interpolate(p,[i*.1,.3+i*.1],[0,1],clamp),transform:`translateY(${(1-ease(p))*50}px)`}}><div style={{fontFamily:font,fontSize:48,fontWeight:900,color:C.paper}}>{w}</div></div>)}</div><div style={{marginTop:52,height:18,borderRadius:9,background:'#161d27',overflow:'hidden'}}><div style={{width:`${ease(p)*100}%`,height:'100%',background:`linear-gradient(90deg,${C.red},${C.gold},${C.cyan})`}}/></div></div>;

const Scatter=({p}:{p:number})=><svg width="1320" height="610" viewBox="0 0 1320 610" style={{position:'absolute',left:300,top:280,opacity:fade(p)}}><line x1="90" y1="520" x2="1250" y2="520" stroke="#627080" strokeWidth="3"/><line x1="90" y1="520" x2="90" y2="45" stroke="#627080" strokeWidth="3"/><line x1="90" y1="520" x2="1220" y2="70" stroke={C.cyan} strokeWidth="4" strokeDasharray="14 12" opacity=".35"/>{Array.from({length:34}).map((_,i)=>{const x=120+i*31;const low=i<11;const y=low?230+(i*37)%120:470-(i*15)%310;const q=interpolate(p,[i*.012,.18+i*.012],[0,1],clamp);return <circle key={i} cx={x} cy={y} r={9+(i%3)} fill={low?C.red:C.gold} opacity={q*.85}/>})}<text x="105" y="40" fill={C.muted} fontFamily={font} fontSize="24">自己評価</text><text x="1040" y="570" fill={C.muted} fontFamily={font} fontSize="24">実際の成績</text><rect x="105" y="160" width="360" height="210" rx="28" fill="none" stroke={C.red} strokeWidth="4" opacity={ease(p)}/><text x="145" y="205" fill={C.red} fontFamily={font} fontSize="30" fontWeight="800">下位群の過大評価</text></svg>;

const Ranking=({p}:{p:number})=><div style={{position:'absolute',left:310,right:310,top:320,height:400,display:'flex',alignItems:'center',justifyContent:'space-between'}}><div style={{textAlign:'center'}}><div style={{fontFamily:font,fontSize:34,color:C.muted}}>実際</div><div style={{fontFamily:font,fontSize:160,fontWeight:900,color:C.red}}>12</div></div><div style={{width:560,height:12,background:'#202936',position:'relative',overflow:'visible'}}><div style={{height:'100%',width:`${ease(p)*100}%`,background:`linear-gradient(90deg,${C.red},${C.gold})`,boxShadow:glow(C.gold)}}/><div style={{position:'absolute',right:-10,top:-21,borderLeft:`38px solid ${C.gold}`,borderTop:'26px solid transparent',borderBottom:'26px solid transparent'}}/></div><div style={{textAlign:'center'}}><div style={{fontFamily:font,fontSize:34,color:C.muted}}>自己評価</div><div style={{fontFamily:font,fontSize:160,fontWeight:900,color:C.gold}}>62</div></div></div>;

const Alarm=({frame,p}:{frame:number;p:number})=><div style={{position:'absolute',left:330,right:330,top:290,bottom:180}}><div style={{position:'absolute',left:70,top:160,width:520,height:360,background:'linear-gradient(145deg,#222b35,#10151b)',clipPath:'polygon(0 28%,50% 0,100% 28%,100% 100%,0 100%)',boxShadow:'0 40px 90px rgba(0,0,0,.55)'}}/>{Array.from({length:8}).map((_,i)=><div key={i} style={{position:'absolute',left:190+(i%4)*75,top:290-Math.sin(frame/15+i)*35-(i%3)*42,width:38,height:85,borderRadius:'50% 50% 30% 30%',background:`linear-gradient(${C.gold},${C.red})`,filter:'blur(1px)',opacity:.55+.2*Math.sin(frame/8+i)}}/>)}<div style={{position:'absolute',right:180,top:110,width:270,height:270,borderRadius:'50%',background:'#d7d9d9',boxShadow:'0 20px 70px rgba(0,0,0,.45)',display:'grid',placeItems:'center',transform:`rotate(${Math.sin(frame/10)*2}deg) scale(${.85+.15*ease(p)})`}}><div style={{fontFamily:font,fontSize:76,fontWeight:900,color:'#25282b'}}>×</div><div style={{position:'absolute',width:315,height:315,borderRadius:'50%',border:`6px solid ${C.red}`,opacity:.4+.3*Math.sin(frame/7)}}/></div></div>;

const Mechanism=({kind,frame,p}:{kind:string;frame:number;p:number})=>{const toilet=kind==='toilet',bike=kind==='bike';return <div style={{position:'absolute',left:230,right:230,top:290,bottom:180}}><div style={{position:'absolute',left:80,top:80,width:590,height:420,borderRadius:36,border:'1px solid rgba(255,255,255,.12)',background:'rgba(13,18,25,.78)'}}>{toilet?<><div style={{position:'absolute',left:180,top:55,width:220,height:130,border:`8px solid ${C.paper}`,borderRadius:24}}/><div style={{position:'absolute',left:145,top:190,width:300,height:175,border:`10px solid ${C.paper}`,borderRadius:'12px 12px 100px 100px'}}/><div style={{position:'absolute',left:260,top:90,width:12,height:210,background:C.cyan,transform:`scaleY(${.2+.8*ease(p)})`,transformOrigin:'top'}}/></>:bike?<svg width="590" height="420"><circle cx="155" cy="285" r="105" fill="none" stroke={C.paper} strokeWidth="10"/><circle cx="445" cy="285" r="105" fill="none" stroke={C.paper} strokeWidth="10"/><path d="M155 285 L270 110 L355 285 L155 285 M270 110 L445 285 M255 130 L360 130" fill="none" stroke={C.cyan} strokeWidth="12"/><line x1="270" y1="110" x2="330" y2="80" stroke={C.gold} strokeWidth="10"/></svg>:<div style={{fontFamily:font,fontSize:84,fontWeight:900,color:C.paper,display:'grid',placeItems:'center',height:'100%'}}>?</div>}</div><div style={{position:'absolute',right:40,top:35,width:650,height:520}}>{['見たことがある','使ったことがある','説明できる？'].map((x,i)=><div key={x} style={{marginTop:26,padding:'24px 30px',borderRadius:22,background:'rgba(15,22,31,.88)',borderLeft:`5px solid ${[C.cyan,C.gold,C.red][i]}`,fontFamily:font,fontSize:34,fontWeight:800,color:C.paper,opacity:interpolate(p,[i*.11,.25+i*.11],[0,1],clamp),transform:`translateX(${(1-ease(p))*60}px)`}}>{x}</div>)}</div></div>};

const Network=({frame,p,web=false}:{frame:number;p:number;web?:boolean})=><svg width="1480" height="690" viewBox="0 0 1480 690" style={{position:'absolute',left:220,top:255}}>{Array.from({length:web?34:24}).map((_,i)=>{const x=90+(i*139)%1280,y=70+(i*97)%540;return Array.from({length:web?3:2}).map((__,j)=>{const k=(i*7+j*5+3)%(web?34:24),x2=90+(k*139)%1280,y2=70+(k*97)%540;return <line key={`${i}-${j}`} x1={x} y1={y} x2={x2} y2={y2} stroke={j===0?C.cyan:'#5a6675'} strokeWidth={j===0?2.5:1.2} opacity={.08+.3*ease(p)}/>})})}{Array.from({length:web?34:24}).map((_,i)=>{const x=90+(i*139)%1280,y=70+(i*97)%540,q=interpolate(p,[i*.01,.2+i*.01],[0,1],clamp);return <g key={i}><circle cx={x} cy={y} r={7+(i%5)*2.5} fill={i%6===0?C.gold:i%4===0?C.red:C.cyan} opacity={q}/><circle cx={x} cy={y} r={18+(i%3)*6} fill="none" stroke={i%6===0?C.gold:C.cyan} opacity={.08+.08*Math.sin(frame/9+i)}/></g>})}</svg>;

const Cosmos=({frame,p,m}:{frame:number;p:number;m:Meta})=><><div style={{position:'absolute',left:0,right:0,top:170,bottom:90,overflow:'hidden'}}>{Array.from({length:90}).map((_,i)=><div key={i} style={{position:'absolute',left:`${(i*37)%100}%`,top:`${(i*61)%100}%`,width:1+(i%4),height:1+(i%4),borderRadius:99,background:i%11===0?C.gold:'#fff',opacity:.18+(i%7)*.07,transform:`translate(${float(frame,i,.7)}px,${float(frame,i+2,.9)}px)`}}/>)}<div style={{position:'absolute',left:700,top:220,width:430,height:430,borderRadius:'50%',background:'radial-gradient(circle at 35% 30%,#374156,#10141c 46%,#010204 70%)',boxShadow:'0 0 90px rgba(111,145,232,.22)',transform:`scale(${.8+.2*ease(p)}) rotate(${frame*.02}deg)`}}/></div><WordPills words={m.words} p={p} accent={C.blue}/></>;

const Browser=({frame,p,m}:{frame:number;p:number;m:Meta})=><div style={{position:'absolute',left:200,right:200,top:260,bottom:160,borderRadius:34,background:'#10151d',border:'1px solid #293343',boxShadow:'0 40px 100px rgba(0,0,0,.55)',overflow:'hidden'}}><div style={{height:72,background:'#171e28',display:'flex',alignItems:'center',gap:16,padding:'0 26px'}}>{[C.red,C.gold,C.green].map(c=><div key={c} style={{width:18,height:18,borderRadius:99,background:c}}/>)}<div style={{marginLeft:24,flex:1,height:38,borderRadius:18,background:'#0b0f15'}}/></div><div style={{padding:50,display:'grid',gridTemplateColumns:'1.05fr .95fr',gap:36}}><div>{(m.words??[]).map((w,i)=><div key={w} style={{height:76,marginBottom:18,borderRadius:18,background:'rgba(30,40,53,.9)',borderLeft:`4px solid ${i%2?C.cyan:C.gold}`,display:'flex',alignItems:'center',padding:'0 24px',fontFamily:font,fontSize:30,fontWeight:800,color:C.paper,transform:`translateX(${float(frame,i,5)}px)`,opacity:interpolate(p,[i*.08,.25+i*.08],[0,1],clamp)}}>{w}</div>)}</div><div style={{borderRadius:26,background:'linear-gradient(145deg,#182332,#0b1017)',display:'grid',placeItems:'center',minHeight:360}}><div style={{fontFamily:font,fontSize:140,fontWeight:900,color:C.cyan,textShadow:glow(C.cyan),transform:`scale(${1+.025*Math.sin(frame/12)})`}}>AI</div></div></div></div>;

const Boundary=({frame,p,m}:{frame:number;p:number;m:Meta})=><div style={{position:'absolute',left:220,right:220,top:270,bottom:150}}><div style={{position:'absolute',left:120,top:120,width:760,height:420,borderRadius:'52% 48% 58% 42%',background:'radial-gradient(circle at 35% 35%,rgba(114,216,232,.28),rgba(26,47,57,.85) 55%,rgba(10,17,23,.95))',border:`3px solid ${C.cyan}88`,boxShadow:glow(C.cyan),transform:`scale(${.82+.18*ease(p)})`}}/><div style={{position:'absolute',left:770,top:0,right:0,bottom:0,background:'linear-gradient(90deg,transparent,#05070b 70%)'}}/><div style={{position:'absolute',left:880,top:170,fontFamily:font,fontSize:60,fontWeight:900,color:C.paper}}>UNKNOWN</div>{(m.words??[]).map((w,i)=><div key={w} style={{position:'absolute',left:190+(i%2)*300,top:190+Math.floor(i/2)*120,padding:'12px 18px',borderRadius:16,background:'rgba(4,8,12,.6)',fontFamily:font,fontSize:27,fontWeight:800,color:i<2?C.paper:C.gold,opacity:interpolate(p,[i*.08,.28+i*.08],[0,1],clamp)}}>{w}</div>)}<div style={{position:'absolute',left:850,top:95,width:5,height:470,background:`linear-gradient(${C.gold},transparent)`,boxShadow:glow(C.gold),transform:`translateX(${Math.sin(frame/35)*18}px)`}}/></div>;

const Calibration=({p}:{p:number})=><svg width="1320" height="600" viewBox="0 0 1320 600" style={{position:'absolute',left:300,top:300}}><line x1="90" y1="510" x2="1230" y2="510" stroke="#536170" strokeWidth="3"/><line x1="90" y1="510" x2="90" y2="55" stroke="#536170" strokeWidth="3"/><path d="M110 170 C 340 100, 460 350, 650 290 S 980 170, 1210 100" fill="none" stroke={C.red} strokeWidth="8" opacity=".42" strokeDasharray="18 12"/><path d="M110 475 C 330 420, 540 350, 690 290 S 1000 170, 1210 90" fill="none" stroke={C.cyan} strokeWidth="9" strokeDasharray={`${ease(p)*1500} 1500`}/><text x="940" y="130" fill={C.cyan} fontFamily={font} fontSize="30" fontWeight="800">学習後：自己評価が現実へ近づく</text></svg>;

const Timeline=({frame,p}:{frame:number;p:number})=><div style={{position:'absolute',left:230,right:230,top:350,height:330}}><div style={{position:'absolute',left:0,right:0,top:145,height:6,background:'#303c49'}}/>{[['昔の自分',80,C.red],['学習',600,C.gold],['今の自分',1120,C.cyan]].map(([t,x,c],i)=><div key={String(t)} style={{position:'absolute',left:Number(x),top:80,transform:`translateX(-50%) scale(${interpolate(p,[i*.12,.28+i*.12],[.4,1],clamp)})`,opacity:interpolate(p,[i*.12,.25+i*.12],[0,1],clamp)}}><div style={{width:130,height:130,borderRadius:99,background:c as string,boxShadow:glow(c as string)}}/><div style={{fontFamily:font,fontSize:30,fontWeight:900,color:C.paper,marginTop:24,whiteSpace:'nowrap',transform:'translateX(-20px)'}}>{t}</div></div>)}<div style={{position:'absolute',left:75,top:30,width:1050,height:12,background:`linear-gradient(90deg,${C.red},${C.gold},${C.cyan})`,transform:`scaleX(${ease(p)})`,transformOrigin:'left'}}/></div>;

const Bed=({frame,p}:{frame:number;p:number})=><div style={{position:'absolute',left:300,right:300,top:300,bottom:170}}><div style={{position:'absolute',left:100,bottom:60,width:1020,height:240,borderRadius:30,background:'linear-gradient(180deg,#263140,#141a23)'}}/><div style={{position:'absolute',left:160,bottom:255,width:180,height:180,borderRadius:'50%',background:'#2d3948'}}/>{['あの発言','あの断言','なぜ言った'].map((w,i)=><div key={w} style={{position:'absolute',left:620+i*135,top:45+i*55,padding:'15px 22px',borderRadius:22,background:'rgba(40,15,18,.88)',border:`1px solid ${C.red}55`,fontFamily:font,fontSize:27,fontWeight:800,color:C.paper,opacity:interpolate(p,[i*.1,.3+i*.1],[0,1],clamp),transform:`translateY(${float(frame,i,8)}px)`}}>{w}</div>)}</div>;

const Final=({frame,p}:{frame:number;p:number})=><div style={{position:'absolute',inset:0,display:'grid',placeItems:'center'}}><div style={{width:1100,textAlign:'center',fontFamily:font,opacity:fade(p),transform:`scale(${.9+.1*ease(p)})`}}><div style={{fontSize:32,letterSpacing:8,color:C.muted}}>INTELLIGENCE IS CALIBRATION</div><div style={{marginTop:30,fontSize:86,lineHeight:1.35,fontWeight:900,color:C.paper}}>世界がどれほど<br/><span style={{color:C.cyan,textShadow:glow(C.cyan)}}>分からないか</span>を<br/>正確に知ること</div></div><div style={{position:'absolute',width:1240,height:1240,borderRadius:'50%',border:`1px solid ${C.cyan}22`,transform:`scale(${1+.04*Math.sin(frame/30)})`}}/></div>;

export const RichScene=({beat,progress}:{beat:Beat;progress:number})=>{
  const frame=useCurrentFrame(); const {fps}=useVideoConfig(); const m=M[beat.visual]??{kind:'question',title:beat.visual}; const p=Math.max(0,Math.min(1,progress));
  const accent=['alarm','meme','ranking'].includes(m.kind)?C.red:['cosmos','browser'].includes(m.kind)?C.blue:['boundary','island'].includes(m.kind)?C.gold:C.cyan;
  let visual:React.ReactNode=null;
  if(m.kind==='feed')visual=<Feed frame={frame} p={p} m={m}/>;
  else if(m.kind==='expert')visual=<Expert frame={frame} p={p} m={m}/>;
  else if(m.kind==='split')visual=<Split p={p}/>;
  else if(['question','void'].includes(m.kind))visual=<Question frame={frame} p={p}/>;
  else if(m.kind==='map')visual=<RoadMap frame={frame} p={p}/>;
  else if(m.kind==='mapReveal')visual=<RoadMap frame={frame} p={p} reveal/>;
  else if(m.kind==='mapVoid')visual=<RoadMap frame={frame} p={p} voidMode/>;
  else if(m.kind==='twoUnknowns')visual=<div style={{position:'absolute',left:280,right:280,top:330,display:'grid',gridTemplateColumns:'1fr 1fr',gap:44}}>{(m.words??['知らない','知らないことを知らない']).map((w,i)=><div key={w} style={{height:310,borderRadius:36,border:`2px solid ${i?C.red:C.cyan}`,background:'rgba(14,20,28,.84)',display:'grid',placeItems:'center',fontFamily:font,fontSize:43,lineHeight:1.4,fontWeight:900,color:C.paper,textAlign:'center',padding:30,opacity:fade(p),transform:`translateY(${(1-ease(p))*(i?60:-60)}px)`}}>{w}</div>)}</div>;
  else if(['brain','detector','domains','fog','words'].includes(m.kind))visual=<><Brain frame={frame} p={p}/><WordPills words={m.words} p={p} accent={accent}/></>;
  else if(m.kind==='lab')visual=<Lab p={p} m={m}/>;
  else if(m.kind==='scatter')visual=<Scatter p={p}/>;
  else if(m.kind==='ranking')visual=<Ranking p={p}/>;
  else if(['meme','mirror'].includes(m.kind))visual=<><Split p={p}/><WordPills words={m.words} p={p} accent={accent}/></>;
  else if(m.kind==='alarm')visual=<Alarm frame={frame} p={p}/>;
  else if(['mechanism','toilet','bike','shell'].includes(m.kind))visual=<Mechanism kind={m.kind} frame={frame} p={p}/>;
  else if(m.kind==='simple')visual=<div style={{position:'absolute',left:230,right:230,top:300,display:'grid',gridTemplateColumns:'1fr 1fr',gap:26}}>{(m.words??[]).map((w,i)=><div key={w} style={{height:150,borderRadius:25,background:'rgba(16,22,31,.86)',borderLeft:`6px solid ${i%2?C.gold:C.cyan}`,display:'grid',placeItems:'center',fontFamily:font,fontSize:36,fontWeight:900,color:C.paper,opacity:interpolate(p,[i*.08,.25+i*.08],[0,1],clamp),transform:`translateX(${(i%2?1:-1)*(1-ease(p))*70}px)`}}>{w}</div>)}</div>;
  else if(['network','web','layers','reverse','questions','zoom'].includes(m.kind))visual=<><Network frame={frame} p={p} web={m.kind!=='network'}/><WordPills words={m.words} p={p} accent={accent}/></>;
  else if(m.kind==='cosmos')visual=<Cosmos frame={frame} p={p} m={m}/>;
  else if(m.kind==='papers')visual=<div style={{position:'absolute',left:300,right:300,top:280,bottom:180,display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:34}}>{[0,1,2].map(i=><div key={i} style={{borderRadius:18,background:'#e7e3d7',transform:`rotate(${[-4,2,5][i]}deg) translateY(${float(frame,i,8)}px)`,padding:30,boxShadow:'0 30px 70px rgba(0,0,0,.35)',opacity:interpolate(p,[i*.1,.3+i*.1],[0,1],clamp)}}><div style={{height:18,width:'62%',background:'#49515b'}}/><div style={{height:10,width:'90%',background:'#888',marginTop:28}}/><div style={{height:10,width:'82%',background:'#aaa',marginTop:14}}/><div style={{height:150,marginTop:35,background:'linear-gradient(135deg,#cfd5dc,#eef1f3)',border:'1px solid #aaa'}}/></div>)}</div>;
  else if(m.kind==='browser')visual=<Browser frame={frame} p={p} m={m}/>;
  else if(m.kind==='filter')visual=<><Browser frame={frame} p={p} m={m}/><div style={{position:'absolute',right:210,top:260,width:500,height:500,borderRadius:'50%',border:`5px solid ${C.gold}`,boxShadow:glow(C.gold),transform:`translate(${Math.sin(frame/25)*40}px,${Math.cos(frame/31)*25}px) scale(${.65+.35*ease(p)})`}}/></>;
  else if(['boundary','island'].includes(m.kind))visual=<Boundary frame={frame} p={p} m={m}/>;
  else if(m.kind==='calibration')visual=<Calibration p={p}/>;
  else if(m.kind==='timeline')visual=<Timeline frame={frame} p={p}/>;
  else if(m.kind==='bed')visual=<Bed frame={frame} p={p}/>;
  else if(m.kind==='final')visual=<Final frame={frame} p={p}/>;
  else visual=<Question frame={frame} p={p}/>;
  return <AbsoluteFill style={{background:C.bg}}><Backdrop accent={accent} frame={frame}/><div style={{position:'absolute',inset:0,transform:`scale(${1+Math.sin(frame/(fps*6))*.008}) translateY(${Math.sin(frame/(fps*3))*2}px)`}}><Header m={m} p={p}/>{visual}</div><div style={{position:'absolute',left:56,bottom:46,fontFamily:font,fontSize:18,letterSpacing:4,color:'rgba(255,255,255,.28)'}}>考える夜</div><div style={{position:'absolute',right:58,bottom:46,fontFamily:font,fontSize:18,letterSpacing:3,color:'rgba(255,255,255,.22)'}}>{beat.id.toUpperCase()}</div></AbsoluteFill>;
};
