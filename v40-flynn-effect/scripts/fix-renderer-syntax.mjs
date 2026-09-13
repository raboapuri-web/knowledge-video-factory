import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'src/scenes-v40.tsx');
let source=fs.readFileSync(file,'utf8');

const fixes=[
  {
    anchor:'case 31:',
    from:'size={25}/>) }<H>都市そのものが、毎日少しずつ抽象思考を練習させている。</H>',
    to:'size={25}/>) }</div><H>都市そのものが、毎日少しずつ抽象思考を練習させている。</H>'
  },
  {
    anchor:'case 41:',
    from:'<Graph x={680} y={270} w={560} h={270} points={[3,4,6,10,16,24]} color={C.cyan}/><H>小さな得意が、選ぶ環境を変え、十年後の大きな差へ育つ。</H>',
    to:'<Graph x={680} y={270} w={560} h={270} points={[3,4,6,10,16,24]} color={C.cyan}/></div><H>小さな得意が、選ぶ環境を変え、十年後の大きな差へ育つ。</H>'
  },
  {
    anchor:'case 57:',
    from:'color={[C.cyan,C.gold,C.rose][j]}/>) }<H>未来の知能テストは、「覚えている量」ではなくAIの前提を疑う力を測るかもしれない。</H>',
    to:'color={[C.cyan,C.gold,C.rose][j]}/>) }</div><H>未来の知能テストは、「覚えている量」ではなくAIの前提を疑う力を測るかもしれない。</H>'
  }
];

let changed=0;
for(const fix of fixes){
  if(source.includes(fix.to)) continue;
  if(!source.includes(fix.from)) throw new Error(`V40 syntax hotfix target missing: ${fix.anchor}`);
  source=source.replace(fix.from,fix.to);
  changed++;
}
fs.writeFileSync(file,source);
console.log(`V40 renderer syntax hotfix applied: ${changed} change(s)`);
