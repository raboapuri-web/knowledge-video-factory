import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const plan=JSON.parse(fs.readFileSync(path.join(root,'scene-plans/full.json'),'utf8'));
const lines=fs.readFileSync(path.join(root,'src/narration.txt'),'utf8').trim().split('\n');
const b=[0,8,21,32,45,59,63], prefixes=['P','C1','C2','C3','C4','E'];
const groups=prefixes.map(p=>plan.scenes.filter(s=>s[0].startsWith(p)));
const beats=[];
for(let c=0;c<6;c++){
 const n=b[c+1]-b[c], m=groups[c].length;
 for(let j=0;j<m;j++){
  const from=b[c]+Math.round(j*n/m),to=b[c]+Math.round((j+1)*n/m);
  const [id,location,asset,action]=groups[c][j];
  beats.push({id,narration:lines.slice(from,to).join(''),location,asset,action,chapter:prefixes[c]});
 }
}
if(beats.length!==plan.scenes.length||beats.some(b=>!b.narration))throw Error('Scene narration mismatch');
fs.writeFileSync(path.join(root,'src/script-data.json'),JSON.stringify({beats},null,2)+'\n');
const src=path.resolve(root,'../shared/asset-library/背景');
const dst=path.join(root,'public/assets');fs.mkdirSync(dst,{recursive:true});
for(const name of new Set(beats.map(b=>b.asset).filter(x=>x.endsWith('.png'))))fs.copyFileSync(path.join(src,name),path.join(dst,name));
console.log(beats.length+' scenes; '+lines.length+' narration blocks; '+new Set(beats.map(b=>b.asset)).size+' backgrounds');
