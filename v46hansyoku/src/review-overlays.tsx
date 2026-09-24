import React from 'react';
import {AbsoluteFill} from 'remotion';

const smooth=(v:number)=>{const t=Math.max(0,Math.min(1,v));return t*t*(3-2*t);};

/** Review change 1: single formula persists across the three original VOICEVOX scene boundaries. */
export const BudgetEquation=({sceneNumber,progress}:{sceneNumber:number;progress:number})=>{
  const phase=sceneNumber===7?progress*.69:sceneNumber===8?.69+progress*.30:1;
  const entries=[
    {text:'[収入]',at:.05},{text:'-[家賃]',at:.20},{text:'-[食費]',at:.38},
    {text:'-[老後資金]',at:.57},{text:'＝',at:.73},
    {text:'残念ながら増えない通帳の数字',at:.86}
  ];
  return <div style={{position:'absolute',left:116,right:116,top:93,minHeight:138,display:'flex',alignItems:'center',justifyContent:'center',gap:0,flexWrap:'wrap',padding:'20px 24px',borderRadius:19,background:'linear-gradient(105deg,rgba(8,16,26,.92),rgba(18,32,44,.80))',border:'2px solid rgba(239,242,236,.38)',boxShadow:'0 14px 52px rgba(0,0,0,.58)',fontFamily:'Noto Sans CJK JP,sans-serif',fontSize:46,lineHeight:1.35,fontWeight:900,color:'#faf5e8',textShadow:'0 4px 9px #070d14'}} data-v46-review="budget-formula">
    {entries.map((entry,i)=>{const q=smooth((phase-entry.at)/.075);return <span key={entry.text} style={{whiteSpace:'nowrap',opacity:q,transform:`translateY(${(1-q)*14}px)`,color:i===5?'#edc994':'#faf5e8'}}>{entry.text}</span>})}
  </div>;
};

/** Review change 3: the X visibly crosses out an imagined ban; the source narration is unchanged. */
export const ProhibitionGraphic=({progress}:{progress:number})=>{
  const show=smooth((progress-.02)/.20),cross=smooth((progress-.34)/.38);
  return <AbsoluteFill style={{background:'#030306',alignItems:'center',justifyContent:'center',fontFamily:'Noto Sans CJK JP,sans-serif'}} data-v46-review="ban-cross">
    <div style={{position:'absolute',top:315,left:0,right:0,textAlign:'center',fontSize:114,fontWeight:900,color:'#fbfbfb',letterSpacing:18,opacity:show,textShadow:'0 5px 26px rgba(255,255,255,.28)'}}>繁殖禁止令</div>
    <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%',overflow:'visible',filter:'drop-shadow(0 8px 16px rgba(100,2,8,.8))'}} aria-hidden>
      <path d="M670 267 L1237 734" stroke="#b40d18" strokeWidth="60" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-cross}/>
      <path d="M1237 267 L670 734" stroke="#ed2732" strokeWidth="60" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-smooth((progress-.53)/.34)}/>
      <path d="M670 267 L1237 734" stroke="#ff8182" strokeWidth="8" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1-cross} opacity=".68"/>
    </svg>
  </AbsoluteFill>;
};

const IconFace=({cx,cy,r=28}:{cx:number;cy:number;r?:number})=><circle cx={cx} cy={cy} r={r} fill="url(#v46silver)" stroke="#faf8e9" strokeWidth="2"/>;
const FamilyMark=()=><svg viewBox="0 0 350 350" width="260" height="260" aria-hidden>
 <defs><linearGradient id="v46silver" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffef3"/><stop offset=".38" stopColor="#8b9bab"/><stop offset=".72" stopColor="#f8f6e3"/><stop offset="1" stopColor="#5a687c"/></linearGradient></defs>
 <IconFace cx={105} cy={92} r={31}/><IconFace cx={245} cy={92} r={31}/><IconFace cx={175} cy={160} r={24}/>
 <path d="M61 242V169q0-36 44-36t44 36v78M201 247v-78q0-36 44-36t44 36v73" stroke="url(#v46silver)" strokeWidth="38" strokeLinecap="round" fill="none"/>
 <path d="M144 246v-29q0-33 31-33t31 33v29" stroke="url(#v46silver)" strokeWidth="26" strokeLinecap="round" fill="none"/>
 <path d="M55 260 Q175 324 295 260" stroke="#f4e9c5" opacity=".8" strokeWidth="7" strokeLinecap="round" fill="none"/>
 </svg>;
