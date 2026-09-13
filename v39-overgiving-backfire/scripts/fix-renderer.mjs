import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'src/scenes-v39.tsx');
let src=fs.readFileSync(file,'utf8');
const old='<div style={{position:\'absolute\',right:240,top:690,fontSize:40,color:C.green}}>遠回りする権利</div><H>失敗まで除去すると、人生そのものを奪ってしまう。</H></Base>';
const fixed='<div style={{position:\'absolute\',right:240,top:690,fontSize:40,color:C.green}}>遠回りする権利</div></div><H>失敗まで除去すると、人生そのものを奪ってしまう。</H></Base>';
if(src.includes(old)){
  src=src.replace(old,fixed);
  fs.writeFileSync(file,src);
  console.log('Applied V39 S50 closing-div renderer fix');
}else if(src.includes(fixed)){
  console.log('V39 renderer fix already applied');
}else{
  throw new Error('V39 renderer patch target not found');
}
