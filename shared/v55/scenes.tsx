import React from 'react';
import {AbsoluteFill,Img,staticFile,useCurrentFrame} from 'remotion';
import {MaleCharacter,FemaleCharacter} from './characters';

type Meta={id:string;phase:string;visual:string;localIndex:number;variant:number;shotKind:string};
const font='Noto Sans JP, sans-serif';
const C=(v:number)=>Math.max(0,Math.min(1,v));
const E=(p:number,a:number,b:number)=>C((p-a)/Math.max(.001,b-a));

const Bg=({src,p,x=0,y=0,dim=0,scale=1.055}:{src:string;p:number;x?:number;y?:number;dim?:number;scale?:number})=><>
  <Img src={staticFile(src)} style={{position:'absolute',inset:-46,width:2012,height:1172,objectFit:'cover',transform:`translate(${x*p}px,${y*p}px) scale(${scale+.028*p})`,filter:dim?`brightness(${1-dim})`:undefined}}/>
  <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 45%,transparent 50%,rgba(0,0,0,.42) 100%)'}}/>
</>;

const Grain=()=>{const f=useCurrentFrame();return <><div style={{position:'absolute',inset:0,opacity:.08,backgroundImage:'radial-gradient(#fff .7px,transparent .7px)',backgroundSize:'5px 5px',transform:`translate(${f%5}px,${(f*3)%5}px)`,mixBlendMode:'soft-light'}}/><div style={{position:'absolute',inset:0,boxShadow:'inset 0 0 170px #000a'}}/></>};

const Char=({x,y,s=.72,pose='standing',direction='front',outfit='businessCasual',tone='#40566f',phone=false}:{x:number;y:number;s?:number;pose?:any;direction?:any;outfit?:any;tone?:string;phone?:boolean})=>
  <MaleCharacter pose={pose} direction={direction} outfit={outfit} prop={phone?'phone':'none'} colors={{top:tone}} width={300} scale={s} style={{position:'absolute',left:x,top:y}}/>;

const Woman=({x,y,s=.72,pose='standing',direction='front',outfit='businessCasual'}:{x:number;y:number;s?:number;pose?:any;direction?:any;outfit?:any})=>
  <FemaleCharacter pose={pose} direction={direction} outfit={outfit} width={300} scale={s} style={{position:'absolute',left:x,top:y}}/>;

const Text=({x,y,text,size=42,alpha=1,color='#f4f1e9',w}:{x:number;y:number;text:string;size?:number;alpha?:number;color?:string;w?:number})=>
  <div style={{position:'absolute',left:x,top:y,width:w,fontFamily:font,fontSize:size,fontWeight:900,lineHeight:1.35,color,opacity:alpha,textShadow:'0 5px 28px #000',whiteSpace:'pre-line'}}>{text}</div>;

const Card=({x,y,text,w=420,h=118,accent='#d5ae6b',alpha=1,rot=0,size=29}:{x:number;y:number;text:string;w?:number;h?:number;accent?:string;alpha?:number;rot?:number;size?:number})=>
  <div style={{position:'absolute',left:x,top:y,width:w,height:h,padding:18,borderRadius:20,background:'rgba(7,9,13,.90)',border:`2px solid ${accent}88`,boxShadow:'0 24px 70px #0009',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:font,fontSize:size,fontWeight:850,color:'#f5f2ea',textAlign:'center',whiteSpace:'pre-line',opacity:alpha,transform:`rotate(${rot}deg)`}}>{text}</div>;

const Phone=({x=1180,y=100,w=430,h=800,children,tilt=0}:{x?:number;y?:number;w?:number;h?:number;children?:React.ReactNode;tilt?:number})=>
  <div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:54,background:'#080b10',border:'12px solid #2c333d',boxShadow:'0 35px 100px #000c',overflow:'hidden',transform:`rotate(${tilt}deg)`}}>
    <div style={{position:'absolute',left:w*.36,top:10,width:w*.28,height:22,borderRadius:20,background:'#1e242c'}}/>
    {children}
  </div>;

const Bubble=({text,right=false,y=0,alpha=1}:{text:string;right?:boolean;y?:number;alpha?:number})=>
  <div style={{position:'absolute',top:y,left:right?90:28,right:right?28:90,padding:'15px 18px',borderRadius:20,background:right?'#3e8a5b':'#343b45',fontFamily:font,fontSize:24,fontWeight:650,color:'#f7f7f5',opacity:alpha,boxShadow:'0 8px 18px #0005'}}>{text}</div>;

const Laptop=({x,y,scale=1}:{x:number;y:number;scale?:number})=><div style={{position:'absolute',left:x,top:y,transform:`scale(${scale})`,transformOrigin:'top left'}}>
  <div style={{width:310,height:190,borderRadius:15,background:'#20252c',border:'8px solid #505861',boxShadow:'0 20px 50px #0008'}}>
    <div style={{margin:14,width:266,height:145,background:'linear-gradient(135deg,#b6d0dd,#dce6e9)'}}/>
  </div>
  <div style={{width:365,height:22,marginLeft:-28,borderRadius:'0 0 18px 18px',background:'#747b81'}}/>
