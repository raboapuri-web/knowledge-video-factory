import '@fontsource/noto-sans-jp/400.css';
import '@fontsource/noto-sans-jp/700.css';
import {Circle, Line, Node, Rect, Txt, type View2D} from '@motion-canvas/2d';
import {all, waitFor, type ThreadGenerator} from '@motion-canvas/core';

interface Cue{text:string;display:string;start:number;end:number}
interface MeaningScene{id:string;chapter:string;motif:string;title:string;cues:Cue[];duration:number}
const P={bg:'#08131A',bg2:'#11252D',paper:'#EEE9DF',muted:'#81949F',red:'#C74F4B',gold:'#C7A35F',cyan:'#75A4AE',teal:'#6E978A',blue:'#526F86',line:'#30444E',shadow:'#172830',green:'#6C886F',brown:'#6E5B4C'};
const font='Noto Sans JP, Noto Sans CJK JP, sans-serif';
const t=(s:string,x:number,y:number,size=38,fill=P.paper,weight=600)=>new Txt({text:s,x,y,fontFamily:font,fontSize:size,fontWeight:weight,fill});
const panel=(x:number,y:number,w:number,h:number,fill=P.shadow)=>new Rect({x,y,width:w,height:h,fill,radius:14,stroke:P.line,lineWidth:2});
const rule=(x1:number,y1:number,x2:number,y2:number,color=P.line,width=3)=>new Line({points:[[x1,y1],[x2,y2]],stroke:color,lineWidth:width});
const dot=(x:number,y:number,r:number,color=P.paper)=>new Circle({x,y,width:2*r,height:2*r,fill:color});
function person(parent:Node,x:number,y:number,scale=1,color=P.paper){
 const n=new Node({x,y,scale});n.add(dot(0,-38,22,color));n.add(new Rect({x:0,y:24,width:40,height:78,fill:color,radius:13}));n.add(rule(-12,62,-23,112,color,11));n.add(rule(12,62,23,112,color,11));parent.add(n);return n;
}
function building(parent:Node,x:number,y:number,w:number,h:number,label=''){
 parent.add(new Rect({x,y,width:w,height:h,fill:'#18303A',stroke:P.line,lineWidth:3,radius:7}));
 for(let i=-2;i<=2;i++)for(let j=-1;j<=1;j++)parent.add(new Rect({x:x+i*w*.16,y:y+j*h*.22,width:24,height:34,fill:'#39525D'}));
 if(label)parent.add(t(label,x,y+h*.62,28,P.gold,700));
}
function store(parent:Node,x:number,y:number,label:string,color=P.blue){
 parent.add(new Rect({x,y,width:260,height:205,fill:color,radius:10,stroke:P.line,lineWidth:3}));
 parent.add(new Rect({x,y:-58+y,width:202,height:48,fill:P.paper,radius:5}));
 parent.add(t(label,x,y-58,25,P.bg,700));parent.add(new Rect({x,y:34+y,width:118,height:78,fill:'#213A44',radius:4}));
}
function money(parent:Node,x:number,y:number,label='¥'){
 parent.add(new Rect({x,y,width:132,height:62,fill:'#C9D7B8',radius:8}));parent.add(dot(x,y,17,P.green));parent.add(t(label,x,y+3,21,P.bg,800));
}
function doc(parent:Node,x:number,y:number,w:number,h:number,title:string){
 parent.add(new Rect({x,y,width:w,height:h,fill:'#DDDCD3',radius:8,stroke:'#8C9699',lineWidth:2}));parent.add(t(title,x,y-h*.33,26,P.bg,700));
 for(let i=0;i<5;i++)parent.add(rule(x-w*.35,y-h*.13+i*25,x+w*(i===4?.12:.34),y-h*.13+i*25,'#92999B',4));
}
function arrow(parent:Node,x1:number,y1:number,x2:number,y2:number,color=P.gold){parent.add(new Line({points:[[x1,y1],[x2,y2]],stroke:color,lineWidth:6,endArrow:true,arrowSize:14}));}
function labelBox(parent:Node,s:string,x:number,y:number,w=240,color=P.cyan){parent.add(panel(x,y,w,72,P.bg2));parent.add(t(s,x,y+2,28,color,700));}
function network(parent:Node,labels:string[],center=[0,0] as [number,number]){
 const [cx,cy]=center;labels.forEach((s,i)=>{const a=-Math.PI/2+i*Math.PI*2/labels.length,x=cx+Math.cos(a)*430,y=cy+Math.sin(a)*235;parent.add(dot(x,y,47,i%2?P.teal:P.blue));parent.add(t(s,x,y+78,25,P.paper,700));parent.add(rule(cx,cy,x,y,P.line,4));});parent.add(dot(cx,cy,74,P.red));
}
const hash=(s:string)=>[...s].reduce((a,c)=>((a*31)^c.charCodeAt(0))>>>0,119);
function generateVisuals(root:Node,motif:string,scene:MeaningScene):Node[]{
 const h=hash(motif);
 const l=Array.from({length:4},(_,i)=>new Node({opacity:0,x:((h>>(i*3))%3-1)*(36+7*i),y:((h>>(i*2+1))%3-1)*(22+5*i)}));
 l.forEach(x=>root.add(x));const[a,b,c,d]=l;
 switch(motif){
  case'dawn_street':store(a,-460,65,'コンビニ');a.add(panel(390,105,420,115,'#23353B'));a.add(t('バス停',390,105,30,P.paper));person(b,360,120,.85,P.paper);b.add(new Rect({x:355,y:220,width:250,height:80,fill:'#6B6258',radius:22}));c.add(new Rect({x:-460,y:300,width:520,height:16,fill:P.cyan}));d.add(t('清掃・巡回・救急へ分裂',0,-265,44,P.red,800));break;
  case'cost_scatter':network(a,['公園','警察','病院','店舗']);b.add(t('同じ問題',0,-14,38,P.paper));c.add(t('別々の請求書',0,255,47,P.gold,800));d.add(new Rect({x:0,y:315,width:1120,height:8,fill:P.red}));break;
  case'city_invoice':['駅=寝室','公園=居間','店=トイレ','救急=診療所'].forEach((s,i)=>labelBox(a,s,-510+i*340,-95+(i%2)*175,280,i===3?P.red:P.cyan));b.add(t('住宅機能が街へ流出',0,-265,47,P.gold));arrow(c,-480,230,480,230,P.red);d.add(t('コストは消えない',0,295,46,P.paper));break;
  case'japan_count':a.add(t('2003',-430,-95,53,P.paper));a.add(t('約25,000人',-430,25,72,P.red,800));b.add(t('2026',430,-95,53,P.paper));b.add(t('2,481人',430,25,72,P.cyan,800));c.add(new Rect({x:0,y:225,width:1240,height:8,fill:P.gold}));d.add(t('目視調査の路上生活者',0,285,33,P.muted));break;
  case'thesis_city':network(a,['住宅','衛生','医療','安全','商業','行政']);b.add(t('「人」ではなく',0,-255,48,P.paper));c.add(t('都市の処理方法を見る',0,250,52,P.gold,800));d.add(new Circle({x:0,y:0,width:190,height:190,stroke:P.red,lineWidth:12}));break;

  case'housing_box':a.add(new Rect({x:0,y:20,width:880,height:500,fill:'#172E36',stroke:P.gold,lineWidth:5,radius:18}));['トイレ','水道','風呂','冷蔵庫','保管','私的空間'].forEach((s,i)=>labelBox(b,s,-290+(i%3)*290,-115+Math.floor(i/3)*190,220,i===5?P.gold:P.cyan));c.add(t('住宅 = 都市機能の収納箱',0,278,41,P.paper));d.add(t('失うと6機能を同時に失う',0,-275,43,P.red));break;
  case'public_spill':building(a,-500,30,330,430,'住宅');['駅','公園','店舗','歩道'].forEach((s,i)=>labelBox(b,s,90+(i%2)*360,-120+Math.floor(i/2)*190,250));for(let i=0;i<4;i++)arrow(c,-300,20,40+(i%2)*360,-120+Math.floor(i/2)*190,P.red);d.add(t('私的機能 → 公共空間',0,286,47,P.gold));break;
  case'sanitation_access':['トイレ','手洗い','シャワー','洗濯','ごみ処理'].forEach((s,i)=>labelBox(a,s,-520+i*260,-90,215,i===4?P.gold:P.cyan));b.add(new Rect({x:0,y:110,width:1250,height:180,fill:'#1D343C',radius:18}));c.add(t('設備があると問題の一部は消える',0,108,43,P.paper));d.add(t('人の属性 ≠ 衛生環境',0,278,48,P.red));break;
  case'externality':person(a,-520,60,1.1,P.paper);['清掃','衛生','保管','医療'].forEach((s,i)=>labelBox(b,s,-230+i*250,-50+(i%2)*150,210,i===3?P.red:P.cyan));for(let i=0;i<4;i++)arrow(c,-390,60,-300+i*250,-50+(i%2)*150,P.gold);d.add(t('意図ではなく構造で発生',0,300,40,P.paper));break;
  case'cost_displaced':a.add(t('住宅・支援',-430,-125,42,P.cyan));money(a,-430,20,'予算');['店舗人件費','清掃費','警察費','救急医療'].forEach((s,i)=>labelBox(b,s,120+(i%2)*360,-110+Math.floor(i/2)*175,280,i===3?P.red:P.paper));arrow(c,-270,20,40,20,P.gold);d.add(t('支払い先が変わっただけ',0,278,45,P.gold));break;

  case'skidrow_room':a.add(t('20世紀前半',0,-272,42,P.gold));for(let i=0;i<4;i++)building(a,-510+i*340,65,230,300,'簡易宿泊');person(b,-390,190,.62);person(b,-50,190,.62);c.add(t('小さくても扉がある',0,274,42,P.paper));d.add(new Rect({x:470,y:72,width:180,height:330,stroke:P.gold,lineWidth:7}));break;
  case'redevelopment':for(let i=0;i<4;i++)building(a,-510+i*340,70,230,300,'低家賃');b.add(new Rect({x:0,y:70,width:1370,height:420,fill:'#0B1720',opacity:.72}));for(let i=0;i<3;i++)building(c,-420+i*420,60,300,480,i===1?'オフィス':'高価格住宅');d.add(t('人は消えず、住める場所が減る',0,312,40,P.red));break;
  case'displacement_map':['公園','駅','河川敷','隣の地区'].forEach((s,i)=>{const x=-520+i*350;a.add(dot(x,-30,58,i===0?P.red:P.blue));a.add(t(s,x,78,29,P.paper));if(i<3)arrow(b,x+75,-30,x+275,-30,P.gold);});c.add(t('座標だけ移動',0,210,48,P.red));d.add(t('都市全体のコストは残る',0,-265,43,P.paper));break;
  case'japan_history':a.add(rule(-650,80,650,80,P.gold,8));['1990s','2002','2003','2026'].forEach((s,i)=>{const x=-540+i*360;b.add(dot(x,80,22,i===3?P.cyan:P.paper));b.add(t(s,x,-8,42,P.paper));});c.add(t('自立支援法 → 支援制度',0,220,43,P.gold));d.add(t('可視的路上生活は大幅減',0,-248,45,P.red));break;
  case'policy_nature':a.add(t('約25,000',-430,0,72,P.red,800));b.add(t('2,481',430,0,72,P.cyan,800));arrow(c,-250,0,240,0,P.gold);d.add(t('自然現象ではなく、制度で変わる',0,255,45,P.paper));break;

  case'night_alley':a.add(new Rect({x:0,y:70,width:1320,height:460,fill:'#0C1821'}));person(a,430,120,.82,P.paper);person(a,560,120,.82,P.paper);person(b,-390,175,.72,P.muted);b.add(new Rect({x:-390,y:275,width:290,height:72,fill:'#685E52',radius:18}));c.add(t('「治安が悪そうだ」',0,-250,53,P.gold));d.add(t('実際の犯罪率とは別の主観',0,290,37,P.paper));break;
  case'perception_loop':['不安','回避','人通り減','さらに不安'].forEach((s,i)=>{const a0=-Math.PI/2+i*Math.PI/2,x=Math.cos(a0)*380,y=Math.sin(a0)*215;a.add(dot(x,y,58,i===0?P.red:P.blue));a.add(t(s,x,y+87,30,P.paper));});for(let i=0;i<4;i++){const a1=-Math.PI/2+i*Math.PI/2,a2=-Math.PI/2+((i+1)%4)*Math.PI/2;arrow(b,Math.cos(a1)*310,Math.sin(a1)*170,Math.cos(a2)*310,Math.sin(a2)*170,P.gold);}c.add(t('公共空間の安心感',0,0,38,P.paper));d.add(t('商業活動にも影響',0,290,43,P.red));break;
  case'victimization':a.add(t('暴力犯罪の被害リスク',0,-260,45,P.gold));person(b,-430,65,1.1,P.paper);person(b,430,65,1.1,P.cyan);c.add(t('一般人口',-430,230,31,P.paper));c.add(t('ホームレス経験',430,230,31,P.cyan));d.add(new Rect({x:430,y:-30,width:170,height:300,fill:P.red,opacity:.65}));break;
  case'housing_defense':building(a,-430,65,420,470,'住宅');a.add(new Rect({x:-430,y:70,width:120,height:220,stroke:P.gold,lineWidth:8}));person(b,430,70,1.15,P.paper);c.add(new Circle({x:-430,y:65,width:560,height:560,stroke:P.teal,lineWidth:8,opacity:.45}));d.add(t('住宅 = 防犯インフラ',0,300,47,P.gold));break;
  case'police_burden':['盗難','暴力','精神危機','住民トラブル'].forEach((s,i)=>labelBox(a,s,-480+i*320,-75+(i%2)*155,250,i===2?P.red:P.paper));person(b,0,165,1.2,P.blue);c.add(t('警察が福祉接続まで担う',0,286,42,P.gold));d.add(t('住宅の欠如 → 危機対応',0,-270,42,P.red));break;

  case'wound':person(a,-420,55,1.15,P.paper);a.add(dot(-390,160,16,P.red));['靴ずれ','悪化','歩行困難','救急'].forEach((s,i)=>{const x=-130+i*290;b.add(dot(x,40,45,i===3?P.red:P.cyan));b.add(t(s,x,128,28,P.paper));if(i<3)arrow(c,x+60,40,x+230,40,P.gold);});d.add(t('小さな傷 → 高コスト医療',0,290,43,P.red));break;
  case'exposure':['暑さ','寒さ','雨','睡眠不足','暴力','衛生不足'].forEach((s,i)=>labelBox(a,s,-430+(i%3)*430,-120+Math.floor(i/3)*190,310,i===4?P.red:P.cyan));b.add(t('毎日さらされる',0,260,43,P.paper));c.add(new Circle({x:0,y:0,width:990,height:520,stroke:P.gold,lineWidth:6,opacity:.35}));d.add(t('住宅は環境から切り離す基盤',0,-285,42,P.gold));break;
  case'emergency':['診療所','救急外来','入院','警察介入'].forEach((s,i)=>{const x=-520+i*350;a.add(dot(x,-20,55,i>1?P.red:P.cyan));a.add(t(s,x,88,29,P.paper));if(i<3)arrow(b,x+70,-20,x+280,-20,P.gold);});c.add(t('治療が遅れるほど入口が高コスト化',0,240,39,P.red));d.add(t('予防可能な危機',0,-250,47,P.gold));break;
  case'hospital_cycle':['救急','入院','退院','路上'].forEach((s,i)=>{const a0=-Math.PI/2+i*Math.PI/2,x=Math.cos(a0)*360,y=Math.sin(a0)*210;a.add(dot(x,y,55,i===3?P.red:P.blue));a.add(t(s,x,y+85,30,P.paper));});for(let i=0;i<4;i++){const a1=-Math.PI/2+i*Math.PI/2,a2=-Math.PI/2+((i+1)%4)*Math.PI/2;arrow(b,Math.cos(a1)*290,Math.sin(a1)*170,Math.cos(a2)*290,Math.sin(a2)*170,P.gold);}c.add(t('再発の循環',0,5,40,P.red));d.add(t('病院と救急の時間も消費',0,300,39,P.paper));break;
  case'cost_shift_health':['住宅','救急車','病院','警察','シェルター','清掃'].forEach((s,i)=>labelBox(a,s,-430+(i%3)*430,-115+Math.floor(i/3)*185,310,i===0?P.cyan:P.red));money(b,-430,270,'住宅');money(c,430,270,'危機');d.add(t('どちらも費用はかかる',0,-275,45,P.gold));break;

  case'plaza':a.add(new Rect({x:0,y:115,width:1400,height:390,fill:'#162B34',radius:12}));for(let i=0;i<7;i++)person(b,-540+i*180,165,.55,i%2?P.paper:P.cyan);store(c,430,-70,'カフェ',P.brown);d.add(t('公共空間 = 経済インフラ',0,-258,48,P.gold));break;
  case'downtown_magnet':['駅','バス','図書館','公園','病院','福祉','トイレ'].forEach((s,i)=>{const a0=-Math.PI/2+i*Math.PI*2/7,x=Math.cos(a0)*440,y=Math.sin(a0)*225;a.add(dot(x,y,48,i%2?P.teal:P.blue));a.add(t(s,x,y+75,25,P.paper));});person(b,0,25,1.05,P.paper);c.add(t('サービスが中心部へ集積',0,300,39,P.gold));d.add(t('人も中心へ集まる',0,-270,44,P.red));break;
  case'management_cost':['店員清掃','民間警備','自治体巡回','駅員対応','図書館対応'].forEach((s,i)=>labelBox(a,s,-500+i*250,-95+(i%2)*180,220,i===1?P.red:P.paper));b.add(t('別々の組織へ薄く広がる',0,245,39,P.gold));c.add(new Rect({x:0,y:302,width:1280,height:8,fill:P.red}));d.add(t('管理コスト',0,-270,53,P.red));break;
  case'worker_time':['品出し','交通整理','通常診療'].forEach((s,i)=>labelBox(a,s,-430+i*430,-120,300,P.cyan));['清掃','福祉対応','危機対応'].forEach((s,i)=>labelBox(b,s,-430+i*430,120,300,P.red));for(let i=0;i<3;i++)arrow(c,-430+i*430,-70,-430+i*430,70,P.gold);d.add(t('失われるのは「時間」',0,300,45,P.paper));break;
  case'urban_productivity':a.add(t('小さな摩擦',0,-260,48,P.gold));['清掃','巡回','警備','救急','対応'].forEach((s,i)=>{const x=-500+i*250;b.add(dot(x,20,48,i%2?P.red:P.blue));b.add(t(s,x,105,27,P.paper));});c.add(new Rect({x:0,y:230,width:1300,height:58,fill:'#233B43',radius:12}));d.add(t('都市全体の効率を少しずつ削る',0,230,40,P.red));break;

  case'key_room':a.add(new Rect({x:0,y:25,width:900,height:520,fill:'#172E36',stroke:P.gold,lineWidth:5,radius:18}));b.add(new Rect({x:-420,y:-190,width:105,height:34,fill:P.gold,radius:17}));b.add(dot(-470,-190,52,P.gold));['ベッド','冷蔵庫','トイレ','シャワー'].forEach((s,i)=>labelBox(c,s,-280+(i%2)*560,-90+Math.floor(i/2)*180,300,i===2?P.cyan:P.paper));d.add(t('機能が公共空間から戻る',0,300,42,P.gold));break;
  case'housingfirst_order':['住宅','精神医療','依存症治療','就労・生活支援'].forEach((s,i)=>{const x=-530+i*350;a.add(dot(x,-20,55,i===0?P.gold:P.blue));a.add(t(s,x,92,27,P.paper));if(i<3)arrow(b,x+70,-20,x+280,-20,P.gold);});c.add(t('住宅をゴールではなく土台にする',0,245,41,P.paper));d.add(t('順番を変える',0,-260,50,P.red));break;
  case'evidence_housing':a.add(t('研究で一貫',-420,-115,38,P.gold));a.add(t('住宅安定',-420,20,65,P.cyan,800));b.add(t('研究でばらつく',430,-115,38,P.gold));b.add(t('健康・総費用',430,20,55,P.red,800));c.add(rule(-620,230,620,230,P.line,6));d.add(t('効果を分けて考える',0,292,40,P.paper));break;
  case'cost_tradeoff':money(a,-430,-20,'住宅');a.add(t('計画的支出',-430,105,34,P.cyan));['救急','警察','清掃','シェルター'].forEach((s,i)=>labelBox(b,s,130+(i%2)*340,-100+Math.floor(i/2)*170,260,P.red));c.add(t('断片的支出',470,220,34,P.red));d.add(t('「払う / 払わない」ではない',0,-275,44,P.gold));break;
  case'function_restore':['トイレ','睡眠','荷物','診療','福祉'].forEach((s,i)=>labelBox(a,s,-500+i*250,-85+(i%2)*160,220,i<3?P.cyan:P.gold));building(b,0,175,370,250,'固定住所');for(let i=0;i<5;i++)arrow(c,-500+i*250,-20+(i%2)*160,-80,175,P.gold);d.add(t('都市機能を本来の場所へ戻す',0,-275,43,P.paper));break;

  case'morning_return':store(a,-450,70,'コンビニ');b.add(t('清掃ではなく品出し',-450,260,35,P.cyan));building(c,420,70,430,420,'小さな部屋');person(c,420,120,.8,P.paper);d.add(t('同じ朝、街の使われ方が変わる',0,-270,44,P.gold));break;
  case'connected_budget':network(a,['救急','警察','清掃','公園','シェルター','商店']);b.add(t('同じ自治体予算',0,2,35,P.paper));c.add(t('支援を削っても請求書は残る',0,280,42,P.red));d.add(new Circle({x:0,y:0,width:210,height:210,stroke:P.gold,lineWidth:9}));break;
  case'floor_hole':a.add(new Rect({x:0,y:220,width:1450,height:48,fill:'#4A4A45'}));b.add(new Circle({x:-260,y:225,width:250,height:90,fill:'#071017'}));person(c,-390,80,.8,P.paper);person(c,320,80,.8,P.cyan);store(c,590,45,'商店',P.brown);d.add(t('街の底の穴を塞ぐ',0,-265,52,P.gold,800));break;
  default:a.add(panel(0,0,1160,520));b.add(t(scene.title,0,-170,46,P.paper));c.add(rule(-560,210,560,210,P.gold,6));d.add(t('原因 → 外部化 → 負担 → 帰結',0,250,40,P.red));
 }
 return l;
}
function* subtitleFlow(cues:Cue[],label:Txt,duration:number):ThreadGenerator{
 let cursor=0;for(const cue of cues){const w=Math.max(0,cue.start-cursor);if(w>0)yield* waitFor(w);label.text(cue.display);cursor=cue.start;}if(duration>cursor)yield* waitFor(duration-cursor);label.text('');
}
function* visualFlow(layers:Node[],duration:number,motif:string):ThreadGenerator{
 const h=hash(motif),starts=[.025,.20+((h%5)*.008),.41+(((h>>3)%5)*.008),.63+(((h>>6)%5)*.009)];let cursor=0;
 for(let i=0;i<layers.length;i++){const at=duration*starts[i];yield* waitFor(Math.max(0,at-cursor));cursor=at;const anim=Math.min(.9+i*.08,duration*.11);yield* all(layers[i].opacity(1,anim),layers[i].x(0,anim),layers[i].y(0,anim));cursor+=anim;if(i===2)layers[0].opacity(.78);}
 const em=duration*.82;if(em>cursor){yield* waitFor(em-cursor);cursor=em;}yield* all(layers[0].opacity(.58,.45),layers[3].scale(1.045,.45));cursor+=.45;
 const end=duration*.92;if(end>cursor){yield* waitFor(end-cursor);cursor=end;}yield* all(layers[1].opacity(.76,.38),layers[2].opacity(.9,.38));cursor+=.38;yield* waitFor(Math.max(0,duration-cursor));
}
export function* playMeaningScene(view:View2D,scene:MeaningScene):ThreadGenerator{
 view.fill(P.bg);const contentLayer=new Node({});const headingLayer=new Node({});const subtitleBacking=new Node({});const subtitleTextLayer=new Node({});
 view.add(contentLayer);view.add(headingLayer);view.add(subtitleBacking);view.add(subtitleTextLayer);
 contentLayer.add(new Rect({width:1920,height:1080,fill:P.bg}));contentLayer.add(new Rect({x:0,y:-380,width:1810,height:2,fill:P.line}));
 const visuals=generateVisuals(contentLayer,scene.motif,scene);
 headingLayer.add(t(scene.title,-18,-446,52,P.paper,700));headingLayer.add(t(scene.chapter==='prologue'?'PROLOGUE':scene.chapter==='epilogue'?'EPILOGUE':scene.chapter.toUpperCase(),-802,-509,25,P.gold,700));headingLayer.add(t(scene.id,818,-508,21,P.muted));
 subtitleBacking.add(new Rect({x:0,y:460,width:1920,height:160,fill:'#02060C',opacity:.91}));const subtitleTxt=t('',0,458,42,P.paper,650);subtitleTxt.lineHeight(60);subtitleTextLayer.add(subtitleTxt);
 yield* all(visualFlow(visuals,scene.duration,scene.motif),subtitleFlow(scene.cues,subtitleTxt,scene.duration));
}