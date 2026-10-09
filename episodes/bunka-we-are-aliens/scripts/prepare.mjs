import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const out=path.join(root,'src/generated'); fs.mkdirSync(out,{recursive:true});
const names=['プロローグ｜最後の「じゃあね」を覚えているか','第1章｜『我々は宇宙人』とは何か','第2章｜スクリーンの向こうに、あの頃の平成があった','第3章｜風景に心を語らせるということ','第4章｜人生には夏至がある','第5章｜我々は、互いを理解できない宇宙人である','エピローグ｜最後の「じゃあね」'];
const topics=[
 ['問いかけ','明日の放課後','狭い世界','成長による変化','記憶の非対称性','宇宙人という問い'],
 ['作品との出会い','平成の小学校','二人の友情','会社の会議','普通と特別','成長の非対称性'],
 ['記憶の断片','夕暮れの住宅街','ロトスコープ','子供の重心と視線','スクリーンの境界','物語に取り込まれる'],
 ['孤独を描く構図','客観的相関物','失われた食器','晴天と悲劇','風景と人物の一体感','世界の無関心'],
 ['夏至の太陽','大学時代の夜','変わる生活','人生を広げる','冬至から夏至へ','他人の夏至'],
 ['研究の紹介','過去と未来の自己','変化の予測','同じ出来事の二つの記憶','理解できない相手','理解しようとする'],
 ['最後の放課後','人生の分岐','忘れられない景色','次の夏至','それぞれの人生','宇宙人という結語']
];
// Meaning-beat boundaries: six continuous spaces per chapter, not one cut per sentence.
const boundaries=[[4,9,14,18,23,29],[4,10,16,22,28,99],[5,10,15,21,27,99],[7,14,21,29,37,99],[8,16,25,34,44,99],[8,18,29,40,51,99],[8,17,26,34,42,99]];
const short=(s,max)=>{ const arr=[];let v='';for(const c of s){v+=c;if(v.length>=max && /[、。！？…　]/.test(c)){arr.push(v.trim());v='';}else if(v.length>=max+8){arr.push(v.trim());v='';}}if(v.trim())arr.push(v.trim());return arr;};
function splitAudio(p){ const parts=p.split(/(?<=[。！？])/).filter(Boolean); const ret=[];let cur='';for(const x of parts){if(cur.length+x.length>95 && cur){ret.push(cur);cur='';}cur+=x;}if(cur)ret.push(cur);return ret.flatMap(x=> x.length>120?short(x,70):[x]);}
function captions(s){let chunks=short(s,26); const out=[]; for(let i=0;i<chunks.length;i+=2){out.push(chunks.slice(i,i+2).join('\n'));}return out;}
const chapters=[];
for(let ch=0;ch<7;ch++){
 const filename=fs.readdirSync(path.join(root,'script')).filter(x=>x.endsWith('.txt')).sort()[ch];
 const full=fs.readFileSync(path.join(root,'script',filename),'utf8').trim();
 const ps=full.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
 const cues=[];let prev=0;
 for(let p=0;p<ps.length;p++){
  const group=boundaries[ch].findIndex(n=>p<n);
  for(const t of splitAudio(ps[p])){
   const subs=captions(t);
   const estimatedDuration=Math.max(1.45,t.length/7.3+0.12); // overwritten by measured VOICEVOX WAV timings
   cues.push({paragraph:p,group,text:t,duration:Number(estimatedDuration.toFixed(3)),subs});
  }
 }
 const metadata={index:ch,title:names[ch],paragraphCount:ps.length,sceneGroupCount:6,topics:topics[ch],cues};
 fs.writeFileSync(path.join(out,`chapter-${ch}.json`),JSON.stringify(metadata,null,2));
 chapters.push({index:ch,title:names[ch],file:filename,paragraphs:ps.length,audioBeats:cues.length,semanticScenes:6,estimatedSeconds:Number(cues.reduce((a,b)=>a+b.duration,0).toFixed(1))});
}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(chapters,null,2));
const report={chapters,scenes:42,subtitlesTotal:chapters.reduce((a,ch)=>a+JSON.parse(fs.readFileSync(path.join(out,`chapter-${ch.index}.json`))).cues.reduce((b,c)=>b+c.subs.length,0),0),estimatedSeconds:chapters.reduce((a,c)=>a+c.estimatedSeconds,0),measured:false};
fs.mkdirSync(path.join(root,'qa'),{recursive:true});fs.writeFileSync(path.join(root,'qa/prepare-report.json'),JSON.stringify(report,null,2));
console.log(report);
