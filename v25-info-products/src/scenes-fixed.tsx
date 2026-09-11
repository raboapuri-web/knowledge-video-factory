import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';

export type Beat={id:string;narration:string;visual:string};
type Props={beat:Beat;p:number;mode?:string};
const C=(v:number)=>Math.max(0,Math.min(1,v));
const E=(v:number)=>{const x=C(v);return x*x*(3-2*x)};
const S=(p:number,a:number,b:number)=>C((p-a)/(b-a));

const Frame:React.FC<{children:React.ReactNode;from?:string;to?:string}>=({children,from='#17304a',to='#070b12'})=>(
  <AbsoluteFill style={{overflow:'hidden',background:`radial-gradient(circle at 25% 15%,${from},transparent 40%),linear-gradient(135deg,${to},#05070c 75%)`}}>
    {children}
    <AbsoluteFill style={{pointerEvents:'none',opacity:.13,backgroundImage:'radial-gradient(circle,rgba(255,255,255,.2) 0 1px,transparent 1.5px)',backgroundSize:'8px 8px'}}/>
    <AbsoluteFill style={{pointerEvents:'none',boxShadow:'inset 0 0 160px rgba(0,0,0,.72)'}}/>
  </AbsoluteFill>
);

const Person:React.FC<{x:number;y:number;s?:number;shirt?:string;opacity?:number}>=({x,y,s=1,shirt='#51698f',opacity=1})=>(
  <div style={{position:'absolute',left:x,top:y,width:110*s,height:245*s,opacity}}>
    <div style={{position:'absolute',left:27*s,top:0,width:58*s,height:66*s,borderRadius:'48%',background:'#d3a17c'}}/>
    <div style={{position:'absolute',left:5*s,top:60*s,width:100*s,height:120*s,borderRadius:28*s,background:shirt}}/>
    <div style={{position:'absolute',left:24*s,top:176*s,width:22*s,height:68*s,borderRadius:12*s,background:'#151b2a'}}/>
    <div style={{position:'absolute',left:66*s,top:176*s,width:22*s,height:68*s,borderRadius:12*s,background:'#151b2a'}}/>
  </div>
);

const Label:React.FC<{x:number;y:number;text:string;opacity?:number;scale?:number}>=({x,y,text,opacity=1,scale=1})=>(
  <div style={{position:'absolute',left:x,top:y,padding:'12px 20px',borderRadius:999,background:'rgba(8,12,21,.82)',border:'1px solid rgba(255,255,255,.23)',color:'#fff',fontFamily:'Noto Sans JP, sans-serif',fontSize:27*scale,fontWeight:800,opacity,boxShadow:'0 10px 35px rgba(0,0,0,.35)'}}>{text}</div>
);

const Phone:React.FC<{x:number;y:number;s?:number;children?:React.ReactNode}>=({x,y,s=1,children})=>(
  <div style={{position:'absolute',left:x,top:y,width:230*s,height:460*s,borderRadius:36*s,border:`${10*s}px solid #2b3445`,background:'#080b12',overflow:'hidden',boxShadow:'0 25px 65px rgba(0,0,0,.55)'}}>
    <div style={{position:'absolute',left:'50%',top:7*s,transform:'translateX(-50%)',width:65*s,height:9*s,borderRadius:8,background:'#1e2531'}}/>
    {children}
  </div>
);

const Laptop:React.FC<{x:number;y:number;s?:number;children?:React.ReactNode}>=({x,y,s=1,children})=>(
  <div style={{position:'absolute',left:x,top:y,width:620*s,height:390*s}}>
    <div style={{width:'100%',height:345*s,border:`${13*s}px solid #21293a`,borderRadius:18*s,background:'#0a0e16',overflow:'hidden',boxShadow:'0 30px 80px rgba(0,0,0,.55)'}}>{children}</div>
    <div style={{marginLeft:-42*s,width:704*s,height:19*s,borderRadius:'4px 4px 18px 18px',background:'#444d5c'}}/>
  </div>
);

export const CaptionLayer:React.FC<{beat:Beat;p:number}>=({beat,p})=>{
  const parts=beat.narration.split(/(?<=[。！？])/).filter(Boolean);
  const idx=Math.min(parts.length-1,Math.floor(C(p)*parts.length));
  return (
    <div style={{position:'absolute',left:130,right:130,bottom:44,zIndex:60,display:'flex',justifyContent:'center'}}>
      <div style={{maxWidth:1580,padding:'16px 30px 18px',borderRadius:20,background:'rgba(0,0,0,.66)',color:'#fff',fontFamily:'Noto Sans JP, sans-serif',fontSize:41,lineHeight:1.45,fontWeight:700,textAlign:'center',textShadow:'0 3px 10px #000'}}>{parts[idx]??beat.narration}</div>
    </div>
  );
};