const WorkMark=()=><svg viewBox="0 0 350 350" width="260" height="260" aria-hidden>
 <defs><linearGradient id="v46steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fffdf0"/><stop offset=".35" stopColor="#8d9dad"/><stop offset=".7" stopColor="#ecf2fa"/><stop offset="1" stopColor="#475a6c"/></linearGradient></defs>
 <circle cx="175" cy="81" r="37" fill="url(#v46steel)" stroke="#f5f6f0" strokeWidth="3"/>
 <path d="M117 181q0-54 58-54t58 54v74H117z" fill="url(#v46steel)" stroke="#f5f6f0" strokeWidth="3"/>
 <rect x="81" y="205" width="188" height="104" rx="15" fill="url(#v46steel)" stroke="#f5f6f0" strokeWidth="4"/>
 <path d="M145 205v-17q0-13 13-13h35q13 0 13 13v17M82 236h186" stroke="#404d61" strokeWidth="7" fill="none"/>
 <circle cx="175" cy="251" r="13" fill="#40536a" stroke="#fffbea" strokeWidth="4"/>
 </svg>;
const MetallicMedal=({side,progress}:{side:'family'|'work';progress:number})=>{
 const q=smooth((progress-.45)/.30);
 return <div style={{position:'absolute',left:side==='family'?280:1190,top:465,width:430,height:430,opacity:q,transform:`translateY(${(1-q)*38}px) scale(${.89+.11*q})`,borderRadius:'50%',background:'radial-gradient(circle at 28% 20%,#fcf5d5 0%,#a6b5c2 19%,#405269 43%,#131e2c 76%,#82755d 100%)',border:'11px ridge #cfc4a2',boxShadow:'inset 0 0 40px #040911, inset 0 5px 24px #f5f0d5a8,0 24px 75px #000b,0 0 35px #e7d9a12e',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}} data-v46-review={side}>
  {side==='family'?<FamilyMark/>:<WorkMark/>}
  <div style={{position:'absolute',left:-120,top:-140,width:110,height:740,background:'linear-gradient(90deg,transparent,#fff9cd50,transparent)',transform:`translateX(${q*680}px) rotate(26deg)`,pointerEvents:'none'}}/>
 </div>;
};
/** Review change 4: the same fork persists across P031 and P032 without replacing their audio. */
export const ForkMetalGraphic=({progress,continuation=false}:{progress:number;continuation?:boolean})=>{
 const q=continuation?1:smooth((progress-.09)/.66);
 const branch=continuation?1:smooth((progress-.14)/.56);
 return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 20%,#2a3548,#0a101a 65%,#04060b 100%)',fontFamily:'Noto Sans CJK JP,sans-serif'}} data-v46-review="metallic-branch">
  <svg viewBox="0 0 1920 1080" style={{position:'absolute',inset:0,width:'100%',height:'100%'}} aria-hidden>
   <defs><linearGradient id="v46branch-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#e7d5a4"/><stop offset=".45" stopColor="#ffffff"/><stop offset=".67" stopColor="#90a6b7"/><stop offset="1" stopColor="#d7ad5c"/></linearGradient></defs>
   <circle cx="960" cy="205" r="50" fill="#25364a" stroke="url(#v46branch-metal)" strokeWidth="9" opacity={Math.max(.2,q)}/>
   <circle cx="960" cy="205" r="18" fill="#dfd5b3" opacity={Math.max(.2,q)}/>
   <path d="M960 255 Q960 380 680 470 L500 548" stroke="url(#v46branch-metal)" strokeWidth="17" strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1-branch} style={{filter:'drop-shadow(0 0 10px #a8c6dd66)'}}/>
   <path d="M960 255 Q960 380 1240 470 L1419 548" stroke="url(#v46branch-metal)" strokeWidth="17" strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1-branch} style={{filter:'drop-shadow(0 0 10px #a8c6dd66)'}}/>
   <path d="M466 559 l37-32 l-2 46z" fill="#e5d8b2" opacity={branch}/>
   <path d="M1455 559 l-37-32 l2 46z" fill="#e5d8b2" opacity={branch}/>
  </svg>
  <MetallicMedal side="family" progress={continuation?1:progress}/>
  <MetallicMedal side="work" progress={continuation?1:progress}/>
  <div style={{position:'absolute',left:230,top:904,width:530,textAlign:'center',fontSize:40,fontWeight:800,color:'#f0e8cf',textShadow:'0 4px 12px #000',opacity:q}}>繁殖する者</div>
  <div style={{position:'absolute',left:1160,top:904,width:530,textAlign:'center',fontSize:40,fontWeight:800,color:'#f0e8cf',textShadow:'0 4px 12px #000',opacity:q}}>社会を支える者</div>
  {continuation?<div style={{position:'absolute',left:889,top:137,width:142,height:142,borderRadius:'50%',border:'3px solid #d4c9a466',boxShadow:'0 0 55px #c0ad7640',opacity:.7}}/>:null}
 </AbsoluteFill>;
};