</div>;

const Glass=({x,y,tea=false}:{x:number;y:number;tea?:boolean})=><div style={{position:'absolute',left:x,top:y,width:58,height:118,border:'4px solid rgba(238,242,244,.72)',borderTop:'none',borderRadius:'0 0 15px 15px',background:tea?'linear-gradient(to top,rgba(121,64,32,.78) 0 55%,rgba(255,255,255,.04) 55%)':'linear-gradient(to top,rgba(215,160,76,.66) 0 52%,rgba(255,255,255,.04) 52%)',boxShadow:'0 16px 34px #0007'}}/>;

const Can=({x,y,rot=0}:{x:number;y:number;rot?:number})=><div style={{position:'absolute',left:x,top:y,width:55,height:118,borderRadius:12,background:'linear-gradient(90deg,#747a80,#d4d7d8 45%,#686d72)',border:'2px solid #e0e3e4aa',transform:`rotate(${rot}deg)`,boxShadow:'0 15px 30px #0007'}}>
  <div style={{position:'absolute',left:9,right:9,top:8,height:8,borderRadius:8,background:'#43484d'}}/>
</div>;

const Wallet=({x,y,p}:{x:number;y:number;p:number})=><div style={{position:'absolute',left:x,top:y,width:340,height:220,borderRadius:24,background:'linear-gradient(145deg,#17191c,#34383c)',border:'3px solid #777b7d',boxShadow:'0 34px 90px #000b',transform:`rotate(${-6+4*p}deg) scale(${.88+.12*E(p,.08,.4)})`}}>
  <div style={{position:'absolute',left:34,right:34,top:42,height:4,background:'#777',opacity:.7}}/><div style={{position:'absolute',right:28,bottom:25,fontFamily:font,fontWeight:900,fontSize:22,color:'#d8d2c6'}}>LEATHER</div>
</div>;

const Champagne=({x,y,p}:{x:number;y:number;p:number})=><div style={{position:'absolute',left:x,top:y,width:110,height:330,transform:`rotate(${-8+3*Math.sin(p*5)}deg)`}}>
  <div style={{position:'absolute',left:25,top:0,width:60,height:100,borderRadius:'18px 18px 8px 8px',background:'#26362a'}}/>
  <div style={{position:'absolute',left:5,top:82,width:100,height:235,borderRadius:'40px 40px 24px 24px',background:'linear-gradient(90deg,#1b3426,#52653a,#183023)',border:'3px solid #718066'}}/>
  <div style={{position:'absolute',left:22,top:160,width:66,height:72,background:'#e4cf9f',borderRadius:6}}/>
</div>;

const CityBokeh=({p}:{p:number})=><>{Array.from({length:24}).map((_,i)=><div key={i} style={{position:'absolute',left:(i*173)%1920,top:70+(i*97)%700,width:18+(i%4)*11,height:18+(i%4)*11,borderRadius:'50%',background:i%3===0?'rgba(255,205,122,.28)':'rgba(171,210,236,.20)',filter:'blur(5px)',transform:`translateY(${Math.sin(p*8+i)*16}px)`}}/>)}</>;

const Slack=({p,v}:{p:number;v:number})=><div style={{position:'absolute',right:100,top:110,width:650,height:720,borderRadius:28,background:'#171a20',border:'2px solid #49515d',boxShadow:'0 35px 100px #000a',padding:34,fontFamily:font,color:'#f4f4f2'}}>
  <div style={{fontSize:26,fontWeight:800,opacity:.55}}># 人事異動</div>
  <div style={{marginTop:34,padding:22,borderRadius:18,background:'#242933',fontSize:30,lineHeight:1.5}}>
    10月1日付<br/><b>営業企画部　マネージャー</b><br/>林
  </div>
  {Array.from({length:10}).map((_,i)=><span key={i} style={{display:'inline-block',margin:'24px 9px 0 0',fontSize:34,opacity:E(p,.18+i*.045,.32+i*.045)}}>{['🎉','👏','👍','🎊'][i%4]}</span>)}
  {v%2===1&&<div style={{marginTop:42,padding:20,borderRadius:16,background:'#20252d',fontSize:27,opacity:E(p,.45,.7)}}>後輩：林さん、ついにですね</div>}
</div>;

const SearchPhone=({p}:{p:number})=><Phone x={1170} y={105}>
  <div style={{position:'absolute',inset:55,top:82,fontFamily:font,color:'#f6f6f4'}}>
    <div style={{height:64,borderRadius:18,background:'#1b2027',padding:'15px 18px',fontSize:27,color:'#e6e8ea'}}>美咲<span style={{opacity:E(p,.12,.35)}}>|</span></div>
    <div style={{marginTop:34,fontSize:22,opacity:.45}}>検索結果</div>
    <div style={{marginTop:18,padding:20,borderRadius:20,background:'#272e37',fontSize:30,opacity:E(p,.28,.52)}}>美咲</div>
    <div style={{marginTop:12,fontSize:20,opacity:.38}}>最終メッセージ　4年前</div>
  </div>