export const WebinarScene:React.FC<Props>=({p,mode})=>{
  const comments=['人生変えます','参加します','本気でやります','最後の自己投資'];
  const zoom=1+.08*p;
  return (
    <Frame from="#173655" to="#090d17">
      <div style={{position:'absolute',inset:-80,transform:`scale(${zoom})`}}>
        {Array.from({length:13}).map((_,i)=><div key={i} style={{position:'absolute',left:20+i*150-p*80,top:70+(i%4)*40,width:100,height:490-(i%4)*45,background:'#111a2b',border:'1px solid #263650'}}/>) }
      </div>
      <div style={{position:'absolute',left:80,bottom:130,width:520,height:345,borderRadius:28,background:'#131722'}}><Person x={190} y={50} s={1.05} shirt="#171717"/></div>
      <Laptop x={690} y={170} s={1.35}>
        <AbsoluteFill style={{background:'linear-gradient(135deg,#111a30,#1d2745)'}}>
          <div style={{position:'absolute',left:32,top:28,color:'#fff',fontFamily:'Noto Sans JP',fontSize:34,fontWeight:900}}>会社員のままでは<br/>一生自由になれない人へ</div>
          <div style={{position:'absolute',left:40,top:155,width:260,height:145,borderRadius:18,background:'#0a0f18'}}><Person x={82} y={8} s={.5} shirt="#202027"/></div>
          {(mode==='countdown_offer'||mode==='purchase_relief')&&<>
            <div style={{position:'absolute',right:30,top:55,color:'#ffd98a',fontSize:44,fontWeight:1000}}>¥298,000</div>
            <div style={{position:'absolute',right:30,top:118,color:'#ff7b7b',fontSize:30,fontWeight:900}}>残り {String(Math.max(0,15-Math.floor(p*16))).padStart(2,'0')}:00</div>
          </>}
          {mode==='three_months_later'&&<div style={{position:'absolute',right:35,top:70,color:'#fff',fontFamily:'Noto Sans JP',fontSize:30,lineHeight:1.6}}>動画視聴 100%<br/>投稿 86件<br/><b style={{color:'#ff9a7a'}}>売上 ¥8,400</b></div>}
        </AbsoluteFill>
      </Laptop>
      {comments.map((x,i)=><Label key={x} x={1390} y={170+i*92-p*90} text={x} opacity={C(p*3-i*.2)}/>) }
      {mode==='purchase_relief'&&<div style={{position:'absolute',left:1210,top:650,width:500,height:150,borderRadius:28,background:'#236b51',color:'#fff',fontFamily:'Noto Sans JP',fontSize:38,fontWeight:900,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',transform:`scale(${.92+.08*E(S(p,.35,.9))})`}}>決済完了<br/>今日から人生が変わります</div>}
      {mode==='upsell_mail'&&<div style={{position:'absolute',left:1230,top:560,width:520,height:240,borderRadius:25,background:'#eee8d9',padding:30,color:'#222',fontFamily:'Noto Sans JP',fontSize:29,transform:`translateY(${70*(1-E(S(p,.15,.7)))}px)`}}>既存受講生限定<br/><b style={{fontSize:44}}>¥498,000</b><br/>少人数コンサルティング</div>}
    </Frame>
  );
};

export const FunnelScene:React.FC<Props>=({p,mode})=>{
  const steps=['広告','無料PDF','LINE','3日動画','無料セミナー','本講座'];
  return (
    <Frame from="#432655" to="#0b0911">
      <Person x={150} y={520} s={1.45}/>
      <Phone x={440} y={185} s={1.25}/>
      {steps.map((x,i)=><div key={x} style={{position:'absolute',left:780+i*155,top:420+(i%2)*28,width:130,height:130,borderRadius:20,background:i===steps.length-1?'#7354dc':'#162138',border:'1px solid #52698b',color:'#fff',fontFamily:'Noto Sans JP',fontSize:23,fontWeight:900,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',opacity:C(p*7-i),transform:`translateY(${30*(1-C(p*7-i))}px)`}}>{x}</div>)}
      {steps.slice(0,-1).map((_,i)=><div key={i} style={{position:'absolute',left:900+i*155,top:480+(i%2)*28,width:65,height:6,background:'#7697d4',opacity:C(p*7-i-.5)}}/>)}
      {mode==='salary_monday'&&<div style={{position:'absolute',left:790,top:150,width:890,height:170,display:'flex',gap:22}}>{['07:12 満員電車','09:00 仕事','21:10 帰宅'].map((x,i)=><div key={x} style={{flex:1,borderRadius:22,background:'#131d30',border:'1px solid #566781',color:'#fff',fontFamily:'Noto Sans JP',fontSize:27,fontWeight:900,display:'flex',alignItems:'center',justifyContent:'center',transform:`translateY(${Math.sin(p*7+i)*14}px)`}}>{x}</div>)}</div>}
    </Frame>
  );
};

export const HistoryScene:React.FC<Props>=({p,mode})=>{
  const old=mode==='newspaper_press'||mode==='old_postoffice'||mode==='mail_fraud_map';
  return (
    <Frame from={old?'#6d5138':'#755d42'} to="#17120e">
      {old?<>
        <div style={{position:'absolute',left:80,top:170,width:650,height:640,background:'#2b211b',border:'10px solid #0e0b09'}}>
          <div style={{position:'absolute',left:70,top:60,width:500,height:130,background:'#d7c49d',transform:`rotate(${-5+9*p}deg)`}}/>
          <div style={{position:'absolute',left:45,top:260,width:560,height:170,background:'#aa8d5e'}}/>
          <div style={{position:'absolute',left:90,top:495,width:460,height:65,background:'#634a30'}}/>
        </div>
        <div style={{position:'absolute',left:820,top:110,width:920,height:740,background:'#ddc79c',padding:56,color:'#30261b',fontFamily:'serif',transform:`rotate(${interpolate(p,[0,1],[-3,2])}deg) scale(${.94+.06*p})`}}>
          <div style={{fontSize:62,fontWeight:900,borderBottom:'5px solid #3a2f22'}}>DAILY GAZETTE</div>
          {['秘密の収入法','少額から大きな利益','地方から始める新ビジネス','申込は郵便で'].map((x,i)=><div key={x} style={{marginTop:35,padding:18,border:'3px solid #514231',fontSize:31,fontWeight:800,opacity:C(p*5-i*.45)}}>{x}</div>)}
        </div>
      </>:<>
        <div style={{position:'absolute',left:80,top:130,width:760,height:590,background:'#c8b079',border:'16px solid #59402e'}}>
          <div style={{position:'absolute',left:60,top:70,width:290,height:190,background:'#eee2c5'}}/>
          <div style={{position:'absolute',right:70,top:90,width:220,height:300,background:'#7f9c92'}}/>
          <div style={{position:'absolute',left:60,bottom:60,width:610,height:125,background:'#6a4931'}}/>
        </div>
        <Person x={1050} y={410} s={1.35} shirt="#a95247"/>
        {mode==='homework_parcel'&&<div style={{position:'absolute',left:1310,top:500,width:360,height:230,background:'#ab8048',border:'4px solid #5d4025',transform:`translateY(${130*(1-E(S(p,.12,.7)))}px)`,padding:28,color:'#24180f',fontFamily:'serif',fontSize:29,fontWeight:900}}>HOME WORK KIT<br/><span style={{fontSize:21}}>EARN FROM HOME</span></div>}
        {mode==='motivation_not_laziness'&&<>
          <Label x={220} y={220} text="家計を良くしたい" opacity={C(p*4)}/>
          <Label x={670} y={345} text="空いた時間を活かしたい" opacity={C(p*4-.7)}/>
          <Label x={1160} y={210} text="何か始めたい" opacity={C(p*4-1.4)}/>
          <Label x={660} y={680} text="でも、何をすればいいか分からない" opacity={E(S(p,.45,.9))}/>
        </>}
      </>}
    </Frame>
  );
};

export const OfficeInfoScene:React.FC<Props>=({p,mode})=>{
  const nodes=['ブログ','YouTube','SNS','EC','AI','広告','デザイン','投資','動画','プログラミング'];
  return (
    <Frame from="#163550" to="#09111c">
      <div style={{position:'absolute',left:80,bottom:130,width:720,height:470,borderRadius:26,background:'#1b2532'}}>
        <div style={{position:'absolute',left:60,bottom:55,width:600,height:165,background:'#3a3028'}}/>
        <Person x={280} y={140} s={1.05}/>
        <Phone x={480} y={130} s={.62}/>
      </div>
      {mode==='information_flood'&&nodes.map((x,i)=>{const a=i/nodes.length*Math.PI*2+p*.4;return <Label key={x} x={1240+Math.cos(a)*330} y={490+Math.sin(a)*290} text={x} opacity={C(p*5-i*.12)} scale={.9}/>})}
      {mode==='single_path'&&<>
        {Array.from({length:9}).map((_,i)=><div key={i} style={{position:'absolute',left:860+i*90,top:260+(i%3)*160,width:240,height:5,background:'#5a6782',transform:`rotate(${(i%3-1)*17}deg)`,transformOrigin:'left center'}}/>)}
        <div style={{position:'absolute',left:900,top:510,width:760,height:16,borderRadius:10,background:'#ffd36c'}}/>
        <Label x={1170} y={430} text="この順番だけやればいい" opacity={E(S(p,.2,.7))}/>
      </>}
    </Frame>
  );
};

export const GarageScene:React.FC<Props>=({p,mode})=>{
  const hood=E(S(p,.12,.7));
  return (
    <Frame from="#33424f" to="#10151c">
      <div style={{position:'absolute',left:110,top:130,width:790,height:540,border:'10px solid #66717d',background:'#121820'}}>
        <div style={{position:'absolute',left:110,top:175,width:560,height:190,borderRadius:'70px 100px 25px 30px',background:'#3e5065'}}>
          <div style={{position:'absolute',left:75,bottom:-42,width:110,height:110,borderRadius:'50%',background:'#0b0e12',border:'18px solid #292e36'}}/>
          <div style={{position:'absolute',right:70,bottom:-42,width:110,height:110,borderRadius:'50%',background:'#0b0e12',border:'18px solid #292e36'}}/>
          <div style={{position:'absolute',left:160,top:-76,width:320,height:100,background:'#2b3947',transformOrigin:'bottom left',transform:`rotate(${-30*hood}deg)`}}/>
        </div>
      </div>
      <Person x={960} y={410} s={1.15} shirt="#2e5e7d"/>
      <Person x={1270} y={430} s={1.05} shirt="#675247"/>
      {mode==='credence_cutaway'&&<>
        <div style={{position:'absolute',left:270,top:235,width:430,height:245,borderRadius:34,background:'rgba(5,11,17,.88)',border:'2px solid #7dd8ff'}}>
          {Array.from({length:8}).map((_,i)=><div key={i} style={{position:'absolute',left:36+(i%4)*95,top:42+Math.floor(i/4)*108,width:55,height:55,borderRadius:12,background:i===5?'#ff6d6d':'#5faac6',boxShadow:i===5?'0 0 24px #ff6d6d':''}}/>)}
        </div>
        <Label x={1050} y={205} text="整備士：内部状態が見える"/>
        <Label x={1100} y={305} text="顧客：必要性を判断できない"/>
      </>}
      {mode==='course_credence'&&<div style={{position:'absolute',right:100,top:190,width:650,height:350,borderRadius:30,background:'rgba(8,14,25,.9)',border:'2px solid #495f84',padding:34,color:'#fff',fontFamily:'Noto Sans JP',fontSize:33,lineHeight:1.7}}>売れない理由は？<br/><span style={{opacity:.65}}>教材 / 実行量 / 市場 / 商品 / タイミング</span><br/><b style={{color:'#ffcd78'}}>購入後も切り分けられない</b></div>}
      {mode==='blame_balance'&&<>
        <div style={{position:'absolute',left:1040,top:270,width:560,height:24,background:'#9099a7',transformOrigin:'center',transform:`rotate(${-12+24*p}deg)`}}/>
        <Label x={1050} y={340} text="商品が悪い？"/>
        <Label x={1400} y={175} text="自分が悪い？"/>
      </>}
    </Frame>
  );
};

export const SeminarScene:React.FC<Props>=({p,mode})=>(
  <Frame from="#48283b" to="#0c0810">
    <div style={{position:'absolute',left:0,right:0,bottom:0,height:330,background:'#171019'}}/>
    <div style={{position:'absolute',left:150,top:150,width:900,height:560,borderRadius:28,background:'#271927'}}>
      <div style={{position:'absolute',left:70,top:50,width:760,height:370,background:'linear-gradient(#241631,#3a2038)',border:'2px solid #76536d'}}><Person x={330} y={80} s={1.1} shirt="#111116"/><Label x={80} y={50} text="本気の人だけ来てください"/></div>
    </div>
    <div style={{position:'absolute',right:130,top:250,width:600,height:350,borderRadius:32,background:'#f4eddc',padding:42,color:'#251b18',fontFamily:'Noto Sans JP',transform:`scale(${.9+.1*E(S(p,.2,.65))})`}}>
      <div style={{fontSize:35,fontWeight:900}}>参加費</div>
      <div style={{fontSize:82,fontWeight:1000,marginTop:25}}>¥980,000</div>
      <div style={{fontSize:30,marginTop:25}}>高い = 本気 = 特別？</div>
    </div>
    {mode==='price_signal'&&['高級会場','高価格','限定人数','実績写真'].map((x,i)=><Label key={x} x={240+i*370} y={800-(i%2)*70} text={x} opacity={C(p*5-i*.5)}/>) }
  </Frame>
);

export const StudentScene:React.FC<Props>=({p,mode})=>{
  const hot=new Set([7,42,83]);
  const focus=mode==='three_spotlights'||mode==='missing_denominator';
  return (
    <Frame from="#1b3856" to="#080d14">
      <div style={{position:'absolute',left:90,top:80,width:1740,height:790,display:'grid',gridTemplateColumns:'repeat(10,1fr)',gap:11}}>
        {Array.from({length:100}).map((_,i)=>{
          const h=hot.has(i);
          return <div key={i} style={{position:'relative',borderRadius:10,background:h?'#456e46':'#151d28',border:h?'2px solid #9de49d':'1px solid #2f3c4d',opacity:focus&&!h?.13:1,transform:h&&focus?`scale(${1+.23*E(S(p,.2,.8))})`:'none',zIndex:h?4:1,boxShadow:h?'0 0 25px rgba(130,255,150,.35)':''}}><div style={{position:'absolute',left:'50%',top:11,transform:'translateX(-50%)',width:24,height:24,borderRadius:'50%',background:h?'#bde7bd':'#5e6c7c'}}/><div style={{position:'absolute',left:'50%',top:40,transform:'translateX(-50%)',width:43,height:30,borderRadius:8,background:h?'#769f75':'#394654'}}/></div>;
        })}
      </div>
      {mode==='three_spotlights'&&<>
        <Label x={260} y={870} text="月商82万円" opacity={E(S(p,.15,.55))}/>
        <Label x={760} y={870} text="初月30万円" opacity={E(S(p,.25,.65))}/>
        <Label x={1260} y={870} text="会社を辞めて独立" opacity={E(S(p,.35,.75))}/>
      </>}
      {mode==='missing_denominator'&&<div style={{position:'absolute',left:550,top:430,width:820,height:130,borderRadius:30,background:'rgba(5,7,12,.88)',color:'#fff',fontFamily:'Noto Sans JP',fontWeight:900,fontSize:52,display:'flex',alignItems:'center',justifyContent:'center'}}>3人の成功 / 100人の参加</div>}
      {mode==='optimism_self'&&<div style={{position:'absolute',left:720,top:370,width:480,height:220,borderRadius:28,background:'#111b2a',border:'2px solid #7695c9',color:'#fff',fontFamily:'Noto Sans JP',fontSize:38,fontWeight:900,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center'}}>失敗者は多い<br/><span style={{color:'#ffd77e'}}>でも自分はやる</span></div>}
      {mode==='control_illusion'&&<>
        {['毎日投稿','動画を全部見る','怠けない','自分は違う'].map((x,i)=><Label key={x} x={340+i*330} y={830-(i%2)*80} text={x} opacity={C(p*5-i*.45)}/>) }
      </>}
    </Frame>
  );
};

export const SunkScene:React.FC<Props>=({p,mode})=>{
  const values=['¥980','¥4,980','¥30,000','¥298,000','¥498,000'];
  return (
    <Frame from="#432e31" to="#0e0b0e">
      <Person x={150} y={560} s={1.4}/>
      {values.map((x,i)=><div key={x} style={{position:'absolute',left:500+i*250,top:760-i*115,width:220,height:100,borderRadius:16,background:i<4?'#4e4038':'#6b4141',border:'2px solid #8d7568',color:'#fff',fontFamily:'Noto Sans JP',fontSize:31,fontWeight:900,display:'flex',alignItems:'center',justifyContent:'center',opacity:C(p*7-i*.6)}}>{x}</div>)}
      {mode==='sunk_cost_stairs'&&<Label x={550} y={190} text="ここまで使った金と時間が、後ろに積み上がる" opacity={E(S(p,.2,.7))}/>} 
      {mode==='backward_door'&&<div style={{position:'absolute',left:260,top:270,width:230,height:380,border:'16px solid #4b3735',background:'#08090c',opacity:1-E(S(p,.3,.85))}}/>}
    </Frame>
  );
};

export const ConsultScene:React.FC<Props>=({p,mode})=>{
  const causes=['投稿数','商品コンセプト','信頼構築','市場選定','マインド'];
  const idx=Math.min(causes.length-1,Math.floor(p*causes.length));
  return (
    <Frame from="#17354d" to="#070b12">
      <Laptop x={150} y={190} s={1.25}><AbsoluteFill style={{background:'#101723'}}><Person x={90} y={75} s={.58}/><Person x={330} y={75} s={.58} shirt="#343944"/></AbsoluteFill></Laptop>
      <div style={{position:'absolute',right:110,top:140,width:680,height:700}}>
        {causes.map((x,i)=><div key={x} style={{position:'absolute',left:20+(i%2)*320,top:40+i*112,width:300,height:82,borderRadius:18,background:i===idx?'#775448':'#182337',border:i===idx?'2px solid #ffbd8b':'1px solid #43516b',color:'#fff',fontFamily:'Noto Sans JP',fontWeight:900,fontSize:29,display:'flex',alignItems:'center',justifyContent:'center',opacity:i<=idx?1:.35}}>{x}</div>)}
      </div>
      {mode==='unfalsifiable_loop'&&<div style={{position:'absolute',right:170,top:210,width:590,height:520,borderRadius:'50%',border:'10px dashed #ffbd8b',transform:`rotate(${p*110}deg)`,opacity:.65}}/>}
    </Frame>
  );
};

export const MarketScene:React.FC<Props>=({p,mode})=>(
  <Frame from="#314057" to="#11161d">
    <div style={{position:'absolute',left:80,right:80,bottom:100,height:500,display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:28}}>
      {Array.from({length:8}).map((_,i)=><div key={i} style={{position:'relative',background:'#202830',border:'1px solid #4b5b6b',borderRadius:18}}><div style={{position:'absolute',left:40,right:40,top:70,height:110,borderRadius:'45px 65px 18px 18px',background:i%3===0?'#8a5b4b':i%3===1?'#516e83':'#6b6f63'}}/><div style={{position:'absolute',left:70,top:160,width:65,height:65,borderRadius:'50%',background:'#090b0e',border:'10px solid #393f48'}}/><div style={{position:'absolute',right:70,top:160,width:65,height:65,borderRadius:'50%',background:'#090b0e',border:'10px solid #393f48'}}/>{mode==='lemon_filter'&&<div style={{position:'absolute',inset:0,borderRadius:18,background:i%3===0?'rgba(255,80,80,.38)':'rgba(88,230,139,.12)',opacity:E(S(p,.25,.75))}}/>}</div>)}
    </div>
    {mode==='used_car_market'&&<><Label x={220} y={120} text="売り手：品質を知っている"/><Label x={1140} y={180} text="買い手：見分けられない"/></>}
    {mode==='trust_signals'&&['出版','出演歴','高級会場','フォロワー','成功者との写真'].map((x,i)=><Label key={x} x={180+i*320} y={135+(i%2)*85} text={x} opacity={C(p*5-i*.45)}/>)}
  </Frame>
);

export const ZoomScene:React.FC<Props>=({p,mode})=>(
  <Frame from="#183750" to="#080c12">
    <div style={{position:'absolute',left:100,top:90,width:1720,height:780,display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:18}}>
      {Array.from({length:20}).map((_,i)=><div key={i} style={{position:'relative',background:'#182333',borderRadius:18,border:'1px solid #3f526c',transform:`scale(${1+.02*Math.sin(p*8+i)})`}}><Person x={85+(i%2)*14} y={35} s={.55} shirt={['#365b82','#75534d','#465d48','#66517c'][i%4]}/><div style={{position:'absolute',left:12,bottom:10,color:'#fff',fontSize:18,fontFamily:'Noto Sans JP'}}>参加者 {i+1}</div></div>)}
    </div>
    {mode==='identity_badge'&&<div style={{position:'absolute',left:620,top:410,width:680,height:200,borderRadius:34,background:'rgba(95,71,143,.95)',color:'#fff',fontFamily:'Noto Sans JP',fontWeight:900,fontSize:46,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center'}}>普通の会社員ではない<br/>挑戦している人間</div>}
    {mode==='exit_cost_identity'&&<><div style={{position:'absolute',left:130,top:160,width:1600,height:650,border:'10px solid #b76464',opacity:E(S(p,.2,.7))}}/><Label x={700} y={850} text="退会 = 仲間・夢・自己像から離れる"/></>}
  </Frame>
);

export const LogisticsScene:React.FC<Props>=({p,mode})=>{
  const digital=mode==='digital_fulfillment'||mode==='buyer_as_ad';
  return (
    <Frame from={digital?'#163750':'#6a5036'} to={digital?'#071019':'#18120d'}>
      {!digital?<>
        <div style={{position:'absolute',left:80,top:130,width:760,height:650,background:'#3a2a20'}}>{Array.from({length:28}).map((_,i)=><div key={i} style={{position:'absolute',left:30+(i%7)*100,top:40+Math.floor(i/7)*135,width:82,height:105,background:'#c2a77a',transform:`rotate(${(i%5-2)*3}deg)`}}/>)}</div>
        <Person x={1030} y={420} s={1.2} shirt="#5b4938"/>
        <Label x={980} y={190} text="広告 → 申込 → 入金 → 封入 → 郵送"/>
      </>:<>
        <Phone x={150} y={180} s={1.2}/><Laptop x={590} y={220} s={1.05}/>
        <div style={{position:'absolute',right:100,top:170,width:520,height:610}}>{['広告配信','LINE自動送信','24時間決済','会員サイト','無限コピー'].map((x,i)=><div key={x} style={{marginBottom:24,height:82,borderRadius:18,background:'#172b44',border:'1px solid #42658f',color:'#fff',fontFamily:'Noto Sans JP',fontWeight:900,fontSize:29,display:'flex',alignItems:'center',justifyContent:'center',transform:`translateX(${80*(1-C(p*6-i*.6))}px)`,opacity:C(p*6-i*.6)}}>{x}</div>)}</div>
        {mode==='buyer_as_ad'&&['自己投資しました','人生変えます','最高の仲間','本気で挑戦'].map((x,i)=><Label key={x} x={260+i*380} y={790-(i%2)*70} text={x} opacity={C(p*5-i*.5)}/>) }
      </>}
    </Frame>
  );
};

export const RegulationScene:React.FC<Props>=({p,mode})=>(
  <Frame from="#303b50" to="#0c1018">
    <div style={{position:'absolute',left:130,top:130,width:650,height:650,borderRadius:28,background:'#ebe7dc',padding:45,color:'#242424',fontFamily:'Noto Sans JP'}}><div style={{fontSize:52,fontWeight:1000}}>CONSUMER NOTICE</div><div style={{marginTop:40,fontSize:31,lineHeight:1.7}}>保証された収益<br/>短期間で大きな利益<br/>過度な即決要求<br/>根拠のない成功率</div></div>
    <div style={{position:'absolute',right:100,top:140,width:820,height:680}}>{['情報商材','オンラインスクール','コンサルティング','コミュニティ','伴走支援','個別メンタリング'].map((x,i)=><div key={x} style={{position:'absolute',left:(i%2)*390,top:20+Math.floor(i/2)*190,width:340,height:115,borderRadius:24,background:i===Math.min(5,Math.floor(p*7))?'#735482':'#192235',border:'1px solid #526079',color:'#fff',fontFamily:'Noto Sans JP',fontWeight:900,fontSize:28,display:'flex',alignItems:'center',justifyContent:'center',transform:`rotate(${(i%2?3:-3)*Math.sin(p*6+i)}deg)`}}>{x}</div>)}</div>
    {mode==='three_conditions'&&<div style={{position:'absolute',left:790,top:350,width:920,height:260,display:'flex',gap:24}}>{['将来が不安','何をすればいいか分からない','何か変えたい'].map((x,i)=><div key={x} style={{flex:1,borderRadius:28,background:'#1d2e45',border:'2px solid #627ba0',color:'#fff',fontFamily:'Noto Sans JP',fontWeight:900,fontSize:29,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',opacity:C(p*5-i*.6)}}>{x}</div>)}</div>}
  </Frame>
);

export const AIScene:React.FC<Props>=({p,mode})=>{
  const branches=['ブログ','動画','EC','広告運用','プログラミング','コンサル','デザイン','SNS','デジタル商品'];
  return (
    <Frame from="#1b4058" to="#071018">
      <Person x={110} y={550} s={1.4}/>
      <Laptop x={450} y={170} s={1.42}><AbsoluteFill style={{background:'#0d1521',padding:30,color:'#fff',fontFamily:'Noto Sans JP'}}><div style={{fontSize:28,color:'#9cb8d8'}}>副業で月10万円稼ぐ方法を教えて</div>{branches.slice(0,Math.max(1,Math.floor(p*branches.length))).map((x,i)=><div key={x} style={{marginTop:16,fontSize:24,padding:'9px 14px',borderRadius:10,background:'#18273b',display:'inline-block',marginRight:10}}>{x}</div>)}</AbsoluteFill></Laptop>
      {mode==='ai_branching'&&branches.map((x,i)=>{const a=(i/(branches.length-1)-.5)*1.9;const xx=1490+Math.cos(a)*240,yy=500+Math.sin(a)*350;return <React.Fragment key={x}><div style={{position:'absolute',left:1220,top:478,width:Math.max(1,xx-1220),height:5,background:'#6bb8e8',transformOrigin:'left center',transform:`rotate(${Math.atan2(yy-480,xx-1220)*180/Math.PI}deg)`,opacity:C(p*10-i*.55)}}/><div style={{position:'absolute',left:xx-30,top:yy-30,width:60,height:60,borderRadius:'50%',background:'#29455f',opacity:C(p*10-i*.55)}}/></React.Fragment>})}
      {mode==='human_certainty'&&<div style={{position:'absolute',right:120,top:260,width:520,height:310,borderRadius:34,background:'#6a3f3f',border:'2px solid #e2a0a0',color:'#fff',fontFamily:'Noto Sans JP',fontWeight:1000,fontSize:40,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center'}}>AIはいろいろ言う<br/><br/>私は「これだけ」でいいと断言します</div>}
      {mode==='certainty_market'&&<Label x={1170} y={730} text="情報の価格 ↓　確信の価格 →"/>}
    </Frame>
  );
};

export const TrainScene:React.FC<Props>=({p,mode})=>(
  <Frame from="#0d2233" to="#070b12">
    <div style={{position:'absolute',left:0,right:0,top:80,height:400,overflow:'hidden'}}>{Array.from({length:14}).map((_,i)=><div key={i} style={{position:'absolute',left:i*180-p*460,top:100+(i%3)*30,width:130,height:250+(i%4)*28,background:'#111b2a',border:'1px solid #273751'}}/>)}</div>
    <div style={{position:'absolute',left:90,right:90,bottom:100,height:460,borderRadius:30,background:'#242b34',border:'8px solid #596372'}}><div style={{position:'absolute',left:50,top:50,width:850,height:280,background:'#0a0f16',border:'8px solid #495562'}}/><Person x={1060} y={120} s={1.15}/><Phone x={1390} y={70} s={.72}><div style={{position:'absolute',left:20,right:20,top:60,padding:18,borderRadius:14,background:'#672f35',color:'#fff',fontSize:20,fontWeight:900,fontFamily:'Noto Sans JP'}}>AI時代に取り残される会社員と<br/>自由を手に入れる人の違い</div></Phone>{mode==='station_exit'&&<div style={{position:'absolute',left:50,top:50,width:850,height:280,background:'linear-gradient(90deg,#171c25,#223345)',transform:`translateX(${-360*E(S(p,.3,1))}px)`}}/>}</div>
  </Frame>
);

export const TheoryScene:React.FC<Props>=({p,mode})=>{
  const labels=mode==='causal_web'?['能力','運','時期','市場','競合','資金','健康','人間関係','偶然']:mode==='history_triptych'?['1860s 郵便広告','1950s 在宅ワーク','2020s オンライン商材']:mode==='control_future'?['未来は読めない','でも制御したい','だから一本線を買う']:['秘密の情報','成功までの因果','自分の次の一歩'];
  return (
    <Frame from="#403455" to="#080910">
      <div style={{position:'absolute',left:740,top:355,width:440,height:250,borderRadius:'50%',background:'#5d496b',border:'3px solid #9a81a8',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontFamily:'Noto Sans JP',fontWeight:1000,fontSize:45,textAlign:'center'}}>一本の<br/>因果物語</div>
      {labels.map((x,i)=>{const a=i/labels.length*Math.PI*2+p*.35;return <React.Fragment key={x}><div style={{position:'absolute',left:960,top:480,width:Math.max(1,470),height:4,background:'#7f79b6',transformOrigin:'left center',transform:`rotate(${a*180/Math.PI}deg)`,opacity:.45}}/><Label x={850+Math.cos(a)*470} y={450+Math.sin(a)*300} text={x} opacity={C(p*5-i*.25)} scale={.9}/></React.Fragment>})}
    </Frame>
  );
};

export const StudioScene:React.FC<Props>=({p,mode})=>(
  <Frame from="#462e43" to="#0a080d">
    <div style={{position:'absolute',left:80,top:120,width:580,height:650,background:'#15131a',borderRadius:28}}><div style={{position:'absolute',left:170,top:80,width:240,height:430,borderRadius:'50%',border:'25px solid #f2d6a2',boxShadow:'0 0 60px #f2d6a255'}}/><div style={{position:'absolute',left:270,top:510,width:40,height:150,background:'#40372f'}}/></div>
    <div style={{position:'absolute',left:760,top:100,width:820,height:570,background:'linear-gradient(#101929,#26354f)',border:'12px solid #303543'}}>{Array.from({length:11}).map((_,i)=><div key={i} style={{position:'absolute',left:20+i*78,top:260-(i%4)*45,width:55,height:300+(i%3)*30,background:'#121d2e'}}/>)}</div>
    <Person x={1060} y={420} s={1.2} shirt="#131318"/>
    <div style={{position:'absolute',right:140,top:190,width:140,height:70,borderRadius:16,background:'#151515',border:'4px solid #555',display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:28,height:28,borderRadius:'50%',background:mode==='studio_record'||mode==='final_answer'?'#f33':'#411'}}/></div>
    {mode==='studio_record'&&<div style={{position:'absolute',left:660,bottom:180,width:980,height:170,borderRadius:28,background:'rgba(0,0,0,.72)',color:'#fff',fontFamily:'Noto Sans JP',fontWeight:1000,fontSize:44,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center'}}>「なぜ、ほとんどの人は<br/>努力しているのに成功できないと思いますか」</div>}
    {mode==='final_answer'&&<div style={{position:'absolute',left:560,top:350,width:800,height:220,borderRadius:36,background:'#6b3f48',color:'#fff',fontFamily:'Noto Sans JP',fontWeight:1000,fontSize:58,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',transform:`scale(${.9+.1*E(S(p,.2,.7))})`}}>その答えが<br/>次の商品になる</div>}
  </Frame>
);
