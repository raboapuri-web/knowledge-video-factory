import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'src/generated');
fs.mkdirSync(out,{recursive:true});
const names=[
  'プロローグ｜赤い月は、照れているのか。それとも怒っているのか。',
  '第1章｜二人はなぜ、横並びから上下の関係になったのか？',
  '第2章｜翼はなぜ、親友を裏切ったのか？',
  '第3章｜赤い月はなぜ、照れていると同時に怒っているのか？',
  '第4章｜恐竜の名前を忘れたことは、救いなのか？',
  '第5章｜最後の「じゃあね」は、和解なのか。それとも決別なのか？',
  'エピローグ｜我々は、互いを理解できない宇宙人である。'
];
const anchors=[
 ['あなたは','しかし、その何千回','2026年公開','物語の冒頭','同じ時間を過ごした','ではまず'],
 ['映画の冒頭','やがて二人は相棒','興味深いことに','この逆転について','その象徴が、水槽事件','そして、この事件には水槽'],
 ['我々は、物語','まず、二人の関係','ただ、翼の問題','発達心理学の研究','翼もまた、水槽事件','そして、ここで我々は'],
 ['赤い月は','本作では','ただし、ここには','記憶の研究において','そして、赤い月の問いには','赤い月は、一つの現象'],
 ['かつて、きょうたろう','しかし、大人になったきょうたろう','ここでもう一つ','それまで、きょうたろう','我々は普段','さらに印象的なのは'],
 ['大人になった翼','そして映画の終盤','ここで第1章の構図','ただし、ここからが重要','ここで、赦しと和解','ここで、作品のタイトル'],
 ['シーソーは','しかし、少年たちは','ここで、もう一度','我々は他人の人生','かつて二人の少年','さて、あなたに一つ']
];
const beats=[
 ['帰り道の温度','最後の別れ','記憶の傷跡','赤い月の問い','二つの視点','物語を解剖する'],
 ['橋の上下と手裏剣','釣り合うシーソーとトンネル','教室内の人気の反転','階段での位置の反転','見下ろす翼と水槽','観察と理解の断絶'],
 ['壊された傘と家庭の代償','ランドセルと誤解された手裏剣','偽の手紙・割れる水槽','道徳を知る子の判断','沈黙の一瞬と長い未来','無邪気さと残酷さの共存'],
 ['二色の赤い月','同じ行動の別の見え方','事実と解釈を分離','再構成される長年の記憶','愛情と怒りの共存','幸福だったからこそ傷になる'],
 ['恐竜に夢中な少年','夜の公園の忘却','捨てることで生まれる空間','バタ原との再会','傷つけられた側から救った側へ','別の人の記憶に生きる相棒'],
 ['別々の大人の生活','高速道路で偶然の並走','上下の記憶から再び水平へ','水平でも分かれる道路','赦し・和解・信頼は別物','我々は互いに宇宙人である'],
 ['少年時代の均衡','変化し続ける二つの人生','月に同居する正反対の感情','理解の限界と他者への敬意','同じ高さで別々の道へ','最後の「じゃあね」']
];
const short=(s,max)=>{
 const arr=[];let v='';
 for(const c of s){v+=c;if((v.length>=max&&/[、。！？…　]/.test(c))||v.length>=max+7){arr.push(v.trim());v='';}}
 if(v.trim())arr.push(v.trim());
 return arr;
};
function splitAudio(p){
 const sentences=p.split(/(?<=[。！？])/).filter(Boolean);let cur='';const arr=[];
 for(const s of sentences){
  if(cur&&cur.length+s.length>94){arr.push(cur);cur='';}
  cur+=s;
 }
 if(cur)arr.push(cur);
 return arr.flatMap(s=>s.length>115?short(s,66):[s]);
}
const caption=s=>{
 const units=short(s,25),out=[];
 for(let i=0;i<units.length;i+=2)out.push(units.slice(i,i+2).join('\n'));
 return out;
};
const chapters=[];
for(let ch=0;ch<7;ch++){
 const filename=fs.readdirSync(path.join(root,'script')).filter(x=>x.endsWith('.txt')).sort()[ch];
 const full=fs.readFileSync(path.join(root,'script',filename),'utf8').trim();
 const paragraphs=full.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
 const starts=anchors[ch].map((anchor,i)=>paragraphs.findIndex((p,k)=>k>(i?0:-1)&&p.startsWith(anchor)));
 if(starts.some(n=>n<0)||starts.some((n,i)=>i&&n<=starts[i-1]))throw Error('Broken semantic scene anchors chapter '+ch+': '+starts);
 const cues=[];
 for(let i=0;i<paragraphs.length;i++){
  const group=starts.reduce((a,start,j)=>i>=start?j:a,0);
  for(const text of splitAudio(paragraphs[i])){
   const subs=caption(text);
   if(!subs.length)continue;
   const duration=Math.max(1.5,text.length/7.3+0.17);
   cues.push({paragraph:i,group,text,duration:Number(duration.toFixed(4)),subs});
  }
 }
 const metadata={index:ch,title:names[ch],sceneTitles:beats[ch],sceneStarts:starts,paragraphCount:paragraphs.length,sceneGroupCount:6,introSeconds:ch===0?0:2.5,cues};
 fs.writeFileSync(path.join(out,`chapter-${ch}.json`),JSON.stringify(metadata,null,2));
 chapters.push({index:ch,title:names[ch],file:filename,paragraphs:paragraphs.length,audioBeats:cues.length,semanticScenes:6,estimatedSeconds:Number((cues.reduce((sum,c)=>sum+c.duration,0)+(ch?2.5:0)).toFixed(1))});
}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(chapters,null,2));
const report={chapters,meaningScenes:42,estimatedSeconds:chapters.reduce((a,c)=>a+c.estimatedSeconds,0),measured:false,source:'user-approved spoiler analysis script'};
fs.mkdirSync(path.join(root,'qa'),{recursive:true});
fs.writeFileSync(path.join(root,'qa/prepare-report.json'),JSON.stringify(report,null,2));
console.log(report);