</Phone>;

const GoalCards=({p}:{p:number})=><>{[
 ['30歳','年収700万'],['次','大きい会社'],['35歳','管理職'],['家','山手線内側']
].map((g,i)=><Card key={g[0]} x={140+i*430} y={170+(i%2)*165} w={345} h={145} text={g.join('\n')} accent={i===3?'#e3b86e':'#8aa9bc'} alpha={E(p,.08+i*.1,.25+i*.1)} rot={(i-1.5)*2}/>)}</>;

const Commute=({p}:{p:number})=><div style={{position:'absolute',left:190,right:190,top:170,bottom:170}}>
  <div style={{position:'absolute',left:70,right:70,top:350,height:12,background:'#4f5964'}}/>
  {[
    ['中野新橋',70],['新宿',650],['品川',1330]
  ].map(([name,x],i)=><div key={name as string} style={{position:'absolute',left:Number(x),top:315}}>
    <div style={{width:68,height:68,borderRadius:'50%',background:i===1?'#4f9562':'#607488',border:'8px solid #d9dde0'}}/>
    <div style={{position:'absolute',top:88,left:-70,width:210,textAlign:'center',fontFamily:font,fontSize:30,fontWeight:850,color:'#f4f1e9'}}>{name}</div>
  </div>)}
  <div style={{position:'absolute',left:70+(1330-70)*E(p,.08,.75),top:326,width:48,height:48,borderRadius:'50%',background:'#e2bb70',boxShadow:'0 0 35px #e2bb70'}}/>
  <div style={{position:'absolute',right:80,top:120,fontFamily:font,fontSize:70,fontWeight:950,color:'#f0d7a5',opacity:E(p,.55,.78)}}>+120万円</div>
</div>;

const StatusTags=({p}:{p:number})=><>{['会社','年収','役職','住所','家'].map((t,i)=><div key={t} style={{position:'absolute',left:210+i*310,top:160+(i%2)*90,padding:'16px 24px',borderRadius:14,background:'rgba(240,240,230,.12)',border:'1px solid #d8c39d66',fontFamily:font,fontSize:27,fontWeight:850,color:'#f4f0e8',opacity:E(p,.08+i*.09,.24+i*.09)}}>{t}</div>)}</>;

const AchievementDecay=({p}:{p:number})=><div style={{position:'absolute',left:250,top:180,width:1420,height:600}}>
  <div style={{position:'absolute',left:0,bottom:0,width:12,height:520,background:'#88919a'}}/><div style={{position:'absolute',left:0,right:0,bottom:0,height:12,background:'#88919a'}}/>
  {[['700万','3日',210],['800万','1夜',690],['家','家具を選ぶ間',1110]].map((d,i)=><div key={d[0] as string} style={{position:'absolute',left:Number(d[2]),bottom:0,width:220,height:420}}>
    <div style={{position:'absolute',left:0,bottom:0,width:62,height:330-(i*80),background:'#c9a968',opacity:.72}}/>
    <div style={{position:'absolute',left:82,bottom:80,fontFamily:font,color:'#f5f0e7',fontSize:28,fontWeight:800,whiteSpace:'pre-line'}}>{d[0]}{String.fromCharCode(10)}{d[1]}</div>
  </div>)}
  <div style={{position:'absolute',left:60+(1150*E(p,.2,.85)),top:35+(330*E(p,.2,.85)),width:28,height:28,borderRadius:'50%',background:'#e5be72',boxShadow:'0 0 28px #e5be72'}}/>
</div>;

const LineThread=({p,mode='past'}:{p:number;mode?:'past'|'unsent'})=><Phone x={1140} y={80} w={500} h={850}>
  <div style={{position:'absolute',inset:54,top:80,fontFamily:font,color:'#f5f5f3'}}>
    <div style={{fontSize:27,fontWeight:800,opacity:.55}}>美咲</div>
    {mode==='past'?<>
      <Bubble y={80} right text='ごめん今日無理' alpha={E(p,.02,.12)}/>
      <Bubble y={155} right text='今週結構きつい' alpha={E(p,.10,.20)}/>
      <Bubble y={230} right text='来月なら少し落ち着く' alpha={E(p,.18,.28)}/>
      <Bubble y={305} right text='今度旅行行こう' alpha={E(p,.26,.36)}/>
      <Bubble y={380} right text='年末は休めそう' alpha={E(p,.34,.44)}/>
      <Bubble y={485} text='ちゃんと寝てね' alpha={E(p,.46,.56)}/>
      <Bubble y={560} text='無理しすぎないでね' alpha={E(p,.54,.64)}/>
      <Bubble y={635} text='今日は早く帰れそう？' alpha={E(p,.62,.72)}/>
      <Bubble y={710} text='ご飯いる？' alpha={E(p,.70,.80)}/>
    </>:<>
      <div style={{position:'absolute',left:0,right:0,bottom:40,height:125,borderRadius:22,background:'#181d23',border:'2px solid #313943',padding:20,fontSize:28}}>
        <span style={{opacity:1-E(p,.72,.9)}}>今日、昇進した<br/>あの頃言ってたマネージャーになった</span>
        <span style={{opacity:E(p,.76,.92),color:'#858b91'}}>メッセージを入力</span>
      </div>
      <div style={{position:'absolute',right:0,bottom:0,fontSize:22,opacity:.45}}>送信しない</div>
    </>}
  </div>
</Phone>;

const Signature=({p}:{p:number})=><div style={{position:'absolute',left:470,top:240,width:980,height:520,borderRadius:24,background:'#f4f5f3',boxShadow:'0 35px 110px #000b',padding:58,fontFamily:font,color:'#242a31'}}>
  <div style={{fontSize:28,opacity:.55}}>新規メール</div>
  <div style={{marginTop:70,fontSize:32}}>よろしくお願いいたします。</div>
  <div style={{marginTop:90,borderTop:'2px solid #c8cbd0',paddingTop:28,fontSize:31,lineHeight:1.7}}>
    林<br/><b style={{fontSize:46,opacity:E(p,.25,.55)}}>Manager</b><br/><span style={{fontSize:24,opacity:.55}}>営業企画部</span>
  </div>
</div>;

const Phase=({meta,bp,pp}:{meta:Meta;bp:number;pp:number})=>{
  const v=meta.variant??0;
  switch(meta.phase){
    case 'promotion_meeting':
      return <><Bg src='assets/backgrounds/BG_shibuya_office_23f_meeting_day.svg' p={pp} x={-90} dim={.03}/>
        <Char x={430} y={565} s={.75} direction='right'/><Char x={1080} y={550} s={.78} direction='left' tone='#615047'/>
        {v%4===0&&<Card x={675} y={155} w={570} h={150} text='「十月から、マネージャーお願いしたい」' accent='#d6b270' alpha={E(bp,.15,.35)}/>}
        {v%4===1&&<div style={{position:'absolute',left:720,top:660,width:480,height:115,borderRadius:28,background:'#555c62'}}/>}
        {v%4===2&&<Text x={250} y={180} text='「ありがとうございます」' size={58} alpha={E(bp,.12,.35)}/>}
        {v%4===3&&<><div style={{position:'absolute',left:1380,top:0,bottom:0,width:380,background:'linear-gradient(-90deg,rgba(0,0,0,.65),transparent)'}}/><Text x={1200} y={690} text='もっと嬉しいと思っていた。' size={38} alpha={E(bp,.25,.55)}/></>}
      </>;
    case 'promotion_reaction':
      return <><Bg src='assets/backgrounds/BG_shibuya_office_23f_meeting_day.svg' p={pp} x={-55} dim={.13}/>
        <Char x={280} y={585} s={.72} direction='right' phone/>
        <Slack p={pp} v={v}/>
        {v%3===2&&<><Char x={760} y={590} s={.68} direction='left' tone='#65564d'/><Card x={610} y={220} text='「長かったわ」' w={390} alpha={E(bp,.2,.45)}/></>}
      </>;
    case 'misaki_search':
      return <><Bg src='assets/backgrounds/BG_shibuya_office_23f_meeting_day.svg' p={pp} x={-30} dim={.28}/>
        <Char x={390} y={560} s={.82} pose='phone' direction='right' phone/>
        <SearchPhone p={bp}/>
        {v%3===1&&<Text x={160} y={170} text='4年間、一度も連絡していない名前。' size={42} w={720} alpha={E(bp,.2,.45)}/>}
        {v%3===2&&<Text x={160} y={730} text='もう、僕の人生にいない女だった。' size={48} w={850} alpha={E(bp,.2,.5)} color='#e7c279'/>}
      </>;
    case 'nakano_life':
      return <><Bg src='assets/backgrounds/BG_nakano_shinbashi_1k_night.svg' p={pp} x={-45}/>
        <Char x={460} y={610} s={.72} pose='sitting' direction='right' outfit='casual' tone='#445d78'/>
        <Woman x={790} y={605} s={.70} pose='sitting' direction='left' outfit='casual'/>
        {v%5===0&&<Card x={120} y={130} text={'中野新橋\n22㎡ / 78,000円'} w={400} accent='#8eacc0'/>}
        {v%5===1&&<><Can x={650} y={790} rot={-10}/><Can x={740} y={790} rot={6}/></>}
        {v%5===2&&<Text x={1110} y={610} text='玄関を開けると、冷蔵庫が見えた。' size={34} w={560}/>}
        {v%5===3&&<><Card x={120} y={160} text='給料日の次の土曜だけ\n中目黒 / 恵比寿' w={470}/><Card x={1260} y={180} text='普段\n新宿西口 / 中野坂上' w={420} accent='#7d8994'/></>}
        {v%5===4&&<div style={{position:'absolute',left:0,right:0,bottom:0,height:210,background:'linear-gradient(transparent,rgba(0,0,0,.5))'}}/>}
      </>;
    case 'ebisu_first_date':
      return <><Bg src='assets/backgrounds/BG_ebisu_restaurant_night.svg' p={pp} x={-65}/>
        <Char x={360} y={565} s={.72} direction='right' outfit='casual'/><Woman x={1050} y={565} s={.72} direction='left' outfit='casual'/>
        {v%4===0&&<>{['店A','店B','店C'].map((t,i)=><Card key={t} x={160+i*330} y={120+i*38} w={270} h={92} text={t} alpha={E(bp,.08+i*.12,.22+i*.12)} rot={i-1}/>)}</>}
        {v%4===1&&<Card x={650} y={150} w={640} text='「この辺、意外と住みやすいんだよね」' alpha={E(bp,.18,.38)}/>}
        {v%4===2&&<Card x={760} y={150} w={470} text='「住んでないじゃん」' accent='#c78d83' alpha={E(bp,.18,.38)}/>}
        {v%4===3&&<Text x={620} y={770} text='格好つけていることを、彼女はいつも分かっていた。' size={39} w={960}/>}
      </>;
    case 'future_talk':
      return <><div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#111722,#05070b)'}}/><CityBokeh p={pp}/>
        <Char x={770} y={560} s={.82} direction='front' outfit='casual'/><GoalCards p={pp}/>
        {v%3===1&&<Woman x={1290} y={565} s={.68} direction='left' outfit='casual'/>}
        {v%3===2&&<Card x={1180} y={710} w={470} text='「忙しい人生だね」' accent='#c4877e' alpha={E(bp,.18,.42)}/>}
      </>;
    case 'shinagawa_transfer':
      return <><div style={{position:'absolute',inset:0,background:'linear-gradient(#121923,#07090d)'}}/><Commute p={pp}/>
        {v%4===1&&<div style={{position:'absolute',right:150,top:600,width:600,height:250,borderRadius:24,background:'#151b22',border:'2px solid #47515c',padding:28,fontFamily:font,color:'#f4f3ef'}}>
          {['ごめん、今日無理そう','土曜出ることになった','来週ならいける'].map((t,i)=><div key={t} style={{marginTop:i?18:0,padding:14,borderRadius:14,background:'#3e8a5b',fontSize:26,opacity:E(bp,.08+i*.16,.24+i*.16)}}>{t}</div>)}
        </div>}
        {v%4===2&&<Card x={250} y={690} text='美咲「了解」' w={350} accent='#888f98'/>}
        {v%4===3&&<Text x={610} y={780} text='忙しい男には、未来がある。' size={52} color='#e4bd72'/>}
      </>;
    case 'sancha_move':
      return <><Bg src='assets/backgrounds/BG_sangenjaya_1k_night.svg' p={pp} x={-55}/>
        <Char x={420} y={590} s={.72} direction='right' outfit='casual'/><Woman x={1040} y={575} s={.72} direction='left' outfit='casual'/>
        {v%5===0&&<Card x={120} y={130} text={'三軒茶屋\n126,000円'} w={390} accent='#d3aa68'/>}
        {v%5===1&&<><Img src={staticFile('assets/props/PROP_moving_boxes_stack.svg')} style={{position:'absolute',left:120,top:650,width:360,transform:`translateY(${30*(1-bp)}px)`}}/><Text x={1240} y={180} text='「今、三茶」' size={54}/></>}
        {v%5===2&&<Card x={700} y={150} w={560} text='「前の部屋の方が好きだったかも」' accent='#c68f83'/>}
        {v%5===3&&<><Woman x={1220} y={520} s={.74} direction='back' outfit='casual'/><Text x={780} y={180} text='「前の部屋のときの方が、\nちゃんと一緒にいた感じする」' size={42} w={800}/></>}
        {v%5===4&&<>{['部屋↑','給料↑','仕事↑','理解？'].map((t,i)=><Card key={t} x={130+i*420} y={150+(i%2)*180} w={310} h={105} text={t} accent={i===3?'#b35f5a':'#7693a6'} alpha={E(bp,.06+i*.12,.22+i*.12)}/>)}</>}
      </>;
    case 'wallet_birthday':
      return <><div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#1c2027,#080a0e)'}}/><CityBokeh p={pp}/>
        <Wallet x={650} y={300} p={bp}/>
        {v%4===1&&<><Char x={260} y={590} s={.70} direction='right'/><Char x={1220} y={600} s={.65} direction='left' tone='#5f534c'/><Text x={1120} y={230} text='「彼女から」' size={48}/></>}
        {v%4===2&&<Phone x={1180} y={110}><div style={{position:'absolute',inset:55,top:90,fontFamily:font,color:'#f5f5f3'}}><Bubble y={70} text='昨日、楽しかった？'/><Bubble y={170} right text='楽しかったよ'/><Bubble y={270} text='よかった' alpha={E(bp,.45,.7)}/></div></Phone>}
        {v%4===3&&<Text x={260} y={730} text='今見ると、あれは確認だったのかもしれない。' size={42} w={1000}/>}
      </>;
    case 'gotanda_breakup':
      return <><Bg src='assets/backgrounds/BG_gotanda_cafe_day.svg' p={pp} x={-30} dim={.04}/>
        <Char x={400} y={570} s={.72} direction='right' outfit='casual'/><Woman x={1030} y={570} s={.72} direction='left' outfit='casual'/><Glass x={900} y={610} tea/>
        {v%7===0&&<><Laptop x={1320} y={515} scale={.62}/><Text x={120} y={125} text='五反田・駅前の普通のカフェ' size={38}/></>}
        {v%7===1&&<Card x={670} y={150} w={600} text='「たぶん、もう無理だと思う」' accent='#bd8279'/>}
        {v%7===2&&<Card x={590} y={150} w={720} text='「いや、俺もちゃんと考えてるよ」'/>}
        {v%7===3&&<Card x={700} y={150} w={560} text='「そういうことじゃない」' accent='#bd8279'/>}
        {v%7===4&&<>{['旅行','昇進','次の会社','給料','広い家'].map((t,i)=><Card key={t} x={80+i*350} y={150+(i%2)*155} w={280} h={92} text={'落ち着いたら\n'+t} alpha={E(bp,.05+i*.1,.2+i*.1)} accent='#8f99a3'/>)}</>}
        {v%7===5&&<Card x={620} y={150} w={760} h={150} text='「私、ずっと未来にいる気がする」' accent='#c0837a'/>}
        {v%7===6&&<><Text x={540} y={150} text='今のあなたの生活には、\n私はいないんだと思う。' size={50} w={880} color='#edc4bc'/><div style={{position:'absolute',left:970,top:520,width:340,height:320,background:'linear-gradient(90deg,transparent,rgba(0,0,0,.35))'}}/></>}
      </>;
    case 'after_breakup':
      return <><div style={{position:'absolute',inset:0,background:'linear-gradient(145deg,#141a22,#05070a)'}}/><StatusTags p={pp}/>
        <div style={{position:'absolute',left:300,top:520,width:1320,height:12,background:'#596572'}}/>
        {[['32','転職'],['33','チームリーダー'],['34','目黒マンション']].map((a,i)=><div key={a[0]} style={{position:'absolute',left:360+i*430,top:490}}>
          <div style={{width:70,height:70,borderRadius:'50%',background:'#d2aa67',border:'8px solid #e8e3d9'}}/><Text x={-50} y={95} text={a[0]+'歳\n'+a[1]} size={28} w={230} alpha={E(bp,.08+i*.18,.25+i*.18)}/>
        </div>)}
        {v%3===2&&<Text x={1130} y={750} text='年収 800万円超' size={48} color='#e2bc75'/>}
      </>;
    case 'meguro_home':
      return <><Bg src='assets/backgrounds/BG_meguro_1ldk_night.svg' p={pp} x={-55} dim={.04}/><Char x={520} y={585} s={.76} direction='right' outfit='casual'/>
        {v%5===0&&<Card x={120} y={130} text={'目黒 / 中古1LDK\n7,000万円台\n駅徒歩9分'} w={480} h={180}/>}
        {v%5===1&&<div style={{position:'absolute',right:130,top:130,width:620,height:560,background:'#eeeae0',boxShadow:'0 30px 90px #000b',padding:45,fontFamily:font,color:'#292b2e',transform:`rotate(${1.5-2*bp}deg)`}}>
          <div style={{fontSize:42,fontWeight:950}}>金銭消費貸借契約</div><div style={{marginTop:55,fontSize:30}}>借入期間　35年</div><div style={{marginTop:26,fontSize:30}}>物件価格　70,000,000円台</div><div style={{marginTop:85,width:120,height:120,border:'8px solid #b54343',borderRadius:'50%',opacity:E(bp,.35,.62)}}/>
        </div>}
        {v%5===2&&<StatusTags p={bp}/>}
        {v%5===3&&<AchievementDecay p={bp}/>}
        {v%5===4&&<><SearchPhone p={bp}/><Text x={150} y={750} text='会議室を出て三分後には、また美咲を検索していた。' size={40} w={900}/></>}
      </>;
    case 'promotion_night':
      return <><Bg src='assets/backgrounds/BG_ebisu_restaurant_night.svg' p={pp} x={-45}/>
        <Char x={380} y={590} s={.70} direction='right'/><Char x={1050} y={590} s={.68} direction='left' tone='#625248'/>
        <Champagne x={815} y={480} p={pp}/>
        {v%4===0&&<Card x={120} y={140} text={'昇進祝い\n恵比寿 / 10,000円コース'} w={440}/>}
        {v%4===1&&<Card x={720} y={155} w={470} text='「次は部長ですね」' accent='#d2ad6b'/>}
        {v%4===2&&<Card x={720} y={155} w={470} text='「もう勘弁してくれよ」'/>}
        {v%4===3&&<Text x={690} y={790} text='でも心の中では、少し嬉しかった。' size={42}/>}
      </>;
    case 'ebisu_walk':
      return <>{v<3?<><Bg src='assets/backgrounds/BG_ebisu_west_rotary_night.svg' p={pp} x={-70}/><Char x={780} y={590} s={.76} pose='walking' direction='right' outfit='businessCasual'/>{Array.from({length:6}).map((_,i)=><Char key={i} x={160+i*280} y={610+(i%2)*18} s={.48} direction={i%2?'left':'right'} tone='#444a52'/>)}</>:<><Bg src='assets/backgrounds/BG_ebisu_meguro_walk_night.svg' p={pp} x={-120}/><Char x={550+pp*300} y={590} s={.74} pose='walking' direction='right' outfit='businessCasual'/></>}
        {v===1&&<Text x={120} y={150} text='23:00過ぎ。\n山手線には乗らず、歩く。' size={42}/>}
        {v===3&&<Card x={970} y={155} text={'昔：イタリアン\n今：焼肉屋'} w={430} accent='#b76e61'/>}
        {v===4&&<Text x={210} y={170} text='「あ、本当に終わってるんだ」' size={50}/>}
        {v>=5&&<Text x={300} y={760} text='人間関係より先に、思い出の背景の方が取り壊されていく。' size={42} w={1350}/>}
      </>;
    case 'meguro_midnight':
      return <><Bg src='assets/backgrounds/BG_meguro_1ldk_night.svg' p={pp} x={-35} dim={.13}/>
        <Char x={510} y={600} s={.78} pose='sitting' direction='right' outfit='casual'/>
        {v%5===0&&<Text x={120} y={125} text='00:14' size={68} color='#e4c17d'/>}
        {v%5===1&&<div style={{position:'absolute',left:260,top:690,width:330,height:160,borderRadius:28,background:'#202631'}}><div style={{position:'absolute',left:80,top:-35,width:160,height:120,borderRadius:26,background:'#29323f',transform:'rotate(8deg)'}}/></div>}
        {v%5===2&&<><div style={{position:'absolute',left:1210,top:440,width:170,height:310,borderRadius:18,background:'#cfd4d6'}}/><div style={{position:'absolute',left:1250,top:510,width:72,height:140,borderRadius:30,background:'#8ec1d0'}}/></>}
        {v%5===3&&<LineThread p={bp} mode='past'/>}
        {v%5===4&&<div style={{position:'absolute',left:0,right:0,bottom:0,height:220,background:'linear-gradient(transparent,rgba(0,0,0,.6))'}}/>}
      </>;
    case 'line_history':
      return <><Bg src='assets/backgrounds/BG_meguro_1ldk_night.svg' p={pp} x={-20} dim={.36}/><Char x={370} y={610} s={.76} pose='phone' direction='right' outfit='casual' phone/><LineThread p={pp} mode='past'/>
        {v%3===1&&<Text x={160} y={160} text='自分のメッセージばかりだった。\nどれも未来形だった。' size={44} w={820}/>}
        {v%3===2&&<Text x={160} y={720} text='彼女の言葉は全部、「今」の僕に向けられていた。' size={39} w={900} color='#e7c6be'/>}
      </>;
    case 'unsent_message':
      return <><Bg src='assets/backgrounds/BG_meguro_1ldk_night.svg' p={pp} dim={.42}/><Char x={350} y={605} s={.78} pose='phone' direction='right' outfit='casual' phone/><LineThread p={bp} mode='unsent'/>
        {v%3===1&&<Text x={150} y={160} text='誰に報告しているんだろう。' size={54}/>}
        {v%3===2&&<div style={{position:'absolute',right:110,top:90,width:540,height:860,border:'3px solid rgba(215,190,130,.25)',borderRadius:62,boxShadow:'0 0 90px rgba(220,190,120,.12)'}}/>}
      </>;
    case 'proof_witness':
      return <><div style={{position:'absolute',inset:0,background:'#090c11'}}/>
        <div style={{position:'absolute',left:0,top:0,bottom:0,width:'50%',overflow:'hidden'}}><Bg src='assets/backgrounds/BG_nakano_shinbashi_1k_night.svg' p={pp} x={-35}/><Char x={330} y={615} s={.70} pose='sitting' direction='right' outfit='casual'/><Woman x={650} y={610} s={.68} pose='sitting' direction='left' outfit='casual'/><Can x={560} y={795}/><Can x={640} y={795} rot={7}/></div>
        <div style={{position:'absolute',right:0,top:0,bottom:0,width:'50%',overflow:'hidden'}}><div style={{position:'absolute',left:-960,top:0,width:1920,height:1080}}><Bg src='assets/backgrounds/BG_meguro_1ldk_night.svg' p={pp} x={-35} dim={.12}/></div><Char x={300} y={610} s={.75} pose='sitting' direction='left' outfit='businessCasual'/></div>
        <div style={{position:'absolute',left:958,top:0,bottom:0,width:4,background:'#d8b36e'}}/>
        {v%4===0&&<Text x={175} y={130} text='26歳' size={52}/>}
        {v%4===1&&<Text x={1270} y={130} text='35歳' size={52}/>}
        {v%4===2&&<>{['家賃78,000','年収400万台','会議で話せない','いつか'].map((t,i)=><Card key={t} x={100} y={180+i*145} w={380} h={95} text={t} alpha={E(bp,.05+i*.12,.22+i*.12)}/>)}</>}
        {v%4===3&&<Text x={600} y={820} text='その全部を知っている「証人」が、美咲だった。' size={44} w={900}/>}
      </>;
    case 'delete_silence':
      return <><Bg src='assets/backgrounds/BG_meguro_1ldk_night.svg' p={pp} x={-15} dim={.26}/><Char x={520} y={610} s={.78} pose='sitting' direction='right' outfit='casual'/>
        {v%5===0&&<LineThread p={bp} mode='unsent'/>}
        {v%5===1&&<div style={{position:'absolute',right:1140,top:80,width:520,height:860,background:'rgba(0,0,0,.78)',borderRadius:60,opacity:E(bp,.25,.62)}}/>}
        {v%5===2&&<Text x={120} y={150} text='七千万円のマンションは、\n防音がよく効いていた。' size={44}/>}
        {v%5===3&&<CityBokeh p={pp}/>}
        {v%5===4&&<><div style={{position:'absolute',left:150,top:100,width:760,height:780,opacity:.32,filter:'sepia(.35)'}}><Img src={staticFile('assets/backgrounds/BG_nakano_shinbashi_1k_night.svg')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div><Text x={930} y={720} text='狭い部屋で、二人で床に座っていた頃。' size={39} w={800}/></>}
      </>;
    case 'next_morning':
      return <><Bg src='assets/backgrounds/BG_shibuya_office_23f_meeting_day.svg' p={pp} x={-25} dim={.02}/><Char x={380} y={590} s={.75} pose='sitting' direction='right'/><Laptop x={690} y={480} scale={1.05}/><Signature p={bp}/></>;
    case 'final_realization':
      return <><div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#0d131c,#030405)'}}/><CityBokeh p={pp}/>
        <div style={{position:'absolute',left:260,top:180,width:1400,height:640,borderRadius:30,background:'rgba(10,13,18,.72)',border:'1px solid rgba(235,225,200,.18)',boxShadow:'0 35px 120px #000b'}}/>
        {v%6===0&&<Text x={420} y={280} text='成功したら、失ったものを取り戻せる。' size={52} w={1100}/>}
        {v%6===1&&<><Text x={420} y={280} text='成功は、過去に戻るための切符ではなかった。' size={48} w={1150} color='#e3bf78'/><div style={{position:'absolute',left:470,top:500,width:980,height:12,background:'#6c747d'}}/><div style={{position:'absolute',left:470+800*E(bp,.1,.8),top:475,width:62,height:62,borderRadius:'50%',background:'#d9b36d'}}/></>}
        {v%6===2&&<>{['年収','家','役職'].map((t,i)=><Card key={t} x={420+i*370} y={350} w={290} h={110} text={t+' ✓'} accent='#7ba088'/>)}</>}
        {v%6===3&&<Text x={380} y={320} text='一番見せたかった人だけが、\nもう僕の人生を見ていなかった。' size={54} w={1200} color='#e8c4bd'/>}
        {v%6===4&&<><div style={{position:'absolute',left:350,top:270,width:430,height:520,opacity:.38}}><Img src={staticFile('assets/backgrounds/BG_nakano_shinbashi_1k_night.svg')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div><div style={{position:'absolute',right:350,top:270,width:430,height:520,opacity:.38}}><Img src={staticFile('assets/backgrounds/BG_meguro_1ldk_night.svg')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div></>}
        {v%6===5&&<Text x={370} y={330} text='何者でもなかった頃の僕を知っている人に、\nまだ隣にいてほしかっただけだった。' size={50} w={1200} color='#f0e5cf'/>}
      </>;
    default:
      return <><div style={{position:'absolute',inset:0,background:'#07090d'}}/><Text x={220} y={440} text={meta.phase} size={54}/></>;
  }
};

export const SceneVisual=({meta,beatProgress,phaseProgress}:{meta:Meta;beatProgress:number;phaseProgress:number})=>
  <AbsoluteFill><Phase meta={meta} bp={beatProgress} pp={phaseProgress}/><Grain/></AbsoluteFill>;
